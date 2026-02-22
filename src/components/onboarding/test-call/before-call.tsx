"use client";

import { Phone, Lightbulb } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface BeforeCallProps {
  phoneNumber: string;
  onSimulateCall: () => void;
}

const TIPS = [
  { text: "Ask about your pricing", example: "\"How much is a consultation?\"" },
  { text: "Ask about your hours", example: "\"Are you open Saturday?\"" },
  { text: "Try to book an appointment", example: "\"Can I come in Thursday?\"" },
  { text: "Ask something unexpected", example: "See how Chitti handles it" },
];

export function BeforeCall({ phoneNumber, onSimulateCall }: BeforeCallProps) {
  return (
    <div className="space-y-8">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent-100 mb-2">
          <Phone className="w-8 h-8 text-accent-600" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-navy-900">
          Let&apos;s hear your AI in action
        </h1>
        <p className="text-navy-500 max-w-md mx-auto">
          Call this number from your phone. You&apos;ll experience Chitti exactly
          as your customers will.
        </p>
      </div>

      <Card className="bg-gradient-to-br from-accent-50 to-accent-100 border-accent-200">
        <CardContent className="flex flex-col items-center py-8">
          <p className="text-sm font-medium text-accent-700 mb-3">
            Your Chitti number
          </p>
          <a
            href={`tel:${phoneNumber.replace(/[^+\d]/g, "")}`}
            className="text-3xl sm:text-4xl font-bold text-navy-900 tracking-tight hover:text-accent-600 transition-colors"
          >
            {phoneNumber}
          </a>
          <p className="text-xs text-accent-600 mt-3">
            Tap to call on mobile
          </p>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <div className="flex items-center gap-2 text-navy-700">
          <Lightbulb className="w-5 h-5 text-accent-500 shrink-0" />
          <p className="font-medium">What to try during your test call:</p>
        </div>
        <div className="grid gap-3">
          {TIPS.map((tip) => (
            <div
              key={tip.text}
              className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 border border-gray-100"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-accent-400 mt-2 shrink-0" />
              <div>
                <p className="text-sm font-medium text-navy-800">{tip.text}</p>
                <p className="text-xs text-navy-400 mt-0.5">{tip.example}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col items-center gap-3 pt-2">
        <div className="flex items-center gap-2">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-accent-500" />
          </span>
          <p className="text-sm text-navy-400">Waiting for your call...</p>
        </div>

        <Button
          variant="outline"
          onClick={onSimulateCall}
          className="text-sm"
        >
          Simulate a test call instead
        </Button>
      </div>
    </div>
  );
}
