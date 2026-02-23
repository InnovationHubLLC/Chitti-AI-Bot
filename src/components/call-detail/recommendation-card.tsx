"use client";

import type { CallDetail } from "@/lib/types/calls";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ScoreBadge, LEAD_SCORE_COLORS } from "@/components/shared/score-badge";
import { ConfidenceBadge } from "@/components/shared/confidence-badge";
import { DealScoreDisplay } from "@/components/shared/deal-score-display";

interface RecommendationCardProps {
  call: CallDetail;
}

export function RecommendationCard({ call }: RecommendationCardProps): React.ReactElement {
  const normalized = (call.lead_score ?? "WARM").toUpperCase();
  const colors = LEAD_SCORE_COLORS[normalized] ?? LEAD_SCORE_COLORS.WARM;

  return (
    <Card className={cn("border-l-4", colors.leftBorder, "shadow-lg")}>
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2">
          <ScoreBadge score={call.lead_score} />
          <ConfidenceBadge level={call.confidence_level} />
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {call.recommendation && (
          <p className="text-base sm:text-lg leading-relaxed text-navy-700">
            {call.recommendation}
          </p>
        )}
        <DealScoreDisplay score={call.deal_intent_score ?? 0} variant="dots" />
      </CardContent>
    </Card>
  );
}
