"use client"

import { DoorOpen, Users, Building2 } from "lucide-react"
import { Room } from "@/features/building-management/types/building"
import { Card, CardContent } from "@/components/ui/card"

interface RoomMetricsProps {
  rooms: Room[]
  buildingCount: number
}

export function RoomMetrics({ rooms, buildingCount }: RoomMetricsProps) {
  const totalCapacity = rooms.reduce((acc, r) => acc + (r.capacity || 0), 0)

  return (
    <div className="grid grid-cols-3 gap-3 sm:gap-4">
      {/* Card 1: Total Rooms */}
      <Card className="bg-zinc-900 border-zinc-800 hover:border-zinc-750 hover:shadow-[0_4px_20px_rgba(0,0,0,0.15)] transition-all max-sm:aspect-square overflow-hidden rounded-xl">
        <CardContent className="p-2 sm:p-4 w-full h-full flex flex-col sm:flex-row items-center justify-center sm:justify-start text-center sm:text-left gap-1 sm:gap-4">
          <div className="p-1.5 sm:p-0 sm:w-12 sm:h-12 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0 mb-1 sm:mb-0">
            <DoorOpen className="w-4 h-4 sm:w-6 sm:h-6" />
          </div>
          <div className="flex flex-col items-center sm:items-start">
            <span className="text-xs text-zinc-400 font-semibold tracking-wide hidden sm:block mb-0.5">Total Rooms</span>
            <p className="text-lg sm:text-2xl font-extrabold font-mono text-zinc-100 leading-none">{rooms.length}</p>
            <p className="text-[9px] text-blue-400 uppercase font-semibold block sm:hidden mt-1">Rooms</p>
            <p className="text-[10px] text-zinc-500 hidden sm:block mt-1">Registered physical rooms</p>
          </div>
        </CardContent>
      </Card>

      {/* Card 2: Total Capacity */}
      <Card className="bg-zinc-900 border-zinc-800 hover:border-zinc-750 hover:shadow-[0_4px_20px_rgba(0,0,0,0.15)] transition-all max-sm:aspect-square overflow-hidden rounded-xl">
        <CardContent className="p-2 sm:p-4 w-full h-full flex flex-col sm:flex-row items-center justify-center sm:justify-start text-center sm:text-left gap-1 sm:gap-4">
          <div className="p-1.5 sm:p-0 sm:w-12 sm:h-12 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 shrink-0 mb-1 sm:mb-0">
            <Users className="w-4 h-4 sm:w-6 sm:h-6" />
          </div>
          <div className="flex flex-col items-center sm:items-start">
            <span className="text-xs text-zinc-400 font-semibold tracking-wide hidden sm:block mb-0.5">Total Capacity</span>
            <p className="text-lg sm:text-2xl font-extrabold font-mono text-zinc-100 leading-none">{totalCapacity}</p>
            <p className="text-[9px] text-emerald-400 uppercase font-semibold block sm:hidden mt-1">Capacity</p>
            <p className="text-[10px] text-zinc-500 hidden sm:block mt-1">Max human capacity across campus</p>
          </div>
        </CardContent>
      </Card>

      {/* Card 3: Building Coverage */}
      <Card className="bg-zinc-900 border-zinc-800 hover:border-zinc-750 hover:shadow-[0_4px_20px_rgba(0,0,0,0.15)] transition-all max-sm:aspect-square overflow-hidden rounded-xl">
        <CardContent className="p-2 sm:p-4 w-full h-full flex flex-col sm:flex-row items-center justify-center sm:justify-start text-center sm:text-left gap-1 sm:gap-4">
          <div className="p-1.5 sm:p-0 sm:w-12 sm:h-12 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 shrink-0 mb-1 sm:mb-0">
            <Building2 className="w-4 h-4 sm:w-6 sm:h-6" />
          </div>
          <div className="flex flex-col items-center sm:items-start">
            <span className="text-xs text-zinc-400 font-semibold tracking-wide hidden sm:block mb-0.5">Active Buildings</span>
            <p className="text-lg sm:text-2xl font-extrabold font-mono text-zinc-100 leading-none">{buildingCount}</p>
            <p className="text-[9px] text-amber-400 uppercase font-semibold block sm:hidden mt-1">Coverage</p>
            <p className="text-[10px] text-zinc-500 hidden sm:block mt-1">Buildings with registered rooms</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
