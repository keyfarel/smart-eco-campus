import { NextResponse } from "next/server"
import { rtdb } from "@/lib/firebase"
import { ref, push, remove } from "firebase/database"

export const dynamic = "force-dynamic"

export async function POST(request: Request) {
  try {
    const url = new URL(request.url)
    const token = url.searchParams.get("token")
    
    // Verifikasi Token Rahasia
    if (token !== "smart-eco-cron-2026") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (!rtdb) {
      return NextResponse.json({ error: "Firebase not initialized" }, { status: 500 })
    }

    const historyRef = ref(rtdb, "sensor_history")

    // Opsional: Bersihkan data lama dulu biar tidak numpuk double
    await remove(historyRef)

    const now = new Date()
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    
    // Simulasi data 1 titik per jam selama 30 hari (720 titik data)
    let currentTime = thirtyDaysAgo.getTime()
    const endTime = now.getTime()
    
    const ONE_HOUR = 60 * 60 * 1000
    
    // Array penampung Promise agar cepat eksekusinya
    const promises = []

    while (currentTime <= endTime) {
      const dateObj = new Date(currentTime)
      const hour = dateObj.getHours()
      const day = dateObj.getDay() // 0 = Sunday, 6 = Saturday
      
      let baseWatt = 300 // Beban dasar (kulkas, server, standby)
      
      // Jika jam kerja (08:00 - 18:00) dan bukan hari minggu
      if (hour >= 8 && hour <= 18 && day !== 0) {
        // Beban puncak siang hari (AC menyala, kelas aktif)
        baseWatt = Math.floor(Math.random() * 2000) + 1500 // 1500 - 3500 watt
        
        // Puncak tertinggi jam 12-14
        if (hour >= 12 && hour <= 14) {
          baseWatt += Math.floor(Math.random() * 1000) + 500
        }
      } else {
        // Beban malam atau hari libur
        baseWatt = Math.floor(Math.random() * 300) + 200 // 200 - 500 watt
      }
      
      const payload = {
        watt: baseWatt,
        timestamp: Math.floor(currentTime / 1000)
      }
      
      promises.push(push(historyRef, payload))
      
      currentTime += ONE_HOUR
    }
    
    // Eksekusi semua secara paralel
    await Promise.all(promises)

    return NextResponse.json({ 
      success: true, 
      message: `Successfully injected ${promises.length} hours of demo data.` 
    })

  } catch (error: any) {
    console.error("[SEED-DEMO] Injection failed:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
