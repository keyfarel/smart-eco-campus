"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { HelpCircle, BarChart3, ExternalLink } from "lucide-react"

export function MethodologyDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="bg-zinc-900 border-zinc-800 hover:bg-zinc-800 gap-2 h-9 font-medium shadow-sm transition-all hover:border-emerald-500/50 text-foreground">
          <HelpCircle className="w-4 h-4 text-emerald-500" />
          <span>Methodology</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-zinc-950 border-zinc-800 text-foreground max-w-2xl max-h-[80vh] overflow-y-auto shadow-2xl shadow-emerald-500/20">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
              <BarChart3 className="w-5 h-5 text-emerald-500" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold text-foreground">Analytics Methodology</DialogTitle>
              <DialogDescription className="text-zinc-500 text-sm font-mono mt-1 uppercase tracking-tight">Scientific basis for smart campus metrics</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 mt-6 border-t border-zinc-800 pt-6">
          <section className="space-y-3">
            <h4 className="text-[10px] font-bold text-emerald-500 uppercase tracking-[0.2em]">1. Peak Energy Load</h4>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Beban puncak (Peak Load) adalah nilai <strong>Watt tertinggi</strong> yang terekam oleh sensor PZEM dalam rentang waktu yang dipilih. Mencerminkan kapasitas maksimal daya yang dibutuhkan.
            </p>
            <div className="bg-zinc-900 p-4 rounded-xl border border-zinc-800 font-mono text-xs text-emerald-400 shadow-inner">
              Peak = Max(Sensor_Reading_Interval)
            </div>
          </section>

          <Separator className="bg-zinc-800" />

          <section className="space-y-3">
            <h4 className="text-[10px] font-bold text-emerald-500 uppercase tracking-[0.2em]">2. Estimated Energy Cost</h4>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Estimasi biaya operasional berdasarkan total konsumsi energi dikalikan dengan tarif dasar listrik (TDL) resmi dari <strong>PLN Indonesia</strong> untuk golongan R-1/TR.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="bg-zinc-900 p-3 rounded-xl border border-zinc-800 font-mono text-[10px] text-zinc-300">
                <span className="text-zinc-500 block mb-1">PLN Average Tariff</span>
                Rp 1.444,70 / kWh
              </div>
              <div className="bg-zinc-900 p-3 rounded-xl border border-zinc-800 font-mono text-[10px] text-zinc-300">
                <span className="text-zinc-500 block mb-1">Calculation Formula</span>
                Total KWH * TDL
              </div>
            </div>
          </section>

          <div className="bg-emerald-500/5 p-4 rounded-xl border border-emerald-500/10 text-[11px] text-zinc-400 leading-relaxed italic">
            * Sumber Data: Peraturan Menteri ESDM No. 28 Tahun 2016 tentang Tarif Tenaga Listrik yang Disediakan oleh PT PLN (Persero).
          </div>

          <div className="flex gap-4 text-[10px] text-zinc-500 pt-2">
            <div className="flex items-center gap-1.5 hover:text-emerald-500 cursor-pointer transition-colors group">
              <ExternalLink className="w-3 h-3 group-hover:scale-110 transition-transform" /> PLN Tariff Guide
            </div>
            <div className="flex items-center gap-1.5 hover:text-emerald-500 cursor-pointer transition-colors group">
              <ExternalLink className="w-3 h-3 group-hover:scale-110 transition-transform" /> ESDM Regulation
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
