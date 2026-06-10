"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useState, useEffect } from "react"
import type { ChartData, AnalyticsStats } from "@/features/analytics"
import { useSuperAdminStats } from "./use-super-admin-stats"

export function useSuperAdminDashboard(initialTimeRange: string, rawLogs: any[], analyticsStats: AnalyticsStats) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const { stats: realtimeStats } = useSuperAdminStats()

  const handleTimeRangeChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("timeRange", value)
    router.push(`?${params.toString()}`, { scroll: false })
  }

  const [liveChartData, setLiveChartData] = useState<ChartData[]>([])
  const [liveStats, setLiveStats] = useState<AnalyticsStats>({
    total: analyticsStats.total || 0,
    peak: analyticsStats.peak || 0,
    cost: analyticsStats.cost || 0,
    peakTime: analyticsStats.peakTime || "—"
  })

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
        const kwhIncrement = (currentPower / 1000) * (3 / 3600);
        const newTotal = prev.total + kwhIncrement;
        const isNewPeak = currentPower > prev.peak;

        return {
          total: parseFloat(newTotal.toFixed(4)),
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

  const isLiveMode = initialTimeRange === "live"
  const displayIsEmpty = !isLiveMode && rawLogs.length === 0

  return {
    timeRange: initialTimeRange,
    handleTimeRangeChange,
    liveChartData,
    liveStats,
    isLiveMode,
    displayIsEmpty
  }
}
