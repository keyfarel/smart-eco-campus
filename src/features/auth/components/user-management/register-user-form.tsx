"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { User, UserPlus, Mail, Building as BuildingIcon, CheckCircle2, AlertCircle, Loader2, Lock, Eye, EyeOff } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Building } from "@/features/building-management/types/building"

interface RegisterUserFormProps {
  name: string
  onNameChange: (val: string) => void
  email: string
  onEmailChange: (val: string) => void
  password: string
  onPasswordChange: (val: string) => void
  confirmPassword: string
  onConfirmPasswordChange: (val: string) => void
  role: "super_admin" | "admin_gedung"
  onRoleChange: (val: "super_admin" | "admin_gedung") => void
  assignedGedung: string
  onAssignedGedungChange: (val: string) => void
  isSubmitting: boolean
  onSubmit: (e: React.FormEvent) => void
  buildingsList: Building[]
}

export function RegisterUserForm({
  name,
  onNameChange,
  email,
  onEmailChange,
  password,
  onPasswordChange,
  confirmPassword,
  onConfirmPasswordChange,
  role,
  onRoleChange,
  assignedGedung,
  onAssignedGedungChange,
  isSubmitting,
  onSubmit,
  buildingsList,
}: RegisterUserFormProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // Client-side instant validation states
  const isNameTouched = name.length > 0
  const isNameValid = name.trim().length >= 3
  const showNameError = isNameTouched && !isNameValid
  const showNameSuccess = isNameTouched && isNameValid

  const isEmailTouched = email.length > 0
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  const showEmailError = isEmailTouched && !isEmailValid
  const showEmailSuccess = isEmailTouched && isEmailValid

  const isPasswordTouched = password.length > 0
  const isPasswordValid = password.length >= 6
  const showPasswordError = isPasswordTouched && !isPasswordValid
  const showPasswordSuccess = isPasswordTouched && isPasswordValid

  const isConfirmPasswordTouched = confirmPassword.length > 0
  const isConfirmPasswordValid = confirmPassword === password && confirmPassword.length >= 6
  const showConfirmPasswordError = isConfirmPasswordTouched && !isConfirmPasswordValid
  const showConfirmPasswordSuccess = isConfirmPasswordTouched && isConfirmPasswordValid

  return (
    <Card className="bg-zinc-900 border-zinc-800 sticky top-20">
      <CardHeader className="border-b border-zinc-850">
        <CardTitle className="text-lg flex items-center gap-2">
          <UserPlus className="w-5 h-5 text-emerald-500" />
          <span>Register Account</span>
        </CardTitle>
        <CardDescription>
          Create a new role-restricted user credential.
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={onSubmit} className="space-y-4">
          {/* 1. Name */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-zinc-300 font-medium">Full Name</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <Input
                id="name"
                placeholder="e.g. Ahmad Suherman"
                value={name}
                onChange={(e) => onNameChange(e.target.value)}
                className={`pl-9 bg-zinc-950 border-zinc-800 focus-visible:border-emerald-500 focus-visible:ring-emerald-500 disabled:bg-zinc-900 disabled:text-zinc-400 disabled:border-zinc-800 disabled:cursor-not-allowed disabled:opacity-100 transition-all ${
                  showNameError ? "border-red-500 border-2 focus-visible:border-red-500 focus-visible:ring-red-500" : ""
                } ${showNameSuccess ? "border-emerald-500 pr-10" : ""}`}
                required
                disabled={isSubmitting}
              />
              {showNameSuccess && (
                <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500" />
              )}
            </div>
            {showNameError && (
              <p className="text-[11px] text-red-400 font-medium flex items-center gap-1.5 mt-1.5 animate-in fade-in slide-in-from-top-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0 text-red-500" />
                <span>Nama lengkap minimal 3 karakter.</span>
              </p>
            )}
          </div>

          {/* 2. Email */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-zinc-300 font-medium">Email Address</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <Input
                id="email"
                type="email"
                placeholder="e.g. ahmad@ecocampus.id"
                value={email}
                onChange={(e) => onEmailChange(e.target.value)}
                className={`pl-9 bg-zinc-950 border-zinc-800 font-mono focus-visible:border-emerald-500 focus-visible:ring-emerald-500 disabled:bg-zinc-900 disabled:text-zinc-400 disabled:border-zinc-800 disabled:cursor-not-allowed disabled:opacity-100 transition-all ${
                  showEmailError ? "border-red-500 border-2 focus-visible:border-red-500 focus-visible:ring-red-500" : ""
                } ${showEmailSuccess ? "border-emerald-500 pr-10" : ""}`}
                required
                disabled={isSubmitting}
              />
              {showEmailSuccess && (
                <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500" />
              )}
            </div>
            {showEmailError && (
              <p className="text-[11px] text-red-400 font-medium flex items-center gap-1.5 mt-1.5 animate-in fade-in slide-in-from-top-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0 text-red-500" />
                <span>Format email tidak valid. Gunakan nama@domain.com</span>
              </p>
            )}
          </div>

          {/* 3. Role */}
          <div className="space-y-2">
            <Label htmlFor="role" className="text-zinc-300 font-medium">RBAC Role</Label>
            <Select value={role} onValueChange={(val: any) => onRoleChange(val)} disabled={isSubmitting}>
              <SelectTrigger id="role" className="bg-zinc-950 border-zinc-800 focus-visible:border-emerald-500 focus-visible:ring-emerald-500 disabled:bg-zinc-900 disabled:text-zinc-400 disabled:border-zinc-800 disabled:cursor-not-allowed disabled:opacity-100 transition-all">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent className="bg-zinc-900 border-zinc-800 text-xs text-zinc-300">
                <SelectItem value="super_admin">Super Admin (IT Infrastructure)</SelectItem>
                <SelectItem value="admin_gedung">Building Admin (Field Operator)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* 4. Assigned Gedung (Only shown for Admin Gedung) */}
          <AnimatePresence>
            {role === "admin_gedung" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-2 overflow-hidden"
              >
                <Label htmlFor="gedung" className="text-zinc-300 font-medium">Assigned Building</Label>
                <div className="relative">
                  <BuildingIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                  <Select value={assignedGedung} onValueChange={onAssignedGedungChange} disabled={isSubmitting}>
                    <SelectTrigger id="gedung" className="pl-9 bg-zinc-950 border-zinc-800 focus-visible:border-emerald-500 focus-visible:ring-emerald-500 disabled:bg-zinc-900 disabled:text-zinc-400 disabled:border-zinc-800 disabled:cursor-not-allowed disabled:opacity-100 transition-all">
                      <SelectValue placeholder="Select building" />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-900 border-zinc-800">
                      {buildingsList.map((b) => (
                        <SelectItem key={b.id} value={b.id}>
                          {b.name}
                        </SelectItem>
                      ))}
                      {buildingsList.length === 0 && (
                        <SelectItem value="none" disabled>Belum ada gedung terdaftar</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* 5. Password */}
          <div className="space-y-2">
            <Label htmlFor="password" className="text-zinc-300 font-medium">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Min. 6 characters"
                value={password}
                onChange={(e) => onPasswordChange(e.target.value)}
                className={`pl-9 pr-10 bg-zinc-950 border-zinc-800 focus-visible:border-emerald-500 focus-visible:ring-emerald-500 disabled:bg-zinc-900 disabled:text-zinc-400 disabled:border-zinc-800 disabled:cursor-not-allowed disabled:opacity-100 transition-all ${
                  showPasswordError ? "border-red-500 border-2 focus-visible:border-red-500 focus-visible:ring-red-500" : ""
                } ${showPasswordSuccess ? "border-emerald-500" : ""}`}
                required
                disabled={isSubmitting}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-350 transition-colors bg-transparent border-0 cursor-pointer"
                disabled={isSubmitting}
              >
                {showPassword ? <EyeOff className="w-4 h-4 text-zinc-500" /> : <Eye className="w-4 h-4 text-zinc-500" />}
              </button>
            </div>
            {showPasswordError && (
              <p className="text-[11px] text-red-400 font-medium flex items-center gap-1.5 mt-1.5 animate-in fade-in slide-in-from-top-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0 text-red-500" />
                <span>Password minimal 6 karakter.</span>
              </p>
            )}
          </div>

          {/* 6. Confirm Password */}
          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-zinc-300 font-medium">Confirm Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Re-type password"
                value={confirmPassword}
                onChange={(e) => onConfirmPasswordChange(e.target.value)}
                className={`pl-9 pr-10 bg-zinc-950 border-zinc-800 focus-visible:border-emerald-500 focus-visible:ring-emerald-500 disabled:bg-zinc-900 disabled:text-zinc-400 disabled:border-zinc-800 disabled:cursor-not-allowed disabled:opacity-100 transition-all ${
                  showConfirmPasswordError ? "border-red-500 border-2 focus-visible:border-red-500 focus-visible:ring-red-500" : ""
                } ${showConfirmPasswordSuccess ? "border-emerald-500" : ""}`}
                required
                disabled={isSubmitting}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-350 transition-colors bg-transparent border-0 cursor-pointer"
                disabled={isSubmitting}
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4 text-zinc-500" /> : <Eye className="w-4 h-4 text-zinc-500" />}
              </button>
            </div>
            {showConfirmPasswordError && (
              <p className="text-[11px] text-red-400 font-medium flex items-center gap-1.5 mt-1.5 animate-in fade-in slide-in-from-top-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0 text-red-500" />
                <span>Konfirmasi password tidak cocok.</span>
              </p>
            )}
          </div>

          {/* Submit button */}
          <Button
            type="submit"
            disabled={isSubmitting || !isNameValid || !isEmailValid || !isPasswordValid || !isConfirmPasswordValid}
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-zinc-955 font-bold shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:shadow-[0_0_20px_rgba(16,185,129,0.5)] disabled:bg-zinc-800 disabled:text-zinc-550 disabled:cursor-not-allowed disabled:shadow-none transition-all duration-200"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-zinc-955" />
                <span>Registering...</span>
              </span>
            ) : (
              "Add Credentials"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
