"use client"

import { useEffect, useState } from "react"
import { Device } from "../../iot-control/types/device"
import { isFirebaseReady, rtdb } from "@/lib/firebase"
import { ref, onValue } from "firebase/database"

export function useSuperAdminStats() {
  const [stats, setStats] = useState({
    activeNodes: 0,
    totalDevices: 0,
    powerLoad: 0,
    totalAmpere: 0,
    avgVoltage: 220,
    userCount: 0,
    financialSaved: 0,
    energySaved: 0,
  })

  // State untuk menyimpan master data agar tidak dipanggil berkali-kali
  const [masterData, setMasterData] = useState<{ users: any[], buildings: any[] }>({
    users: [],
    buildings: []
  })

  const [realtimeData, setRealtimeData] = useState<{
    nodes: Record<string, any>
    devices: Record<string, Device>
    roomAutomation: Record<string, boolean>
  }>({
    nodes: {},
    devices: {},
    roomAutomation: {},
  })

  // 1. Listeners Real-time (Firebase RTDB)
  useEffect(() => {
    if (!isFirebaseReady || !rtdb) return

    const nodesRef = ref(rtdb, "nodes")
    const devicesRef = ref(rtdb, "devices")
    const autoRef = ref(rtdb, "room_automation")

    const unsubNodes = onValue(nodesRef, (snap) => {
      setRealtimeData(prev => ({ ...prev, nodes: snap.val() || {} }))
    })

    const unsubDevices = onValue(devicesRef, (snap) => {
      setRealtimeData(prev => ({ ...prev, devices: snap.val() || {} }))
    })

    const unsubAuto = onValue(autoRef, (snap) => {
      setRealtimeData(prev => ({ ...prev, roomAutomation: snap.val() || {} }))
    })

    return () => {
      unsubNodes()
      unsubDevices()
      unsubAuto()
    }
  }, [])

  // 2. Fetch Aggregated Data (Master Data) HANYA SEKALI SAAT LOAD
  useEffect(() => {
    const fetchMasterData = async () => {
      try {
        const [userRes, buildingRes] = await Promise.all([
          fetch("/api/users"),
          fetch("/api/buildings")
        ])
        
        const users = userRes.ok ? await userRes.json() : []
        const buildings = buildingRes.ok ? await buildingRes.json() : []
        
        setMasterData({ users, buildings })
      } catch (error) {
        console.error("[useSuperAdminStats] Failed to fetch master data:", error)
      }
    }
    fetchMasterData()
  }, [])

  // 3. Kalkulasi ulang setiap kali ada perubahan data Realtime dari Firebase
  useEffect(() => {
    try {
      const { users, buildings } = masterData
      
      let totalMasterRooms = 0
      const masterRoomIds: string[] = []
      buildings.forEach((b: any) => {
        (b.rooms || []).forEach((r: any) => {
          totalMasterRooms++
          masterRoomIds.push(r.id)
        })
      })

      // Calculate stats from real-time data + master data
      const devicesList = Object.values(realtimeData.devices)
      
      // Filter hanya node yang ID-nya mengandung "ESP32"
      const validNodes = Object.entries(realtimeData.nodes)
        .filter(([key, _]) => key.includes("ESP32") || key.includes("esp32"))
        .map(([_, val]) => val)

      // Active Nodes = Registered ESP32 modules currently in RTDB
      let activeNodesCount = validNodes.filter((n: any) => n.is_registered !== false && n.metadata?.is_registered !== false).length

      // Total Devices = Total expected relays across all master rooms
      const totalDevicesCount = totalMasterRooms * 3 

      // Power Load = Calculate from `validNodes` telemetry power
      let currentPowerLoad = validNodes.reduce((sum, n: any) => sum + (n.telemetry?.power || 0), 0)

      // Analytics calculation (Energy & Finance) STRICTLY FROM REAL FIREBASE DATA
      let totalCapacity = 0
      let energySaved = 0
      let financialSaved = 0

      // Calculate REAL savings from connected ESP32 nodes ONLY
      if (validNodes.length > 0) {
        totalCapacity = validNodes.reduce((sum, n: any) => sum + (n.capacity || n.metadata?.capacity || 0), 0) * 100 // Estimasi 100W per kapasitas ruangan
        const powerSavedW = Math.max(0, totalCapacity - currentPowerLoad)
        
        // Penghematan riil dihitung dari hardware yang benar-benar tersambung
        energySaved = (powerSavedW * 240) / 1000 // Convert W to kWh (simulasi 240 jam sebulan)
        financialSaved = Math.round(energySaved * 1444)
      }

      // Calculate total Ampere and average Voltage
      let totalAmpere = 0;
      let totalVoltage = 0;
      let activeVoltageNodes = 0;
      
      validNodes.forEach((n: any) => {
        if (n.telemetry) {
          totalAmpere += n.telemetry.current || 0;
          if (n.telemetry.voltage > 0) {
            totalVoltage += n.telemetry.voltage;
            activeVoltageNodes++;
          }
        }
      });
      
      const avgVoltage = activeVoltageNodes > 0 ? totalVoltage / activeVoltageNodes : 220; // Default to 220 if no data

      setStats({
        activeNodes: activeNodesCount,
        totalDevices: totalDevicesCount,
        powerLoad: currentPowerLoad,
        totalAmpere: parseFloat(totalAmpere.toFixed(2)),
        avgVoltage: Math.round(avgVoltage),
        userCount: users.length,
        energySaved,
        financialSaved,
      })
    } catch (err) {
      console.error("[useSuperAdminStats] Aggregate calculation failed:", err)
    }
  }, [realtimeData, masterData])

  return { stats }
}
