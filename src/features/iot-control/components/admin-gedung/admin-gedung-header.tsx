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
  isPatrolling: boolean;
  setIsPatrolling: (val: boolean) => void;
}

export function AdminGedungHeader({
  currentBuildingName,
  showCamera,
  setShowCamera,
  showRoomCards,
  setShowRoomCards,
  cinemaMode,
  setCinemaMode,
  isPatrolling,
  setIsPatrolling,
}: AdminGedungHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-2">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 shrink-0 shadow-[0_0_20px_rgba(16,185,129,0.1)]">
          <Building2 className="w-6 h-6" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-foreground tracking-tight">Live Monitoring</h1>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-bold text-emerald-400 uppercase tracking-widest mt-1">
              {currentBuildingName}
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            Real-time IoT metrics and AI camera streaming for building administrators
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={() => {
            setShowCamera(!showCamera);
            if (showCamera) setCinemaMode(false);
          }}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-bold transition-all duration-300 ${
            showCamera
              ? "bg-zinc-900 border-zinc-800 text-zinc-400 hover:bg-zinc-850 hover:text-foreground"
              : "bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20"
          }`}
        >
          {showCamera ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
          <span>{showCamera ? "Sembunyikan Video" : "Tampilkan Video"}</span>
        </button>

        <button
          onClick={() => setShowRoomCards(!showRoomCards)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-bold transition-all duration-300 ${
            showRoomCards
              ? "bg-zinc-900 border-zinc-800 text-zinc-400 hover:bg-zinc-855 hover:text-foreground"
              : "bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20"
          }`}
        >
          {showRoomCards ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
          <span>{showRoomCards ? "Sembunyikan Kelas" : "Tampilkan Kelas"}</span>
        </button>

        {showCamera && (
          <button
            onClick={() => setCinemaMode(!cinemaMode)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-bold transition-all duration-300 ${
              !cinemaMode
                ? "bg-zinc-900 border-zinc-800 text-zinc-400 hover:bg-zinc-850 hover:text-foreground"
                : "bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20"
            }`}
          >
            {cinemaMode ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            <span>{cinemaMode ? "Normal View" : "Cinema Mode"}</span>
          </button>
        )}

        <button
          onClick={() => setIsPatrolling(!isPatrolling)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-bold transition-all duration-300 ${
            isPatrolling
              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.1)] hover:bg-emerald-500/20"
              : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:bg-zinc-850 hover:text-foreground"
          }`}
        >
          {isPatrolling ? (
            <>
              <Pause className="w-3.5 h-3.5 text-emerald-400" />
              <span className="flex items-center gap-1">
                <span>Auto Patrol</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              </span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 text-zinc-450" />
              <span>Auto Patrol</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
