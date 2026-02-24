"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { LeadStatus } from "@/lib/types/calls";

interface StatusBadgeProps {
  status: LeadStatus | string;
  className?: string;
}

export const STATUS_STYLES: Record<LeadStatus, { label: string; className: string }> = {
  new: { label: "New", className: "bg-blue-500/15 text-blue-400 border-blue-500/30" },
  contacted: { label: "Contacted", className: "bg-amber-500/15 text-amber-400 border-amber-500/30" },
  converted: { label: "Converted", className: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30" },
  lost: { label: "Lost", className: "bg-gray-500/15 text-gray-400 border-gray-500/30" },
};

export function StatusBadge({ status, className }: StatusBadgeProps): React.ReactElement {
  const config = STATUS_STYLES[status as LeadStatus] ?? STATUS_STYLES.new;

  return (
    <Badge className={cn(config.className, "text-xs", className)}>
      {config.label}
    </Badge>
  );
}
