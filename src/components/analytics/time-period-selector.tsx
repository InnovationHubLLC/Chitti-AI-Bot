"use client";

import type { TimePeriod } from "@/lib/types/analytics";
import { cn } from "@/lib/utils";

interface TimePeriodSelectorProps {
  value: TimePeriod;
  onChange: (period: TimePeriod) => void;
}

const PERIODS: { value: TimePeriod; label: string }[] = [
  { value: "7d", label: "7D" },
  { value: "30d", label: "30D" },
  { value: "90d", label: "90D" },
  { value: "custom", label: "Custom" },
];

export function TimePeriodSelector({ value, onChange }: TimePeriodSelectorProps): React.ReactElement {
  return (
    <div className="flex items-center gap-1 rounded-lg bg-[#0a1525] border border-[#1e3050] p-1" role="group" aria-label="Time period">
      {PERIODS.map((period) => (
        <button
          key={period.value}
          onClick={() => onChange(period.value)}
          className={cn(
            "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
            value === period.value
              ? "bg-[#1a2e4a] text-white border border-[#2a4268]"
              : "text-[#6b8baf] hover:text-white"
          )}
          aria-pressed={value === period.value}
        >
          {period.label}
        </button>
      ))}
    </div>
  );
}
