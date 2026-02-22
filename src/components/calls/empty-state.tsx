"use client";

import Link from "next/link";
import { PhoneOff, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-16 h-16 rounded-full bg-navy-50 flex items-center justify-center mb-5">
        <PhoneOff className="w-8 h-8 text-navy-300" />
      </div>
      <h3 className="text-lg font-semibold text-navy-800 mb-2">
        No calls yet
      </h3>
      <p className="text-sm text-navy-400 max-w-sm mb-6">
        Once you set up call forwarding, your calls will appear here with full
        analysis and lead scoring.
      </p>
      <Button
        className="bg-accent-500 hover:bg-accent-600 text-white"
        asChild
      >
        <Link href="/onboarding/success">
          Set up call forwarding
          <ArrowRight className="w-4 h-4" />
        </Link>
      </Button>
    </div>
  );
}
