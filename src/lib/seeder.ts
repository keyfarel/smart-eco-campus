import { rtdb } from "@/lib/firebase";
import { ref, set } from "firebase/database";

/**
 * GENERATES REALISTIC CAMPUS ENERGY DATA FOR REALTIME DATABASE
 * - High usage during class hours (08:00 - 16:00)
 * - Low usage at night/early morning
 */
export async function clearSensorHistory() {
  try {
    const historyRef = ref(rtdb, "sensor_history");
    await set(historyRef, null);
    console.log("🧹 Previous history cleared");
    return true;
  } catch (error) {
    console.error("❌ Failed to clear history:", error);
    throw error;
  }
}

export async function seedSensorHistory() {
  // 1. Bersihkan riwayat lama
  await clearSensorHistory();

  const now = new Date();
  let count = 0;
  const updates: Record<string, any> = {};

  // Hasilkan data untuk 7 hari terakhir (setiap jam)
  for (let day = 0; day < 7; day++) {
    for (let hour = 0; hour < 24; hour++) {
      const timestamp = new Date(now);
      timestamp.setDate(now.getDate() - day);
      timestamp.setHours(hour, 0, 0, 0);

      // --- 🧠 LOGIKA JAM KAMPUS ---
      let watt = 0;
      if (hour >= 8 && hour <= 16) {
        // Jam Aktif Perkuliahan (Gedung Penuh)
        watt = 450 + Math.random() * 150;
      } else if (hour >= 17 && hour <= 21) {
        // Sore Hari (Kelas Malam / Staf)
        watt = 200 + Math.random() * 100;
      } else {
        // Malam / Dini Hari (Idle)
        watt = 100 + Math.random() * 50;
      }

      const timestampSeconds = Math.floor(timestamp.getTime() / 1000);
      const histKey = `hist_${timestampSeconds}`;

      updates[histKey] = {
        watt: parseFloat(watt.toFixed(2)),
        volt: parseFloat((218 + Math.random() * 5).toFixed(1)),
        ampere: parseFloat((watt / 220).toFixed(2)),
        timestamp: timestampSeconds
      };
      
      count++;
    }
  }

  // Batch update di RTDB dengan cara menimpa path sensor_history
  await set(ref(rtdb, "sensor_history"), updates);

  console.log(`✅ Successfully seeded ${count} historical entries to Firebase RTDB`);
  return count;
}
