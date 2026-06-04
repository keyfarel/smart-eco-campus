"use client"

import { DoorOpen, Pencil, Trash2, Building2, Layers, Users, Eye } from "lucide-react"
import { Room } from "@/features/building-management/types/building"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface RoomListTableProps {
  loading: boolean
  rooms: (Room & { buildingName: string; buildingId: string })[]
  onViewRoom: (room: Room) => void
  onEditRoom: (room: Room, buildingId: string) => void
  onDeleteRoom: (roomId: string, buildingId: string) => void
}

export function RoomListTable({
  loading,
  rooms,
  onViewRoom,
  onEditRoom,
  onDeleteRoom,
}: RoomListTableProps) {
  if (loading) {
    return (
      <div className="w-full p-6 space-y-4 animate-pulse">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-12 bg-zinc-800/30 rounded" />
        ))}
      </div>
    )
  }

  if (rooms.length === 0) {
    return (
      <div className="w-full py-20 flex flex-col items-center justify-center text-center">
        <div className="w-14 h-14 rounded-full bg-zinc-800/50 flex items-center justify-center mb-4">
          <DoorOpen className="w-7 h-7 text-zinc-600" />
        </div>
        <p className="text-zinc-400 font-bold">Direktori Ruangan Kosong</p>
        <p className="text-xs text-zinc-500 max-w-sm mt-1.5 px-4 leading-relaxed">
          Belum ada ruangan fisik yang terdaftar di gedung manapun. Silakan tambahkan ruangan melalui tab Buildings.
        </p>
      </div>
    )
  }

  return (
    <div className="w-full overflow-hidden">
      <Table>
        <TableHeader className="bg-zinc-900/80 border-b border-zinc-800">
          <TableRow className="border-zinc-800 hover:bg-transparent">
            <TableHead className="text-zinc-300 font-semibold h-11 px-6">Room Name</TableHead>
            <TableHead className="text-zinc-300 font-semibold h-11 px-4 text-center">Code</TableHead>
            <TableHead className="text-zinc-300 font-semibold h-11 px-6">Parent Building</TableHead>
            <TableHead className="text-zinc-300 font-semibold h-11 px-4 text-center">Floor</TableHead>
            <TableHead className="text-zinc-300 font-semibold h-11 px-4 text-center">Capacity</TableHead>
            <TableHead className="text-zinc-300 font-semibold h-11 px-6 text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rooms.map((room) => (
            <TableRow
              key={`${room.buildingId}-${room.id}`}
              className="border-zinc-800 hover:bg-zinc-800/20 transition-colors group"
            >
              <TableCell className="py-4 px-6">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-blue-500/10 border border-blue-500/25 flex items-center justify-center text-blue-400 shrink-0 group-hover:bg-blue-500/20 transition-colors">
                    <DoorOpen className="w-4.5 h-4.5" />
                  </div>
                  <span className="text-sm font-bold text-zinc-150 group-hover:text-foreground transition-colors">
                    {room.name}
                  </span>
                </div>
              </TableCell>

              <TableCell className="py-4 px-4 text-center">
                <span className="inline-flex items-center px-2 py-0.5 rounded bg-zinc-955 border border-zinc-855 text-[10px] font-mono font-bold text-emerald-400 tracking-tighter uppercase">
                  {room.code}
                </span>
              </TableCell>

              <TableCell className="py-4 px-6">
                <div className="flex items-center gap-2">
                  <Building2 className="w-3.5 h-3.5 text-zinc-500" />
                  <span className="text-xs text-zinc-400 font-medium truncate max-w-[150px]">
                    {room.buildingName}
                  </span>
                </div>
              </TableCell>

              <TableCell className="py-4 px-4 text-center">
                <div className="inline-flex items-center justify-center gap-1.5 text-xs font-mono font-bold text-zinc-300">
                  <Layers className="w-3.5 h-3.5 text-zinc-500" />
                  <span>{room.floor}</span>
                </div>
              </TableCell>

              <TableCell className="py-4 px-4 text-center">
                <div className="inline-flex items-center justify-center gap-1.5 text-xs font-mono font-bold text-zinc-300">
                  <Users className="w-3.5 h-3.5 text-zinc-500" />
                  <span>{room.capacity}</span>
                </div>
              </TableCell>

              <TableCell className="py-4 px-6 text-right">
                <div className="flex items-center justify-end gap-2">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => onViewRoom(room)}
                    className="w-8 h-8 rounded-lg text-zinc-400 hover:text-emerald-400 hover:bg-emerald-500/10 border border-transparent hover:border-emerald-500/20 transition-all duration-150 cursor-pointer"
                    title="Lihat Spesifikasi"
                  >
                    <Eye className="w-4 h-4" />
                  </Button>

                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => onEditRoom(room, room.buildingId)}
                    className="w-8 h-8 rounded-lg text-zinc-400 hover:text-blue-400 hover:bg-blue-500/10 border border-transparent hover:border-blue-500/20 transition-all duration-150 cursor-pointer"
                    title="Edit Ruangan"
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>

                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => onDeleteRoom(room.id, room.buildingId)}
                    className="w-8 h-8 rounded-lg text-zinc-400 hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all duration-150 cursor-pointer"
                    title="Hapus Ruangan"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

