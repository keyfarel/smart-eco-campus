import { NextResponse } from "next/server";

// Firebase URL dari .env atau hardcode sementara untuk Edge Node LPR 1
const FIREBASE_URL = "https://iot-kelompok-6-59aac-default-rtdb.asia-southeast1.firebasedatabase.app";
const NODE_ID = "bld_sipil_001_f7_lpr1";

export async function GET() {
  try {
    // Kita bisa mengecek status daemon/AI dari Firebase heartbeat (ai_vision/grace_period_active dsb)
    // Tapi untuk API ini, kita kembalikan status OK saja. Status Live Camera di-handle oleh Firebase RTDB listener.
    return NextResponse.json({ status: "ready" });
  } catch (error) {
    return NextResponse.json({ status: "offline" });
  }
}

export async function POST(req: Request) {
  try {
    const { action } = await req.json();

    if (action === "start") {
      // 1. Ubah flag Firebase untuk memerintahkan Edge Daemon menyalakan kamera
      await fetch(`${FIREBASE_URL}/nodes/${NODE_ID}/camera_power.json`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: "true"
      });
      
      return NextResponse.json({ success: true, message: "Signal START sent to Edge Daemon" });
    } 
    
    if (action === "stop") {
      // 2. Ubah flag Firebase untuk memerintahkan Edge Daemon mematikan kamera
      await fetch(`${FIREBASE_URL}/nodes/${NODE_ID}/camera_power.json`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: "false"
      });
      
      return NextResponse.json({ success: true, message: "Signal STOP sent to Edge Daemon" });
    }

    return NextResponse.json({ success: false, error: "Invalid action" }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
