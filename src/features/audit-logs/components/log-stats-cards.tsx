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
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="bg-zinc-900 border-zinc-800">
        <CardContent className="p-4 flex items-center gap-4">
          <div className="p-2 rounded-lg bg-zinc-800">
            <Clock className="w-5 h-5 text-zinc-400" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Events</p>
            <p className="text-2xl font-bold">{stats.total}</p>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-zinc-900 border-zinc-800">
        <CardContent className="p-4 flex items-center gap-4">
          <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
            <Power className="w-5 h-5 text-emerald-500" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Turned ON</p>
            <p className="text-2xl font-bold text-emerald-500">{stats.onActions}</p>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-zinc-900 border-zinc-800">
        <CardContent className="p-4 flex items-center gap-4">
          <div className="p-2 rounded-lg bg-red-500/10 border border-red-500/20">
            <PowerOff className="w-5 h-5 text-red-500" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Turned OFF</p>
            <p className="text-2xl font-bold text-red-400">{stats.offActions}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
