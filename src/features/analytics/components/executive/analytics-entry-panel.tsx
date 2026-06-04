import { Card, CardContent } from "@/components/ui/card"
import { BarChart3, ArrowRight } from "lucide-react"
import Link from "next/link"

export function AnalyticsEntryPanel() {
  return (
    <Card className="bg-zinc-900 border-zinc-800 overflow-hidden relative hover:border-emerald-500/20 transition-all duration-300">
      {/* Subtle grid pattern background */}
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(rgba(16, 185, 129, 0.4) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(16, 185, 129, 0.4) 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />
      <div className="absolute top-1/2 left-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      <CardContent className="relative z-10 p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-500 shrink-0 shadow-lg shadow-emerald-500/5">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-foreground">Financial & Efficiency Analytics</h4>
            <p className="text-xs text-zinc-400 mt-1 max-w-xl leading-relaxed">
              Analisis periodik kluster Hadoop MapReduce untuk mendeteksi inefisiensi kelistrikan, memantau pencegahan kerugian anggaran, dan estimasi finansial jangka panjang.
            </p>
          </div>
        </div>
        <Link 
          href="/executive/analytics" 
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-zinc-950 text-xs font-bold transition-all shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/20 group shrink-0 whitespace-nowrap"
        >
          <span>Buka Analitik</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </CardContent>
    </Card>
  )
}
