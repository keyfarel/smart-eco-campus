"use client";

import { Activity, Zap, Cpu, ShieldCheck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface DeviceControlStatsProps {
  totalDevices: number;
  activeDevices: number;
  totalPower: number;
  autoRoomsCount: number;
}

export function DeviceControlStats({
  totalDevices,
  activeDevices,
  totalPower,
  autoRoomsCount,
}: DeviceControlStatsProps) {
  const cards = [
    {
      title: "Total Perangkat",
      value: totalDevices,
      icon: Cpu,
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/20",
    },
    {
      title: "Perangkat Aktif",
      value: activeDevices,
      icon: Activity,
      color: "text-emerald-500",
      bgColor: "bg-emerald-500/10",
      borderColor: "border-emerald-500/20",
    },
    {
      title: "Total Daya Aktif",
      value: `${totalPower} W`,
      icon: Zap,
      color: "text-amber-500",
      bgColor: "bg-amber-500/10",
      borderColor: "border-amber-500/20",
    },
    {
      title: "Ruangan AI Auto",
      value: autoRoomsCount,
      icon: ShieldCheck,
      color: "text-purple-400",
      bgColor: "bg-purple-500/10",
      borderColor: "border-purple-500/20",
    },
  ];

  const TotalIcon = cards[0].icon;

  return (
    <>
      {/* MOBILE VIEW: 1 Header + 3 Kotak (Identik dengan Inventory Stats) */}
      <div className="sm:hidden rounded-xl border bg-zinc-900/50 border-zinc-800 backdrop-blur-sm overflow-hidden shadow-sm">
        <div className="grid grid-cols-3">
          {/* Card Pertama: Full Width */}
          <div className="col-span-3 px-3 py-2.5 flex items-center justify-between border-b border-zinc-800/80 bg-zinc-950/30">
            <div className="flex items-center gap-2.5">
              <div className={`p-1.5 rounded-full ${cards[0].bgColor}`}>
                <TotalIcon className={`w-4 h-4 ${cards[0].color}`} />
              </div>
              <p className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest mt-0.5">
                {cards[0].title}
              </p>
            </div>
            <p className="text-xl font-bold text-foreground">
              {cards[0].value}
            </p>
          </div>

          {/* 3 Card Sisanya */}
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
              <p className={`text-lg font-bold leading-none ${card.color}`}>
                {card.value}
              </p>
              <p className="text-[8px] font-bold text-zinc-500 uppercase tracking-wider leading-tight mt-0.5">
                {card.title.replace('Perangkat ', '').replace('Total ', '')}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* DESKTOP VIEW: 4 Kartu */}
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
                <p className={`text-xl font-bold leading-none ${card.color}`}>
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
