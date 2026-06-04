import cv2
import time
import requests
import datetime
from flask import Flask, Response
from ultralytics import YOLO

import os
import argparse

# ==========================================
# PARSER ARGUMEN & KONFIGURASI DINAMIS
# ==========================================
parser = argparse.ArgumentParser(description='YOLOv8 AI Edge Camera Node')
parser.add_argument('--room-id', type=str, default=os.getenv('ROOM_ID', 'bld_sipil_001_f7_lpr1'), help='ID Ruangan di Firebase (contoh: bld_sipil_001_f7_lpr1)')
parser.add_argument('--node-id', type=str, default=os.getenv('NODE_ID', 'ESP32-80F3DA62F3A8'), help='MAC Address / ID ESP32 (contoh: ESP32-80F3DA62F3A8)')
parser.add_argument('--port', type=int, default=5000, help='Port Flask UI (default: 5000)')
args = parser.parse_args()

# ==========================================
# KONFIGURASI FIREBASE & AI LOGIC
# ==========================================
FIREBASE_URL = "https://iot-kelompok-6-59aac-default-rtdb.asia-southeast1.firebasedatabase.app/"
NODE_ID = args.node_id
ROOM_ID = args.room_id

print(f"🚀 Inisialisasi Kamera AI untuk Ruangan: {ROOM_ID} (Node Hardware: {NODE_ID})")

last_person_count = -1
empty_room_start_time = None
GRACE_PERIOD_SECONDS = 10 # Dipercepat jadi 10 detik untuk ujicoba (aslinya 120 detik)

app = Flask(__name__)

# Load model YOLOv8 (versi nano)
print("Memuat model YOLO...")
model = YOLO('yolov8n.pt') 

# Buka webcam (0 untuk kamera bawaan)
STREAM_URL = 0 
cap = cv2.VideoCapture(STREAM_URL)

def is_room_auto():
    try:
        res = requests.get(f"{FIREBASE_URL}room_automation/{ROOM_ID}.json", timeout=2)
        if res.status_code == 200:
            return res.json() == True
    except Exception as e:
        print(f"❌ Error cek mode automation: {e}")
    return False # Default aman, jika gagal jangan diotak-atik

