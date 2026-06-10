"use client"

import { Building2, DoorOpen, Cpu } from "lucide-react"
import { Building } from "@/features/building-management/types/building"
import { Card, CardContent } from "@/components/ui/card"

interface BuildingMetricsProps {
  buildingsList: Building[]
}

export function BuildingMetrics({ buildingsList }: BuildingMetricsProps) {
  return (
    <div className="grid grid-cols-3 gap-3 sm:gap-4">
      {/* Card 1: Total Buildings */}
      <Card className="bg-zinc-900 border-zinc-800 hover:border-zinc-750 hover:shadow-[0_4px_20px_rgba(0,0,0,0.15)] transition-all max-sm:aspect-square overflow-hidden rounded-xl">
        <CardContent className="p-2 sm:p-4 w-full h-full flex flex-col sm:flex-row items-center justify-center sm:justify-start text-center sm:text-left gap-1 sm:gap-4">
          <div className="p-1.5 sm:p-0 sm:w-12 sm:h-12 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 shrink-0 mb-1 sm:mb-0">
            <Building2 className="w-4 h-4 sm:w-6 sm:h-6" />
          </div>
          <div className="flex flex-col items-center sm:items-start">
            <span className="text-xs text-zinc-400 font-semibold tracking-wide hidden sm:block mb-0.5">Total Buildings</span>
            <p className="text-lg sm:text-2xl font-extrabold font-mono text-zinc-100 leading-none">{buildingsList.length}</p>
            <p className="text-[9px] text-emerald-400 uppercase font-semibold block sm:hidden mt-1">Buildings</p>
            <p className="text-[10px] text-zinc-500 hidden sm:block mt-1">Registered campus facilities</p>
          </div>
        </CardContent>
      </Card>

      {/* Card 2: Total Rooms */}
      <Card className="bg-zinc-900 border-zinc-800 hover:border-zinc-750 hover:shadow-[0_4px_20px_rgba(0,0,0,0.15)] transition-all max-sm:aspect-square overflow-hidden rounded-xl">
        <CardContent className="p-2 sm:p-4 w-full h-full flex flex-col sm:flex-row items-center justify-center sm:justify-start text-center sm:text-left gap-1 sm:gap-4">
          <div className="p-1.5 sm:p-0 sm:w-12 sm:h-12 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0 mb-1 sm:mb-0">
            <DoorOpen className="w-4 h-4 sm:w-6 sm:h-6" />
          </div>
          <div className="flex flex-col items-center sm:items-start">
            <span className="text-xs text-zinc-400 font-semibold tracking-wide hidden sm:block mb-0.5">Total Rooms</span>
            <p className="text-lg sm:text-2xl font-extrabold font-mono text-zinc-100 leading-none">
              {buildingsList.reduce((acc, b) => acc + (b.roomsCount ?? (b.floorsCount * 4)), 0)}
            </p>
            <p className="text-[9px] text-blue-400 uppercase font-semibold block sm:hidden mt-1">Rooms</p>
            <p className="text-[10px] text-zinc-500 hidden sm:block mt-1">Active physical classrooms</p>
          </div>
        </CardContent>
      </Card>

      {/* Card 3: Connected IoT Devices */}
      <Card className="bg-zinc-900 border-zinc-800 hover:border-zinc-750 hover:shadow-[0_4px_20px_rgba(0,0,0,0.15)] transition-all max-sm:aspect-square overflow-hidden rounded-xl">
        <CardContent className="p-2 sm:p-4 w-full h-full flex flex-col sm:flex-row items-center justify-center sm:justify-start text-center sm:text-left gap-1 sm:gap-4">
          <div className="p-1.5 sm:p-0 sm:w-12 sm:h-12 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 shrink-0 mb-1 sm:mb-0">
            <Cpu className="w-4 h-4 sm:w-6 sm:h-6" />
          </div>
          <div className="flex flex-col items-center sm:items-start">
            <span className="text-xs text-zinc-400 font-semibold tracking-wide hidden sm:block mb-0.5">IoT Devices</span>
            <p className="text-lg sm:text-2xl font-extrabold font-mono text-zinc-100 leading-none">
              {buildingsList.reduce((acc, b) => acc + (b.activeDevicesCount || 0), 0)}
            </p>
            <p className="text-[9px] text-purple-400 uppercase font-semibold block sm:hidden mt-1">IoT</p>
            <p className="text-[10px] text-zinc-500 hidden sm:block mt-1">Active ESP32 sensor nodes</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

