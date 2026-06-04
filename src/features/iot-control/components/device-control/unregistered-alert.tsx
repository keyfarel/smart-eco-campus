import { Button } from "@/components/ui/button"
import { Cpu, ArrowRight } from "lucide-react"

interface UnregisteredAlertProps {
  unregisteredList: string[]
  onStartRegister: (mac: string) => void
}

export function UnregisteredAlert({
  unregisteredList,
  onStartRegister,
}: UnregisteredAlertProps) {
  if (unregisteredList.length === 0) return null

  const isMultiple = unregisteredList.length > 1

  return (
    <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-lg p-3.5 mb-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-[0_0_15px_rgba(16,185,129,0.05)] animate-pulse">
      <div className="flex items-start gap-3 min-w-0 flex-1">
        <div className="w-8.5 h-8.5 rounded bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0 mt-0.5">
          <Cpu className="w-4.5 h-4.5 text-emerald-400" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-xs font-bold text-foreground flex items-center gap-1.5">
            <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-450 animate-ping"></span>
            <span>Perangkat IoT Baru Terdeteksi!</span>
            <span className="text-[10px] bg-emerald-500/15 text-emerald-400 px-1.5 py-0.5 rounded font-mono font-bold ml-1 border border-emerald-500/10">
              +{unregisteredList.length} Device
            </span>
          </h3>
          
          {!isMultiple ? (
            <p className="text-xs text-muted-foreground mt-1 flex flex-wrap items-center gap-1.5">
              MAC Address:{" "}
              <span className="font-mono font-bold text-emerald-400 bg-zinc-950 border border-zinc-800 px-1.5 py-0.5 rounded text-[10px]">
                {unregisteredList[0]}
              </span>{" "}
              online di jaringan kampus. Petakan sekarang untuk mengaktifkan pemantauan.
            </p>
          ) : (
            <div className="mt-2">
              <p className="text-xs text-muted-foreground">
                Sistem mendeteksi {unregisteredList.length} perangkat online. Klik salah satu MAC Address di bawah untuk mulai memetakan perangkat tersebut:
              </p>
              <div className="flex flex-wrap gap-2 mt-2.5">
                {unregisteredList.map((mac) => (
                  <button
                    key={mac}
                    onClick={() => onStartRegister(mac)}
                    className="font-mono font-bold text-emerald-400 hover:text-zinc-955 bg-zinc-950 hover:bg-emerald-400 border border-zinc-800 hover:border-emerald-500 px-2.5 py-1 rounded text-[10px] flex items-center gap-1.5 transition-all cursor-pointer group/badge shadow-sm"
                    title={`Daftarkan perangkat ${mac}`}
                  >
                    <span>{mac}</span>
                    <ArrowRight className="w-2.5 h-2.5 opacity-60 group-hover/badge:opacity-100 transition-opacity" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {!isMultiple && (
        <Button
          onClick={() => onStartRegister(unregisteredList[0])}
          className="bg-emerald-500 hover:bg-emerald-600 text-zinc-955 font-bold px-3 py-1.5 h-8 text-xs rounded shadow-[0_0_10px_rgba(16,185,129,0.2)] flex items-center gap-1 shrink-0 w-full md:w-auto justify-center cursor-pointer"
        >
          <span>Daftarkan</span>
          <ArrowRight className="w-3 h-3" />
        </Button>
      )}
    </div>
  )
}
