"use client"

import { Building2, Eye, Pencil, Trash2, Layers, DoorOpen } from "lucide-react"
import { Building } from "@/features/building-management/types/building"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface BuildingListTableProps {
  loading: boolean
  buildingsList: Building[]
  onViewBuilding: (building: Building) => void
  onEditBuilding: (building: Building) => void
  onDeleteBuilding: (id: string) => void
}

export function BuildingListTable({
  loading,
  buildingsList,
  onViewBuilding,
  onEditBuilding,
  onDeleteBuilding,
}: BuildingListTableProps) {
  if (loading) {
    return (
      <div className="w-full p-6 space-y-4 animate-pulse">
        <div className="h-8 bg-zinc-800/50 rounded w-1/4" />
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-12 bg-zinc-800/30 rounded" />
          ))}
        </div>
      </div>
    )
  }

  if (buildingsList.length === 0) {
    return (
      <div className="w-full py-14 flex flex-col items-center justify-center text-center">
        <div className="w-12 h-12 rounded-full bg-zinc-800/50 flex items-center justify-center mb-3">
          <Building2 className="w-6 h-6 text-zinc-550" />
        </div>
        <p className="text-zinc-400 font-bold">Belum Ada Gedung Terdaftar</p>
        <p className="text-xs text-zinc-500 max-w-sm mt-1.5 px-4">
          Data topologi fisik gedung masih kosong. Gunakan tombol di atas untuk mendaftarkan gedung kampus baru.
        </p>
      </div>
    )
  }

  return (
    <div className="w-full overflow-hidden">
      <Table>
        <TableHeader className="bg-zinc-900/80 border-b border-zinc-800">
          <TableRow className="border-zinc-800 hover:bg-transparent">
            <TableHead className="text-zinc-300 font-semibold h-11 px-6">Building</TableHead>
            <TableHead className="text-zinc-300 font-semibold h-11 px-4 text-center">Floors</TableHead>
            <TableHead className="text-zinc-300 font-semibold h-11 px-4 text-center">Rooms</TableHead>
            <TableHead className="text-zinc-300 font-semibold h-11 px-4 text-center">Connected IoT</TableHead>
            <TableHead className="text-zinc-300 font-semibold h-11 px-6 text-center">Created Date</TableHead>
            <TableHead className="text-zinc-300 font-semibold h-11 px-6 text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {buildingsList.map((building) => {
            const roomsCount = building.roomsCount || building.floorsCount * 4
            const hasDevices = building.activeDevicesCount > 0

            return (
              <TableRow
                key={building.id}
                className="border-zinc-800 hover:bg-zinc-800/20 transition-colors group"
              >
                {/* Column 1: Building name & ID */}
                <TableCell className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-500 shrink-0 group-hover:bg-emerald-500/20 transition-colors">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-sm font-bold text-zinc-150 truncate group-hover:text-foreground transition-colors">
                        {building.name}
                      </span>
                      <span className="text-[10px] text-zinc-550 font-mono tracking-wider mt-0.5 uppercase">
                        {building.code ? `KODE: ${building.code} • ID: ${building.id}` : `ID: ${building.id}`}
                      </span>
                    </div>
                  </div>
                </TableCell>

                {/* Column 2: Floors */}
                <TableCell className="py-4 px-4 text-center">
                  <div className="inline-flex items-center justify-center gap-1.5 px-2.5 py-1 rounded bg-zinc-950 border border-zinc-850 text-xs font-mono font-bold text-zinc-300">
                    <Layers className="w-3.5 h-3.5 text-zinc-500" />
                    <span>{building.floorsCount}</span>
                  </div>
                </TableCell>

                {/* Column 3: Rooms */}
                <TableCell className="py-4 px-4 text-center">
                  <div className="inline-flex items-center justify-center gap-1.5 px-2.5 py-1 rounded bg-zinc-950 border border-zinc-850 text-xs font-mono font-bold text-zinc-300">
                    <DoorOpen className="w-3.5 h-3.5 text-zinc-500" />
                    <span>{roomsCount}</span>
                  </div>
                </TableCell>

                {/* Column 4: Connected IoT Devices */}
                <TableCell className="py-4 px-4 text-center">
                  <div className="inline-flex items-center justify-center gap-1.5">
                    <span className={`w-1.5 h-1.5 rounded-full ${hasDevices ? "bg-emerald-500 animate-pulse" : "bg-zinc-600"}`} />
                    <span className={`text-xs font-mono font-bold ${hasDevices ? "text-emerald-400" : "text-zinc-500"}`}>
                      {building.activeDevicesCount} Devices
                    </span>
                  </div>
                </TableCell>

                {/* Column 5: Created Date */}
                <TableCell className="py-4 px-6 text-center">
                  <span className="text-xs text-zinc-400 font-mono">
                    {new Date(building.createdAt * 1000).toLocaleDateString("id-ID", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </TableCell>

                {/* Column 6: Actions */}
                <TableCell className="py-4 px-6 text-right">
                  <div className="flex items-center justify-end gap-2">
                    {/* View */}
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => onViewBuilding(building)}
                      className="w-8 h-8 rounded-lg text-zinc-400 hover:text-emerald-400 hover:bg-emerald-500/10 border border-transparent hover:border-emerald-500/20 transition-all duration-150 cursor-pointer"
                      title="Lihat Spesifikasi"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>

                    {/* Edit */}
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => onEditBuilding(building)}
                      className="w-8 h-8 rounded-lg text-zinc-400 hover:text-blue-400 hover:bg-blue-500/10 border border-transparent hover:border-blue-500/20 transition-all duration-150 cursor-pointer"
                      title="Edit Gedung"
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>

                    {/* Delete */}
                    {building.id === "gedung_a" || building.id === "gedung_b" ? (
                      <Button
                        size="icon"
                        variant="ghost"
                        disabled
                        className="w-8 h-8 rounded-lg text-zinc-600 border border-transparent opacity-50 cursor-not-allowed"
                        title="Gedung sistem tidak boleh dihapus"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    ) : (
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => onDeleteBuilding(building.id)}
                        className="w-8 h-8 rounded-lg text-zinc-400 hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all duration-150 cursor-pointer"
                        title="Hapus Gedung"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}

