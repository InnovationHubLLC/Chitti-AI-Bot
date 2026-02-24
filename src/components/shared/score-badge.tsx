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
  HOT: "bg-red-500/15 text-red-400 border-red-500/30 shadow-[0_0_8px_rgba(239,68,68,0.15)]",
  WARM: "bg-amber-500/15 text-amber-400 border-amber-500/30 shadow-[0_0_8px_rgba(245,158,11,0.15)]",
  COLD: "bg-sky-500/15 text-sky-400 border-sky-500/30 shadow-[0_0_8px_rgba(14,165,233,0.15)]",
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
  HOT: { bg: "bg-red-500/10", text: "text-red-400", border: "border-red-500/30", leftBorder: "border-l-red-500" },
  WARM: { bg: "bg-amber-500/10", text: "text-amber-400", border: "border-amber-500/30", leftBorder: "border-l-amber-500" },
  COLD: { bg: "bg-sky-500/10", text: "text-sky-400", border: "border-sky-500/30", leftBorder: "border-l-sky-500" },
};
