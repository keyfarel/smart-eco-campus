"use client"

import { Settings } from "lucide-react"
import { useAccountSettings } from "../hooks/use-account-settings"
import { ProfileCard } from "../components/account-settings/profile-card"
import { SettingsForm } from "../components/account-settings/settings-form"
import { useBuildings } from "@/features/building-management"

interface AccountSettingsViewProps {
  currentName?: string
  currentEmail?: string
  role?: string
  assignedGedungId?: string
}

export function AccountSettingsView({ 
  currentName = "",
  currentEmail = "",
  role = "",
  assignedGedungId = ""
}: AccountSettingsViewProps) {
  const settings = useAccountSettings({ currentName, currentEmail })
  const { buildingsList } = useBuildings()

  // Resolve building name based on ID
  const buildingLocation = assignedGedungId 
    ? buildingsList.find(b => b.id === assignedGedungId)?.name || assignedGedungId
    : undefined

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500">
          <Settings className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Account Settings</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your profile information and security preferences.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-6 md:flex-row-reverse">
        {/* Side Info Panel (Top on Mobile, Right on Desktop) */}
        <div className="w-full md:w-[300px] shrink-0 space-y-6">
          <ProfileCard name={settings.name} email={settings.email} role={role} location={buildingLocation} />
        </div>

        {/* Main Form (Bottom on Mobile, Left on Desktop) */}
        <div className="w-full min-w-0 flex-1">
          <SettingsForm {...settings} />
        </div>
      </div>
    </div>
  )
}
