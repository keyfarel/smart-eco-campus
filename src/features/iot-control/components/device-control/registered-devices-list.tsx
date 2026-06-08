"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Cpu, Trash2, Calendar, Search, Building, Layers, Eye, Pencil, Wifi, RotateCcw } from "lucide-react"
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
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

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
  const [floorFilter, setFloorFilter] = useState("all")
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

    const matchesFloor = 
      floorFilter === "all" || device.floorId === floorFilter

    return matchesSearch && matchesBuilding && matchesFloor
  })

  // dynamic list of unique buildings & floors
  const uniqueBuildings = Array.from(new Set(registeredList.map((d) => d.buildingName))).sort()
  const uniqueFloors = Array.from(new Set(registeredList.map((d) => d.floorId))).sort()

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
    <Card className="bg-background border-zinc-800 shadow-sm">
      <CardHeader className="flex flex-col sm:flex-row gap-4 justify-between pb-4">
        {/* Search and Filters inside CardHeader */}
        <div className="flex flex-col sm:flex-row w-full gap-3">
          {/* Search bar */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500" />
            <Input
              placeholder="Search MAC or room..."
              value={searchQuery}
              onChange={(e) => handleSearchQueryChange(e.target.value)}
              className="pl-9 h-9 w-full bg-zinc-900/50 border-zinc-800 text-xs focus-visible:ring-1 focus-visible:ring-emerald-500/50"
            />
          </div>

          {/* Filters and Reset */}
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto sm:justify-end">
            {/* Building Filter selector */}
            {uniqueBuildings.length > 1 && (
              <Select value={buildingFilter} onValueChange={handleBuildingFilterChange}>
                <SelectTrigger className="h-9 w-full sm:w-[150px] bg-zinc-900/50 border-zinc-800 text-xs focus-visible:ring-0">
                  <div className="flex items-center gap-1.5 overflow-hidden">
                    <Building className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                    <SelectValue placeholder="All Buildings" className="truncate" />
                  </div>
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border-zinc-800 text-xs">
                  <SelectItem value="all">All Buildings</SelectItem>
                  {uniqueBuildings.map((building) => (
                    <SelectItem key={building} value={building}>
                      {building}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            {/* Floor Filter selector */}
            {uniqueFloors.length > 0 && (
              <Select value={floorFilter} onValueChange={(val) => { setFloorFilter(val); setCurrentPage(1); }}>
                <SelectTrigger className="h-9 w-full sm:w-[130px] bg-zinc-900/50 border-zinc-800 text-xs focus-visible:ring-0">
                  <div className="flex items-center gap-1.5 overflow-hidden">
                    <Layers className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                    <SelectValue placeholder="Semua Lantai" className="truncate" />
                  </div>
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border-zinc-800 text-xs">
                  <SelectItem value="all">Semua Lantai</SelectItem>
                  {uniqueFloors.map((floor) => (
                    <SelectItem key={floor} value={floor}>
                      {floor.replace("_", " ").replace(/\b\w/g, l => l.toUpperCase())}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            {/* Reset Filter Button */}
            {(searchQuery !== "" || buildingFilter !== "all" || floorFilter !== "all") && (
              <Button
                variant="ghost"
                onClick={() => {
                  setSearchQuery("");
                  setBuildingFilter("all");
                  setFloorFilter("all");
                  setCurrentPage(1);
                }}
                className="h-9 w-full sm:w-9 p-0 flex justify-center text-zinc-400 hover:text-red-400 hover:bg-red-500/10"
                title="Reset Filters"
              >
                <RotateCcw className="w-3.5 h-3.5 mr-2 sm:mr-0" />
                <span className="sm:hidden text-xs">Reset Filters</span>
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent>
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
            <div className="hidden md:block rounded-lg border border-zinc-800 overflow-hidden bg-background">
              <Table>
                <TableHeader className="bg-zinc-900/80 border-b border-zinc-800">
                  <TableRow className="border-zinc-800 hover:bg-transparent">
                    <TableHead className="text-zinc-300 font-semibold pl-6">MAC Address</TableHead>
                    <TableHead className="text-zinc-300 font-semibold">Lokasi Gedung & Lantai</TableHead>
                    <TableHead className="text-zinc-300 font-semibold">Nama Ruangan</TableHead>
                    <TableHead className="text-zinc-300 font-semibold">Kapasitas</TableHead>
                    <TableHead className="text-zinc-300 font-semibold hidden md:table-cell">Tanggal Rilis</TableHead>
                    <TableHead className="text-zinc-300 font-semibold pr-6 text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedList.map((device) => (
                    <TableRow
                      key={device.macAddress}
                      className="border-zinc-800 hover:bg-zinc-800/20 transition-colors group"
                    >
                      <TableCell className="pl-6 font-mono font-bold text-zinc-200 group-hover:text-emerald-400 transition-colors">
                        {device.macAddress}
                      </TableCell>
                      <TableCell className="text-zinc-350">
                        <div className="font-medium text-zinc-300">{device.buildingName}</div>
                        <div className="text-xs text-zinc-500 capitalize mt-0.5">{device.floorId.replace("_", " ")}</div>
                      </TableCell>
                      <TableCell className="text-emerald-400 font-semibold">
                        {device.roomName}
                      </TableCell>
                      <TableCell className="font-mono text-zinc-300">
                        {device.capacity} Siswa
                      </TableCell>
                      <TableCell className="text-zinc-500 hidden md:table-cell">
                        <div className="flex items-center gap-1.5 text-xs">
                          <Calendar className="w-3.5 h-3.5 text-zinc-650" />
                          <span>{new Date(device.createdAt * 1000).toLocaleDateString("id-ID")}</span>
                        </div>
                      </TableCell>
                      <TableCell className="pr-6 text-right">
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
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Mobile Card Layout */}
            <div className="flex flex-col gap-3 md:hidden">
               {paginatedList.map(device => (
                  <div key={`mobile-${device.macAddress}`} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex flex-col gap-3 shadow-sm relative overflow-hidden">
                      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-emerald-500/20 via-emerald-500 to-emerald-500/20" />
                      <div className="flex items-center gap-3">
                         <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                           <Cpu className="w-5 h-5" />
                         </div>
                         <div>
                           <p className="text-sm font-bold text-zinc-200 leading-none mb-1 font-mono">{device.macAddress}</p>
                           <p className="text-[10px] font-mono text-zinc-500 flex items-center gap-1.5"><Calendar className="w-3 h-3"/> {new Date(device.createdAt * 1000).toLocaleDateString("id-ID")}</p>
                         </div>
                      </div>

                      <div className="flex flex-col gap-3 bg-zinc-950/80 rounded-lg border border-zinc-850 p-3 mt-1">
                        <div className="flex flex-col gap-1">
                          <span className="text-zinc-600 font-mono uppercase text-[9px] font-bold">Lokasi</span>
                          <span className="font-bold text-zinc-300 text-xs capitalize">{device.buildingName} - {device.floorId.replace("_", " ")}</span>
                        </div>
                        <div className="flex flex-col gap-1">
                          <span className="text-zinc-600 font-mono uppercase text-[9px] font-bold">Ruangan</span>
                          <span className="font-bold text-emerald-400 text-xs">{device.roomName}</span>
                        </div>
                        <div className="flex flex-col gap-1">
                          <span className="text-zinc-600 font-mono uppercase text-[9px] font-bold">Kapasitas</span>
                          <span className="font-bold text-zinc-300 text-xs">{device.capacity} Siswa</span>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-2 pt-2 border-t border-zinc-800/60 mt-1">
                        <Button onClick={() => onView(device)} variant="outline" size="sm" className="flex-1 h-8 text-[10px] bg-zinc-950 border-zinc-850 hover:border-emerald-500/50 hover:text-emerald-400"><Eye className="w-3 h-3 mr-1" /> View</Button>
                        <Button onClick={() => onEdit(device)} variant="outline" size="sm" className="flex-1 h-8 text-[10px] bg-zinc-950 border-zinc-850 hover:border-blue-500/50 hover:text-blue-400"><Pencil className="w-3 h-3 mr-1" /> Edit</Button>
                        {onManageWifi && <Button onClick={() => onManageWifi(device)} variant="outline" size="sm" className="flex-1 h-8 text-[10px] bg-zinc-950 border-zinc-850 hover:border-amber-500/50 hover:text-amber-400"><Wifi className="w-3 h-3 mr-1" /> WiFi</Button>}
                        <Button onClick={() => onDelete(device.macAddress)} variant="outline" size="sm" className="flex-1 h-8 text-[10px] bg-zinc-950 border-zinc-850 text-red-400 hover:bg-red-500/10 hover:border-red-500/50 hover:text-red-400"><Trash2 className="w-3 h-3 mr-1" /> Cabut</Button>
                      </div>
                  </div>
               ))}
            </div>

            {/* Pagination Controls Footer inside CardContent */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 p-4 pt-0">
              <p className="text-sm text-zinc-500 font-mono">
                Showing {paginatedList.length} of {totalItems} entries
              </p>

              <Pagination className="mx-0 w-auto">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
                      className={`cursor-pointer h-7 px-2 sm:h-9 sm:px-3 text-[10px] sm:text-sm ${currentPage === 1 ? "pointer-events-none opacity-50" : "bg-zinc-900 border border-zinc-800 hover:bg-zinc-800"}`}
                    />
                  </PaginationItem>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                    // Simple pagination logic, assuming total pages are small for registered list.
                    // If it exceeds 5 pages, we could use Ellipsis, but keeping it simple for now or using the exact logic from logs.
                    if (totalPages > 5 && page > 2 && page < totalPages - 1 && page !== currentPage) {
                      if (page === 3) return <PaginationItem key={page}><PaginationEllipsis className="text-zinc-500 w-6 sm:w-9" /></PaginationItem>
                      return null;
                    }
                    return (
                      <PaginationItem key={page}>
                        <PaginationLink
                          isActive={page === currentPage}
                          onClick={() => setCurrentPage(page)}
                          className={`cursor-pointer w-7 h-7 sm:w-9 sm:h-9 text-[10px] sm:text-sm ${page === currentPage ? "bg-zinc-800 text-zinc-200 border border-zinc-700" : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-300 border border-transparent"}`}
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  })}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}
                      className={`cursor-pointer h-7 px-2 sm:h-9 sm:px-3 text-[10px] sm:text-sm ${currentPage === totalPages || totalPages === 0 ? "pointer-events-none opacity-50" : "bg-zinc-900 border border-zinc-800 hover:bg-zinc-800"}`}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
