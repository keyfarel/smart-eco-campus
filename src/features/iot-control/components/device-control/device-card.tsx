import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Power, Plug, Lock } from "lucide-react"
import { Device, ICON_MAP } from "../../types/device"

interface DeviceCardProps {
  device: Device
  toggling: string | null
  onToggle: (id: string, currentState: boolean) => void
  isReadOnly?: boolean
}

export function DeviceCard({ device, toggling, onToggle, isReadOnly = false }: DeviceCardProps) {
  const isOn = device.isOn
  const Icon = ICON_MAP[device.id] ?? Plug
  const isBeingToggled = toggling === device.id || toggling === "all"

  return (
    <Card
      className={`relative overflow-hidden bg-zinc-900 border transition-all duration-500 ${isOn
          ? "border-emerald-500/50 shadow-[0_0_30px_rgba(16,185,129,0.15)]"
          : "border-zinc-800 hover:border-zinc-700"
        }`}
    >
      {/* Glow overlay */}
      {isOn && (
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-transparent pointer-events-none" />
      )}

      {/* Top status bar */}
      <div
        className={`absolute top-0 left-0 right-0 h-1 transition-colors duration-500 ${isOn ? "bg-emerald-500" : "bg-zinc-700"
          }`}
      />

      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            {/* Icon */}
            <div
              className={`relative w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-500 ${isOn
                  ? "bg-emerald-500/20 border border-emerald-500/40"
                  : "bg-zinc-800 border border-zinc-700"
                }`}
            >
              {isOn && (
                <div className="absolute inset-0 rounded-2xl bg-emerald-500/20 blur-xl" />
              )}
              <Icon
                className={`relative w-8 h-8 transition-all duration-500 ${isOn ? "text-emerald-400" : "text-zinc-500"
                  } ${isOn && device.id === "acFan" ? "animate-spin" : ""} ${isOn && device.id === "lamp" ? "animate-pulse" : ""
                  } ${isOn && device.id === "pcProjector" ? "animate-pulse" : ""}`}
                style={
                  isOn
                    ? {
                      animationDuration:
                        device.id === "acFan"
                          ? "3s"
                          : device.id === "pcProjector"
                            ? "2.5s"
                            : "2s",
                    }
                    : undefined
                }
              />
            </div>

            <div className="flex flex-col">
              <CardTitle className="text-lg font-semibold text-foreground">
                {device.title}
              </CardTitle>
              <span
                className={`text-xs font-medium uppercase tracking-wider mt-1 ${isOn ? "text-emerald-500" : "text-red-400/70"
                  }`}
              >
                {isOn ? "Online" : "Offline"}
              </span>
            </div>
          </div>

          {/* Status dot */}
          <div
            className={`w-3 h-3 rounded-full transition-all duration-500 ${isOn
                ? "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]"
                : "bg-red-500/50"
              }`}
          />
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <p className="text-sm text-muted-foreground leading-relaxed">
          {device.description}
        </p>

        {/* Info row */}
        <div className="flex items-center gap-4 text-sm">
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground uppercase tracking-wide">Power</span>
            <span className={`font-mono font-semibold ${isOn ? "text-emerald-400" : "text-zinc-500"}`}>
              {isOn ? `${device.powerUsage}W` : "0W"}
            </span>
          </div>
          <div className="h-8 w-px bg-zinc-800" />
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground uppercase tracking-wide">Location</span>
            <span className="font-medium text-foreground">{device.location}</span>
          </div>
          <div className="h-8 w-px bg-zinc-800" />
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground uppercase tracking-wide">Updated</span>
            <span className="font-medium text-foreground text-xs">
              {device.lastUpdated
                ? new Date(device.lastUpdated).toLocaleTimeString("id-ID", {
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                })
                : "—"}
            </span>
          </div>
        </div>

        {/* Toggle control */}
        <div
          className={`flex items-center justify-between p-4 rounded-xl border transition-all duration-500 ${isOn
              ? "bg-emerald-500/5 border-emerald-500/20"
              : "bg-zinc-800/50 border-zinc-700/50"
            }`}
        >
          <div className="flex items-center gap-3">
            <Power
              className={`w-5 h-5 transition-colors duration-500 ${isOn ? "text-emerald-500" : "text-zinc-500"
                }`}
            />
            <span className="text-sm font-medium text-foreground">Power Control</span>
          </div>

          {/* Toggle button / Locked indicator */}
          {isReadOnly ? (
            <div className="flex items-center gap-1.5 text-xs text-yellow-500/80 bg-yellow-500/10 border border-yellow-500/20 px-2.5 py-1 rounded-lg">
              <Lock className="w-3.5 h-3.5 animate-pulse" />
              <span>Locked (Read-Only)</span>
            </div>
          ) : (
            <button
              onClick={() => onToggle(device.id, isOn)}
              disabled={!!isBeingToggled}
              className={`relative w-16 h-8 rounded-full transition-all duration-500 disabled:opacity-60 disabled:cursor-not-allowed ${isOn
                  ? "bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.5)]"
                  : "bg-zinc-700"
                }`}
            >
              <div
                className={`absolute top-1 w-6 h-6 rounded-full bg-white shadow-lg transition-all duration-500 ${isOn ? "left-9" : "left-1"
                  }`}
              />
            </button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
