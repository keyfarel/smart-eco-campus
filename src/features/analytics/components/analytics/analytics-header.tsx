"use client"

import { motion } from "framer-motion"
import { BarChart3, Trash2, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MethodologyDialog } from "./methodology-dialog"

interface AnalyticsHeaderProps {
  timeRange: string
  onTimeRangeChange: (value: string) => void
}

export function AnalyticsHeader({
  timeRange,
  onTimeRangeChange,
}: AnalyticsHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <motion.div 
          className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center"
          whileHover={{ rotate: 10, scale: 1.1 }}
        >
          <BarChart3 className="w-5 h-5 text-emerald-500" />
        </motion.div>
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Energy Analytics</h1>
          <p className="text-sm text-muted-foreground font-medium">Deep dive into campus energy patterns</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">

        <MethodologyDialog />

        <Tabs value={timeRange} onValueChange={onTimeRangeChange} className="w-fit">
          <TabsList className="bg-zinc-900 border border-zinc-800 p-1 rounded-xl">
            <TabsTrigger value="24h" className="rounded-lg data-[state=active]:bg-emerald-500 data-[state=active]:text-white transition-all text-xs font-semibold h-7 px-4">Daily</TabsTrigger>
            <TabsTrigger value="7d" className="rounded-lg data-[state=active]:bg-emerald-500 data-[state=active]:text-white transition-all text-xs font-semibold h-7 px-4">Weekly</TabsTrigger>
            <TabsTrigger value="30d" className="rounded-lg data-[state=active]:bg-emerald-500 data-[state=active]:text-white transition-all text-xs font-semibold h-7 px-4">Monthly</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    </div>
  )
}
