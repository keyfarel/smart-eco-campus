"use client";

import { Building2, DoorOpen, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ManagementHeaderProps {
  onAddRoom?: () => void;
  onAddBuilding?: () => void;
  isAddRoomDisabled?: boolean;
  viewType: "buildings" | "rooms";
}

export function ManagementHeader({
  onAddRoom,
  onAddBuilding,
  isAddRoomDisabled = false,
  viewType,
}: ManagementHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-lg border flex items-center justify-center ${
          viewType === "buildings" 
            ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-500" 
            : "bg-blue-500/10 border-blue-500/30 text-blue-400"
        }`}>
          {viewType === "buildings" ? <Building2 className="w-5 h-5" /> : <DoorOpen className="w-5 h-5" />}
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {viewType === "buildings" ? "Manajemen Gedung" : "Manajemen Ruangan"}
          </h1>
          <p className="text-sm text-muted-foreground">
            {viewType === "buildings" 
              ? "Kelola Master Data Gedung, pemetaan ruangan, dan saringan navigasi topologi" 
              : "Kelola direktori ruangan dan kapasitas"}
          </p>
        </div>
      </div>

      <div className="hidden md:flex items-center gap-2">
        {viewType === "rooms" && onAddRoom && (
          <Button
            onClick={onAddRoom}
            disabled={isAddRoomDisabled}
            className="h-9 px-3 sm:px-4 bg-zinc-100 hover:bg-white text-zinc-950 font-medium transition-all shrink-0"
          >
            <PlusCircle className="w-4 h-4 sm:mr-2" />
            <span className="hidden sm:inline">Add New Room</span>
          </Button>
        )}

        {viewType === "buildings" && onAddBuilding && (
          <Button
            onClick={onAddBuilding}
            className="h-9 px-3 sm:px-4 bg-zinc-100 hover:bg-white text-zinc-950 font-medium transition-all shrink-0"
          >
            <PlusCircle className="w-4 h-4 sm:mr-2" />
            <span className="hidden sm:inline">Add New Building</span>
          </Button>
        )}
      </div>
    </div>
  );
}
