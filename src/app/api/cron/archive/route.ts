import { NextResponse } from "next/server"
import { rtdb } from "@/lib/firebase"
import { ref, get, push, serverTimestamp } from "firebase/database"

// Supaya Next.js tidak men-cache API ini
export const dynamic = "force-dynamic"

export async function GET(request: Request) {
  try {
    // 1. Verifikasi Token Rahasia (agar tidak semua orang bisa memicu cron)
    // Dalam produksi, tambahkan pengecekan token dari request headers/query.
    const url = new URL(request.url)
    const token = url.searchParams.get("token")
    // Contoh token sederhana: "smart-eco-cron-2026"
    if (token !== "smart-eco-cron-2026") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (!rtdb) {
      return NextResponse.json({ error: "Firebase not initialized" }, { status: 500 })
    }

    // 2. Baca data real-time saat ini dari node "nodes"
    const nodesRef = ref(rtdb, "nodes")
    const snapshot = await get(nodesRef)

    if (!snapshot.exists()) {
      return NextResponse.json({ message: "No active nodes to archive" }, { status: 200 })
    }

    let totalWatt = 0

    // Kalkulasi total watt
    snapshot.forEach((gedungSnap) => {
      gedungSnap.forEach((ruanganSnap) => {
        const ruanganData = ruanganSnap.val()
        if (ruanganData && typeof ruanganData === "object") {
          // Cari perangkat di dalam ruangan
          Object.values(ruanganData).forEach((device: any) => {
            if (device && device.isOn && typeof device.powerUsage === "number") {
              totalWatt += device.powerUsage
            }
          })
        }
      })
    })

    // 3. Simpan rekap daya ini ke dalam "sensor_history"
    const historyRef = ref(rtdb, "sensor_history")
    await push(historyRef, {
      watt: parseFloat(totalWatt.toFixed(2)),
      timestamp: Math.floor(Date.now() / 1000) // Simpan dalam format detik Unix
    })

    return NextResponse.json({ 
      success: true, 
      message: "Archive successful", 
      recordedWatt: totalWatt,
      timestamp: new Date().toISOString()
    })

  } catch (error: any) {
    console.error("[CRON] Archiving failed:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
