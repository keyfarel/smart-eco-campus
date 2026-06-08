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
  totalRooms?: number
  automatedRooms?: number
}

export function ExecutivePremiumPanels({
  liveLoad,
  energySaved,
  financialSaved,
  co2Prevented,
  sparkLeaderboard = [],
  totalRooms = 1,
  automatedRooms = 0,
}: PremiumPanelsProps) {
  // Calculate dynamic Eco Score: 70% baseline + 30% based on AI automation adoption rate
  const ecoScore = Math.min(100, Math.round(70 + (automatedRooms / totalRooms) * 30))

  return (
    <TooltipProvider>
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        {/* 📊 1. RADIAL CAMPUS ECO SCORE */}
        <Card className="bg-zinc-900 border-zinc-800 overflow-hidden relative hover:border-emerald-500/20 transition-all duration-300 flex flex-col justify-between">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/[0.02] to-transparent pointer-events-none" />
          <CardHeader className="pb-2 border-b border-zinc-850/60 shrink-0">
            <CardTitle className="text-sm font-bold flex items-center justify-between text-foreground uppercase tracking-wider">
              <div className="flex items-center gap-2">
                <Activity className="w-4.5 h-4.5 text-emerald-500" />
                Eco-Campus Rating
              </div>
              <UITooltip>
                <TooltipTrigger asChild>
                  <button className="focus:outline-none p-1 -mr-1 rounded-md hover:bg-zinc-800 transition-colors">
                    <Info className="w-3.5 h-3.5 text-zinc-500 hover:text-emerald-500 transition-colors" />
                  </button>
                </TooltipTrigger>
                <TooltipContent className="bg-zinc-900 border-emerald-500/50 text-zinc-100 text-xs w-64 shadow-2xl p-3 leading-relaxed">
                  Skor Eco-Campus didapat dari rumus: 70% (skor dasar kampus) + 30% (rasio ruangan yang mengaktifkan Mode AI otomatisasi YOLOv8). Menyalakan otomatisasi AI di lebih banyak ruangan akan menaikkan skor ini menuju 100%.
                </TooltipContent>
              </UITooltip>
            </CardTitle>
            <CardDescription className="text-xs">University sustainability standing</CardDescription>
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
                  strokeDashoffset={2 * Math.PI * 54 * (1 - ecoScore / 100)}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center">
                <span className="text-3xl font-black text-foreground font-mono">{ecoScore}%</span>
                <span className="text-[8px] font-bold text-emerald-500 uppercase tracking-widest mt-0.5">ECO SCORE</span>
              </div>
              <div className="absolute w-28 h-28 rounded-full bg-emerald-500/5 blur-xl animate-pulse" />
            </div>
            <p className="mt-4 text-[10px] text-zinc-400 font-mono text-center uppercase tracking-widest">
              {automatedRooms} of {totalRooms} rooms active in AI mode
            </p>
          </CardContent>
        </Card>

        {/* 🏆 2. PYSPARK AI SAVINGS LEADERBOARD (Symmetrical 3 rows) */}
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
    </TooltipProvider>
  )
}

