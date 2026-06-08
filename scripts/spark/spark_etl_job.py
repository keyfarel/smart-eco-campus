"""
Apache Spark ETL Job for Smart Eco Campus
=========================================
This script acts as the backbone of the Big Data analytics pipeline.
It performs an Extract, Transform, Load (ETL) process:
1. EXTRACT: Fetches raw IoT sensor logs from Firebase Realtime Database.
2. STORE: Backs up the raw JSON data to Hadoop Distributed File System (HDFS).
3. TRANSFORM: Uses PySpark to flatten the JSON and calculate precise energy
   savings (in kWh and IDR) utilizing Window Functions (lag) based on AI YOLOv8 actions.
4. LOAD: Pushes the aggregated metrics and leaderboard back to Firebase for the Next.js Dashboard.

Author: Kelompok 6
Version: 1.0 (Final)
"""

import os
import json
import time
import re
import subprocess
from datetime import datetime
from pyspark.sql import SparkSession, Window
from pyspark.sql.functions import col, sum as spark_sum, round as spark_round, lag, when

import firebase_admin
from firebase_admin import credentials, db

# ==========================================
# CONFIGURATION
# ==========================================
FIREBASE_CREDENTIALS_PATH = "./firebase-adminsdk.json"
DATABASE_URL = "https://iot-kelompok-6-59aac-default-rtdb.asia-southeast1.firebasedatabase.app"
PLN_RATE_PER_KWH = 1500.0  # Tarif Dasar Listrik (IDR)
HDFS_URI = "/user/hadoopuser/smart_campus_raw.json"
LOCAL_TMP_PATH = "/tmp/smart_campus_raw.json"


def update_status(step: int, total: int, msg: str, is_running: bool = True):
    """
    Updates the Spark ETL progress status in Firebase so the frontend
    can display a real-time progress bar.
    """
    try:
        if db:
            db.reference("analytics/spark_status").set({
                "step": step,
                "total_steps": total,
                "message": msg,
                "is_running": is_running,
                "timestamp": int(time.time() * 1000)
            })
    except Exception as e:
        print(f"[Warning] Failed to update status in Firebase: {e}")
    print(f"[{step}/{total}] {msg}")


def initialize_firebase():
    """Initializes the Firebase Admin SDK securely."""
    if not firebase_admin._apps:
        cred = credentials.Certificate(FIREBASE_CREDENTIALS_PATH)
        firebase_admin.initialize_app(cred, {'databaseURL': DATABASE_URL})


def get_active_datanodes() -> int:
    """Queries Hadoop dfsadmin to get the number of live DataNodes."""
    active_nodes = 0
    try:
        report = subprocess.check_output("/usr/local/hadoop/bin/hdfs dfsadmin -report", shell=True).decode("utf-8")
        for line in report.split("\n"):
            if "Live datanodes" in line:
                match = re.search(r'Live datanodes \((\d+)\)', line)
                if match:
                    active_nodes = int(match.group(1))
                    break
    except Exception as e:
        print(f"      [WARNING] Gagal mengekstrak dfsadmin: {e}")
    return active_nodes


