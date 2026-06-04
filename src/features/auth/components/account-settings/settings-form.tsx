"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle, CheckCircle2, Eye, EyeOff, Loader2 } from "lucide-react"

interface SettingsFormProps {
  name: string
  setName: (val: string) => void
  email: string
  setEmail: (val: string) => void
  password: string
  setPassword: (val: string) => void
  confirmPassword: string
  setConfirmPassword: (val: string) => void
  isSubmitting: boolean
  showPassword: boolean
  setShowPassword: (val: boolean) => void
  isNameValid: boolean
  showNameError: boolean
  showNameSuccess: boolean
  isEmailValid: boolean
  showEmailError: boolean
  showEmailSuccess: boolean
  isPasswordMatch: boolean
  showConfirmError: boolean
  showConfirmSuccess: boolean
  strength: number
  getStrengthColor: (score: number) => string
  getStrengthText: (score: number) => string
  handleSave: (e: React.FormEvent) => void
}

export function SettingsForm({
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
}: SettingsFormProps) {
  return (
    <Card className="bg-background border-zinc-800">
      <form onSubmit={handleSave}>
        <CardHeader>
          <CardTitle className="text-lg">Profile Information</CardTitle>
          <CardDescription>Update your display name and password.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-zinc-300 font-medium">Email Address</Label>
            <div className="relative">
              <Input
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className={`bg-zinc-900 border-zinc-800 focus-visible:border-emerald-500 focus-visible:ring-emerald-500 disabled:bg-zinc-900 disabled:text-zinc-400 disabled:border-zinc-800 disabled:cursor-not-allowed disabled:opacity-100 transition-all ${showEmailError ? "border-red-500 border-2 focus-visible:border-red-500 focus-visible:ring-red-500" : ""
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

          <div className="space-y-2">
            <Label htmlFor="name" className="text-zinc-300 font-medium">Display Name</Label>
            <div className="relative">
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                className={`bg-zinc-900 border-zinc-800 focus-visible:border-emerald-500 focus-visible:ring-emerald-500 disabled:bg-zinc-900 disabled:text-zinc-400 disabled:border-zinc-800 disabled:cursor-not-allowed disabled:opacity-100 transition-all ${showNameError ? "border-red-500 border-2 focus-visible:border-red-500 focus-visible:ring-red-500" : ""
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

          <div className="space-y-2 pt-6 border-t border-zinc-800/50">
            <Label className="text-zinc-200 text-sm font-semibold">Change Password</Label>
            <p className="text-xs text-zinc-500 mb-4">Leave blank if you don't want to change your password.</p>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password" className="text-zinc-400 text-xs font-medium">New Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="New password"
                    className="bg-zinc-900 border-zinc-800 focus-visible:border-emerald-500 focus-visible:ring-emerald-500 pr-10 disabled:bg-zinc-900 disabled:text-zinc-400 disabled:border-zinc-800 disabled:cursor-not-allowed disabled:opacity-100 transition-all"
                    disabled={isSubmitting}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
                    tabIndex={-1}
                    disabled={isSubmitting}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>

                {/* Password Strength Indicator */}
                {password.length > 0 && (
                  <div className="space-y-1.5 mt-2 animate-in fade-in slide-in-from-top-1">
                    <div className="flex justify-between items-center text-[10px]">
                      <span className="text-zinc-500">Password strength:</span>
                      <span className={strength <= 25 ? "text-rose-500" : strength <= 50 ? "text-amber-500" : "text-emerald-500 font-medium"}>
                        {getStrengthText(strength)}
                      </span>
                    </div>
                    <div className="flex gap-1 h-1 w-full">
                      <div className={`h-full flex-1 rounded-full transition-colors duration-300 ${strength >= 25 ? getStrengthColor(strength) : "bg-zinc-800"}`} />
                      <div className={`h-full flex-1 rounded-full transition-colors duration-300 ${strength >= 50 ? getStrengthColor(strength) : "bg-zinc-800"}`} />
                      <div className={`h-full flex-1 rounded-full transition-colors duration-300 ${strength >= 75 ? getStrengthColor(strength) : "bg-zinc-800"}`} />
                      <div className={`h-full flex-1 rounded-full transition-colors duration-300 ${strength >= 100 ? getStrengthColor(strength) : "bg-zinc-800"}`} />
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-zinc-400 text-xs font-medium">Confirm New Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    className={`bg-zinc-900 border-zinc-800 pr-10 focus-visible:border-emerald-500 focus-visible:ring-emerald-500 disabled:bg-zinc-900 disabled:text-zinc-400 disabled:border-zinc-800 disabled:cursor-not-allowed disabled:opacity-100 transition-all ${showConfirmError ? "border-red-500 border-2 focus-visible:border-red-500 focus-visible:ring-red-500" : ""
                      } ${showConfirmSuccess ? "border-emerald-500" : ""}`}
                    disabled={isSubmitting}
                  />
                  {showConfirmSuccess && (
                    <CheckCircle2 className="absolute right-10 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500" />
                  )}
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
                    tabIndex={-1}
                    disabled={isSubmitting}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {/* Match indicator */}
                {showConfirmError && (
                  <p className="text-[11px] text-red-400 font-medium flex items-center gap-1.5 mt-1.5 animate-in fade-in slide-in-from-top-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0 text-red-500" />
                    <span>Sandi tidak cocok! Silakan cek kembali.</span>
                  </p>
                )}
                {showConfirmSuccess && (
                  <p className="text-[11px] text-emerald-500 font-medium flex items-center gap-1.5 mt-1.5 animate-in fade-in slide-in-from-top-1">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-emerald-500" />
                    <span>Sandi cocok & valid.</span>
                  </p>
                )}
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end border-t border-zinc-800/50 pt-6">
          <Button
            type="submit"
            className="bg-emerald-500 hover:bg-emerald-600 text-zinc-950 font-bold min-w-[120px]"
            disabled={isSubmitting || !isNameValid || !isEmailValid || (password.length > 0 && !isPasswordMatch)}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin text-zinc-950" />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
