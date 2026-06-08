"use client";

import { Power, Cpu, ShieldAlert, Building2 } from "lucide-react";

interface DeviceControlHeaderProps {
  currentTab: "control" | "registration";
  isReadOnly: boolean;
  isBuildingAdmin: boolean;
  assignedBuildingName?: string;
}

export function DeviceControlHeader({
  currentTab,
  isReadOnly,
  isBuildingAdmin,
  assignedBuildingName,
}: DeviceControlHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
          {currentTab === "control" ? (
            <Power className="w-5 h-5 text-emerald-500 animate-pulse" />
          ) : (
            <Cpu className="w-5 h-5 text-emerald-500" />
          )}
        </div>
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-foreground leading-tight">
            <span className="md:hidden">
              {currentTab === "control" ? "Kendali Perangkat" : "Topologi IoT"}
            </span>
            <span className="hidden md:inline">
              {currentTab === "control" ? "Manajemen Perangkat IoT" : "Registrasi & Pemetaan Perangkat"}
            </span>
          </h1>
          <p className="text-xs md:text-sm text-muted-foreground mt-0.5 md:mt-0">
            <span className="md:hidden">
              {currentTab === "control"
                ? "Pantau & kendalikan sakelar kelas."
                : "Kelola perangkat ESP32 baru."}
            </span>
            <span className="hidden md:inline">
              {currentTab === "control"
                ? "Pemantauan status daya otonom dan kendali manual override relai daya kelas"
                : "Kelola, pantau, dan daftarkan perangkat sensor IoT (ESP32) di area gedung."}
            </span>
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 self-start md:self-auto">
        {isReadOnly && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-yellow-500/10 border border-yellow-500/30 text-yellow-500 text-xs font-semibold">
            <ShieldAlert className="w-4 h-4" />
            <span>Read-Only Mode (Executive)</span>
          </div>
        )}
      </div>
    </div>
  );
}
