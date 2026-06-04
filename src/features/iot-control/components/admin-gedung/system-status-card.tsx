import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"

interface SystemStatus {
  iotSensors: string
  aiProcessing: string
  dataPipeline: string
}

interface SystemStatusCardProps {
  status: SystemStatus
}

export function SystemStatusCard({ status }: SystemStatusCardProps) {
  return (
    <Card className="bg-zinc-900 border-zinc-800">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
            <AlertCircle className="w-5 h-5 text-emerald-500" />
          </div>
          <CardTitle className="text-foreground text-base">System Status</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center justify-between py-2 border-b border-zinc-800">
            <span className="text-sm text-muted-foreground">IoT Sensors</span>
            <div className="flex items-center gap-2">
              <div className={classNameForStatus(status.iotSensors)} />
              <span className={classTextForStatus(status.iotSensors)}>{status.iotSensors}</span>
            </div>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-zinc-800">
            <span className="text-sm text-muted-foreground">AI Processing</span>
            <div className="flex items-center gap-2">
              <div className={classNameForStatus(status.aiProcessing === "Active" ? "Online" : "Offline")} />
              <span className={classTextForStatus(status.aiProcessing === "Active" ? "Online" : "Offline")}>{status.aiProcessing}</span>
            </div>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-sm text-muted-foreground">Data Pipeline</span>
            <div className="flex items-center gap-2">
              <div className={classNameForStatus(status.dataPipeline === "Streaming" ? "Online" : "Offline")} />
              <span className={classTextForStatus(status.dataPipeline === "Streaming" ? "Online" : "Offline")}>{status.dataPipeline}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function classNameForStatus(status: string) {
  return `w-2 h-2 rounded-full ${status === "Online" || status === "Streaming" ? "bg-emerald-500 animate-pulse" : "bg-zinc-600"}`;
}

function classTextForStatus(status: string) {
  return `text-xs font-medium ${status === "Online" || status === "Streaming" ? "text-emerald-500" : "text-zinc-500"}`;
}
