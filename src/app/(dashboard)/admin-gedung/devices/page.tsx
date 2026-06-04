import { Suspense } from "react"
import { DeviceControlView } from "@/features/iot-control"

export default function AdminGedungDevicesPage() {
  return (
    <Suspense fallback={<div className="p-6 text-zinc-500 font-mono text-xs">Loading device controllers...</div>}>
      <DeviceControlView />
    </Suspense>
  )
}
