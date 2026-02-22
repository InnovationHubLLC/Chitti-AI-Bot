"use client";

import { Phone, MessageSquare, UserCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Lead } from "@/lib/constants/mock-leads";
import type { LeadStatus } from "@/lib/types/calls";

interface LeadRowProps {
  lead: Lead;
  rank: number;
  onStatusChange: (leadId: string, status: LeadStatus) => void;
  onClick: () => void;
}

const STATUS_CONFIG: Record<
  LeadStatus,
  { label: string; className: string }
> = {
  new: { label: "New", className: "bg-blue-100 text-blue-700 border-blue-200" },
  contacted: {
    label: "Contacted",
    className: "bg-amber-100 text-amber-700 border-amber-200",
  },
  converted: {
    label: "Converted",
    className: "bg-emerald-100 text-emerald-700 border-emerald-200",
  },
  lost: { label: "Lost", className: "bg-gray-100 text-gray-500 border-gray-200" },
};

const STATUS_OPTIONS: LeadStatus[] = ["new", "contacted", "converted", "lost"];

function formatPrice(num: number): string {
  return `$${new Intl.NumberFormat("en-US").format(num)}`;
}

function formatRelativeTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffHours < 1) return "Just now";
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return "Yesterday";
  return `${diffDays}d ago`;
}

function scoreColor(score: number): string {
  if (score >= 8) return "text-emerald-600";
  if (score >= 5) return "text-amber-600";
  return "text-navy-400";
}

export function LeadRow({ lead, rank, onStatusChange, onClick }: LeadRowProps) {
  const status = STATUS_CONFIG[lead.status] ?? STATUS_CONFIG.new;
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
          <p className={`text-xl font-bold ${scoreColor(lead.deal_intent_score)}`}>
            {lead.deal_intent_score}/10
          </p>
          <p className="text-xs text-navy-400">
            {formatPrice(lead.price_comfort_low)} -{" "}
            {formatPrice(lead.price_comfort_high)}
          </p>
        </div>

        <div className="flex flex-col items-center gap-1">
          <div className="relative group">
            <Badge className={`${status.className} text-xs cursor-pointer`}>
              {status.label}
            </Badge>
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
                  {STATUS_CONFIG[s].label}
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
            <Phone className="w-3.5 h-3.5" />
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
            <MessageSquare className="w-3.5 h-3.5" />
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
            <UserCheck className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
