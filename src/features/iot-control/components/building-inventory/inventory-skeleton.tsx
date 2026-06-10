export function InventorySkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-20 bg-zinc-900 rounded-xl" />
      <div className="grid grid-cols-4 gap-4">
        <div className="h-24 bg-zinc-900 rounded-xl" />
        <div className="h-24 bg-zinc-900 rounded-xl" />
        <div className="h-24 bg-zinc-900 rounded-xl" />
        <div className="h-24 bg-zinc-900 rounded-xl" />
      </div>
      <div className="h-96 bg-zinc-900 rounded-xl" />
    </div>
  )
}
