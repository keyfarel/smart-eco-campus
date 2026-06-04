"use client"

import { useState, useEffect, useMemo } from "react"
import { useBuildingTelemetry } from "./use-building-telemetry"
import { useDevices } from "./use-devices"
import { toast } from "sonner"

import { useSession } from "next-auth/react"
import { useBuildings } from "@/features/building-management/hooks/use-buildings"

export function useAdminGedung() {
  const { data: session } = useSession()
  const { buildingsList } = useBuildings()
  const { activeRoom, setActiveRoom, metrics, allRoomsData, systemStatus } = useBuildingTelemetry()
  const {
    roomAutomation,
    toggleRoomAutomation,
    triggerDailyAutoRevert,
    devices,
    toggleDevice,
  } = useDevices()

  // 🏛️ Identity Logic: Get Building Name for the UI
  const assignedBuildingId = session?.user?.assignedGedung
  const currentBuilding = buildingsList.find(b => b.id === assignedBuildingId)
  const currentBuildingName = currentBuilding?.name || "Gedung Penugasan"

  const activeRoomObj = currentBuilding?.rooms?.find(r => r.name === activeRoom)
  const activeRoomId = activeRoomObj?.id || activeRoom

  // 🚪 Room Discovery: Only show rooms that have registered IoT devices on the Live Dashboard
  const rooms = useMemo(() => {
    const masterRooms = currentBuilding?.rooms || []
    return masterRooms
      .filter(room => 
        devices.some(d => d.location === room.name || (d.id && d.id.startsWith(room.code || '')))
      )
      .map(r => r.name)
  }, [currentBuilding, devices])

  const [showCamera, setShowCamera] = useState(true)
  const [showRoomCards, setShowRoomCards] = useState(true)
  const [cinemaMode, setCinemaMode] = useState(false)
  const [activeFloor, setActiveFloor] = useState("Semua")
  const [isPatrolling, setIsPatrolling] = useState(false)
  const [patrolCountdown, setPatrolCountdown] = useState(5)

  // Grace Period & Auto-Cutoff Simulation for AI Auto Mode
  // LOGIC MOVED TO PYTHON YOLO BACKEND

  const handleSetOccupancy = (count: number) => {
    if (typeof window !== "undefined") {
      const overridesStr = localStorage.getItem("smart-campus-occupancy-overrides") || "{}"
      try {
        const overrides = JSON.parse(overridesStr)
        overrides[activeRoom] = count
        localStorage.setItem("smart-campus-occupancy-overrides", JSON.stringify(overrides))
        
        // Tulis log aktivitas baru ke LocalStorage (Reactive Audit Logging - Occupancy change)
        const newLog = {
          id: `log_live_${Date.now()}_occ`,
          deviceId: "yolov8",
          deviceTitle: `Kamera AI (${activeRoom})`,
          action: `Occupancy set to ${count} occupants`,
          timestamp: new Date().toISOString(),
          adminName: "AI Operator (Manual Set)",
          adminEmail: "Simulation Tool",
        }
        const existingLogs = JSON.parse(localStorage.getItem("smart-campus-logs") || "[]")
        existingLogs.unshift(newLog)
        localStorage.setItem("smart-campus-logs", JSON.stringify(existingLogs))
        
      } catch (e) {
        console.error(e)
      }
    }
    toast.success(`Okupansi ${activeRoom} diubah menjadi ${count} orang. Umpan kamera sinkron dalam 3s.`)
  }

  // Filter ruangan berdasarkan tingkat lantai, isolasi gedung, dan pastikan ruangan memiliki device/telemetri
  const filteredRooms = useMemo(() => {
    // Sembunyikan ruangan yang belum memiliki device (passive)
    const activeRoomsOnly = rooms.filter(room => allRoomsData[room] !== undefined)

    if (activeFloor === "Semua") return activeRoomsOnly
    
    return activeRoomsOnly.filter((room) => {
      const roomObj = currentBuilding?.rooms?.find(r => r.name === room || r.code === room)
      if (roomObj) {
        return `Lantai ${roomObj.floor}` === activeFloor
      }
      return false
    })
  }, [rooms, activeFloor, currentBuilding, allRoomsData])

  // Set default active room to the first room that has devices if current is invalid
  useEffect(() => {
    if (filteredRooms.length > 0 && !filteredRooms.includes(activeRoom)) {
      setActiveRoom(filteredRooms[0])
    }
  }, [filteredRooms, activeRoom, setActiveRoom])

  // CCTV Auto-Patrol Loop
  useEffect(() => {
    if (!isPatrolling) {
      setPatrolCountdown(5)
      return
    }

    const interval = setInterval(() => {
      setPatrolCountdown((prev) => {
        if (prev <= 1) {
          setActiveRoom((current) => {
            const currentIndex = filteredRooms.indexOf(current)
            if (currentIndex === -1 || filteredRooms.length <= 1) return current
            const nextIndex = (currentIndex + 1) % filteredRooms.length
            return filteredRooms[nextIndex]
          })
          return 5 // Reset to 5 seconds
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [isPatrolling, filteredRooms, setActiveRoom])

  // Get active room details
  const activeRoomData = allRoomsData[activeRoom]
  const roomObj = currentBuilding?.rooms?.find(r => r.name === activeRoom || r.code === activeRoom)
  const floorName = roomObj ? `Lantai ${roomObj.floor}` : "Lantai 5"

  const activeDevices: string[] = []
  if (activeRoomData) {
    if (activeRoomData.lampsOn) activeDevices.push("Lampu")
    if (activeRoomData.acOn) activeDevices.push("AC")
    if (activeRoomData.plugOn) activeDevices.push("Stopkontak")
  }

  return {
    activeRoom,
    setActiveRoom,
    metrics,
    allRoomsData,
    systemStatus,
    roomAutomation,
    toggleRoomAutomation,
    triggerDailyAutoRevert,
    devices,
    toggleDevice,
    rooms,
    showCamera,
    setShowCamera,
    showRoomCards,
    setShowRoomCards,
    cinemaMode,
    setCinemaMode,
    activeFloor,
    setActiveFloor,
    isPatrolling,
    setIsPatrolling,
    patrolCountdown,

    handleSetOccupancy,
    filteredRooms,
    activeRoomData,
    activeRoomId,
    floorName,
    activeDevices,
    currentBuildingName,
  }
}

