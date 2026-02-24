"use client";

import type React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CreditCard } from "lucide-react";
import { cn } from "@/lib/utils";
import type { SubscriptionInfo, SubscriptionStatus } from "@/lib/types/settings";

interface BillingSectionProps {
  subscription: SubscriptionInfo;
}

function getStatusVariant(
  status: SubscriptionStatus
): "default" | "secondary" | "destructive" | "outline" {
  switch (status) {
    case "active":
      return "default";
    case "trialing":
      return "secondary";
    case "past_due":
    case "canceled":
      return "destructive";
    default:
      return "outline";
  }
}

function getStatusColor(status: SubscriptionStatus): string {
  switch (status) {
    case "active":
      return "bg-emerald-500/15 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/15";
    case "trialing":
      return "bg-amber-500/15 text-amber-400 border-amber-500/30 hover:bg-amber-500/15";
    case "past_due":
      return "bg-red-500/15 text-red-400 border-red-500/30 hover:bg-red-500/15";
    case "canceled":
      return "bg-red-500/15 text-red-400 border-red-500/30 hover:bg-red-500/15";
    default:
      return "";
  }
}

function getStatusLabel(status: SubscriptionStatus): string {
  switch (status) {
    case "active":
      return "Active";
    case "trialing":
      return "Trial";
    case "past_due":
      return "Past Due";
    case "canceled":
      return "Canceled";
    default:
      return status;
  }
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function BillingSection({
  subscription,
}: BillingSectionProps): React.ReactElement {
  const usagePercent = Math.round(
    (subscription.minutesUsed / subscription.minutesLimit) * 100
  );

  return (
    <div className="card-elevated">
      <div className="flex items-center justify-between p-5 border-b border-[#1e3050]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-violet-500/15 flex items-center justify-center shadow-[0_0_12px_rgba(124,58,237,0.2)]">
            <CreditCard className="size-5 text-violet-400" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-white">Billing & Subscription</h3>
            <p className="text-xs text-[#6b8baf]">Your current plan, usage, and billing details.</p>
          </div>
        </div>
      </div>
      <div className="p-5">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs uppercase tracking-wider text-[#6b8baf]">Plan</p>
              <p className="text-lg font-semibold text-white">{subscription.plan}</p>
            </div>
            <Badge
              variant={getStatusVariant(subscription.status)}
              className={cn(getStatusColor(subscription.status))}
            >
              {getStatusLabel(subscription.status)}
            </Badge>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-[#6b8baf]">Minutes Used</span>
              <span className="font-medium text-[#c8daf0]">
                {subscription.minutesUsed} / {subscription.minutesLimit} minutes
              </span>
            </div>
            <Progress value={usagePercent} aria-label="Minutes usage" className="bg-[#1e3050] [&>[data-state]]:bg-accent-500" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-[#1e3050]">
            <div className="space-y-1">
              <p className="text-xs uppercase tracking-wider text-[#6b8baf]">Price</p>
              <p className="text-sm font-medium text-[#c8daf0]">
                ${subscription.pricePerMonth}/month
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-xs uppercase tracking-wider text-[#6b8baf]">
                Current Period Ends
              </p>
              <p className="text-sm font-medium text-[#c8daf0]">
                {formatDate(subscription.currentPeriodEnd)}
              </p>
            </div>
          </div>

          <div className="flex justify-end pt-2 border-t border-[#1e3050]">
            <Button variant="outline" disabled className="border-[#1e3050] text-[#4a6585]">
              Manage Subscription
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
