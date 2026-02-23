"use client";

import { cn } from "@/lib/utils";

interface PriceRangeDisplayProps {
  low: number | null;
  high: number | null;
  stretch?: number | null;
  className?: string;
}

function formatPrice(num: number): string {
  return `$${new Intl.NumberFormat("en-US").format(num)}`;
}

export function PriceRangeDisplay({ low, high, stretch, className }: PriceRangeDisplayProps): React.ReactElement {
  if (low === null && high === null) {
    return <span className={cn("text-sm text-navy-400", className)}>No price data</span>;
  }

  return (
    <div className={cn("text-sm", className)}>
      <span className="text-navy-600">
        {formatPrice(low ?? 0)} - {formatPrice(high ?? 0)}
      </span>
      {stretch !== null && stretch !== undefined && (
        <span className="ml-2 text-amber-600">(stretch: {formatPrice(stretch)})</span>
      )}
    </div>
  );
}
