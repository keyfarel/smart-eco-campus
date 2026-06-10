"use client"

import { useState, useEffect, useMemo } from "react"
import { useSession } from "next-auth/react"
import { RawFirebaseLog, SystemLog } from "../types/log"
import { rtdb } from "@/lib/firebase"
import { ref, onValue } from "firebase/database"

const ITEMS_PER_PAGE = 8

// Daftar Master Data Gedung sesuai sitemap dan topologi SDD
export const BUILDINGS_LIST = [
  { id: "all", name: "Semua Gedung" },
  { id: "gedung_a", name: "Gedung Sipil" },
  { id: "gedung_b", name: "Gedung Elektro" }
]

export function useSystemLogs() {
  const { data: session } = useSession()
  const userRole = session?.user?.role || "ADMIN_GEDUNG"
  const assignedGedung = session?.user?.assignedGedung || "gedung_a"

  const [rawLogs, setRawLogs] = useState<Record<string, Record<string, RawFirebaseLog>>>({})
  const [nodesMetadata, setNodesMetadata] = useState<Record<string, any>>({})
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [dateFilter, setDateFilter] = useState("all")
  const [buildingFilter, setBuildingFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)

  // Identifikasi nama gedung penugasan dinamis untuk kelengkapan visual Admin Gedung
  const assignedGedungName = useMemo(() => {
    const building = BUILDINGS_LIST.find((b) => b.id === assignedGedung)
    return building ? building.name : "Gedung Penugasan"
  }, [assignedGedung])

  // 📡 REAL-TIME FIREBASE RTDB CONNECTION
  useEffect(() => {
    if (!rtdb) {
      setLoading(false)
      return
    }

    const logsRef = ref(rtdb, "logs")
    const nodesRef = ref(rtdb, "nodes")

    // Listen to metadata first for mapping
    const unsubscribeNodes = onValue(nodesRef, (snapshot) => {
      const data = snapshot.val()
      if (data) {
        const meta: Record<string, any> = {}
        Object.keys(data).forEach((mac) => {
          meta[mac] = data[mac].metadata || data[mac]
        })
        setNodesMetadata(meta)
      }
    })

    // Listen to logs
    const unsubscribeLogs = onValue(logsRef, (snapshot) => {
      setRawLogs(snapshot.val() || {})
      setLoading(false)
    }, (error) => {
      console.error("[useSystemLogs] Firebase RTDB Error:", error)
      setLoading(false)
    })

    return () => {
      unsubscribeNodes()
      unsubscribeLogs()
    }
  }, [])

  // Perataan (Flattening) data bersarang ke flat array SystemLog & Pemfilteran Keamanan (RBAC)
  const flattenedLogs = useMemo(() => {
    const list: SystemLog[] = []

    Object.keys(rawLogs).forEach((mac) => {
      const nodeMeta = nodesMetadata[mac]
      if (!nodeMeta) return

      // 1. Jika peran adalah ADMIN_GEDUNG, saring log hanya untuk gedung yang ditugaskan (Isolasi Data RBAC)
      if (userRole === "ADMIN_GEDUNG" && nodeMeta.gedung_id !== assignedGedung) {
        return
      }

      // 2. Jika peran adalah SUPER_ADMIN, saring berdasarkan filter gedung dinamis yang dipilih
      if (userRole === "SUPER_ADMIN" && buildingFilter !== "all" && nodeMeta.gedung_id !== buildingFilter) {
        return
      }

      const deviceLogs = rawLogs[mac]
      Object.keys(deviceLogs).forEach((logId) => {
        const rawLog = deviceLogs[logId]

        // Identifikasi jenis perangkat berdasarkan relay_id untuk pemetaan ikon di tabel
        let deviceId = "pcProjector"
        let deviceTitle = nodeMeta.display_name || "Unknown Room"

        if (rawLog.relay_id.includes("lampu")) {
          deviceId = "lamp"
          deviceTitle += " - Lampu"
        } else if (rawLog.relay_id.includes("kipas")) {
          deviceId = "acFan"
          deviceTitle += " - AC & Kipas"
        } else if (rawLog.relay_id.includes("stopkontak")) {
          deviceId = "pcProjector"
          deviceTitle += " - Stopkontak"
        }

        // Konversi Epoch Seconds ke ISO String
        const isoTimestamp = new Date(rawLog.timestamp * 1000).toISOString()

        list.push({
          id: logId,
          macAddress: mac,
          deviceId,
          deviceTitle,
          action: rawLog.action === "ON" ? "Turned ON" : "Turned OFF",
          timestamp: isoTimestamp,
          adminName: rawLog.triggered_by,
          adminEmail: rawLog.reason
        })
      })
    })

    // Pengurutan log berdasarkan waktu terbaru (Descending)
    return list.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
  }, [rawLogs, nodesMetadata, userRole, assignedGedung, buildingFilter])

  const [actionFilter, setActionFilter] = useState("all")
  const [triggerFilter, setTriggerFilter] = useState("all")

  // Filter Kata Kunci & Retensi Data 30 Hari
  const filteredLogs = useMemo(() => {
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    return flattenedLogs.filter((log) => {
      const logDate = new Date(log.timestamp)

      // Retensi log maksimum 30 hari sesuai aturan bisnis PRD
      if (logDate < thirtyDaysAgo) return false

      // Penyaringan Pencarian
      const matchesSearch =
        log.deviceTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.adminName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.adminEmail.toLowerCase().includes(searchQuery.toLowerCase())

      // Penyaringan Tanggal Dinamis (Harian, Mingguan, Bulanan)
      let matchesDate = true
      const today = new Date()

      if (dateFilter === "today") {
        matchesDate = logDate.toDateString() === today.toDateString()
      } else if (dateFilter === "yesterday") {
        const yesterday = new Date()
        yesterday.setDate(today.getDate() - 1)
        matchesDate = logDate.toDateString() === yesterday.toDateString()
      } else if (dateFilter === "last7") {
        const sevenDaysAgo = new Date()
        sevenDaysAgo.setDate(today.getDate() - 7)
        matchesDate = logDate >= sevenDaysAgo
      } else if (dateFilter === "last30") {
        const thirtyDaysAgoFilter = new Date()
        thirtyDaysAgoFilter.setDate(today.getDate() - 30)
        matchesDate = logDate >= thirtyDaysAgoFilter
      }

      // Penyaringan Action
      let matchesAction = true
      if (actionFilter === "on") matchesAction = log.action === "Turned ON"
      else if (actionFilter === "off") matchesAction = log.action === "Turned OFF"

      // Penyaringan Trigger
      let matchesTrigger = true
      const isAI = log.adminName.toLowerCase().includes("ai") || log.adminName.toLowerCase().includes("system")
      if (triggerFilter === "ai") matchesTrigger = isAI
      else if (triggerFilter === "manual") matchesTrigger = !isAI

      return matchesSearch && matchesDate && matchesAction && matchesTrigger
    })
  }, [flattenedLogs, searchQuery, dateFilter, actionFilter, triggerFilter])

  // Perhitungan Pagination
  const totalPages = Math.ceil(filteredLogs.length / ITEMS_PER_PAGE)
  const paginatedLogs = useMemo(() => {
    return filteredLogs.slice(
      (currentPage - 1) * ITEMS_PER_PAGE,
      currentPage * ITEMS_PER_PAGE
    )
  }, [filteredLogs, currentPage])

  // Reset halaman saat filter pencarian, tanggal, atau gedung berubah
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, dateFilter, buildingFilter, actionFilter, triggerFilter])

  // Hitung Statistik Log Berdasarkan Hasil Pemetaan
  const stats = useMemo(() => {
    const onActions = flattenedLogs.filter((log) => log.action === "Turned ON").length
    const offActions = flattenedLogs.filter((log) => log.action === "Turned OFF").length
    return { onActions, offActions, total: flattenedLogs.length }
  }, [flattenedLogs])

  const isSuperAdmin = userRole === "SUPER_ADMIN"

  const handleResetFilters = () => {
    setSearchQuery("")
    setDateFilter("all")
    setActionFilter("all")
    setTriggerFilter("all")
    if (isSuperAdmin) {
      setBuildingFilter("all")
    }
  }

  return {
    loading,
    searchQuery,
    setSearchQuery,
    dateFilter,
    setDateFilter,
    buildingFilter,
    setBuildingFilter,
    actionFilter,
    setActionFilter,
    triggerFilter,
    setTriggerFilter,
    currentPage,
    setCurrentPage,
    totalPages,
    filteredLogsCount: filteredLogs.length,
    paginatedLogs,
    stats,
    userRole,
    isSuperAdmin,
    assignedGedungName,
    handleResetFilters,
  }
}
