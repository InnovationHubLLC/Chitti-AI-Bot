"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { LeadStatus } from "@/lib/types/calls";

interface StatusBadgeProps {
  status: LeadStatus | string;
  className?: string;
}

export const STATUS_STYLES: Record<LeadStatus, { label: string; className: string }> = {
  new: { label: "New", className: "bg-blue-100 text-blue-700 border-blue-200" },
  contacted: { label: "Contacted", className: "bg-amber-100 text-amber-700 border-amber-200" },
  converted: { label: "Converted", className: "bg-emerald-100 text-emerald-700 border-emerald-200" },
  lost: { label: "Lost", className: "bg-gray-100 text-gray-500 border-gray-200" },
};

export function StatusBadge({ status, className }: StatusBadgeProps): React.ReactElement {
  const config = STATUS_STYLES[status as LeadStatus] ?? STATUS_STYLES.new;

  return (
    <Badge className={cn(config.className, "text-xs", className)}>
      {config.label}
    </Badge>
  );
}
