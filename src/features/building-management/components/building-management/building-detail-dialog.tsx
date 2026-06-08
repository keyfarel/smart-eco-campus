"use client"

import { useState, useEffect } from "react"
import { Building2, Layers, DoorOpen, Network, Globe, PlusCircle, Cpu, Pencil, Trash2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Building, Room } from "@/features/building-management/types/building"
import { rtdb } from "@/lib/firebase"
import { ref, onValue } from "firebase/database"

interface BuildingDetailDialogProps {
  viewedBuilding: Building | null
  setViewedBuilding: (building: Building | null) => void
  onClose: () => void
}

export function BuildingDetailDialog({
  viewedBuilding,
  setViewedBuilding,
  onClose,
}: BuildingDetailDialogProps) {
  const [buildingNodes, setBuildingNodes] = useState<any[]>([])

  // 📡 REAL-TIME NODE FETCHER (SPECIFIC FOR THIS BUILDING SEGMENT)
  useEffect(() => {
    if (!viewedBuilding || !rtdb) {
      setBuildingNodes([])
      return
    }

    const nodesRef = ref(rtdb, "nodes")
    const unsubscribe = onValue(nodesRef, (snapshot) => {
      const data = snapshot.val()
      if (data) {
        const nodesList: any[] = []
        Object.keys(data).forEach((mac) => {
          const node = data[mac]
          // Filter hanya node yang terdaftar di gedung ini
          if (node.metadata?.gedung_id === viewedBuilding.id) {
            nodesList.push({
              macAddress: mac,
              ...node
            })
          }
        })
        setBuildingNodes(nodesList)
      } else {
        setBuildingNodes([])
      }
    })

    return () => unsubscribe()
  }, [viewedBuilding])

  return (
    <Dialog open={viewedBuilding !== null} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-zinc-950 border-zinc-800 text-foreground max-w-lg p-0 overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)]">
        <div className="p-6 pb-4 border-b border-zinc-850 bg-zinc-950">
          <DialogHeader>
            <DialogTitle className="text-lg flex items-center gap-2">
              <Building2 className="w-5 h-5 text-emerald-500" />
              <span>Building Specification Sheet</span>
            </DialogTitle>
            <DialogDescription>
              Lembar pemeriksaan cetak biru topologi fisik dan jaringan IoT terhubung.
            </DialogDescription>
          </DialogHeader>
        </div>

        {viewedBuilding && (
          <div className="p-6 pt-4 pb-4 space-y-6 max-h-[55vh] overflow-y-auto pr-3 scrollbar-thin scrollbar-thumb-zinc-855 scrollbar-track-transparent">
            {/* Profile Header */}
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-2xl shrink-0 select-none animate-[pulse_3s_infinite]">
                <Building2 className="w-8 h-8" />
              </div>
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-zinc-150 truncate">{viewedBuilding.name}</h3>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.1)]">
                    ONLINE
                  </span>
                </div>
                <span className="text-xs text-zinc-500 font-mono flex items-center gap-1.5 mt-1 truncate">
                  <Globe className="w-3.5 h-3.5 text-zinc-650" />
                  Segment ID: {viewedBuilding.id}
                </span>
              </div>
            </div>

            {/* Data Section 1: System Identity & Topology Stats */}
            <div className="space-y-2">
              <h4 className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest">System Identity & Topology</h4>
              <div className="grid grid-cols-2 gap-3 bg-zinc-950 border border-zinc-850 p-4 rounded-lg">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] text-zinc-500 font-medium">Building Unique ID</span>
                  <span className="text-xs text-zinc-300 font-mono truncate">{viewedBuilding.id}</span>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-[10px] text-zinc-500 font-medium">Floors Count</span>
                  <span className="text-xs text-zinc-300 font-mono flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-zinc-600 shrink-0" />
                    <span>{viewedBuilding.floorsCount} Floors</span>
                  </span>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-[10px] text-zinc-500 font-medium">Mapped Rooms</span>
                  <div className="flex items-center gap-1.5">
                    <DoorOpen className="w-3.5 h-3.5 text-zinc-600 shrink-0" />
                    <span className="text-xs text-zinc-300 font-mono">{(viewedBuilding.rooms || []).length} Rooms</span>
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-[10px] text-zinc-500 font-medium">IoT Gateway Link</span>
                  <div className="flex items-center gap-1.5">
                    <Network className="w-3.5 h-3.5 text-zinc-650 shrink-0" />
                    <span className="text-xs text-zinc-300 font-mono">Active GW v2.1</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Data Section 2: Mapped Rooms per Floor layout */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <h4 className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest">Real Room Topology Map</h4>
              </div>

              <div className="space-y-4 bg-zinc-950 border border-zinc-850 p-4 rounded-lg max-h-[300px] overflow-y-auto scrollbar-thin">
                {Array.from({ length: viewedBuilding.floorsCount }).map((_, floorIdx) => {
                  const floorNum = floorIdx + 1
                  const floorRooms = (viewedBuilding.rooms || []).filter(r => r.floor === floorNum)

                  return (
                    <div key={floorIdx} className="space-y-1.5 border-b border-zinc-850/40 pb-3 last:border-0 last:pb-0">
                      <div className="flex justify-between items-center text-[10px] text-zinc-500 font-medium font-mono">
                        <span>Floor {floorNum}</span>
                        <span>{floorRooms.length} Rooms</span>
                      </div>
                      {floorRooms.length === 0 ? (
                        <div className="text-center py-4 bg-zinc-950/30 border border-zinc-850 border-dashed rounded text-[10px] text-zinc-550 italic">
                          Belum ada ruangan fisik terdaftar di lantai ini.
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 gap-2">
                          {floorRooms.map((room) => {
                            // Cek apakah ruangan ini memiliki sensor/node (Berdasarkan display_name)
                            const node = buildingNodes.find(n => n.metadata?.display_name === room.name)
                            const isOnline = node ? (Date.now() / 1000 - (node.telemetry?.last_seen_timestamp || 0)) < 60 : false

                            return (
                              <div
                                key={room.id}
                                className="bg-zinc-950 border border-zinc-850/60 rounded p-2.5 flex items-center justify-between hover:border-emerald-500/20 transition-all group/room"
                              >
                                <div className="flex items-center gap-2">
                                  <DoorOpen className={`w-4 h-4 shrink-0 ${node ? (isOnline ? "text-emerald-500" : "text-amber-500") : "text-zinc-500/60"}`} />
                                  <div className="flex flex-col min-w-0">
                                    <span className="text-[10px] font-bold text-zinc-200 truncate group-hover/room:text-emerald-300 flex items-center gap-1.5">
                                      {room.name}
                                      {node && <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${isOnline ? "bg-emerald-500 animate-pulse" : "bg-zinc-600"}`} title={isOnline ? "ESP32 Online" : "ESP32 Offline"}></span>}
                                    </span>
                                    <span className="text-[8px] text-zinc-500 font-mono">
                                      Kode: {room.code} • Cap: {room.capacity} seats
                                    </span>
                                  </div>
                                </div>
                                <div className="flex items-center gap-1.5">
                                  <span className="text-[8px] font-mono bg-zinc-950 border border-zinc-850 px-1.5 py-0.5 rounded text-zinc-400 group-hover/room:border-emerald-500/30 transition-colors">
                                    {room.code}
                                  </span>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Data Section 3: IoT Segment & ESP32 Nodes */}
            <div className="space-y-2">
              <h4 className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest">IoT Network Segment & Connected Devices</h4>
              <div className="grid grid-cols-2 gap-3 bg-zinc-950 border border-zinc-850 p-4 rounded-lg">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] text-zinc-500 font-medium">IoT Subnet Segment</span>
                  <span className="text-xs text-zinc-300 font-mono flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-zinc-650 shrink-0" />
                    <span>192.168.{(viewedBuilding.id.charCodeAt(viewedBuilding.id.length - 1) || 65) % 100 + 10}.0/24</span>
                  </span>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-[10px] text-zinc-500 font-medium">Operational Status</span>
                  <span className={`text-xs font-semibold flex items-center gap-1.5 ${buildingNodes.some(n => (Date.now() / 1000 - (n.telemetry?.last_seen_timestamp || 0)) < 60) ? "text-emerald-400" : "text-zinc-500"}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${buildingNodes.some(n => (Date.now() / 1000 - (n.telemetry?.last_seen_timestamp || 0)) < 60) ? "bg-emerald-500 animate-ping" : "bg-zinc-700"} shrink-0`} />
                    <span>{buildingNodes.some(n => (Date.now() / 1000 - (n.telemetry?.last_seen_timestamp || 0)) < 60) ? "ONLINE - 99.98% Uptime" : "STANDBY / NO ACTIVE NODES"}</span>
                  </span>
                </div>

                <div className="col-span-2 space-y-1.5 pt-2 border-t border-zinc-850/60">
                  <span className="text-[10px] text-zinc-500 font-medium block">Active ESP32 Sensor Nodes</span>
                  <div className="grid grid-cols-2 gap-2">
                    {buildingNodes.length > 0 ? buildingNodes.map((node, idx) => {
                      const isOnline = (Date.now() / 1000 - (node.telemetry?.last_seen_timestamp || 0)) < 60;
                      return (
                        <div key={idx} className="bg-zinc-950 border border-zinc-850/60 p-2 rounded flex items-center gap-2">
                          <Cpu className={`w-4 h-4 shrink-0 ${isOnline ? "text-emerald-500" : "text-zinc-500"}`} />
                          <div className="flex flex-col min-w-0">
                            <span className="text-[10px] font-bold text-zinc-300 truncate">{node.metadata?.display_name || "Unknown Room"}</span>
                            <span className="text-[8px] text-zinc-500 font-mono truncate">{node.macAddress}</span>
                          </div>
                        </div>
                      )
                    }) : (
                      <div className="col-span-2 text-center py-3 bg-zinc-950/30 border border-zinc-850 border-dashed rounded text-[10px] text-zinc-550 italic">
                        Belum ada sensor ESP32 yang terhubung ke gedung ini.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Data Section 4: Privileges Description */}
            <div className="p-3 bg-zinc-950 shadow-inner border border-zinc-850 rounded-lg text-[11px] text-zinc-400 flex items-start gap-2.5">
              <Globe className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5 animate-pulse" />
              <div>
                <span className="font-semibold text-zinc-300 block mb-0.5">Topologi Kampus Cerdas</span>
                Gedung ini terdaftar secara resmi di server Smart Eco-Campus. Seluruh data konsumsi daya, deteksi occupancy gerak, dan sensor suhu di dalam partisi ruangan otomatis disalurkan ke dashboard analitik Super Admin dan Executive.
              </div>
            </div>
          </div>
        )}

        <div className="p-6 pt-4 border-t border-zinc-850 flex justify-end bg-zinc-950">
          <Button
            onClick={onClose}
            className="bg-zinc-850 hover:bg-zinc-800 text-zinc-300 font-bold px-6 border border-zinc-750"
          >
            Close Blueprint
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

