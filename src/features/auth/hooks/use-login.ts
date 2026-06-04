"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { signIn, getSession } from "next-auth/react"

export function useLogin() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Instant validation states
  const isEmailTouched = email.length > 0
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  const showEmailError = isEmailTouched && !isEmailValid
  const showEmailSuccess = isEmailTouched && isEmailValid

  const isPasswordTouched = password.length > 0
  const isPasswordValid = password.length >= 6
  const showPasswordError = isPasswordTouched && !isPasswordValid
  const showPasswordSuccess = isPasswordTouched && isPasswordValid

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isEmailValid || !isPasswordValid) return
    setIsLoading(true)
    setError("")

    const res = await signIn("credentials", {
      email: email,
      password: password,
      redirect: false,
    })

    setIsLoading(false)

    if (res?.error) {
      setError("Email atau password tidak valid.")
    } else if (res?.ok) {
      const session = await getSession()
      const role = session?.user?.role
      
      if (role === "SUPER_ADMIN") {
        router.push("/super-admin")
      } else if (role === "EXECUTIVE") {
        router.push("/executive")
      } else {
        router.push("/admin-gedung")
      }
      router.refresh()
    }
  }

  return {
    email,
    setEmail,
    password,
    setPassword,
    isLoading,
    error,
    showPassword,
    setShowPassword,
    mounted,
    isEmailValid,
    showEmailError,
    showEmailSuccess,
    isPasswordValid,
    showPasswordError,
    showPasswordSuccess,
    handleSubmit
  }
}
