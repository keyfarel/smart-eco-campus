// Sesuai skema database Firebase RTDB pada kontrak SDD
export interface RawFirebaseLog {
  timestamp: number;      // Unix Epoch Seconds (IDR/Hadoop compliant)
  relay_id: string;       // Contoh: "relay_1_lampu", "relay_2_kipas", "relay_3_stopkontak"
  action: "ON" | "OFF";   // Aksi kontrol dasar
  triggered_by: string;   // Contoh: "AI_YOLOv8", "System Scheduler", atau nama pengguna
  reason: string;         // Detail pemicu/alasan aksi
}

// Untuk representasi baris tabel visual terpadu di UI
export interface SystemLog {
  id: string;
  macAddress: string;     // MAC Address node asal
  deviceId: string;       // ID Kategori Alat (lamp, acFan, pcProjector) untuk Ikon
  deviceTitle: string;    // Label perangkat (e.g. "Classroom Lamp")
  action: "Turned ON" | "Turned OFF"; // Teks deskriptif UI
  timestamp: string;      // ISO String hasil konversi untuk UI sorting
  adminName: string;      // Nama pemicu (triggered_by)
  adminEmail: string;     // Detail alasan (reason)
}
