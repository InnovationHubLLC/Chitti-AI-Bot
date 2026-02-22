"use client";

import { Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Call } from "@/lib/types/calls";

interface CallCardProps {
  call: Call;
  onClick?: () => void;
}

const LEAD_COLORS: Record<string, string> = {
  HOT: "bg-red-100 text-red-700 border-red-200",
  WARM: "bg-amber-100 text-amber-700 border-amber-200",
  COLD: "bg-sky-100 text-sky-700 border-sky-200",
};

const CONFIDENCE_DOT: Record<string, string> = {
  HIGH: "bg-emerald-500",
  MEDIUM: "bg-amber-400",
  LOW: "bg-gray-300",
};

function formatDuration(seconds: number | null): string {
  if (!seconds) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function formatRelativeTime(dateStr: string | null): string {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) {
    const time = date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
    return `${diffHours}h ago, ${time}`;
  }
  if (diffDays === 1) {
    return `Yesterday, ${date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    })}`;
  }
  return `${diffDays}d ago, ${date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  })}`;
}

export function CallCard({ call, onClick }: CallCardProps) {
  const leadScore = (call.lead_score ?? "WARM").toUpperCase();
  const confidence = (call.confidence_level ?? "MEDIUM").toUpperCase();

  return (
    <button
      onClick={onClick}
      className={`w-full text-left rounded-xl border bg-white p-4 sm:p-5 transition-all hover:shadow-md hover:border-navy-200 cursor-pointer group ${
        !call.is_read ? "border-l-4 border-l-accent-500" : "border-gray-100"
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-0">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            {!call.is_read && (
              <span className="w-2 h-2 rounded-full bg-accent-500 shrink-0" />
            )}
            <p className="font-semibold text-navy-900 truncate">
              {call.caller_name ?? "Unknown Caller"}
            </p>
          </div>
          <div className="flex items-center gap-3 mt-1">
            <span className="text-sm text-navy-400">{call.phone_number}</span>
            <span className="text-navy-200">|</span>
            <span className="text-sm text-navy-400">
              {formatRelativeTime(call.created_at)}
            </span>
          </div>
        </div>

        <div className="flex-1 min-w-0 sm:text-center">
          <p className="text-sm font-medium text-navy-700 truncate">
            {call.service_requested || "General Inquiry"}
          </p>
          <div className="flex items-center gap-1.5 mt-1 sm:justify-center">
            <Clock className="w-3.5 h-3.5 text-navy-300" />
            <span className="text-sm text-navy-400">
              {formatDuration(call.duration)}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 sm:flex-col sm:items-end sm:gap-1.5">
          <Badge className={`${LEAD_COLORS[leadScore] ?? LEAD_COLORS.WARM} text-xs px-2.5 py-0.5`}>
            {leadScore}
          </Badge>
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-semibold text-navy-700">
              {call.deal_intent_score ?? 5}/10
            </span>
            <span
              className={`w-2 h-2 rounded-full ${CONFIDENCE_DOT[confidence] ?? CONFIDENCE_DOT.MEDIUM}`}
              title={`${confidence} confidence`}
            />
          </div>
        </div>
      </div>
    </button>
  );
}
