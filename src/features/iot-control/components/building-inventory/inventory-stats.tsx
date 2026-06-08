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

  const TotalIcon = cards[0].icon;

  return (
    <>
      {/* MOBILE VIEW: 1 Header (Total) + 3 Kotak Status */}
      <div className="sm:hidden rounded-xl border bg-zinc-900/50 border-zinc-800 backdrop-blur-sm overflow-hidden shadow-sm">
        <div className="grid grid-cols-3">
          {/* Card Pertama: Total Ruangan (Full Width) */}
          <div className="col-span-3 px-3 py-2.5 flex items-center justify-between border-b border-zinc-800/80 bg-zinc-950/30">
            <div className="flex items-center gap-2.5">
              <div className={`p-1.5 rounded-full ${cards[0].bgColor}`}>
                <TotalIcon className={`w-4 h-4 ${cards[0].color}`} />
              </div>
              <p className="text-[11px] sm:text-xs font-bold text-zinc-500 uppercase tracking-widest mt-0.5">
                {cards[0].title}
              </p>
            </div>
            <p className="text-xl font-bold text-foreground">
              {cards[0].value}
            </p>
          </div>

          {/* 3 Card Sisanya: Berjejer 3 Kolom */}
          {cards.slice(1).map((card, index) => (
            <div 
              key={card.title} 
              className={`p-3 flex flex-col items-center justify-center text-center gap-1 
                ${index < 2 ? 'border-r border-zinc-800/80' : ''}
              `}
            >
              <div className={`p-1.5 rounded-full ${card.bgColor} mb-0.5`}>
                <card.icon className={`w-3.5 h-3.5 ${card.color}`} />
              </div>
              <p className={`text-lg font-bold leading-none ${card.color === 'text-zinc-400' || card.color === 'text-zinc-500' ? 'text-foreground' : card.color}`}>
                {card.value}
              </p>
              <p className="text-[8px] font-bold text-zinc-500 uppercase tracking-wider leading-tight mt-0.5">
                {card.title.replace(' (Online)', '').replace(' (No Device)', '')}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* DESKTOP VIEW: 4 Kartu Terpisah */}
      <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => (
          <Card key={card.title} className={`bg-zinc-900/50 border ${card.borderColor} backdrop-blur-sm`}>
            <CardContent className="p-4 flex items-center gap-4">
              <div className={`w-10 h-10 rounded-lg ${card.bgColor} flex items-center justify-center`}>
                <card.icon className={`w-5 h-5 ${card.color}`} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest leading-none mb-1">
                  {card.title}
                </p>
                <p className={`text-xl font-bold leading-none ${card.color === 'text-zinc-400' || card.color === 'text-zinc-500' ? 'text-foreground' : card.color}`}>
                  {card.value}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}
