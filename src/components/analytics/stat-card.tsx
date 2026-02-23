"use client";

import { TrendingUp, TrendingDown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string;
  trend: number;
  icon: React.ElementType;
}

export function StatCard({ label, value, trend, icon: Icon }: StatCardProps): React.ReactElement {
  const isPositive = trend >= 0;

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">{label}</p>
            <p className="mt-1 text-2xl font-bold text-navy-900">{value}</p>
          </div>
          <div className="rounded-lg bg-navy-50 p-2.5">
            <Icon className="size-5 text-navy-600" />
          </div>
        </div>
        <div className="mt-3 flex items-center gap-1 text-sm">
          {isPositive ? (
            <TrendingUp className="size-4 text-green-600" aria-label="Trending up" />
          ) : (
            <TrendingDown className="size-4 text-red-500" aria-label="Trending down" />
          )}
          <span className={cn("font-medium", isPositive ? "text-green-600" : "text-red-500")}>
            {isPositive ? "+" : ""}{trend}%
          </span>
          <span className="text-gray-400">vs last period</span>
        </div>
      </CardContent>
    </Card>
  );
}
