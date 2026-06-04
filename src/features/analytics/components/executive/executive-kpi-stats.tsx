import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Leaf, TrendingUp, Zap } from "lucide-react"

interface ExecutiveKpiStatsProps {
  liveLoad: number
  energySaved: number
  financialSaved: number
  co2Prevented: number
}

export function ExecutiveKpiStats({ 
  liveLoad, 
  energySaved, 
  financialSaved, 
  co2Prevented 
}: ExecutiveKpiStatsProps) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {/* Money Saved */}
      <Card className="bg-zinc-900 border-zinc-800 hover:border-emerald-500/30 transition-all duration-300">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Financial Saved</span>
          <TrendingUp className="w-4 h-4 text-emerald-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-emerald-500 tabular-nums">
            Rp {financialSaved.toLocaleString("id-ID")}
          </div>
          <p className="text-[10px] text-emerald-500 mt-1">Accumulated savings this period</p>
        </CardContent>
      </Card>

      {/* kWh Saved */}
      <Card className="bg-zinc-900 border-zinc-800 hover:border-emerald-500/30 transition-all duration-300">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Energy Conserved</span>
          <Zap className="w-4 h-4 text-emerald-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground tabular-nums">
            {energySaved.toLocaleString("id-ID")} <span className="text-xs text-muted-foreground font-normal">kWh</span>
          </div>
          <p className="text-[10px] text-emerald-500 mt-1">Saved via YOLOv8 automation</p>
        </CardContent>
      </Card>

      {/* Carbon Prevented */}
      <Card className="bg-zinc-900 border-zinc-800 hover:border-emerald-500/30 transition-all duration-300">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">CO2 Prevented</span>
          <Leaf className="w-4 h-4 text-emerald-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground tabular-nums">
            {co2Prevented.toFixed(2)} <span className="text-xs text-muted-foreground font-normal">Metric Tons</span>
          </div>
          <p className="text-[10px] text-emerald-500 mt-1">Reduction in environmental impact</p>
        </CardContent>
      </Card>

      {/* Real-time Load */}
      <Card className="bg-zinc-900 border-zinc-800 hover:border-emerald-500/30 transition-all duration-300">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Active Campus Load</span>
          <Zap className="w-4 h-4 text-emerald-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground tabular-nums">
            {liveLoad >= 1000 ? (liveLoad / 1000).toFixed(2) : liveLoad.toFixed(1)}{" "}
            <span className="text-xs text-muted-foreground font-normal">
              {liveLoad >= 1000 ? "kW" : "W"}
            </span>
          </div>
          <p className="text-[10px] text-muted-foreground mt-1">Campus-wide live consumption</p>
        </CardContent>
      </Card>
    </div>
  )
}
