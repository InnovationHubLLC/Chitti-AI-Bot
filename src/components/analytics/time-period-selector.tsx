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
    <div className="flex items-center gap-1 rounded-lg bg-gray-100 p-1" role="group" aria-label="Time period">
      {PERIODS.map((period) => (
        <button
          key={period.value}
          onClick={() => onChange(period.value)}
          className={cn(
            "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
            value === period.value
              ? "bg-white text-navy-900 shadow-sm"
              : "text-gray-500 hover:text-gray-700"
          )}
          aria-pressed={value === period.value}
        >
          {period.label}
        </button>
      ))}
    </div>
  );
}
