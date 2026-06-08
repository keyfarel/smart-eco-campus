import { Search, Filter, Activity, RotateCcw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface InventoryFiltersProps {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  floorFilter: string;
  setFloorFilter: (val: string) => void;
  statusFilter: string;
  setStatusFilter: (val: string) => void;
  floors: string[];
}

export function InventoryFilters({
  searchQuery,
  setSearchQuery,
  floorFilter,
  setFloorFilter,
  statusFilter,
  setStatusFilter,
  floors,
}: InventoryFiltersProps) {
  const hasActiveFilters = searchQuery !== "" || floorFilter !== "all" || statusFilter !== "all";

  const handleResetFilters = () => {
    setSearchQuery("");
    setFloorFilter("all");
    setStatusFilter("all");
  };

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full">
      {/* Search Bar */}
      <div className="relative flex-1 w-full sm:w-auto">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
        <Input
          placeholder="Cari nama atau kode ruang..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9 h-9 w-full bg-zinc-950 border-zinc-800 text-xs text-zinc-300 placeholder:text-zinc-500"
        />
      </div>

      {/* Selectors and Reset Button */}
      <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2 w-full sm:w-auto">
        <Select value={floorFilter} onValueChange={setFloorFilter}>
          <SelectTrigger className="h-9 w-full sm:w-36 bg-zinc-950 border-zinc-800 text-xs text-zinc-300">
            <div className="flex items-center gap-1.5 overflow-hidden">
              <Filter className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
              <SelectValue placeholder="Lantai" className="truncate" />
            </div>
          </SelectTrigger>
          <SelectContent className="bg-zinc-900 border-zinc-800 text-xs text-zinc-300">
            <SelectItem value="all">Semua Lantai</SelectItem>
            {floors.map((floor) => (
              <SelectItem key={floor} value={floor}>{floor}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="h-9 w-full sm:w-36 bg-zinc-950 border-zinc-800 text-xs text-zinc-300">
            <div className="flex items-center gap-1.5 overflow-hidden">
              <Activity className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
              <SelectValue placeholder="Status" className="truncate" />
            </div>
          </SelectTrigger>
          <SelectContent className="bg-zinc-900 border-zinc-800 text-xs text-zinc-300">
            <SelectItem value="all">Semua Status</SelectItem>
            <SelectItem value="online">Online</SelectItem>
            <SelectItem value="offline">Offline</SelectItem>
            <SelectItem value="passive">Passive</SelectItem>
          </SelectContent>
        </Select>

        {hasActiveFilters && (
          <Button 
            variant="outline" 
            onClick={handleResetFilters}
            className="h-9 w-full sm:w-9 px-0 sm:px-0 flex items-center justify-center shrink-0 bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-zinc-200 mt-2 sm:mt-0 transition-colors"
            title="Reset Filters"
          >
            <RotateCcw className="w-4 h-4 sm:mr-0 mr-2" />
            <span className="sm:hidden text-xs">Reset Filters</span>
          </Button>
        )}
      </div>
    </div>
  );
}
