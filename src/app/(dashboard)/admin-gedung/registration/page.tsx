import { Suspense } from "react"
import { GlobalDeviceManagementView } from "@/features/iot-control"

export default function AdminGedungRegistrationPage() {
  return (
    <Suspense fallback={<div className="p-6 text-zinc-500 font-mono text-xs">Loading registration...</div>}>
      <GlobalDeviceManagementView />
    </Suspense>
  )
}
