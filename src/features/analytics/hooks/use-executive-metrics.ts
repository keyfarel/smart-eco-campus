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
    co2Prevented: 0,
    sparkLeaderboard: [] as SparkLeaderboardItem[],
    totalRooms: 1,
    automatedRooms: 0,
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
        const leaderboard: SparkLeaderboardItem[] = []

        Object.keys(data).forEach((key) => {
          const room = data[key]
          totalRupiah += room.total_rupiah_saved || 0
          totalKwh += room.total_kwh_saved || 0
          
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

    return () => {
      clearInterval(interval)
      unsubscribeAnalytics()
      unsubscribeAuto()
      unsubscribeProgress()
    }
  }, [])

  return metrics
}
