"use client";

import { Building2, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ManagementHeaderProps {
  onAddRoom: () => void;
  onAddBuilding: () => void;
  isAddRoomDisabled: boolean;
}

export function ManagementHeader({
  onAddRoom,
  onAddBuilding,
  isAddRoomDisabled,
}: ManagementHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
          <Building2 className="w-5 h-5 text-emerald-500" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Building Management</h1>
          <p className="text-sm text-muted-foreground">
            Kelola Master Data Gedung, pemetaan ruangan, dan saringan navigasi topologi
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onAddRoom}
          disabled={isAddRoomDisabled}
          className="h-10 px-4 rounded-md bg-zinc-850 hover:bg-zinc-800 text-emerald-400 font-bold border border-zinc-750 flex items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          <PlusCircle className="w-4 h-4 text-emerald-400" />
          <span>Add New Room</span>
        </button>

        <Button
          onClick={onAddBuilding}
          className="bg-emerald-500 hover:bg-emerald-600 text-zinc-955 font-bold flex items-center gap-2 shadow-[0_0_15px_rgba(16,185,129,0.2)] hover:shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all"
        >
          <PlusCircle className="w-4 h-4 text-zinc-955" />
          <span>Add New Building</span>
        </Button>
      </div>
    </div>
  );
}
