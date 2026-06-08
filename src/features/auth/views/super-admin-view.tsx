"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useState, useEffect } from "react"
import { motion, Variants } from "framer-motion"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"

import { TooltipProvider } from "@/components/ui/tooltip"
import { StatsCards } from "@/features/analytics/components/analytics/stats-cards"
import { UsagePatternChart } from "@/features/analytics/components/analytics/usage-pattern-chart"

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
              <div className="flex flex-col gap-0.5 sm:gap-2">
                <h1 className="text-lg sm:text-2xl font-bold text-foreground leading-tight">Dashboard IoT</h1>
                <p className="text-xs sm:text-sm text-muted-foreground max-w-xl">
                  Pantau Telemetri & Energi Real-time
                </p>
              </div>


            </div>

            {/* Time Controls moved to Main Header */}
            <div className="flex w-full sm:w-auto mt-2 sm:mt-0">
              <Tabs value={timeRange} onValueChange={handleTimeRangeChange} className="w-full sm:w-fit">
                <TabsList className="grid w-full grid-cols-4 sm:inline-flex bg-zinc-900 border border-zinc-800 p-1 rounded-xl h-auto">
                  <TabsTrigger value="live" className="relative overflow-hidden rounded-lg data-[state=active]:bg-red-500 data-[state=active]:text-white transition-all text-[10px] sm:text-xs font-bold h-8 sm:h-7 px-1 sm:px-4 flex items-center justify-center gap-1.5">
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-white"></span>
                    </span>
                    Live
                  </TabsTrigger>
                  <TabsTrigger value="24h" className="rounded-lg data-[state=active]:bg-emerald-500 data-[state=active]:text-white transition-all text-[10px] sm:text-xs font-semibold h-8 sm:h-7 px-1 sm:px-4">Daily</TabsTrigger>
                  <TabsTrigger value="7d" className="rounded-lg data-[state=active]:bg-emerald-500 data-[state=active]:text-white transition-all text-[10px] sm:text-xs font-semibold h-8 sm:h-7 px-1 sm:px-4">Weekly</TabsTrigger>
                  <TabsTrigger value="30d" className="rounded-lg data-[state=active]:bg-emerald-500 data-[state=active]:text-white transition-all text-[10px] sm:text-xs font-semibold h-8 sm:h-7 px-1 sm:px-4">Monthly</TabsTrigger>
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
        <div className="grid grid-cols-1 gap-6 pb-12">
          <UsagePatternChart 
            data={isLiveMode ? liveChartData : mainData} 
            chartVariants={cardVariants} 
            isEmpty={displayIsEmpty} 
            isLiveMode={isLiveMode}
          />
        </div>
      </motion.div>
      </div>
    </TooltipProvider>
  )
}
