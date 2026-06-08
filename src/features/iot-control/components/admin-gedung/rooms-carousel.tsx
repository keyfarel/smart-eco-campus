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
  allRoomsData: Record<string, RoomData>
  getRoomMode: (roomName: string) => "AUTO" | "OVERRIDE"
  getRoomCode: (roomName: string) => string
}

export function RoomsCarousel({
  filteredRooms,
  activeRoom,
  setActiveRoom,
  allRoomsData,
  getRoomMode,
  getRoomCode,
}: RoomsCarouselProps) {
  return (
    <div className="relative group/carousel w-full overflow-hidden">
      <div className="flex gap-3 sm:gap-4 overflow-x-auto pb-4 pt-1 snap-x snap-mandatory scrollbar-thin scrollbar-thumb-zinc-850 scrollbar-track-transparent -mx-4 px-4 sm:mx-0 sm:px-0">
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
          const roomMode = getRoomMode(room)

          return (
            <div
              key={room}
              onClick={() => setActiveRoom(room)}
              className={`w-[140px] sm:w-[160px] shrink-0 snap-center sm:snap-start cursor-pointer rounded-2xl border p-3 sm:p-4 transition-all duration-300 relative group overflow-hidden flex flex-col justify-between h-[100px] sm:h-[120px] ${
                isActive
                  ? "bg-zinc-900 border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.03)]"
                  : "bg-background/40 border-zinc-850 hover:border-zinc-700 hover:bg-zinc-900/30"
              }`}
            >
              {/* Active glow top bar */}
              {isActive && (
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-emerald-500/20 via-emerald-500 to-emerald-500/20" />
              )}

              {/* Top part: Status */}
              <div className="flex items-start">
                <span className="flex items-center gap-1.5 shrink-0 bg-background/60 backdrop-blur-sm px-2 py-1 rounded-full border border-zinc-800/50">
                  <span className={`h-1.5 w-1.5 rounded-full ${roomMode === "AUTO" ? "bg-emerald-400" : "bg-yellow-500"}`}></span>
                  <span className={`text-[9px] font-mono uppercase font-bold ${roomMode === "AUTO" ? "text-emerald-400" : "text-yellow-500"}`}>{roomMode}</span>
                </span>
              </div>

              {/* Bottom part: Room Name & Device Indicators */}
              <div>
                <p className="text-sm font-bold text-foreground truncate mb-2">{getRoomCode(room)}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Lightbulb className={`w-3.5 h-3.5 ${lampsOn ? 'text-emerald-400 drop-shadow-[0_0_5px_rgba(16,185,129,0.5)]' : 'text-zinc-700'}`} />
                    <Fan className={`w-3.5 h-3.5 ${acOn ? 'text-emerald-400 drop-shadow-[0_0_5px_rgba(16,185,129,0.5)] animate-spin-slow' : 'text-zinc-700'}`} />
                    <Zap className={`w-3 h-3 ${plugOn ? 'text-emerald-400 drop-shadow-[0_0_5px_rgba(16,185,129,0.5)]' : 'text-zinc-700'}`} />
                  </div>
                  
                  <Link
                    href={`/admin-gedung/devices?room=${room}`}
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center justify-center w-6 h-6 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-500 hover:text-emerald-400 hover:border-emerald-500/30 transition-all shrink-0"
                  >
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
