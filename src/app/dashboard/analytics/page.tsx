"use client";

import { useState, useEffect, useCallback } from "react";
import type {
  TimePeriod,
  DailyCallVolume,
  LeadQualityBreakdown,
  HourlyDistribution,
  ServiceBreakdown,
  AnalyticsStats,
} from "@/lib/types/analytics";
import { TimePeriodSelector } from "@/components/analytics/time-period-selector";
import { StatCardsRow } from "@/components/analytics/stat-cards-row";
import { CallsPerDayChart } from "@/components/analytics/calls-per-day-chart";
import { LeadQualityDonutChart } from "@/components/analytics/lead-quality-donut-chart";
import { PeakCallHoursChart } from "@/components/analytics/peak-call-hours-chart";
import { TopServicesChart } from "@/components/analytics/top-services-chart";

const EMPTY_STATS: AnalyticsStats = {
  total_calls: 0,
  total_calls_trend: 0,
  leads_generated: 0,
  leads_generated_trend: 0,
  avg_score: 0,
  avg_score_trend: 0,
  conversion_rate: 0,
  conversion_rate_trend: 0,
};

function getBusinessId(): string | null {
  const match = document.cookie.match(/(?:^|;\s*)onboarding_business_id=([^;]*)/);
  return match ? decodeURIComponent(match[1]) : null;
}

export default function AnalyticsPage(): React.ReactElement {
  const [timePeriod, setTimePeriod] = useState<TimePeriod>("30d");
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<AnalyticsStats>(EMPTY_STATS);
  const [dailyCalls, setDailyCalls] = useState<DailyCallVolume[]>([]);
  const [leadQuality, setLeadQuality] = useState<LeadQualityBreakdown[]>([]);
  const [hourlyDistribution, setHourlyDistribution] = useState<HourlyDistribution[]>([]);
  const [topServices, setTopServices] = useState<ServiceBreakdown[]>([]);

  const fetchAnalytics = useCallback(async (period: string) => {
    const businessId = getBusinessId();
    if (!businessId) {
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(
        `/api/dashboard/analytics?businessId=${businessId}&period=${period}`
      );
      const json = await res.json();
      if (json.success && json.data) {
        setStats(json.data.stats);
        setDailyCalls(json.data.dailyCalls);
        setLeadQuality(json.data.leadQuality);
        setHourlyDistribution(json.data.hourlyDistribution);
        setTopServices(json.data.topServices);
      }
    } catch (error) {
      console.error("Failed to fetch analytics:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    fetchAnalytics(timePeriod);
  }, [timePeriod, fetchAnalytics]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-navy-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Analytics</h1>
          <p className="text-sm text-[#6b8baf]">Track your call performance and lead metrics</p>
        </div>
        <TimePeriodSelector value={timePeriod} onChange={setTimePeriod} />
      </div>

      {/* Stat cards */}
      <StatCardsRow stats={stats} />

      {/* Charts 2x2 grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <CallsPerDayChart data={dailyCalls} />
        <LeadQualityDonutChart data={leadQuality} />
        <PeakCallHoursChart data={hourlyDistribution} />
        <TopServicesChart data={topServices} />
      </div>
    </div>
  );
}
