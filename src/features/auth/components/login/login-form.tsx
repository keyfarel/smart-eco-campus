"use client"

import Link from "next/link"
import { Lock, Mail, ArrowRight, Zap, Eye, EyeOff, AlertCircle, Loader2, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { FieldGroup, Field, FieldLabel } from "@/components/ui/field"

interface LoginFormProps {
  email: string
  setEmail: (val: string) => void
  password: string
  setPassword: (val: string) => void
  isLoading: boolean
  error: string
  showPassword: boolean
  setShowPassword: (val: boolean) => void
  mounted: boolean
  isEmailValid: boolean
  showEmailError: boolean
  showEmailSuccess: boolean
  isPasswordValid: boolean
  showPasswordError: boolean
  showPasswordSuccess: boolean
  handleSubmit: (e: React.FormEvent) => void
}

export function LoginForm({
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
}: LoginFormProps) {
  return (
    <Card className="bg-zinc-900 border-zinc-800 shadow-2xl shadow-emerald-500/5">
      <CardHeader className="text-center pb-2">
        <CardTitle className="text-lg font-semibold text-zinc-100">
          Secure Access
        </CardTitle>
        <CardDescription className="text-zinc-500">
          Enter your credentials to access the dashboard
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit}>
          
          {/* Notifikasi Error Muncul di Sini (Dengan Ikon & Warna Kontras A11y) */}
          {error && (
            <div className="mb-4 p-3 rounded-lg border border-red-500/30 bg-red-500/10 flex items-center justify-center gap-2 animate-in fade-in slide-in-from-top-1">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
              <p className="text-sm text-red-400 font-medium">{error}</p>
            </div>
          )}

          <FieldGroup>
            <Field>
              <FieldLabel className="text-zinc-300 font-medium text-sm">
                Email Address
              </FieldLabel>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <Input
                  type="email"
                  placeholder="e.g. admin@ecocampus.io"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`pl-10 bg-zinc-950 border-zinc-800 text-zinc-100 placeholder:text-zinc-655 focus-visible:border-emerald-500 focus-visible:ring-emerald-500 disabled:bg-zinc-950 disabled:text-zinc-500 disabled:border-zinc-900 disabled:cursor-not-allowed disabled:opacity-100 transition-all ${
                    showEmailError ? "border-red-500 border-2 focus-visible:border-red-500 focus-visible:ring-red-500" : ""
                  } ${showEmailSuccess ? "border-emerald-500 pr-10" : ""}`}
                  required
                  disabled={isLoading}
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
            </Field>

            <Field>
              <div className="flex items-center justify-between">
                <FieldLabel className="text-zinc-300 font-medium text-sm">
                  Password
                </FieldLabel>
                <Link 
                  href="#" 
                  className="text-xs text-emerald-500 hover:text-emerald-400 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`pl-10 pr-16 bg-zinc-950 border-zinc-800 text-zinc-100 placeholder:text-zinc-655 focus-visible:border-emerald-500 focus-visible:ring-emerald-500 disabled:bg-zinc-950 disabled:text-zinc-500 disabled:border-zinc-900 disabled:cursor-not-allowed disabled:opacity-100 transition-all ${
                    showPasswordError ? "border-red-500 border-2 focus-visible:border-red-500 focus-visible:ring-red-500" : ""
                  } ${showPasswordSuccess ? "border-emerald-500" : ""}`}
                  required
                  disabled={isLoading}
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                  {showPasswordSuccess && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  )}
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-zinc-500 hover:text-zinc-300 transition-colors"
                    tabIndex={-1}
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
              {showPasswordError && (
                <p className="text-[11px] text-red-400 font-medium flex items-center gap-1.5 mt-1.5 animate-in fade-in slide-in-from-top-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0 text-red-500" />
                  <span>Kata sandi minimal harus 6 karakter.</span>
                </p>
              )}
            </Field>

            <Button
              type="submit"
              disabled={mounted ? (isLoading || !isEmailValid || !isPasswordValid) : isLoading}
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-zinc-950 font-bold h-11 mt-2 transition-all duration-200 shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 disabled:bg-zinc-800 disabled:text-zinc-550 disabled:cursor-not-allowed disabled:shadow-none"
            >
              {isLoading ? (
                <span className="flex items-center gap-2 justify-center">
                  <Loader2 className="w-4 h-4 animate-spin text-zinc-950" />
                  Authenticating...
                </span>
              ) : (
                <span className="flex items-center gap-2 justify-center">
                  Sign In
                  <ArrowRight className="w-4 h-4" />
                </span>
              )}
            </Button>
          </FieldGroup>
        </form>

        {/* Security badge */}
        <div className="mt-6 pt-6 border-t border-zinc-800">
          <div className="flex items-center justify-center gap-2 text-xs text-zinc-600">
            <Zap className="w-3.5 h-3.5 text-emerald-500/60" />
            <span>256-bit SSL Encrypted Connection</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
