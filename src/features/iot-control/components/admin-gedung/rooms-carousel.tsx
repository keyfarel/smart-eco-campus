"use client"

import { DoorOpen, Zap, Users, Lightbulb, Fan, Settings, ArrowRight } from "lucide-react"
import Link from "next/link"

interface RoomData {
  status: string
  occupancy: number
  watt: number
  lampsOn: boolean
  acOn: boolean
  plugOn: boolean
}

interface RoomsCarouselProps {
  filteredRooms: string[]
  activeRoom: string
  setActiveRoom: (room: string) => void
  setIsPatrolling: (patrolling: boolean) => void
  allRoomsData: Record<string, RoomData>
}

export function RoomsCarousel({
  filteredRooms,
  activeRoom,
  setActiveRoom,
  setIsPatrolling,
  allRoomsData,
}: RoomsCarouselProps) {
  return (
    <div className="relative group/carousel w-full max-w-[calc(100vw-3rem)] lg:max-w-[calc(100vw-20rem)] overflow-hidden">
      {/* Left and Right Fade Edge Masks */}
      <div className="absolute top-0 bottom-0 left-0 w-8 bg-gradient-to-r from-background to-transparent pointer-events-none z-10 opacity-0 group-hover/carousel:opacity-100 transition-opacity duration-300" />
      <div className="absolute top-0 bottom-0 right-0 w-8 bg-gradient-to-l from-background to-transparent pointer-events-none z-10 opacity-0 group-hover/carousel:opacity-100 transition-opacity duration-300" />

      <div className="flex gap-4 overflow-x-auto pb-3 snap-x scrollbar-thin scrollbar-thumb-zinc-850 scrollbar-track-transparent">
        {filteredRooms.map((room) => {
          const roomData = allRoomsData[room]
          const isActive = activeRoom === room
          
          // Defensive logic for non-IoT or offline rooms
          const occupancy = roomData?.occupancy || 0
          const watt = roomData?.watt || 0
          const status = roomData?.status || "Passive"
          const lampsOn = roomData?.lampsOn || false
          const acOn = roomData?.acOn || false
          const plugOn = roomData?.plugOn || false
          
          const hasOccupants = occupancy > 0

          return (
            <div
              key={room}
              onClick={() => {
                setActiveRoom(room)
                setIsPatrolling(false)
              }}
              className={`min-w-[280px] md:min-w-[340px] flex-1 snap-start cursor-pointer rounded-xl border p-4 transition-all duration-300 relative group overflow-hidden ${
                isActive
                  ? "bg-zinc-900 border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.03)]"
                  : "bg-background/40 border-zinc-850 hover:border-zinc-700 hover:bg-zinc-900/30"
              }`}
            >
              {/* Active glow top bar */}
              {isActive && (
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-emerald-500/20 via-emerald-500 to-emerald-500/20" />
              )}

              <div className="flex flex-col justify-between h-full gap-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 border ${
                        isActive
                          ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                          : "bg-zinc-900 border-zinc-800 text-zinc-500"
                      }`}
                    >
                      <DoorOpen className="w-4.5 h-4.5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-foreground truncate">{room}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="flex items-center gap-1 shrink-0">
                          <span className={`h-1.5 w-1.5 rounded-full ${status === "Online" ? "bg-emerald-400 animate-pulse" : status === "Passive" ? "bg-zinc-700" : "bg-red-500"}`}></span>
                          <span className="text-[9px] text-zinc-500 font-mono uppercase font-bold">{status === "Passive" ? "Passive" : "Live"}</span>
                        </span>

                        {/* Device Active Status Badge */}
                        {!lampsOn && !acOn && !plugOn ? (
                          <span className="text-[9px] px-1.5 py-0.5 rounded border bg-background text-zinc-500 border-zinc-800 font-medium whitespace-nowrap">
                            Semua Padam
                          </span>
                        ) : lampsOn && acOn && plugOn ? (
                          <span className="text-[9px] px-1.5 py-0.5 rounded border bg-emerald-500/10 text-emerald-400 border-emerald-500/20 font-bold animate-pulse whitespace-nowrap">
                            Semua Aktif
                          </span>
                        ) : (
                          <span className="text-[9px] px-1.5 py-0.5 rounded border bg-yellow-500/10 text-yellow-500 border-yellow-500/20 font-medium whitespace-nowrap">
                            Sebagian Aktif
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="flex items-center justify-end gap-1 text-[11px] font-mono text-zinc-400">
                      <Zap className={`w-3.5 h-3.5 ${hasOccupants ? "text-emerald-400" : "text-zinc-600"}`} />
                      <span className={hasOccupants ? "text-emerald-400 font-bold" : "text-zinc-500"}>
                        {watt}W
                      </span>
                    </div>
                    <div className="flex items-center justify-end gap-1 text-[11px] font-mono text-zinc-400 mt-1">
                      <Users className={`w-3.5 h-3.5 ${hasOccupants ? "text-emerald-400" : "text-zinc-600"}`} />
                      <span className={hasOccupants ? "text-emerald-400 font-bold" : "text-zinc-500"}>
                        {occupancy} Mhs
                      </span>
                    </div>
                  </div>
                </div>

                {/* Active device indicators (Lampu, AC, Stopkontak) */}
                <div className="flex items-center justify-between py-1.5 border-t border-zinc-850/50 mt-1">
                  <span className="text-[9px] text-zinc-500 uppercase font-mono font-bold shrink-0">Alat Aktif:</span>
                  <div className="flex items-center gap-1.5">
                    {/* Lamp indicator */}
                    <div
                      title={lampsOn ? "Lampu Menyala" : "Lampu Padam"}
                      className={`w-5 h-5 rounded flex items-center justify-center border transition-all ${
                        lampsOn
                          ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.1)]"
                          : "bg-background/80 border-zinc-850 text-zinc-700"
                      }`}
                    >
                      <Lightbulb className="w-3.5 h-3.5" />
                    </div>

                    {/* AC Indicator */}
                    <div
                      title={acOn ? "AC Menyala" : "AC Padam"}
                      className={`w-5 h-5 rounded flex items-center justify-center border transition-all ${
                        acOn
                          ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.1)]"
                          : "bg-background/80 border-zinc-850 text-zinc-700"
                      }`}
                    >
                      <Fan className={`w-3.5 h-3.5 ${acOn ? "animate-spin-slow" : ""}`} />
                    </div>

                    {/* Socket Indicator */}
                    <div
                      title={plugOn ? "Stopkontak Aktif" : "Stopkontak Padam"}
                      className={`w-5 h-5 rounded flex items-center justify-center border transition-all ${
                        plugOn
                          ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.1)]"
                          : "bg-background/80 border-zinc-850 text-zinc-700"
                      }`}
                    >
                      <Zap className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>

                {/* Quick Access Premium Button to Device Control */}
                <Link
                  href={`/admin-gedung/devices?room=${room}`}
                  className="flex items-center justify-between px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-emerald-500/40 text-[10px] font-bold text-zinc-400 hover:text-emerald-400 transition-all duration-300 w-full group/btn bg-gradient-to-r hover:from-emerald-500/5 hover:to-emerald-500/0"
                  onClick={(e) => e.stopPropagation()} // Prevent select tab click
                >
                  <span className="flex items-center gap-2">
                    <Settings className="w-3.5 h-3.5 group-hover/btn:rotate-45 transition-transform duration-300" />
                    <span>Kendali Sakelar & Relai</span>
                  </span>
                  <ArrowRight className="w-3 h-3 group-hover/btn:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
