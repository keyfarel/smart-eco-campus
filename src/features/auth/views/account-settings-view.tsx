"use client"

import { Settings } from "lucide-react"
import { useAccountSettings } from "../hooks/use-account-settings"
import { ProfileCard } from "../components/account-settings/profile-card"
import { SettingsForm } from "../components/account-settings/settings-form"

interface AccountSettingsViewProps {
  currentName?: string
  currentEmail?: string
  role?: string
}

export function AccountSettingsView({ 
  currentName = "",
  currentEmail = "",
  role = ""
}: AccountSettingsViewProps) {
  const settings = useAccountSettings({ currentName, currentEmail })

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

      <div className="grid gap-6 md:grid-cols-[1fr_300px]">
        {/* Main Form */}
        <SettingsForm {...settings} />

        {/* Side Info Panel */}
        <div className="space-y-6">
          <ProfileCard name={settings.name} email={settings.email} role={role} />
        </div>
      </div>
    </div>
  )
}
