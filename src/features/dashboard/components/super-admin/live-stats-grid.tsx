import { motion, Variants } from "framer-motion"
import { Zap, Cpu } from "lucide-react"

interface LiveStatsGridProps {
  realtimeStats: {
    powerLoad: number
    totalAmpere: number
    avgVoltage: number
    activeNodes: number
  }
  cardVariants: Variants
}

export function LiveStatsGrid({ realtimeStats, cardVariants }: LiveStatsGridProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {/* Live Power */}
      <motion.div variants={cardVariants} className="bg-zinc-900/50 border border-zinc-800 p-4 rounded-xl flex items-center justify-between">
        <div className="space-y-1">
          <span className="text-xs text-zinc-400 font-semibold tracking-wide">Live Power</span>
          <h3 className="text-2xl font-extrabold font-mono text-emerald-400">{realtimeStats.powerLoad.toLocaleString("id-ID")} W</h3>
        </div>
        <div className="w-12 h-12 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500">
          <Zap className="w-6 h-6 animate-pulse" />
        </div>
      </motion.div>
      
      {/* Live Current */}
      <motion.div variants={cardVariants} className="bg-zinc-900/50 border border-zinc-800 p-4 rounded-xl flex items-center justify-between">
        <div className="space-y-1">
          <span className="text-xs text-zinc-400 font-semibold tracking-wide">Live Current</span>
          <h3 className="text-2xl font-extrabold font-mono text-blue-400">{realtimeStats.totalAmpere.toFixed(2)} A</h3>
        </div>
        <div className="w-12 h-12 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500">
          <Zap className="w-6 h-6" />
        </div>
      </motion.div>

      {/* Grid Voltage */}
      <motion.div variants={cardVariants} className="bg-zinc-900/50 border border-zinc-800 p-4 rounded-xl flex items-center justify-between">
        <div className="space-y-1">
          <span className="text-xs text-zinc-400 font-semibold tracking-wide">Grid Voltage</span>
          <h3 className="text-2xl font-extrabold font-mono text-amber-400">{realtimeStats.avgVoltage.toFixed(1)} V</h3>
        </div>
        <div className="w-12 h-12 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500">
          <Zap className="w-6 h-6" />
        </div>
      </motion.div>

      {/* Active Nodes */}
      <motion.div variants={cardVariants} className="bg-zinc-900/50 border border-zinc-800 p-4 rounded-xl flex items-center justify-between">
        <div className="space-y-1">
          <span className="text-xs text-zinc-400 font-semibold tracking-wide">Active Nodes</span>
          <h3 className="text-2xl font-extrabold font-mono text-indigo-400">{realtimeStats.activeNodes}</h3>
        </div>
        <div className="w-12 h-12 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-500">
          <Cpu className="w-6 h-6" />
        </div>
      </motion.div>
    </div>
  )
}
