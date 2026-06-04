import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users } from "lucide-react"

interface OccupancyCardProps {
  occupancy: number
}

export function OccupancyCard({ occupancy }: OccupancyCardProps) {
  return (
    <Card className="bg-zinc-900 border-zinc-800">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
            <Users className="w-5 h-5 text-emerald-500" />
          </div>
          <CardTitle className="text-foreground text-base">Room Occupancy</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center py-6">
          <div className="relative">
            <div className="w-28 h-28 rounded-full bg-zinc-800 border-4 border-emerald-500/30 flex items-center justify-center">
              <span className="text-4xl font-bold text-foreground tabular-nums">
                {occupancy}
              </span>
            </div>
            {/* Glow effect */}
            <div className="absolute inset-0 rounded-full bg-emerald-500/10 blur-xl" />
          </div>
          <p className="text-sm text-muted-foreground mt-4">Current Room Occupancy</p>
          <p className="text-xs text-emerald-500 mt-1 font-medium">
            {occupancy === 0 ? "Room Empty" : `${occupancy} ${occupancy === 1 ? 'Person' : 'People'} Detected`}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
