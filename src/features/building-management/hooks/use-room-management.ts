"use client"

import { useState } from "react"
import { useBuildings } from "./use-buildings"
import { Building, Room } from "@/features/building-management/types/building"
import { toast } from "sonner"

export function useRoomManagement() {
  const {
    buildingsList,
    loading,
    loadBuildings,
  } = useBuildings()

  // Search & Filter & Pagination states
  const [searchQuery, setSearchQuery] = useState("")
  const [roomBuildingFilter, setRoomBuildingFilter] = useState("all")
  const [roomFloorFilter, setRoomFloorFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  // Sub-dialog Add Room states
  const [isAddRoomOpen, setIsAddRoomOpen] = useState(false)
  const [roomFormBuildingId, setRoomFormBuildingId] = useState("")
  const [newRoomCode, setNewRoomCode] = useState("")
  const [newRoomName, setNewRoomName] = useState("")
  const [newRoomFloor, setNewRoomFloor] = useState("1")
  const [newRoomCapacity, setNewRoomCapacity] = useState("30")
  const [isAddingRoom, setIsAddingRoom] = useState(false)

  // Edit Room states
  const [isEditRoomOpen, setIsEditRoomOpen] = useState(false)
  const [editingRoom, setEditingRoom] = useState<Room | null>(null)
  const [editRoomCode, setEditRoomCode] = useState("")
  const [editRoomName, setEditRoomName] = useState("")
  const [editRoomFloor, setEditRoomFloor] = useState("1")
  const [editRoomCapacity, setEditRoomCapacity] = useState("30")
  const [isEditingRoom, setIsEditingRoom] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)
  
  // Room Detail states
  const [viewedRoom, setViewedRoom] = useState<(Room & { buildingName?: string; buildingId?: string }) | null>(null)
  
  // Context state to store building info for room forms
  const [roomContextBuilding, setRoomContextBuilding] = useState<Building | null>(null)

  // Get active building object for selected room form
  const selectedBuildingObj = buildingsList.find(b => b.id === roomFormBuildingId) || roomContextBuilding
  const formMaxFloors = selectedBuildingObj ? selectedBuildingObj.floorsCount : 1

  // Validations
  const isRoomFormValid = roomFormBuildingId.length > 0 && newRoomCode.length >= 3 && newRoomName.length >= 3
  const isEditRoomFormValid = editRoomCode.length >= 3 && editRoomName.length >= 3

  // Submit Add Room
  const handleAddRoomSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const targetBuildingId = roomFormBuildingId
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
          id: roomContextBuilding?.id || roomFormBuildingId,
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

  const handleOpenAddRoomFromHeader = () => {
    const initialBuilding = buildingsList[0] || null
    setRoomFormBuildingId(initialBuilding?.id || ""); setRoomContextBuilding(initialBuilding)
    setNewRoomFloor("1"); setNewRoomCode(""); setNewRoomName(""); setNewRoomCapacity("30"); setIsAddRoomOpen(true)
  }

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

  const totalItems = filteredRooms.length
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems)

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
    buildingsList, loading,
    isAddRoomOpen, setIsAddRoomOpen, roomFormBuildingId, setRoomFormBuildingId,
    newRoomCode, setNewRoomCode, newRoomName, setNewRoomName, newRoomFloor, setNewRoomFloor, newRoomCapacity, setNewRoomCapacity,
    isAddingRoom, isEditRoomOpen, setIsEditRoomOpen, editingRoom, editRoomCode, setEditRoomCode, editRoomName, setEditRoomName,
    editRoomFloor, setEditRoomFloor, editRoomCapacity, setEditRoomCapacity, isEditingRoom,
    isRoomFormValid, isEditRoomFormValid, handleTriggerEditRoom, handleEditRoomFromDirectory, handleEditRoomSubmit, handleDeleteRoom,
    handleAddRoomSubmit, handleOpenAddRoomFromHeader,
    searchQuery, setSearchQuery, roomBuildingFilter, setRoomBuildingFilter, roomFloorFilter, setRoomFloorFilter, currentPage, setCurrentPage,
    paginatedRooms, allRooms, totalItems, totalPages, startIndex, endIndex,
    serverError, roomContextBuilding, setRoomContextBuilding,
    viewedRoom, setViewedRoom, handleViewRoomDetail, handleTriggerEditFromDetail,
    formMaxFloors
  }
}
