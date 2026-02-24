"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Trophy } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LeadRow } from "@/components/leads/lead-row";
import type { Lead } from "@/lib/constants/mock-leads";
import type { Call, LeadStatus, LeadSortOption, DateRange } from "@/lib/types/calls";

const STATUS_PILLS: { value: LeadStatus | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "converted", label: "Converted" },
  { value: "lost", label: "Lost" },
];

function getBusinessId(): string | null {
  const match = document.cookie.match(/(?:^|;\s*)onboarding_business_id=([^;]*)/);
  return match ? decodeURIComponent(match[1]) : null;
}

function callToLead(call: Call): Lead {
  return {
    id: call.id,
    call_id: call.id,
    caller_name: call.caller_name,
    phone_number: call.phone_number,
    service_requested: call.service_requested,
    deal_intent_score: call.deal_intent_score ?? 0,
    lead_score: call.lead_score ?? "WARM",
    price_comfort_low: call.price_comfort_low ?? 0,
    price_comfort_high: call.price_comfort_high ?? 0,
    status: (call.status as LeadStatus) ?? "new",
    created_at: call.created_at ?? new Date().toISOString(),
  };
}

export default function LeadsPage() {
  const router = useRouter();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<LeadStatus | "all">("all");
  const [timeFilter, setTimeFilter] = useState<DateRange>("all");
  const [sortBy, setSortBy] = useState<LeadSortOption>("highest_score");

  const fetchLeads = useCallback(async () => {
    const businessId = getBusinessId();
    if (!businessId) {
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`/api/dashboard/calls?businessId=${businessId}&minScore=5`);
      const json = await res.json();
      if (json.success) {
        const callData: Call[] = json.data ?? [];
        setLeads(callData.map(callToLead));
      }
    } catch (error) {
      console.error("Failed to fetch leads:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  const handleStatusChange = async (leadId: string, newStatus: LeadStatus) => {
    setLeads((prev) =>
      prev.map((l) => (l.id === leadId ? { ...l, status: newStatus } : l))
    );

    const businessId = getBusinessId();
    if (!businessId) return;

    try {
      await fetch("/api/dashboard/calls", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: leadId, businessId, status: newStatus }),
      });
    } catch (error) {
      console.error("Failed to update lead status:", error);
    }
  };

  const filteredLeads = useMemo(() => {
    let result = [...leads];

    if (statusFilter !== "all") {
      result = result.filter((l) => l.status === statusFilter);
    }

    if (timeFilter !== "all") {
      const now = new Date();
      let cutoff: Date;
      if (timeFilter === "today") {
        cutoff = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      } else if (timeFilter === "week") {
        cutoff = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      } else {
        cutoff = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      }
      result = result.filter((l) => new Date(l.created_at) >= cutoff);
    }

    if (sortBy === "highest_score") {
      result.sort((a, b) => b.deal_intent_score - a.deal_intent_score);
    } else if (sortBy === "newest") {
      result.sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    } else {
      result.sort((a, b) => b.price_comfort_high - a.price_comfort_high);
    }

    return result;
  }, [leads, statusFilter, timeFilter, sortBy]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-navy-600" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-2">
        <h1 className="text-2xl sm:text-3xl font-bold text-navy-900">Leads</h1>
        <p className="text-sm text-navy-400 mt-1">
          Ranked by deal potential. Call the top ones first.
        </p>
      </div>

      <div className="sticky top-[73px] z-30 bg-white/95 backdrop-blur-sm border-b border-gray-100 -mx-4 px-4 sm:-mx-6 sm:px-6 py-4">
        <div className="flex flex-col gap-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <Select
              value={timeFilter}
              onValueChange={(v) => setTimeFilter(v as DateRange)}
            >
              <SelectTrigger className="w-full sm:w-[160px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="all">All Time</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={sortBy}
              onValueChange={(v) => setSortBy(v as LeadSortOption)}
            >
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="highest_score">Highest Score</SelectItem>
                <SelectItem value="newest">Most Recent</SelectItem>
                <SelectItem value="highest_value">Highest Value</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {STATUS_PILLS.map((pill) => (
              <button
                key={pill.value}
                onClick={() => setStatusFilter(pill.value)}
                className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                  statusFilter === pill.value
                    ? "bg-navy-900 text-white border-navy-900"
                    : "bg-gray-50 text-navy-500 border-gray-200 hover:border-navy-300"
                }`}
              >
                {pill.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6">
        {filteredLeads.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-full bg-navy-50 flex items-center justify-center mb-5">
              <Trophy className="w-8 h-8 text-navy-300" />
            </div>
            <h3 className="text-lg font-semibold text-navy-800 mb-2">
              No leads yet
            </h3>
            <p className="text-sm text-navy-400 max-w-sm">
              Calls will appear here ranked by deal potential once Chitti starts
              answering.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredLeads.map((lead, index) => (
              <LeadRow
                key={lead.id}
                lead={lead}
                rank={index + 1}
                onStatusChange={handleStatusChange}
                onClick={() =>
                  router.push(`/dashboard/calls/${lead.call_id}`)
                }
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
