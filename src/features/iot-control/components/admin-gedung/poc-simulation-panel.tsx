"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Settings, RefreshCw } from "lucide-react"

interface PocSimulationPanelProps {
  activeRoom: string
  occupancy: number
  countdown: number | null
  roomAutomation: Record<string, boolean>
  handleSetOccupancy: (count: number) => void
  toggleRoomAutomation: (room: string) => void
  triggerDailyAutoRevert: () => void
}

export function PocSimulationPanel({
  activeRoom,
  occupancy,
  countdown,
  roomAutomation,
  handleSetOccupancy,
  toggleRoomAutomation,
  triggerDailyAutoRevert,
}: PocSimulationPanelProps) {
  return (
    <Card className="bg-background border-zinc-800 shadow-[0_0_20px_rgba(245,158,11,0.02)]">
      <CardHeader className="pb-3 border-b border-zinc-850">
        <div className="flex items-center gap-2">
          <Settings className="w-4 h-4 text-amber-500 animate-spin-slow" />
          <CardTitle className="text-sm font-bold text-foreground">Panel Simulasi PoC (PRD v7.8)</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="pt-4 space-y-4">
        {/* 1. Occupancy Simulation Buttons */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-400">Okupansi YOLOv8 ({activeRoom})</span>
            <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/30 border border-emerald-500/20 px-2 py-0.5 rounded">
              {occupancy} Orang
            </span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => handleSetOccupancy(0)}
              className="flex-1 py-1.5 bg-red-950/20 hover:bg-red-500/10 border border-red-500/20 hover:border-red-500/30 text-[10px] font-bold text-red-400 rounded-lg transition-all"
            >
              Set 0 (Kosong)
            </button>
            <button
              onClick={() => handleSetOccupancy(Math.max(0, occupancy - 1))}
              className="flex-1 py-1.5 bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-[10px] font-bold text-zinc-300 rounded-lg transition-all"
            >
              -1 Orang
            </button>
            <button
              onClick={() => handleSetOccupancy(occupancy + 1)}
              className="flex-1 py-1.5 bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-[10px] font-bold text-zinc-300 rounded-lg transition-all"
            >
              +1 Orang
            </button>
          </div>
        </div>

        {/* Countdown Display if active */}
        {countdown !== null && (
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-2.5 flex items-center justify-between text-xs text-amber-500 animate-pulse">
            <span className="font-bold">Countdown Grace Period AI:</span>
            <span className="font-mono font-bold text-sm">{countdown}s</span>
          </div>
        )}

        {/* 2. Mode Selector for active room */}
        <div className="pt-3 border-t border-zinc-850 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-xs font-bold text-zinc-400">Mode AI Aktif ({activeRoom})</span>
            <span className="text-[10px] text-zinc-500">Auto-cutoff dinonaktifkan jika Override</span>
          </div>
          <button
            onClick={() => toggleRoomAutomation(activeRoom)}
            className={`px-3 py-1 rounded-lg border text-[10px] font-bold transition-all ${
              roomAutomation[activeRoom] !== false
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                : "bg-amber-500/10 border-amber-500/30 text-amber-400"
            }`}
          >
            {roomAutomation[activeRoom] !== false ? "AI AUTO" : "OVERRIDE"}
          </button>
        </div>

        {/* 3. Daily Auto Revert Button */}
        <div className="pt-3 border-t border-zinc-850">
          <button
            onClick={triggerDailyAutoRevert}
            className="w-full py-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-zinc-950 font-bold rounded-lg text-xs transition-all shadow-[0_0_15px_rgba(16,185,129,0.1)] flex items-center justify-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5 text-zinc-950 animate-spin-slow" />
            <span>Simulasikan Cron Job (00:00 WIB)</span>
          </button>
          <p className="text-[9px] text-center text-zinc-500 mt-2">
            Menyapu bersih seluruh mode ruangan kembali ke otonom AI Auto
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
