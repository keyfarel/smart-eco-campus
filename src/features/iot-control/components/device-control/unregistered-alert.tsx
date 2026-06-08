import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

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
    <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-lg p-3 mb-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 shadow-[0_0_15px_rgba(16,185,129,0.05)] animate-[pulse_3s_ease-in-out_infinite]">
      <div className="min-w-0 flex-1 w-full">
        <h3 className="text-xs font-bold text-foreground flex items-center gap-1.5">
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
              <span className="hidden md:inline">online di jaringan kampus. Petakan sekarang untuk mengaktifkan pemantauan.</span>
              <span className="md:hidden">menunggu registrasi.</span>
            </p>
          ) : (
            <div className="mt-2">
              <p className="text-xs text-muted-foreground">
                <span className="hidden md:inline">Sistem mendeteksi {unregisteredList.length} perangkat online. Klik salah satu MAC Address di bawah untuk mulai memetakan perangkat tersebut:</span>
                <span className="md:hidden">{unregisteredList.length} perangkat online. Pilih untuk daftar:</span>
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
