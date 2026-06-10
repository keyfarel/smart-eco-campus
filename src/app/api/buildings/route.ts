import { NextResponse } from "next/server"
import { getBuildingsAsync, saveBuildingsAsync } from "@/features/building-management/data/buildings-db"
import { Building } from "@/features/building-management/types/building"

export const dynamic = "force-dynamic"

// GET /api/buildings - Mendapatkan seluruh master data gedung
export async function GET() {
  const buildings = await getBuildingsAsync()
  return NextResponse.json(buildings)
}

// POST /api/buildings - Menambahkan gedung baru
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, code, floorsCount } = body

    if (!name || !code || floorsCount === undefined) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const floors = parseInt(floorsCount, 10)
    if (isNaN(floors) || floors < 1) {
      return NextResponse.json({ error: "Invalid floors count" }, { status: 400 })
    }

    const buildings = await getBuildingsAsync()
    
    // Validasi kesamaan nama gedung
    const nameExists = buildings.some(b => b.name.toLowerCase() === name.trim().toLowerCase())
    if (nameExists) {
      return NextResponse.json({ error: "Gedung dengan nama ini sudah terdaftar" }, { status: 400 })
    }

    // Validasi kesamaan kode gedung
    const codeExists = buildings.some(b => b.code?.toUpperCase() === code.trim().toUpperCase())
    if (codeExists) {
      return NextResponse.json({ error: "Gedung dengan kode ini sudah terdaftar" }, { status: 400 })
    }

    const newId = `gedung_${Math.random().toString(36).substring(2, 11)}`
    const newBuilding: Building = {
      id: newId,
      code: code.trim().toUpperCase(),
      name: name.trim(),
      floorsCount: floors,
      roomsCount: 0,
      activeDevicesCount: 0,
      createdAt: Math.floor(Date.now() / 1000),
      rooms: [],
    }

    buildings.unshift(newBuilding) // Tambah di paling atas
    await saveBuildingsAsync(buildings)

    return NextResponse.json(newBuilding, { status: 201 })
  } catch (error) {
    console.error("[API Buildings POST] Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// PUT /api/buildings - Memperbarui data gedung ATAU Menambahkan ruangan baru
export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { id, name, code, floorsCount, action, newRoom } = body

    if (!id) {
      return NextResponse.json({ error: "Missing building ID" }, { status: 400 })
    }

    const buildings = await getBuildingsAsync()
    const buildingIndex = buildings.findIndex(b => b.id === id)

    if (buildingIndex === -1) {
      return NextResponse.json({ error: "Gedung tidak ditemukan" }, { status: 404 })
    }

    const currentBuilding = buildings[buildingIndex]

    // Kasus 1: Aksi pendaftaran ruangan riil baru di dalam gedung
    if (action === "add_room") {
      const { roomCode, roomName, floor, capacity } = newRoom || {}
      if (!roomCode || !roomName || floor === undefined || capacity === undefined) {
        return NextResponse.json({ error: "Kolom kode ruangan, nama ruangan, lantai, dan kapasitas wajib diisi!" }, { status: 400 })
      }

      const floorNum = parseInt(floor, 10)
      const capNum = parseInt(capacity, 10)

      if (isNaN(floorNum) || floorNum < 1 || floorNum > currentBuilding.floorsCount) {
        return NextResponse.json({ error: `Lantai harus berada di rentang 1 s/d ${currentBuilding.floorsCount} lantai!` }, { status: 400 })
      }

      if (isNaN(capNum) || capNum < 1) {
        return NextResponse.json({ error: "Kapasitas ruangan minimal harus 1 orang!" }, { status: 400 })
      }

      const roomsList = currentBuilding.rooms || []
      
      // Validasi duplikasi Kode Ruangan
      const codeExists = roomsList.some(r => r.code.toUpperCase() === roomCode.trim().toUpperCase())
      if (codeExists) {
        return NextResponse.json({ error: "Kode ruangan ini sudah terdaftar di gedung ini!" }, { status: 400 })
      }

      // Validasi duplikasi nama ruangan di gedung yang sama
      const roomExists = roomsList.some(r => r.name.toLowerCase() === roomName.trim().toLowerCase())
      if (roomExists) {
        return NextResponse.json({ error: "Nama ruangan ini sudah terdaftar di gedung ini!" }, { status: 400 })
      }

      const upperCode = roomCode.trim().toUpperCase()
      const newRoomPayload = {
        id: upperCode,
        code: upperCode,
        name: roomName.trim(),
        floor: floorNum,
        capacity: capNum
      }

      currentBuilding.rooms = [...roomsList, newRoomPayload]
      currentBuilding.roomsCount = currentBuilding.rooms.length

      await saveBuildingsAsync(buildings)
      return NextResponse.json(currentBuilding)
    }

    // Kasus 1.5: Aksi edit data ruangan yang sudah ada
    if (action === "edit_room") {
      const { roomId, roomCode, roomName, floor, capacity } = newRoom || {}
      if (!roomId || !roomCode || !roomName || floor === undefined || capacity === undefined) {
        return NextResponse.json({ error: "Data ruangan tidak lengkap untuk diperbarui!" }, { status: 400 })
      }

      const roomsList = currentBuilding.rooms || []
      const roomIndex = roomsList.findIndex(r => r.id === roomId)

      if (roomIndex === -1) {
        return NextResponse.json({ error: "Ruangan tidak ditemukan di gedung ini!" }, { status: 404 })
      }

      const floorNum = parseInt(floor, 10)
      const capNum = parseInt(capacity, 10)

      if (isNaN(floorNum) || floorNum < 1 || floorNum > currentBuilding.floorsCount) {
        return NextResponse.json({ error: `Lantai harus berada di rentang 1 s/d ${currentBuilding.floorsCount} lantai!` }, { status: 400 })
      }

      // Validasi duplikasi Kode Ruangan (kecuali milik sendiri)
      const codeExists = roomsList.some(r => r.id !== roomId && r.code.toUpperCase() === roomCode.trim().toUpperCase())
      if (codeExists) {
        return NextResponse.json({ error: "Kode ruangan ini sudah terdaftar di ruangan lain di gedung ini!" }, { status: 400 })
      }

      const upperCode = roomCode.trim().toUpperCase()
      roomsList[roomIndex] = {
        ...roomsList[roomIndex],
        code: upperCode,
        name: roomName.trim(),
        floor: floorNum,
        capacity: capNum
      }

      currentBuilding.rooms = [...roomsList]
      await saveBuildingsAsync(buildings)
      return NextResponse.json(currentBuilding)
    }

    // Kasus 1.6: Aksi penghapusan ruangan
    if (action === "delete_room") {
      const { roomId } = newRoom || {}
      if (!roomId) {
        return NextResponse.json({ error: "ID Ruangan wajib disertakan!" }, { status: 400 })
      }

      const roomsList = currentBuilding.rooms || []
      const filteredRooms = roomsList.filter(r => r.id !== roomId)

      if (roomsList.length === filteredRooms.length) {
        return NextResponse.json({ error: "Ruangan tidak ditemukan di gedung ini!" }, { status: 404 })
      }

      currentBuilding.rooms = filteredRooms
      currentBuilding.roomsCount = filteredRooms.length

      await saveBuildingsAsync(buildings)
      return NextResponse.json(currentBuilding)
    }

    // Kasus 2: Aksi default pembaruan metadata gedung
    if (!name || !code || floorsCount === undefined) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const floors = parseInt(floorsCount, 10)
    if (isNaN(floors) || floors < 1) {
      return NextResponse.json({ error: "Invalid floors count" }, { status: 400 })
    }

    // Validasi nama gedung kembar dengan gedung lain
    const nameExists = buildings.some(
      b => b.id !== id && b.name.toLowerCase() === name.trim().toLowerCase()
    )
    if (nameExists) {
      return NextResponse.json({ error: "Gedung dengan nama ini sudah terdaftar" }, { status: 400 })
    }

    // Validasi kode gedung kembar dengan gedung lain
    const codeExists = buildings.some(
      b => b.id !== id && b.code?.toUpperCase() === code.trim().toUpperCase()
    )
    if (codeExists) {
      return NextResponse.json({ error: "Gedung dengan kode ini sudah terdaftar" }, { status: 400 })
    }

    // Perbarui data
    buildings[buildingIndex] = {
      ...currentBuilding,
      code: code.trim().toUpperCase(),
      name: name.trim(),
      floorsCount: floors,
    }

    await saveBuildingsAsync(buildings)

    return NextResponse.json(buildings[buildingIndex])
  } catch (error) {
    console.error("[API Buildings PUT] Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// DELETE /api/buildings - Menghapus gedung dari sistem
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "Missing building ID" }, { status: 400 })
    }

    const buildings = await getBuildingsAsync()
    const exists = buildings.some(b => b.id === id)

    if (!exists) {
      return NextResponse.json({ error: "Gedung tidak ditemukan" }, { status: 404 })
    }

    // Proteksi: jangan hapus gedung default sistem jika diperlukan
    if (id === "gedung_a" || id === "gedung_b") {
      return NextResponse.json({ error: "Gedung default sistem tidak boleh dihapus demi integritas demo" }, { status: 403 })
    }

    const filteredBuildings = buildings.filter(b => b.id !== id)
    await saveBuildingsAsync(filteredBuildings)

    return NextResponse.json({ success: true, message: "Gedung berhasil dihapus" })
  } catch (error) {
    console.error("[API Buildings DELETE] Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}


