"use client";

import { DoorOpen, Hash, CheckCircle2, AlertCircle, Building2, Layers, Users } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Building } from "@/features/building-management";

interface RoomFormProps {
  isAddingFromHeader?: boolean;
  buildingsList?: Building[];
  roomFormBuildingId: string;
  setRoomFormBuildingId?: (val: string) => void;
  roomFloor: string;
  setRoomFloor: (val: string) => void;
  roomCode: string;
  setRoomCode: (val: string) => void;
  roomName: string;
  setRoomName: (val: string) => void;
  roomCapacity: string;
  setRoomCapacity: (val: string) => void;
  isSubmitting: boolean;
  formMaxFloors: number;
  showRoomCodeError: boolean;
  showRoomCodeSuccess: boolean;
  showRoomNameError: boolean;
  showRoomNameSuccess: boolean;
  showRoomCapacityError: boolean;
  showRoomCapacitySuccess: boolean;
  serverError?: string | null;
  accentColor?: "emerald" | "blue";
}

export function RoomForm({
  isAddingFromHeader = false,
  buildingsList = [],
  roomFormBuildingId,
  setRoomFormBuildingId,
  roomFloor,
  setRoomFloor,
  roomCode,
  setRoomCode,
  roomName,
  setRoomName,
  roomCapacity,
  setRoomCapacity,
  isSubmitting,
  formMaxFloors,
  showRoomCodeError,
  showRoomCodeSuccess,
  showRoomNameError,
  showRoomNameSuccess,
  showRoomCapacityError,
  showRoomCapacitySuccess,
  serverError,
  accentColor = "emerald",
}: RoomFormProps) {
  const focusRingClass = accentColor === "emerald" ? "focus-visible:ring-emerald-500/50 focus-visible:border-emerald-500" : "focus-visible:ring-blue-500/50 focus-visible:border-blue-500";
  const borderSuccessClass = accentColor === "emerald" ? "border-emerald-500/50" : "border-blue-500/50";
  const textAccentClass = accentColor === "emerald" ? "text-emerald-500" : "text-blue-500";
  const bgAccentClass = accentColor === "emerald" ? "bg-emerald-500/5" : "bg-blue-500/5";

  return (
    <div className="p-6 pt-4 pb-4 space-y-6 max-h-[60vh] overflow-y-auto pr-3 scrollbar-thin scrollbar-thumb-zinc-855 scrollbar-track-transparent">
      {/* SECTION 1: SPATIAL MAPPING */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 pb-1 border-b border-zinc-800/50">
          <Layers className={`w-3 h-3 ${textAccentClass}`} />
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Spatial Mapping</span>
        </div>
        
        <div className={`grid grid-cols-1 ${isAddingFromHeader ? "gap-4" : "gap-0"} p-3 rounded-lg ${bgAccentClass} border border-zinc-800/30`}>
          {/* Pilih Gedung (Only shown if adding from main header) */}
          {isAddingFromHeader && setRoomFormBuildingId && (
            <div className="space-y-1.5">
              <Label htmlFor="roomBuilding" className="text-zinc-300 font-medium text-[11px]">Parent Building</Label>
              <Select
                value={roomFormBuildingId}
                onValueChange={(val) => {
                  setRoomFormBuildingId(val);
                  setRoomFloor("1"); 
                }}
                disabled={isSubmitting}
              >
                <SelectTrigger id="roomBuilding" className="bg-zinc-955 border-zinc-800 h-9 text-xs">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-3.5 h-3.5 text-zinc-500" />
                    <SelectValue placeholder="Pilih Gedung..." />
                  </div>
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border-zinc-800">
                  {buildingsList.map((b) => (
                    <SelectItem key={b.id} value={b.id}>
                      {b.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Pilih Lantai */}
          <div className="space-y-1.5">
            <Label htmlFor="roomFloor" className="text-zinc-300 font-medium text-[11px]">Floor Level</Label>
            <Select
              value={roomFloor}
              onValueChange={setRoomFloor}
              disabled={isSubmitting || !roomFormBuildingId}
            >
              <SelectTrigger id="roomFloor" className="bg-zinc-955 border-zinc-800 h-9 text-xs">
                <div className="flex items-center gap-2">
                  <Layers className="w-3.5 h-3.5 text-zinc-500" />
                  <SelectValue placeholder="Pilih Lantai..." />
                </div>
              </SelectTrigger>
              <SelectContent className="bg-zinc-900 border-zinc-800">
                {Array.from({ length: formMaxFloors }).map((_, floorIdx) => {
                  const floorNum = floorIdx + 1;
                  return (
                    <SelectItem key={floorNum} value={floorNum.toString()}>
                      Lantai {floorNum}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* SECTION 2: PHYSICAL METADATA */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 pb-1 border-b border-zinc-800/50">
          <Hash className={`w-3 h-3 ${textAccentClass}`} />
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Physical Metadata</span>
        </div>

        <div className="space-y-4">
          {/* Kode Ruangan */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <Label htmlFor="roomCode" className="text-zinc-300 font-medium text-[11px]">Room Code</Label>
              {showRoomCodeSuccess && <span className={`text-[9px] font-bold ${textAccentClass} uppercase tracking-tighter`}>Verified</span>}
            </div>
            <div className="relative">
              <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500" />
              <Input
                id="roomCode"
                placeholder="e.g. A-103"
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value)}
                className={`pl-9 h-10 bg-zinc-950 border-zinc-800 ${focusRingClass} text-xs uppercase transition-all ${
                  showRoomCodeError ? "border-red-500/50 ring-1 ring-red-500/20" : ""
                } ${showRoomCodeSuccess ? `${borderSuccessClass} bg-${accentColor}-500/5` : ""}`}
                required
                disabled={isSubmitting || !roomFormBuildingId}
              />
              {showRoomCodeSuccess && (
                <CheckCircle2 className={`absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 ${textAccentClass}`} />
              )}
            </div>
            {showRoomCodeError && (
              <p className="text-[10px] text-red-400 font-medium flex items-center gap-1 mt-1">
                <AlertCircle className="w-3 h-3 text-red-500" />
                <span>{serverError || "Kode ruangan minimal 3 karakter."}</span>
              </p>
            )}
          </div>

          {/* Nama Ruangan */}
          <div className="space-y-1.5">
            <Label htmlFor="roomName" className="text-zinc-300 font-medium text-[11px]">Full Room Name</Label>
            <div className="relative">
              <DoorOpen className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500" />
              <Input
                id="roomName"
                placeholder="e.g. Lab Pemrograman B"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                className={`pl-9 h-10 bg-zinc-950 border-zinc-800 ${focusRingClass} text-xs transition-all ${
                  showRoomNameError ? "border-red-500/50 ring-1 ring-red-500/20" : ""
                } ${showRoomNameSuccess ? `${borderSuccessClass} bg-${accentColor}-500/5` : ""}`}
                required
                disabled={isSubmitting || !roomFormBuildingId}
              />
              {showRoomNameSuccess && (
                <CheckCircle2 className={`absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 ${textAccentClass}`} />
              )}
            </div>
            {showRoomNameError && (
              <p className="text-[10px] text-red-400 font-medium flex items-center gap-1 mt-1">
                <AlertCircle className="w-3 h-3 text-red-500" />
                <span>Nama ruangan minimal 3 karakter.</span>
              </p>
            )}
          </div>

          {/* Kapasitas */}
          <div className="space-y-1.5">
            <Label htmlFor="roomCapacity" className="text-zinc-300 font-medium text-[11px]">Seating Capacity</Label>
            <div className="relative">
              <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500" />
              <Input
                id="roomCapacity"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder="e.g. 35"
                value={roomCapacity}
                onChange={(e) => setRoomCapacity(e.target.value.replace(/\D/g, ""))}
                className={`pl-9 h-10 bg-zinc-950 border-zinc-800 ${focusRingClass} text-xs font-mono transition-all ${
                  showRoomCapacityError ? "border-red-500/50 ring-1 ring-red-500/20" : ""
                } ${showRoomCapacitySuccess ? `${borderSuccessClass} bg-${accentColor}-500/5` : ""}`}
                required
                disabled={isSubmitting || !roomFormBuildingId}
              />
              {showRoomCapacitySuccess && (
                <CheckCircle2 className={`absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 ${textAccentClass}`} />
              )}
            </div>
            {showRoomCapacityError && (
              <p className="text-[10px] text-red-400 font-medium flex items-center gap-1 mt-1">
                <AlertCircle className="w-3 h-3 text-red-500" />
                <span>Kapasitas minimal adalah 1 orang.</span>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

