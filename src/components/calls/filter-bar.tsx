"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { DateRange, LeadScore, SortOption } from "@/lib/types/calls";

interface FilterBarProps {
  dateRange: DateRange;
  onDateRangeChange: (val: DateRange) => void;
  activeScores: LeadScore[];
  onToggleScore: (score: LeadScore) => void;
  searchQuery: string;
  onSearchChange: (val: string) => void;
  sortBy: SortOption;
  onSortChange: (val: SortOption) => void;
}

const SCORE_PILLS: { value: LeadScore; label: string; activeClass: string }[] = [
  { value: "HOT", label: "Hot", activeClass: "bg-red-500/15 text-red-400 border-red-500/30 shadow-[0_0_8px_rgba(239,68,68,0.15)]" },
  { value: "WARM", label: "Warm", activeClass: "bg-amber-500/15 text-amber-400 border-amber-500/30 shadow-[0_0_8px_rgba(245,158,11,0.15)]" },
  { value: "COLD", label: "Cold", activeClass: "bg-sky-500/15 text-sky-400 border-sky-500/30 shadow-[0_0_8px_rgba(14,165,233,0.15)]" },
];

export function FilterBar({
  dateRange,
  onDateRangeChange,
  activeScores,
  onToggleScore,
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
}: FilterBarProps) {
  return (
    <div className="sticky top-[73px] z-30 bg-gradient-to-b from-surface-base/95 to-surface-base/80 backdrop-blur-sm border-b border-border-dim -mx-4 px-4 sm:-mx-6 sm:px-6 py-4">
      <div className="flex flex-col gap-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4a6585]" />
            <Input
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search by name, phone, or service..."
              className="pl-9 bg-[#0d1726] border-[#1e3050] text-white placeholder:text-[#4a6585]"
            />
          </div>

          <Select value={dateRange} onValueChange={(v) => onDateRangeChange(v as DateRange)}>
            <SelectTrigger className="w-full sm:w-[160px] bg-[#0d1726] border-[#1e3050] text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-[#0d1726] border-[#1e3050]">
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="all">All Time</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={(v) => onSortChange(v as SortOption)}>
            <SelectTrigger className="w-full sm:w-[180px] bg-[#0d1726] border-[#1e3050] text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-[#0d1726] border-[#1e3050]">
              <SelectItem value="newest">Newest first</SelectItem>
              <SelectItem value="highest_score">Highest score first</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-[#4a6585] mr-1">Lead score:</span>
          {SCORE_PILLS.map((pill) => {
            const isActive = activeScores.length === 0 || activeScores.includes(pill.value);
            return (
              <button
                key={pill.value}
                onClick={() => onToggleScore(pill.value)}
                className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                  isActive
                    ? pill.activeClass
                    : "bg-[#0d1726] text-[#4a6585] border-[#1e3050] hover:border-[#2a4268]"
                }`}
              >
                {pill.label}
              </button>
            );
          })}
          {activeScores.length > 0 && (
            <button
              onClick={() => activeScores.forEach(onToggleScore)}
              className="text-xs text-[#6b8baf] hover:text-white ml-1"
            >
              Clear
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
