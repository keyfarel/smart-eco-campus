"use client";

import { Building2, Search, Filter, Activity } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface InventoryHeaderProps {
  buildingName: string;
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  floorFilter: string;
  setFloorFilter: (val: string) => void;
  statusFilter: string;
  setStatusFilter: (val: string) => void;
  floors: string[];
}

export function InventoryHeader({
  buildingName,
  searchQuery,
  setSearchQuery,
  floorFilter,
  setFloorFilter,
  statusFilter,
  setStatusFilter,
  floors,
}: InventoryHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-850 pb-6">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.1)]">
          <Building2 className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Daftar Ruangan</h1>
          <p className="text-sm text-muted-foreground">
            Inventaris operasional dan status IoT untuk <span className="text-emerald-500 font-medium">{buildingName}</span>
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <Input
            placeholder="Cari nama atau kode ruang..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-10 bg-zinc-900 border-zinc-800 text-sm focus:border-emerald-500"
          />
        </div>

        <Select value={floorFilter} onValueChange={setFloorFilter}>
          <SelectTrigger className="h-10 w-32 bg-zinc-900 border-zinc-800 text-sm">
            <div className="flex items-center gap-2">
              <Filter className="w-3.5 h-3.5 text-zinc-500" />
              <SelectValue placeholder="Lantai" />
            </div>
          </SelectTrigger>
          <SelectContent className="bg-zinc-900 border-zinc-800">
            <SelectItem value="all">Semua Lantai</SelectItem>
            {floors.map(floor => (
              <SelectItem key={floor} value={floor}>{floor}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="h-10 w-32 bg-zinc-900 border-zinc-800 text-sm">
            <div className="flex items-center gap-2">
              <Activity className="w-3.5 h-3.5 text-zinc-500" />
              <SelectValue placeholder="Status" />
            </div>
          </SelectTrigger>
          <SelectContent className="bg-zinc-900 border-zinc-800">
            <SelectItem value="all">Semua Status</SelectItem>
            <SelectItem value="online">Online</SelectItem>
            <SelectItem value="offline">Offline</SelectItem>
            <SelectItem value="passive">Passive</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
