import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Lightbulb, Fan, Plug, User, Cpu, FileText } from "lucide-react"
import { SystemLog } from "../types/log"

const deviceIcons: Record<string, React.ReactNode> = {
  lamp: <Lightbulb className="w-4 h-4 text-amber-400" />,
  acFan: <Fan className="w-4 h-4 text-sky-400 animate-spin-slow" />,
  pcProjector: <Plug className="w-4 h-4 text-emerald-400" />,
}

interface LogTableProps {
  loading: boolean
  logs: SystemLog[]
}

export function LogTable({ loading, logs }: LogTableProps) {
  return (
    <>
      {/* Mobile View (Cards) */}
      <div className="flex flex-col gap-3 md:hidden">
        {loading ? (
          <div className="h-28 flex items-center justify-center border border-zinc-800 rounded-lg text-muted-foreground font-mono text-xs bg-zinc-900/50">
            Loading database activity records...
          </div>
        ) : logs.length === 0 ? (
          <div className="h-28 flex items-center justify-center border border-zinc-800 rounded-lg text-muted-foreground font-mono text-xs bg-zinc-900/50">
            No activity logs matched current filters.
          </div>
        ) : (
          logs.map((log) => {
            const date = new Date(log.timestamp)
            const Icon = deviceIcons[log.deviceId] || <Plug className="w-4 h-4" />
            const isAI = log.adminName.toLowerCase().includes("ai") || log.adminName.toLowerCase().includes("system")

            return (
              <div key={`mobile-${log.id}`} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex flex-col gap-3 shadow-sm">
                {/* Main Device Info */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-zinc-950 border border-zinc-800 flex items-center justify-center shrink-0 shadow-inner">
                    {Icon}
                  </div>
                  <div className="flex flex-col overflow-hidden">
                    <span className="text-sm font-semibold text-zinc-100 truncate">{log.deviceTitle}</span>
                    <span className="font-mono text-[10px] text-zinc-500 flex items-center gap-1.5 mt-0.5 truncate">
                      <Cpu className="w-3 h-3 shrink-0 text-zinc-600"/> {log.macAddress}
                    </span>
                  </div>
                </div>

                {/* Trigger Info (Recessed Card) */}
                <div className="bg-zinc-950/80 rounded-lg border border-zinc-800/80 p-3 flex flex-col gap-1.5">
                  <div className="flex items-center gap-2">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                      isAI 
                        ? "bg-purple-500/10 border border-purple-500/30 text-purple-400"
                        : "bg-sky-500/10 border border-sky-500/30 text-sky-400"
                    }`}>
                      {isAI ? <Cpu className="w-3 h-3" /> : <User className="w-3 h-3" />}
                    </div>
                    <span className={`text-[11px] font-semibold tracking-wide uppercase ${isAI ? "text-purple-400" : "text-sky-400"}`}>
                      {log.adminName}
                    </span>
                  </div>
                  {log.adminEmail && (
                    <div className="pl-7">
                      <span className="text-[11px] text-zinc-400 leading-snug block">
                        {log.adminEmail}
                      </span>
                    </div>
                  )}
                </div>

                {/* Footer: Date/Time + Action Status */}
                <div className="flex justify-between items-center mt-1 pt-3 border-t border-zinc-800/60">
                  <span className="text-[11px] text-zinc-500 font-mono tracking-tight">
                    {date.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })} • {date.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}
                  </span>
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider ${
                      log.action === "Turned ON"
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                        : "bg-red-500/10 text-red-400 border border-red-500/30"
                    }`}
                  >
                    {log.action === "Turned ON" ? "ON" : "OFF"}
                  </span>
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* Desktop View (Table) */}
      <div className="hidden md:block rounded-lg border border-zinc-800 overflow-hidden bg-background">
        <Table>
          <TableHeader className="bg-zinc-900/80 border-b border-zinc-800">
            <TableRow className="border-zinc-800 hover:bg-transparent text-center">
              <TableHead className="w-44 text-zinc-300 font-semibold text-center">Date & Time</TableHead>
              <TableHead className="w-40 text-zinc-300 font-semibold text-center">MAC Address</TableHead>
              <TableHead className="text-zinc-300 font-semibold text-center">Device & Location</TableHead>
              <TableHead className="w-28 text-zinc-300 font-semibold text-center">Action</TableHead>
              <TableHead className="w-44 text-zinc-300 font-semibold text-center">Triggered By</TableHead>
              <TableHead className="text-zinc-300 font-semibold text-center">Reason / Trigger Details</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-28 text-center text-muted-foreground font-mono text-xs">
                  Loading database activity records...
                </TableCell>
              </TableRow>
            ) : logs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-28 text-center text-muted-foreground font-mono text-xs">
                  No activity logs matched current filters.
                </TableCell>
              </TableRow>
            ) : (
              logs.map((log) => {
                const date = new Date(log.timestamp)
                const Icon = deviceIcons[log.deviceId] || <Plug className="w-4 h-4" />

                // Tentukan gaya visual pemicu (AI vs User)
                const isAI = log.adminName.toLowerCase().includes("ai") || log.adminName.toLowerCase().includes("system")

                return (
                  <TableRow key={`desktop-${log.id}`} className="border-zinc-800 hover:bg-zinc-800/20 transition-colors">
                    {/* 1. Date & Time */}
                    <TableCell className="text-center">
                      <div className="flex flex-col font-mono text-xs items-center">
                        <span className="font-semibold text-zinc-200">
                          {date.toLocaleDateString("id-ID", {
                            year: "numeric",
                            month: "short",
                            day: "2-digit"
                          })}
                        </span>
                        <span className="text-[10px] text-zinc-500 mt-0.5">
                          {date.toLocaleTimeString("id-ID", {
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit"
                          })}
                        </span>
                      </div>
                    </TableCell>

                    {/* 2. MAC Address */}
                    <TableCell>
                      <div className="flex items-center justify-center gap-1.5">
                        <Cpu className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                        <span className="font-mono text-[11px] text-zinc-400 bg-zinc-900 border border-zinc-800 px-1.5 py-0.5 rounded">
                          {log.macAddress}
                        </span>
                      </div>
                    </TableCell>

                    {/* 3. Device & Location */}
                    <TableCell>
                      <div className="flex items-center justify-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center shrink-0">
                          {Icon}
                        </div>
                        <span className="text-xs font-medium text-zinc-300">{log.deviceTitle}</span>
                      </div>
                    </TableCell>

                    {/* 4. Action */}
                    <TableCell className="text-center">
                      <span
                        className={`inline-flex items-center justify-center px-2 py-0.5 rounded text-[10px] font-mono font-semibold uppercase tracking-wider ${
                          log.action === "Turned ON"
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            : "bg-red-500/10 text-red-400 border border-red-500/20"
                        }`}
                      >
                        {log.action === "Turned ON" ? "ON" : "OFF"}
                      </span>
                    </TableCell>

                    {/* 5. Triggered By */}
                    <TableCell>
                      <div className="flex items-center justify-center gap-2">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                          isAI 
                            ? "bg-purple-500/10 border border-purple-500/20 text-purple-400"
                            : "bg-zinc-800 border border-zinc-700 text-zinc-400"
                        }`}>
                          {isAI ? (
                            <Cpu className="w-2.5 h-2.5" />
                          ) : (
                            <User className="w-2.5 h-2.5" />
                          )}
                        </div>
                        <span className={`text-xs font-medium ${isAI ? "text-purple-400" : "text-zinc-200"}`}>
                          {log.adminName}
                        </span>
                      </div>
                    </TableCell>

                    {/* 6. Reason / Trigger Details */}
                    <TableCell>
                      <div className="flex items-center justify-center gap-1.5">
                        <FileText className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                        <span className="text-xs text-zinc-400 truncate max-w-[280px] text-center">
                          {log.adminEmail}
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>
    </>
  )
}
