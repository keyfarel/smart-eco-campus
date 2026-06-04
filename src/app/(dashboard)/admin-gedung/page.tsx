import { Suspense } from "react"
import { AdminGedungView } from "@/features/iot-control"

export default function AdminGedungPage() {
  return (
    <Suspense fallback={<div className="p-6 text-zinc-500 font-mono text-xs">Loading telemetry dashboard...</div>}>
      <AdminGedungView />
    </Suspense>
  )
}
