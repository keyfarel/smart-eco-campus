"use client"

interface FloorSelectorBarProps {
  activeFloor: string
  setActiveFloor: (floor: string) => void
}

export function FloorSelectorBar({ activeFloor, setActiveFloor }: FloorSelectorBarProps) {
  return (
    <div className="flex items-center gap-2 pb-1 overflow-x-auto scrollbar-none border-b border-zinc-850/50">
      {["Semua", "Lantai 5", "Lantai 6", "Lantai 7", "Lantai 8"].map((floor) => (
        <button
          key={floor}
          onClick={() => setActiveFloor(floor)}
          className={`px-3.5 py-1.5 rounded-lg border text-xs font-bold transition-all duration-300 ${
            activeFloor === floor
              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.05)]"
              : "bg-zinc-900/40 border-zinc-850 text-zinc-400 hover:text-foreground hover:bg-zinc-900/40"
          }`}
        >
          {floor}
        </button>
      ))}
    </div>
  )
}
