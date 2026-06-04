"use client"

import { useState, useEffect } from "react"
import { useBuildings } from "./use-buildings"
import { Building, Room } from "@/features/building-management/types/building"
import { toast } from "sonner"

export function useBuildingManagementState() {
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
    handleSaveBuilding,
    handleStartEdit,
    handleCancelEdit,
    handleDeleteBuilding,
    loadBuildings,
  } = useBuildings()

  // Search & Filter & Pagination states
  const [activeTab, setActiveTab] = useState("buildings")
  const [searchQuery, setSearchQuery] = useState("")
  const [floorFilter, setFloorFilter] = useState("all")
  const [buildingStatusFilter, setBuildingStatusFilter] = useState("all")
  const [roomBuildingFilter, setRoomBuildingFilter] = useState("all")
  const [roomFloorFilter, setRoomFloorFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  // Dialog visual states
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [viewedBuilding, setViewedBuilding] = useState<Building | null>(null)
  const [editedBuilding, setEditedBuilding] = useState<Building | null>(null)

  // Sub-dialog Add Room states
  const [isAddRoomOpen, setIsAddRoomOpen] = useState(false)
  const [isAddingFromHeader, setIsAddingFromHeader] = useState(false)
  const [roomFormBuildingId, setRoomFormBuildingId] = useState("")
  const [newRoomCode, setNewRoomCode] = useState("")
  const [newRoomName, setNewRoomName] = useState("")
  const [newRoomFloor, setNewRoomFloor] = useState("1")
  const [newRoomCapacity, setNewRoomCapacity] = useState("30")
  const [isAddingRoom, setIsAddingRoom] = useState(false)

  // Edit dialog states
  const [editCode, setEditCode] = useState("")
  const [editName, setEditName] = useState("")
  const [editFloorsCount, setEditFloorsCount] = useState("")
  const [editSubmitting, setEditSubmitting] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)
  const [buildingToDelete, setBuildingToDelete] = useState<string | null>(null)

  // Edit Room states
  const [isEditRoomOpen, setIsEditRoomOpen] = useState(false)
  const [editingRoom, setEditingRoom] = useState<Room | null>(null)
  const [editRoomCode, setEditRoomCode] = useState("")
  const [editRoomName, setEditRoomName] = useState("")
  const [editRoomFloor, setEditRoomFloor] = useState("1")
  const [editRoomCapacity, setEditRoomCapacity] = useState("30")
  const [isEditingRoom, setIsEditingRoom] = useState(false)
  
  // Room Detail states
  const [viewedRoom, setViewedRoom] = useState<(Room & { buildingName?: string; buildingId?: string }) | null>(null)
  
  // Context state to store building info for room forms
  const [roomContextBuilding, setRoomContextBuilding] = useState<Building | null>(null)

  // Get active building object for selected room form
  const selectedBuildingObj = buildingsList.find(b => b.id === roomFormBuildingId) || roomContextBuilding
  const formMaxFloors = selectedBuildingObj ? selectedBuildingObj.floorsCount : 1

  // Validations
  const isCodeValid = code && code.trim().length >= 2
  const isNameValid = name && name.trim().length >= 3
  const isFormValid = isCodeValid && isNameValid && floorsCount && parseInt(floorsCount, 10) >= 1 && !serverError
  
  const isEditCodeValid = editCode && editCode.trim().length >= 2
  const isEditNameValid = editName && editName.trim().length >= 3
  const isEditFormValid = isEditCodeValid && isEditNameValid && editFloorsCount && parseInt(editFloorsCount, 10) >= 1 && !serverError

  const isRoomFormValid = (isAddingFromHeader ? roomFormBuildingId.length > 0 : true) && newRoomCode.length >= 3 && newRoomName.length >= 3
  const isEditRoomFormValid = editRoomCode.length >= 3 && editRoomName.length >= 3

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

  // Submit Add Room
  const handleAddRoomSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const targetBuildingId = isAddingFromHeader ? roomFormBuildingId : viewedBuilding?.id
    if (!targetBuildingId) { 
      toast.error("Pilih gedung!")
      return 
    }
    setIsAddingRoom(true); setServerError(null)
    try {
      const response = await fetch("/api/buildings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: targetBuildingId, action: "add_room",
          newRoom: { roomCode: newRoomCode.trim().toUpperCase(), roomName: newRoomName.trim(), floor: parseInt(newRoomFloor, 10), capacity: parseInt(newRoomCapacity, 10) }
        }),
      })
      const result = await response.json()
      if (!response.ok) { 
        toast.error(result.error || "Gagal menambahkan ruangan")
        setServerError("Gagal")
        return 
      }
      toast.success(`Ruangan ${newRoomName} berhasil ditambahkan!`)
      setIsAddRoomOpen(false)
      setNewRoomCode("")
      setNewRoomName("")
      await loadBuildings()
    } catch (err: any) {
      toast.error("Terjadi kesalahan jaringan")
    } finally { setIsAddingRoom(false) }
  }

  // Trigger Edit Room Opening
  const handleTriggerEditRoom = (room: Room) => {
    setEditingRoom(room); setEditRoomCode(room.code); setEditRoomName(room.name)
    setEditRoomFloor(room.floor.toString()); setEditRoomCapacity(room.capacity.toString())
    setServerError(null); setIsEditRoomOpen(true)
  }

  // Submit Edit Room
  const handleEditRoomSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setIsEditingRoom(true); setServerError(null)
    try {
      const response = await fetch("/api/buildings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: roomContextBuilding?.id || viewedBuilding?.id || roomFormBuildingId,
          action: "edit_room",
          newRoom: { roomId: editingRoom?.id, roomCode: editRoomCode.trim().toUpperCase(), roomName: editRoomName.trim(), floor: parseInt(editRoomFloor, 10), capacity: parseInt(editRoomCapacity, 10) }
        }),
      })
      const result = await response.json()
      if (!response.ok) { 
        toast.error(result.error || "Gagal memperbarui ruangan")
        setServerError("Gagal")
        return 
      }
      toast.success("Data ruangan berhasil diperbarui!")
      setIsEditRoomOpen(false)
      setRoomContextBuilding(null)
      await loadBuildings()
    } catch (err: any) {
      toast.error("Terjadi kesalahan jaringan")
    } finally { setIsEditingRoom(false) }
  }

  // Handle Delete Room
  const handleDeleteRoom = async (roomId: string, buildingId: string) => {
    if (!confirm("Hapus ruangan secara permanen?")) return
    try {
      const response = await fetch("/api/buildings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: buildingId, action: "delete_room", newRoom: { roomId } }),
      })
      const result = await response.json()
      if (!response.ok) {
        throw new Error(result.error || "Gagal menghapus ruangan")
      }
      toast.success("Ruangan berhasil dihapus!")
      await loadBuildings()
    } catch (err: any) { 
      toast.error(err.message || "Gagal menghapus ruangan")
    }
  }

  const handleOpenAddRoomFromBlueprint = () => {
    if (!viewedBuilding) return
    setIsAddingFromHeader(false); setRoomFormBuildingId(viewedBuilding.id); setRoomContextBuilding(viewedBuilding)
    setNewRoomFloor("1"); setNewRoomCode(""); setNewRoomName(""); setNewRoomCapacity("30"); setIsAddRoomOpen(true)
  }

  const handleOpenAddRoomFromHeader = () => {
    setIsAddingFromHeader(true); const initialBuilding = buildingsList[0] || null
    setRoomFormBuildingId(initialBuilding?.id || ""); setRoomContextBuilding(initialBuilding)
    setNewRoomFloor("1"); setNewRoomCode(""); setNewRoomName(""); setNewRoomCapacity("30"); setIsAddRoomOpen(true)
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

  // filter buildings
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

  const totalBuildings = filteredBuildings.length
  
  // Room Directory Logic
  const allRooms = buildingsList.flatMap((b) =>
    (b.rooms || []).map((r) => ({ ...r, buildingName: b.name, buildingId: b.id }))
  )

  const filteredRooms = allRooms.filter((r) => {
    const matchesSearch = r.name.toLowerCase().includes(searchQuery.toLowerCase()) || r.code.toLowerCase().includes(searchQuery.toLowerCase()) || r.buildingName.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesBuilding = roomBuildingFilter === "all" || r.buildingId === roomBuildingFilter
    const matchesFloor = roomFloorFilter === "all" || r.floor.toString() === roomFloorFilter
    return matchesSearch && matchesBuilding && matchesFloor
  })

  const totalRoomsCount = filteredRooms.length
  const isBuildingTab = activeTab === "buildings"
  const totalItems = isBuildingTab ? totalBuildings : totalRoomsCount
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems)

  const paginatedBuildings = filteredBuildings.slice(startIndex, endIndex)
  const paginatedRooms = filteredRooms.slice(startIndex, endIndex)

  const handleEditRoomFromDirectory = (room: Room, buildingId: string) => {
    const b = buildingsList.find(building => building.id === buildingId) || null
    setRoomContextBuilding(b); setRoomFormBuildingId(buildingId); handleTriggerEditRoom(room)
  }

  const handleViewRoomDetail = (room: Room, buildingId?: string) => {
    const bName = buildingId ? buildingsList.find(b => b.id === buildingId)?.name : (room as any).buildingName
    setViewedRoom({ ...room, buildingName: bName, buildingId })
  }

  const handleTriggerEditFromDetail = (room: Room) => {
    const bId = viewedRoom?.buildingId || (room as any).buildingId
    const b = buildingsList.find(building => building.id === bId) || null
    setRoomContextBuilding(b); setRoomFormBuildingId(bId || ""); setViewedRoom(null); handleTriggerEditRoom(room)
  }

  return {
    buildingsList, loading, code, setCode, name, setName, floorsCount, setFloorsCount, isSubmitting,
    isAddDialogOpen, setIsAddDialogOpen, viewedBuilding, setViewedBuilding, editedBuilding, setEditedBuilding,
    isAddRoomOpen, setIsAddRoomOpen, isAddingFromHeader, roomFormBuildingId, setRoomFormBuildingId,
    newRoomCode, setNewRoomCode, newRoomName, setNewRoomName, newRoomFloor, setNewRoomFloor, newRoomCapacity, setNewRoomCapacity,
    isAddingRoom, isEditRoomOpen, setIsEditRoomOpen, editingRoom, editRoomCode, setEditRoomCode, editRoomName, setEditRoomName,
    editRoomFloor, setEditRoomFloor, editRoomCapacity, setEditRoomCapacity, isEditingRoom,
    isEditRoomFormValid, handleTriggerEditRoom, handleEditRoomFromDirectory, handleEditRoomSubmit, handleDeleteRoom,
    editCode, setEditCode, editName, setEditName, editFloorsCount, setEditFloorsCount, editSubmitting,
    isFormValid, isEditFormValid, isRoomFormValid, handleAddSubmit, handleTriggerEdit, handleEditSubmit, handleAddRoomSubmit,
    handleOpenAddRoomFromBlueprint, handleOpenAddRoomFromHeader, handleDeleteWrapper, buildingToDelete, setBuildingToDelete,
    handleConfirmDelete, searchQuery, setSearchQuery, floorFilter, setFloorFilter, buildingStatusFilter, setBuildingStatusFilter,
    roomBuildingFilter, setRoomBuildingFilter, roomFloorFilter, setRoomFloorFilter, currentPage, setCurrentPage,
    paginatedBuildings, allRooms: paginatedRooms, totalItems, totalPages, startIndex, endIndex,
    handleCancelEdit: () => { handleCancelEdit(); setServerError(null) },
    filteredBuildings, serverError, activeTab, setActiveTab, roomContextBuilding, setRoomContextBuilding,
    viewedRoom, setViewedRoom, handleViewRoomDetail, handleTriggerEditFromDetail,
    formMaxFloors
  }
}

