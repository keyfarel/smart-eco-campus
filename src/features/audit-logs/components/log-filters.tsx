import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Search, Building, Calendar } from "lucide-react"
import { BUILDINGS_LIST } from "../hooks/use-system-logs"

interface LogFiltersProps {
  query: string
  onQueryChange: (query: string) => void
  filter: string
  onFilterChange: (filter: string) => void
  userRole?: string
  buildingFilter?: string
  onBuildingFilterChange?: (filter: string) => void
}

export function LogFilters({
  query,
  onQueryChange,
  filter,
  onFilterChange,
  userRole = "ADMIN_GEDUNG",
  buildingFilter = "all",
  onBuildingFilterChange,
}: LogFiltersProps) {
  const isSuperAdmin = userRole === "SUPER_ADMIN"

  return (
    <div className="flex items-center gap-3 w-full md:w-auto">
      {/* 1. Kolom Pencarian Kata Kunci (Diposisikan paling kiri dengan ukuran lebar w-80) */}
      <div className="relative flex-1 md:flex-initial">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
        <Input
          placeholder="Search devices, actions, perform..."
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          className="pl-9 h-9 w-full md:w-80 bg-zinc-950 border-zinc-800 text-xs text-zinc-300 placeholder:text-zinc-500"
        />
      </div>

      {/* 2. Dropdown Pemilihan Gedung Kondisional (Diposisikan di tengah untuk Super Admin) */}
      {isSuperAdmin && onBuildingFilterChange && (
        <Select value={buildingFilter} onValueChange={onBuildingFilterChange}>
          <SelectTrigger className="h-9 w-44 bg-zinc-950 border-zinc-800 text-xs text-zinc-300 shrink-0">
            <div className="flex items-center gap-1.5">
              <Building className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
              <SelectValue placeholder="Pilih Gedung" />
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

      {/* 3. Saringan Waktu/Tanggal (Diposisikan paling kanan dengan Ikon Kalender) */}
      <Select value={filter} onValueChange={onFilterChange}>
        <SelectTrigger className="h-9 w-40 bg-zinc-950 border-zinc-800 text-xs text-zinc-300 shrink-0">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
            <SelectValue placeholder="All Time" />
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
    </div>
  )
}
