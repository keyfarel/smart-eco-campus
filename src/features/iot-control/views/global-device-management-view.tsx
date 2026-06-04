"use client"

import { useSession } from "next-auth/react"
import { Cpu, ShieldAlert } from "lucide-react"
import { DeviceRegistrationTab } from "../components/device-control/device-registration-tab"

export function GlobalDeviceManagementView() {
  const { data: session } = useSession()
  const userRole = session?.user?.role || "SUPER_ADMIN"
  const isSuperAdmin = userRole === "SUPER_ADMIN"

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* 🚀 Header Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
            <Cpu className="w-5 h-5 text-emerald-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Manajemen Perangkat IoT
            </h1>
            <p className="text-sm text-muted-foreground">
              Kelola, pantau, dan daftarkan perangkat sensor IoT (ESP32) di seluruh area kampus.
            </p>
          </div>
        </div>

        {/* Access Badges */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          {isSuperAdmin && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-semibold uppercase tracking-wider font-mono">
              <span>Super Admin</span>
            </div>
          )}
        </div>
      </div>

      {/* 📦 Dedicated Content Renderer */}
      <div className="animate-[fadeIn_0.3s_ease-out]">
        <DeviceRegistrationTab hideMetrics={true} />
      </div>
    </div>
  )
}
