import { Power } from "lucide-react"

export function DeviceSkeleton() {
  return (
    <div className="space-y-6 animate-pulse pb-20">
      {/* Header Skeleton */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20" />
          <div className="space-y-2">
            <div className="h-6 w-48 bg-zinc-800 rounded-md" />
            <div className="h-4 w-72 bg-zinc-800 rounded-md" />
          </div>
        </div>
        <div className="h-9 w-32 bg-zinc-800 rounded-lg" />
      </div>

      {/* Global Stats Skeleton */}
      <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-[74px] rounded-xl bg-zinc-900/50 border border-zinc-800/80 p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-zinc-800" />
            <div className="space-y-2">
              <div className="h-2 w-16 bg-zinc-800 rounded" />
              <div className="h-5 w-12 bg-zinc-800 rounded" />
            </div>
          </div>
        ))}
      </div>
      <div className="sm:hidden h-[120px] rounded-xl bg-zinc-900/50 border border-zinc-800/80" />

      {/* Filter Bar Skeleton */}
      <div className="h-16 bg-zinc-900/50 rounded-xl border border-zinc-850" />

      {/* Table Skeleton */}
      <div className="bg-zinc-900 border border-zinc-850 rounded-xl overflow-hidden shadow-xl hidden md:block">
        <div className="h-10 border-b border-zinc-850 bg-zinc-955/30" />
        <div className="divide-y divide-zinc-850/60">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-14 p-4 flex items-center justify-between">
              <div className="h-4 w-32 bg-zinc-800 rounded" />
              <div className="h-4 w-16 bg-zinc-800 rounded" />
              <div className="h-4 w-20 bg-zinc-800 rounded" />
              <div className="h-6 w-10 bg-zinc-800 rounded-full" />
              <div className="flex gap-2">
                <div className="w-8 h-8 bg-zinc-800 rounded-lg" />
                <div className="w-8 h-8 bg-zinc-800 rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
