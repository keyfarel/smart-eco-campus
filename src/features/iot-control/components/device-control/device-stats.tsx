import { Wifi, WifiOff, Activity } from "lucide-react"
import { Device } from "../../types/device"

interface DeviceStatsProps {
  devices: Device[]
  connected: boolean
}

export function DeviceStats({ devices, connected }: DeviceStatsProps) {
  const activeCount = devices.filter((d) => d.isOn).length

  return (
    <div className="flex flex-wrap items-center gap-6">
      {/* Active count */}
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        <span className="text-sm text-muted-foreground">
          <span className="text-emerald-500 font-semibold">{activeCount}</span> of{" "}
          <span className="font-semibold text-foreground">{devices.length}</span> devices active
        </span>
      </div>
      <div className="h-4 w-px bg-zinc-800" />
      
      {/* Firebase connection */}
      <div className="flex items-center gap-2">
        {connected ? (
          <Wifi className="w-4 h-4 text-emerald-500" />
        ) : (
          <WifiOff className="w-4 h-4 text-red-400" />
        )}
        <span className={`text-sm ${connected ? "text-emerald-500" : "text-red-400"}`}>
          {connected ? "Firebase Connected" : "Firebase Disconnected"}
        </span>
      </div>
      <div className="h-4 w-px bg-zinc-800" />
      
      <div className="flex items-center gap-2">
        <Activity className="w-4 h-4 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">Live sync enabled</span>
      </div>
    </div>
  )
}
