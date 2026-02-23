"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { LeadScore } from "@/lib/types/calls";

interface ScoreBadgeProps {
  score: LeadScore | string | null;
  size?: "sm" | "default";
  className?: string;
}

const LEAD_SCORE_STYLES: Record<string, string> = {
  HOT: "bg-red-100 text-red-700 border-red-200",
  WARM: "bg-amber-100 text-amber-700 border-amber-200",
  COLD: "bg-sky-100 text-sky-700 border-sky-200",
};

export function ScoreBadge({ score, size = "default", className }: ScoreBadgeProps): React.ReactElement {
  const normalized = (score ?? "WARM").toUpperCase();
  const styles = LEAD_SCORE_STYLES[normalized] ?? LEAD_SCORE_STYLES.WARM;

  return (
    <Badge
      variant="outline"
      className={cn(
        styles,
        "font-semibold",
        size === "sm" && "text-xs px-2 py-0.5",
        className
      )}
    >
      {normalized}
    </Badge>
  );
}

/**
 * Shared color config for lead scores — use in cards with colored borders, backgrounds, etc.
 */
export const LEAD_SCORE_COLORS: Record<string, { bg: string; text: string; border: string; leftBorder: string }> = {
  HOT: { bg: "bg-red-50", text: "text-red-700", border: "border-red-200", leftBorder: "border-l-red-500" },
  WARM: { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200", leftBorder: "border-l-amber-500" },
  COLD: { bg: "bg-sky-50", text: "text-sky-700", border: "border-sky-200", leftBorder: "border-l-sky-500" },
};
