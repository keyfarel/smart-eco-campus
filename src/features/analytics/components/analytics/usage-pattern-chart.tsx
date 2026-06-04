"use client"

import { motion, AnimatePresence, Variants } from "framer-motion"
import { Zap, BarChart3 } from "lucide-react"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

interface UsagePatternChartProps {
  data: any[]
  chartVariants: Variants
  isEmpty: boolean
}

export function UsagePatternChart({ data, chartVariants, isEmpty }: UsagePatternChartProps) {
  return (
    <motion.div className="lg:col-span-2" variants={chartVariants}>
      <Card className="bg-zinc-900/50 border-zinc-800 overflow-hidden backdrop-blur-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-bold flex items-center gap-2 text-foreground">
            <Zap className="w-4 h-4 text-emerald-500" />
            Energy Usage Pattern
          </CardTitle>
          <CardDescription className="text-xs">Visualizing power load variations across the campus</CardDescription>
        </CardHeader>
        <CardContent className="h-[350px] relative p-0 pt-4">
          <AnimatePresence mode="wait">
            {isEmpty ? (
              <motion.div 
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex flex-col items-center justify-center text-zinc-600 bg-zinc-950/20 border-t border-zinc-900/50"
              >
                <BarChart3 className="w-12 h-12 mb-3 opacity-10 animate-pulse" />
                <p className="text-xs font-mono tracking-[0.2em] uppercase opacity-40">No historical data available</p>
                <p className="text-[10px] opacity-20 mt-2 font-medium">Please use "Seed Data" for demonstration</p>
              </motion.div>
            ) : (
              <motion.div 
                key="chart"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full h-full px-4"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorWatt" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#27272a" />
                    <XAxis
                      dataKey="time"
                      stroke="#4b5563"
                      fontSize={10}
                      tickLine={false}
                      axisLine={false}
                      tick={{ fill: '#6b7280' }}
                    />
                    <YAxis
                      stroke="#4b5563"
                      fontSize={10}
                      tickLine={false}
                      axisLine={false}
                      tick={{ fill: '#6b7280' }}
                    />
                    <RechartsTooltip 
                      contentStyle={{ 
                        backgroundColor: "rgba(9, 9, 11, 0.95)", 
                        borderColor: "rgba(16, 185, 129, 0.3)", 
                        borderRadius: "12px", 
                        borderWidth: "1px",
                        boxShadow: "0 10px 40px -10px rgba(0,0,0,0.5)",
                        fontSize: "12px",
                        padding: "12px"
                      }}
                      itemStyle={{ color: "#10b981", fontWeight: "bold" }}
                      labelStyle={{ color: "#94a3b8", marginBottom: "4px" }}
                    />
                    <Area
                      type="monotone"
                      dataKey="watt"
                      stroke="#10b981"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#colorWatt)"
                      animationDuration={2000}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  )
}
