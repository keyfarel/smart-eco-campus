"use client"

import { useState, useEffect } from "react"

import { ShieldAlert, Award, Database, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { useExecutiveMetrics } from "../hooks/use-executive-metrics"
import { ExecutiveKpiStats } from "../components/executive/executive-kpi-stats"
import { ExecutivePremiumPanels } from "../components/executive/executive-premium-panels"
import { AnalyticsEntryPanel } from "../components/executive/analytics-entry-panel"

export function ExecutiveView() {
  const metrics = useExecutiveMetrics()
  const [isSparkRunning, setIsSparkRunning] = useState(false)
  const [isClusterOffline, setIsClusterOffline] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<string>("")

  // Update timestamp when metrics change or Spark finishes
  useEffect(() => {
    setIsClusterOffline(false) // Auto-recover from offline state when realtime data flows
    setLastUpdated(new Date().toLocaleString('id-ID', {
      day: 'numeric', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit', second: '2-digit'
    }))
  }, [metrics.energySaved, metrics.sparkStatus?.is_running, metrics.activeDatanodes])

  const triggerSparkJob = async () => {
    setIsSparkRunning(true)
    setIsClusterOffline(false)
    toast.info("Menginisialisasi Apache Spark Cluster...")
    
    try {
      const res = await fetch("/api/cron/trigger-spark", { method: "POST" })
      const data = await res.json()
      
      if (res.ok) {
        setIsClusterOffline(false)
        toast.success("Big Data berhasil dihitung ulang! Dashboard ter-update.")
      } else {
        setIsClusterOffline(true)
        toast.error(`Gagal menjalankan Spark: ${data.error}`)
      }
    } catch (error) {
      setIsClusterOffline(true)
      toast.error("Terjadi kesalahan koneksi! NameNode (Laptop) mungkin offline atau Tailscale terputus.")
    } finally {
      setIsSparkRunning(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="flex flex-col gap-0.5 sm:gap-1">
            <h1 className="text-lg sm:text-2xl font-bold text-foreground leading-tight">Macro Campus Summary</h1>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Ringkasan efisiensi finansial dan energi kampus.
            </p>
          </div>
          
          <div className="flex flex-col sm:items-end gap-2 shrink-0">
            <Button 
              onClick={triggerSparkJob} 
              disabled={isSparkRunning || metrics.sparkStatus?.is_running}
              className="bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/20 w-full sm:w-auto"
            >
              {(isSparkRunning || metrics.sparkStatus?.is_running) ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Database className="w-4 h-4 mr-2" />
              )}
              {(isSparkRunning || metrics.sparkStatus?.is_running) ? "Menghitung Big Data..." : "Hitung Ulang (Spark ETL)"}
            </Button>
            {lastUpdated && (
              <p className="text-[10px] text-emerald-500 font-mono opacity-80 text-center sm:text-right w-full mt-1 sm:mt-0">
                Terakhir diperbarui: {lastUpdated}
              </p>
            )}
          </div>
        </div>
        
        {/* Live Spark Progress Bar */}
        {(isSparkRunning || metrics.sparkStatus?.is_running) && metrics.sparkStatus?.step > 0 && (
          <div className="flex flex-col gap-2 mt-4 p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5">
            <div className="flex justify-between text-xs text-emerald-500 font-mono">
              <span>{metrics.sparkStatus.message}</span>
              <span>[{metrics.sparkStatus.step}/{metrics.sparkStatus.total_steps}]</span>
            </div>
            <div className="h-1.5 w-full bg-emerald-500/10 rounded-full overflow-hidden">
              <div 
                className="h-full bg-emerald-500 transition-all duration-300 ease-out" 
                style={{ width: `${(metrics.sparkStatus.step / metrics.sparkStatus.total_steps) * 100}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Cluster Status Banner */}
      <div className={`flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 p-3 sm:p-4 rounded-xl border text-xs ${isClusterOffline ? 'border-red-500/20 bg-red-500/10 text-red-400' : 'border-blue-500/10 bg-blue-500/5 text-blue-400'}`}>
        <div className="flex items-center gap-2 shrink-0">
          <Database className={`w-4 h-4 shrink-0 ${isClusterOffline ? 'text-red-500' : 'text-blue-500'}`} />
          <strong>Hadoop Cluster Status:</strong>
        </div>
        <div className="flex-1">
          {isClusterOffline ? (
            <span className="text-red-500 font-bold">NAMENODE OFFLINE / UNREACHABLE</span>
          ) : metrics.activeDatanodes > 0 ? (
            <span className="text-emerald-400">{metrics.activeDatanodes} DataNode(s) Active & Processing</span>
          ) : (
            <span className="text-amber-400">0 DataNodes (Running in NameNode Local Fallback Mode)</span>
          )}
        </div>
      </div>



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
