"use client"

import { useState, useEffect } from "react"
import { toast } from "sonner"
import { UserRecord } from "../types/user"
import { useBuildings } from "@/features/building-management/hooks/use-buildings"

export function useUserManagement() {
  const { buildingsList } = useBuildings()
  const [usersList, setUsersList] = useState<UserRecord[]>([])
  const [loading, setLoading] = useState(true)

  // Form states
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [role, setRole] = useState<"super_admin" | "admin_gedung">("admin_gedung")
  const [assignedGedung, setAssignedGedung] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Set default assignedGedung when buildingsList is loaded
  useEffect(() => {
    if (buildingsList.length > 0 && !assignedGedung) {
      setAssignedGedung(buildingsList[0].id)
    }
  }, [buildingsList, assignedGedung])

  // 📡 Memuat daftar pengguna secara dinamis dari API Server
  useEffect(() => {
    let isMounted = true

    // 1. Muat cache dari localStorage di sisi client setelah komponen ter-mount (Kepatuhan SSR / Solusi Mismatch)
    if (typeof window !== "undefined") {
      const cached = localStorage.getItem("smart-campus-users")
      if (cached) {
        try {
          const parsed = JSON.parse(cached)
          setUsersList(parsed)
          setLoading(false)
        } catch (e) {
          console.error("[useUserManagement] Failed to parse cached users", e)
        }
      }
    }

    async function loadUsers() {
      try {
        const response = await fetch("/api/users")
        if (!response.ok) {
          throw new Error("Failed to fetch users list")
        }
        const data = await response.json()
        if (isMounted) {
          setUsersList(data)
          if (typeof window !== "undefined") {
            localStorage.setItem("smart-campus-users", JSON.stringify(data))
          }
          setLoading(false)
        }
      } catch (err) {
        console.error("[useUserManagement] Fetch failed:", err)
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    loadUsers()

    return () => {
      isMounted = false
    }
  }, [])

  // ➕ Tambah User Baru via Next.js API Route (Menyimpan ke Database JSON Server)
  const handleAddUser = async (e: React.FormEvent): Promise<boolean> => {
    e.preventDefault()
    if (!name || !email || !password || !confirmPassword) {
      toast.error("Format Isian Salah", {
        description: "Harap lengkapi semua field formulir kredensial!"
      })
      return false
    }

    if (password !== confirmPassword) {
      toast.error("Sandi Tidak Cocok", {
        description: "Konfirmasi sandi harus sama dengan sandi utama!"
      })
      return false
    }

    setIsSubmitting(true)
    const toastId = toast.loading("Memproses pendaftaran operator baru...", {
      description: "Menghubungi Cloud Firestore dan sinkronisasi basis data..."
    })

    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name,
          email,
          role,
          password,
          assignedGedung: role === "admin_gedung" ? assignedGedung : undefined
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Gagal meregistrasi pengguna")
      }

      // Perbarui list lokal dengan payload pengguna yang telah berhasil disimpan
      setUsersList((prev) => {
        const next = [data, ...prev]
        if (typeof window !== "undefined") {
          localStorage.setItem("smart-campus-users", JSON.stringify(next))
        }
        return next
      })
      
      // Reset isian form
      setName("")
      setEmail("")
      setPassword("")
      setConfirmPassword("")
      setRole("admin_gedung")
      setAssignedGedung(buildingsList[0]?.id || "")
      
      toast.success("Registrasi Berhasil!", {
        id: toastId,
        description: `Kredensial untuk ${data.name} (${data.role.replace("_", " ").toUpperCase()}) sekarang aktif.`
      })
      return true
    } catch (error: any) {
      console.error("[UserManagement] Failed to add user:", error)
      toast.error("Gagal Mendaftar", {
        id: toastId,
        description: error.message || "Terjadi kesalahan internal saat mendaftarkan operator."
      })
      return false
    } finally {
      setIsSubmitting(false)
    }
  }

  // 🗑️ Hapus User via Next.js API Route (Menghapus dari Database JSON Server)
  const handleDeleteUser = async (uid: string) => {
    const targetUser = usersList.find((u) => u.uid === uid)
    const userName = targetUser ? targetUser.name : "Operator"

    const toastId = toast.loading(`Menghapus operator ${userName}...`, {
      description: "Mencabut kredensial dan sinkronisasi Firestore batch..."
    })

    try {
      const response = await fetch(`/api/users?uid=${uid}`, {
        method: "DELETE"
      })
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Gagal menghapus pengguna")
      }

      setUsersList((prev) => {
        const next = prev.filter((user) => user.uid !== uid)
        if (typeof window !== "undefined") {
          localStorage.setItem("smart-campus-users", JSON.stringify(next))
        }
        return next
      })

      toast.success("Penghapusan Berhasil!", {
        id: toastId,
        description: `Kredensial untuk ${userName} telah dicabut secara permanen.`
      })
    } catch (error: any) {
      console.error("[UserManagement] Failed to delete user:", error)
      toast.error("Gagal Menghapus", {
        id: toastId,
        description: error.message || "Terjadi kesalahan internal saat mencabut akses operator."
      })
    }
  }

  // ✏️ Edit User via Next.js API Route (Memperbarui Database JSON Server)
  const handleEditUser = async (updatedUser: {
    uid: string
    name: string
    email: string
    role: "super_admin" | "admin_gedung"
    password?: string
    assignedGedung?: string
  }): Promise<boolean> => {
    const toastId = toast.loading(`Memperbarui kredensial ${updatedUser.name}...`, {
      description: "Sinkronisasi perubahan ke Cloud Firestore server..."
    })

    try {
      const response = await fetch("/api/users", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(updatedUser)
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Gagal memperbarui pengguna")
      }

      // Update daftar lokal secara responsif
      setUsersList((prev) => {
        const next = prev.map((user) => (user.uid === updatedUser.uid ? data : user))
        if (typeof window !== "undefined") {
          localStorage.setItem("smart-campus-users", JSON.stringify(next))
        }
        return next
      })

      toast.success("Pembaruan Berhasil!", {
        id: toastId,
        description: `Kredensial operator ${data.name} berhasil diperbarui.`
      })
      return true
    } catch (error: any) {
      console.error("[UserManagement] Failed to update user:", error)
      toast.error("Gagal Memperbarui", {
        id: toastId,
        description: error.message || "Terjadi kesalahan internal saat memperbarui data."
      })
      return false
    }
  }

  return {
    usersList,
    loading,
    name,
    setName,
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    role,
    setRole,
    assignedGedung,
    setAssignedGedung,
    isSubmitting,
    handleAddUser,
    handleDeleteUser,
    handleEditUser,
  }
}

