"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Cpu, Trash2, Calendar, Search, Building, Eye, Pencil, Wifi } from "lucide-react"
import { RegisteredDevice } from "../../types/device-registration"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface RegisteredDevicesListProps {
  loading: boolean
  registeredList: RegisteredDevice[]
  onDelete: (mac: string) => void
  onView: (device: RegisteredDevice) => void
  onEdit: (device: RegisteredDevice) => void
  onManageWifi?: (device: RegisteredDevice) => void
}

export function RegisteredDevicesList({
  loading,
  registeredList,
  onDelete,
  onView,
  onEdit,
  onManageWifi,
}: RegisteredDevicesListProps) {
  // Local state for search, filter, and pagination
  const [searchQuery, setSearchQuery] = useState("")
  const [buildingFilter, setBuildingFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  if (loading) {
    return (
      <Card className="bg-zinc-900 border-zinc-800 animate-pulse">
        <CardHeader className="h-20" />
        <CardContent className="h-40" />
      </Card>
    )
  }

  // filter registered devices
  const filteredList = registeredList.filter((device) => {
    const matchesSearch =
      device.macAddress.toLowerCase().includes(searchQuery.toLowerCase()) ||
      device.roomName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      device.buildingName.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesBuilding =
      buildingFilter === "all" || device.buildingName === buildingFilter

    return matchesSearch && matchesBuilding
  })

  // dynamic list of unique buildings for the dropdown
  const uniqueBuildings = Array.from(new Set(registeredList.map((d) => d.buildingName)))

  // pagination calculations
  const totalItems = filteredList.length
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems)
  const paginatedList = filteredList.slice(startIndex, endIndex)

  const handleSearchQueryChange = (val: string) => {
    setSearchQuery(val)
    setCurrentPage(1)
  }

  const handleBuildingFilterChange = (val: string) => {
    setBuildingFilter(val)
    setCurrentPage(1)
  }

  return (
    <Card className="bg-zinc-900 border-zinc-800 overflow-hidden shadow-2xl">
      <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-4 border-b border-zinc-800 bg-zinc-900/40">
        <div>
          <CardTitle className="text-lg flex items-center gap-2 font-semibold text-zinc-200">
            <Cpu className="w-5 h-5 text-emerald-500" />
            <span>Inventaris Perangkat Aktif</span>
          </CardTitle>
          <CardDescription className="text-xs text-zinc-500 mt-0.5">
            Daftar seluruh perangkat IoT (ESP32) yang telah diikat ke kelas perkuliahan.
          </CardDescription>
        </div>

        {/* Search and Filters inside CardHeader */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Search bar (w-80 size matching standard) */}
          <div className="relative flex-1 md:flex-initial">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <Input
              placeholder="Search MAC or room..."
              value={searchQuery}
              onChange={(e) => handleSearchQueryChange(e.target.value)}
              className="pl-9 h-9 w-full md:w-64 bg-zinc-955 border-zinc-850 text-xs text-zinc-300 placeholder:text-zinc-500 focus-visible:border-emerald-500 focus-visible:ring-emerald-500"
            />
          </div>

          {/* Building Filter selector */}
          <Select value={buildingFilter} onValueChange={handleBuildingFilterChange}>
            <SelectTrigger className="h-9 w-40 bg-zinc-955 border-zinc-850 text-xs text-zinc-300 shrink-0 focus-visible:border-emerald-500 focus-visible:ring-emerald-500">
              <div className="flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                <SelectValue placeholder="All Buildings" />
              </div>
            </SelectTrigger>
            <SelectContent className="bg-zinc-900 border-zinc-800 text-xs text-zinc-300">
              <SelectItem value="all">All Buildings</SelectItem>
              {uniqueBuildings.map((building) => (
                <SelectItem key={building} value={building}>
                  {building}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent className="pt-0 px-0 pb-0 bg-background">
        {filteredList.length === 0 ? (
          <div className="py-12 flex flex-col items-center justify-center text-center px-4 bg-zinc-955/10">
            <Cpu className="w-12 h-12 text-zinc-600 mb-3" />
            <p className="text-zinc-400 font-medium">Belum Ada Perangkat Terdaftar</p>
            <p className="text-xs text-zinc-500 max-w-xs mt-1">
              Gunakan panel auto-discovery di atas untuk memetakan perangkat baru.
            </p>
          </div>
        ) : (
          <>
            <div className="rounded-lg border border-zinc-800 overflow-hidden bg-background">
              <Table>
                <TableHeader className="bg-zinc-900/80 border-b border-zinc-800">
                  <TableRow className="border-zinc-800 hover:bg-transparent">
                    <TableHead className="text-zinc-300 font-semibold h-11 px-6">MAC Address</TableHead>
                    <TableHead className="text-zinc-300 font-semibold h-11 px-6">Lokasi Gedung & Lantai</TableHead>
                    <TableHead className="text-zinc-300 font-semibold h-11 px-6">Nama Ruangan</TableHead>
                    <TableHead className="text-zinc-300 font-semibold h-11 px-6">Kapasitas</TableHead>
                    <TableHead className="text-zinc-300 font-semibold h-11 px-6 hidden md:table-cell">Tanggal Rilis</TableHead>
                    <TableHead className="text-zinc-300 font-semibold h-11 px-6 text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedList.map((device) => (
                    <TableRow
                      key={device.macAddress}
                      className="border-zinc-800 hover:bg-zinc-800/20 transition-colors group"
                    >
                      <td className="py-4 px-6 font-mono font-bold text-zinc-200 group-hover:text-emerald-400 transition-colors">
                        {device.macAddress}
                      </td>
                      <td className="py-4 px-6 text-zinc-350">
                        <div className="font-medium text-zinc-300">{device.buildingName}</div>
                        <div className="text-xs text-zinc-500 capitalize mt-0.5">{device.floorId.replace("_", " ")}</div>
                      </td>
                      <td className="py-4 px-6 text-emerald-400 font-semibold">
                        {device.roomName}
                      </td>
                      <td className="py-4 px-6 font-mono text-zinc-300">
                        {device.capacity} Siswa
                      </td>
                      <td className="py-4 px-6 text-zinc-500 hidden md:table-cell">
                        <div className="flex items-center gap-1.5 text-xs">
                          <Calendar className="w-3.5 h-3.5 text-zinc-650" />
                          <span>{new Date(device.createdAt * 1000).toLocaleDateString("id-ID")}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {/* View details */}
                          <button
                            onClick={() => onView(device)}
                            className="p-1.5 rounded-md bg-zinc-900 border border-zinc-800 hover:border-emerald-500/50 hover:bg-emerald-500/10 text-zinc-400 hover:text-emerald-400 opacity-80 group-hover:opacity-100 transition-all cursor-pointer"
                            title="View Telemetry Details"
                          >
                            <Eye className="w-3.5 h-3.5 shrink-0" />
                          </button>

                          {/* Edit Topography */}
                          <button
                            onClick={() => onEdit(device)}
                            className="p-1.5 rounded-md bg-zinc-900 border border-zinc-800 hover:border-blue-500/50 hover:bg-blue-500/10 text-zinc-400 hover:text-blue-400 opacity-80 group-hover:opacity-100 transition-all cursor-pointer"
                            title="Edit Topography mapping"
                          >
                            <Pencil className="w-3.5 h-3.5 shrink-0" />
                          </button>

                          {/* Manage WiFi */}
                          {onManageWifi && (
                            <button
                              onClick={() => onManageWifi(device)}
                              className="p-1.5 rounded-md bg-zinc-900 border border-zinc-800 hover:border-amber-500/50 hover:bg-amber-500/10 text-zinc-400 hover:text-amber-400 opacity-80 group-hover:opacity-100 transition-all cursor-pointer"
                              title="Manage WiFi Networks"
                            >
                              <Wifi className="w-3.5 h-3.5 shrink-0" />
                            </button>
                          )}

                          {/* Delete (Cabut) */}
                          <button
                            onClick={() => onDelete(device.macAddress)}
                            className="p-1.5 rounded-md bg-zinc-900 border border-zinc-800 hover:border-red-500/50 hover:bg-red-500/10 text-zinc-400 hover:text-red-400 opacity-80 group-hover:opacity-100 transition-all cursor-pointer"
                            title="Remove registration"
                          >
                            <Trash2 className="w-3.5 h-3.5 shrink-0" />
                          </button>
                        </div>
                      </td>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Pagination Controls Footer inside CardContent */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-zinc-900/60 p-4 border-t border-zinc-800">
              <span className="text-xs text-zinc-500 font-mono">
                Showing <span className="font-semibold text-zinc-300">{startIndex + 1}</span> to{" "}
                <span className="font-semibold text-zinc-300">{endIndex}</span> of{" "}
                <span className="font-semibold text-zinc-300">{totalItems}</span> entries
              </span>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="bg-zinc-955 border-zinc-850 hover:bg-zinc-900 text-zinc-300 text-xs h-8 px-4 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </Button>
                
                <div className="flex items-center gap-1 text-xs text-zinc-400 font-mono px-2">
                  Page <span className="text-zinc-200 font-bold ml-1">{currentPage}</span> of{" "}
                  <span className="text-zinc-200 font-bold">{totalPages}</span>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="bg-zinc-955 border-zinc-850 hover:bg-zinc-900 text-zinc-300 text-xs h-8 px-4 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </Button>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
