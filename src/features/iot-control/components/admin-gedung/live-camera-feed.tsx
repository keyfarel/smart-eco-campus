"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Camera, Wifi, Activity, Power, Loader2, Brain } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { useState, useEffect } from "react"

interface LiveCameraFeedProps {
  status: string
  roomName?: string
  className?: string
  floorName?: string
  wattLoad?: number
  occupancy?: number
  activeDevices?: string[]
  roomMode?: string
}

export function LiveCameraFeed({
  status,
  roomName,
  className,
  floorName,
  wattLoad,
  occupancy,
  activeDevices,
  roomMode
}: LiveCameraFeedProps) {
  const [countdown, setCountdown] = useState<number | null>(null);
  const [isStreamAlive, setIsStreamAlive] = useState(false);
  const [fps, setFps] = useState(30);
  const [isTogglingCam, setIsTogglingCam] = useState(false);
  const [isVideoLoading, setIsVideoLoading] = useState(true);
  const [streamTimestamp, setStreamTimestamp] = useState(Date.now());

  // Listen to actual camera power from Firebase
  useEffect(() => {
    import("@/lib/firebase").then(({ rtdb }) => {
      if (!rtdb) return;
      import("firebase/database").then(({ ref, onValue }) => {
        const powerRef = ref(rtdb, `nodes/bld_sipil_001_f7_lpr1/camera_power`);
        const unsub = onValue(powerRef, (snap) => {
          setIsStreamAlive(!!snap.val());
        });
        return () => unsub();
      });
    });
  }, []);

  // Reset video loading state if status goes offline
  useEffect(() => {
    if (status !== "Online") {
      setIsVideoLoading(true);
    }
  }, [status]);

  // Periksa apakah server kamera sudah jalan atau belum (opsional, tp kita asumsikan isStreamAlive cukup)
  const toggleCameraScript = async () => {
    setIsTogglingCam(true)
    const action = isStreamAlive && status === "Online" ? "stop" : "start"
    toast.info(action === "start" ? "Menyalakan Mesin AI YOLO..." : "Mematikan Kamera AI...")

    try {
      const res = await fetch("/api/cam", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action })
      })
      if (res.ok) {
        toast.success(action === "start" ? "AI Camera berhasil dijalankan!" : "AI Camera dimatikan.")
        if (action === "start") {
          setStreamTimestamp(Date.now())
          setIsStreamAlive(true)
          setIsVideoLoading(true)
        } else {
          setIsStreamAlive(false)
        }
      } else {
        toast.error("Gagal mengontrol skrip kamera.")
      }
    } catch (e) {
      toast.error("Terjadi kesalahan jaringan.")
    } finally {
      setIsTogglingCam(false)
    }
  }

  useEffect(() => {
    if (!isStreamAlive || status !== "Online") return;
    const interval = setInterval(() => {
      setFps(Math.floor(Math.random() * (32 - 28 + 1) + 28));
    }, 1000);
    return () => clearInterval(interval);
  }, [isStreamAlive, status]);

  // Cosmetic UI Countdown
  useEffect(() => {
    if (occupancy === 0 && roomMode === "AUTO") {
      setCountdown(10);
    } else {
      setCountdown(null);
    }
  }, [occupancy, roomMode]);

  useEffect(() => {
    if (countdown === null || countdown <= 0) return;
    const timer = setTimeout(() => setCountdown(prev => (prev !== null ? prev - 1 : null)), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  // Overall status is true if Firebase is Online AND Stream is Alive
  const isFullyOnline = status === "Online" && isStreamAlive;

  return (
    <Card className={`${className || "lg:col-span-2"} bg-zinc-900 border-zinc-800 overflow-hidden`}>
      <CardHeader className="border-b border-zinc-800 pb-3 sm:pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shrink-0">
              <Camera className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-500" />
            </div>
            <div className="min-w-0 flex-1">
              <CardTitle className="text-foreground truncate text-sm sm:text-base">Live AI Camera Feed</CardTitle>
              <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5 truncate">AI Surveillance Stream - {roomName || "Building A"}</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2.5 w-full sm:w-auto mt-2 sm:mt-0">
            <div className="flex items-center gap-1.5 shrink-0 bg-zinc-950/50 sm:bg-transparent px-2 py-1.5 sm:px-0 sm:py-0 rounded-md border border-zinc-800 sm:border-none">
              <div className={classNameForStatus(isFullyOnline ? "Online" : "Offline")} />
              <span className={classTextForStatus(isFullyOnline ? "Online" : "Offline")}>
                {isFullyOnline ? "LIVE" : "OFFLINE"}
              </span>
            </div>

            <Button
              size="sm"
              variant={isFullyOnline ? "destructive" : "default"}
              onClick={toggleCameraScript}
              disabled={isTogglingCam}
              className={`h-9 sm:h-8 gap-1.5 px-3 text-xs w-full sm:w-auto shrink-0 ${!isFullyOnline ? "bg-emerald-600 hover:bg-emerald-700 text-white" : ""}`}
            >
              {isTogglingCam ? <Loader2 className="w-3.5 h-3.5 animate-spin shrink-0" /> : <Power className="w-3.5 h-3.5 shrink-0" />}
              <span className="truncate">{isFullyOnline ? "Turn Off AI" : "Mulai Camera"}</span>
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="relative aspect-[4/3] sm:aspect-video bg-zinc-950 flex items-center justify-center overflow-hidden">
          {/* Cyber HUD OSD Overlay - Hidden on Mobile to prevent clutter */}
          <div className="hidden sm:flex absolute top-4 left-4 right-4 items-start justify-between pointer-events-none font-mono text-[9px] md:text-[10px] text-emerald-400 z-10">
            {/* Room and Location Details */}
            <div className="bg-zinc-950/85 px-2.5 py-1.5 rounded border border-zinc-850 space-y-0.5 shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
              <div className="flex items-center gap-1.5">
                <span className="text-zinc-550">CAM:</span>
                <span className="font-bold uppercase text-zinc-100">{roomName || "N/A"}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-zinc-550">LOC:</span>
                <span className="font-bold uppercase text-zinc-100">{floorName || "UNKNOWN"}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-zinc-550">CTRL:</span>
                <span className={`font-bold uppercase ${roomMode === "AUTO" ? "text-emerald-400" : "text-amber-400 animate-pulse"}`}>
                  {roomMode || "AUTO"}
                </span>
              </div>
            </div>

            {/* Power and Occupancy Metrics */}
            <div className="bg-zinc-950/85 px-2.5 py-1.5 rounded border border-zinc-850 space-y-0.5 text-right shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
              <div className="flex items-center justify-end gap-1.5">
                <span className="text-zinc-550">PWR:</span>
                <span className="font-bold text-zinc-100">{wattLoad !== undefined ? `${wattLoad.toFixed(1)}W` : "0.0W"}</span>
              </div>
              <div className="flex items-center justify-end gap-1.5">
                <span className="text-zinc-550">OCC:</span>
                <span className="font-bold text-zinc-100">{occupancy !== undefined ? `${occupancy} MHS` : "0 MHS"}</span>
              </div>
            </div>
          </div>

          {/* Active Devices status OSD - Hidden on Mobile */}
          <div className="hidden sm:block absolute bottom-4 left-4 bg-zinc-950/85 px-2.5 py-1.5 rounded border border-zinc-850 font-mono text-[9px] md:text-[10px] text-emerald-400 z-10 pointer-events-none space-y-1 shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
            <div className="text-zinc-550 font-bold uppercase text-[8px]">Device Status:</div>
            <div className="flex items-center gap-3 mt-0.5">
              <div className="flex items-center gap-1">
                <span className={`w-1.5 h-1.5 rounded-full ${activeDevices?.includes("Lampu") ? "bg-emerald-400" : "bg-zinc-700"}`} />
                <span className={activeDevices?.includes("Lampu") ? "text-zinc-100" : "text-zinc-650"}>LAMP</span>
              </div>
              <div className="flex items-center gap-1">
                <span className={`w-1.5 h-1.5 rounded-full ${activeDevices?.includes("AC") ? "bg-emerald-400 animate-pulse" : "bg-zinc-700"}`} />
                <span className={activeDevices?.includes("AC") ? "text-zinc-100" : "text-zinc-650"}>AC</span>
              </div>
              <div className="flex items-center gap-1">
                <span className={`w-1.5 h-1.5 rounded-full ${activeDevices?.includes("Stopkontak") ? "bg-emerald-400" : "bg-zinc-700"}`} />
                <span className={activeDevices?.includes("Stopkontak") ? "text-zinc-100" : "text-zinc-650"}>PLUG</span>
              </div>
            </div>
          </div>

          {/* Grid overlay effect */}
          <div
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: `
                linear-gradient(rgba(16, 185, 129, 0.3) 1px, transparent 1px),
                linear-gradient(90deg, rgba(16, 185, 129, 0.3) 1px, transparent 1px)
              `,
              backgroundSize: '40px 40px',
            }}
          />

          {/* Scan line effect */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
            <div
              className="absolute left-0 right-0 h-px bg-emerald-500/30 animate-pulse"
              style={{
                animation: 'scanline 3s linear infinite',
                top: '50%',
              }}
            />
          </div>

          {/* Stream Video YOLOv8 */}
          {status === "Online" ? (
            <div id="ai-camera-portal" className="absolute inset-0 z-0 pointer-events-none"></div>
          ) : null}

          {/* Aesthetic UI Overlay for Countdown */}
          {countdown !== null && countdown > 0 && (
            <div className="absolute inset-0 flex flex-col items-center justify-center z-20 pointer-events-none bg-red-950/40 backdrop-blur-[2px]">
              <div className="bg-zinc-950/90 px-8 py-5 rounded-xl border border-red-500/50 flex flex-col items-center animate-pulse shadow-[0_0_40px_rgba(239,68,68,0.5)]">
                <span className="text-red-500 font-bold text-sm tracking-widest mb-1">AI AUTO-CUTOFF</span>
                <span className="text-white text-6xl font-black tabular-nums">{countdown}</span>
                <span className="text-red-400 text-xs mt-2 tracking-widest">SECONDS REMAINING</span>
              </div>
            </div>
          )}

          {/* Energy Saving Standby Overlay */}
          {countdown === 0 && (
            <div className="absolute inset-0 flex flex-col items-center justify-center z-20 pointer-events-none bg-emerald-950/40 backdrop-blur-[2px] transition-all duration-1000">
              <div className="bg-zinc-950/90 px-8 py-5 rounded-xl border border-emerald-500/50 flex flex-col items-center shadow-[0_0_40px_rgba(16,185,129,0.3)]">
                <Power className="w-12 h-12 text-emerald-500 mb-2 opacity-80" />
                <span className="text-emerald-500 font-bold text-lg tracking-widest mb-1">ENERGY SAVING ACTIVE</span>
                <span className="text-emerald-400/80 text-xs text-center mt-1 tracking-widest">NO OCCUPANTS DETECTED<br/>DEVICES POWERED OFF</span>
              </div>
            </div>
          )}

          {/* Placeholder / Offline Mode */}
          <div id="stream-placeholder" className={`relative z-10 flex-col items-center gap-4 ${isFullyOnline ? "hidden" : "flex"}`}>
            <div className="w-20 h-20 rounded-full border-2 border-dashed border-zinc-700 flex items-center justify-center">
              <Camera className="w-10 h-10 text-zinc-600" />
            </div>
            <div className="text-center bg-zinc-950/80 px-4 py-2 rounded-lg">
              <p className="text-zinc-400 font-medium">Live AI Camera Feed</p>
              <p className="text-xs text-zinc-500 mt-1">{isFullyOnline ? "Menunggu Stream AI..." : "Sistem Offline / Standby"}</p>
            </div>
          </div>

          {/* Corner brackets */}
          <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-emerald-500/50" />
          <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-emerald-500/50" />
          <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-emerald-500/50" />
          <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-emerald-500/50" />
        </div>
      </CardContent>
    </Card>
  )
}

function classNameForStatus(status: string) {
  return `w-2 h-2 rounded-full ${status === "Online" || status === "Streaming" ? "bg-emerald-500 animate-pulse" : "bg-zinc-600"}`;
}

function classTextForStatus(status: string) {
  return `text-xs font-medium ${status === "Online" || status === "Streaming" ? "text-emerald-500" : "text-zinc-500"}`;
}
