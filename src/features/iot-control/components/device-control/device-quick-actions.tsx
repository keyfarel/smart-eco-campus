import { Card, CardContent } from "@/components/ui/card"

interface DeviceQuickActionsProps {
  toggling: string | boolean | null
  isReadOnly: boolean
  totalWatts: number
  onSetAllDevices: (isOn: boolean) => void
}

export function DeviceQuickActions({
  toggling,
  isReadOnly,
  totalWatts,
  onSetAllDevices,
}: DeviceQuickActionsProps) {
  return (
    <Card className="bg-zinc-900 border-zinc-800">
      <CardContent className="py-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">Quick Actions:</span>
            <button
              onClick={() => onSetAllDevices(true)}
              disabled={!!toggling || isReadOnly}
              className="px-4 py-2 text-sm font-medium text-emerald-500 bg-emerald-500/10 border border-emerald-500/30 rounded-lg hover:bg-emerald-500/20 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              All On
            </button>
            <button
              onClick={() => onSetAllDevices(false)}
              disabled={!!toggling || isReadOnly}
              className="px-4 py-2 text-sm font-medium text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg hover:bg-red-500/20 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              All Off
            </button>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Total Power:</span>
            <span className="font-mono font-semibold text-emerald-400">{totalWatts}W</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
