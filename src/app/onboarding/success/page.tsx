"use client";

import { useState } from "react";
import Link from "next/link";
import {
  CheckCircle,
  Phone,
  Smartphone,
  ArrowRight,
  Copy,
  Check,
  MessageCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const FORWARDING_INSTRUCTIONS = [
  {
    carrier: "AT&T",
    steps: [
      "Open your Phone app",
      "Dial *61*15551234567# and press Call",
      "Wait for the confirmation tone",
    ],
  },
  {
    carrier: "Verizon",
    steps: [
      "Open your Phone app",
      "Dial *71 followed by 15551234567",
      "Press Call and wait for the confirmation beep",
    ],
  },
  {
    carrier: "T-Mobile",
    steps: [
      "Open your Phone app",
      "Dial **61*15551234567# and press Call",
      "You'll hear a confirmation message",
    ],
  },
  {
    carrier: "Other / Generic",
    steps: [
      "Go to Settings > Phone > Call Forwarding",
      "Enable Call Forwarding",
      "Enter the number: +1 (555) 123-4567",
    ],
  },
];

export default function OnboardingSuccessPage() {
  const [copiedNumber, setCopiedNumber] = useState(false);
  const [selectedCarrier, setSelectedCarrier] = useState<string | null>(null);

  const handleCopyNumber = () => {
    navigator.clipboard.writeText("+15551234567");
    setCopiedNumber(true);
    setTimeout(() => setCopiedNumber(false), 2000);
  };

  return (
    <div className="max-w-[640px] mx-auto space-y-8">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-100 mb-2">
          <CheckCircle className="w-10 h-10 text-emerald-600" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-navy-900">
          Chitti is ready!
        </h1>
        <p className="text-navy-500 max-w-md mx-auto">
          One last step: forward your calls to Chitti so it can start answering
          for your business.
        </p>
      </div>

      <Card className="bg-gradient-to-br from-navy-50 to-white border-navy-200">
        <CardContent className="flex items-center justify-between py-5">
          <div className="flex items-center gap-3">
            <Phone className="w-5 h-5 text-accent-500" />
            <div>
              <p className="text-xs text-navy-400">Your Chitti number</p>
              <p className="text-lg font-bold text-navy-900">
                +1 (555) 123-4567
              </p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={handleCopyNumber}>
            {copiedNumber ? (
              <Check className="w-4 h-4 text-emerald-500" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
            {copiedNumber ? "Copied" : "Copy"}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-accent-500" />
            Set up call forwarding
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-navy-500 mb-4">
            Select your carrier for step-by-step instructions:
          </p>

          <div className="grid grid-cols-2 gap-2">
            {FORWARDING_INSTRUCTIONS.map((carrier) => (
              <button
                key={carrier.carrier}
                onClick={() =>
                  setSelectedCarrier(
                    selectedCarrier === carrier.carrier
                      ? null
                      : carrier.carrier
                  )
                }
                className={`p-3 rounded-lg border text-sm font-medium text-left transition-colors ${
                  selectedCarrier === carrier.carrier
                    ? "border-accent-500 bg-accent-50 text-accent-700"
                    : "border-gray-200 text-navy-700 hover:border-navy-300"
                }`}
              >
                {carrier.carrier}
              </button>
            ))}
          </div>

          {selectedCarrier && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-100 space-y-3">
              <p className="text-sm font-medium text-navy-800">
                {selectedCarrier} instructions:
              </p>
              <ol className="space-y-2">
                {FORWARDING_INSTRUCTIONS.find(
                  (c) => c.carrier === selectedCarrier
                )?.steps.map((step, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-3 text-sm text-navy-600"
                  >
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-accent-100 text-accent-700 text-xs font-medium flex items-center justify-center mt-0.5">
                      {i + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="bg-navy-50 border-navy-200">
        <CardContent className="flex items-start gap-3 py-5">
          <MessageCircle className="w-5 h-5 text-accent-500 mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-medium text-navy-800">
              Need help setting this up?
            </p>
            <p className="text-sm text-navy-500 mt-1">
              Reply to the confirmation text we sent you and our team will walk
              you through it personally.
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-center pt-2 pb-8">
        <Button
          size="lg"
          className="bg-accent-500 hover:bg-accent-600 text-white px-8"
          asChild
        >
          <Link href="/">
            Go to Dashboard
            <ArrowRight className="w-4 h-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
