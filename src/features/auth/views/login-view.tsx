"use client"

import Link from "next/link"
import { Shield } from "lucide-react"
import { useLogin } from "../hooks/use-login"
import { LoginForm } from "../components/login/login-form"

export function LoginView() {
  const login = useLogin()

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-zinc-950 overflow-hidden">
      {/* Subtle grid pattern background */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(16, 185, 129, 0.4) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(16, 185, 129, 0.4) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Glowing orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl" />

      {/* Central glow behind card */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-3xl" />

      {/* Content */}
      <div className="relative z-10 w-full max-w-md px-4">
        {/* Logo / Brand */}
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-zinc-900 border border-zinc-800 mb-4 shadow-lg shadow-emerald-500/10">
            <Shield className="w-8 h-8 text-emerald-500" />
          </div>
          <h1 className="text-xl font-semibold text-zinc-100 tracking-tight">
            Admin Portal
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            Smart Eco-Campus Efficiency System
          </p>
        </div>

        {/* Login Card */}
        <LoginForm {...login} />

        {/* Footer link */}
        <p className="text-center text-sm text-zinc-600 mt-6">
          Return to{" "}
          <Link 
            href="/" 
            className="text-emerald-500 hover:text-emerald-400 transition-colors font-medium"
          >
            Homepage
          </Link>
        </p>
      </div>
    </div>
  )
}
