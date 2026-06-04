"use client"

import { useState, useEffect, useMemo } from "react"
import { Building } from "@/features/building-management/types/building"
import { toast } from "sonner"
import { rtdb } from "@/lib/firebase"
import { ref, onValue } from "firebase/database"

export function useBuildings() {
  const [buildingsList, setBuildingsList] = useState<Building[]>([])
  const [loading, setLoading] = useState(true)
  const [nodeCounts, setNodeCounts] = useState<Record<string, number>>({})

  // Form states
  const [code, setCode] = useState("")
  const [name, setName] = useState("")
  const [floorsCount, setFloorsCount] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [editingBuildingId, setEditingBuildingId] = useState<string | null>(null)

  // 📡 REAL-TIME NODE COUNTER (FIREBASE RTDB)
  useEffect(() => {
    if (!rtdb) return

    const nodesRef = ref(rtdb, "nodes")
    const unsubscribe = onValue(nodesRef, (snapshot) => {
      const data = snapshot.val()
      if (data) {
        const counts: Record<string, number> = {}
        Object.keys(data).forEach((mac) => {
          const node = data[mac]
          const gId = node.metadata?.gedung_id
          if (gId && node.metadata?.is_registered !== false) {
            counts[gId] = (counts[gId] || 0) + 1
          }
        })
        setNodeCounts(counts)
      } else {
        setNodeCounts({})
      }
    })

    return () => unsubscribe()
  }, [])

  // 🏗️ DATA MERGING: Gabungkan data statis API dengan counter real-time Firebase
  const enrichedBuildings = useMemo(() => {
    return buildingsList.map(b => ({
      ...b,
      activeDevicesCount: nodeCounts[b.id] || 0
    }))
  }, [buildingsList, nodeCounts])

  // 📡 Memuat daftar gedung secara dinamis dari API Server
  const loadBuildings = async () => {
    try {
      const response = await fetch("/api/buildings")
      if (!response.ok) {
        throw new Error("Failed to fetch buildings")
      }
      const data = await response.json()
      setBuildingsList(data)
    } catch (err) {
      console.error("[useBuildings] Fetch failed:", err)
      toast.error("Gagal memuat daftar gedung dari server")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadBuildings()
  }, [])

  // Create or Update Building
  const handleSaveBuilding = async (e: React.FormEvent): Promise<boolean> => {
    if (e) e.preventDefault()

    if (!name.trim() || !floorsCount) {
      toast.error("Mohon isi seluruh field yang diperlukan!")
      return false
    }

    const floors = parseInt(floorsCount, 10)
    if (isNaN(floors) || floors < 1) {
      toast.error("Jumlah lantai harus angka minimal 1!")
      return false
    }

    setIsSubmitting(true)
    try {
      if (editingBuildingId) {
        // Mode edit / update (PUT)
        const response = await fetch("/api/buildings", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: editingBuildingId,
            code: code.trim().toUpperCase(),
            name: name.trim(),
            floorsCount: floors,
          }),
        })

        const result = await response.json()

        if (!response.ok) {
          throw new Error(result.error || "Gagal memperbarui gedung")
        }

        toast.success("Gedung berhasil diperbarui secara persisten!")
        setBuildingsList((prev) =>
          prev.map((b) => (b.id === editingBuildingId ? result : b))
        )
      } else {
        // Mode create (POST)
        const response = await fetch("/api/buildings", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            code: code.trim().toUpperCase(),
            name: name.trim(),
            floorsCount: floors,
          }),
        })

        const result = await response.json()

        if (!response.ok) {
          throw new Error(result.error || "Gagal menyimpan gedung baru")
        }

        toast.success("Gedung baru berhasil didaftarkan secara persisten!")
        setBuildingsList((prev) => [result, ...prev])
      }

      // Reset form
      handleCancelEdit()
      return true
    } catch (error: any) {
      console.error("[useBuildings] Failed to save building:", error)
      toast.error(error.message || "Gagal menyimpan data gedung")
      return false
    } finally {
      setIsSubmitting(false)
    }
  }

  // Edit Trigger
  const handleStartEdit = (building: Building) => {
    setEditingBuildingId(building.id)
    setCode(building.code || "")
    setName(building.name)
    setFloorsCount(building.floorsCount.toString())
  }

  // Cancel/Reset
  const handleCancelEdit = () => {
    setEditingBuildingId(null)
    setCode("")
    setName("")
    setFloorsCount("")
  }

  // Delete Building
  const handleDeleteBuilding = async (id: string): Promise<boolean> => {
    try {
      const response = await fetch(`/api/buildings?id=${id}`, {
        method: "DELETE",
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Gagal menghapus gedung")
      }

      setBuildingsList((prev) => prev.filter((b) => b.id !== id))
      toast.success("Gedung berhasil dihapus dari server!")
      return true
    } catch (error: any) {
      console.error("[useBuildings] Failed to delete building:", error)
      toast.error(error.message || "Gagal menghapus gedung")
      return false
    }
  }

  return {
    buildingsList: enrichedBuildings,
    loading,
    code,
    setCode,
    name,
    setName,
    floorsCount,
    setFloorsCount,
    isSubmitting,
    editingBuildingId,
    handleSaveBuilding,
    handleStartEdit,
    handleCancelEdit,
    handleDeleteBuilding,
    loadBuildings,
  }
}

