"use client";

import { Phone, Users, Star, TrendingUp } from "lucide-react";
import type { AnalyticsStats } from "@/lib/types/analytics";
import { StatCard } from "./stat-card";

interface StatCardsRowProps {
  stats: AnalyticsStats;
}

export function StatCardsRow({ stats }: StatCardsRowProps): React.ReactElement {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        label="Total Calls"
        value={stats.total_calls.toLocaleString()}
        trend={stats.total_calls_trend}
        icon={Phone}
      />
      <StatCard
        label="Leads Generated"
        value={stats.leads_generated.toLocaleString()}
        trend={stats.leads_generated_trend}
        icon={Users}
      />
      <StatCard
        label="Avg Score"
        value={stats.avg_score.toFixed(1)}
        trend={stats.avg_score_trend}
        icon={Star}
      />
      <StatCard
        label="Conversion Rate"
        value={`${stats.conversion_rate}%`}
        trend={stats.conversion_rate_trend}
        icon={TrendingUp}
      />
    </div>
  );
}
