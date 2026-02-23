"use client";

import { cn } from "@/lib/utils";

interface DealScoreDisplayProps {
  score: number;
  variant?: "dots" | "text";
  className?: string;
}

function scoreColor(score: number): string {
  if (score >= 8) return "text-emerald-600";
  if (score >= 5) return "text-amber-600";
  return "text-navy-400";
}

export function DealScoreDisplay({ score, variant = "text", className }: DealScoreDisplayProps): React.ReactElement {
  if (variant === "dots") {
    return (
      <div className={cn("space-y-2", className)}>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-navy-900">Deal Intent Score</span>
          <span className="text-sm font-semibold text-navy-900">{score}/10</span>
        </div>
        <div className="flex items-center gap-1">
          {Array.from({ length: 10 }).map((_, index) => (
            <div
              key={index}
              className={cn(
                "h-2 w-2 rounded-full",
                index < score ? "bg-navy-900" : "bg-gray-200"
              )}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <span className={cn("font-semibold", scoreColor(score), className)}>
      {score}/10
    </span>
  );
}
