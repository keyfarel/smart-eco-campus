import { Button } from "@/components/ui/button"
import { Database, Loader2 } from "lucide-react"

interface ExecutiveHeaderProps {
  isSparkRunning: boolean
  isClusterOffline: boolean
  lastUpdated: string
  sparkStatus: {
    is_running: boolean
    step: number
    total_steps: number
    message: string
  } | undefined
  activeDatanodes: number
  onTriggerSpark: () => void
}

export function ExecutiveHeader({
  isSparkRunning,
  isClusterOffline,
  lastUpdated,
  sparkStatus,
  activeDatanodes,
  onTriggerSpark
}: ExecutiveHeaderProps) {
  const isRunning = isSparkRunning || sparkStatus?.is_running

  return (
    <>
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
              onClick={onTriggerSpark} 
              disabled={isRunning}
              className="bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/20 w-full sm:w-auto"
            >
              {isRunning ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Database className="w-4 h-4 mr-2" />
              )}
              {isRunning ? "Menghitung Big Data..." : "Hitung Ulang (Spark ETL)"}
            </Button>
            {lastUpdated && (
              <p className="text-[10px] text-emerald-500 font-mono opacity-80 text-center sm:text-right w-full mt-1 sm:mt-0">
                Terakhir diperbarui: {lastUpdated}
              </p>
            )}
          </div>
        </div>
        
        {/* Live Spark Progress Bar */}
        {isRunning && sparkStatus && sparkStatus.step > 0 && (
          <div className="flex flex-col gap-2 mt-4 p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5">
            <div className="flex justify-between text-xs text-emerald-500 font-mono">
              <span>{sparkStatus.message}</span>
              <span>[{sparkStatus.step}/{sparkStatus.total_steps}]</span>
            </div>
            <div className="h-1.5 w-full bg-emerald-500/10 rounded-full overflow-hidden">
              <div 
                className="h-full bg-emerald-500 transition-all duration-300 ease-out" 
                style={{ width: `${(sparkStatus.step / sparkStatus.total_steps) * 100}%` }}
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
          ) : activeDatanodes > 0 ? (
            <span className="text-emerald-400">{activeDatanodes} DataNode(s) Active & Processing</span>
          ) : (
            <span className="text-amber-400">0 DataNodes (Running in NameNode Local Fallback Mode)</span>
          )}
        </div>
      </div>
    </>
  )
}
