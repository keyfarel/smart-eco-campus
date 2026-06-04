import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity } from "lucide-react"
import { RadialGauge } from "@/components/shared/radial-gauge"

interface TelemetryMetrics {
  watt: number
  volt: number
  ampere: number
}

interface TelemetryGaugesProps {
  metrics: TelemetryMetrics
}

export function TelemetryGauges({ metrics }: TelemetryGaugesProps) {
  return (
    <Card className="bg-zinc-900 border-zinc-800">
      <CardHeader className="border-b border-zinc-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
            <Activity className="w-5 h-5 text-emerald-500" />
          </div>
          <div>
            <CardTitle className="text-foreground">Real-Time Electrical Metrics</CardTitle>
            <p className="text-xs text-muted-foreground mt-0.5">Live power consumption monitoring</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="py-8">
        <div className="flex flex-wrap items-center justify-center gap-12 lg:gap-20">
          <RadialGauge
            value={metrics.watt}
            maxValue={500}
            label="Power Consumption"
            unit="Watt"
            size={160}
          />
          <RadialGauge
            value={metrics.volt}
            maxValue={250}
            label="Voltage"
            unit="Volt"
            size={160}
          />
          <RadialGauge
            value={metrics.ampere}
            maxValue={2}
            label="Current"
            unit="Ampere"
            size={160}
          />
        </div>
      </CardContent>
    </Card>
  )
}
