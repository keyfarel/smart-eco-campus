"use client"

import { useEffect, useState } from "react"
import { Award, Trophy, ShieldCheck, Sparkles, Activity, CheckCircle2, Info } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
  Tooltip as UITooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip"

interface SparkLeaderboardItem {
  id: string
  name: string
  savings: number
  kwh: number
}

interface PremiumPanelsProps {
  liveLoad: number
  energySaved: number
  financialSaved: number
  co2Prevented: number
  sparkLeaderboard?: SparkLeaderboardItem[]
  activeNodes?: number
  managedRelays?: number
}

export function ExecutivePremiumPanels({
  liveLoad,
  energySaved,
  financialSaved,
  co2Prevented,
  sparkLeaderboard = [],
  activeNodes = 0,
  managedRelays = 0,
}: PremiumPanelsProps) {

  // Calculate percentage of active vs expected (just an aesthetic visualizer, assuming 1 node = 100% for the radial)
  const fleetScore = activeNodes > 0 ? 100 : 0

  return (
    <TooltipProvider>
      <>
        {/* MOBILE VIEW */}
        <div className="sm:hidden rounded-xl border bg-zinc-900/50 border-zinc-800 backdrop-blur-sm overflow-hidden shadow-sm flex flex-col mt-4">
          {/* Section 1: IoT Edge Fleet */}
          <div className="p-3 border-b border-zinc-800/80 bg-zinc-950/30 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-full bg-emerald-500/10">
                <Activity className="w-4 h-4 text-emerald-500" />
              </div>
              <div className="flex flex-col">
                <p className="text-[11px] font-bold text-foreground uppercase tracking-widest leading-tight">
                  IoT Edge Fleet
                </p>
                <p className="text-[9px] text-zinc-500 font-mono">Live Endpoints</p>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <p className="text-sm font-bold text-emerald-500 font-mono">{activeNodes} <span className="text-[10px] text-zinc-400">NODES</span></p>
              <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">{managedRelays} Relays</p>
            </div>
          </div>

          {/* Section 2: Top AI Savings */}
          <div className="p-3 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Award className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Top AI Savings</span>
              </div>
              <span className="text-[8px] text-zinc-600 font-mono">PySpark ETL</span>
            </div>

            <div className="flex flex-col gap-2">
              {sparkLeaderboard.length === 0 ? (
                <div className="text-center py-2 text-[10px] text-zinc-550 font-mono uppercase tracking-widest">
                  Awaiting Spark Data...
                </div>
              ) : (
                sparkLeaderboard.slice(0, 3).map((item, idx) => (
                  <div key={item.id} className="flex items-center justify-between bg-zinc-950/40 p-2 rounded-lg border border-zinc-800/50">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className={`w-5 h-5 rounded-md flex items-center justify-center font-black text-[10px] shrink-0 ${
                        idx === 0 ? "bg-emerald-500/10 text-emerald-400" : "bg-zinc-800 text-zinc-400"
                      }`}>
                        #{idx + 1}
                      </div>
                      <div className="min-w-0">
                        <h5 className="text-[10px] font-bold text-zinc-300 uppercase leading-none truncate">{item.name}</h5>
                        <p className="text-[8px] text-zinc-500 mt-0.5 font-mono">Saved: {item.kwh.toFixed(2)} KWh</p>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-[10px] font-black text-emerald-450 block font-mono">Rp {item.savings.toLocaleString("id-ID")}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* DESKTOP VIEW */}
        <div className="hidden sm:grid gap-6 grid-cols-1 lg:grid-cols-2">
          {/* 📡 1. IOT EDGE FLEET STATUS */}
          <Card className="bg-zinc-900 border-zinc-800 overflow-hidden relative hover:border-emerald-500/20 transition-all duration-300 flex flex-col justify-between">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/[0.02] to-transparent pointer-events-none" />
            <CardHeader className="pb-2 border-b border-zinc-850/60 shrink-0">
              <CardTitle className="text-sm font-bold flex items-center justify-between text-foreground uppercase tracking-wider">
                <div className="flex items-center gap-2">
                  <Activity className="w-4.5 h-4.5 text-emerald-500" />
                  IoT Edge Fleet Status
                </div>
                <UITooltip>
                  <TooltipTrigger asChild>
                    <button className="focus:outline-none p-1 -mr-1 rounded-md hover:bg-zinc-800 transition-colors">
                      <Info className="w-3.5 h-3.5 text-zinc-500 hover:text-emerald-500 transition-colors" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent className="bg-zinc-900 border-emerald-500/50 text-zinc-100 text-xs w-64 shadow-2xl p-3 leading-relaxed">
                    Menampilkan skala infrastruktur IoT (ESP32) yang aktif memancarkan telemetri secara real-time ke Firebase, beserta total Relay alat (Lampu & Kipas) yang sedang dipantau/dikendalikan oleh sistem.
                  </TooltipContent>
                </UITooltip>
              </CardTitle>
              <CardDescription className="text-xs">Live Connected Endpoints & Managed Relays</CardDescription>
            </CardHeader>
            <CardContent className="py-6 flex flex-col items-center justify-center flex-grow relative z-10 min-h-[220px]">
              {/* Neon Radial Progress Gauge */}
              <div className="relative flex items-center justify-center shrink-0">
                <svg className="w-32 h-32 transform -rotate-90">
                  <circle
                    cx="64"
                    cy="64"
                    r="54"
                    className="stroke-zinc-800"
                    strokeWidth="8"
                    fill="transparent"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="54"
                    className="stroke-emerald-500 transition-all duration-1000 ease-out"
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray={2 * Math.PI * 54}
                    strokeDashoffset={2 * Math.PI * 54 * (1 - fleetScore / 100)}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute flex flex-col items-center justify-center">
                  <span className="text-3xl font-black text-foreground font-mono">{activeNodes}</span>
                  <span className="text-[8px] font-bold text-emerald-500 uppercase tracking-widest mt-0.5">ACTIVE NODES</span>
                </div>
                <div className="absolute w-28 h-28 rounded-full bg-emerald-500/5 blur-xl animate-pulse" />
              </div>
              <p className="mt-4 text-[11px] text-zinc-400 font-mono text-center uppercase tracking-widest font-bold">
                {managedRelays} <span className="text-emerald-500">Relays Managed</span>
              </p>
            </CardContent>
          </Card>

          {/* 🏆 2. PYSPARK AI SAVINGS LEADERBOARD */}
          <Card className="bg-zinc-900 border-zinc-800 overflow-hidden relative hover:border-emerald-500/20 transition-all duration-300 flex flex-col justify-between">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/[0.01] to-transparent pointer-events-none" />
            <CardHeader className="pb-2 border-b border-zinc-850/60 shrink-0">
              <CardTitle className="text-sm font-bold flex items-center justify-between text-foreground uppercase tracking-wider">
                <div className="flex items-center gap-2">
                  <Award className="w-4.5 h-4.5 text-emerald-500" />
                  Top AI Savings
                </div>
                <UITooltip>
                  <TooltipTrigger asChild>
                    <button className="focus:outline-none p-1 -mr-1 rounded-md hover:bg-zinc-800 transition-colors">
                      <Info className="w-3.5 h-3.5 text-zinc-500 hover:text-emerald-500 transition-colors" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent className="bg-zinc-900 border-emerald-500/50 text-zinc-100 text-xs w-64 shadow-2xl p-3 leading-relaxed">
                    Peringkat Top Ruangan ini diekstrak dan dihitung secara REAL-TIME oleh Apache Spark (Hadoop VM) menggunakan Window Function lag() berdasarkan data Firebase. Menjamin akurasi 100% tanpa overclaim log manual.
                  </TooltipContent>
                </UITooltip>
              </CardTitle>
              <CardDescription className="text-xs">Extracted via PySpark ETL Data</CardDescription>
            </CardHeader>
            <CardContent className="py-5 space-y-3 flex-grow flex flex-col relative z-10">
              {sparkLeaderboard.length === 0 ? (
                <div className="flex items-center justify-center flex-grow py-6 text-zinc-550 text-xs font-mono tracking-widest uppercase">
                  Awaiting Spark Data...
                </div>
              ) : (
                sparkLeaderboard.slice(0, 3).map((item, idx) => (
                  <div 
                    key={item.id} 
                    className="flex items-center justify-between p-3 rounded-xl bg-zinc-950/40 border border-zinc-850/80 hover:border-emerald-500/20 transition-all duration-200"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-black text-xs shrink-0 ${
                        idx === 0 
                          ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400" 
                          : "bg-zinc-800 border border-zinc-700 text-zinc-400"
                      }`}>
                        #{idx + 1}
                      </div>
                      <div className="min-w-0">
                        <h5 className="text-xs font-bold text-zinc-300 uppercase leading-none truncate">{item.name}</h5>
                        <p className="text-[9px] text-zinc-500 mt-1 font-mono">
                          Saved: {item.kwh.toFixed(2)} KWh
                        </p>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-xs font-black text-emerald-450 block font-mono">Rp {item.savings.toLocaleString("id-ID")}</span>
                      <span className="text-[8px] font-bold text-zinc-550 uppercase tracking-widest">SAVED</span>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </>
    </TooltipProvider>
  )
}

