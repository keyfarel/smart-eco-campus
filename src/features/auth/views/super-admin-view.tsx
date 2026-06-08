"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useState, useEffect } from "react"
import { motion, Variants } from "framer-motion"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { MethodologyDialog } from "@/features/analytics/components/analytics/methodology-dialog"
import { TooltipProvider } from "@/components/ui/tooltip"
import { StatsCards } from "@/features/analytics/components/analytics/stats-cards"
import { UsagePatternChart } from "@/features/analytics/components/analytics/usage-pattern-chart"
import { UsageDistributionChart } from "@/features/analytics/components/analytics/usage-distribution-chart"
import { ChartData, AnalyticsStats } from "@/features/analytics/services/analytics-service"
import { Shield, Server, Activity, Users, DatabaseBackup, Loader2 } from "lucide-react"
import { useSuperAdminStats } from "../hooks/use-super-admin-stats"
import { Card, CardContent } from "@/components/ui/card"

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
}

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.5, ease: "easeOut" } 
  }
}

interface SuperAdminViewProps {
  timeRange: string
  rawLogs: any[]
  mainData: ChartData[]
  analyticsStats: AnalyticsStats
}

export function SuperAdminView({
  timeRange,
  rawLogs,
  mainData,
  analyticsStats
}: SuperAdminViewProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Firebase Realtime Stats
  const { stats: realtimeStats } = useSuperAdminStats()

  const handleTimeRangeChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("timeRange", value)
    router.push(`?${params.toString()}`, { scroll: false })
  }

  // Live Chart & Stats State
  const [liveChartData, setLiveChartData] = useState<ChartData[]>([])
  const [liveStats, setLiveStats] = useState<AnalyticsStats>({
    total: analyticsStats.total || 0,
    peak: analyticsStats.peak || 0,
    cost: analyticsStats.cost || 0,
    peakTime: analyticsStats.peakTime || "—"
  })

  // Sinkronisasi jika prop analyticsStats berubah (misal ganti tab 7d/30d)
  useEffect(() => {
    setLiveStats({
      total: analyticsStats.total || 0,
      peak: analyticsStats.peak || 0,
      cost: analyticsStats.cost || 0,
      peakTime: analyticsStats.peakTime || "—"
    })
  }, [analyticsStats])

  useEffect(() => {
    const interval = setInterval(() => {
      const currentPower = realtimeStats.powerLoad || 0;
      const now = new Date();
      const timeStr = now.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", second: "2-digit" });

      setLiveChartData(prev => {
        const newDataPoint = { time: timeStr, watt: currentPower }
        const nextData = [...prev, newDataPoint]
        if (nextData.length > 20) {
          return nextData.slice(nextData.length - 20)
        }
        return nextData
      })

      setLiveStats(prev => {
        // Kalkulasi akumulasi energi untuk durasi interval (3 detik)
        // 3 detik = 3 / 3600 jam
        const kwhIncrement = (currentPower / 1000) * (3 / 3600);
        const newTotal = prev.total + kwhIncrement;
        const isNewPeak = currentPower > prev.peak;

        return {
          total: parseFloat(newTotal.toFixed(4)), // presisi 4 desimal agar nampak berubah perlahan
          peak: isNewPeak ? currentPower : prev.peak,
          cost: Math.round(newTotal * 1444),
          peakTime: isNewPeak 
            ? now.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) 
            : prev.peakTime
        }
      })
    }, 3000)

    return () => clearInterval(interval)
  }, [realtimeStats.powerLoad])

  // Menentukan mode saat ini
  const isLiveMode = timeRange === "live"
  
  // State untuk tombol manual archive
  // Menentukan kapan harus menampilkan peringatan kosong untuk mode historis
  const displayIsEmpty = !isLiveMode && rawLogs.length === 0

  return (
    <TooltipProvider>
      <div className="relative min-h-screen">
        <motion.div 
          className="flex flex-col gap-6 relative z-10"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          {/* SINGLE UNIFIED HEADER WITH REALTIME BADGES */}
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 pb-6">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-emerald-500" />
                  <span className="text-xs font-mono font-bold tracking-wider text-emerald-500 uppercase">Super Admin Portal</span>
                </div>
                <h1 className="text-2xl font-bold text-foreground">Pusat Kendali & Analitik</h1>
                <p className="text-sm text-muted-foreground max-w-xl">
                  Sistem manajemen terpusat untuk topologi IoT, pemantauan telemetri real-time, dan analitik energi kampus.
                </p>
              </div>

              {/* Realtime Badges */}
              <div className="flex items-center gap-3 flex-wrap mt-2">
                <div className="flex items-center gap-2 bg-zinc-900/80 border border-zinc-800 px-3 py-1.5 rounded-lg shadow-sm">
                  <span className="relative flex h-2 w-2 mr-1">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <Server className="w-3.5 h-3.5 text-zinc-400" />
                  <span className="text-xs text-zinc-400 font-medium">Node Aktif:</span>
                  <span className="text-xs font-bold text-emerald-400">{realtimeStats.activeNodes}</span>
                </div>

                <div className="flex items-center gap-2 bg-zinc-900/80 border border-zinc-800 px-3 py-1.5 rounded-lg shadow-sm">
                  <Activity className="w-3.5 h-3.5 text-zinc-400" />
                  <span className="text-xs text-zinc-400 font-medium">Beban:</span>
                  <span className="text-xs font-bold text-emerald-400">
                    {realtimeStats.powerLoad >= 1000 
                      ? `${(realtimeStats.powerLoad / 1000).toFixed(2)} kW` 
                      : `${(realtimeStats.powerLoad || 0).toFixed(1)} W`}
                  </span>
                </div>

                <div className="flex items-center gap-2 bg-zinc-900/80 border border-zinc-800 px-3 py-1.5 rounded-lg shadow-sm">
                  <Users className="w-3.5 h-3.5 text-zinc-400" />
                  <span className="text-xs text-zinc-400 font-medium">Users:</span>
                  <span className="text-xs font-bold text-emerald-400">{realtimeStats.userCount}</span>
                </div>
              </div>
            </div>

            {/* Time Controls moved to Main Header */}
            <div className="flex items-center gap-3">
              <MethodologyDialog />
              <Tabs value={timeRange} onValueChange={handleTimeRangeChange} className="w-fit">
                <TabsList className="bg-zinc-900 border border-zinc-800 p-1 rounded-xl">
                  <TabsTrigger value="live" className="relative overflow-hidden rounded-lg data-[state=active]:bg-red-500 data-[state=active]:text-white transition-all text-xs font-bold h-7 px-4 flex items-center gap-1.5">
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-white"></span>
                    </span>
                    Live
                  </TabsTrigger>
                  <TabsTrigger value="24h" className="rounded-lg data-[state=active]:bg-emerald-500 data-[state=active]:text-white transition-all text-xs font-semibold h-7 px-4">Daily</TabsTrigger>
                  <TabsTrigger value="7d" className="rounded-lg data-[state=active]:bg-emerald-500 data-[state=active]:text-white transition-all text-xs font-semibold h-7 px-4">Weekly</TabsTrigger>
                  <TabsTrigger value="30d" className="rounded-lg data-[state=active]:bg-emerald-500 data-[state=active]:text-white transition-all text-xs font-semibold h-7 px-4">Monthly</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            {/* Analytics Stats (4 cols) directly below */}
            <StatsCards 
              stats={isLiveMode ? liveStats : analyticsStats} 
              cardVariants={cardVariants} 
              isLiveMode={isLiveMode}
            />
          </div>

          {/* Analytics Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-12">
          <UsagePatternChart 
            data={isLiveMode ? liveChartData : mainData} 
            chartVariants={cardVariants} 
            isEmpty={displayIsEmpty} 
            isLiveMode={isLiveMode}
          />

          <UsageDistributionChart 
            chartVariants={cardVariants} 
            isEmpty={displayIsEmpty}
          />
        </div>
      </motion.div>
      </div>
    </TooltipProvider>
  )
}
