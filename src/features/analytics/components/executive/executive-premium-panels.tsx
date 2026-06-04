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

interface PremiumPanelsProps {
  liveLoad: number
  energySaved: number
  financialSaved: number
  co2Prevented: number
}

interface BuildingRank {
  id: string
  name: string
  adoptionRate: number
  savings: number
  totalBuildingRooms: number
  automatedRooms: number
}

export function ExecutivePremiumPanels({
  liveLoad,
  energySaved,
  financialSaved,
  co2Prevented,
}: PremiumPanelsProps) {
  const [automatedCount, setAutomatedCount] = useState(0)
  const [totalRooms, setTotalRooms] = useState(1)
  const [leaderboard, setLeaderboard] = useState<BuildingRank[]>([])

  useEffect(() => {
    const fetchBuildingsAndAutomation = async () => {
      try {
        const res = await fetch("/api/buildings")
        if (!res.ok) return
        const buildings = await res.json()

        let devicesList: any[] = []
        let roomAutomation: Record<string, boolean> = {}

        if (typeof window !== "undefined") {
          const savedDevices = localStorage.getItem("smart-campus-devices")
          const savedAuto = localStorage.getItem("smart-campus-room-automation")
          if (savedDevices) {
            try { devicesList = JSON.parse(savedDevices) } catch(e) {}
          }
          if (savedAuto) {
            try { roomAutomation = JSON.parse(savedAuto) } catch(e) {}
          }
        }

        // 1. Gather all rooms list: prioritize devices in localStorage, fall back to DB API rooms list
        let roomsList: string[] = []
        if (devicesList && devicesList.length > 0) {
          roomsList = Array.from(new Set(devicesList.map((d) => d.location)))
        } else {
          buildings.forEach((b: any) => {
            (b.rooms || []).forEach((r: any) => {
              roomsList.push(r.name)
            })
          })
        }

        // Count automated rooms overall
        const totalDbRooms = roomsList.length || 1
        setTotalRooms(totalDbRooms)

        const count = roomsList.filter((roomName) => {
          return roomAutomation[roomName] !== false
        }).length
        setAutomatedCount(count)

        // 2. Group roomsList dynamically by building (matching device-control-tab.tsx grouping logic)
        const buildingGroups: Record<string, { total: number; automated: number }> = {}
        
        // Initialize groups for all buildings in DB
        buildings.forEach((b: any) => {
          buildingGroups[b.id] = { total: 0, automated: 0 }
        })

        // Group rooms dynamically
        roomsList.forEach((roomName) => {
          // Find building that contains this room name in DB
          const parentBuilding = buildings.find((b: any) =>
            (b.rooms || []).some((r: any) => r.name === roomName)
          )
          // Fall back to the first building (gedung_a) if not registered in DB
          const bId = parentBuilding ? parentBuilding.id : (buildings[0]?.id || "gedung_a")
          
          if (!buildingGroups[bId]) {
            buildingGroups[bId] = { total: 0, automated: 0 }
          }
          
          buildingGroups[bId].total += 1
          if (roomAutomation[roomName] !== false) {
            buildingGroups[bId].automated += 1
          }
        })

        // Convert grouped data to BuildingRank list
        const computed: BuildingRank[] = buildings.map((b: any) => {
          const group = buildingGroups[b.id] || { total: 0, automated: 0 }
          const totalBuildingRooms = group.total
          const automatedRooms = group.automated

          const adoptionRate = totalBuildingRooms > 0 
            ? Math.round((automatedRooms / totalBuildingRooms) * 100) 
            : 0
          
          // Base savings: 185.5 kWh * automated rooms count * 1444 IDR rate
          const energySavedKwh = automatedRooms * 185.5
          const buildingSavings = Math.round(energySavedKwh * 1444)

          return {
            id: b.id,
            name: b.name,
            adoptionRate,
            savings: buildingSavings,
            totalBuildingRooms,
            automatedRooms
          }
        })

        // Sort descending by savings
        computed.sort((a, b) => b.savings - a.savings)
        setLeaderboard(computed)
      } catch (e) {
        console.error("[executive-premium-panels] Error synchronizing leaderboards:", e)
      }
    }

    fetchBuildingsAndAutomation()
    const interval = setInterval(fetchBuildingsAndAutomation, 30000)
    return () => clearInterval(interval)
  }, [])

  // Calculate dynamic Eco Score: 70% baseline + 30% based on AI automation adoption rate
  const ecoScore = Math.min(100, Math.round(70 + (automatedCount / totalRooms) * 30))

  return (
    <TooltipProvider>
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
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
              {automatedCount} of {totalRooms} rooms active in AI mode
            </p>
          </CardContent>
        </Card>

        {/* 🏆 2. ACHIEVEMENT MILESTONES (Symmetrical 3 rows) */}
        <Card className="bg-zinc-900 border-zinc-800 overflow-hidden relative hover:border-emerald-500/20 transition-all duration-300 flex flex-col justify-between">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/[0.01] to-transparent pointer-events-none" />
          <CardHeader className="pb-2 border-b border-zinc-850/60 shrink-0">
            <CardTitle className="text-sm font-bold flex items-center justify-between text-foreground uppercase tracking-wider">
              <div className="flex items-center gap-2">
                <Trophy className="w-4.5 h-4.5 text-amber-500" />
                Green Milestones
              </div>
              <UITooltip>
                <TooltipTrigger asChild>
                  <button className="focus:outline-none p-1 -mr-1 rounded-md hover:bg-zinc-800 transition-colors">
                    <Info className="w-3.5 h-3.5 text-zinc-500 hover:text-emerald-500 transition-colors" />
                  </button>
                </TooltipTrigger>
                <TooltipContent className="bg-zinc-900 border-emerald-500/50 text-zinc-100 text-xs w-64 shadow-2xl p-3 leading-relaxed">
                  Milestones keberlanjutan kampus. Akreditasi aktif didapat dari audit sistem, rasio AI otomatisasi mewakili jangkauan YOLOv8, dan reduksi CO2 dihitung secara ilmiah berdasarkan faktor emisi grid listrik PLN (0.87 kg CO2 / kWh).
                </TooltipContent>
              </UITooltip>
            </CardTitle>
            <CardDescription className="text-xs">University sustainability goals</CardDescription>
          </CardHeader>
          <CardContent className="py-5 space-y-3 flex-grow justify-between flex flex-col relative z-10">
            {/* Milestone 1 */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-950/40 border border-zinc-850/80 hover:border-emerald-500/10 transition-all duration-200">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <h5 className="text-xs font-bold text-zinc-300 uppercase leading-none truncate">Accreditation</h5>
                  <p className="text-[9px] text-emerald-500 mt-1 font-mono">Green Campus Tier A</p>
                </div>
              </div>
              <div className="text-right shrink-0">
                <span className="text-[10px] font-black text-emerald-400 block font-mono">ACTIVE</span>
              </div>
            </div>

            {/* Milestone 2 */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-950/40 border border-zinc-850/80 hover:border-emerald-500/10 transition-all duration-200">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <h5 className="text-xs font-bold text-zinc-300 uppercase leading-none truncate">AI Coverage</h5>
                  <p className="text-[9px] text-zinc-500 mt-1 font-mono">YOLOv8 Automation Hub</p>
                </div>
              </div>
              <div className="text-right shrink-0">
                <span className="text-[10px] font-black text-emerald-400 block font-mono">
                  {Math.round((automatedCount / totalRooms) * 100)}%
                </span>
              </div>
            </div>

            {/* Milestone 3 */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-950/40 border border-zinc-850/80 hover:border-emerald-500/10 transition-all duration-200">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-7 h-7 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-550 shrink-0">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <h5 className="text-xs font-bold text-zinc-300 uppercase leading-none truncate">CO2 Prevented</h5>
                  <p className="text-[9px] text-zinc-500 mt-1 font-mono">Carbon Neutral Pioneer</p>
                </div>
              </div>
              <div className="text-right shrink-0">
                <span className="text-[10px] font-black text-zinc-400 block font-mono">
                  {co2Prevented} T
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 🏆 3. BUILDING SUSTAINABILITY LEADERBOARD (Symmetrical 3 rows) */}
        <Card className="bg-zinc-900 border-zinc-800 overflow-hidden relative hover:border-emerald-500/20 transition-all duration-300 flex flex-col justify-between">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/[0.01] to-transparent pointer-events-none" />
          <CardHeader className="pb-2 border-b border-zinc-850/60 shrink-0">
            <CardTitle className="text-sm font-bold flex items-center justify-between text-foreground uppercase tracking-wider">
              <div className="flex items-center gap-2">
                <Award className="w-4.5 h-4.5 text-emerald-500" />
                Leaderboard
              </div>
              <UITooltip>
                <TooltipTrigger asChild>
                  <button className="focus:outline-none p-1 -mr-1 rounded-md hover:bg-zinc-800 transition-colors">
                    <Info className="w-3.5 h-3.5 text-zinc-500 hover:text-emerald-500 transition-colors" />
                  </button>
                </TooltipTrigger>
                <TooltipContent className="bg-zinc-900 border-emerald-500/50 text-zinc-100 text-xs w-64 shadow-2xl p-3 leading-relaxed">
                  Peringkat efisiensi gedung dihitung berdasarkan akumulasi ruangan ter-otomatisasi AI di masing-masing gedung. Setiap ruangan yang di-otomatisasikan menghemat Rp 267.862,- per periode (185.5 kWh x Rp 1.444,- tarif PLN).
                </TooltipContent>
              </UITooltip>
            </CardTitle>
            <CardDescription className="text-xs">Highest financial efficiency rankings</CardDescription>
          </CardHeader>
          <CardContent className="py-5 space-y-3 flex-grow justify-between flex flex-col relative z-10">
            {leaderboard.length === 0 ? (
              <div className="text-center py-6 text-zinc-550 text-xs font-mono tracking-widest uppercase">
                Loading rankings...
              </div>
            ) : (
              leaderboard.slice(0, 3).map((item, idx) => (
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
                        {item.adoptionRate}% AI ({item.automatedRooms}/{item.totalBuildingRooms} Rooms)
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
