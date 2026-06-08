"use client";

import { DoorOpen, Layers, Users, Zap, ExternalLink, ShieldAlert, Activity, ChevronLeft, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { InventoryRoom } from "../../hooks/use-building-inventory";

export interface InventoryTableProps {
  rooms: InventoryRoom[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems: number;
  startIndex: number;
  endIndex: number;
}

export function InventoryTable({ 
  rooms,
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  startIndex,
  endIndex
}: InventoryTableProps) {
  return (
    <div className="space-y-4">
      <div className="hidden md:block rounded-lg border border-zinc-800 overflow-hidden bg-background">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-800 bg-zinc-900/80 text-[10px] font-bold text-zinc-300 uppercase tracking-widest">
                <th className="px-6 py-4">Nama & Kode Ruang</th>
                <th className="px-6 py-4 text-center">Lantai</th>
                <th className="px-6 py-4">Status IoT</th>
                <th className="px-6 py-4">Kapasitas</th>
                <th className="px-6 py-4">Telemetri Real-time</th>
                <th className="px-6 py-4 text-right">Aksi Navigasi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50">
              {rooms.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-zinc-500 text-sm">
                    Tidak ada ruangan yang ditemukan dengan filter ini.
                  </td>
                </tr>
              ) : (
                rooms.map((room) => (
                  <tr key={room.id} className="hover:bg-zinc-800/20 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 border ${
                          room.status === "online" 
                          ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" 
                          : room.status === "offline"
                          ? "bg-rose-500/10 border-rose-500/20 text-rose-400"
                          : "bg-zinc-900 border-zinc-800 text-zinc-600"
                        }`}>
                          <DoorOpen className="w-4.5 h-4.5" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-zinc-200 leading-none mb-1">{room.name}</p>
                          <p className="text-[10px] font-mono text-zinc-500 uppercase">{room.code}</p>
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 text-center">
                      <div className="inline-flex items-center justify-center gap-1.5 px-2 py-1 rounded bg-zinc-950 border border-zinc-850 text-[11px] font-bold text-zinc-400">
                        <Layers className="w-3 h-3" />
                        {room.floor}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      {room.status === "online" ? (
                        <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          Online
                        </Badge>
                      ) : room.status === "offline" ? (
                        <Badge className="bg-rose-500/10 text-rose-400 border-rose-500/20 gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                          Offline
                        </Badge>
                      ) : (
                        <Badge className="bg-zinc-800 text-zinc-500 border-zinc-700 gap-1.5">
                          <ShieldAlert className="w-3 h-3" />
                          Passive
                        </Badge>
                      )}
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-xs text-zinc-400 font-medium">
                        <Users className="w-3.5 h-3.5 text-zinc-600" />
                        {room.capacity} Mhs
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      {room.telemetry ? (
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2 text-[11px] font-mono">
                            <Zap className={`w-3 h-3 ${room.telemetry.watt > 0 ? "text-emerald-500" : "text-zinc-700"}`} />
                            <span className={room.telemetry.watt > 0 ? "text-emerald-400 font-bold" : "text-zinc-600"}>
                              {room.telemetry.watt}W
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-[11px] font-mono">
                            <Users className={`w-3 h-3 ${room.telemetry.occupancy > 0 ? "text-emerald-500" : "text-zinc-700"}`} />
                            <span className={room.telemetry.occupancy > 0 ? "text-emerald-400 font-bold" : "text-zinc-600"}>
                              {room.telemetry.occupancy} Mhs
                            </span>
                          </div>
                        </div>
                      ) : (
                        <span className="text-[10px] text-zinc-700 font-mono italic">No Telemetry (Non-IoT)</span>
                      )}
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Link href={`/admin-gedung?room=${room.name}`}>
                          <Button variant="outline" size="sm" className="h-8 text-[10px] bg-zinc-950 border-zinc-850 hover:border-emerald-500/50 hover:text-emerald-400 gap-1.5">
                            <Activity className="w-3 h-3" />
                            Live Monitor
                          </Button>
                        </Link>
                        
                        {room.status !== "passive" && (
                          <Link href={`/admin-gedung/devices?room=${room.name}`}>
                            <Button variant="outline" size="sm" className="h-8 text-[10px] bg-zinc-950 border-zinc-850 hover:border-emerald-500/50 hover:text-emerald-400 gap-1.5">
                              <ExternalLink className="w-3 h-3" />
                              Control
                            </Button>
                          </Link>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden flex flex-col gap-3">
        {rooms.length === 0 ? (
          <div className="bg-zinc-900 border border-zinc-850 rounded-xl p-8 text-center text-zinc-500 text-sm shadow-sm">
            Tidak ada ruangan yang ditemukan dengan filter ini.
          </div>
        ) : (
          rooms.map((room) => (
            <div key={`mobile-${room.id}`} className="bg-zinc-900 border border-zinc-850 rounded-xl p-4 flex flex-col gap-3 shadow-sm relative overflow-hidden">
              {room.status === "online" && (
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-emerald-500/20 via-emerald-500 to-emerald-500/20" />
              )}
              
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 border shadow-inner ${
                  room.status === "online" 
                  ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" 
                  : room.status === "offline"
                  ? "bg-rose-500/10 border-rose-500/20 text-rose-400"
                  : "bg-zinc-950 border-zinc-800 text-zinc-600"
                }`}>
                  <DoorOpen className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-zinc-200 leading-none mb-1">{room.name}</p>
                  <p className="text-[10px] font-mono text-zinc-500 uppercase">{room.code}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 bg-zinc-950/80 rounded-lg border border-zinc-850 p-3 mt-1">
                <div className="flex flex-col gap-1">
                  <span className="text-zinc-600 font-mono uppercase text-[9px] font-bold">Lantai</span>
                  <div className="inline-flex items-center gap-1.5">
                    <Layers className="w-3 h-3 text-zinc-500" />
                    <span className="font-bold text-zinc-300 text-xs">{room.floor}</span>
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-zinc-600 font-mono uppercase text-[9px] font-bold">Kapasitas</span>
                  <div className="inline-flex items-center gap-1.5">
                    <Users className="w-3 h-3 text-zinc-500" />
                    <span className="font-bold text-zinc-300 text-xs">{room.capacity} Mhs</span>
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-zinc-600 font-mono uppercase text-[9px] font-bold">Status IoT</span>
                  <div>
                    {room.status === "online" ? (
                      <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 gap-1 px-1.5 py-0 h-4 text-[9px]">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Online
                      </Badge>
                    ) : room.status === "offline" ? (
                      <Badge className="bg-rose-500/10 text-rose-400 border-rose-500/20 gap-1 px-1.5 py-0 h-4 text-[9px]">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                        Offline
                      </Badge>
                    ) : (
                      <Badge className="bg-zinc-800 text-zinc-500 border-zinc-700 gap-1 px-1.5 py-0 h-4 text-[9px]">
                        <ShieldAlert className="w-2.5 h-2.5" />
                        Passive
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-zinc-600 font-mono uppercase text-[9px] font-bold">Telemetri</span>
                  {room.telemetry ? (
                    <div className="flex flex-wrap items-center gap-2 text-[10px] font-mono">
                      <span className={room.telemetry.watt > 0 ? "text-emerald-400 font-bold" : "text-zinc-500"}>{room.telemetry.watt}W</span>
                      <span className={room.telemetry.occupancy > 0 ? "text-emerald-400 font-bold" : "text-zinc-500"}>{room.telemetry.occupancy} Mhs</span>
                    </div>
                  ) : (
                    <span className="text-zinc-600 text-[10px] font-mono italic">Non-IoT</span>
                  )}
                </div>
              </div>
              
              <div className="flex gap-2 pt-2">
                <Link href={`/admin-gedung?room=${room.name}`} className="flex-1">
                  <Button variant="outline" size="sm" className="w-full h-8 text-[10px] bg-zinc-950 border-zinc-850 hover:border-emerald-500/50 hover:text-emerald-400 gap-1.5">
                    <Activity className="w-3 h-3" />
                    Live Monitor
                  </Button>
                </Link>
                {room.status !== "passive" && (
                  <Link href={`/admin-gedung/devices?room=${room.name}`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full h-8 text-[10px] bg-zinc-950 border-zinc-850 hover:border-emerald-500/50 hover:text-emerald-400 gap-1.5">
                      <ExternalLink className="w-3 h-3" />
                      Control
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination Controls - Synchronized with User Management Style */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-2 py-2">
          <p className="text-[10px] text-zinc-500 font-medium uppercase tracking-wider">
            Showing <span className="text-zinc-300">{startIndex + 1}</span> - <span className="text-zinc-300">{endIndex}</span> of <span className="text-zinc-300">{totalItems}</span> rooms
          </p>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
              disabled={currentPage === 1}
              className="bg-zinc-955 border-zinc-850 hover:bg-zinc-900 text-zinc-300 text-[10px] font-bold h-8 px-4 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-3.5 h-3.5 mr-1" />
              Previous
            </Button>
            
            <div className="flex items-center gap-1 text-[10px] text-zinc-400 font-mono px-2 uppercase tracking-tight">
              Page <span className="text-zinc-200 font-bold ml-1">{currentPage}</span> of{" "}
              <span className="text-zinc-200 font-bold">{totalPages}</span>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="bg-zinc-955 border-zinc-850 hover:bg-zinc-900 text-zinc-300 text-[10px] font-bold h-8 px-4 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
              <ChevronRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
