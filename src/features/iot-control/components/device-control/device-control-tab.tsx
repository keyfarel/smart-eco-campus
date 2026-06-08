"use client"

import { useState, useMemo } from "react"
import { useSession } from "next-auth/react"
import { useBuildings } from "@/features/building-management/hooks/use-buildings"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DoorOpen, Lightbulb, Fan, Zap, Play, Square, Cpu, Activity, ArrowRight, Search, Building2, Layers, RotateCcw, LayoutGrid, List, ArrowDownWideNarrow } from "lucide-react"
import { Device } from "../../types/device"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useBuildingTelemetry } from "../../hooks/use-building-telemetry"

interface DeviceControlTabProps {
  devices: Device[]
  connected: boolean
  toggling: string | null
  toggleDevice: (deviceId: string, currentState: boolean, isPhysicalOverride?: boolean, overrideRoomName?: string) => Promise<void>
  setAllDevices: (roomName: string, state: boolean, deviceIds?: string[]) => Promise<void>
  isReadOnly: boolean
  roomAutomation: Record<string, boolean>
  toggleRoomAutomation: (roomName: string) => Promise<void>
  isFirebaseReady?: boolean
  initializeFirebaseData?: () => Promise<void>
}

export function DeviceControlTab({
  devices,
  connected,
  toggling,
  toggleDevice,
  setAllDevices,
  isReadOnly,
  roomAutomation,
  toggleRoomAutomation,
  isFirebaseReady,
  initializeFirebaseData,
}: DeviceControlTabProps) {
  const { data: session } = useSession()
  const userRole = session?.user?.role || "ADMIN_GEDUNG"
  const assignedGedung = session?.user?.assignedGedung || "gedung_a"
  const isSuperAdmin = userRole === "SUPER_ADMIN"
  const isBuildingAdmin = userRole === "ADMIN_GEDUNG"

  const { buildingsList } = useBuildings()
  const searchParams = useSearchParams()
  const highlightedRoom = searchParams?.get("room")

  const { allRoomsData } = useBuildingTelemetry()

  // Layout mode state
  const [viewMode, setViewMode] = useState<"grid" | "table">("table")

  // Filtering & Sorting states
  const [roomSearch, setRoomSearch] = useState("")
  const [buildingFilter, setBuildingFilter] = useState("all")
  const [floorFilter, setFloorFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortBy, setSortBy] = useState<"name" | "power">("name")

  // Helper functions
  const getRoomBuilding = (roomName: string) => {
    const parentBuilding = buildingsList.find((b) =>
      (b.rooms || []).some((r) => r.name === roomName)
    )
    return parentBuilding ? parentBuilding.id : "gedung_a"
  }

  const getRoomFloor = (roomName: string) => {
    for (const b of buildingsList) {
      const foundRoom = (b.rooms || []).find((r) => r.name === roomName)
      if (foundRoom) return `lantai_${foundRoom.floor}`
    }
    return "lantai_1"
  }

  const calculateRoomPower = (roomName: string) => {
    const telemetry = allRoomsData[roomName]
    if (telemetry !== undefined) {
      return telemetry.watt
    }

    // Fallback if no telemetry (or offline)
    const roomDevices = devices.filter((d) => d.location === roomName)
    return roomDevices.reduce((sum, d) => sum + (d.isOn ? d.powerUsage : 0), 0)
  }

  // 🏗️ Grouping & Filtering Logic (Optimized: Derived from Building Master Data)
  const groupedRooms = useMemo(() => {
    // Collect all rooms from buildings that should be visible to this user
    const allAvailableRooms: { id: string; name: string; buildingId: string; floor: number; code?: string }[] = []

    buildingsList.forEach(building => {
      // Security Filter: Building Admin only sees their assigned building
      if (isBuildingAdmin && building.id !== assignedGedung) return

      // Super Admin filter
      if (isSuperAdmin && buildingFilter !== "all" && building.id !== buildingFilter) return

      (building.rooms || []).forEach(room => {
        allAvailableRooms.push({
          id: room.id,
          name: room.name,
          buildingId: building.id,
          floor: room.floor,
          code: room.code
        })
      })
    })

    // Apply UI Filters
    const filtered = allAvailableRooms.filter((room: any) => {
      // 🚨 LIVE IOT FILTER: Only show rooms that have registered devices in Firebase
      const roomDevices = devices.filter((d) => d.location === room.name || (room.code && d.id && d.id.startsWith(room.code + '-')))
      if (roomDevices.length === 0) return false

      const matchesSearch = room.name.toLowerCase().includes(roomSearch.toLowerCase())
      if (!matchesSearch) return false

      if (floorFilter !== "all" && `lantai_${room.floor}` !== floorFilter) return false

      if (statusFilter !== "all") {
        const isAnyDeviceOn = roomDevices.some((d) => d.isOn)
        const isAutoMode = roomAutomation[room.id] !== false

        if (statusFilter === "active" && !isAnyDeviceOn) return false
        if (statusFilter === "inactive" && isAnyDeviceOn) return false
        if (statusFilter === "auto" && !isAutoMode) return false
        if (statusFilter === "override" && isAutoMode) return false
      }
      return true
    })

    // Apply sorting
    if (sortBy === "power") {
      filtered.sort((a, b) => calculateRoomPower(b.name) - calculateRoomPower(a.name))
    } else {
      filtered.sort((a, b) => a.name.localeCompare(b.name))
    }

    // Group by building
    const groups: Record<string, typeof allAvailableRooms> = {}
    filtered.forEach((room) => {
      if (!groups[room.buildingId]) groups[room.buildingId] = []
      groups[room.buildingId].push(room)
    })

    return groups
  }, [devices, buildingsList, roomSearch, buildingFilter, floorFilter, statusFilter, sortBy, isBuildingAdmin, assignedGedung, isSuperAdmin, roomAutomation])

  const hasActiveFilters = roomSearch !== "" || buildingFilter !== "all" || floorFilter !== "all" || statusFilter !== "all" || sortBy !== "name"

  const handleResetFilters = () => {
    setRoomSearch("")
    setBuildingFilter("all")
    setFloorFilter("all")
    setStatusFilter("all")
    setSortBy("name")
  }

  const getDeviceIcon = (id: string) => {
    const typeId = id.toLowerCase()
    if (typeId.includes("lamp") || typeId.includes("relay_1")) return <Lightbulb className="w-4 h-4" />
    if (typeId.includes("ac") || typeId.includes("fan") || typeId.includes("kipas") || typeId.includes("relay_2")) return <Fan className="w-4 h-4" />
    return <Zap className="w-4 h-4" />
  }

  return (
    <div className="space-y-6 animate-fadeIn pb-20">
      {/* 🚀 Header Bar Status & Filter Area */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 bg-zinc-900/50 p-4 rounded-xl border border-zinc-855 backdrop-blur-md sticky top-0 z-30 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
              <Cpu className="w-4.5 h-4.5 text-emerald-450" />
            </div>
            <span className="flex h-2 w-2 relative">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${connected ? "bg-emerald-450" : "bg-red-500"}`}></span>
              <span className={`relative inline-flex rounded-full h-2 w-2 ${connected ? "bg-emerald-500" : "bg-red-600"}`}></span>
            </span>
          </div>

          <div className="flex bg-zinc-955 p-0.5 rounded-lg border border-zinc-850">
            <button onClick={() => setViewMode("table")} className={`p-1.5 rounded transition-all cursor-pointer ${viewMode === "table" ? "bg-zinc-900 text-emerald-400 border border-zinc-800" : "text-zinc-500"}`}><List className="w-3.5 h-3.5" /></button>
            <button onClick={() => setViewMode("grid")} className={`p-1.5 rounded transition-all cursor-pointer ${viewMode === "grid" ? "bg-zinc-900 text-emerald-400 border border-zinc-800" : "text-zinc-500"}`}><LayoutGrid className="w-3.5 h-3.5" /></button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative w-full md:w-44">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-555" />
            <Input
              placeholder="Cari ruangan..."
              value={roomSearch}
              onChange={(e) => setRoomSearch(e.target.value)}
              className="pl-9 h-9 bg-zinc-955 border-zinc-850 text-xs focus-visible:ring-0 focus-visible:border-emerald-500"
            />
          </div>

          {isSuperAdmin && (
            <Select value={buildingFilter} onValueChange={setBuildingFilter}>
              <SelectTrigger className="h-9 w-40 bg-zinc-955 border-zinc-850 text-xs focus-visible:ring-0"><SelectValue placeholder="Semua Gedung" /></SelectTrigger>
              <SelectContent className="bg-zinc-900 border-zinc-800 text-xs">
                <SelectItem value="all">Semua Gedung</SelectItem>
                {buildingsList.map((b) => <SelectItem key={b.id} value={b.id}>{b.name.split(" (")[0]}</SelectItem>)}
              </SelectContent>
            </Select>
          )}

          <Select value={sortBy} onValueChange={(v: any) => setSortBy(v)}>
            <SelectTrigger className="h-9 w-36 bg-zinc-955 border-zinc-850 text-xs focus-visible:ring-0">
              <div className="flex items-center gap-1.5"><ArrowDownWideNarrow className="w-3.5 h-3.5 text-zinc-500" /><SelectValue placeholder="Urutkan" /></div>
            </SelectTrigger>
            <SelectContent className="bg-zinc-900 border-zinc-800 text-xs">
              <SelectItem value="name">Nama (A-Z)</SelectItem>
              <SelectItem value="power">Daya Tertinggi</SelectItem>
            </SelectContent>
          </Select>

          {hasActiveFilters && (
            <Button variant="outline" onClick={handleResetFilters} className="h-9 bg-zinc-955 hover:bg-red-500/10 border-zinc-850 text-zinc-400 hover:text-red-400 text-xs px-3 gap-1.5"><RotateCcw className="w-3.5 h-3.5" /><span>Reset</span></Button>
          )}
        </div>
      </div>

      {/* 📦 CONTENT RENDERER WITH BUILDING GROUPS */}
      {Object.keys(groupedRooms).length === 0 ? (
        <div className="bg-zinc-950 border border-zinc-850 rounded-xl p-12 text-center flex flex-col items-center">
          <DoorOpen className="w-12 h-12 text-zinc-750 mb-3 animate-pulse" />
          <h4 className="text-sm font-bold text-zinc-400">Tidak ada ruangan ditemukan</h4>
        </div>
      ) : (
        Object.entries(groupedRooms).map(([buildingId, roomList]) => {
          const bName = buildingsList.find(b => b.id === buildingId)?.name || buildingId;
          return (
            <div key={buildingId} className="space-y-4">
              {/* Sticky Building Header */}
              <div className="sticky top-16 z-20 py-2 bg-background/95 backdrop-blur-sm">
                <div className="flex items-center gap-2 px-1">
                  <div className="w-1.5 h-4 bg-emerald-500 rounded-full" />
                  <h3 className="text-sm font-bold text-zinc-200 uppercase tracking-widest flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-emerald-500/70" />
                    {bName}
                    <Badge variant="secondary" className="bg-zinc-800 text-[10px] ml-2 px-1.5 h-4">{roomList.length} Ruangan</Badge>
                  </h3>
                </div>
              </div>

              {viewMode === "table" ? (
                <div className="bg-zinc-900 border border-zinc-850 rounded-xl overflow-hidden shadow-xl">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-zinc-850 bg-zinc-955/30 text-[10px] font-bold text-zinc-455 uppercase tracking-wider">
                          <th className="px-4 py-3">Ruangan</th>
                          <th className="px-4 py-3">Status</th>
                          <th className="px-4 py-3">Daya</th>
                          <th className="px-4 py-3 text-center">AI Auto</th>
                          <th className="px-4 py-3">Relay Control</th>
                          <th className="px-4 py-3 text-right">Aksi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-850/60 text-xs">
                        {roomList.map((room: any) => {
                          const roomWatts = calculateRoomPower(room.name)
                          const roomDevices = devices.filter(d => d.location === room.name || (room.code && d.id && d.id.startsWith(room.code + '-')))
                          const isAnyOn = roomDevices.some(d => d.isOn)
                          return (
                            <tr key={room.id} className="hover:bg-zinc-950/20 transition-colors">
                              <td className="px-4 py-3 font-bold text-zinc-200"><div className="flex items-center gap-2"><DoorOpen className={`w-3.5 h-3.5 ${isAnyOn ? "text-emerald-400" : "text-zinc-600"}`} />{room.name}</div></td>
                              <td className="px-4 py-3"><Badge className={isAnyOn ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-zinc-800/30 text-zinc-600"}>{isAnyOn ? "Aktif" : "Padam"}</Badge></td>
                              <td className="px-4 py-3 font-mono font-bold text-zinc-400">{roomWatts} W</td>
                              <td className="px-4 py-3"><div className="flex items-center justify-center gap-2"><Switch checked={roomAutomation[room.id] !== false} onCheckedChange={() => toggleRoomAutomation(room.id)} className="scale-75 data-[state=checked]:bg-emerald-500" /></div></td>
                              <td className="px-4 py-3">
                                <div className="flex gap-2">
                                  {(() => {
                                    const uniqueDevices = new Map();
                                    roomDevices.forEach(d => {
                                      const typeId = d.id.toLowerCase();
                                      const type = (typeId.includes("lamp") || typeId.includes("relay_1")) ? "lamp" 
                                        : (typeId.includes("ac") || typeId.includes("fan") || typeId.includes("kipas") || typeId.includes("relay_2")) ? "acFan" 
                                        : "pcProjector";
                                      if (!uniqueDevices.has(type)) uniqueDevices.set(type, d);
                                    });
                                    return Array.from(uniqueDevices.values()).map(d => (
                                      <button key={d.id} onClick={() => toggleDevice(d.id, d.isOn, false, room.name)} className={`p-1.5 rounded-lg border transition-all ${d.isOn ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" : "bg-zinc-955 border-zinc-850 text-zinc-650"}`}>{getDeviceIcon(d.id)}</button>
                                    ));
                                  })()}
                                </div>
                              </td>
                              <td className="px-4 py-3 text-right">
                                <div className="flex justify-end gap-1.5">
                                  <Button size="sm" variant="ghost" onClick={() => setAllDevices(room.name, false, roomDevices.map(d => d.id))} className="h-7 w-7 p-0 text-red-500/70 hover:text-red-500 hover:bg-red-500/10"><Square className="w-3 h-3" /></Button>
                                  <Button size="sm" variant="ghost" onClick={() => setAllDevices(room.name, true, roomDevices.map(d => d.id))} className="h-7 w-7 p-0 text-emerald-500/70 hover:text-emerald-500 hover:bg-emerald-500/10"><Play className="w-3 h-3" /></Button>
                                </div>
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {roomList.map((room: any) => {
                    const roomWatts = calculateRoomPower(room.name)
                    const roomDevices = devices.filter(d => d.location === room.name || (room.code && d.id && d.id.startsWith(room.code + '-')))
                    const isAnyOn = roomDevices.some(d => d.isOn)
                    return (
                      <Card key={room.id} className={`bg-zinc-900 border-zinc-855 transition-all ${isAnyOn ? "border-emerald-500/20 shadow-sm" : ""}`}>
                        <CardHeader className="p-3 pb-2 flex flex-row items-center justify-between space-y-0">
                          <div className="flex items-center gap-2 min-w-0">
                            <DoorOpen className={`w-4 h-4 ${isAnyOn ? "text-emerald-400" : "text-zinc-600"}`} />
                            <CardTitle className="text-xs font-bold truncate">{room.name}</CardTitle>
                          </div>
                          <Zap className={`w-3.5 h-3.5 ${isAnyOn ? "text-emerald-400 animate-pulse" : "text-zinc-700"}`} />
                        </CardHeader>
                        <CardContent className="p-3 pt-0">
                          <div className="flex justify-between items-center mb-3">
                            <span className="text-[10px] font-mono text-zinc-500">{roomWatts} W Consumption</span>
                            <Switch checked={roomAutomation[room.id] !== false} onCheckedChange={() => toggleRoomAutomation(room.id)} className="scale-65" />
                          </div>
                          <div className="flex gap-1.5">
                            {(() => {
                              const uniqueDevices = new Map();
                              roomDevices.forEach(d => {
                                const typeId = d.id.toLowerCase();
                                const type = (typeId.includes("lamp") || typeId.includes("relay_1")) ? "lamp" 
                                  : (typeId.includes("ac") || typeId.includes("fan") || typeId.includes("kipas") || typeId.includes("relay_2")) ? "acFan" 
                                  : "pcProjector";
                                if (!uniqueDevices.has(type)) uniqueDevices.set(type, d);
                              });
                              return Array.from(uniqueDevices.values()).map(d => (
                                <Button key={d.id} variant="outline" size="sm" onClick={() => toggleDevice(d.id, d.isOn, false, room.name)} className={`h-8 flex-1 gap-1 text-[10px] ${d.isOn ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-400" : "bg-zinc-950 border-zinc-850 text-zinc-600"}`}>
                                  {getDeviceIcon(d.id)}
                                  {d.isOn ? "ON" : "OFF"}
                                </Button>
                              ));
                            })()}
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })
      )}
    </div>
  )
}

