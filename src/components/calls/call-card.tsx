"use client";

import { Clock } from "lucide-react";
import type { Call } from "@/lib/types/calls";
import { ScoreBadge } from "@/components/shared/score-badge";
import { ConfidenceBadge } from "@/components/shared/confidence-badge";
import { formatRelativeTime, formatDuration } from "@/components/shared/time-ago";

interface CallCardProps {
  call: Call;
  onClick?: () => void;
}

export function CallCard({ call, onClick }: CallCardProps): React.ReactElement {
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
              <span className="size-2 rounded-full bg-accent-500 shrink-0" />
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
            <Clock className="size-3.5 text-navy-300" />
            <span className="text-sm text-navy-400">
              {formatDuration(call.duration)}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 sm:flex-col sm:items-end sm:gap-1.5">
          <ScoreBadge score={call.lead_score} size="sm" />
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-semibold text-navy-700">
              {call.deal_intent_score ?? 5}/10
            </span>
            <ConfidenceBadge level={call.confidence_level} showLabel={false} />
          </div>
        </div>
      </div>
    </button>
  );
}
