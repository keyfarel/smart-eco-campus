"use client"

import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { Device } from "../types/device"
import { isFirebaseReady, rtdb } from "@/lib/firebase"
import { ref, onValue, set, get } from "firebase/database"

const DEVICE_MAP: Record<string, { dbKey: string; title: string; description: string; powerUsage: number }> = {
  lamp: {
    dbKey: "relay_1_lampu",
    title: "Classroom Lamp",
    description: "Main lighting system for the classroom area",
    powerUsage: 120,
  },
  acFan: {
    dbKey: "relay_2_kipas",
    title: "AC / Fan System",
    description: "Climate control and ventilation unit",
    powerUsage: 850,
  },
  pcProjector: {
    dbKey: "relay_3_stopkontak",
    title: "PC / Projector Socket",
    description: "Power outlet for computing equipment",
    powerUsage: 450,
  },
}

// Fallback seed data in case the dynamic server load fails
const FALLBACK_DEVICES: Device[] = [
  {
    id: "A-101-lamp",
    title: "Classroom Lamp",
    description: "Main lighting system for the classroom area",
    powerUsage: 120,
    location: "Lab Jaringan Komputer",
    isOn: true,
    lastUpdated: new Date().toISOString()
  },
  {
    id: "A-101-acFan",
    title: "AC / Fan System",
    description: "Climate control and ventilation unit",
    powerUsage: 850,
    location: "Lab Jaringan Komputer",
    isOn: false,
    lastUpdated: new Date().toISOString()
  },
  {
    id: "A-101-pcProjector",
    title: "PC / Projector Socket",
    description: "Power outlet for computing equipment",
    powerUsage: 450,
    location: "Lab Jaringan Komputer",
    isOn: true,
    lastUpdated: new Date().toISOString()
  },
  {
    id: "B-201-lamp",
    title: "Classroom Lamp",
    description: "Main lighting system for the classroom area",
    powerUsage: 120,
    location: "Ruang Kuliah 202",
    isOn: true,
    lastUpdated: new Date().toISOString()
  },
  {
    id: "B-201-acFan",
    title: "AC / Fan System",
    description: "Climate control and ventilation unit",
    powerUsage: 850,
    location: "Ruang Kuliah 202",
    isOn: true,
    lastUpdated: new Date().toISOString()
  }
]

