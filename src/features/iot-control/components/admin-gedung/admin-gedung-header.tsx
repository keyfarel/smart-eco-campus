"use client";

import { Building2, Eye, EyeOff, Maximize2, Minimize2, Pause, Play } from "lucide-react";

interface AdminGedungHeaderProps {
  currentBuildingName: string;
  showCamera: boolean;
  setShowCamera: (val: boolean) => void;
  showRoomCards: boolean;
  setShowRoomCards: (val: boolean) => void;
  cinemaMode: boolean;
  setCinemaMode: (val: boolean) => void;
}

export function AdminGedungHeader({
  currentBuildingName,
  showCamera,
  setShowCamera,
  showRoomCards,
  setShowRoomCards,
  cinemaMode,
  setCinemaMode,
}: AdminGedungHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-2">
      <div className="flex items-start md:items-center gap-3 md:gap-4">
        <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 shrink-0 shadow-[0_0_20px_rgba(16,185,129,0.1)]">
          <Building2 className="w-5 h-5 md:w-6 md:h-6" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-xl md:text-2xl font-bold text-foreground tracking-tight truncate">Live Monitoring</h1>
            <span className="px-2 py-0.5 md:px-2.5 md:py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[9px] md:text-[10px] font-bold text-emerald-400 uppercase tracking-widest mt-0.5 md:mt-1 shrink-0">
              {currentBuildingName}
            </span>
          </div>
          <p className="text-[11px] md:text-sm text-muted-foreground truncate md:whitespace-normal">
            <span className="hidden md:inline">Real-time IoT metrics and AI camera streaming for building administrators</span>
            <span className="md:hidden">Real-time IoT & AI monitoring</span>
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0 w-full md:w-auto">
        <button
          onClick={() => setShowRoomCards(!showRoomCards)}
          className={`flex items-center justify-center md:justify-start gap-1.5 px-2 py-1.5 md:px-3 rounded-lg border text-[11px] md:text-xs font-bold transition-all duration-300 w-full md:w-auto ${
            showRoomCards
              ? "bg-zinc-900 border-zinc-800 text-zinc-400 hover:bg-zinc-855 hover:text-foreground"
              : "bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20"
          }`}
        >
          {showRoomCards ? <EyeOff className="w-3.5 h-3.5 shrink-0" /> : <Eye className="w-3.5 h-3.5 shrink-0" />}
          <span className="truncate">{showRoomCards ? "Hide Rooms" : "Show Rooms"}</span>
        </button>
      </div>
    </div>
  );
}