def main():
    print("=" * 60)
    print("🚀 MEMULAI PROSES APACHE SPARK ETL (AI SAVINGS AGGREGATION)")
    print("=" * 60)

    # ---------------------------------------------------------
    # 1. INITIALIZE FIREBASE
    # ---------------------------------------------------------
    try:
        initialize_firebase()
        update_status(1, 5, "Firebase Admin berhasil dihubungkan.", True)
    except Exception as e:
        print(f"[1/5] GAGAL: Firebase credential gagal dimuat. ({e})")
        return

    # ---------------------------------------------------------
    # 2. INITIALIZE APACHE SPARK
    # ---------------------------------------------------------
    update_status(2, 5, "Menginisialisasi Apache Spark Cluster...", True)
    spark = SparkSession.builder \
        .appName("SmartEcoCampus_ETL_AISavings") \
        .master("local[*]") \
        .config("spark.driver.memory", "1g") \
        .config("spark.executor.memory", "1g") \
        .getOrCreate()
    
    spark.sparkContext.setLogLevel("WARN")

    # ---------------------------------------------------------
    # 3. EXTRACT: FETCH DATA FROM FIREBASE
    # ---------------------------------------------------------
    update_status(3, 5, "Mengekstrak data dari /logs dan /devices...", True)
    
    try:
        raw_logs = db.reference("logs").get() or {}
        raw_devices = db.reference("devices").get() or []
        raw_nodes = db.reference("nodes").get() or {}
        
        if not raw_logs:
            print("      [WARNING] /logs kosong. Tidak ada data untuk diproses.")
            update_status(5, 5, "Proses dibatalkan: Tidak ada data.", False)
            spark.stop()
            return

        # Parse Devices into Lookup Dictionary
        device_lookup = {}
        raw_devices_list = list(raw_devices.values()) if isinstance(raw_devices, dict) else raw_devices
        for d in raw_devices_list:
            if not isinstance(d, dict) or not d.get("id"): continue
            device_lookup[d["id"]] = {
                "type": d.get("id").split("-")[-1] if "-" in d["id"] else "unknown",
                "wattage": float(d.get("powerUsage", 0)),
                "location": d.get("location", "Unknown Location")
            }

        # Parse Nodes into Lookup Dictionary
        node_lookup = {}
        for nid, nval in raw_nodes.items():
            if not isinstance(nval, dict): continue
            name = nval.get("display_name")
            if not name and nval.get("metadata"):
                name = nval["metadata"].get("display_name")
            node_lookup[nid] = name or "Unknown Location"

        # Flatten Logs
        processed_logs = []
        for node_id, node_logs in raw_logs.items():
            if not isinstance(node_logs, dict): continue
            for log_id, log_val in node_logs.items():
                if not isinstance(log_val, dict): continue
                
                relay_id = log_val.get("relay_id", "unknown")
                action = log_val.get("action", "UNKNOWN")
                triggered_by = log_val.get("triggered_by", "UNKNOWN")
                timestamp = int(log_val.get("timestamp", 0))
                location = log_val.get("location") or node_lookup.get(node_id, "Unknown Location")

                if relay_id == "bulk":
                    # Explode Bulk action into specific devices (Lamp and AC)
                    processed_logs.extend([
                        {"log_id": f"{log_id}_lamp", "device_type": "lamp", "location": location, "action": action, "triggered_by": triggered_by, "timestamp": timestamp, "wattage": 60.0},
                        {"log_id": f"{log_id}_acFan", "device_type": "acFan", "location": location, "action": action, "triggered_by": triggered_by, "timestamp": timestamp, "wattage": 225.0}
                    ])
                else:
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
        update_status(5, 5, "Gagal mengekstrak data.", False)
        spark.stop()
        return

    # ---------------------------------------------------------
    # 3.5. LOAD TO HDFS SEBAGAI BIG DATA STORE
    # ---------------------------------------------------------
    update_status(3, 5, "Menyimpan Raw Data ke HDFS & Memuat DataFrame...", True)
    
    with open(LOCAL_TMP_PATH, "w") as f:
        for log_entry in processed_logs:
            f.write(json.dumps(log_entry) + "\n")
            
    try:
        # Update Cluster Status to Firebase
        active_nodes = get_active_datanodes()
        try:
            db.reference("analytics/cluster_status").set({
                "active_datanodes": active_nodes,
                "last_checked": int(time.time() * 1000)
            })
        except Exception:
            pass

        print("      [INFO] Menangani Edge Cases: Memaksa HDFS keluar dari Safe Mode...")
        os.system("/usr/local/hadoop/bin/hdfs dfsadmin -safemode leave > /dev/null 2>&1")
        
        print("      [INFO] Mencoba mengunggah data ke HDFS DataNode...")
        os.system("/usr/local/hadoop/bin/hdfs dfs -mkdir -p /user/hadoopuser/ > /dev/null 2>&1")
        
        # Force replication=1 to ensure write succeeds even with only 1 DataNode
        upload_status = os.system(f"/usr/local/hadoop/bin/hdfs dfs -D dfs.replication=1 -put -f {LOCAL_TMP_PATH} {HDFS_URI} > /dev/null 2>&1")
        
        if upload_status == 0:
            print("      [INFO] Sukses menyimpan ke HDFS! Membaca DataFrame dari Distributed Storage.")
            df = spark.read.json(HDFS_URI)
        else:
            raise Exception("HDFS menolak write (Mungkin 0 DataNode yang aktif).")
    except Exception as e:
        print(f"      [WARNING] HDFS tidak bisa digunakan: {e}")
        print("      [INFO] FALLBACK AKTIF: Membaca DataFrame langsung dari Disk Lokal NameNode.")
        df = spark.read.json(f"file://{LOCAL_TMP_PATH}")

    print(f"      Berhasil memuat {df.count()} baris log ke dalam Spark DataFrame.")

    # ---------------------------------------------------------
    # 4. TRANSFORM: AI SAVINGS CALCULATION W/ WINDOW LAG()
    # ---------------------------------------------------------
    update_status(4, 5, "Kalkulasi Window lag() dan Penghematan AI...", True)
    
    # Partisi per Ruangan dan Tipe Perangkat, diurutkan berdasarkan waktu (Chronological)
    window_spec = Window.partitionBy("location", "device_type").orderBy("timestamp")
    
    # Tarik data baris sebelumnya (Look back 1 row)
    df_lagged = df.withColumn("prev_action", lag("action").over(window_spec)) \
                  .withColumn("prev_triggered_by", lag("triggered_by").over(window_spec)) \
                  .withColumn("prev_timestamp", lag("timestamp").over(window_spec))

    # Logika Penghematan AI:
    # Penghematan dihitung JIKA:
    # 1. Baris saat ini adalah ON (Listrik dinyalakan, mengakhiri periode hemat).
    # 2. Baris SEBELUMNYA adalah OFF.
    # 3. Baris SEBELUMNYA dimatikan secara KHUSUS oleh "AI Otonom" (YOLOv8).
    # Durasi Hemat = timestamp SEKARANG - timestamp SEBELUMNYA
    
    df_calculated = df_lagged.withColumn(
        "duration_seconds",
        when(
            (col("action") == "ON") & 
            (col("prev_action") == "OFF") & 
            col("prev_triggered_by").like("%AI Otonom%"),
            col("timestamp") - col("prev_timestamp")
        ).otherwise(0)
    )

    # Menghitung KWh dan Finansial (IDR)
    # KWh = (Watt / 1000) * (Durasi Detik / 3600)
    df_calculated = df_calculated.withColumn(
        "kwh_saved",
        (col("wattage") / 1000) * (col("duration_seconds") / 3600)
    ).withColumn(
        "rupiah_saved",
        col("kwh_saved") * PLN_RATE_PER_KWH
    )

    # Group By Ruangan (Agregasi)
    summary_df = df_calculated.groupBy("location").agg(
        spark_sum("duration_seconds").alias("total_duration_sec"),
        spark_round(spark_sum("kwh_saved"), 4).alias("total_kwh_saved"),
        spark_round(spark_sum("rupiah_saved"), 2).alias("total_rupiah_saved"),
        spark_sum(when(col("duration_seconds") > 0, 1).otherwise(0)).alias("total_ai_actions")
    ).filter(col("total_rupiah_saved") > 0) # Hanya filter ruangan yang memiliki penghematan

    print("\n" + "="*40)
    print("📈 HASIL KALKULASI PENGHEMATAN AI")
    print("="*40)
    summary_df.show()

    # ---------------------------------------------------------
    # 5. LOAD: MENGIRIM KEMBALI KE FIREBASE (EXECUTIVE UI)
    # ---------------------------------------------------------
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
            
            # Push ke Firebase Realtime Database
            db.reference(f"analytics/summary/{loc_key}").set(payload)
            print(f"      => Sukses update {loc_key}: Penghematan Rp {payload['total_rupiah_saved']}")
    
    update_status(5, 5, "Selesai! Dashboard diperbarui.", False)
    print("\n✅ AI SAVINGS ETL PROCESS COMPLETED SUCCESSFULLY.")
    spark.stop()

if __name__ == "__main__":
    main()
