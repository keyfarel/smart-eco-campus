import { useState } from "react"
import { Device } from "../../types/device"
import { 
  Search, 
  ChevronUp, 
  ChevronDown, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Lightbulb 
} from "lucide-react"

export function FirestoreDebugPanel({
  devices,
  connected,
}: {
  devices: Device[]
  connected: boolean
}) {
  const [open, setOpen] = useState(false)
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? "—"
  const now = new Date().toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  })

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-950 overflow-hidden">
      {/* Header / Toggle */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-5 py-3 hover:bg-zinc-900 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div
            className={`w-2 h-2 rounded-full ${connected ? "bg-emerald-500 animate-pulse" : "bg-red-500"
              }`}
          />
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground font-mono">
            <span>Firestore Debug Panel</span>
          </div>
          <span className="text-xs px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400 font-mono">
            {devices.length} docs · {projectId}
          </span>
        </div>
        <div className="flex items-center gap-1 text-xs text-zinc-600 font-mono">
          {open ? (
            <>
              <ChevronUp className="w-3 h-3" />
              <span>sembunyikan</span>
            </>
          ) : (
            <>
              <ChevronDown className="w-3 h-3" />
              <span>tampilkan</span>
            </>
          )}
        </div>
      </button>

      {/* Body */}
      {open && (
        <div className="px-5 pb-5 space-y-4 border-t border-zinc-800">
          {/* Status row */}
          <div className="flex flex-wrap gap-4 pt-4 text-xs font-mono text-zinc-500">
            <span className="flex items-center gap-1.5">
              Status:{" "}
              {connected ? (
                <span className="flex items-center gap-1 text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Connected
                </span>
              ) : (
                <span className="flex items-center gap-1 text-red-400">
                  <XCircle className="w-3.5 h-3.5" />
                  Disconnected
                </span>
              )}
            </span>
            <span>·</span>
            <span>Project: <span className="text-zinc-300">{projectId}</span></span>
            <span>·</span>
            <span>Collection: <span className="text-zinc-300">devices</span></span>
            <span>·</span>
            <span>Last sync: <span className="text-zinc-300">{now}</span></span>
          </div>

          {/* Document list */}
          {devices.length === 0 ? (
            <div className="flex items-center gap-2 text-sm text-red-400 font-mono">
              <AlertTriangle className="w-4 h-4" />
              <p>Tidak ada dokumen yang ditemukan di koleksi &quot;devices&quot;.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {devices.map((d) => (
                <div
                  key={d.id}
                  className="rounded-lg border border-zinc-800 bg-zinc-900 p-4"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-mono text-zinc-500">doc id:</span>
                    <span className="text-xs font-mono font-bold text-emerald-400">
                      {d.id}
                    </span>
                    <span
                      className={`ml-auto text-xs px-2 py-0.5 rounded-full font-mono ${d.isOn
                          ? "bg-emerald-500/20 text-emerald-400"
                          : "bg-red-500/10 text-red-400"
                        }`}
                    >
                      isOn: {String(d.isOn)}
                    </span>
                  </div>
                  <pre className="text-xs text-zinc-400 font-mono overflow-x-auto whitespace-pre-wrap">
                    {JSON.stringify(
                      { title: d.title, powerUsage: d.powerUsage, location: d.location, lastUpdated: d.lastUpdated },
                      null,
                      2
                    )}
                  </pre>
                </div>
              ))}
            </div>
          )}

          <div className="flex items-start gap-2 text-xs text-zinc-600 font-mono">
            <p>
              Panel ini hanya untuk development. Hapus atau sembunyikan sebelum deploy ke production.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