def generate_frames():
    global last_person_count, empty_room_start_time
    while True:
        success, frame = cap.read()
        if not success:
            continue
            
        # ==========================================
        # PROSES DETEKSI YOLOv8
        # ==========================================
        # Lakukan prediksi khusus untuk class 0 (Person / Orang)
        results = model(frame, classes=[0], conf=0.45, verbose=False)
        
        # Hitung jumlah orang yang terdeteksi
        person_count = len(results[0].boxes)
        
        # ==========================================
        # LOGIKA FIREBASE & GRACE PERIOD
        # ==========================================
        current_time = time.time()
        
        # 1. Update Firebase HANYA jika jumlah orang berubah (hemat kuota RTDB)
        if person_count != last_person_count:
            try:
                # Update ke /ai_vision
                requests.patch(
                    f"{FIREBASE_URL}nodes/{NODE_ID}/ai_vision.json",
                    json={"person_count": person_count, "grace_period_active": (person_count == 0)},
                    timeout=2
                )
                print(f"✅ Firebase Updated: person_count = {person_count}")
            except Exception as e:
                print(f"❌ Gagal kirim ke Firebase: {e}")
                
            # Logika menyalakan instan JIKA ruangan sebelumnya kosong (0) dan sekarang ada orang (>0)
            if last_person_count == 0 and person_count > 0:
                print("🚶 Orang terdeteksi masuk! Mengecek status mode ruangan...")
                
                if is_room_auto():
                    try:
                        iso_now = datetime.datetime.utcnow().isoformat() + "Z"
                        
                        # Update Frontend UI (Devices Node)
                        requests.patch(f"{FIREBASE_URL}devices/{ROOM_ID}-lamp.json", json={"isOn": True, "lastUpdated": iso_now}, timeout=2)
                        requests.patch(f"{FIREBASE_URL}devices/{ROOM_ID}-acFan.json", json={"isOn": True, "lastUpdated": iso_now}, timeout=2)
                        
                        # Update Hardware Node (Compatibility)
                        requests.patch(f"{FIREBASE_URL}nodes/{NODE_ID}/relays/relay_1_lampu.json", json={"is_on": True}, timeout=2)
                        requests.patch(f"{FIREBASE_URL}nodes/{NODE_ID}/relays/relay_2_kipas.json", json={"is_on": True}, timeout=2)
                        
                        # Kirim Audit Log
                        requests.post(f"{FIREBASE_URL}logs/{NODE_ID}.json", json={
                            "relay_id": "bulk",
                            "action": "ON",
                            "timestamp": int(time.time()),
                            "triggered_by": "AI Otonom (YOLOv8)",
                            "reason": "Orang Terdeteksi Masuk"
                        }, timeout=2)
                        print("✅ Perangkat menyala & Log dicatat.")
                    except Exception as e:
                        print(f"❌ Error saat update perangkat: {e}")
                else:
                    print("🔒 Otomatisasi diabaikan (Mode Manual).")
                    
            last_person_count = person_count
            
            # Reset timer: Jika ada orang, batalkan perhitungan kosong
            if person_count > 0:
                empty_room_start_time = None
            elif person_count == 0:
                empty_room_start_time = current_time # Mulai menghitung saat kelas baru saja kosong
                
        # 2. Cek apakah kelas sudah kosong melampaui Grace Period
        if person_count == 0 and empty_room_start_time is not None:
            time_empty = current_time - empty_room_start_time
            if time_empty >= GRACE_PERIOD_SECONDS:
                print(f"⚠️ Kelas kosong selama {int(time_empty)} detik! Memutus relay...")
                
                if is_room_auto():
                    try:
                        iso_now = datetime.datetime.utcnow().isoformat() + "Z"
                        
                        # Update Frontend UI (Devices Node)
                        requests.patch(f"{FIREBASE_URL}devices/{ROOM_ID}-lamp.json", json={"isOn": False, "lastUpdated": iso_now}, timeout=2)
                        requests.patch(f"{FIREBASE_URL}devices/{ROOM_ID}-acFan.json", json={"isOn": False, "lastUpdated": iso_now}, timeout=2)
                        
                        # Update Hardware Node (Compatibility)
                        requests.patch(f"{FIREBASE_URL}nodes/{NODE_ID}/relays/relay_1_lampu.json", json={"is_on": False}, timeout=2)
                        requests.patch(f"{FIREBASE_URL}nodes/{NODE_ID}/relays/relay_2_kipas.json", json={"is_on": False}, timeout=2)
                        
                        # Kirim Audit Log
                        requests.post(f"{FIREBASE_URL}logs/{NODE_ID}.json", json={
                            "relay_id": "bulk",
                            "action": "OFF",
                            "timestamp": int(time.time()),
                            "triggered_by": "AI Otonom (YOLOv8)",
                            "reason": f"Ruangan kosong melampaui {GRACE_PERIOD_SECONDS} detik"
                        }, timeout=2)
                        print("✅ Perangkat diputus & Log dicatat.")
                    except Exception as e:
                        print(f"❌ Error saat update perangkat: {e}")
                else:
                    print("🔒 Otomatisasi diabaikan (Mode Manual).")
                
                # Reset timer agar tidak menembak Firebase berulang-ulang terus menerus
                empty_room_start_time = None
        
        # Ambil frame yang sudah digambar bounding box
        frame = results[0].plot()
        
        # Render frame ke HTTP stream
        ret, buffer = cv2.imencode('.jpg', frame)
        frame_bytes = buffer.tobytes()
        
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')

@app.route('/video_feed')
def video_feed():
    return Response(generate_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')

@app.route('/')
def index():
    return """
    <html>
    <head>
        <title>YOLOv8 Web Stream</title>
        <style>
            body { 
                text-align: center; 
                background-color: #121212; 
                color: white; 
                padding-top: 30px; 
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
            }
            h1 { color: #00ff00; margin-bottom: 5px; }
            p { color: #aaaaaa; margin-bottom: 20px; }
            .video-container { 
                margin: 0 auto; 
                border: 3px solid #00ff00; 
                border-radius: 10px; 
                width: max-content; 
                overflow: hidden; 
                box-shadow: 0 0 20px rgba(0, 255, 0, 0.4);
            }
        </style>
    </head>
    <body>
        <h1>🚀 YOLOv8 AI Otonom</h1>
        <p>Dashboard Integrasi Level Ruangan (Mode Auto/Manual tersinkronisasi)</p>
        <div class="video-container">
            <img src="/video_feed" style="width: 640px; display: block;">
        </div>
    </body>
    </html>
    """

if __name__ == '__main__':
    print(f"🌍 Server AI berjalan! Buka browser dan pergi ke -> http://127.0.0.1:{args.port}")
    app.run(host='0.0.0.0', port=args.port, debug=False)
