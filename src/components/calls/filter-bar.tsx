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
  { value: "HOT", label: "Hot", activeClass: "bg-red-100 text-red-700 border-red-300" },
  { value: "WARM", label: "Warm", activeClass: "bg-amber-100 text-amber-700 border-amber-300" },
  { value: "COLD", label: "Cold", activeClass: "bg-sky-100 text-sky-700 border-sky-300" },
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
    <div className="sticky top-[73px] z-30 bg-white/95 backdrop-blur-sm border-b border-gray-100 -mx-4 px-4 sm:-mx-6 sm:px-6 py-4">
      <div className="flex flex-col gap-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-navy-300" />
            <Input
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search by name, phone, or service..."
              className="pl-9"
            />
          </div>

          <Select value={dateRange} onValueChange={(v) => onDateRangeChange(v as DateRange)}>
            <SelectTrigger className="w-full sm:w-[160px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="all">All Time</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={(v) => onSortChange(v as SortOption)}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest first</SelectItem>
              <SelectItem value="highest_score">Highest score first</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-navy-400 mr-1">Lead score:</span>
          {SCORE_PILLS.map((pill) => {
            const isActive = activeScores.length === 0 || activeScores.includes(pill.value);
            return (
              <button
                key={pill.value}
                onClick={() => onToggleScore(pill.value)}
                className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                  isActive
                    ? pill.activeClass
                    : "bg-gray-50 text-navy-400 border-gray-200 hover:border-navy-300"
                }`}
              >
                {pill.label}
              </button>
            );
          })}
          {activeScores.length > 0 && (
            <button
              onClick={() => activeScores.forEach(onToggleScore)}
              className="text-xs text-navy-400 hover:text-navy-600 ml-1"
            >
              Clear
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
