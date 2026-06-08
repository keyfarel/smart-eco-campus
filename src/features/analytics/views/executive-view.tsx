"use client"

import { useState } from "react"

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

  const triggerSparkJob = async () => {
    setIsSparkRunning(true)
    toast.info("Menginisialisasi Apache Spark Cluster...")
    
    try {
      const res = await fetch("/api/cron/trigger-spark", { method: "POST" })
      const data = await res.json()
      
      if (res.ok) {
        toast.success("Big Data berhasil dihitung ulang! Dashboard ter-update.")
      } else {
        toast.error(`Gagal menjalankan Spark: ${data.error}`)
      }
    } catch (error) {
      toast.error("Terjadi kesalahan jaringan saat memicu Spark.")
    } finally {
      setIsSparkRunning(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <Award className="w-5 h-5 text-emerald-500" />
          <span className="text-xs font-mono font-bold tracking-wider text-emerald-500 uppercase">Executive Dashboard</span>
        </div>
        <div className="flex items-start justify-between">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-bold text-foreground">Macro Campus Summary</h1>
            <p className="text-sm text-muted-foreground">
              High-level insights into financial efficiency, carbon footprint reduction, and energy trends
            </p>
          </div>
          
          <Button 
            onClick={triggerSparkJob} 
            disabled={isSparkRunning || metrics.sparkStatus?.is_running}
            className="bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/20"
          >
            {(isSparkRunning || metrics.sparkStatus?.is_running) ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Database className="w-4 h-4 mr-2" />
            )}
            {(isSparkRunning || metrics.sparkStatus?.is_running) ? "Menghitung Big Data..." : "Hitung Ulang (Spark ETL)"}
          </Button>
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
        sparkLeaderboard={metrics.sparkLeaderboard}
        totalRooms={metrics.totalRooms}
        automatedRooms={metrics.automatedRooms}
      />

      {/* Analytics Entry Panel */}
      <AnalyticsEntryPanel />
    </div>
  )
}
