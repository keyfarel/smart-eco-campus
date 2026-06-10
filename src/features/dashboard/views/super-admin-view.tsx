"use client"

import { motion, Variants } from "framer-motion"
import { TooltipProvider } from "@/components/ui/tooltip"
import { StatsCards, UsagePatternChart, type ChartData, type AnalyticsStats } from "@/features/analytics"
import { useSuperAdminDashboard } from "../hooks/use-super-admin-dashboard"
import { SuperAdminHeader } from "../components/super-admin/super-admin-header"

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
  const state = useSuperAdminDashboard(timeRange, rawLogs, analyticsStats)

  return (
    <TooltipProvider>
      <div className="relative min-h-screen">
        <motion.div 
          className="flex flex-col gap-6 relative z-10"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <SuperAdminHeader 
            timeRange={state.timeRange} 
            onTimeRangeChange={state.handleTimeRangeChange} 
          />

          <div className="flex flex-col gap-4">
            <StatsCards 
              stats={state.isLiveMode ? state.liveStats : analyticsStats} 
              cardVariants={cardVariants} 
              isLiveMode={state.isLiveMode}
            />
          </div>

          <div className="grid grid-cols-1 gap-6 pb-12">
            <UsagePatternChart 
              data={state.isLiveMode ? state.liveChartData : mainData} 
              chartVariants={cardVariants} 
              isEmpty={state.displayIsEmpty} 
              isLiveMode={state.isLiveMode}
            />
          </div>
        </motion.div>
      </div>
    </TooltipProvider>
  )
}
