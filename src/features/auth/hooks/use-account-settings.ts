"use client"

import { useState } from "react"
import { toast } from "sonner"
import { useSession } from "next-auth/react"
import { db } from "@/lib/firebase"
import { doc, setDoc } from "firebase/firestore"

interface UseAccountSettingsProps {
  currentName: string
  currentEmail: string
}

export function useAccountSettings({
  currentName,
  currentEmail
}: UseAccountSettingsProps) {
  const { data: session } = useSession()
  const [name, setName] = useState(currentName)
  const [email, setEmail] = useState(currentEmail)
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  // Instant validation states
  const isNameTouched = name.length > 0
  const isNameValid = name.trim().length >= 3
  const showNameError = isNameTouched && !isNameValid
  const showNameSuccess = isNameTouched && isNameValid

  const isEmailTouched = email.length > 0
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  const showEmailError = isEmailTouched && !isEmailValid
  const showEmailSuccess = isEmailTouched && isEmailValid

  const isConfirmTouched = confirmPassword.length > 0
  const isPasswordMatch = password === confirmPassword
  const showConfirmError = isConfirmTouched && !isPasswordMatch
  const showConfirmSuccess = isConfirmTouched && isPasswordMatch && password.length > 0

  // Helper for password strength
  const strength = password ? (
    (password.length >= 8 ? 25 : 0) +
    (/[a-z]/.test(password) ? 25 : 0) +
    (/[A-Z]/.test(password) ? 25 : 0) +
    (/[0-9!@#$%^&*]/.test(password) ? 25 : 0)
  ) : 0

  const getStrengthColor = (score: number) => {
    if (score <= 25) return "bg-rose-500"
    if (score <= 50) return "bg-amber-500"
    if (score <= 75) return "bg-emerald-400"
    return "bg-emerald-600"
  }

  const getStrengthText = (score: number) => {
    if (score === 0) return ""
    if (score <= 25) return "Weak"
    if (score <= 50) return "Fair"
    if (score <= 75) return "Good"
    return "Strong"
  }

  // API Contract (Cloud Firestore Implementation)
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()

    if (password && password !== confirmPassword) {
      return
    }

    if (!session || !(session.user as any)?.id || !db) {
      toast.error("Gagal memperbarui profil: Sesi tidak valid.")
      return
    }

    setIsSubmitting(true)

    try {
      await setDoc(doc(db, "users", (session.user as any).id), {
        name,
        email,
        updated_at: Math.floor(Date.now() / 1000)
      }, { merge: true })

      toast.success("Account settings updated successfully!")
      
      // Reset password fields after save
      setPassword("")
      setConfirmPassword("")
    } catch (error) {
      console.error("[useAccountSettings] Update failed:", error)
      toast.error("Gagal memperbarui pengaturan akun.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
    name,
    setName,
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    isSubmitting,
    showPassword,
    setShowPassword,
    isNameValid,
    showNameError,
    showNameSuccess,
    isEmailValid,
    showEmailError,
    showEmailSuccess,
    isPasswordMatch,
    showConfirmError,
    showConfirmSuccess,
    strength,
    getStrengthColor,
    getStrengthText,
    handleSave
  }
}
