"use client";

import { DoorOpen, Layers, Users, Zap, ExternalLink, ShieldAlert, Activity } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { InventoryRoom } from "../../hooks/use-building-inventory";

interface InventoryTableProps {
  rooms: InventoryRoom[];
}

export function InventoryTable({ rooms }: InventoryTableProps) {
  return (
    <div className="bg-zinc-900 border border-zinc-850 rounded-xl overflow-hidden shadow-2xl">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-zinc-850 bg-zinc-955/30 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
              <th className="px-6 py-4">Nama & Kode Ruang</th>
              <th className="px-6 py-4 text-center">Lantai</th>
              <th className="px-6 py-4">Status IoT</th>
              <th className="px-6 py-4">Kapasitas</th>
              <th className="px-6 py-4">Telemetri Real-time</th>
              <th className="px-6 py-4 text-right">Aksi Navigasi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-850/50">
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
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 border ${room.status === "online"
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
  );
}
