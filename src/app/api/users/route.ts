import { NextResponse } from "next/server"
import { getUsersAsync, saveUsersAsync } from "@/features/auth/data/users-db"
import { UserRecord } from "@/features/auth/types/user"

// Mendapatkan daftar seluruh pengguna (GET /api/users)
export async function GET() {
  const users = await getUsersAsync()
  // Sembunyikan password di response API client untuk alasan keamanan
  const sanitizedUsers = users.map(({ password, ...u }) => u)
  return NextResponse.json(sanitizedUsers)
}

// Menambahkan pengguna baru (POST /api/users)
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, role, password, assignedGedung } = body

    if (!name || !email || !role || !password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const users = await getUsersAsync()
    
    // Validasi duplikasi email
    const emailExists = users.some(u => u.email.toLowerCase() === email.toLowerCase())
    if (emailExists) {
      return NextResponse.json({ error: "Email already registered" }, { status: 400 })
    }

    const newUid = `uid_${Math.random().toString(36).substring(2, 11)}`
    const newUserPayload: UserRecord = {
      uid: newUid,
      name,
      email,
      role,
      password,
      created_at: Math.floor(Date.now() / 1000),
    }

    if (role === "admin_gedung" && assignedGedung) {
      newUserPayload.assigned_gedung = assignedGedung
    }

    users.unshift(newUserPayload) // Tambah di baris teratas
    await saveUsersAsync(users)

    // Kembalikan response sukses tanpa mengekspos password
    const { password: _, ...sanitizedResponse } = newUserPayload
    return NextResponse.json(sanitizedResponse, { status: 201 })
  } catch (error) {
    console.error("[API Users POST] Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// Menghapus pengguna (DELETE /api/users)
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const uid = searchParams.get("uid")

    if (!uid) {
      return NextResponse.json({ error: "Missing uid parameter" }, { status: 400 })
    }

    const users = await getUsersAsync()
    const updatedUsers = users.filter(u => u.uid !== uid)

    if (users.length === updatedUsers.length) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    await saveUsersAsync(updatedUsers)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[API Users DELETE] Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// Mengubah data pengguna (PUT /api/users)
export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { uid, name, email, role, password, assignedGedung } = body

    if (!uid || !name || !email || !role) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const users = await getUsersAsync()
    const userIndex = users.findIndex(u => u.uid === uid)

    if (userIndex === -1) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Validasi duplikasi email untuk pengguna lain
    const emailExists = users.some(u => u.uid !== uid && u.email.toLowerCase() === email.toLowerCase())
    if (emailExists) {
      return NextResponse.json({ error: "Email already registered to another user" }, { status: 400 })
    }

    // Perbarui data pengguna
    const updatedUser = { ...users[userIndex] }
    updatedUser.name = name
    updatedUser.email = email
    updatedUser.role = role
    
    // Update password jika diisi
    if (password && password.trim().length >= 6) {
      updatedUser.password = password
    }

    // Update assigned gedung
    if (role === "admin_gedung" && assignedGedung) {
      updatedUser.assigned_gedung = assignedGedung
    } else {
      delete updatedUser.assigned_gedung
    }

    users[userIndex] = updatedUser
    await saveUsersAsync(users)

    const { password: _, ...sanitizedResponse } = updatedUser
    return NextResponse.json(sanitizedResponse)
  } catch (error) {
    console.error("[API Users PUT] Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
