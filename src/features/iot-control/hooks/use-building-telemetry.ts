"use client"

import { useEffect, useState, useRef } from "react"
import { useSearchParams } from "next/navigation"
import { rtdb } from "@/lib/firebase"
import { ref, onValue } from "firebase/database"

export interface RoomTelemetry {
  watt: number
  volt: number
  ampere: number
  occupancy: number
  status: string
  lampsOn: boolean
  acOn: boolean
  plugOn: boolean
}

export function useBuildingTelemetry() {
  const searchParams = useSearchParams()
  const roomParam = searchParams?.get("room")
  const [activeRoom, setActiveRoom] = useState("Lab. Pemrograman 1")
  const [roomsData, setRoomsData] = useState<Record<string, RoomTelemetry>>({})
  const [loading, setLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  
  // Ref to track actual timestamp changes to bypass NTP failure on ESP32
  const timestampTrackerRef = useRef<Record<string, { lastVal: number, lastChangeLocalTime: number }>>({})

  const [systemStatus] = useState({
    iotSensors: "Online",
    aiProcessing: "Active",
    dataPipeline: "Streaming"
  })

  // Sinkronisasi otomatis dari query parameter URL (?room=...)
  useEffect(() => {
    if (roomParam) {
      setActiveRoom(roomParam)
    }
  }, [roomParam])

  // 📡 REAL-TIME FIREBASE RTDB CONNECTION (Replacing 100% Mock Offline)
  useEffect(() => {
    if (!rtdb) {
      setHasError(true)
      setLoading(false)
      return
    }

    const nodesRef = ref(rtdb, "nodes")
    
    // Set a timeout for initial data fetch
    const timeoutId = setTimeout(() => {
      if (loading) {
        setHasError(true)
        setLoading(false)
      }
    }, 10000) // 10 seconds timeout

    const unsubscribe = onValue(nodesRef, (snapshot) => {
      clearTimeout(timeoutId)
      const data = snapshot.val()
      
      if (data) {
        const updatedRooms: Record<string, RoomTelemetry> = {}
        
        Object.keys(data).forEach((mac) => {
          const node = data[mac]
          let roomName = node.display_name || node.metadata?.display_name;
          if (!roomName && mac === "ESP32-80F3DA62F3A8") {
            roomName = "Lab. Pemrograman 1";
          } else if (!roomName) {
            roomName = "Unknown Room";
          }
          
          const currentTimestamp = node.telemetry?.last_seen_timestamp || 0
          
          // Smart NTP-bypass Status Check
          // If the timestamp changes, we know the node is alive even if NTP failed
          let isOnline = false
          const tracker = timestampTrackerRef.current[roomName]
          const now = Date.now()
          
          if (tracker) {
            if (currentTimestamp !== tracker.lastVal) {
              // Value changed! Node is alive
              timestampTrackerRef.current[roomName] = { lastVal: currentTimestamp, lastChangeLocalTime: now }
              isOnline = true
            } else {
              // Value didn't change. Was it recently changed? (Grace period 65s)
              isOnline = (now - tracker.lastChangeLocalTime) < 65000
            }
          } else {
            // First time seeing this room
            timestampTrackerRef.current[roomName] = { lastVal: currentTimestamp, lastChangeLocalTime: now }
            // Fallback to absolute check just in case it actually has correct NTP
            isOnline = (now / 1000 - currentTimestamp) < 65
          }

          // Map Firebase schema to internal RoomTelemetry interface
          updatedRooms[roomName] = {
            watt: node.telemetry?.power || 0,
            volt: node.telemetry?.voltage || 0,
            ampere: node.telemetry?.current || 0,
            occupancy: node.ai_vision?.person_count || 0,
            status: isOnline ? "Online" : "Offline",
            lampsOn: node.relays?.relay_1_lampu?.is_on || node.relays?.relay_1?.is_on || false,
            acOn: node.relays?.relay_2_kipas?.is_on || node.relays?.relay_2_ac?.is_on || node.relays?.relay_2?.is_on || false,
            plugOn: node.relays?.relay_3_stopkontak?.is_on || node.relays?.relay_3?.is_on || false,
          }
        })
        
        setRoomsData(updatedRooms)
        setHasError(false)
      } else {
        // No data found in nodes
        setRoomsData({})
      }
      
      setLoading(false)
    }, (error) => {
      console.error("[useBuildingTelemetry] Firebase RTDB Error:", error)
      setHasError(true)
      setLoading(false)
    })

    return () => {
      unsubscribe()
      clearTimeout(timeoutId)
    }
  }, [])

  return {
    activeRoom,
    setActiveRoom,
    metrics: roomsData[activeRoom] || { 
      watt: 0, 
      volt: 0, 
      ampere: 0, 
      occupancy: 0, 
      status: "Offline", 
      lampsOn: false, 
      acOn: false, 
      plugOn: false 
    },
    allRoomsData: roomsData,
    systemStatus,
    loading,
    hasError
  }
}

