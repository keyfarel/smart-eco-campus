"use client"

import { useState } from "react"
import { useUserManagement } from "./use-user-management"
import { UserRecord } from "../types/user"

export function useUserManagementState() {
  const {
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
  } = useUserManagement()

  // Search & Filter & Pagination states
  const [searchQuery, setSearchQuery] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  // State Dialog Registrasi Baru
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  // State Dialog Lihat Rincian (View details)
  const [viewedUser, setViewedUser] = useState<UserRecord | null>(null)

  // State Dialog Edit Kredensial (Edit details)
  const [editedUser, setEditedUser] = useState<UserRecord | null>(null)

  // State Formulir Edit
  const [editName, setEditName] = useState("")
  const [editEmail, setEditEmail] = useState("")
  const [editRole, setEditRole] = useState<"super_admin" | "admin_gedung" | "executive">("admin_gedung")
  const [editAssignedGedung, setEditAssignedGedung] = useState("gedung_a")
  const [editPassword, setEditPassword] = useState("")
  const [editConfirmPassword, setEditConfirmPassword] = useState("")
  const [editShowPassword, setEditShowPassword] = useState(false)
  const [editShowConfirmPassword, setEditShowConfirmPassword] = useState(false)
  const [editSubmitting, setEditSubmitting] = useState(false)

  // Intersepsi pendaftaran pengguna baru
  const handleFormSubmit = async (e: React.FormEvent) => {
    const isSuccess = await handleAddUser(e)
    if (isSuccess) {
      setIsDialogOpen(false)
    }
  }

  // Menyiapkan isian formulir saat tombol edit dipicu
  const handleTriggerEdit = (user: UserRecord) => {
    setEditedUser(user)
    setEditName(user.name)
    setEditEmail(user.email)
    setEditRole(user.role as any)
    setEditAssignedGedung(user.assigned_gedung || "gedung_a")
    setEditPassword("")
    setEditConfirmPassword("")
    setEditShowPassword(false)
    setEditShowConfirmPassword(false)
  }

  // Mengirim pembaruan data pengguna ke API Server
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editedUser) return

    setEditSubmitting(true)
    const isSuccess = await handleEditUser({
      uid: editedUser.uid,
      name: editName,
      email: editEmail,
      role: editRole,
      password: editPassword.length > 0 ? editPassword : undefined,
      assignedGedung: editRole === "admin_gedung" ? editAssignedGedung : undefined,
    })

    setEditSubmitting(false)
    if (isSuccess) {
      setEditedUser(null)
    }
  }

  // Validasi instan di sisi klien untuk Form Edit
  const isEditNameTouched = editName.length > 0
  const isEditNameValid = editName.trim().length >= 3
  const showEditNameError = isEditNameTouched && !isEditNameValid

  const isEditEmailTouched = editEmail.length > 0
  const isEditEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editEmail)
  const showEditEmailError = isEditEmailTouched && !isEditEmailValid

  // Validasi sandi opsional (diabaikan jika dibiarkan kosong)
  const hasEditPassword = editPassword.length > 0
  const isEditPasswordValid = !hasEditPassword || editPassword.length >= 6
  const showEditPasswordError = hasEditPassword && !isEditPasswordValid

  const hasEditConfirmPassword = editConfirmPassword.length > 0
  const isEditConfirmPasswordValid = !hasEditPassword || (editConfirmPassword === editPassword && editConfirmPassword.length >= 6)
  const showEditConfirmPasswordError = hasEditPassword && !isEditConfirmPasswordValid

  const isEditFormValid =
    isEditNameValid &&
    isEditEmailValid &&
    isEditPasswordValid &&
    isEditConfirmPasswordValid

  // Filter users based on search and role filters
  const filteredUsers = usersList.filter((user) => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.uid.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesRole = roleFilter === "all" || user.role === roleFilter

    return matchesSearch && matchesRole
  })

  // Pagination calculations
  const totalItems = filteredUsers.length
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems)
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex)

  // Dynamic filter reset logic
  const handleSearchQueryChange = (val: string) => {
    setSearchQuery(val)
    setCurrentPage(1)
  }

  const handleRoleFilterChange = (val: string) => {
    setRoleFilter(val)
    setCurrentPage(1)
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
    searchQuery,
    setSearchQuery,
    roleFilter,
    setRoleFilter,
    currentPage,
    setCurrentPage,
    isDialogOpen,
    setIsDialogOpen,
    viewedUser,
    setViewedUser,
    editedUser,
    setEditedUser,
    editName,
    setEditName,
    editEmail,
    setEditEmail,
    editRole,
    setEditRole,
    editAssignedGedung,
    setEditAssignedGedung,
    editPassword,
    setEditPassword,
    editConfirmPassword,
    setEditConfirmPassword,
    editShowPassword,
    setEditShowPassword,
    editShowConfirmPassword,
    setEditShowConfirmPassword,
    editSubmitting,
    handleFormSubmit,
    handleTriggerEdit,
    handleEditSubmit,
    isEditFormValid,
    showEditNameError,
    showEditEmailError,
    showEditPasswordError,
    showEditConfirmPasswordError,
    filteredUsers,
    totalItems,
    totalPages,
    startIndex,
    endIndex,
    paginatedUsers,
    handleSearchQueryChange,
    handleRoleFilterChange,
    handleDeleteUser,
  }
}
