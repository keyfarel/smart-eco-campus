"use client"

import { motion } from "framer-motion"

interface PasswordStrengthMeterProps {
  password: string
}

export function PasswordStrengthMeter({ password }: PasswordStrengthMeterProps) {
  const calculateStrength = () => {
    if (!password) return 0
    let score = 0
    if (password.length > 0) score += 1 // 1 bar (red)
    if (password.length >= 6) score += 1 // 2 bars (yellow)
    if (password.length >= 8 && /[0-9]/.test(password) && /[a-zA-Z]/.test(password)) score += 1 // 3 bars (green)
    return Math.min(score, 3)
  }

  const score = calculateStrength()

  const getColor = (index: number) => {
    if (score === 0) return "bg-zinc-800"
    if (score === 1) return index === 0 ? "bg-red-500" : "bg-zinc-800"
    if (score === 2) return index <= 1 ? "bg-amber-500" : "bg-zinc-800"
    if (score === 3) return "bg-emerald-500"
    return "bg-zinc-800"
  }

  const getLabel = () => {
    if (score === 0) return "Membutuhkan kata sandi"
    if (score === 1) return "Sangat Lemah"
    if (score === 2) return "Sedang"
    if (score === 3) return "Kuat"
    return ""
  }

  return (
    <div className="flex flex-col gap-1.5 mt-2">
      <div className="flex gap-1 h-1.5 w-full">
        {[0, 1, 2].map((index) => (
          <motion.div
            key={index}
            className={`flex-1 rounded-full transition-colors duration-300 ${getColor(index)}`}
            initial={{ opacity: 0.5 }}
            animate={{ opacity: 1 }}
          />
        ))}
      </div>
      <span className={`text-[10px] font-medium transition-colors duration-300 ${
        score === 1 ? "text-red-400" :
        score === 2 ? "text-amber-400" :
        score === 3 ? "text-emerald-400" : "text-zinc-500"
      }`}>
        {getLabel()}
      </span>
    </div>
  )
}
