"use client"

import { Eye, Mail, KeyRound, Shield, Building, MapPin, Network, Clock, Fingerprint } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { UserRecord } from "../../types/user"

interface UserDetailDialogProps {
  viewedUser: UserRecord | null
  setViewedUser: (user: UserRecord | null) => void
}

export function UserDetailDialog({ viewedUser, setViewedUser }: UserDetailDialogProps) {
  return (
    <Dialog open={viewedUser !== null} onOpenChange={(open) => !open && setViewedUser(null)}>
      <DialogContent className="bg-zinc-900 border-zinc-800 text-foreground max-w-lg p-0 overflow-hidden">
        <div className="p-6 pb-4 border-b border-zinc-850 bg-zinc-900">
          <DialogHeader>
            <DialogTitle className="text-lg flex items-center gap-2">
              <Eye className="w-5 h-5 text-emerald-500" />
              <span>Operator Profile Inspection</span>
            </DialogTitle>
            <DialogDescription>
              Detailed view of active operator security and operational scope parameters.
            </DialogDescription>
          </DialogHeader>
        </div>

        {viewedUser && (
          <div className="p-6 pt-4 pb-4 space-y-6 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
            {/* Profile Header */}
            <div className="flex items-center gap-4">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center font-bold text-2xl shrink-0 select-none shadow-[0_0_30px_rgba(0,0,0,0.5)] ${
                viewedUser.role === "super_admin"
                  ? "bg-red-500/10 border-2 border-red-500/20 text-red-400 shadow-red-500/10"
                  : "bg-emerald-500/10 border-2 border-emerald-500/20 text-emerald-400 shadow-emerald-500/10"
              }`}>
                {viewedUser.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-zinc-150 truncate">{viewedUser.name}</h3>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    Active
                  </span>
                </div>
                <span className="text-xs text-zinc-500 font-mono flex items-center gap-1.5 mt-1 truncate">
                  <Mail className="w-3.5 h-3.5 text-zinc-650" />
                  {viewedUser.email}
                </span>
              </div>
            </div>

            {/* Data Section 1: Core Credentials info */}
            <div className="space-y-3">
              <h4 className="text-xs font-semibold text-zinc-400">System Identity & Scope</h4>
              <div className="grid grid-cols-2 gap-4 bg-zinc-900/50 border border-zinc-800/60 p-4 rounded-xl">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] text-zinc-500 font-medium">User Unique ID</span>
                  <span className="text-xs text-zinc-300 font-mono truncate">{viewedUser.uid}</span>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-[10px] text-zinc-500 font-medium">Authentication Type</span>
                  <span className="text-xs text-zinc-300 font-mono flex items-center gap-1.5">
                    <KeyRound className="w-3.5 h-3.5 text-zinc-600 shrink-0" />
                    <span>JWT Credentials</span>
                  </span>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-[10px] text-zinc-500 font-medium">RBAC Security Role</span>
                  <div className="flex items-center gap-1.5">
                    <Shield className={`w-3.5 h-3.5 ${
                      viewedUser.role === "super_admin" ? "text-red-400" : "text-emerald-400"
                    }`} />
                    <span className="text-xs text-zinc-300 font-medium capitalize">{viewedUser.role.replace("_", " ")}</span>
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-[10px] text-zinc-500 font-medium">Assigned Location</span>
                  <div className="flex items-center gap-1">
                    <Building className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                    <span className="text-xs text-zinc-300 font-medium">
                      {viewedUser.assigned_gedung ? viewedUser.assigned_gedung.replace("_", " ").toUpperCase() : "GLOBAL SYSTEM"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Data Section 2: Security & Permissions level */}
            <div className="space-y-3">
              <h4 className="text-xs font-semibold text-zinc-400">Access Controls & Activity</h4>
              <div className="grid grid-cols-2 gap-4 bg-zinc-900/50 border border-zinc-800/60 p-4 rounded-xl">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] text-zinc-500 font-medium">Security Clearance</span>
                  <div className={`p-2.5 rounded-xl border ${
                    viewedUser.role === "super_admin"
                      ? "bg-red-500/5 border-red-500/10 text-red-400"
                      : "bg-emerald-500/5 border-emerald-500/10 text-emerald-400"
                  }`}>
                    {viewedUser.role === "super_admin"
                      ? "Level 3 (Full Read/Write)"
                      : "Level 2 (Building Maintainer)"}
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-[10px] text-zinc-500 font-medium">Operational Zone</span>
                  <span className="text-xs text-zinc-300 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-zinc-650 shrink-0" />
                    <span className="truncate">
                      {viewedUser.role === "admin_gedung"
                        ? viewedUser.assigned_gedung === "gedung_a"
                          ? "Zone A (Engineering Wing)"
                          : viewedUser.assigned_gedung === "gedung_b"
                          ? "Zone B (Science Wing)"
                          : "Zone C (Rektorat Wing)"
                        : "Campus-Wide Perimeter"}
                    </span>
                  </span>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-[10px] text-zinc-500 font-medium">Intranet Login IP</span>
                  <span className="text-xs text-zinc-300 font-mono flex items-center gap-1">
                    <Network className="w-3.5 h-3.5 text-zinc-650 shrink-0" />
                    <span>192.168.10.{viewedUser.uid.charCodeAt(viewedUser.uid.length - 1) || 45}</span>
                  </span>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-[10px] text-zinc-500 font-medium">Created Time</span>
                  <div className="flex items-center gap-1.5 text-xs text-zinc-300 font-mono">
                    <Clock className="w-3.5 h-3.5 text-zinc-650 shrink-0" />
                    <span>{new Date(viewedUser.created_at * 1000).toLocaleString("id-ID")}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Data Section 3: Privileges Description */}
            <div className="p-4 bg-zinc-900/50 border border-zinc-800/60 rounded-xl text-xs text-zinc-400 flex items-start gap-3">
              <Fingerprint className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <div className="leading-relaxed">
                <span className="font-semibold text-zinc-300 block mb-1">RBAC Scope Privileges</span>
                {viewedUser.role === "super_admin"
                  ? "Memiliki otoritas penuh atas administrasi fisik gedung, sensor IoT, registrasi kredensial operator, dan audit sistem global."
                  : "Terbatas untuk memantau status perangkat sensor, mengubah konfigurasi sensor, dan membaca log lokal pada gedung yang ditugaskan."}
              </div>
            </div>
          </div>
        )}

        <div className="p-6 pt-4 border-t border-zinc-850 flex justify-end bg-zinc-900">
          <Button
            onClick={() => setViewedUser(null)}
            className="bg-zinc-850 hover:bg-zinc-800 text-zinc-300 font-bold px-6 border border-zinc-750"
          >
            Close Profile
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
