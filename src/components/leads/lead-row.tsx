"use client";

import { Phone, MessageSquare, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Lead } from "@/lib/constants/mock-leads";
import type { LeadStatus } from "@/lib/types/calls";
import { ScoreBadge } from "@/components/shared/score-badge";
import { StatusBadge, STATUS_STYLES } from "@/components/shared/status-badge";
import { DealScoreDisplay } from "@/components/shared/deal-score-display";
import { PriceRangeDisplay } from "@/components/shared/price-range-display";
import { formatRelativeTime } from "@/components/shared/time-ago";

interface LeadRowProps {
  lead: Lead;
  rank: number;
  onStatusChange: (leadId: string, status: LeadStatus) => void;
  onClick: () => void;
}

const STATUS_OPTIONS: LeadStatus[] = ["new", "contacted", "converted", "lost"];

export function LeadRow({ lead, rank, onStatusChange, onClick }: LeadRowProps): React.ReactElement {
  const isLost = lead.status === "lost";
  const isConverted = lead.status === "converted";

  return (
    <div
      onClick={onClick}
      className={`flex flex-col lg:flex-row lg:items-center gap-4 p-4 sm:p-5 rounded-xl border bg-white cursor-pointer transition-all hover:shadow-md hover:border-navy-200 ${
        isConverted ? "border-l-4 border-l-emerald-500" : ""
      } ${isLost ? "opacity-60" : ""}`}
    >
      <div className="flex items-center gap-4 lg:gap-5 flex-1 min-w-0">
        <span className="text-2xl font-bold text-navy-200 w-8 text-right shrink-0">
          #{rank}
        </span>

        <div className="flex-1 min-w-0">
          <p className="font-semibold text-navy-900 truncate">
            {lead.caller_name ?? "Unknown Caller"}
          </p>
          <p className="text-sm text-navy-400 truncate">{lead.phone_number}</p>
          <p className="text-sm text-navy-500 truncate mt-0.5">
            {lead.service_requested}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-6 lg:gap-8">
        <div className="text-center">
          <DealScoreDisplay score={lead.deal_intent_score} variant="text" className="text-xl" />
          <PriceRangeDisplay
            low={lead.price_comfort_low}
            high={lead.price_comfort_high}
            className="text-xs text-navy-400"
          />
        </div>

        <div className="flex flex-col items-center gap-1">
          <div className="relative group">
            <StatusBadge status={lead.status} className="cursor-pointer" />
            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 bg-white border rounded-lg shadow-lg p-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10 min-w-[120px]">
              {STATUS_OPTIONS.filter((s) => s !== lead.status).map((s) => (
                <button
                  key={s}
                  onClick={(e) => {
                    e.stopPropagation();
                    onStatusChange(lead.id, s);
                  }}
                  className="w-full text-left px-3 py-1.5 text-xs rounded hover:bg-gray-50 text-navy-700"
                >
                  {STATUS_STYLES[s].label}
                </button>
              ))}
            </div>
          </div>
          <span className="text-xs text-navy-400">
            {formatRelativeTime(lead.created_at)}
          </span>
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={(e) => {
              e.stopPropagation();
              window.location.href = `tel:${lead.phone_number.replace(/\D/g, "")}`;
            }}
            title="Call back"
          >
            <Phone className="size-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={(e) => {
              e.stopPropagation();
              window.location.href = `sms:${lead.phone_number.replace(/\D/g, "")}`;
            }}
            title="Send SMS"
          >
            <MessageSquare className="size-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={(e) => {
              e.stopPropagation();
              if (lead.status !== "contacted") {
                onStatusChange(lead.id, "contacted");
              }
            }}
            title="Mark contacted"
          >
            <UserCheck className="size-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
