"use client"

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface SuperAdminHeaderProps {
  timeRange: string;
  onTimeRangeChange: (value: string) => void;
}

export function SuperAdminHeader({ timeRange, onTimeRangeChange }: SuperAdminHeaderProps) {
  return (
    <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 pb-6">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-0.5 sm:gap-2">
          <h1 className="text-lg sm:text-2xl font-bold text-foreground leading-tight">Dashboard IoT</h1>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-xl">
            Pantau Telemetri & Energi Real-time
          </p>
        </div>
      </div>

      <div className="flex w-full sm:w-auto mt-2 sm:mt-0">
        <Tabs value={timeRange} onValueChange={onTimeRangeChange} className="w-full sm:w-fit">
          <TabsList className="grid w-full grid-cols-4 sm:inline-flex bg-zinc-900 border border-zinc-800 p-1 rounded-xl h-auto">
            <TabsTrigger value="live" className="relative overflow-hidden rounded-lg data-[state=active]:bg-red-500 data-[state=active]:text-white transition-all text-[10px] sm:text-xs font-bold h-8 sm:h-7 px-1 sm:px-4 flex items-center justify-center gap-1.5">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-white"></span>
              </span>
              Live
            </TabsTrigger>
            <TabsTrigger value="24h" className="rounded-lg data-[state=active]:bg-emerald-500 data-[state=active]:text-white transition-all text-[10px] sm:text-xs font-semibold h-8 sm:h-7 px-1 sm:px-4">Daily</TabsTrigger>
            <TabsTrigger value="7d" className="rounded-lg data-[state=active]:bg-emerald-500 data-[state=active]:text-white transition-all text-[10px] sm:text-xs font-semibold h-8 sm:h-7 px-1 sm:px-4">Weekly</TabsTrigger>
            <TabsTrigger value="30d" className="rounded-lg data-[state=active]:bg-emerald-500 data-[state=active]:text-white transition-all text-[10px] sm:text-xs font-semibold h-8 sm:h-7 px-1 sm:px-4">Monthly</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    </div>
  )
}
