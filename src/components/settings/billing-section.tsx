"use client";

import type React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
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
      return "bg-green-100 text-green-800 hover:bg-green-100";
    case "trialing":
      return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
    case "past_due":
      return "bg-red-100 text-red-800 hover:bg-red-100";
    case "canceled":
      return "bg-red-100 text-red-800 hover:bg-red-100";
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
    <Card>
      <CardHeader>
        <CardTitle>Billing & Subscription</CardTitle>
        <CardDescription>
          Your current plan, usage, and billing details.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Plan</p>
              <p className="text-lg font-semibold">{subscription.plan}</p>
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
              <span className="text-muted-foreground">Minutes Used</span>
              <span className="font-medium">
                {subscription.minutesUsed} / {subscription.minutesLimit} minutes
              </span>
            </div>
            <Progress value={usagePercent} aria-label="Minutes usage" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Price</p>
              <p className="text-sm font-medium">
                ${subscription.pricePerMonth}/month
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">
                Current Period Ends
              </p>
              <p className="text-sm font-medium">
                {formatDate(subscription.currentPeriodEnd)}
              </p>
            </div>
          </div>

          <div className="flex justify-end pt-2 border-t">
            <Button variant="outline" disabled>
              Manage Subscription
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
