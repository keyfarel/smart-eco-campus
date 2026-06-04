"use client"

import { Card, CardContent } from "@/components/ui/card"
import { User } from "lucide-react"

interface ProfileCardProps {
  name: string
  email: string
  role: string
}

export function ProfileCard({ name, email, role }: ProfileCardProps) {
  return (
    <Card className="bg-background border-zinc-800">
      <CardContent className="pt-6">
        <div className="flex flex-col items-center text-center">
          <div className="w-20 h-20 rounded-full bg-emerald-500/10 border-2 border-emerald-500/50 flex items-center justify-center text-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.2)] mb-4">
            <User className="w-10 h-10" />
          </div>
          <h3 className="text-lg font-semibold text-zinc-200">{name || "User"}</h3>
          <p className="text-xs text-zinc-500 mt-1">{email}</p>
          
          <div className="mt-6 w-full pt-6 border-t border-zinc-800/50 flex justify-between items-center">
            <span className="text-xs text-zinc-500">Active Role</span>
            <span className="text-xs font-medium text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-full uppercase tracking-wider">
              {role || "User"}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
