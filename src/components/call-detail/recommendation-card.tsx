"use client";

import { CallDetail } from "@/lib/types/calls";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface RecommendationCardProps {
  call: CallDetail;
}

export function RecommendationCard({ call }: RecommendationCardProps) {
  const getLeadScoreColors = (score: string | null) => {
    switch (score?.toUpperCase()) {
      case "HOT":
        return {
          bg: "bg-red-50",
          text: "text-red-700",
          border: "border-red-200",
          leftBorder: "border-l-red-500",
        };
      case "WARM":
        return {
          bg: "bg-amber-50",
          text: "text-amber-700",
          border: "border-amber-200",
          leftBorder: "border-l-amber-500",
        };
      case "COLD":
        return {
          bg: "bg-sky-50",
          text: "text-sky-700",
          border: "border-sky-200",
          leftBorder: "border-l-sky-500",
        };
      default:
        return {
          bg: "bg-gray-50",
          text: "text-gray-700",
          border: "border-gray-200",
          leftBorder: "border-l-gray-500",
        };
    }
  };

  const getConfidenceColors = (confidence: string | null) => {
    switch (confidence?.toUpperCase()) {
      case "HIGH":
        return {
          bg: "bg-emerald-50",
          text: "text-emerald-700",
          border: "border-emerald-200",
        };
      case "MEDIUM":
        return {
          bg: "bg-amber-50",
          text: "text-amber-700",
          border: "border-amber-200",
        };
      case "LOW":
        return {
          bg: "bg-gray-50",
          text: "text-gray-700",
          border: "border-gray-200",
        };
      default:
        return {
          bg: "bg-gray-50",
          text: "text-gray-700",
          border: "border-gray-200",
        };
    }
  };

  const leadScoreColors = getLeadScoreColors(call.lead_score);
  const confidenceColors = getConfidenceColors(call.confidence_level);

  const dealIntentScore = call.deal_intent_score ?? 0;

  return (
    <Card
      className={cn(
        "border-l-4",
        leadScoreColors.leftBorder,
        "shadow-lg"
      )}
    >
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2">
          {call.lead_score && (
            <Badge
              variant="outline"
              className={cn(
                leadScoreColors.bg,
                leadScoreColors.text,
                leadScoreColors.border,
                "font-semibold"
              )}
            >
              {call.lead_score.toUpperCase()}
            </Badge>
          )}
          {call.confidence_level && (
            <Badge
              variant="outline"
              className={cn(
                confidenceColors.bg,
                confidenceColors.text,
                confidenceColors.border,
                "font-semibold"
              )}
            >
              {call.confidence_level.toUpperCase()} CONFIDENCE
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {call.recommendation && (
          <p className="text-base sm:text-lg leading-relaxed text-navy-700">
            {call.recommendation}
          </p>
        )}

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-navy-900">
              Deal Intent Score
            </span>
            <span className="text-sm font-semibold text-navy-900">
              {dealIntentScore}/10
            </span>
          </div>
          <div className="flex items-center gap-1">
            {Array.from({ length: 10 }).map((_, index) => (
              <div
                key={index}
                className={cn(
                  "h-2 w-2 rounded-full",
                  index < dealIntentScore
                    ? "bg-navy-900"
                    : "bg-gray-200"
                )}
              />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
