"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useDeviceRegistration } from "../../hooks/use-device-registration"
import { useBuildings } from "@/features/building-management"
import { UnregisteredAlert } from "./unregistered-alert"
import { DeviceRegistrationForm } from "./device-registration-form"
import { RegisteredDevicesList } from "./registered-devices-list"
import { WifiManagementDialog } from "./wifi-management-dialog"
import { Cpu, ShieldAlert, Zap, Network, PlusCircle, Eye, Pencil, Trash2, Calendar, DoorOpen, Users, Building2, Layers, CheckCircle2, AlertCircle, Loader2 } from "lucide-react"
import { rtdb } from "@/lib/firebase"
import { ref, update } from "firebase/database"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { RegisteredDevice } from "../../types/device-registration"
import { toast } from "sonner"

interface DeviceRegistrationTabProps {
  hideMetrics?: boolean
}

export function DeviceRegistrationTab({ hideMetrics = false }: DeviceRegistrationTabProps = {}) {
  const { data: session } = useSession()
  const userRole = session?.user?.role || "ADMIN_GEDUNG"
  const assignedGedung = session?.user?.assignedGedung || ""
  const isBuildingAdmin = userRole === "ADMIN_GEDUNG"

  const {
    unregisteredList,
    registeredList,
    loading,
    macAddress,
    setMacAddress,
    buildingId,
    setBuildingId,
    floorId,
    setFloorId,
    roomName,
    setRoomName,
    capacity,
    setCapacity,
    isSubmitting,
    handleRegisterDevice,
    handleStartRegistration,
    handleDeleteRegistration,
  } = useDeviceRegistration()

  // Master buildings list for edit lookup
  const { buildingsList } = useBuildings()

  // State Dialog Registrasi Baru
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  // State Dialog Inspeksi Detail
  const [viewedDevice, setViewedDevice] = useState<RegisteredDevice | null>(null)

  // State Dialog Edit Topologi
  const [editedDevice, setEditedDevice] = useState<RegisteredDevice | null>(null)

  // State Dialog WiFi
  const [wifiManagedDevice, setWifiManagedDevice] = useState<RegisteredDevice | null>(null)

  // States for Edit Form
  const [editBuildingId, setEditBuildingId] = useState("")
  const [editFloorId, setEditFloorId] = useState("")
  const [editRoomName, setEditRoomName] = useState("")
  const [editCapacity, setEditCapacity] = useState("")
  const [editSubmitting, setEditSubmitting] = useState(false)

  // Dynamic Edit topographies lookup
  const editSelectedBuilding = buildingsList.find((b) => b.id === editBuildingId)
  const editMaxFloors = editSelectedBuilding ? editSelectedBuilding.floorsCount : 1
  const editFloorRooms = editSelectedBuilding
    ? (editSelectedBuilding.rooms || []).filter((r) => {
      const roomFloorStr = r.floor.toString()
      const selectedFloorNum = editFloorId.replace("lantai_", "")
      return roomFloorStr === selectedFloorNum
    })
    : []

  // Initialize edit fields
  const handleTriggerEdit = (device: RegisteredDevice) => {
    setEditedDevice(device)
    setEditBuildingId(isBuildingAdmin ? assignedGedung : device.buildingId)
    setEditFloorId(device.floorId)
    setEditRoomName(device.roomName)
    setEditCapacity(device.capacity.toString())
  }

  // Save changes to device topography map (Firebase RTDB)
  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editedDevice || !rtdb) return

    setEditSubmitting(true)

    try {
      const selectedBuildingObj = buildingsList.find((b) => b.id === editBuildingId)
      const buildingName = selectedBuildingObj ? selectedBuildingObj.name : "Gedung Kampus"

      const updates: Record<string, any> = {}
      updates[`/nodes/${editedDevice.macAddress}/gedung_id`] = editBuildingId
      updates[`/nodes/${editedDevice.macAddress}/gedung_name`] = buildingName
      updates[`/nodes/${editedDevice.macAddress}/lantai_id`] = editFloorId
      updates[`/nodes/${editedDevice.macAddress}/display_name`] = editRoomName
      updates[`/nodes/${editedDevice.macAddress}/capacity`] = parseInt(editCapacity, 10) || editedDevice.capacity
      updates[`/nodes/${editedDevice.macAddress}/is_registered`] = true

      await update(ref(rtdb), updates)

      setEditedDevice(null)
      toast.success(`Topologi perangkat ${editedDevice.macAddress} sukses diperbarui!`)
    } catch (error) {
      console.error("[DeviceRegistrationTab] Edit failed:", error)
      toast.error("Gagal memperbarui topologi perangkat.")
    } finally {
      setEditSubmitting(false)
    }
  }

  // Intercept alert registration button
  const handleStartRegisterWrapper = (mac: string) => {
    handleStartRegistration(mac)
    setIsDialogOpen(true)
  }

  const activeList = registeredList;

  return (
    <div className="space-y-6">
      {/* DIALOG REGISTRASI (DIPANGGIL DARI AUTO-DISCOVERY ALERTS) */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-zinc-900 border-zinc-800 text-foreground max-w-md p-6 overflow-hidden">
          <DialogHeader className="mb-4">
            <DialogTitle className="text-lg flex items-center gap-2 font-bold text-zinc-200">
              <Cpu className="w-5 h-5 text-emerald-500" />
              <span>Registrasi Perangkat IoT</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-zinc-500">
              Mendaftarkan identitas hardware ke topologi fisik ruangan.
            </DialogDescription>
          </DialogHeader>
          <DeviceRegistrationForm
            macAddress={macAddress}
            onMacAddressChange={setMacAddress}
            buildingId={buildingId}
            onBuildingIdChange={setBuildingId}
            floorId={floorId}
            onFloorIdChange={setFloorId}
            roomName={roomName}
            onRoomNameChange={setRoomName}
            capacity={capacity}
            onCapacityChange={setCapacity}
            isSubmitting={isSubmitting}
            onSubmit={async (e, bName) => {
              const success = await handleRegisterDevice(e, bName)
              if (success) {
                setIsDialogOpen(false)
              }
            }}
          />
        </DialogContent>
      </Dialog>

      {/* 🔔 AUTO-DISCOVERY ALERTS BANNER */}
      {isBuildingAdmin && (
        <UnregisteredAlert
          unregisteredList={unregisteredList}
          onStartRegister={handleStartRegisterWrapper}
        />
      )}
      
      {/* 📊 ROW KARTU METRIK RINGKASAN PERANGKAT */}
      {!hideMetrics && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Card 1: Total IoT Devices */}
          <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl flex items-center justify-between hover:border-zinc-750 hover:shadow-[0_4px_20px_rgba(0,0,0,0.15)] transition-all">
            <div className="space-y-1">
              <span className="text-xs text-zinc-400 font-semibold tracking-wide">Total Registered IoT</span>
              <h3 className="text-2xl font-extrabold font-mono text-zinc-100">{activeList.length}</h3>
              <p className="text-[10px] text-zinc-500">Active ESP32 controller nodes</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500">
              <Cpu className="w-6 h-6 animate-pulse" />
            </div>
          </div>

          {/* Card 2: Discovery Alerts */}
          <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl flex items-center justify-between hover:border-zinc-750 hover:shadow-[0_4px_20px_rgba(0,0,0,0.15)] transition-all">
            <div className="space-y-1">
              <span className="text-xs text-zinc-400 font-semibold tracking-wide">Auto-Discovery Alerts</span>
              <h3 className="text-2xl font-extrabold font-mono text-zinc-100">{unregisteredList.length}</h3>
              <p className="text-[10px] text-zinc-500">Devices pending mapping</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500">
              <ShieldAlert className="w-6 h-6" />
            </div>
          </div>

          {/* Card 3: Revocation & Audit */}
          <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl flex items-center justify-between hover:border-zinc-750 hover:shadow-[0_4px_20px_rgba(0,0,0,0.15)] transition-all">
            <div className="space-y-1">
              <span className="text-xs text-zinc-400 font-semibold tracking-wide">Critical Alerts</span>
              <h3 className="text-2xl font-extrabold font-mono text-red-500">0</h3>
              <p className="text-[10px] text-zinc-500">Devices requiring audit/revocation</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">
              <ShieldAlert className="w-6 h-6" />
            </div>
          </div>
        </div>
      )}

      {/* 📋 TABLE INVENTARIS SELEBAR 100% FULL-WIDTH */}
      <div className="w-full">
        <RegisteredDevicesList
          loading={loading}
          registeredList={isBuildingAdmin ? activeList.filter(d => d.buildingId === assignedGedung) : activeList}
          onDelete={handleDeleteRegistration}
          onView={setViewedDevice}
          onEdit={handleTriggerEdit}
          onManageWifi={setWifiManagedDevice}
        />
      </div>

      <WifiManagementDialog
        device={wifiManagedDevice}
        isOpen={wifiManagedDevice !== null}
        onClose={() => setWifiManagedDevice(null)}
      />

      {/* 👁️ DIALOG A: VIEW TELEMETRY DETAILS */}
      <Dialog open={viewedDevice !== null} onOpenChange={(open) => !open && setViewedDevice(null)}>
        <DialogContent className="bg-zinc-900 border-zinc-800 text-foreground max-w-lg p-0 overflow-hidden">
          <div className="p-6 pb-4 border-b border-zinc-850 bg-zinc-900">
            <DialogHeader>
              <DialogTitle className="text-lg flex items-center gap-2">
                <Eye className="w-5 h-5 text-emerald-550" />
                <span>IoT Hardware Telemetry Inspection</span>
              </DialogTitle>
              <DialogDescription>
                Real-time active diagnostic telemetries and streaming video sync of ESP32 chip nodes.
              </DialogDescription>
            </DialogHeader>
          </div>

          {viewedDevice && (
            <div className="p-6 pt-4 pb-4 space-y-5 max-h-[60vh] overflow-y-auto pr-3 scrollbar-thin scrollbar-thumb-zinc-850 scrollbar-track-transparent">
              <div className="relative aspect-video w-full rounded-lg bg-zinc-950 border border-zinc-850 overflow-hidden flex flex-col items-center justify-center select-none group/stream">
                <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 px-2.5 py-1 rounded bg-black/60 backdrop-blur-md border border-zinc-800 text-[10px] font-bold text-zinc-300">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  <span>LIVE CAM STREAM [SIMULATED]</span>
                </div>
                <div className="absolute top-3 right-3 z-10 flex items-center px-2 py-0.5 rounded bg-zinc-900/80 backdrop-blur-md text-[9px] font-mono text-zinc-455 border border-zinc-850">
                  {viewedDevice.macAddress}
                </div>

                <div className="flex flex-col items-center justify-center text-center p-4">
                  <Network className="w-12 h-12 text-zinc-700 animate-pulse mb-3" />
                  <p className="text-xs text-zinc-400 font-semibold tracking-wide font-mono uppercase">Feed: {viewedDevice.roomName}</p>
                  <p className="text-[10px] text-zinc-555 font-mono mt-0.5">{viewedDevice.cameraStreamUrl}</p>
                  <p className="text-[10px] text-emerald-500 font-medium font-mono mt-3 px-3 py-1 rounded bg-emerald-500/5 border border-emerald-500/10 animate-pulse">
                    RECEIVING FRAME BUFFER (30 FPS)
                  </p>
                </div>
              </div>

              <div className="space-y-1.5">
                <h4 className="text-[10px] font-bold text-zinc-555 uppercase tracking-widest">Hardware Specifications</h4>
                <div className="grid grid-cols-2 gap-3 bg-zinc-955 border border-zinc-850 p-4 rounded-lg">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[10px] text-zinc-500 font-medium">Physical MAC Address</span>
                    <span className="text-xs text-zinc-200 font-mono font-bold">{viewedDevice.macAddress}</span>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[10px] text-zinc-500 font-medium">Chipset Model</span>
                    <span className="text-xs text-zinc-300 font-mono">ESP32-WROOM-32E (4MB Flash)</span>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[10px] text-zinc-500 font-medium">WiFi Signal (RSSI)</span>
                    <span className="text-xs text-emerald-400 font-mono font-bold">-64 dBm (Excellent)</span>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[10px] text-zinc-500 font-medium">Intranet Gateway IP</span>
                    <span className="text-xs text-zinc-300 font-mono">192.168.1.XX</span>
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <h4 className="text-[10px] font-bold text-zinc-555 uppercase tracking-widest">Zone Mapping & Capacity</h4>
                <div className="grid grid-cols-2 gap-3 bg-zinc-955 border border-zinc-850 p-4 rounded-lg">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[10px] text-zinc-500 font-medium">Classroom Name</span>
                    <span className="text-xs text-zinc-200 font-medium">{viewedDevice.roomName}</span>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[10px] text-zinc-500 font-medium">Building Placement</span>
                    <span className="text-xs text-zinc-300">{viewedDevice.buildingName}</span>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[10px] text-zinc-500 font-medium">Classroom Capacity</span>
                    <span className="text-xs text-zinc-300 font-mono">{viewedDevice.capacity} Students</span>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[10px] text-zinc-500 font-medium">Assigned Floor</span>
                    <span className="text-xs text-zinc-300 capitalize">{viewedDevice.floorId.replace("_", " ")}</span>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-zinc-955 border border-zinc-850 rounded-lg text-[10px] text-zinc-400 flex items-start gap-2.5">
                <Zap className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5 animate-pulse" />
                <div className="space-y-1">
                  <span className="font-semibold text-zinc-300 block">Firebase RTDB Operations</span>
                  <p className="text-zinc-500 leading-normal">
                    Node is dynamically reporting telemetry data. Power relays (AC, Lamps, Fans) are safely online. Simulated heartbeat interval set to 3000ms.
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="p-6 pt-4 border-t border-zinc-850 flex justify-end bg-zinc-900">
            <Button
              onClick={() => setViewedDevice(null)}
              className="bg-zinc-850 hover:bg-zinc-800 text-zinc-300 font-bold px-6 border border-zinc-750"
            >
              Close Diagnostics
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ✏️ DIALOG B: EDIT TOPOLOGY MAPPING */}
      <Dialog open={editedDevice !== null} onOpenChange={(open) => !open && setEditedDevice(null)}>
        <DialogContent className="bg-zinc-900 border-zinc-800 text-foreground max-w-md p-6 overflow-hidden">
          <DialogHeader className="mb-4">
            <DialogTitle className="text-lg flex items-center gap-2 font-bold text-zinc-200">
              <Pencil className="w-5 h-5 text-blue-500" />
              <span>Ubah Topologi Lokasi Perangkat</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-zinc-500">
              Pindahkan penugasan ruangan fisik untuk perangkat keras tanpa merusak MAC Address.
            </DialogDescription>
          </DialogHeader>

          {editedDevice && (
            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="edit-mac" className="text-zinc-400 text-xs">MAC Address Hardware (Protected)</Label>
                <div className="relative">
                  <Cpu className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-655" />
                  <Input
                    id="edit-mac"
                    value={editedDevice.macAddress}
                    disabled
                    readOnly
                    className="pl-9 bg-zinc-955 border-zinc-850 font-mono text-xs text-zinc-500 cursor-not-allowed select-none"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="edit-building" className="text-zinc-300 font-medium text-xs">Pilih Lokasi Gedung Baru</Label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500 z-10" />
                  <Select
                    value={editBuildingId}
                    onValueChange={(val) => {
                      setEditBuildingId(val)
                      setEditFloorId("")
                      setEditRoomName("")
                      setEditCapacity("")
                    }}
                    disabled={editSubmitting || isBuildingAdmin}
                  >
                    <SelectTrigger id="edit-building" className="pl-9 bg-zinc-955 border-zinc-850 text-xs text-zinc-300">
                      <SelectValue placeholder="Pilih gedung..." />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-900 border-zinc-800">
                      {buildingsList.map((building) => (
                        <SelectItem key={building.id} value={building.id}>
                          {building.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="edit-floor" className="text-zinc-300 font-medium text-xs">Pilih Lantai</Label>
                <div className="relative">
                  <Layers className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500 z-10" />
                  <Select value={editFloorId} onValueChange={(val) => {
                    setEditFloorId(val)
                    setEditRoomName("")
                    setEditCapacity("")
                  }} disabled={!editBuildingId}>
                    <SelectTrigger id="edit-floor" className="pl-9 bg-zinc-955 border-zinc-850 text-xs text-zinc-300">
                      <SelectValue placeholder="Pilih lantai..." />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-900 border-zinc-800">
                      {Array.from({ length: editMaxFloors }).map((_, floorIdx) => {
                        const floorNum = floorIdx + 1
                        return (
                          <SelectItem key={floorNum} value={`lantai_${floorNum}`}>
                            Lantai {floorNum}
                          </SelectItem>
                        )
                      })}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="edit-room" className="text-zinc-300 font-medium text-xs">Pilih Ruangan / Kelas</Label>
                <div className="relative">
                  <DoorOpen className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500 z-10" />
                  <Select
                    value={editRoomName}
                    onValueChange={(val) => {
                      setEditRoomName(val)
                      const matchedRoom = editFloorRooms.find((r) => r.name === val)
                      if (matchedRoom) {
                        setEditCapacity(matchedRoom.capacity.toString())
                      }
                    }}
                    disabled={!editBuildingId || !editFloorId}
                  >
                    <SelectTrigger id="edit-room" className="pl-9 bg-zinc-955 border-zinc-850 text-xs text-zinc-300">
                      <SelectValue placeholder="Pilih ruangan..." />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-900 border-zinc-800">
                      {editFloorRooms.length === 0 ? (
                        <SelectItem value="none" disabled>
                          Tidak ada ruangan di lantai ini. Daftarkan di Building Management!
                        </SelectItem>
                      ) : (
                        editFloorRooms.map((room) => (
                          <SelectItem key={room.id} value={room.name}>
                            {room.code} - {room.name}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="edit-capacity" className="text-zinc-400 text-xs">Kapasitas Maksimal Ruangan</Label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500" />
                  <Input
                    id="edit-capacity"
                    disabled
                    readOnly
                    value={editCapacity ? `${editCapacity} Siswa` : ""}
                    placeholder="Terisi otomatis setelah memilih ruangan"
                    className="pl-9 bg-zinc-900 border-zinc-800 text-xs text-zinc-400 cursor-not-allowed select-none focus-visible:ring-0"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2.5 pt-4 border-t border-zinc-850">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditedDevice(null)}
                  disabled={editSubmitting}
                  className="bg-zinc-800 hover:bg-zinc-700 text-zinc-350 text-xs font-bold border border-zinc-750"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={editSubmitting || !editBuildingId || !editFloorId || !editRoomName || editRoomName === "none"}
                  className="bg-blue-500 hover:bg-blue-600 text-zinc-955 font-bold shadow-[0_0_15px_rgba(59,130,246,0.2)]"
                >
                  {editSubmitting ? (
                    <span className="flex items-center gap-1.5">
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Saving...</span>
                    </span>
                  ) : (
                    "Ubah Topologi"
                  )}
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
