import { NextResponse } from "next/server"
import { rtdb } from "@/lib/firebase"
import { ref, remove } from "firebase/database"

export const dynamic = "force-dynamic"

export async function DELETE(request: Request) {
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

    // Eksekusi Sapu Bersih (Menghapus seluruh node sensor_history)
    const historyRef = ref(rtdb, "sensor_history")
    await remove(historyRef)

    return NextResponse.json({ 
      success: true, 
      message: "History has been completely cleared." 
    })

  } catch (error: any) {
    console.error("[CRON] Clear history failed:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
