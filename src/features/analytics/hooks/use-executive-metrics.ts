"use client"

import { useEffect, useState } from "react"
import { Device } from "../../iot-control/types/device"

export function useExecutiveMetrics() {
  const [metrics, setMetrics] = useState({
    liveLoad: 0,
    energySaved: 0,
    financialSaved: 0,
    co2Prevented: 0,
  })

  useEffect(() => {
    const fetchAndCompute = async () => {
      try {
        let buildings: any[] = []
        try {
          const res = await fetch("/api/buildings")
          if (res.ok) {
            buildings = await res.json()
          }
        } catch (e) {
          console.error("[useExecutiveMetrics] API load failed:", e)
        }

        // 1. Get devices from localStorage to compute real live campus load
        let devicesList: Device[] = []
        let roomAutomation: Record<string, boolean> = {}

        if (typeof window !== "undefined") {
          const saved = localStorage.getItem("smart-campus-devices")
          const savedAuto = localStorage.getItem("smart-campus-room-automation")
          if (saved) {
            try { devicesList = JSON.parse(saved) } catch (e) {}
          }
          if (savedAuto) {
            try { roomAutomation = JSON.parse(savedAuto) } catch (e) {}
          }
        }

        // 2. Map all rooms: prioritize devices in localStorage, fall back to DB API rooms list
        let roomsList: string[] = []
        if (devicesList && devicesList.length > 0) {
          roomsList = Array.from(new Set(devicesList.map((d) => d.location)))
        } else {
          if (buildings && buildings.length > 0) {
            buildings.forEach((b: any) => {
              (b.rooms || []).forEach((r: any) => {
                roomsList.push(r.name)
              })
            })
          } else {
            // Resilient static fallback of standard classrooms
            roomsList.push(
              "Lab Jaringan Komputer", "Ruang Kuliah 101", "Lab Robotika & Embedded System", "Ruang Dosen Elektro",
              "Lab Kimia Dasar", "Ruang Kuliah 202", "Lab Fisika Kuantum", "Perpustakaan MIPA",
              "Lobby Rektorat Utama", "Ruang Sidang Senat", "Kantor Utama Rektor"
            )
          }
        }

        // Calculate total active load (in Watts)
        let currentLiveLoad = devicesList.reduce((sum, d) => sum + (d.isOn ? d.powerUsage : 0), 0)
        if (devicesList.length === 0) {
          currentLiveLoad = 4850
        }

        // Count classrooms with active AI Automation
        const automatedRoomsCount = roomsList.filter((r) => roomAutomation[r] !== false).length

        // Dynamic calculations:
        // Base saving per automated classroom is 185.5 kWh per period
        const totalEnergySaved = automatedRoomsCount * 185.5
        
        // Cost savings = kWh * 1444 IDR (Social tariff rate)
        const totalFinancialSaved = Math.round(totalEnergySaved * 1444)

        // CO2 savings = kWh * 0.00087 Metric Tons (Indonesian Grid Factor)
        const totalCo2Prevented = parseFloat((totalEnergySaved * 0.00087).toFixed(2))

        setMetrics({
          liveLoad: currentLiveLoad,
          energySaved: totalEnergySaved,
          financialSaved: totalFinancialSaved,
          co2Prevented: totalCo2Prevented,
        })
      } catch (e) {
        console.error("[useExecutiveMetrics] Error computing metrics:", e)
      }
    }

    // Initial compute
    fetchAndCompute()

    // Poll periodically for live responsive dashboard updates
    const interval = setInterval(fetchAndCompute, 30000)
    return () => clearInterval(interval)
  }, [])

  return metrics
}
