"use client"

import { useRouter } from "next/navigation"
import { motion, Variants } from "framer-motion"
import { AnalyticsHeader } from "../components/analytics/analytics-header"
import { StatsCards } from "../components/analytics/stats-cards"
import { UsagePatternChart } from "../components/analytics/usage-pattern-chart"
import { UsageDistributionChart } from "../components/analytics/usage-distribution-chart"
import type { HistoryRecord, ChartData, AnalyticsStats } from "../services/analytics-service"

interface AnalyticsViewProps {
  timeRange: string
  rawLogs: HistoryRecord[]
  mainData: ChartData[]
  stats: AnalyticsStats
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 24 }
  }
}

export function AnalyticsView({ timeRange, rawLogs, mainData, stats }: AnalyticsViewProps) {
  const router = useRouter()

  const handleTimeRangeChange = (value: string) => {
    router.push(`/executive/analytics?timeRange=${value}`)
  }

  return (
    <motion.div 
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants}>
        <AnalyticsHeader timeRange={timeRange} onTimeRangeChange={handleTimeRangeChange} />
      </motion.div>
      
      <StatsCards stats={stats} cardVariants={itemVariants} />
      
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <motion.div variants={itemVariants} className="h-full">
          <UsagePatternChart data={mainData} chartVariants={itemVariants} isEmpty={mainData.length === 0} />
        </motion.div>
        <motion.div variants={itemVariants} className="h-full">
          <UsageDistributionChart chartVariants={itemVariants} isEmpty={rawLogs.length === 0} />
        </motion.div>
      </div>
    </motion.div>
  )
}
