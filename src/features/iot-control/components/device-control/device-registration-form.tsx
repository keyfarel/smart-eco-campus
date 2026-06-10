"use client"

import { useEffect } from "react"
import { useSession } from "next-auth/react"
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
import { Cpu, Building2, Layers, DoorOpen, Users, CheckCircle2, AlertCircle, Loader2 } from "lucide-react"
import { useBuildings } from "@/features/building-management"

interface DeviceRegistrationFormProps {
  macAddress: string
  onMacAddressChange: (val: string) => void
  buildingId: string
  onBuildingIdChange: (val: string) => void
  floorId: string
  onFloorIdChange: (val: string) => void
  roomName: string
  onRoomNameChange: (val: string) => void
  capacity: string
  onCapacityChange: (val: string) => void
  isSubmitting: boolean
  onSubmit: (e: React.FormEvent, buildingName: string) => void
}

export function DeviceRegistrationForm({
  macAddress,
  onMacAddressChange,
  buildingId,
  onBuildingIdChange,
  floorId,
  onFloorIdChange,
  roomName,
  onRoomNameChange,
  capacity,
  onCapacityChange,
  isSubmitting,
  onSubmit,
}: DeviceRegistrationFormProps) {
  const { data: session } = useSession()
  const userRole = session?.user?.role || "ADMIN_GEDUNG"
  const assignedGedung = session?.user?.assignedGedung || ""
  const isBuildingAdmin = userRole === "ADMIN_GEDUNG"

  // Fetch active buildings dynamically from Building Management module
  const { buildingsList } = useBuildings()

  // Auto-bind / pre-fill building selector for building admins
  useEffect(() => {
    if (isBuildingAdmin && assignedGedung && buildingId !== assignedGedung) {
      onBuildingIdChange(assignedGedung)
    }
  }, [isBuildingAdmin, assignedGedung, buildingId, onBuildingIdChange])

  // Find selected building object
  const selectedBuilding = buildingsList.find((b) => b.id === buildingId)
  const formMaxFloors = selectedBuilding ? selectedBuilding.floorsCount : 1

  // Filter rooms belonging to the selected building and selected floor
  const floorRooms = selectedBuilding
    ? (selectedBuilding.rooms || []).filter((r) => {
        // Handle cases where floor in room is a number or string
        const roomFloorStr = r.floor.toString()
        const selectedFloorNum = floorId.replace("lantai_", "")
        return roomFloorStr === selectedFloorNum
      })
    : []

  // Reset floor and room states when selected building changes
  useEffect(() => {
    onFloorIdChange("")
    onRoomNameChange("")
    onCapacityChange("")
  }, [buildingId])

  // Reset room and capacity states when selected floor changes
  useEffect(() => {
    onRoomNameChange("")
    onCapacityChange("")
  }, [floorId])

  // WCAG validation helpers
  const isMacTouched = macAddress.length > 0
  const isMacValid = /^ESP32-[A-Z0-9]{12}$/.test(macAddress)
  const showMacError = isMacTouched && !isMacValid
  const showMacSuccess = isMacTouched && isMacValid

  const isRoomSelected = roomName.length > 0 && roomName !== "none"
  const isCapValid = capacity.length > 0 && parseInt(capacity, 10) >= 1

  const formIsValid = isMacValid && buildingId && floorId && isRoomSelected && isCapValid

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const buildingName = selectedBuilding ? selectedBuilding.name : "Gedung Kampus"
    onSubmit(e, buildingName)
  }

  return (
    <form onSubmit={handleFormSubmit} className="space-y-4">
      {/* MAC Address */}
      <div className="space-y-1.5">
        <Label htmlFor="mac-address" className="text-zinc-300 font-medium text-xs">MAC Address Alat</Label>
        <div className="relative">
          <Cpu className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500" />
          <Input
            id="mac-address"
            placeholder="e.g. ESP32-F6D5C4B3A2E1"
            value={macAddress}
            onChange={(e) => onMacAddressChange(e.target.value)}
            className={`pl-9 bg-zinc-955 border-zinc-800 font-mono text-xs focus-visible:border-emerald-500 focus-visible:ring-emerald-500 disabled:bg-zinc-900 disabled:text-zinc-400 disabled:border-zinc-800 disabled:cursor-not-allowed disabled:opacity-100 transition-all ${
              showMacError ? "border-red-500 border-2 focus-visible:border-red-500 focus-visible:ring-red-500" : ""
            } ${showMacSuccess ? "border-emerald-500 pr-10" : ""}`}
            required
            disabled={isSubmitting}
          />
          {showMacSuccess && (
            <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500" />
          )}
        </div>
        {showMacError && (
          <p className="text-[10px] text-red-400 font-medium flex items-center gap-1 mt-1 animate-in fade-in slide-in-from-top-1">
            <AlertCircle className="w-3.5 h-3.5 shrink-0 text-red-500" />
            <span>Format MAC salah. Gunakan pola: ESP32-A1B2C3D4E5F6</span>
          </p>
        )}
      </div>

      {/* Dynamic Building Dropdown Options */}
      <div className="space-y-1.5">
        <Label htmlFor="reg-building" className="text-zinc-300 font-medium text-xs">Pilih Gedung (Master Data)</Label>
        <div className="relative">
          <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500 z-10" />
          <Select value={buildingId} onValueChange={onBuildingIdChange} disabled={isSubmitting || isBuildingAdmin}>
            <SelectTrigger id="reg-building" className="pl-9 bg-zinc-955 border-zinc-800 text-xs focus-visible:border-emerald-500 focus-visible:ring-emerald-500 disabled:bg-zinc-900 disabled:text-zinc-400 disabled:border-zinc-800 disabled:cursor-not-allowed disabled:opacity-100 transition-all">
              <SelectValue placeholder="Pilih lokasi gedung..." />
            </SelectTrigger>
            <SelectContent className="bg-zinc-900 border-zinc-800">
              {buildingsList.length === 0 ? (
                <SelectItem value="none" disabled>
                  Belum ada gedung terdaftar. Tambahkan di Building Management!
                </SelectItem>
              ) : (
                buildingsList.map((building) => (
                  <SelectItem key={building.id} value={building.id}>
                    {building.name}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Dynamic Floor Selection Options */}
      <div className="space-y-1.5">
        <Label htmlFor="reg-floor" className="text-zinc-300 font-medium text-xs">Pilih Lantai</Label>
        <div className="relative">
          <Layers className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500 z-10" />
          <Select value={floorId} onValueChange={onFloorIdChange} disabled={isSubmitting || !buildingId}>
            <SelectTrigger id="reg-floor" className="pl-9 bg-zinc-955 border-zinc-800 text-xs focus-visible:border-emerald-500 focus-visible:ring-emerald-500 disabled:bg-zinc-900 disabled:text-zinc-400 disabled:border-zinc-800 disabled:cursor-not-allowed disabled:opacity-100 transition-all">
              <SelectValue placeholder={buildingId ? "Pilih lantai gedung..." : "Pilih gedung terlebih dahulu"} />
            </SelectTrigger>
            <SelectContent className="bg-zinc-900 border-zinc-800">
              {Array.from({ length: formMaxFloors }).map((_, floorIdx) => {
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

      {/* Dynamic Room Dropdown Selector Option */}
      <div className="space-y-1.5">
        <Label htmlFor="reg-room" className="text-zinc-300 font-medium text-xs">Nama Ruangan / Kelas</Label>
        <div className="relative">
          <DoorOpen className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500 z-10" />
          <Select
            value={roomName}
            onValueChange={(val) => {
              onRoomNameChange(val)
              const selectedRoomObj = floorRooms.find((r) => r.name === val)
              if (selectedRoomObj) {
                onCapacityChange(selectedRoomObj.capacity.toString())
              }
            }}
            disabled={isSubmitting || !buildingId || !floorId}
          >
            <SelectTrigger id="reg-room" className="pl-9 bg-zinc-955 border-zinc-800 text-xs focus-visible:border-emerald-500 focus-visible:ring-emerald-500 disabled:bg-zinc-900 disabled:text-zinc-400 disabled:border-zinc-800 disabled:cursor-not-allowed disabled:opacity-100 transition-all">
              <SelectValue placeholder={floorId ? "Pilih ruangan..." : "Pilih lantai terlebih dahulu"} />
            </SelectTrigger>
            <SelectContent className="bg-zinc-900 border-zinc-800">
              {floorRooms.length === 0 ? (
                <SelectItem value="none" disabled>
                  Tidak ada ruangan di lantai ini. Daftarkan di Building Management!
                </SelectItem>
              ) : (
                floorRooms.map((room) => (
                  <SelectItem key={room.id} value={room.name}>
                    {room.code} - {room.name}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Kapasitas Kelas (Auto-filled & read-only for accuracy) */}
      <div className="space-y-1.5">
        <Label htmlFor="reg-capacity" className="text-zinc-300 font-medium text-xs">Kapasitas Maksimal Kelas (Siswa)</Label>
        <div className="relative">
          <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500" />
          <Input
            id="reg-capacity"
            type="text"
            readOnly
            placeholder="Terisi otomatis setelah memilih ruangan"
            value={capacity ? `${capacity} Siswa` : ""}
            className="pl-9 bg-zinc-900 border-zinc-800 text-xs text-zinc-400 cursor-not-allowed select-none focus-visible:ring-0"
            disabled
          />
        </div>
      </div>

      {/* Submit */}
      <Button
        type="submit"
        disabled={isSubmitting || !formIsValid}
        className="w-full bg-emerald-500 hover:bg-emerald-600 text-zinc-955 font-bold shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:shadow-[0_0_20px_rgba(16,185,129,0.5)] disabled:bg-zinc-800 disabled:text-zinc-550 disabled:cursor-not-allowed disabled:shadow-none transition-all duration-200"
      >
        {isSubmitting ? (
          <span className="flex items-center justify-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin text-zinc-955" />
            <span>Mendaftarkan...</span>
          </span>
        ) : (
          "Setujui & Daftarkan Perangkat"
        )}
      </Button>
    </form>
  )
}

