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
    <div className="rounded-lg border border-zinc-800 overflow-hidden bg-background">
      <Table>
        <TableHeader className="bg-zinc-900/80 border-b border-zinc-800">
          <TableRow className="border-zinc-800 hover:bg-transparent">
            <TableHead className="w-44 text-zinc-300 font-semibold">Date & Time</TableHead>
            <TableHead className="w-40 text-zinc-300 font-semibold">MAC Address</TableHead>
            <TableHead className="text-zinc-300 font-semibold">Device & Location</TableHead>
            <TableHead className="w-28 text-zinc-300 font-semibold">Action</TableHead>
            <TableHead className="w-44 text-zinc-300 font-semibold">Triggered By</TableHead>
            <TableHead className="text-zinc-300 font-semibold">Reason / Trigger Details</TableHead>
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
                <TableRow key={log.id} className="border-zinc-800 hover:bg-zinc-800/20 transition-colors">
                  {/* 1. Date & Time */}
                  <TableCell>
                    <div className="flex flex-col font-mono text-xs">
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
                    <div className="flex items-center gap-1.5">
                      <Cpu className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                      <span className="font-mono text-[11px] text-zinc-400 bg-zinc-900 border border-zinc-800 px-1.5 py-0.5 rounded">
                        {log.macAddress}
                      </span>
                    </div>
                  </TableCell>

                  {/* 3. Device & Location */}
                  <TableCell>
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center shrink-0">
                        {Icon}
                      </div>
                      <span className="text-xs font-medium text-zinc-300">{log.deviceTitle}</span>
                    </div>
                  </TableCell>

                  {/* 4. Action */}
                  <TableCell>
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-semibold uppercase tracking-wider ${
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
                    <div className="flex items-center gap-2">
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
                    <div className="flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                      <span className="text-xs text-zinc-400 truncate max-w-[280px]">
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
  )
}
