"use client";

import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string;
  trend: number;
  icon: React.ElementType;
}

export function StatCard({ label, value, trend, icon: Icon }: StatCardProps): React.ReactElement {
  const isPositive = trend >= 0;

  return (
    <div className="card-glass relative overflow-hidden p-5">
      <div className={cn(
        "absolute top-0 left-0 right-0 h-[2px]",
        isPositive ? "bg-gradient-to-r from-emerald-500/60 to-emerald-500/0" : "bg-gradient-to-r from-red-500/60 to-red-500/0"
      )} />
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-[#6b8baf]">{label}</p>
          <p className="mt-1 text-3xl font-bold text-white">{value}</p>
        </div>
        <div className="rounded-lg bg-violet-500/15 p-2.5 shadow-[0_0_12px_rgba(124,58,237,0.2)]">
          <Icon className="size-5 text-violet-400" />
        </div>
      </div>
      <div className="mt-3 flex items-center gap-1 text-sm">
        {isPositive ? (
          <TrendingUp className="size-4 text-emerald-400" aria-label="Trending up" />
        ) : (
          <TrendingDown className="size-4 text-red-400" aria-label="Trending down" />
        )}
        <span className={cn(
          "font-medium px-1.5 py-0.5 rounded text-xs",
          isPositive ? "bg-emerald-500/15 text-emerald-400" : "bg-red-500/15 text-red-400"
        )}>
          {isPositive ? "+" : ""}{trend}%
        </span>
        <span className="text-[#4a6585]">vs last period</span>
      </div>
    </div>
  );
}
