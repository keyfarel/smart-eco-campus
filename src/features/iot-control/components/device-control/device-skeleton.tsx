import { Power } from "lucide-react"

export function DeviceSkeleton() {
  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
          <Power className="w-5 h-5 text-emerald-500" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Device Control</h1>
          <p className="text-sm text-muted-foreground">Connecting to Firestore…</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-64 rounded-2xl bg-zinc-900 border border-zinc-800 animate-pulse" />
        ))}
      </div>
    </div>
  )
}
