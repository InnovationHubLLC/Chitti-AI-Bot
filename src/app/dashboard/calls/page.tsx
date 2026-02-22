"use client";

import { useState, useMemo } from "react";
import { CallCard } from "@/components/calls/call-card";
import { FilterBar } from "@/components/calls/filter-bar";
import { StatsHeader } from "@/components/calls/stats-header";
import { EmptyState } from "@/components/calls/empty-state";
import { Button } from "@/components/ui/button";
import { MOCK_CALLS } from "@/lib/constants/mock-calls";
import type { DateRange, LeadScore, SortOption } from "@/lib/types/calls";

const PAGE_SIZE = 20;

export default function CallsPage() {
  const [dateRange, setDateRange] = useState<DateRange>("all");
  const [activeScores, setActiveScores] = useState<LeadScore[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const handleToggleScore = (score: LeadScore) => {
    setActiveScores((prev) =>
      prev.includes(score) ? prev.filter((s) => s !== score) : [...prev, score]
    );
  };

  const filteredCalls = useMemo(() => {
    let result = [...MOCK_CALLS];

    if (dateRange !== "all") {
      const now = new Date();
      let cutoff: Date;
      if (dateRange === "today") {
        cutoff = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      } else if (dateRange === "week") {
        cutoff = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      } else {
        cutoff = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      }
      result = result.filter(
        (c) => c.created_at && new Date(c.created_at) >= cutoff
      );
    }

    if (activeScores.length > 0) {
      result = result.filter((c) =>
        activeScores.includes((c.lead_score ?? "WARM").toUpperCase() as LeadScore)
      );
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (c) =>
          (c.caller_name ?? "").toLowerCase().includes(q) ||
          c.phone_number.toLowerCase().includes(q) ||
          (c.service_requested ?? "").toLowerCase().includes(q)
      );
    }

    if (sortBy === "highest_score") {
      result.sort((a, b) => (b.deal_intent_score ?? 0) - (a.deal_intent_score ?? 0));
    } else {
      result.sort(
        (a, b) =>
          new Date(b.created_at ?? 0).getTime() -
          new Date(a.created_at ?? 0).getTime()
      );
    }

    return result;
  }, [dateRange, activeScores, searchQuery, sortBy]);

  const visibleCalls = filteredCalls.slice(0, visibleCount);
  const hasMore = visibleCount < filteredCalls.length;

  return (
    <div>
      <div className="mb-2">
        <h1 className="text-2xl sm:text-3xl font-bold text-navy-900">Calls</h1>
        <div className="mt-2">
          <StatsHeader calls={MOCK_CALLS} />
        </div>
      </div>

      <FilterBar
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
        activeScores={activeScores}
        onToggleScore={handleToggleScore}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        sortBy={sortBy}
        onSortChange={setSortBy}
      />

      <div className="mt-6">
        {filteredCalls.length === 0 ? (
          searchQuery || activeScores.length > 0 || dateRange !== "all" ? (
            <div className="text-center py-16">
              <p className="text-navy-400">
                No calls match your filters. Try adjusting your search.
              </p>
            </div>
          ) : (
            <EmptyState />
          )
        ) : (
          <div className="space-y-3">
            {visibleCalls.map((call) => (
              <CallCard key={call.id} call={call} />
            ))}

            {hasMore && (
              <div className="flex justify-center pt-4">
                <Button
                  variant="outline"
                  onClick={() => setVisibleCount((prev) => prev + PAGE_SIZE)}
                >
                  Load more
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
