"use client"

import { cn } from "@/lib/utils"

interface RadialGaugeProps {
  value: number
  maxValue: number
  label: string
  unit: string
  size?: number
  className?: string
}

export function RadialGauge({
  value,
  maxValue,
  label,
  unit,
  size = 160,
  className,
}: RadialGaugeProps) {
  const percentage = Math.min((value / maxValue) * 100, 100)
  const strokeWidth = 10
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (percentage / 100) * circumference

  return (
    <div className={cn("flex flex-col items-center gap-3", className)}>
      <div className="relative" style={{ width: size, height: size }}>
        {/* Background circle */}
        <svg
          width={size}
          height={size}
          className="transform -rotate-90"
        >
          {/* Background track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="none"
            className="text-zinc-800"
          />
          {/* Progress arc */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="none"
            strokeLinecap="round"
            className="text-emerald-500 transition-all duration-700 ease-out"
            style={{
              strokeDasharray: circumference,
              strokeDashoffset,
            }}
          />
        </svg>
        
        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-foreground tabular-nums">
            {value.toFixed(1)}
          </span>
          <span className="text-sm text-emerald-500 font-medium">{unit}</span>
        </div>
        
        {/* Glow effect */}
        <div 
          className="absolute inset-0 rounded-full opacity-20 blur-xl"
          style={{
            background: `conic-gradient(from 0deg, transparent 0%, rgb(16 185 129) ${percentage}%, transparent ${percentage}%)`,
          }}
        />
      </div>
      
      <span className="text-sm text-muted-foreground font-medium">{label}</span>
    </div>
  )
}
