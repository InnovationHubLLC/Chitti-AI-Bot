import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type {
  DailyCallVolume,
  LeadQualityBreakdown,
  HourlyDistribution,
  ServiceBreakdown,
  AnalyticsStats,
} from "@/lib/types/analytics";

interface CallRow {
  id: string;
  lead_score: string | null;
  deal_intent_score: number | null;
  service_requested: string | null;
  status: string | null;
  created_at: string;
}

function computeAnalytics(calls: CallRow[], previousCalls: CallRow[]): {
  stats: AnalyticsStats;
  dailyCalls: DailyCallVolume[];
  leadQuality: LeadQualityBreakdown[];
  hourlyDistribution: HourlyDistribution[];
  topServices: ServiceBreakdown[];
} {
  const totalCalls = calls.length;
  const prevTotalCalls = previousCalls.length;

  const leads = calls.filter((c) => c.deal_intent_score && c.deal_intent_score >= 5);
  const prevLeads = previousCalls.filter((c) => c.deal_intent_score && c.deal_intent_score >= 5);

  const avgScore = totalCalls > 0
    ? calls.reduce((sum, c) => sum + (c.deal_intent_score ?? 0), 0) / totalCalls
    : 0;
  const prevAvgScore = prevTotalCalls > 0
    ? previousCalls.reduce((sum, c) => sum + (c.deal_intent_score ?? 0), 0) / prevTotalCalls
    : 0;

  const converted = calls.filter((c) => c.status === "converted").length;
  const prevConverted = previousCalls.filter((c) => c.status === "converted").length;
  const conversionRate = totalCalls > 0 ? (converted / totalCalls) * 100 : 0;
  const prevConversionRate = prevTotalCalls > 0 ? (prevConverted / prevTotalCalls) * 100 : 0;

  function trend(current: number, previous: number): number {
    if (previous === 0) return current > 0 ? 100 : 0;
    return Math.round(((current - previous) / previous) * 1000) / 10;
  }

  const stats: AnalyticsStats = {
    total_calls: totalCalls,
    total_calls_trend: trend(totalCalls, prevTotalCalls),
    leads_generated: leads.length,
    leads_generated_trend: trend(leads.length, prevLeads.length),
    avg_score: Math.round(avgScore * 10) / 10,
    avg_score_trend: trend(avgScore, prevAvgScore),
    conversion_rate: Math.round(conversionRate * 10) / 10,
    conversion_rate_trend: trend(conversionRate, prevConversionRate),
  };

  // Daily call volumes
  const dailyMap = new Map<string, DailyCallVolume>();
  for (const call of calls) {
    const date = call.created_at.split("T")[0];
    const existing = dailyMap.get(date) ?? { date, answered: 0, missed: 0, voicemail: 0 };
    existing.answered += 1;
    dailyMap.set(date, existing);
  }
  const dailyCalls = Array.from(dailyMap.values()).sort((a, b) => a.date.localeCompare(b.date));

  // Lead quality breakdown
  const hot = calls.filter((c) => c.lead_score === "HOT").length;
  const warm = calls.filter((c) => c.lead_score === "WARM").length;
  const cold = calls.filter((c) => c.lead_score === "COLD").length;
  const leadQuality: LeadQualityBreakdown[] = [
    { label: "Hot", value: hot, color: "#ef4444" },
    { label: "Warm", value: warm, color: "#f59e0b" },
    { label: "Cold", value: cold, color: "#3b82f6" },
  ];

  // Hourly distribution
  const hourCounts = new Map<number, number>();
  for (const call of calls) {
    const hour = new Date(call.created_at).getHours();
    hourCounts.set(hour, (hourCounts.get(hour) ?? 0) + 1);
  }
  const hourlyDistribution: HourlyDistribution[] = [];
  for (let h = 8; h <= 19; h++) {
    const period = h < 12 ? "AM" : "PM";
    const display = h <= 12 ? h : h - 12;
    hourlyDistribution.push({
      hour: h,
      label: `${display} ${period}`,
      calls: hourCounts.get(h) ?? 0,
    });
  }

  // Top services
  const serviceCounts = new Map<string, number>();
  for (const call of calls) {
    if (call.service_requested) {
      const svc = call.service_requested;
      serviceCounts.set(svc, (serviceCounts.get(svc) ?? 0) + 1);
    }
  }
  const topServices: ServiceBreakdown[] = Array.from(serviceCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([service, count]) => ({
      service,
      count,
      percentage: totalCalls > 0 ? Math.round((count / totalCalls) * 100) : 0,
    }));

  return { stats, dailyCalls, leadQuality, hourlyDistribution, topServices };
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    const businessId = searchParams.get("businessId");
    const period = searchParams.get("period") ?? "30d";

    if (!businessId) {
      return NextResponse.json(
        { error: "Business ID is required" },
        { status: 400 }
      );
    }

    const daysMatch = period.match(/^(\d+)d$/);
    const days = daysMatch ? parseInt(daysMatch[1], 10) : 30;

    const now = new Date();
    const periodStart = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
    const previousStart = new Date(periodStart.getTime() - days * 24 * 60 * 60 * 1000);

    const [currentResult, previousResult] = await Promise.all([
      supabase
        .from("calls")
        .select("id, lead_score, deal_intent_score, service_requested, status, created_at")
        .eq("business_id", businessId)
        .gte("created_at", periodStart.toISOString()),
      supabase
        .from("calls")
        .select("id, lead_score, deal_intent_score, service_requested, status, created_at")
        .eq("business_id", businessId)
        .gte("created_at", previousStart.toISOString())
        .lt("created_at", periodStart.toISOString()),
    ]);

    if (currentResult.error || previousResult.error) {
      console.error("Error fetching analytics:", currentResult.error ?? previousResult.error);
      return NextResponse.json(
        { error: "Failed to fetch analytics data" },
        { status: 500 }
      );
    }

    const analytics = computeAnalytics(
      currentResult.data as CallRow[],
      previousResult.data as CallRow[]
    );

    return NextResponse.json({ success: true, data: analytics });
  } catch (error) {
    console.error("Error in analytics API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
