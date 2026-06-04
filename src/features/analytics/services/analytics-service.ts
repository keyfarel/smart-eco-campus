import { db } from "@/lib/firebase"
import { collection, query, where, getDocs, orderBy, Timestamp } from "firebase/firestore"

export interface HistoryRecord {
  id: string
  watt: number
  timestamp: { seconds: number }
}

export interface ChartData {
  time: string
  watt: number
}

export interface AnalyticsStats {
  total: number
  peak: number
  cost: number
  peakTime: string
}

/**
 * 📡 FUNGSI UTAMA PENGAMBILAN DATA ANALITIK DARI CLOUD FIRESTORE
 * Melakukan kalkulasi statistik energi dan memformat data grafik di server.
 */
export async function getAnalyticsData(timeRange: string = "24h") {
  if (!db) {
    return { rawLogs: [], mainData: [], stats: { total: 0, peak: 0, cost: 0, peakTime: "—" } }
  }

  const now = new Date()
  let startTime: Date

  if (timeRange === "24h") {
    startTime = new Date(now.getTime() - 24 * 60 * 60 * 1000)
  } else if (timeRange === "7d") {
    startTime = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
  } else {
    startTime = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
  }

  const rawLogs: HistoryRecord[] = []
  
  try {
    const q = query(
      collection(db, "sensor_history"),
      where("timestamp", ">=", Timestamp.fromDate(startTime)),
      orderBy("timestamp", "asc")
    )

    const querySnapshot = await getDocs(q)
    querySnapshot.forEach((doc) => {
      const data = doc.data()
      rawLogs.push({
        id: doc.id,
        watt: data.watt || 0,
        timestamp: { seconds: data.timestamp?.seconds || 0 }
      })
    })
  } catch (error) {
    console.error("[analytics-service] Firestore fetch error:", error)
  }

  let mainData: ChartData[] = []

  // 🧪 Pemrosesan data berdasarkan rentang waktu yang dipilih
  if (timeRange === "24h") {
    mainData = rawLogs.map(log => {
      const logDate = new Date(log.timestamp.seconds * 1000)
      return {
        time: logDate.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
        watt: log.watt
      }
    })
  } else {
    // Grouping per hari untuk 7d dan 30d
    const grouped: Record<string, { totalWatt: number; count: number }> = {}
    
    rawLogs.forEach(log => {
      const logDate = new Date(log.timestamp.seconds * 1000)
      const dateStr = logDate.toLocaleDateString("id-ID", { weekday: 'short' })
      
      if (!grouped[dateStr]) {
        grouped[dateStr] = { totalWatt: 0, count: 0 }
      }
      grouped[dateStr].totalWatt += log.watt
      grouped[dateStr].count += 1
    })

    mainData = Object.entries(grouped).map(([day, stats]) => ({
      time: day,
      watt: parseFloat((stats.totalWatt / stats.count).toFixed(2))
    }))
  }

  // 🧮 Metrik kalkulasi ringkasan (Stats)
  let stats: AnalyticsStats = { total: 0, peak: 0, cost: 0, peakTime: "—" }
  
  if (rawLogs.length > 0) {
    const totalWatt = rawLogs.reduce((sum, log) => sum + log.watt, 0)
    // Asumsi data per 5-10 menit, untuk demo kita gunakan pembagi rata-rata jam
    const totalKwh = (totalWatt / rawLogs.length) * (timeRange === "24h" ? 24 : (timeRange === "7d" ? 168 : 720)) / 1000

    let peakWatt = 0
    let peakTimeStr = "—"

    rawLogs.forEach(log => {
      if (log.watt > peakWatt) {
        peakWatt = log.watt
        const logDate = new Date(log.timestamp.seconds * 1000)
        peakTimeStr = logDate.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })
      }
    })

    stats = {
      total: parseFloat(totalKwh.toFixed(1)),
      peak: parseFloat(peakWatt.toFixed(1)),
      cost: Math.round(totalKwh * 1444), // Sesuai rate di SDD (IDR 1444 per kWh)
      peakTime: peakTimeStr === "—" ? "—" : peakTimeStr
    }
  }

  return {
    rawLogs,
    mainData,
    stats
  }
}

