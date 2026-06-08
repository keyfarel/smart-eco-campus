import { Card, CardContent } from "@/components/ui/card"
import { Clock, Power, PowerOff } from "lucide-react"

interface LogStats {
  onActions: number
  offActions: number
  total: number
}

interface LogStatsCardsProps {
  stats: LogStats
}

export function LogStatsCards({ stats }: LogStatsCardsProps) {
  return (
    <div className="grid grid-cols-3 gap-3 sm:gap-4">
      <Card className="bg-zinc-900 border-zinc-800 max-sm:aspect-square overflow-hidden">
        <CardContent className="p-2 sm:p-4 w-full h-full flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-1 sm:gap-4 text-center sm:text-left">
          <div className="p-1.5 sm:p-2 rounded-lg bg-zinc-800 shrink-0">
            <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-zinc-400" />
          </div>
          <div className="flex flex-col items-center sm:items-start gap-0.5 sm:gap-0 mt-0.5 sm:mt-0">
            <p className="text-sm sm:text-2xl font-bold leading-none">{stats.total}</p>
            <p className="text-[9px] sm:text-sm text-muted-foreground uppercase sm:normal-case font-semibold sm:font-normal">Total</p>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-zinc-900 border-zinc-800 max-sm:aspect-square overflow-hidden">
        <CardContent className="p-2 sm:p-4 w-full h-full flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-1 sm:gap-4 text-center sm:text-left">
          <div className="p-1.5 sm:p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 shrink-0">
            <Power className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-500" />
          </div>
          <div className="flex flex-col items-center sm:items-start gap-0.5 sm:gap-0 mt-0.5 sm:mt-0">
            <p className="text-sm sm:text-2xl font-bold text-emerald-500 leading-none">{stats.onActions}</p>
            <p className="text-[9px] sm:text-sm text-muted-foreground uppercase sm:normal-case font-semibold sm:font-normal">Turn ON</p>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-zinc-900 border-zinc-800 max-sm:aspect-square overflow-hidden">
        <CardContent className="p-2 sm:p-4 w-full h-full flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-1 sm:gap-4 text-center sm:text-left">
          <div className="p-1.5 sm:p-2 rounded-lg bg-red-500/10 border border-red-500/20 shrink-0">
            <PowerOff className="w-4 h-4 sm:w-5 sm:h-5 text-red-500" />
          </div>
          <div className="flex flex-col items-center sm:items-start gap-0.5 sm:gap-0 mt-0.5 sm:mt-0">
            <p className="text-sm sm:text-2xl font-bold text-red-400 leading-none">{stats.offActions}</p>
            <p className="text-[9px] sm:text-sm text-muted-foreground uppercase sm:normal-case font-semibold sm:font-normal">Turn OFF</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
