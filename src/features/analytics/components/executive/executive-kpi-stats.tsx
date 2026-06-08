import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Leaf, TrendingUp, Zap } from "lucide-react"

interface ExecutiveKpiStatsProps {
  totalDurationSec: number
  energySaved: number
  financialSaved: number
  co2Prevented: number
  totalAiActions: number
}

export function ExecutiveKpiStats({ 
  totalDurationSec, 
  energySaved, 
  financialSaved, 
  co2Prevented,
  totalAiActions
}: ExecutiveKpiStatsProps) {
  return (
    <>
      {/* MOBILE VIEW */}
      <div className="sm:hidden rounded-xl border bg-zinc-900/50 border-zinc-800 backdrop-blur-sm overflow-hidden shadow-sm">
        <div className="grid grid-cols-3">
          {/* Card Pertama: Financial Saved (Full Width) */}
          <div className="col-span-3 px-3 py-2.5 flex items-center justify-between border-b border-zinc-800/80 bg-zinc-950/30">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-full bg-emerald-500/10">
                <TrendingUp className="w-4 h-4 text-emerald-500" />
              </div>
              <p className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest mt-0.5">
                Financial Saved
              </p>
            </div>
            <p className="text-xl font-bold text-emerald-500">
              Rp {financialSaved.toLocaleString("id-ID")}
            </p>
          </div>

          {/* 3 Card Sisanya: Berjejer 3 Kolom */}
          <div className="p-3 flex flex-col items-center justify-center text-center gap-1 border-r border-zinc-800/80">
            <div className="p-1.5 rounded-full bg-emerald-500/10 mb-0.5">
              <Zap className="w-3.5 h-3.5 text-emerald-500" />
            </div>
            <p className="text-lg font-bold leading-none text-foreground">
              {energySaved.toLocaleString("id-ID")}
            </p>
            <p className="text-[8px] font-bold text-zinc-500 uppercase tracking-wider leading-tight mt-0.5">
              kWh Saved
            </p>
          </div>

          <div className="p-3 flex flex-col items-center justify-center text-center gap-1 border-r border-zinc-800/80">
            <div className="p-1.5 rounded-full bg-emerald-500/10 mb-0.5">
              <Zap className="w-3.5 h-3.5 text-emerald-500" />
            </div>
            <p className="text-lg font-bold leading-none text-foreground">
              {(totalDurationSec / 3600).toFixed(1)}
            </p>
            <p className="text-[8px] font-bold text-zinc-500 uppercase tracking-wider leading-tight mt-0.5">
              Hours
            </p>
          </div>

          <div className="p-3 flex flex-col items-center justify-center text-center gap-1">
            <div className="p-1.5 rounded-full bg-emerald-500/10 mb-0.5">
              <Leaf className="w-3.5 h-3.5 text-emerald-500" />
            </div>
            <p className="text-lg font-bold leading-none text-foreground">
              {totalAiActions.toLocaleString("id-ID")}
            </p>
            <p className="text-[8px] font-bold text-zinc-500 uppercase tracking-wider leading-tight mt-0.5">
              Actions
            </p>
          </div>
        </div>
      </div>

      {/* DESKTOP VIEW */}
      <div className="hidden sm:grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
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

        {/* Total Duration Saved */}
        <Card className="bg-zinc-900 border-zinc-800 hover:border-emerald-500/30 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Total Duration Saved</span>
            <Zap className="w-4 h-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground tabular-nums">
              {(totalDurationSec / 3600).toFixed(1)} <span className="text-xs text-muted-foreground font-normal">Hours</span>
            </div>
            <p className="text-[10px] text-muted-foreground mt-1">Total time devices were kept off</p>
          </CardContent>
        </Card>

        {/* AI Actions */}
        <Card className="bg-zinc-900 border-zinc-800 hover:border-emerald-500/30 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Total AI Actions</span>
            <Leaf className="w-4 h-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground tabular-nums">
              {totalAiActions.toLocaleString("id-ID")} <span className="text-xs text-muted-foreground font-normal">Interventions</span>
            </div>
            <p className="text-[10px] text-muted-foreground mt-1">Times YOLOv8 turned off devices</p>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
