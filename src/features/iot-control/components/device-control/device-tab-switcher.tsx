"use client";

import { Power, Cpu } from "lucide-react";

interface DeviceTabSwitcherProps {
  showTabs: boolean;
  activeTab: "control" | "registration";
  setActiveTab: (tab: "control" | "registration") => void;
}

export function DeviceTabSwitcher({
  showTabs,
  activeTab,
  setActiveTab,
}: DeviceTabSwitcherProps) {
  if (!showTabs) return null;

  return (
    <div className="flex bg-zinc-950 p-1 rounded-lg border border-zinc-850 max-w-sm">
      <button
        onClick={() => setActiveTab("control")}
        className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 text-xs font-bold rounded transition-all duration-200 cursor-pointer ${
          activeTab === "control"
            ? "bg-zinc-900 border border-zinc-800 text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.08)]"
            : "text-zinc-500 hover:text-zinc-350"
        }`}
      >
        <Power className="w-3.5 h-3.5" />
        <span>Power Control</span>
      </button>

      <button
        onClick={() => setActiveTab("registration")}
        className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 text-xs font-bold rounded transition-all duration-200 cursor-pointer ${
          activeTab === "registration"
            ? "bg-zinc-900 border border-zinc-800 text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.08)]"
            : "text-zinc-500 hover:text-zinc-350"
        }`}
      >
        <Cpu className="w-3.5 h-3.5" />
        <span>Topography & Assets</span>
      </button>
    </div>
  );
}
