"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { ConfidenceLevel } from "@/lib/types/calls";

interface ConfidenceBadgeProps {
  level: ConfidenceLevel | string | null;
  showLabel?: boolean;
  className?: string;
}

const CONFIDENCE_STYLES: Record<string, { bg: string; text: string; border: string; dot: string }> = {
  HIGH: { bg: "bg-emerald-500/15", text: "text-emerald-400", border: "border-emerald-500/30", dot: "bg-emerald-400" },
  MEDIUM: { bg: "bg-amber-500/15", text: "text-amber-400", border: "border-amber-500/30", dot: "bg-amber-400" },
  LOW: { bg: "bg-gray-500/15", text: "text-gray-400", border: "border-gray-500/30", dot: "bg-gray-500" },
};

export function ConfidenceBadge({ level, showLabel = true, className }: ConfidenceBadgeProps): React.ReactElement {
  const normalized = (level ?? "MEDIUM").toUpperCase();
  const styles = CONFIDENCE_STYLES[normalized] ?? CONFIDENCE_STYLES.MEDIUM;

  if (!showLabel) {
    return (
      <span
        className={cn("inline-block size-2 rounded-full", styles.dot, className)}
        title={`${normalized} confidence`}
      />
    );
  }

  return (
    <Badge
      variant="outline"
      className={cn(styles.bg, styles.text, styles.border, "font-semibold", className)}
    >
      {normalized} CONFIDENCE
    </Badge>
  );
}

export { CONFIDENCE_STYLES };
