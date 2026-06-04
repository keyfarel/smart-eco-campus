"use client"

import { ShieldAlert, Award } from "lucide-react"
import { useExecutiveMetrics } from "../hooks/use-executive-metrics"
import { ExecutiveKpiStats } from "../components/executive/executive-kpi-stats"
import { ExecutivePremiumPanels } from "../components/executive/executive-premium-panels"
import { AnalyticsEntryPanel } from "../components/executive/analytics-entry-panel"

export function ExecutiveView() {
  const metrics = useExecutiveMetrics()

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <Award className="w-5 h-5 text-emerald-500" />
          <span className="text-xs font-mono font-bold tracking-wider text-emerald-500 uppercase">Executive Dashboard</span>
        </div>
        <h1 className="text-2xl font-bold text-foreground">Macro Campus Summary</h1>
        <p className="text-sm text-muted-foreground">
          High-level insights into financial efficiency, carbon footprint reduction, and energy trends
        </p>
      </div>

      {/* Read-Only Notice */}
      <div className="flex items-center gap-3 p-4 rounded-xl border border-emerald-500/10 bg-emerald-500/5 text-xs text-emerald-400">
        <ShieldAlert className="w-4 h-4 text-emerald-500 shrink-0" />
        <span>
          <strong>Akses Read-Only:</strong> Anda masuk dengan hak akses Rektorat. Semua sakelar kontrol perangkat keras dinonaktifkan demi keselamatan operasional kelistrikan kampus.
        </span>
      </div>

      {/* Executive KPI Stats */}
      <ExecutiveKpiStats 
        liveLoad={metrics.liveLoad} 
        energySaved={metrics.energySaved}
        financialSaved={metrics.financialSaved}
        co2Prevented={metrics.co2Prevented}
      />

      {/* Premium Milestones & Ranking Panels */}
      <ExecutivePremiumPanels
        liveLoad={metrics.liveLoad} 
        energySaved={metrics.energySaved}
        financialSaved={metrics.financialSaved}
        co2Prevented={metrics.co2Prevented}
      />

      {/* Analytics Entry Panel */}
      <AnalyticsEntryPanel />
    </div>
  )
}
