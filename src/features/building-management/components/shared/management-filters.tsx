"use client";

import { Search, Layers, Building2, Activity } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Building } from "@/features/building-management/types/building";

interface ManagementFiltersProps {
  viewType: "buildings" | "rooms";
  searchQuery: string;
  onSearchChange: (value: string) => void;
  // Building filters
  floorFilter?: string;
  onFloorFilterChange?: (value: string) => void;
  buildingStatusFilter?: string;
  onBuildingStatusFilterChange?: (value: string) => void;
  // Room filters
  roomBuildingFilter?: string;
  onRoomBuildingFilterChange?: (value: string) => void;
  roomFloorFilter?: string;
  onRoomFloorFilterChange?: (value: string) => void;
  buildingsList?: Building[];
}

export function ManagementFilters({
  viewType,
  searchQuery,
  onSearchChange,
  floorFilter,
  onFloorFilterChange,
  buildingStatusFilter,
  onBuildingStatusFilterChange,
  roomBuildingFilter,
  onRoomBuildingFilterChange,
  roomFloorFilter,
  onRoomFloorFilterChange,
  buildingsList,
}: ManagementFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full">
      {/* Global Search */}
      <div className="relative flex-1 w-full sm:w-auto">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
        <Input
          placeholder={viewType === "buildings" ? "Search building name or ID..." : "Search room name, code or building..."}
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9 h-9 w-full bg-zinc-950 border-zinc-800 text-xs text-zinc-300 placeholder:text-zinc-500"
        />
      </div>

      <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2 w-full sm:w-auto">
        {viewType === "buildings" ? (
          <>
            {/* Building: Floor Filter */}
            <Select value={floorFilter} onValueChange={onFloorFilterChange}>
              <SelectTrigger className="h-9 w-full sm:w-36 bg-zinc-950 border-zinc-800 text-xs text-zinc-300 shrink-0">
                <div className="flex items-center gap-1.5 overflow-hidden">
                  <Layers className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                  <SelectValue placeholder="All Floors" className="truncate" />
                </div>
              </SelectTrigger>
              <SelectContent className="bg-zinc-900 border-zinc-800 text-xs text-zinc-300">
                <SelectItem value="all">All Floors</SelectItem>
                <SelectItem value="1-2">1 - 2 Floors</SelectItem>
                <SelectItem value="3-4">3 - 4 Floors</SelectItem>
                <SelectItem value="5+">5+ Floors</SelectItem>
              </SelectContent>
            </Select>

            {/* Building: Status Filter */}
            <Select value={buildingStatusFilter} onValueChange={onBuildingStatusFilterChange}>
              <SelectTrigger className="h-9 w-full sm:w-36 bg-zinc-950 border-zinc-800 text-xs text-zinc-300 shrink-0">
                <div className="flex items-center gap-1.5 overflow-hidden">
                  <Activity className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                  <SelectValue placeholder="All Status" className="truncate" />
                </div>
              </SelectTrigger>
              <SelectContent className="bg-zinc-900 border-zinc-800 text-xs text-zinc-300">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="online">Online (IoT Connected)</SelectItem>
                <SelectItem value="offline">Offline (No Devices)</SelectItem>
              </SelectContent>
            </Select>
          </>
        ) : (
          <>
            {/* Room: Parent Building Filter */}
            <Select value={roomBuildingFilter} onValueChange={onRoomBuildingFilterChange}>
              <SelectTrigger className="h-9 w-full sm:w-44 bg-zinc-950 border-zinc-800 text-xs text-zinc-300 shrink-0">
                <div className="flex items-center gap-1.5 overflow-hidden">
                  <Building2 className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                  <SelectValue placeholder="All Buildings" className="truncate" />
                </div>
              </SelectTrigger>
              <SelectContent className="bg-zinc-900 border-zinc-800 text-xs text-zinc-300 max-h-[300px]">
                <SelectItem value="all">All Buildings</SelectItem>
                {buildingsList?.map((b) => (
                  <SelectItem key={b.id} value={b.id}>
                    {b.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Room: Specific Floor Filter */}
            <Select value={roomFloorFilter} onValueChange={onRoomFloorFilterChange}>
              <SelectTrigger className="h-9 w-full sm:w-32 bg-zinc-950 border-zinc-800 text-xs text-zinc-300 shrink-0">
                <div className="flex items-center gap-1.5 overflow-hidden">
                  <Layers className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                  <SelectValue placeholder="Any Floor" className="truncate" />
                </div>
              </SelectTrigger>
              <SelectContent className="bg-zinc-900 border-zinc-800 text-xs text-zinc-300">
                <SelectItem value="all">Any Floor</SelectItem>
                {[1, 2, 3, 4, 5, 6, 7, 8].map((f) => (
                  <SelectItem key={f} value={f.toString()}>
                    Floor {f}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </>
        )}
      </div>
    </div>
  );
}

