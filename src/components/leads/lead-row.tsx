"use client";

import { Phone, MessageSquare, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Lead } from "@/lib/constants/mock-leads";
import type { LeadStatus } from "@/lib/types/calls";
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
      className={`flex flex-col lg:flex-row lg:items-center gap-4 p-4 sm:p-5 rounded-xl border cursor-pointer transition-all card-glass-hover bg-[#0d1726]/60 ${
        isConverted ? "border-l-[3px] border-l-emerald-500 border-t-[#1e3050] border-r-[#1e3050] border-b-[#1e3050]" : "border-[#1e3050]"
      } ${isLost ? "opacity-50 grayscale-[30%]" : ""}`}
    >
      <div className="flex items-center gap-4 lg:gap-5 flex-1 min-w-0">
        <span className={`text-2xl font-bold w-8 text-right shrink-0 ${
          rank <= 3 ? "text-accent-400" : "text-[#2a4268]"
        } ${rank === 1 ? "drop-shadow-[0_0_6px_rgba(255,90,31,0.4)]" : ""}`}>
          #{rank}
        </span>

        <div className="flex-1 min-w-0">
          <p className="font-semibold text-white truncate">
            {lead.caller_name ?? "Unknown Caller"}
          </p>
          <p className="text-sm font-mono text-[#4a6585] truncate">{lead.phone_number}</p>
          <p className="text-sm text-[#8ba8c8] truncate mt-0.5">
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
            className="text-xs text-[#4a6585]"
          />
        </div>

        <div className="flex flex-col items-center gap-1">
          <div className="relative group">
            <StatusBadge status={lead.status} className="cursor-pointer" />
            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 bg-[#0d1726] border border-[#1e3050] rounded-lg shadow-[0_8px_32px_rgba(0,0,0,0.5)] p-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10 min-w-[120px]">
              {STATUS_OPTIONS.filter((s) => s !== lead.status).map((s) => (
                <button
                  key={s}
                  onClick={(e) => {
                    e.stopPropagation();
                    onStatusChange(lead.id, s);
                  }}
                  className="w-full text-left px-3 py-1.5 text-xs rounded hover:bg-[#111f33] text-[#c8daf0]"
                >
                  {STATUS_STYLES[s].label}
                </button>
              ))}
            </div>
          </div>
          <span className="text-xs text-[#6b8baf]">
            {formatRelativeTime(lead.created_at)}
          </span>
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon-xs"
            className="text-[#6b8baf] hover:text-white hover:bg-[#111f33]"
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
            className="text-[#6b8baf] hover:text-white hover:bg-[#111f33]"
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
            className="text-[#6b8baf] hover:text-white hover:bg-[#111f33]"
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
