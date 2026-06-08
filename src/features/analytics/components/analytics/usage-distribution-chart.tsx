"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence, Variants } from "framer-motion"
import { PieChart as PieChartIcon } from "lucide-react"
import { PieChart, Pie, Cell, Tooltip as RechartsTooltip, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

const COLORS = ["#10b981", "#14b8a6", "#06b6d4"]

interface UsageDistributionChartProps {
  chartVariants: Variants
  isEmpty: boolean
}

export function UsageDistributionChart({ chartVariants, isEmpty }: UsageDistributionChartProps) {
  // Load devices and compute real-time breakdown by category
  const [categoryData, setCategoryData] = useState([
    { name: "Penerangan (Lampu)", value: 35 },
    { name: "Pendingin (AC)", value: 45 },
    { name: "Stopkontak (Lainnya)", value: 20 },
  ])

  useEffect(() => {
    const computeBreakdown = () => {
      let devicesList: any[] = []
      if (typeof window !== "undefined") {
        const saved = localStorage.getItem("smart-campus-devices")
        if (saved) {
          try {
            devicesList = JSON.parse(saved)
          } catch (e) {}
        }
      }

      if (devicesList.length === 0) return

      let lampPower = 0
      let acPower = 0
      let plugPower = 0

      devicesList.forEach((d) => {
        const power = d.isOn ? d.powerUsage : 0
        if (d.id.includes("lamp")) {
          lampPower += power
        } else if (d.id.includes("ac")) {
          acPower += power
        } else if (d.id.includes("pcProjector") || d.id.includes("plug")) {
          plugPower += power
        }
      })

      const totalPower = lampPower + acPower + plugPower
      if (totalPower > 0) {
        setCategoryData([
          { name: "Penerangan (Lampu)", value: Math.round((lampPower / totalPower) * 100) },
          { name: "Pendingin (AC)", value: Math.round((acPower / totalPower) * 100) },
          { name: "Stopkontak (Lainnya)", value: Math.round((plugPower / totalPower) * 100) },
        ])
      } else {
        // Fallback default distribution if all active devices are OFF
        setCategoryData([
          { name: "Penerangan (Lampu)", value: 30 },
          { name: "Pendingin (AC)", value: 40 },
          { name: "Stopkontak (Lainnya)", value: 30 },
        ])
      }
    }

    computeBreakdown()
    const interval = setInterval(computeBreakdown, 3000)
    return () => clearInterval(interval)
  }, [])
  return (
    <motion.div variants={chartVariants}>
      <Card className="bg-zinc-900/50 border-zinc-800 backdrop-blur-sm h-full flex flex-col">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-bold flex items-center gap-2 text-foreground">
            <PieChartIcon className="w-4 h-4 text-emerald-500" />
            Usage Distribution
          </CardTitle>
          <CardDescription className="text-xs">Consumption by hardware category</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center flex-1 py-6 px-4">
          <AnimatePresence mode="wait">
            {isEmpty ? (
              <motion.div 
                key="empty-pie"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center text-zinc-600"
              >
                <div className="relative">
                  <PieChartIcon className="w-20 h-20 mb-4 opacity-5" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full border-2 border-zinc-800 animate-ping opacity-20" />
                  </div>
                </div>
                <p className="text-[10px] font-mono tracking-[0.3em] opacity-40 uppercase font-black">Awaiting source...</p>
              </motion.div>
            ) : (
              <motion.div 
                key="pie-content"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full flex flex-col items-center"
              >
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={70}
                      outerRadius={90}
                      paddingAngle={10}
                      dataKey="value"
                      stroke="none"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <RechartsTooltip 
                      contentStyle={{ 
                        backgroundColor: "#09090b", 
                        borderColor: "rgba(16, 185, 129, 0.3)", 
                        borderRadius: "12px",
                        borderWidth: "1px",
                        fontSize: "12px"
                      }}
                      itemStyle={{ color: "#f4f4f5", fontWeight: "bold" }}
                    />
                  </PieChart>
                </ResponsiveContainer>

                <div className="grid grid-cols-1 w-full gap-2.5 mt-8 px-2">
                  {categoryData.map((item, index) => (
                    <motion.div 
                      key={item.name} 
                      initial={{ x: -10, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.1 * index }}
                      className="flex items-center justify-between px-4 py-2.5 bg-zinc-950/50 rounded-xl border border-zinc-800/50 hover:border-emerald-500/20 transition-all group cursor-default"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-2.5 h-2.5 rounded-full shadow-lg shadow-emerald-500/10" style={{ backgroundColor: COLORS[index] }} />
                        <span className="text-xs font-medium text-zinc-400 group-hover:text-zinc-200 transition-colors uppercase tracking-tight">{item.name}</span>
                      </div>
                      <span className="text-xs font-black font-mono text-emerald-100">{item.value}%</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  )
}
