import time
import requests
import subprocess
import os

FIREBASE_URL = "https://iot-kelompok-6-59aac-default-rtdb.asia-southeast1.firebasedatabase.app/"
NODE_ID = "bld_sipil_001_f7_lpr1"
YOLO_PORT = 5000

print("==================================================")
print("🛡️  SMART ECO CAMPUS - EDGE DAEMON STARTING")
print("==================================================")
print(f"Menyimak perintah dari AWS/Firebase: {FIREBASE_URL}nodes/{NODE_ID}/camera_power.json")

# Inisialisasi status awal
yolo_process = None
is_running = False

# Reset status di Firebase saat daemon baru menyala (Asumsi mati)
try:
    requests.put(f"{FIREBASE_URL}nodes/{NODE_ID}/camera_power.json", json=False, timeout=5)
except:
    pass

while True:
    try:
        # Polling status dari Firebase
        res = requests.get(f"{FIREBASE_URL}nodes/{NODE_ID}/camera_power.json", timeout=5)
        camera_power_requested = res.json() == True

        # Jika Web meminta NYALA tapi YOLO mati
        if camera_power_requested and not is_running:
            print("🟢 [DAEMON] Perintah START diterima dari Cloud! Menyalakan YOLOv8...")
            # Menjalankan YOLO di background tanpa mem-blok daemon
            yolo_process = subprocess.Popen(
                ["python", "scripts/yolo/yolo_web.py"],
                cwd=os.path.join(os.path.dirname(__file__), "..", "..") # Pastikan CWD di root proyek
            )
            is_running = True
            time.sleep(3) # Tunggu sampai server Flask naik

        # Jika Web meminta MATI tapi YOLO masih nyala
        elif not camera_power_requested and is_running:
            print("🔴 [DAEMON] Perintah STOP diterima dari Cloud! Mematikan YOLOv8...")
            try:
                # Minta YOLO untuk melakukan graceful shutdown (mematikan relay & kamera dengan aman)
                requests.post(f"http://127.0.0.1:{YOLO_PORT}/shutdown", timeout=3)
            except Exception as e:
                print(f"⚠️ Gagal menghubungi endpoint shutdown YOLO (Mungkin sudah mati): {e}")
            
            # Pastikan proses benar-benar terbunuh
            if yolo_process:
                try:
                    yolo_process.wait(timeout=5)
                except subprocess.TimeoutExpired:
                    yolo_process.kill()
            
            is_running = False
            yolo_process = None
            print("✅ [DAEMON] YOLOv8 berhasil dimatikan.")

    except requests.exceptions.RequestException as e:
        # Abaikan error jaringan sementara
        pass
    except Exception as e:
        print(f"❌ Error pada Daemon: {e}")

    time.sleep(2) # Polling setiap 2 detik
