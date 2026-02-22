"use client";

import { cn } from "@/lib/utils";

interface PriceIntelligenceProps {
  priceLow: number | null;
  priceHigh: number | null;
  stretchCeiling: number | null;
  confidence: string | null;
}

export function PriceIntelligence({
  priceLow,
  priceHigh,
  stretchCeiling,
  confidence,
}: PriceIntelligenceProps) {
  const isLowConfidence = confidence === "LOW";

  const formatPrice = (num: number | null) => {
    if (num === null) return "N/A";
    return `$${new Intl.NumberFormat("en-US").format(num)}`;
  };

  const getResistance = () => {
    if (stretchCeiling === null || priceHigh === null) {
      return { label: "High", color: "text-red-600", dotColor: "bg-red-600" };
    }

    if (stretchCeiling <= priceHigh * 1.05) {
      return { label: "High", color: "text-red-600", dotColor: "bg-red-600" };
    }

    if (stretchCeiling > priceHigh * 1.3) {
      return { label: "Low", color: "text-emerald-600", dotColor: "bg-emerald-600" };
    }

    return { label: "Medium", color: "text-amber-600", dotColor: "bg-amber-600" };
  };

  const resistance = getResistance();

  return (
    <div className={cn("space-y-3", isLowConfidence && "opacity-50")}>
      {isLowConfidence && (
        <p className="text-sm text-navy-700 italic">
          Limited price signals on this call
        </p>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-white border border-navy-200 rounded-lg p-4">
          <div className="text-sm text-navy-700 mb-1">Comfort Range</div>
          <div className="text-lg font-semibold text-emerald-600">
            {priceLow !== null && priceHigh !== null
              ? `${formatPrice(priceLow)} - ${formatPrice(priceHigh)}`
              : "N/A"}
          </div>
        </div>

        <div className="bg-white border border-navy-200 rounded-lg p-4">
          <div className="text-sm text-navy-700 mb-1">Stretch Ceiling</div>
          <div className="text-lg font-semibold text-amber-600">
            {formatPrice(stretchCeiling)}
          </div>
        </div>

        <div className="bg-white border border-navy-200 rounded-lg p-4">
          <div className="text-sm text-navy-700 mb-1">Resistance</div>
          <div className="flex items-center gap-2">
            <div className={cn("w-2 h-2 rounded-full", resistance.dotColor)} />
            <div className={cn("text-lg font-semibold", resistance.color)}>
              {resistance.label}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
