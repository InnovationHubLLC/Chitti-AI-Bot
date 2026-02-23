"use client";

import { useState, useMemo } from "react";
import type { TimePeriod } from "@/lib/types/analytics";
import {
  MOCK_DAILY_CALLS,
  MOCK_LEAD_QUALITY,
  MOCK_HOURLY_DISTRIBUTION,
  MOCK_TOP_SERVICES,
  MOCK_ANALYTICS_STATS,
} from "@/lib/constants/mock-analytics";
import { TimePeriodSelector } from "@/components/analytics/time-period-selector";
import { StatCardsRow } from "@/components/analytics/stat-cards-row";
import { CallsPerDayChart } from "@/components/analytics/calls-per-day-chart";
import { LeadQualityDonutChart } from "@/components/analytics/lead-quality-donut-chart";
import { PeakCallHoursChart } from "@/components/analytics/peak-call-hours-chart";
import { TopServicesChart } from "@/components/analytics/top-services-chart";

const PERIOD_DAYS: Record<TimePeriod, number> = {
  "7d": 7,
  "30d": 30,
  "90d": 90,
  custom: 30,
};

export default function AnalyticsPage(): React.ReactElement {
  const [timePeriod, setTimePeriod] = useState<TimePeriod>("30d");

  const filteredCalls = useMemo(() => {
    const days = PERIOD_DAYS[timePeriod];
    return MOCK_DAILY_CALLS.slice(-days);
  }, [timePeriod]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy-900">Analytics</h1>
          <p className="text-sm text-gray-500">Track your call performance and lead metrics</p>
        </div>
        <TimePeriodSelector value={timePeriod} onChange={setTimePeriod} />
      </div>

      {/* Stat cards */}
      <StatCardsRow stats={MOCK_ANALYTICS_STATS} />

      {/* Charts 2x2 grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <CallsPerDayChart data={filteredCalls} />
        <LeadQualityDonutChart data={MOCK_LEAD_QUALITY} />
        <PeakCallHoursChart data={MOCK_HOURLY_DISTRIBUTION} />
        <TopServicesChart data={MOCK_TOP_SERVICES} />
      </div>
    </div>
  );
}
