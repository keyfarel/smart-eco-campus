"use client"

import { Building2, DoorOpen, Cpu } from "lucide-react"
import { Building } from "@/features/building-management/types/building"

interface BuildingMetricsProps {
  buildingsList: Building[]
}

export function BuildingMetrics({ buildingsList }: BuildingMetricsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Card 1: Total Buildings */}
      <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl flex items-center justify-between hover:border-zinc-750 hover:shadow-[0_4px_20px_rgba(0,0,0,0.15)] transition-all">
        <div className="space-y-1">
          <span className="text-xs text-zinc-400 font-semibold tracking-wide">Total Buildings</span>
          <h3 className="text-2xl font-extrabold font-mono text-zinc-100">{buildingsList.length}</h3>
          <p className="text-[10px] text-zinc-500">Registered campus facilities</p>
        </div>
        <div className="w-12 h-12 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500">
          <Building2 className="w-6 h-6 animate-pulse" />
        </div>
      </div>

      {/* Card 2: Total Rooms */}
      <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl flex items-center justify-between hover:border-zinc-750 hover:shadow-[0_4px_20px_rgba(0,0,0,0.15)] transition-all">
        <div className="space-y-1">
          <span className="text-xs text-zinc-400 font-semibold tracking-wide">Total Rooms</span>
          <h3 className="text-2xl font-extrabold font-mono text-zinc-100">
            {buildingsList.reduce((acc, b) => acc + (b.rooms?.length || b.floorsCount * 4), 0)}
          </h3>
          <p className="text-[10px] text-zinc-500">Active physical classrooms</p>
        </div>
        <div className="w-12 h-12 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
          <DoorOpen className="w-6 h-6" />
        </div>
      </div>

      {/* Card 3: Connected IoT Devices */}
      <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl flex items-center justify-between hover:border-zinc-750 hover:shadow-[0_4px_20px_rgba(0,0,0,0.15)] transition-all">
        <div className="space-y-1">
          <span className="text-xs text-zinc-400 font-semibold tracking-wide">Connected IoT Devices</span>
          <h3 className="text-2xl font-extrabold font-mono text-zinc-100">
            {buildingsList.reduce((acc, b) => acc + (b.activeDevicesCount || 0), 0)}
          </h3>
          <p className="text-[10px] text-zinc-500">Active ESP32 sensor nodes</p>
        </div>
        <div className="w-12 h-12 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
          <Cpu className="w-6 h-6" />
        </div>
      </div>
    </div>
  )
}

