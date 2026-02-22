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
    },
    {
      icon: Flame,
      value: hotLeads.length,
      label: hotLeads.length === 1 ? "hot lead" : "hot leads",
    },
    {
      icon: CalendarCheck,
      value: 0,
      label: "appointments",
    },
  ];

  return (
    <div className="flex items-center gap-4 sm:gap-6 flex-wrap">
      {stats.map((stat) => (
        <div key={stat.label} className="flex items-center gap-1.5 text-sm text-navy-500">
          <stat.icon className="w-4 h-4 text-navy-300" />
          <span className="font-semibold text-navy-800">{stat.value}</span>
          <span>{stat.label}</span>
        </div>
      ))}
    </div>
  );
}
