"use client"

import { useState } from "react"
import { useBuildings } from "./use-buildings"
import { Building } from "@/features/building-management"
import { toast } from "sonner"

export function useBuildingManagement() {
  const {
    buildingsList,
    loading,
    code,
    setCode,
    name,
    setName,
    floorsCount,
    setFloorsCount,
    isSubmitting,
    editingBuildingId,
    handleStartEdit,
    handleCancelEdit,
    handleDeleteBuilding,
    loadBuildings,
  } = useBuildings()

  // Search & Filter & Pagination states
  const [searchQuery, setSearchQuery] = useState("")
  const [floorFilter, setFloorFilter] = useState("all")
  const [buildingStatusFilter, setBuildingStatusFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  // Dialog visual states
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [viewedBuilding, setViewedBuilding] = useState<Building | null>(null)
  const [editedBuilding, setEditedBuilding] = useState<Building | null>(null)
  const [buildingToDelete, setBuildingToDelete] = useState<string | null>(null)

  // Edit dialog states
  const [editCode, setEditCode] = useState("")
  const [editName, setEditName] = useState("")
  const [editFloorsCount, setEditFloorsCount] = useState("")
  const [editSubmitting, setEditSubmitting] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)

  // Validations
  const isCodeValid = code && code.trim().length >= 2
  const isNameValid = name && name.trim().length >= 3
  const isFormValid = isCodeValid && isNameValid && floorsCount && parseInt(floorsCount, 10) >= 1 && !serverError
  
  const isEditCodeValid = editCode && editCode.trim().length >= 2
  const isEditNameValid = editName && editName.trim().length >= 3
  const isEditFormValid = isEditCodeValid && isEditNameValid && editFloorsCount && parseInt(editFloorsCount, 10) >= 1 && !serverError

  // Trigger Add Building Submit
  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setServerError(null)
    const floors = parseInt(floorsCount, 10)
    try {
      const response = await fetch("/api/buildings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: code.trim().toUpperCase(), name: name.trim(), floorsCount: floors }),
      })
      const result = await response.json()
      if (!response.ok) { 
        const errMsg = result.error || "Gagal mendaftarkan gedung"
        setServerError(errMsg)
        toast.error(errMsg)
        return 
      }
      toast.success(`Gedung ${name} berhasil didaftarkan!`)
      setIsAddDialogOpen(false)
      setCode("")
      setName("")
      setFloorsCount("")
      await loadBuildings()
    } catch (err: any) { 
      setServerError("Terjadi kesalahan koneksi")
      toast.error("Terjadi kesalahan jaringan")
    }
  }

  // Submit Edit Building
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setEditSubmitting(true); setServerError(null)
    try {
      const response = await fetch("/api/buildings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: editedBuilding?.id, code: editCode.trim().toUpperCase(), name: editName.trim(), floorsCount: parseInt(editFloorsCount, 10) }),
      })
      const result = await response.json()
      if (!response.ok) { 
        toast.error(result.error || "Gagal memperbarui gedung")
        setServerError("Gagal")
        return 
      }
      toast.success("Gedung berhasil diperbarui!")
      handleCancelEdit()
      setEditedBuilding(null)
      await loadBuildings()
    } catch (err: any) {
      toast.error("Terjadi kesalahan jaringan")
    } finally { setEditSubmitting(false) }
  }

  // Trigger Edit Modal Opening
  const handleTriggerEdit = (building: Building) => {
    setEditedBuilding(building)
    setEditCode(building.code || "")
    setEditName(building.name)
    setEditFloorsCount(building.floorsCount.toString())
    setServerError(null)
    handleStartEdit(building)
  }

  const handleDeleteWrapper = (id: string) => {
    setBuildingToDelete(id)
  }

  const handleConfirmDelete = async () => {
    if (buildingToDelete) { 
      const success = await handleDeleteBuilding(buildingToDelete)
      if (success) {
        setBuildingToDelete(null)
        await loadBuildings()
      }
    }
  }

  // Filter buildings
  const filteredBuildings = buildingsList.filter((b) => {
    const matchesSearch = b.name.toLowerCase().includes(searchQuery.toLowerCase()) || b.id.toLowerCase().includes(searchQuery.toLowerCase())
    let matchesFloor = true
    if (floorFilter === "1-2") matchesFloor = b.floorsCount >= 1 && b.floorsCount <= 2
    else if (floorFilter === "3-4") matchesFloor = b.floorsCount >= 3 && b.floorsCount <= 4
    else if (floorFilter === "5+") matchesFloor = b.floorsCount >= 5
    let matchesStatus = true
    if (buildingStatusFilter === "online") matchesStatus = b.activeDevicesCount > 0
    else if (buildingStatusFilter === "offline") matchesStatus = b.activeDevicesCount === 0
    return matchesSearch && matchesFloor && matchesStatus
  })

  const totalItems = filteredBuildings.length
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems)

  const paginatedBuildings = filteredBuildings.slice(startIndex, endIndex)

  return {
    buildingsList, loading, code, setCode, name, setName, floorsCount, setFloorsCount, isSubmitting,
    isAddDialogOpen, setIsAddDialogOpen, viewedBuilding, setViewedBuilding, editedBuilding, setEditedBuilding,
    editCode, setEditCode, editName, setEditName, editFloorsCount, setEditFloorsCount, editSubmitting,
    isFormValid, isEditFormValid, handleAddSubmit, handleTriggerEdit, handleEditSubmit,
    handleDeleteWrapper, buildingToDelete, setBuildingToDelete,
    handleConfirmDelete, searchQuery, setSearchQuery, floorFilter, setFloorFilter, buildingStatusFilter, setBuildingStatusFilter,
    currentPage, setCurrentPage,
    paginatedBuildings, totalItems, totalPages, startIndex, endIndex,
    handleCancelEdit: () => { handleCancelEdit(); setServerError(null) },
    filteredBuildings, serverError,
  }
}
