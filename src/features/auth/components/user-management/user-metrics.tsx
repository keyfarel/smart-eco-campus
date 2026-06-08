import { Card, CardContent } from "@/components/ui/card"
import { Users, Shield, Building } from "lucide-react"
import { UserRecord } from "../../types/user"

interface UserMetricsProps {
  usersList: UserRecord[]
}

export function UserMetrics({ usersList }: UserMetricsProps) {
  return (
    <div className="grid grid-cols-3 gap-3 sm:gap-4">
      {/* Card 1: Total Users */}
      <Card className="bg-zinc-900 border-zinc-800 hover:border-zinc-750 hover:shadow-[0_4px_20px_rgba(0,0,0,0.15)] transition-all max-sm:aspect-square overflow-hidden rounded-xl">
        <CardContent className="p-2 sm:p-4 w-full h-full flex flex-col sm:flex-row items-center justify-center sm:justify-start text-center sm:text-left gap-1 sm:gap-4">
          
          <div className="p-1.5 sm:p-0 sm:w-12 sm:h-12 rounded-lg bg-zinc-800 sm:bg-emerald-500/10 sm:border sm:border-emerald-500/20 flex items-center justify-center text-zinc-400 sm:text-emerald-500 shrink-0 mb-1 sm:mb-0">
            <Users className="w-4 h-4 sm:w-6 sm:h-6" />
          </div>

          <div className="flex flex-col items-center sm:items-start">
            <span className="text-xs text-zinc-400 font-semibold tracking-wide hidden sm:block mb-0.5">Total Operators</span>
            <p className="text-lg sm:text-2xl font-extrabold font-mono text-zinc-100 leading-none">{usersList.length}</p>
            <p className="text-[9px] text-muted-foreground uppercase font-semibold block sm:hidden mt-1">Total</p>
            <p className="text-[10px] text-zinc-500 hidden sm:block mt-1">Registered system credentials</p>
          </div>

        </CardContent>
      </Card>

      {/* Card 2: Super Admins */}
      <Card className="bg-zinc-900 border-zinc-800 hover:border-zinc-750 hover:shadow-[0_4px_20px_rgba(0,0,0,0.15)] transition-all max-sm:aspect-square overflow-hidden rounded-xl">
        <CardContent className="p-2 sm:p-4 w-full h-full flex flex-col sm:flex-row items-center justify-center sm:justify-start text-center sm:text-left gap-1 sm:gap-4">
          
          <div className="p-1.5 sm:p-0 sm:w-12 sm:h-12 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500 sm:text-red-400 shrink-0 mb-1 sm:mb-0">
            <Shield className="w-4 h-4 sm:w-6 sm:h-6" />
          </div>

          <div className="flex flex-col items-center sm:items-start">
            <span className="text-xs text-zinc-400 font-semibold tracking-wide hidden sm:block mb-0.5">Super Admins</span>
            <p className="text-lg sm:text-2xl font-extrabold font-mono text-zinc-100 leading-none">
              {usersList.filter((u) => u.role === "super_admin").length}
            </p>
            <p className="text-[9px] text-red-400 uppercase font-semibold block sm:hidden mt-1">S. Admins</p>
            <p className="text-[10px] text-zinc-500 hidden sm:block mt-1">Full clearance administrators</p>
          </div>

        </CardContent>
      </Card>

      {/* Card 3: Building Admins */}
      <Card className="bg-zinc-900 border-zinc-800 hover:border-zinc-750 hover:shadow-[0_4px_20px_rgba(0,0,0,0.15)] transition-all max-sm:aspect-square overflow-hidden rounded-xl">
        <CardContent className="p-2 sm:p-4 w-full h-full flex flex-col sm:flex-row items-center justify-center sm:justify-start text-center sm:text-left gap-1 sm:gap-4">
          
          <div className="p-1.5 sm:p-0 sm:w-12 sm:h-12 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500 sm:text-blue-400 shrink-0 mb-1 sm:mb-0">
            <Building className="w-4 h-4 sm:w-6 sm:h-6" />
          </div>

          <div className="flex flex-col items-center sm:items-start">
            <span className="text-xs text-zinc-400 font-semibold tracking-wide hidden sm:block mb-0.5">Zone Operators</span>
            <p className="text-lg sm:text-2xl font-extrabold font-mono text-zinc-100 leading-none">
              {usersList.filter((u) => u.role === "admin_gedung").length}
            </p>
            <p className="text-[9px] text-blue-400 uppercase font-semibold block sm:hidden mt-1">Operators</p>
            <p className="text-[10px] text-zinc-500 hidden sm:block mt-1">Maintainers and viewers</p>
          </div>

        </CardContent>
      </Card>
    </div>
  )
}
