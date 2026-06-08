"use client"

import { motion, Variants } from "framer-motion"
import { Zap, TrendingUp, Clock, Info } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import {
  Tooltip as UITooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface AnalyticsStats {
  total: number
  peak: number
  cost: number
  peakTime: string
}

interface StatsCardsProps {
  stats: AnalyticsStats
  cardVariants: Variants
  isLiveMode?: boolean
}

export function StatsCards({ stats, cardVariants, isLiveMode = false }: StatsCardsProps) {
  const items = [
    { label: "Total Consumption", value: stats.total.toLocaleString("id-ID"), unit: "kWh", icon: Zap, help: "Total pemakaian energi terakumulasi dalam periode terpilih." },
    { 
      label: "Peak Energy Load", 
      value: stats.peak >= 1000 ? (stats.peak / 1000).toFixed(2) : stats.peak.toFixed(1), 
      unit: stats.peak >= 1000 ? "kW" : "W", 
      icon: TrendingUp, 
      help: "Beban puncak tertinggi yang terekam." 
    },
    { label: "Peak Usage Hour", value: stats.peakTime, unit: "", icon: Clock, help: "Jam di mana konsumsi energi mencapai titik tertinggi." },
    { 
      label: "Estimated Energy Cost", 
      value: `Rp ${stats.cost.toLocaleString("id-ID")}`, 
      unit: "", 
      icon: "Rp", 
      help: "Estimasi biaya berdasarkan tarif resmi PLN (Rp 1.444,- / kWh)." 
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {items.map((item, idx) => (
        <motion.div key={item.label} variants={cardVariants}>
          <Card className={`bg-zinc-900 border-zinc-800 overflow-hidden relative group hover:border-emerald-500/30 transition-all duration-300 ${idx === 0 ? 'ring-1 ring-emerald-500/20' : ''}`}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{item.label}</p>
                  {item.help && (
                    <UITooltip>
                      <TooltipTrigger>
                        <Info className="w-3 h-3 text-zinc-500 group-hover:text-emerald-500 transition-colors" />
                      </TooltipTrigger>
                      <TooltipContent className="bg-zinc-900 border-emerald-500/50 text-zinc-100 text-xs w-64 shadow-2xl">
                        {item.help}
                      </TooltipContent>
                    </UITooltip>
                  )}
                </div>
                {typeof item.icon === 'string' ? (
                  <div className="w-5 h-5 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-[10px] font-bold text-emerald-500">{item.icon}</div>
                ) : (
                  <item.icon className="w-4 h-4 text-emerald-500" />
                )}
              </div>
              <div className="flex items-baseline gap-2">
                <motion.p 
                  key={item.value}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={`text-2xl font-bold ${idx === 3 ? 'text-emerald-500' : 'text-foreground'}`}
                >
                  {item.value}
                </motion.p>
                {item.unit && <p className="text-[10px] text-muted-foreground font-mono font-bold uppercase">{item.unit}</p>}
              </div>
              <p className="mt-4 text-[9px] text-zinc-500 font-mono tracking-wider uppercase opacity-80">
                {isLiveMode ? "Live calculation" : (idx === 2 ? "Predicted pattern" : "Historical data")}
              </p>
            </CardContent>
            {idx === 0 && <motion.div layoutId="green-bar" className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-500" />}
          </Card>
        </motion.div>
      ))}
    </div>
  )
}
