"use client"

import { useState, useEffect } from "react"
import { RegisteredDevice } from "../../types/device-registration"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Wifi, Plus, Trash2, Pencil, Loader2 } from "lucide-react"
import { rtdb } from "@/lib/firebase"
import { ref, onValue, set, off } from "firebase/database"
import { toast } from "sonner"

interface WifiManagementDialogProps {
  device: RegisteredDevice | null
  isOpen: boolean
  onClose: () => void
}

interface WifiSlot {
  ssid: string
}

export function WifiManagementDialog({ device, isOpen, onClose }: WifiManagementDialogProps) {
  const [slots, setSlots] = useState<(WifiSlot | null)[]>([null, null, null, null, null])
  const [loading, setLoading] = useState(true)
  const [editingSlot, setEditingSlot] = useState<number | null>(null)
  
  const [ssid, setSsid] = useState("")
  const [password, setPassword] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activeCommand, setActiveCommand] = useState<any>(null)

  useEffect(() => {
    if (!device || !isOpen || !rtdb) return

    setLoading(true)
    const slotsRef = ref(rtdb, `/nodes/${device.macAddress}/wifi_slots`)
    const commandRef = ref(rtdb, `/nodes/${device.macAddress}/wifi_command`)

    const unsubSlots = onValue(slotsRef, (snapshot) => {
      const data = snapshot.val()
      const newSlots: (WifiSlot | null)[] = [null, null, null, null, null]
      if (data && Array.isArray(data)) {
        for (let i = 0; i < 5; i++) {
          newSlots[i] = data[i] || null
        }
      } else if (data && typeof data === 'object') {
        for (let i = 0; i < 5; i++) {
          newSlots[i] = (data as any)[i] || null
        }
      }
      setSlots(newSlots)
      setLoading(false)
    })

    const unsubCommand = onValue(commandRef, (snapshot) => {
       setActiveCommand(snapshot.val())
    })

    return () => {
      off(slotsRef, 'value', unsubSlots)
      off(commandRef, 'value', unsubCommand)
    }
  }, [device, isOpen])

  const handleAction = async (action: "ADD" | "EDIT" | "DELETE", slot: number) => {
    if (!device || !rtdb) return
    if (activeCommand) {
        toast.warning("Terdapat perintah WiFi yang sedang diproses oleh ESP32. Tunggu sebentar.")
        return
    }

    if ((action === "ADD" || action === "EDIT") && !ssid.trim()) {
      toast.error("SSID tidak boleh kosong")
      return
    }

    setIsSubmitting(true)
    try {
      const commandRef = ref(rtdb, `/nodes/${device.macAddress}/wifi_command`)
      const payload = {
        action,
        slot,
        ssid: ssid.trim(),
        password: password.trim(),
        timestamp: Date.now()
      }
      await set(commandRef, payload)
      
      toast.success(`Perintah ${action} WiFi untuk Slot ${slot} terkirim.`)
      setEditingSlot(null)
      setSsid("")
      setPassword("")
    } catch (error) {
      console.error(error)
      toast.error("Gagal mengirim perintah ke perangkat")
    } finally {
      setIsSubmitting(false)
    }
  }

  const startEdit = (slot: number, currentSsid: string = "") => {
    setEditingSlot(slot)
    setSsid(currentSsid)
    setPassword("")
  }

  const cancelEdit = () => {
    setEditingSlot(null)
    setSsid("")
    setPassword("")
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-zinc-900 border-zinc-800 text-foreground max-w-md p-6 overflow-hidden">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-lg flex items-center gap-2 font-bold text-zinc-200">
            <Wifi className="w-5 h-5 text-amber-500" />
            <span>Manajemen Jaringan (NVS)</span>
          </DialogTitle>
          <DialogDescription className="text-xs text-zinc-500">
            Kelola daftar WiFi di memori ESP32 {device?.macAddress}. Perangkat akan restart saat menerima perintah.
          </DialogDescription>
        </DialogHeader>

        {activeCommand && (
           <div className="bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[11px] p-3 rounded-md flex items-start gap-2 mb-4 animate-pulse">
               <Loader2 className="w-4 h-4 animate-spin shrink-0" />
               <p>ESP32 sedang memproses perintah <b>{activeCommand.action}</b> pada Slot {activeCommand.slot}. Harap tunggu sampai kotak ini hilang...</p>
           </div>
        )}

        <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-zinc-800">
          {loading ? (
             <div className="py-8 flex justify-center">
                 <Loader2 className="w-6 h-6 animate-spin text-zinc-500" />
             </div>
          ) : (
            slots.map((slotData, idx) => {
              const isEditing = editingSlot === idx

              if (isEditing) {
                return (
                  <div key={idx} className="bg-zinc-955 border border-amber-500/30 p-3 rounded-lg space-y-3 shadow-[0_0_15px_rgba(245,158,11,0.05)]">
                     <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-zinc-300">Slot {idx}</span>
                        <span className="text-[10px] text-amber-500 font-mono bg-amber-500/10 px-2 py-0.5 rounded">EDITING</span>
                     </div>
                     <div className="space-y-2">
                         <div className="space-y-1">
                             <Label className="text-[10px] text-zinc-500">SSID (Nama WiFi)</Label>
                             <Input 
                                value={ssid} 
                                onChange={(e) => setSsid(e.target.value)} 
                                className="h-8 bg-zinc-900 border-zinc-800 text-xs text-zinc-300 focus-visible:ring-amber-500 focus-visible:border-amber-500" 
                                placeholder="Masukkan SSID..."
                                disabled={isSubmitting}
                             />
                         </div>
                         <div className="space-y-1">
                             <Label className="text-[10px] text-zinc-500">Password</Label>
                             <Input 
                                type="password"
                                value={password} 
                                onChange={(e) => setPassword(e.target.value)} 
                                className="h-8 bg-zinc-900 border-zinc-800 text-xs text-zinc-300 focus-visible:ring-amber-500 focus-visible:border-amber-500" 
                                placeholder="Biarkan kosong jika jaringan terbuka"
                                disabled={isSubmitting}
                             />
                         </div>
                     </div>
                     <div className="flex items-center justify-end gap-2 pt-2">
                        <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={cancelEdit}
                            disabled={isSubmitting}
                            className="h-7 text-[10px] bg-transparent border-zinc-700 text-zinc-400 hover:text-zinc-300"
                        >Batal</Button>
                        <Button 
                            size="sm" 
                            onClick={() => handleAction(slotData ? "EDIT" : "ADD", idx)}
                            disabled={isSubmitting || !ssid.trim()}
                            className="h-7 text-[10px] bg-amber-500 hover:bg-amber-600 text-zinc-950 font-bold"
                        >
                            {isSubmitting ? <Loader2 className="w-3 h-3 animate-spin" /> : (slotData ? "Simpan Perubahan" : "Simpan Baru")}
                        </Button>
                     </div>
                  </div>
                )
              }

              return (
                <div key={idx} className="bg-zinc-900 border border-zinc-800 p-3 rounded-lg flex items-center justify-between group hover:border-zinc-700 transition-colors">
                  <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded bg-zinc-955 border border-zinc-800 flex items-center justify-center text-[10px] font-mono text-zinc-500 font-bold">
                          {idx}
                      </div>
                      <div className="flex flex-col">
                          {slotData ? (
                              <span className="text-sm font-bold text-zinc-200">{slotData.ssid}</span>
                          ) : (
                              <span className="text-sm text-zinc-600 italic">Slot Kosong</span>
                          )}
                      </div>
                  </div>
                  
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {slotData ? (
                          <>
                            <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-7 w-7 text-zinc-400 hover:text-amber-400 hover:bg-amber-400/10"
                                onClick={() => startEdit(idx, slotData.ssid)}
                                disabled={!!activeCommand}
                            >
                                <Pencil className="w-3 h-3" />
                            </Button>
                            <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-7 w-7 text-zinc-400 hover:text-red-400 hover:bg-red-400/10"
                                onClick={() => handleAction("DELETE", idx)}
                                disabled={!!activeCommand || isSubmitting}
                            >
                                {isSubmitting && editingSlot === idx ? <Loader2 className="w-3 h-3 animate-spin" /> : <Trash2 className="w-3 h-3" />}
                            </Button>
                          </>
                      ) : (
                          <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-7 text-[10px] text-amber-500 hover:text-amber-400 hover:bg-amber-500/10 font-medium"
                              onClick={() => startEdit(idx)}
                              disabled={!!activeCommand}
                          >
                              <Plus className="w-3 h-3 mr-1" /> Tambah
                          </Button>
                      )}
                  </div>
                </div>
              )
            })
          )}
        </div>

      </DialogContent>
    </Dialog>
  )
}
