import { NextResponse } from "next/server"
import { isFirebaseReady, rtdb } from "@/lib/firebase"
import { ref, get, set } from "firebase/database"

export async function GET(request: Request) {
  try {
    // 1. Verifikasi Keamanan (Autentikasi Header)
    // AWS EventBridge atau scheduler lainnya WAJIB menyertakan header ini
    const authHeader = request.headers.get("authorization")
    const cronSecret = process.env.AWS_CRON_SECRET || "smartcampus-secret-key-123" // Fallback fallback

    if (authHeader !== `Bearer ${cronSecret}`) {
      console.warn("[Cron API] Unauthorized access attempt to Auto-Revert.")
      return NextResponse.json(
        { error: "Unauthorized. Invalid CRON_SECRET." },
        { status: 401 }
      )
    }

    // 2. Validasi Kesiapan Firebase
    if (!isFirebaseReady || !rtdb) {
      console.error("[Cron API] Firebase is not configured or offline.")
      return NextResponse.json(
        { error: "Firebase RTDB not ready." },
        { status: 500 }
      )
    }

    // 3. Ambil data ruangan yang terdaftar di RTDB
    const devicesRef = ref(rtdb, "devices")
    const snapshot = await get(devicesRef)

    if (!snapshot.exists()) {
      return NextResponse.json(
        { message: "No devices found to revert. Job skipped." },
        { status: 200 }
      )
    }

    const devicesData = snapshot.val()
    const autoRevertPayload: Record<string, boolean> = {}

    // Kita kumpulkan semua ID Ruangan unik dari devices
    // Asumsi format device ID: "RCODE-lamp" -> "RCODE"
    Object.keys(devicesData).forEach((deviceId) => {
      const roomId = deviceId.split("-")[0]
      if (roomId) {
        autoRevertPayload[roomId] = true // Set kembali ke mode Auto
      }
    })

    // 4. Eksekusi Bulk Update ke node `room_automation`
    const automationRef = ref(rtdb, "room_automation")
    await set(automationRef, autoRevertPayload)

    console.log(`[Cron API] Daily Auto-Revert executed successfully. ${Object.keys(autoRevertPayload).length} rooms set to Auto.`)

    return NextResponse.json(
      { 
        success: true, 
        message: "Daily Auto-Revert successful.",
        roomsUpdated: Object.keys(autoRevertPayload).length
      },
      { status: 200 }
    )

  } catch (error: any) {
    console.error("[Cron API] Daily Auto-Revert failed:", error)
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    )
  }
}
