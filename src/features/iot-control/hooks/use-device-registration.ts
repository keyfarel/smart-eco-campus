"use client"

import { useState, useEffect } from "react"
import { toast } from "sonner"
import { RegisteredDevice } from "../types/device-registration"
import { rtdb } from "@/lib/firebase"
import { ref, onValue, update } from "firebase/database"

export function useDeviceRegistration() {
  const [unregisteredList, setUnregisteredList] = useState<string[]>([])
  const [registeredList, setRegisteredList] = useState<RegisteredDevice[]>([])
  const [loading, setLoading] = useState(true)

  // Form states
  const [macAddress, setMacAddress] = useState("")
  const [buildingId, setBuildingId] = useState("")
  const [floorId, setFloorId] = useState("")
  const [roomName, setRoomName] = useState("")
  const [capacity, setCapacity] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // 📡 REAL-TIME FIREBASE RTDB CONNECTION
  useEffect(() => {
    if (!rtdb) {
      setLoading(false)
      return
    }

    const nodesRef = ref(rtdb, "nodes")
    const unsubscribe = onValue(nodesRef, (snapshot) => {
      const data = snapshot.val()
      if (data) {
        const unregistered: string[] = []
        const registered: RegisteredDevice[] = []

        Object.keys(data).forEach((mac) => {
          // Hanya proses data yang memiliki ID ESP32
          if (!mac.includes("ESP32") && !mac.includes("esp32")) return;

          const node = data[mac]
          
          // Support both direct attributes (current Firebase schema) and metadata-nested attributes
          const isRegistered = node.is_registered !== undefined ? node.is_registered : node.metadata?.is_registered
          
          if (isRegistered === false || isRegistered === undefined) {
            // Treat as unregistered if false or undefined
            unregistered.push(mac)
          } else if (isRegistered === true) {
            registered.push({
              macAddress: mac,
              buildingId: node.gedung_id || node.metadata?.gedung_id || "",
              buildingName: node.gedung_name || node.metadata?.gedung_name || "Gedung",
              floorId: node.lantai_id || node.metadata?.lantai_id || "",
              roomName: node.display_name || node.metadata?.display_name || "",
              capacity: node.capacity || node.metadata?.capacity || 0,
              cameraStreamUrl: node.camera_stream_url || node.metadata?.camera_stream_url || "",
              createdAt: node.registered_at || node.metadata?.registered_at || 0,
            })
          }
        })

        setUnregisteredList(unregistered)
        setRegisteredList(registered)
      } else {
        setUnregisteredList([])
        setRegisteredList([])
      }
      setLoading(false)
    }, (error) => {
      console.error("[useDeviceRegistration] Firebase RTDB Error:", error)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  // Register action
  const handleRegisterDevice = async (e: React.FormEvent, buildingName: string) => {
    e.preventDefault()
    if (!macAddress || !buildingId || !floorId || !roomName || !capacity) {
      toast.error("Mohon isi seluruh field formulir!")
      return false
    }

    const capNum = parseInt(capacity, 10)
    if (isNaN(capNum) || capNum < 1) {
      toast.error("Kapasitas ruangan harus berupa angka minimal 1!")
      return false
    }

    if (!rtdb) return false

    setIsSubmitting(true)
    try {
      const updates: Record<string, any> = {}
      // We update directly under the node to match Firebase schema
      updates[`/nodes/${macAddress}/gedung_id`] = buildingId
      updates[`/nodes/${macAddress}/gedung_name`] = buildingName
      updates[`/nodes/${macAddress}/lantai_id`] = floorId
      updates[`/nodes/${macAddress}/display_name`] = roomName
      updates[`/nodes/${macAddress}/capacity`] = capNum
      updates[`/nodes/${macAddress}/is_registered`] = true
      updates[`/nodes/${macAddress}/registered_at`] = Math.floor(Date.now() / 1000)
      updates[`/nodes/${macAddress}/camera_stream_url`] = `http://192.168.1.100:81/stream`

      await update(ref(rtdb), updates)

      // Reset form
      setMacAddress("")
      setBuildingId("")
      setFloorId("")
      setRoomName("")
      setCapacity("")

      toast.success(`Alat ${macAddress} sukses terdaftar ke ${roomName}!`)
      return true
    } catch (error) {
      console.error("[useDeviceRegistration] Registration failed:", error)
      toast.error("Gagal melakukan registrasi perangkat baru.")
      return false
    } finally {
      setIsSubmitting(false)
    }
  }

  // Action trigger from alert banner
  const handleStartRegistration = (mac: string) => {
    setMacAddress(mac)
  }

  // Cancel/Delete registration
  const handleDeleteRegistration = async (macAddressToDelete: string) => {
    if (!rtdb) return

    try {
      const updates: Record<string, any> = {}
      updates[`/nodes/${macAddressToDelete}/is_registered`] = false
      
      await update(ref(rtdb), updates)
      toast.success("Registrasi perangkat berhasil dihapus!")
    } catch (error) {
      console.error("[useDeviceRegistration] Failed to remove registration:", error)
      toast.error("Gagal menghapus registrasi perangkat.")
    }
  }

  return {
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
  }
}
