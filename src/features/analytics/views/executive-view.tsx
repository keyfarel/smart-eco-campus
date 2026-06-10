"use client"

import { ShieldAlert, Award } from "lucide-react"
import { toast } from "sonner"
import { useExecutiveMetrics } from "../hooks/use-executive-metrics"
import { ExecutiveKpiStats } from "../components/executive/executive-kpi-stats"
import { ExecutivePremiumPanels } from "../components/executive/executive-premium-panels"
import { AnalyticsEntryPanel } from "../components/executive/analytics-entry-panel"
import { ExecutiveHeader } from "../components/executive/executive-header"

export function ExecutiveView() {
  const { 
    metrics, 
    isSparkRunning, 
    isClusterOffline, 
    lastUpdated, 
    triggerSparkJob 
  } = useExecutiveMetrics()

  return (
    <div className="space-y-8">
      {/* Header and Cluster Status */}
      <ExecutiveHeader 
        isSparkRunning={isSparkRunning}
        isClusterOffline={isClusterOffline}
        lastUpdated={lastUpdated}
        sparkStatus={metrics.sparkStatus}
        activeDatanodes={metrics.activeDatanodes}
        onTriggerSpark={() => triggerSparkJob(toast)}
      />

      {/* Executive KPI Stats */}
      <ExecutiveKpiStats 
        totalDurationSec={metrics.totalDurationSec} 
        energySaved={metrics.energySaved}
        financialSaved={metrics.financialSaved}
        co2Prevented={metrics.co2Prevented}
        totalAiActions={metrics.totalAiActions}
      />

      {/* Premium Milestones & Ranking Panels */}
      <ExecutivePremiumPanels
        liveLoad={metrics.liveLoad} 
        energySaved={metrics.energySaved}
        financialSaved={metrics.financialSaved}
        co2Prevented={metrics.co2Prevented}
        sparkLeaderboard={metrics.sparkLeaderboard}
        activeNodes={metrics.activeNodes}
        managedRelays={metrics.managedRelays}
      />
    </div>
  )
}
