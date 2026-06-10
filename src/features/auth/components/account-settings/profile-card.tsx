"use client"

import { Card, CardContent } from "@/components/ui/card"
import { User, MapPin, Shield } from "lucide-react"

interface ProfileCardProps {
  name: string
  email: string
  role: string
  location?: string
}

export function ProfileCard({ name, email, role, location }: ProfileCardProps) {
  // Clean up role string for display
  const displayRole = (role || "User").replace(/_/g, " ")

  return (
    <Card className="bg-background border-zinc-800 overflow-hidden shadow-xl shadow-emerald-500/5">
      {/* Cover Background */}
      <div className="h-28 w-full relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 via-teal-500/10 to-transparent" />
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)", backgroundSize: "16px 16px" }} />
        
        {/* Avatar */}
        <div className="absolute -bottom-10 left-1/2 -translate-x-1/2">
          <div className="w-20 h-20 rounded-2xl bg-zinc-950 border border-zinc-800 flex items-center justify-center text-emerald-500 shadow-lg shadow-emerald-500/20 rotate-3 transition-transform hover:rotate-0 duration-300">
            <User className="w-10 h-10 -rotate-3 transition-transform hover:rotate-0 duration-300" />
          </div>
        </div>
      </div>

      <CardContent className="pt-14 pb-6 px-6">
        <div className="text-center mb-6">
          <h3 className="text-xl font-bold text-zinc-100 tracking-tight">{name || "Administrator"}</h3>
          <p className="text-sm text-zinc-400 mt-1">{email}</p>
        </div>
        
        <div className="flex flex-col gap-2.5">
          {/* Role Row */}
          <div className="flex items-center justify-between bg-zinc-900/40 p-3 rounded-lg border border-zinc-800/50 hover:bg-zinc-900/80 transition-colors">
            <div className="flex items-center gap-2 text-zinc-500">
              <Shield className="w-4 h-4" />
              <span className="text-xs font-medium">Access Role</span>
            </div>
            <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-md uppercase tracking-wider">
              {displayRole}
            </span>
          </div>
          
          {/* Location Row */}
          {location && (
            <div className="flex items-center justify-between bg-zinc-900/40 p-3 rounded-lg border border-zinc-800/50 hover:bg-zinc-900/80 transition-colors">
              <div className="flex items-center gap-2 text-zinc-500">
                <MapPin className="w-4 h-4" />
                <span className="text-xs font-medium">Assigned Area</span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-md max-w-[140px] truncate">
                <span className="truncate">{location}</span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
