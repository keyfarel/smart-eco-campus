"use client"

import { Users, Shield, Building } from "lucide-react"
import { UserRecord } from "../../types/user"

interface UserMetricsProps {
  usersList: UserRecord[]
}

export function UserMetrics({ usersList }: UserMetricsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Card 1: Total Users */}
      <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl flex items-center justify-between hover:border-zinc-750 hover:shadow-[0_4px_20px_rgba(0,0,0,0.15)] transition-all">
        <div className="space-y-1">
          <span className="text-xs text-zinc-400 font-semibold tracking-wide">Total Operators</span>
          <h3 className="text-2xl font-extrabold font-mono text-zinc-100">{usersList.length}</h3>
          <p className="text-[10px] text-zinc-500">Registered system credentials</p>
        </div>
        <div className="w-12 h-12 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500">
          <Users className="w-6 h-6 animate-pulse" />
        </div>
      </div>

      {/* Card 2: Super Admins */}
      <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl flex items-center justify-between hover:border-zinc-750 hover:shadow-[0_4px_20px_rgba(0,0,0,0.15)] transition-all">
        <div className="space-y-1">
          <span className="text-xs text-zinc-400 font-semibold tracking-wide">Super Admins</span>
          <h3 className="text-2xl font-extrabold font-mono text-zinc-100">
            {usersList.filter((u) => u.role === "super_admin").length}
          </h3>
          <p className="text-[10px] text-zinc-500">Full clearance administrators</p>
        </div>
        <div className="w-12 h-12 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">
          <Shield className="w-6 h-6" />
        </div>
      </div>

      {/* Card 3: Building Admins & Executives */}
      <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl flex items-center justify-between hover:border-zinc-750 hover:shadow-[0_4px_20px_rgba(0,0,0,0.15)] transition-all">
        <div className="space-y-1">
          <span className="text-xs text-zinc-400 font-semibold tracking-wide">Zone Operators</span>
          <h3 className="text-2xl font-extrabold font-mono text-zinc-100">
            {usersList.filter((u) => u.role === "admin_gedung" || u.role === "executive").length}
          </h3>
          <p className="text-[10px] text-zinc-500">Maintainers and viewers</p>
        </div>
        <div className="w-12 h-12 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
          <Building className="w-6 h-6" />
        </div>
      </div>
    </div>
  )
}
