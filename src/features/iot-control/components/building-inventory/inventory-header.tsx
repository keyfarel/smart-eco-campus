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

export function InventoryHeader({ buildingName }: InventoryHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.1)]">
          <Building2 className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-foreground tracking-tight">Daftar Ruangan</h1>
          <p className="text-xs md:text-sm text-muted-foreground mt-0.5 md:mt-0">
            <span className="md:hidden">Inventaris & status <span className="text-emerald-500 font-medium">{buildingName}</span></span>
            <span className="hidden md:inline">Inventaris operasional dan status IoT untuk <span className="text-emerald-500 font-medium">{buildingName}</span></span>
          </p>
        </div>
      </div>
    </div>
  );
}
