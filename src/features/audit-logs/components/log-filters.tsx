import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Search, Building, Calendar, Power, Filter, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { BUILDINGS_LIST } from "../hooks/use-system-logs"

interface LogFiltersProps {
  query: string
  onQueryChange: (query: string) => void
  filter: string
  onFilterChange: (filter: string) => void
  actionFilter: string
  onActionFilterChange: (filter: string) => void
  triggerFilter: string
  onTriggerFilterChange: (filter: string) => void
  userRole?: string
  buildingFilter?: string
  onBuildingFilterChange?: (filter: string) => void
  onResetFilters?: () => void
}

export function LogFilters({
  query,
  onQueryChange,
  filter,
  onFilterChange,
  actionFilter,
  onActionFilterChange,
  triggerFilter,
  onTriggerFilterChange,
  userRole = "ADMIN_GEDUNG",
  buildingFilter = "all",
  onBuildingFilterChange,
  onResetFilters,
}: LogFiltersProps) {
  const isSuperAdmin = userRole === "SUPER_ADMIN"

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full">
      {/* 1. Kolom Pencarian Kata Kunci */}
      <div className="relative flex-1 w-full sm:w-auto">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
        <Input
          placeholder="Search devices, actions, perform..."
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          className="pl-9 h-9 w-full bg-zinc-950 border-zinc-800 text-xs text-zinc-300 placeholder:text-zinc-500"
        />
      </div>

      <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2 w-full sm:w-auto">
        {/* 2. Dropdown Pemilihan Gedung Kondisional */}
        {isSuperAdmin && onBuildingFilterChange && (
          <Select value={buildingFilter} onValueChange={onBuildingFilterChange}>
            <SelectTrigger className="h-9 w-full sm:w-36 bg-zinc-950 border-zinc-800 text-xs text-zinc-300">
              <div className="flex items-center gap-1.5 overflow-hidden">
                <Building className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                <SelectValue placeholder="Pilih Gedung" className="truncate" />
              </div>
            </SelectTrigger>
            <SelectContent className="bg-zinc-900 border-zinc-800 text-xs text-zinc-300">
              {BUILDINGS_LIST.map((b) => (
                <SelectItem key={b.id} value={b.id}>
                  {b.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {/* 3. Saringan Waktu/Tanggal */}
        <Select value={filter} onValueChange={onFilterChange}>
          <SelectTrigger className="h-9 w-full sm:w-36 bg-zinc-950 border-zinc-800 text-xs text-zinc-300">
            <div className="flex items-center gap-1.5 overflow-hidden">
              <Calendar className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
              <SelectValue placeholder="All Time" className="truncate" />
            </div>
          </SelectTrigger>
          <SelectContent className="bg-zinc-900 border-zinc-800 text-xs text-zinc-300">
            <SelectItem value="all">All Time</SelectItem>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="yesterday">Yesterday</SelectItem>
            <SelectItem value="last7">Last 7 Days</SelectItem>
            <SelectItem value="last30">Last 30 Days</SelectItem>
          </SelectContent>
        </Select>

        {/* 4. Saringan Action */}
        <Select value={actionFilter} onValueChange={onActionFilterChange}>
          <SelectTrigger className="h-9 w-full sm:w-32 bg-zinc-950 border-zinc-800 text-xs text-zinc-300">
            <div className="flex items-center gap-1.5 overflow-hidden">
              <Power className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
              <SelectValue placeholder="All Actions" className="truncate" />
            </div>
          </SelectTrigger>
          <SelectContent className="bg-zinc-900 border-zinc-800 text-xs text-zinc-300">
            <SelectItem value="all">All Actions</SelectItem>
            <SelectItem value="on">Turned ON</SelectItem>
            <SelectItem value="off">Turned OFF</SelectItem>
          </SelectContent>
        </Select>

        {/* 5. Saringan Trigger */}
        <Select value={triggerFilter} onValueChange={onTriggerFilterChange}>
          <SelectTrigger className="h-9 w-full sm:w-36 bg-zinc-950 border-zinc-800 text-xs text-zinc-300">
            <div className="flex items-center gap-1.5 overflow-hidden">
              <Filter className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
              <SelectValue placeholder="All Triggers" className="truncate" />
            </div>
          </SelectTrigger>
          <SelectContent className="bg-zinc-900 border-zinc-800 text-xs text-zinc-300">
            <SelectItem value="all">All Triggers</SelectItem>
            <SelectItem value="manual">User / Manual</SelectItem>
            <SelectItem value="ai">AI / System</SelectItem>
          </SelectContent>
        </Select>

        {/* 6. Tombol Reset (Paling bawah di mobile, inline di desktop) */}
        {onResetFilters && (query !== "" || filter !== "all" || actionFilter !== "all" || triggerFilter !== "all" || (isSuperAdmin && buildingFilter !== "all")) && (
          <Button
            variant="outline"
            onClick={onResetFilters}
            className="h-9 w-full sm:w-9 px-0 sm:px-0 flex items-center justify-center shrink-0 bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-zinc-200 mt-2 sm:mt-0"
            title="Reset Filters"
          >
            <RotateCcw className="w-4 h-4 sm:mr-0 mr-2" />
            <span className="sm:hidden text-xs">Reset Filters</span>
          </Button>
        )}
      </div>
    </div>
  )
}
