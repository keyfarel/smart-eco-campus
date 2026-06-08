import os
import json
import time
from datetime import datetime
from pyspark.sql import SparkSession, Window
from pyspark.sql.functions import col, from_unixtime, date_format, sum as spark_sum, round as spark_round, lag, when, lit
import firebase_admin
from firebase_admin import credentials, db

# ==========================================
# KONFIGURASI APLIKASI
# ==========================================
FIREBASE_CREDENTIALS_PATH = "./firebase-adminsdk.json"
DATABASE_URL = "https://iot-kelompok-6-59aac-default-rtdb.asia-southeast1.firebasedatabase.app"
PLN_RATE_PER_KWH = 1500.0  # Tarif Dasar Listrik (IDR)

def update_status(step, total, msg, is_running=True):
    try:
        if db:
            db.reference("analytics/spark_status").set({
                "step": step,
                "total_steps": total,
                "message": msg,
                "is_running": is_running,
                "timestamp": int(time.time() * 1000)
            })
    except Exception:
        pass
    print(f"[{step}/{total}] {msg}")

def main():
    print("="*50)
    print("🚀 MEMULAI PROSES APACHE SPARK ETL (AI SAVINGS AGGREGATION)")
    print("="*50)

    # 1. INISIALISASI FIREBASE ADMIN
    try:
        if not firebase_admin._apps:
            cred = credentials.Certificate(FIREBASE_CREDENTIALS_PATH)
            firebase_admin.initialize_app(cred, {'databaseURL': DATABASE_URL})
        update_status(1, 5, "Firebase Admin berhasil dihubungkan.", True)
    except Exception as e:
        print(f"[1/5] GAGAL: Firebase credential gagal dimuat. ({e})")
        return

    # 2. INISIALISASI APACHE SPARK
    update_status(2, 5, "Menginisialisasi Apache Spark Cluster...", True)
    spark = SparkSession.builder \
        .appName("SmartEcoCampus_ETL_AISavings") \
        .master("local[*]") \
        .config("spark.driver.memory", "1g") \
        .config("spark.executor.memory", "1g") \
        .getOrCreate()
    
    spark.sparkContext.setLogLevel("WARN")

    # 3. EXTRACT: MENARIK DATA DARI FIREBASE
    update_status(3, 5, "Mengekstrak data dari /logs dan /devices...", True)
    
    try:
        raw_logs = db.reference("logs").get() or {}
        raw_devices = db.reference("devices").get() or []
        raw_nodes = db.reference("nodes").get() or {}
        
        if not raw_logs:
            print("      [WARNING] /logs kosong. Tidak ada data untuk diproses.")
            spark.stop()
            return

        # Parsing Devices ke dalam Dictionary Lookup
        # Format: { "A-101-lamp": {"type": "light", "wattage": 120, "location": "Lab Pemrograman"} }
        device_lookup = {}
        if isinstance(raw_devices, dict):
            raw_devices_list = list(raw_devices.values())
        else:
            raw_devices_list = raw_devices

        for d in raw_devices_list:
            if not isinstance(d, dict) or not d.get("id"): continue
            device_lookup[d["id"]] = {
                "type": d.get("id").split("-")[-1] if "-" in d["id"] else "unknown",
                "wattage": float(d.get("powerUsage", 0)),
                "location": d.get("location", "Unknown Location")
            }

        # Parsing Nodes ke dalam Dictionary Lookup
        node_lookup = {}
        for nid, nval in raw_nodes.items():
            if not isinstance(nval, dict): continue
            name = nval.get("display_name")
            if not name and nval.get("metadata"):
                name = nval["metadata"].get("display_name")
            node_lookup[nid] = name or "Unknown Location"

        # Parsing Logs
        processed_logs = []
        for node_id, node_logs in raw_logs.items():
            if not isinstance(node_logs, dict): continue
            for log_id, log_val in node_logs.items():
                if not isinstance(log_val, dict): continue
                relay_id = log_val.get("relay_id") or "unknown"
                action = log_val.get("action") or "UNKNOWN"
                triggered_by = log_val.get("triggered_by") or "UNKNOWN"
                timestamp = int(log_val.get("timestamp") or 0)
                location = log_val.get("location")
                if not location:
                    location = node_lookup.get(node_id, "Unknown Location")

                if relay_id == "bulk":
                    # EXPLODE BULK: Pecah menjadi Lamp dan AC Fan saja (STOPKONTAK DIABAIKAN)
                    processed_logs.append({
                        "log_id": f"{log_id}_lamp",
                        "device_type": "lamp",
                        "location": location,
                        "action": action,
                        "triggered_by": triggered_by,
                        "timestamp": timestamp,
                        "wattage": 120.0
                    })
                    processed_logs.append({
                        "log_id": f"{log_id}_acFan",
                        "device_type": "acFan",
                        "location": location,
                        "action": action,
                        "triggered_by": triggered_by,
                        "timestamp": timestamp,
                        "wattage": 850.0
                    })
                else:
                    # Individual Device Log
                    # Cek jika ini stopkontak, biarkan masuk, tapi nanti tidak akan dihitung AI karena triggered_by bukan AI
                    dev = device_lookup.get(relay_id, {})
                    dev_type = dev.get("type", "unknown")
                    if "lamp" in str(relay_id).lower(): dev_type = "lamp"
                    elif "fan" in str(relay_id).lower() or "ac" in str(relay_id).lower(): dev_type = "acFan"
                    elif "stopkontak" in str(relay_id).lower() or "project" in str(relay_id).lower(): dev_type = "pcProjector"

                    processed_logs.append({
                        "log_id": log_id,
                        "device_type": dev_type,
                        "location": location,
                        "action": action,
                        "triggered_by": triggered_by,
                        "timestamp": timestamp,
                        "wattage": dev.get("wattage", 0.0)
                    })

    except Exception as e:
        print(f"      [ERROR] Gagal mengekstrak data: {e}")
        spark.stop()
        return

    # Membuat Spark DataFrame
    df = spark.createDataFrame(processed_logs)
    print(f"      Berhasil memuat {df.count()} baris log ke dalam Spark.")

    # 4. TRANSFORM: WINDOW FUNCTION LAG
    update_status(4, 5, "Kalkulasi Window lag() dan Penghematan...", True)
    
    # Partisi per Ruangan dan Tipe Perangkat, diurutkan berdasarkan waktu
    window_spec = Window.partitionBy("location", "device_type").orderBy("timestamp")
    
    # Tarik data baris sebelumnya
    df_lagged = df.withColumn("prev_action", lag("action").over(window_spec)) \
                  .withColumn("prev_triggered_by", lag("triggered_by").over(window_spec)) \
                  .withColumn("prev_timestamp", lag("timestamp").over(window_spec))

    # Logika Penghematan AI:
    # Penghematan TERJADI JIKA:
    # - Baris saat ini adalah ON (Listrik nyala lagi, mengakhiri masa hemat)
    # - Baris SEBELUMNYA adalah OFF
    # - Baris SEBELUMNYA dimatikan secara KHUSUS oleh "AI Otonom"
    # Durasi = timestamp SEKARANG - timestamp SEBELUMNYA
    
    # Stopkontak tidak akan pernah menyumbang angka, karena prev_triggered_by untuk Stopkontak tidak pernah "AI Otonom"
    
    df_calculated = df_lagged.withColumn(
        "duration_seconds",
        when(
            (col("action") == "ON") & 
            (col("prev_action") == "OFF") & 
            col("prev_triggered_by").like("%AI Otonom%"),
            col("timestamp") - col("prev_timestamp")
        ).otherwise(0)
    )

    # Menghitung KWh dan Rupiah
    # KWh = (Watt / 1000) * (Durasi Detik / 3600)
    df_calculated = df_calculated.withColumn(
        "kwh_saved",
        (col("wattage") / 1000) * (col("duration_seconds") / 3600)
    ).withColumn(
        "rupiah_saved",
        col("kwh_saved") * PLN_RATE_PER_KWH
    )

    # Agregasi per Lokasi (Ruangan)
    summary_df = df_calculated.groupBy("location").agg(
        spark_sum("duration_seconds").alias("total_duration_sec"),
        spark_round(spark_sum("kwh_saved"), 4).alias("total_kwh_saved"),
        spark_round(spark_sum("rupiah_saved"), 2).alias("total_rupiah_saved"),
        spark_sum(when(col("duration_seconds") > 0, 1).otherwise(0)).alias("total_ai_actions")
    ).filter(col("total_rupiah_saved") > 0) # Hanya simpan ruangan yang ada hematnya

    print("\n--- HASIL KALKULASI PENGHEMATAN AI ---")
    summary_df.show()

    # 5. LOAD: MENGIRIM KEMBALI KE FIREBASE
    update_status(5, 5, "Mengirim hasil agregasi ke /analytics/summary...", True)
    
    results = [row.asDict() for row in summary_df.collect()]
    
    if not results:
         print("      [INFO] Belum ada penghematan AI yang tercatat.")
    else:
        for row in results:
            loc_key = str(row["location"]).replace(" ", "_").replace(".", "")
            payload = {
                "lokasi": row["location"],
                "total_ai_action": row["total_ai_actions"],
                "total_durasi_kosong_jam": round(row["total_duration_sec"] / 3600, 2),
                "total_kwh_saved": row["total_kwh_saved"],
                "total_rupiah_saved": row["total_rupiah_saved"],
                "last_computed": datetime.now().isoformat()
            }
            
            db.reference(f"analytics/summary/{loc_key}").set(payload)
            print(f"      => Sukses update {loc_key}: Penghematan Rp {payload['total_rupiah_saved']}")
    
    # Opsional: Kita tidak perlu mendelete /logs agar riwayat tidak hilang.
    
    update_status(5, 5, "Selesai! Dashboard diperbarui.", False)
    print("\n✅ AI SAVINGS ETL PROCESS COMPLETED SUCCESSFULLY.")
    spark.stop()

if __name__ == "__main__":
    main()
