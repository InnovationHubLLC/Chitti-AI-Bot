"use client";

import { Phone, Flame, CalendarCheck } from "lucide-react";
import type { Call } from "@/lib/types/calls";

interface StatsHeaderProps {
  calls: Call[];
}

export function StatsHeader({ calls }: StatsHeaderProps) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todayCalls = calls.filter((c) => {
    if (!c.created_at) return false;
    return new Date(c.created_at) >= today;
  });

  const hotLeads = todayCalls.filter(
    (c) => (c.lead_score ?? "").toUpperCase() === "HOT"
  );

  const stats = [
    {
      icon: Phone,
      value: todayCalls.length,
      label: todayCalls.length === 1 ? "call today" : "calls today",
      color: "violet",
    },
    {
      icon: Flame,
      value: hotLeads.length,
      label: hotLeads.length === 1 ? "hot lead" : "hot leads",
      color: "orange",
    },
    {
      icon: CalendarCheck,
      value: 0,
      label: "appointments",
      color: "emerald",
    },
  ];

  const colorMap: Record<string, { bg: string; glow: string; icon: string }> = {
    violet: { bg: "bg-violet-500/15", glow: "shadow-[0_0_12px_rgba(124,58,237,0.3)]", icon: "text-violet-400" },
    orange: { bg: "bg-accent-500/15", glow: "shadow-[0_0_12px_rgba(255,90,31,0.3)]", icon: "text-accent-400" },
    emerald: { bg: "bg-emerald-500/15", glow: "shadow-[0_0_12px_rgba(16,185,129,0.3)]", icon: "text-emerald-400" },
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      {stats.map((stat) => {
        const colors = colorMap[stat.color];
        return (
          <div key={stat.label} className="card-glass flex items-center gap-3 p-4">
            <div className={`w-10 h-10 rounded-lg ${colors.bg} ${colors.glow} flex items-center justify-center`}>
              <stat.icon className={`w-5 h-5 ${colors.icon}`} />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
              <p className="text-xs text-text-secondary">{stat.label}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
