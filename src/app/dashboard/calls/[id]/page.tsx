"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { RecommendationCard } from "@/components/call-detail/recommendation-card";
import { PriceIntelligence } from "@/components/call-detail/price-intelligence";
import { ActionButtons } from "@/components/call-detail/action-buttons";
import { CallerInfoBar } from "@/components/call-detail/caller-info-bar";
import { QualificationSection } from "@/components/call-detail/qualification-section";
import { BudgetSignalsSection } from "@/components/call-detail/budget-signals-section";
import { TranscriptSection } from "@/components/call-detail/transcript-section";
import { FeedbackSection } from "@/components/call-detail/feedback-section";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { MOCK_CALL_DETAILS } from "@/lib/constants/mock-call-details";
import { MOCK_CALLS } from "@/lib/constants/mock-calls";
import type { CallDetail } from "@/lib/types/calls";

function buildCallDetail(callId: string): CallDetail | null {
  const detail = MOCK_CALL_DETAILS[callId];
  if (detail) return detail;

  const basic = MOCK_CALLS.find((c) => c.id === callId);
  if (!basic) return null;

  return {
    ...basic,
    price_stretch_ceiling: null,
    qualification_details: [
      {
        label: "Service Requested",
        value: basic.service_requested || "General Inquiry",
      },
    ],
    budget_signals: [],
    stretch_indicators: [],
    transcript: [],
  };
}

export default function CallDetailPage() {
  const params = useParams();
  const router = useRouter();
  const callId = params.id as string;
  const [isContacted, setIsContacted] = useState(false);

  const call = buildCallDetail(callId);

  if (!call) {
    return (
      <div className="text-center py-20">
        <h2 className="text-lg font-semibold text-navy-800 mb-2">
          Call not found
        </h2>
        <p className="text-sm text-navy-400 mb-4">
          This call may have been removed or the link is incorrect.
        </p>
        <button
          onClick={() => router.push("/dashboard/calls")}
          className="text-accent-500 hover:text-accent-600 text-sm font-medium"
        >
          Back to Calls
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <nav className="flex items-center gap-1.5 text-sm text-navy-400 mb-6">
        <Link
          href="/dashboard/calls"
          className="hover:text-navy-600 transition-colors"
        >
          Calls
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-navy-700 font-medium truncate">
          {call.caller_name ?? "Unknown Caller"} —{" "}
          {call.service_requested ?? "General Inquiry"}
        </span>
      </nav>

      <div className="space-y-5">
        <RecommendationCard call={call} />

        <PriceIntelligence
          priceLow={call.price_comfort_low}
          priceHigh={call.price_comfort_high}
          stretchCeiling={call.price_stretch_ceiling}
          confidence={call.confidence_level}
        />

        <ActionButtons
          phoneNumber={call.phone_number}
          callerName={call.caller_name}
          serviceRequested={call.service_requested}
          isContacted={isContacted}
          onMarkContacted={() => setIsContacted(true)}
        />

        <CallerInfoBar
          callerName={call.caller_name}
          phoneNumber={call.phone_number}
          createdAt={call.created_at}
          duration={call.duration}
        />
      </div>

      <div className="mt-8 border-t pt-6">
        <Accordion type="multiple" defaultValue={["qualification"]}>
          <AccordionItem value="qualification">
            <AccordionTrigger className="text-base font-semibold text-navy-900">
              Qualification Details
            </AccordionTrigger>
            <AccordionContent>
              <QualificationSection details={call.qualification_details} />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="budget">
            <AccordionTrigger className="text-base font-semibold text-navy-900">
              Budget Signals
            </AccordionTrigger>
            <AccordionContent>
              <BudgetSignalsSection
                budgetSignals={call.budget_signals}
                stretchIndicators={call.stretch_indicators}
              />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="transcript">
            <AccordionTrigger className="text-base font-semibold text-navy-900">
              Full Transcript
            </AccordionTrigger>
            <AccordionContent>
              <TranscriptSection transcript={call.transcript} />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="feedback">
            <AccordionTrigger className="text-base font-semibold text-navy-900">
              Owner Feedback
            </AccordionTrigger>
            <AccordionContent>
              <FeedbackSection />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
}
