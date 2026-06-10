"use client"

import { useEffect, useState } from "react"
import { rtdb } from "@/lib/firebase"
import { ref, onValue } from "firebase/database"
import { Device } from "../../iot-control/types/device"

export interface SparkLeaderboardItem {
  id: string
  name: string
  savings: number
  kwh: number
}

export function useExecutiveMetrics() {
  const [metrics, setMetrics] = useState({
    liveLoad: 0,
    energySaved: 0,
    financialSaved: 0,
    totalDurationSec: 0,
    totalAiActions: 0,
    co2Prevented: 0,
    sparkLeaderboard: [] as SparkLeaderboardItem[],
    totalRooms: 1,
    automatedRooms: 0,
    activeDatanodes: 0,
    activeNodes: 0,
    managedRelays: 0,
    sparkStatus: {
      step: 0,
      total_steps: 5,
      message: "",
      is_running: false
    }
  })

  useEffect(() => {
    if (!rtdb) return;

    // 1. Fetch live load from localStorage
    const updateLiveLoad = () => {
      let currentLiveLoad = 4850
      if (typeof window !== "undefined") {
        const saved = localStorage.getItem("smart-campus-devices")
        if (saved) {
          try {
            const devicesList: Device[] = JSON.parse(saved)
            if (devicesList.length > 0) {
              currentLiveLoad = devicesList.reduce((sum, d) => sum + (d.isOn ? d.powerUsage : 0), 0)
            }
          } catch (e) {}
        }
      }
      setMetrics(m => ({ ...m, liveLoad: currentLiveLoad }))
    }

    updateLiveLoad()
    const interval = setInterval(updateLiveLoad, 10000)

    // 2. Listen to PySpark Analytics Summary from Firebase
    const analyticsRef = ref(rtdb, "analytics/summary")
    const unsubscribeAnalytics = onValue(analyticsRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val()
        let totalRupiah = 0
        let totalKwh = 0
        let totalDuration = 0
        let totalActions = 0
        const leaderboard: SparkLeaderboardItem[] = []

        Object.keys(data).forEach((key) => {
          const room = data[key]
          totalRupiah += room.total_rupiah_saved || 0
          totalKwh += room.total_kwh_saved || 0
          // fallback to both possible key names
          const roomDurationSec = room.total_duration_sec ?? (room.total_durasi_kosong_jam ? room.total_durasi_kosong_jam * 3600 : 0)
          totalDuration += roomDurationSec
          totalActions += room.total_ai_action ?? room.total_ai_actions ?? 0
          
          leaderboard.push({
            id: key,
            name: room.lokasi || key,
            savings: room.total_rupiah_saved || 0,
            kwh: room.total_kwh_saved || 0
          })
        })

        // Sort leaderboard by savings descending
        leaderboard.sort((a, b) => b.savings - a.savings)

        setMetrics(m => ({
          ...m,
          energySaved: parseFloat(totalKwh.toFixed(2)),
          financialSaved: Math.round(totalRupiah),
          totalDurationSec: totalDuration,
          totalAiActions: totalActions,
          co2Prevented: parseFloat((totalKwh * 0.00087).toFixed(4)),
          sparkLeaderboard: leaderboard,
        }))
      }
    })

    // 3. Listen to live room automation states for real-time Automation (Eco Score) count
    const autoRef = ref(rtdb, "room_automation")
    const unsubscribeAuto = onValue(autoRef, (snapshot) => {
      if (snapshot.exists()) {
        const autoData = snapshot.val()
        const roomKeys = Object.keys(autoData)
        const totalRooms = roomKeys.length || 1
        let automatedRooms = 0

        roomKeys.forEach(room => {
          if (autoData[room] !== false) {
            automatedRooms += 1
          }
        })

        setMetrics(m => ({
          ...m,
          totalRooms,
          automatedRooms
        }))
      }
    })

    // 4. Listen to PySpark Live Execution Progress
    const progressRef = ref(rtdb, "analytics/spark_status")
    const unsubscribeProgress = onValue(progressRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val()
        setMetrics(m => ({
          ...m,
          sparkStatus: {
            step: data.step || 0,
            total_steps: data.total_steps || 5,
            message: data.message || "",
            is_running: data.is_running || false
          }
        }))
      }
    })

    // 5. Listen to Big Data Cluster Status
    const clusterRef = ref(rtdb, "analytics/cluster_status")
    const unsubscribeCluster = onValue(clusterRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val()
        setMetrics(m => ({
          ...m,
          activeDatanodes: data.active_datanodes || 0
        }))
      }
    })

    // 6. Listen to IoT Edge Fleet Status
    const nodesRef = ref(rtdb, "nodes")
    const unsubscribeNodes = onValue(nodesRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val()
        let activeNodes = 0
        let managedRelays = 0
        const now = Date.now() / 1000 // current time in seconds

        Object.keys(data).forEach(nodeId => {
          const node = data[nodeId]
          // Simple check if node is active (seen in last 5 minutes)
          const lastSeen = node.telemetry?.last_seen_timestamp || 0
          if (now - lastSeen < 300) {
            activeNodes++
          } else if (node.is_registered) {
            activeNodes++ // Count as active if it's explicitly registered in our fleet
          }

          if (node.relays) {
            Object.keys(node.relays).forEach(rKey => {
              if (rKey.includes('lampu') || rKey.includes('kipas') || rKey.includes('ac')) {
                managedRelays++
              }
            })
          }
        })

        setMetrics(m => ({
          ...m,
          activeNodes,
          managedRelays
        }))
      }
    })

    return () => {
      clearInterval(interval)
      unsubscribeAnalytics()
      unsubscribeAuto()
      unsubscribeProgress()
      unsubscribeCluster()
      unsubscribeNodes()
    }
  }, [])

  const [isSparkRunning, setIsSparkRunning] = useState(false)
  const [isClusterOffline, setIsClusterOffline] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<string>("")

  // Update timestamp when metrics change or Spark finishes
  useEffect(() => {
    setIsClusterOffline(false) // Auto-recover from offline state when realtime data flows
    setLastUpdated(new Date().toLocaleString('id-ID', {
      day: 'numeric', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit', second: '2-digit'
    }))
  }, [metrics.energySaved, metrics.sparkStatus?.is_running, metrics.activeDatanodes])

  const triggerSparkJob = async (toast: any) => {
    setIsSparkRunning(true)
    setIsClusterOffline(false)
    toast.info("Menginisialisasi Apache Spark Cluster...")
    
    try {
      const res = await fetch("/api/cron/trigger-spark", { method: "POST" })
      const data = await res.json()
      
      if (res.ok) {
        setIsClusterOffline(false)
        toast.success("Big Data berhasil dihitung ulang! Dashboard ter-update.")
      } else {
        setIsClusterOffline(true)
        toast.error(`Gagal menjalankan Spark: ${data.error}`)
      }
    } catch (error) {
      setIsClusterOffline(true)
      toast.error("Terjadi kesalahan koneksi! NameNode (Laptop) mungkin offline atau Tailscale terputus.")
    } finally {
      setIsSparkRunning(false)
    }
  }

  return {
    metrics,
    isSparkRunning,
    isClusterOffline,
    lastUpdated,
    triggerSparkJob
  }
}
