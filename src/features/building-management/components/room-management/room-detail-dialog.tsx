"use client";

import { DoorOpen, Hash, Users, Layers, Building2, ShieldCheck, Zap, Camera, Info, Cpu, ToggleLeft } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Room } from "@/features/building-management";

interface RoomDetailDialogProps {
  room: (Room & { buildingName?: string; buildingId?: string }) | null;
  onClose: () => void;
}

export function RoomDetailDialog({ room, onClose }: RoomDetailDialogProps) {
  if (!room) return null;

  return (
    <Dialog open={room !== null} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-zinc-900 border-zinc-800 text-foreground max-w-md p-0 overflow-hidden shadow-[0_0_50px_rgba(16,185,129,0.1)]">
        <div className="p-6 pb-4 border-b border-zinc-850 bg-zinc-900/50">
          <DialogHeader>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                <Building2 className="w-3 h-3" />
                <span>{room.buildingName || "Master Data"}</span>
              </div>
              <span className="text-[9px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.5 rounded uppercase">
                Active Zone
              </span>
            </div>
            <DialogTitle className="text-xl font-extrabold flex items-center gap-2.5 tracking-tight">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
                <DoorOpen className="w-4 h-4 text-emerald-500" />
              </div>
              <span>Room Specification</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-zinc-400 mt-1">
              Informasi teknis dan pemetaan operasional perangkat ESP32 di partisi ruangan.
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="p-6 pt-4 pb-4 space-y-6 max-h-[60vh] overflow-y-auto pr-3 scrollbar-thin scrollbar-thumb-zinc-855 scrollbar-track-transparent">
          {/* Identity Card */}
          <div className="bg-zinc-955 border border-zinc-850 rounded-xl p-4 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full -mr-12 -mt-12 blur-2xl group-hover:bg-emerald-500/10 transition-all" />
            
            <div className="space-y-3 relative">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-lg font-bold text-zinc-150 leading-tight">{room.name}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] font-mono text-emerald-500 bg-emerald-500/5 px-2 py-0.5 rounded border border-emerald-500/10">
                      CODE: {room.code}
                    </span>
                    <span className="text-[10px] font-mono text-zinc-500">
                      ID: {room.id.slice(0, 8)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="flex items-center gap-2.5 bg-zinc-900/50 p-2 rounded-lg border border-zinc-800/50">
                  <Layers className="w-4 h-4 text-zinc-500" />
                  <div className="flex flex-col">
                    <span className="text-[9px] text-zinc-500 uppercase font-bold tracking-tighter">Level</span>
                    <span className="text-xs font-bold text-zinc-300">Lantai {room.floor}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2.5 bg-zinc-900/50 p-2 rounded-lg border border-zinc-800/50">
                  <Users className="w-4 h-4 text-zinc-500" />
                  <div className="flex flex-col">
                    <span className="text-[9px] text-zinc-500 uppercase font-bold tracking-tighter">Capacity</span>
                    <span className="text-xs font-bold text-zinc-300">{room.capacity} Seats</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* IoT Hardware Specifications (Based on official documentation) */}
          <div className="space-y-3">
            <h5 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
              <Cpu className="w-3 h-3 text-emerald-500" />
              Connected Hardware Endpoints
            </h5>
            
            <div className="grid grid-cols-1 gap-2">
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-zinc-955 border border-zinc-850 group/item hover:border-emerald-500/30 transition-all">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-zinc-900 flex items-center justify-center border border-zinc-800 group-hover/item:border-emerald-500/20">
                    <Zap className="w-4 h-4 text-yellow-500/70" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-zinc-300 block">PZEM-004T v3</span>
                    <span className="text-[9px] text-zinc-500">UART telemetry: V, A, W, kWh</span>
                  </div>
                </div>
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500/40" />
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg bg-zinc-955 border border-zinc-850 group/item hover:border-emerald-500/30 transition-all">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-zinc-900 flex items-center justify-center border border-zinc-800 group-hover/item:border-emerald-500/20">
                    <Camera className="w-4 h-4 text-blue-500/70" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-zinc-300 block">ESP32-CAM</span>
                    <span className="text-[9px] text-zinc-500">AI Vision Node w/ YOLOv8</span>
                  </div>
                </div>
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500/40" />
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg bg-zinc-955 border border-zinc-850 group/item hover:border-emerald-500/30 transition-all">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-zinc-900 flex items-center justify-center border border-zinc-800 group-hover/item:border-emerald-500/20">
                    <ToggleLeft className="w-4 h-4 text-orange-500/70" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-zinc-300 block">NO Relay & Wall Switch</span>
                    <span className="text-[9px] text-zinc-500">Fail-safe actuator w/ physical override lock</span>
                  </div>
                </div>
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500/40" />
              </div>
            </div>
          </div>

          <div className="p-3 bg-emerald-500/5 border border-emerald-500/10 rounded-lg flex items-start gap-2.5">
            <Info className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            <div className="space-y-1">
               <span className="text-[10px] font-bold text-emerald-400 block uppercase tracking-wide">YOLOv8 Automation Edge</span>
               <p className="text-[10px] text-zinc-400 leading-relaxed">
                Kelistrikan ruangan ini divalidasi oleh ESP32-CAM secara lokal. Intervensi fisik (menekan sakelar dinding) akan memicu status Override Lock (Mode Manual) pada Firebase.
               </p>
            </div>
          </div>
        </div>

        <div className="p-6 pt-4 border-t border-zinc-850 flex justify-end bg-zinc-900/80">
          <Button
            onClick={onClose}
            className="bg-zinc-850 hover:bg-zinc-800 text-zinc-300 font-bold border border-zinc-750 h-10 px-8 text-xs cursor-pointer w-full sm:w-auto transition-all"
          >
            Close Specification Sheet
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}


