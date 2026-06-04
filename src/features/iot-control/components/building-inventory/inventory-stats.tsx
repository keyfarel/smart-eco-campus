"use client";

import { DoorOpen, Cpu, ShieldAlert, Activity } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface InventoryStatsProps {
  stats: {
    total: number;
    online: number;
    offline: number;
    passive: number;
  };
}

export function InventoryStats({ stats }: InventoryStatsProps) {
  const cards = [
    {
      title: "Total Ruangan",
      value: stats.total,
      icon: DoorOpen,
      color: "text-zinc-400",
      bgColor: "bg-zinc-500/10",
      borderColor: "border-zinc-500/20",
    },
    {
      title: "IoT Aktif (Online)",
      value: stats.online,
      icon: Activity,
      color: "text-emerald-500",
      bgColor: "bg-emerald-500/10",
      borderColor: "border-emerald-500/20",
    },
    {
      title: "IoT Offline",
      value: stats.offline,
      icon: Cpu,
      color: "text-rose-500",
      bgColor: "bg-rose-500/10",
      borderColor: "border-rose-500/20",
    },
    {
      title: "Passive (No Device)",
      value: stats.passive,
      icon: ShieldAlert,
      color: "text-zinc-500",
      bgColor: "bg-zinc-500/5",
      borderColor: "border-zinc-800",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <Card key={card.title} className={`bg-zinc-900/50 border ${card.borderColor} backdrop-blur-sm`}>
          <CardContent className="p-4 flex items-center gap-4">
            <div className={`w-10 h-10 rounded-lg ${card.bgColor} flex items-center justify-center ${card.color}`}>
              <card.icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest leading-none mb-1">
                {card.title}
              </p>
              <p className="text-xl font-bold text-foreground leading-none">
                {card.value}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