export function useDevices() {
  const { data: session } = useSession()
  const [devices, setDevices] = useState<Device[]>([])
  const [loading, setLoading] = useState(true)
  const [connected, setConnected] = useState(false)
  const [toggling, setToggling] = useState<string | null>(null)
  const [roomAutomation, setRoomAutomation] = useState<Record<string, boolean>>({})
  const [hardwareNodes, setHardwareNodes] = useState<any>(null)

  // Fetch actual buildings and rooms dynamically to initialize devices consistently
  useEffect(() => {
    if (!isFirebaseReady) {
      // OFFLINE MODE (Fallback)
      const initializeOffline = async () => {
        try {
          const response = await fetch("/api/buildings")
          if (!response.ok) {
            throw new Error("Failed to load buildings from server")
          }
          const buildingsData = await response.json()

          const generatedDevices: Device[] = []
          const roomsList: string[] = []

          buildingsData.forEach((building: any) => {
            (building.rooms || []).forEach((room: any) => {
              const roomCode = room.code || room.id
              const roomName = room.name
              roomsList.push(roomName)

              generatedDevices.push({
                id: `${roomCode}-lamp`,
                title: "Classroom Lamp",
                description: "Main lighting system for the classroom area",
                powerUsage: 120,
                location: roomName,
                isOn: Math.random() > 0.4,
                lastUpdated: new Date().toISOString()
              })
              generatedDevices.push({
                id: `${roomCode}-acFan`,
                title: "AC / Fan System",
                description: "Climate control and ventilation unit",
                powerUsage: 850,
                location: roomName,
                isOn: Math.random() > 0.6,
                lastUpdated: new Date().toISOString()
              })
              generatedDevices.push({
                id: `${roomCode}-pcProjector`,
                title: "PC / Projector Socket",
                description: "Power outlet for computing equipment",
                powerUsage: 450,
                location: roomName,
                isOn: Math.random() > 0.5,
                lastUpdated: new Date().toISOString()
              })
            })
          })

          if (typeof window !== "undefined") {
            // 1. Sync Devices List
            const savedDevicesStr = localStorage.getItem("smart-campus-devices")
            if (savedDevicesStr) {
              try {
                const savedDevices = JSON.parse(savedDevicesStr) as Device[]
                
                const uniqueSaved: Device[] = []
                const seenRoomTypes = new Set<string>()
                savedDevices.forEach((d) => {
                  if (d && d.id && d.location) {
                    const baseType = d.id.split("-").pop() || ""
                    const uniqueKey = `${d.location}-${baseType}`
                    if (!seenRoomTypes.has(uniqueKey)) {
                      seenRoomTypes.add(uniqueKey)
                      uniqueSaved.push(d)
                    }
                  }
                })

                const updatedDevices = [...uniqueSaved]
                generatedDevices.forEach((genD) => {
                  const baseType = genD.id.split("-").pop() || ""
                  const uniqueKey = `${genD.location}-${baseType}`
                  if (!seenRoomTypes.has(uniqueKey)) {
                    seenRoomTypes.add(uniqueKey)
                    updatedDevices.push(genD)
                  }
                })

                setDevices(updatedDevices)
                localStorage.setItem("smart-campus-devices", JSON.stringify(updatedDevices))
              } catch (e) {
                setDevices(generatedDevices)
                localStorage.setItem("smart-campus-devices", JSON.stringify(generatedDevices))
              }
            } else {
              setDevices(generatedDevices)
              localStorage.setItem("smart-campus-devices", JSON.stringify(generatedDevices))
            }

            // 2. Sync AI Room Automation
            const savedAutoStr = localStorage.getItem("smart-campus-room-automation")
            let currentAuto: Record<string, boolean> = {}
            if (savedAutoStr) {
              try {
                currentAuto = JSON.parse(savedAutoStr)
              } catch (e) {}
            }

            let automationDirty = false
            roomsList.forEach((roomName) => {
              if (currentAuto[roomName] === undefined) {
                currentAuto[roomName] = true
                automationDirty = true
              }
            })

            if (automationDirty || !savedAutoStr) {
              localStorage.setItem("smart-campus-room-automation", JSON.stringify(currentAuto))
            }
            setRoomAutomation(currentAuto)
          }
          
          setConnected(true)
        } catch (err) {
          console.error("[useDevices] Load offline devices failed:", err)
          setDevices(FALLBACK_DEVICES)
          setConnected(true)
        } finally {
          setLoading(false)
        }
      }
      initializeOffline()
      return
    }

    // ONLINE MODE (Firebase Ready)
    let unsubscribeDevices: (() => void) | null = null
    let unsubscribeAuto: (() => void) | null = null
    let unsubscribeNodes: (() => void) | null = null

    const initializeOnline = async () => {
      try {
        if (!rtdb) return

        const devicesRef = ref(rtdb, "devices")
        const autoRef = ref(rtdb, "room_automation")

        // Establish RTDB Real-time Listeners
        unsubscribeDevices = onValue(devicesRef, (snapshot) => {
          if (snapshot.exists()) {
            const val = snapshot.val()
            const list: Device[] = []
            if (Array.isArray(val)) {
              val.forEach((d) => { if (d) list.push(d) })
            } else if (typeof val === "object") {
              Object.keys(val).forEach((k) => { 
                if (val[k]) {
                  list.push({ id: k, ...val[k] }) 
                } 
              })
            }

            // Deduplicate lists strictly by location and type
            const uniqueSaved: Device[] = []
            const seenRoomTypes = new Set<string>()
            list.forEach((d) => {
              if (d && d.id) {
                const baseType = d.id.split("-").pop() || ""
                // Use id as a fallback for unique key if location is missing
                const loc = d.location || d.id.split("-")[0] || "unknown"
                const uniqueKey = `${loc}-${baseType}`
                if (!seenRoomTypes.has(uniqueKey)) {
                  seenRoomTypes.add(uniqueKey)
                  uniqueSaved.push(d)
                }
              }
            })

            setDevices(uniqueSaved)
            localStorage.setItem("smart-campus-devices", JSON.stringify(uniqueSaved))
          } else {
            setDevices([])
            localStorage.setItem("smart-campus-devices", JSON.stringify([]))
          }
        })

        unsubscribeAuto = onValue(autoRef, (snapshot) => {
          if (snapshot.exists()) {
            const val = snapshot.val()
            if (val && typeof val === "object") {
              setRoomAutomation(val)
              localStorage.setItem("smart-campus-room-automation", JSON.stringify(val))
            }
          } else {
            setRoomAutomation({})
            localStorage.setItem("smart-campus-room-automation", JSON.stringify({}))
          }
        })

        const nodesRef = ref(rtdb, "nodes")
        unsubscribeNodes = onValue(nodesRef, (snapshot) => {
          if (snapshot.exists()) {
            setHardwareNodes(snapshot.val())
          }
        })
        
        setConnected(true)
      } catch (err) {
        console.error("[useDevices] Online initialization failed:", err)
        setConnected(false)
      } finally {
        setLoading(false)
      }
    }

    initializeOnline()

    return () => {
      if (unsubscribeDevices) unsubscribeDevices()
      if (unsubscribeAuto) unsubscribeAuto()
      if (unsubscribeNodes) unsubscribeNodes()
    }
  }, [])

  // 2. Efek untuk selalu menimpa devices dengan status dari hardwareNodes
  useEffect(() => {
    if (!hardwareNodes || devices.length === 0) return

    setDevices((prevDevices) => {
      let changed = false
      const next = prevDevices.map((d) => {
        const baseType = d.id.split("-").pop() || ""
        const roomName = d.location || ""
        
        let matchedNode: any = null
        for (const mac of Object.keys(hardwareNodes)) {
          const nodeMeta = hardwareNodes[mac].metadata || hardwareNodes[mac]
          if (nodeMeta && nodeMeta.display_name === roomName) {
            matchedNode = hardwareNodes[mac]
            break
          }
        }
        
        if (matchedNode && matchedNode.relays) {
          let relayKey = ""
          if (baseType === "lamp") relayKey = "relay_1_lampu"
          else if (baseType === "acFan") relayKey = "relay_2_kipas"
          else if (baseType === "pcProjector") relayKey = "relay_3_stopkontak"
          
          if (relayKey && matchedNode.relays[relayKey]) {
            const hwIsOn = matchedNode.relays[relayKey].is_on
            if (d.isOn !== hwIsOn) {
              changed = true
              return { ...d, isOn: hwIsOn, lastUpdated: new Date().toISOString() }
            }
          }
        }
        return d
      })
      
      if (changed) {
        if (typeof window !== "undefined") {
          localStorage.setItem("smart-campus-devices", JSON.stringify(next))
        }
        return next
      }
      return prevDevices
    })
  }, [hardwareNodes]) // Dependensi hanya pada hardwareNodes agar tidak infinite loop

  // 3. Toggle status perangkat
  const toggleDevice = async (deviceId: string, currentState: boolean, isPhysicalOverride: boolean = false) => {
    if (toggling) return

    const baseType = deviceId.split("-").pop() || deviceId
    const deviceConfig = DEVICE_MAP[baseType] || { title: "Relay Device", powerUsage: 100 }

    const previousDevices = [...devices]

    setDevices((prev) => {
      const next = prev.map((d) =>
        d.id === deviceId
          ? { ...d, isOn: !currentState, lastUpdated: new Date().toISOString() }
          : d
      )
      if (typeof window !== "undefined") {
        localStorage.setItem("smart-campus-devices", JSON.stringify(next))
      }
      return next
    })

    setToggling(deviceId)
    try {
      if (isFirebaseReady && rtdb) {
        const targetRef = ref(rtdb, `devices/${deviceId}`)
        const deviceObj = devices.find((d) => d.id === deviceId)
        if (deviceObj) {
          await set(targetRef, {
            ...deviceObj,
            isOn: !currentState,
            lastUpdated: new Date().toISOString()
          })
        } else {
          await set(targetRef, {
            id: deviceId,
            isOn: !currentState,
            lastUpdated: new Date().toISOString()
          })
        }

        // 🚨 HARDWARE SYNC LOGIC: Push perintah langsung ke ESP32 Node
        try {
          const roomName = deviceObj ? deviceObj.location : ""
          if (roomName) {
            const nodesSnapshot = await get(ref(rtdb, "nodes"))
            if (nodesSnapshot.exists()) {
              const nodesData = nodesSnapshot.val()
              Object.keys(nodesData).forEach(async (mac) => {
                const nodeMeta = nodesData[mac].metadata || nodesData[mac]
                if (nodeMeta && nodeMeta.display_name === roomName) {
                  let relayKey = ""
                  if (baseType === "lamp") relayKey = "relay_1_lampu"
                  else if (baseType === "acFan") relayKey = "relay_2_kipas"
                  else if (baseType === "pcProjector") relayKey = "relay_3_stopkontak"
                  
                  if (relayKey) {
                    await set(ref(rtdb, `nodes/${mac}/relays/${relayKey}/is_on`), !currentState)
                    await set(ref(rtdb, `nodes/${mac}/relays/${relayKey}/mode`), "manual")
                  }
                }
              })
            }
          }
        } catch (err) {
          console.error("Hardware sync failed", err)
        }

      } else {
        await new Promise((resolve) => setTimeout(resolve, 300))
      }

      toast.success(`${deviceConfig.title} sukses diubah ke ${!currentState ? "ON" : "OFF"}!`)

      if (typeof window !== "undefined") {
        const deviceObj = devices.find((d) => d.id === deviceId)
        const roomName = deviceObj ? deviceObj.location : "Unknown Room"
        const newLog = {
          id: `log_live_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          deviceId: baseType,
          deviceTitle: `${deviceConfig.title} (${roomName})`,
          action: isPhysicalOverride
            ? (!currentState ? "Turned ON (Physical Override)" : "Turned OFF (Physical Override)")
            : (!currentState ? "Turned ON" : "Turned OFF"),
          timestamp: new Date().toISOString(),
          adminName: isPhysicalOverride
            ? "Sakelar Fisik Dinding (GPIO)"
            : (session?.user?.name || "Admin Gedung"),
          adminEmail: isPhysicalOverride ? "Local Hardware Input" : (session?.user?.email || "Manual Override"),
        }

        const existingLogsStr = localStorage.getItem("smart-campus-logs")
        let existingLogs = []
        if (existingLogsStr) {
          try {
            existingLogs = JSON.parse(existingLogsStr)
          } catch (e) {
            existingLogs = []
          }
        }
        existingLogs.unshift(newLog)
        localStorage.setItem("smart-campus-logs", JSON.stringify(existingLogs))

        if (isFirebaseReady && rtdb) {
          // Resolve roomId correctly based on context (deviceId for single toggle, roomName for bulk)
          const targetRoom = typeof deviceId !== 'undefined' 
            ? (devices.find(d => d.id === deviceId)?.location || '')
            : (typeof roomName !== 'undefined' ? roomName : '');
            
          const deviceObj = devices.find(d => d.location === targetRoom);
          const roomId = deviceObj?.id?.split("-")[0] || "unknown";
          await set(ref(rtdb, `room_automation/${roomId}`), false);
        } else {
          setRoomAutomation((prev) => {
            const targetRoom = typeof deviceId !== 'undefined' 
              ? (devices.find(d => d.id === deviceId)?.location || '')
              : (typeof roomName !== 'undefined' ? roomName : '');
              
            const deviceObj = devices.find(d => d.location === targetRoom);
            const roomId = deviceObj?.id?.split("-")[0] || "unknown";
            const next = { ...prev, [roomId]: false };
            localStorage.setItem("smart-campus-room-automation", JSON.stringify(next));
            return next;
          });
        }
      }
    } catch (err) {
      console.error("[useDevices] Toggle failed:", err)
      setDevices(previousDevices)
      if (typeof window !== "undefined") {
        localStorage.setItem("smart-campus-devices", JSON.stringify(previousDevices))
      }
      toast.error("Gagal mengubah status device.")
    } finally {
      setToggling(null)
    }
  }

  // 3. Matikan/Nyalakan semua perangkat sekaligus KHUSUS di kelas tertentu
  const setAllDevices = async (roomName: string, state: boolean) => {
    if (toggling) return

    const previousDevices = [...devices]

    setDevices((prev) => {
      const next = prev.map((d) =>
        d.location === roomName
          ? { ...d, isOn: state, lastUpdated: new Date().toISOString() }
          : d
      )
      if (typeof window !== "undefined") {
        localStorage.setItem("smart-campus-devices", JSON.stringify(next))
      }
      return next
    })

    setToggling(`all-${roomName}`)
    try {
      if (isFirebaseReady && rtdb) {
        const targetDevices = devices.filter((d) => d.location === roomName)
        const roomId = targetDevices[0]?.id?.split("-")[0] || "unknown"
        
        await Promise.all([
          ...targetDevices.map((d) =>
            set(ref(rtdb, `devices/${d.id}`), {
              ...d,
              isOn: state,
              lastUpdated: new Date().toISOString()
            })
          ),
          set(ref(rtdb, `room_automation/${roomId}`), false)
        ])

        // 🚨 HARDWARE SYNC LOGIC FOR BULK TOGGLE: Push perintah langsung ke ESP32 Node
        try {
          const nodesSnapshot = await get(ref(rtdb, "nodes"))
          if (nodesSnapshot.exists()) {
            const nodesData = nodesSnapshot.val()
            Object.keys(nodesData).forEach(async (mac) => {
              const nodeMeta = nodesData[mac].metadata || nodesData[mac]
              if (nodeMeta && nodeMeta.display_name === roomName) {
                await set(ref(rtdb, `nodes/${mac}/relays/relay_1_lampu/is_on`), state)
                await set(ref(rtdb, `nodes/${mac}/relays/relay_1_lampu/mode`), "manual")
                
                await set(ref(rtdb, `nodes/${mac}/relays/relay_2_kipas/is_on`), state)
                await set(ref(rtdb, `nodes/${mac}/relays/relay_2_kipas/mode`), "manual")
                
                await set(ref(rtdb, `nodes/${mac}/relays/relay_3_stopkontak/is_on`), state)
                await set(ref(rtdb, `nodes/${mac}/relays/relay_3_stopkontak/mode`), "manual")
              }
            })
          }
        } catch (err) {
          console.error("Hardware bulk sync failed", err)
        }

      } else {
        await new Promise((resolve) => setTimeout(resolve, 300))
      }

      toast.success(`Semua alat di ${roomName} sukses diubah ke ${state ? "ON" : "OFF"}!`)

      if (typeof window !== "undefined") {
        const newLog = {
          id: `log_live_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          deviceId: "bulk",
          deviceTitle: `All Devices (${roomName})`,
          action: state ? "Turned ON" : "Turned OFF",
          timestamp: new Date().toISOString(),
          adminName: session?.user?.name || "Admin Gedung",
          adminEmail: "Bulk Action Override",
        }

        const existingLogsStr = localStorage.getItem("smart-campus-logs")
        let existingLogs = []
        if (existingLogsStr) {
          try {
            existingLogs = JSON.parse(existingLogsStr)
          } catch (e) {
            existingLogs = []
          }
        }
        existingLogs.unshift(newLog)
        localStorage.setItem("smart-campus-logs", JSON.stringify(existingLogs))

        if (isFirebaseReady && rtdb) {
          // Resolve roomId correctly based on context (deviceId for single toggle, roomName for bulk)
          const targetRoom = typeof roomName !== 'undefined' ? roomName : '';
            
          const deviceObj = devices.find(d => d.location === targetRoom);
          const roomId = deviceObj?.id?.split("-")[0] || "unknown";
          await set(ref(rtdb, `room_automation/${roomId}`), false);
        } else {
          setRoomAutomation((prev) => {
            const targetRoom = typeof roomName !== 'undefined' ? roomName : '';
              
            const deviceObj = devices.find(d => d.location === targetRoom);
            const roomId = deviceObj?.id?.split("-")[0] || "unknown";
            const next = { ...prev, [roomId]: false };
            localStorage.setItem("smart-campus-room-automation", JSON.stringify(next));
            return next;
          });
        }
      }
    } catch (err) {
      console.error("[useDevices] Bulk toggle failed:", err)
      setDevices(previousDevices)
      if (typeof window !== "undefined") {
        localStorage.setItem("smart-campus-devices", JSON.stringify(previousDevices))
      }
      toast.error(`Gagal mengubah status semua perangkat di ${roomName}.`)
    } finally {
      setToggling(null)
    }
  }

  const toggleRoomAutomation = async (roomId: string) => {
    const currentState = roomAutomation[roomId] !== false
    const nextState = !currentState

    try {
      if (isFirebaseReady && rtdb) {
        await set(ref(rtdb, `room_automation/${roomId}`), nextState)
      } else {
        setRoomAutomation((prev) => {
          const next = { ...prev, [roomId]: nextState }
          if (typeof window !== "undefined") {
            localStorage.setItem("smart-campus-room-automation", JSON.stringify(next))
          }
          return next
        })
      }

      if (typeof window !== "undefined") {
        const roomName = devices.find(d => d.id.startsWith(roomId))?.location || roomId;
        const newLog = {
          id: `log_live_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          deviceId: "automation",
          deviceTitle: `AI Automation (${roomName})`,
          action: nextState ? "Turned ON" : "Turned OFF (Manual Override locked)",
          timestamp: new Date().toISOString(),
          adminName: session?.user?.name || "Admin Gedung",
          adminEmail: nextState ? "AI Auto Mode" : "Manual Override Mode",
        }

        const existingLogsStr = localStorage.getItem("smart-campus-logs")
        let existingLogs = []
        if (existingLogsStr) {
          try {
            existingLogs = JSON.parse(existingLogsStr)
          } catch (e) {
            existingLogs = []
          }
        }
        existingLogs.unshift(newLog)
        localStorage.setItem("smart-campus-logs", JSON.stringify(existingLogs))
      }

      toast.success(`Mode otomatisasi AI sukses diubah ke ${nextState ? "AUTO" : "MANUAL OVERRIDE"}!`)
    } catch (err) {
      console.error("[useDevices] Toggle automation failed:", err)
      toast.error("Gagal mengubah mode otomatisasi AI.")
    }
  }

  const triggerDailyAutoRevert = async () => {
    const initial: Record<string, boolean> = {}
    devices.forEach((d) => {
      const roomId = d.id.split("-")[0]
      initial[roomId] = true
    })
    
    try {
      if (isFirebaseReady && rtdb) {
        await set(ref(rtdb, "room_automation"), initial)
      } else {
        setRoomAutomation(initial)
        if (typeof window !== "undefined") {
          localStorage.setItem("smart-campus-room-automation", JSON.stringify(initial))
        }
      }

      if (typeof window !== "undefined") {
        const newLog = {
          id: `log_live_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          deviceId: "cron",
          deviceTitle: "System Cron Job (00:00 WIB)",
          action: "Daily Auto-Revert executed",
          timestamp: new Date().toISOString(),
          adminName: "System Backend Service",
          adminEmail: "Hadoop & Python Daemon",
        }

        const existingLogsStr = localStorage.getItem("smart-campus-logs")
        let existingLogs = []
        if (existingLogsStr) {
          try {
            existingLogs = JSON.parse(existingLogsStr)
          } catch (e) {
            existingLogs = []
          }
        }
        existingLogs.unshift(newLog)
        localStorage.setItem("smart-campus-logs", JSON.stringify(existingLogs))
      }

      toast.success("Daily Auto-Revert sukses! Semua ruangan dikembalikan ke mode AI Auto.")
    } catch (err) {
      console.error("[useDevices] Daily auto revert failed:", err)
      toast.error("Gagal menjalankan Daily Auto-Revert.")
    }
  }

  const initializeFirebaseData = async () => {
    if (!isFirebaseReady || !rtdb) {
      toast.error("Firebase tidak siap atau dalam mode offline.")
      return
    }

    setLoading(true)
    try {
      const response = await fetch("/api/buildings")
      if (!response.ok) {
        throw new Error("Failed to load buildings from server")
      }
      const buildingsData = await response.json()

      const generatedDevices: Device[] = []
      const roomsList: string[] = []

      buildingsData.forEach((building: any) => {
        (building.rooms || []).forEach((room: any) => {
          const roomCode = room.code || room.id
          const roomName = room.name
          roomsList.push(roomName)

          generatedDevices.push({
            id: `${roomCode}-lamp`,
            title: "Classroom Lamp",
            description: "Main lighting system for the classroom area",
            powerUsage: 120,
            location: roomName,
            isOn: false,
            lastUpdated: new Date().toISOString()
          })
          generatedDevices.push({
            id: `${roomCode}-acFan`,
            title: "AC / Fan System",
            description: "Climate control and ventilation unit",
            powerUsage: 850,
            location: roomName,
            isOn: false,
            lastUpdated: new Date().toISOString()
          })
          generatedDevices.push({
            id: `${roomCode}-pcProjector`,
            title: "PC / Projector Socket",
            description: "Power outlet for computing equipment",
            powerUsage: 450,
            location: roomName,
            isOn: false,
            lastUpdated: new Date().toISOString()
          })
        })
      })

      // 1. Seed `/devices` node
      const devicesRef = ref(rtdb, "devices")
      const deviceObj = generatedDevices.reduce((acc, d) => {
        acc[d.id] = d
        return acc
      }, {} as Record<string, Device>)
      await set(devicesRef, deviceObj)

      // 2. Seed `/room_automation` node
      const autoRef = ref(rtdb, "room_automation")
      const initialAuto: Record<string, boolean> = {}
      buildingsData.forEach((building: any) => {
        (building.rooms || []).forEach((room: any) => {
          initialAuto[room.id] = true
        })
      })
      await set(autoRef, initialAuto)

      toast.success("Inisialisasi data default ke Firebase berhasil!")
    } catch (err) {
      console.error("[useDevices] Inisialisasi Firebase gagal:", err)
      toast.error("Gagal menginisialisasi data default ke Firebase.")
    } finally {
      setLoading(false)
    }
  }

  return {
    devices,
    loading,
    connected,
    toggling,
    toggleDevice,
    setAllDevices,
    roomAutomation,
    toggleRoomAutomation,
    triggerDailyAutoRevert,
    isFirebaseReady,
    initializeFirebaseData,
  }
}
