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
      className={`w-full text-left rounded-xl p-4 sm:p-5 transition-all cursor-pointer group bg-[#0d1726]/60 border hover:bg-[#111f33] hover:border-[#2a4268] hover:-translate-y-px hover:shadow-[0_8px_32px_rgba(0,0,0,0.4)] ${
        !call.is_read ? "border-l-[3px] border-l-accent-500 border-t-[#1e3050] border-r-[#1e3050] border-b-[#1e3050]" : "border-[#1e3050]"
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-0">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            {!call.is_read && (
              <span className="size-2 rounded-full bg-accent-500 shrink-0" />
            )}
            <p className="font-semibold text-white truncate">
              {call.caller_name ?? "Unknown Caller"}
            </p>
          </div>
          <div className="flex items-center gap-3 mt-1">
            <span className="text-sm font-mono text-[#4a6585]">{call.phone_number}</span>
            <span className="text-[#1e3050]">|</span>
            <span className="text-sm text-[#6b8baf]">
              {formatRelativeTime(call.created_at)}
            </span>
          </div>
        </div>

        <div className="flex-1 min-w-0 sm:text-center">
          <p className="text-sm font-medium text-[#8ba8c8] truncate">
            {call.service_requested || "General Inquiry"}
          </p>
          <div className="flex items-center gap-1.5 mt-1 sm:justify-center">
            <Clock className="size-3.5 text-[#4a6585]" />
            <span className="text-sm text-[#6b8baf]">
              {formatDuration(call.duration)}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 sm:flex-col sm:items-end sm:gap-1.5">
          <ScoreBadge score={call.lead_score} size="sm" />
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-semibold text-white">
              {call.deal_intent_score ?? 5}/10
            </span>
            <ConfidenceBadge level={call.confidence_level} showLabel={false} />
          </div>
        </div>
      </div>
    </button>
  );
}
