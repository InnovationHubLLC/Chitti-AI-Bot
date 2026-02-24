"use client";

import Link from "next/link";
import { Phone, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="relative mb-6">
        <div className="absolute inset-0 rounded-2xl bg-violet-500/10 blur-2xl scale-150" />
        <div className="absolute inset-0 rounded-2xl bg-accent-500/5 blur-xl scale-125" />
        <div className="relative w-16 h-16 rounded-2xl bg-[#0d1726] border border-[#1e3050] flex items-center justify-center shadow-[0_0_24px_rgba(124,58,237,0.2),0_0_48px_rgba(124,58,237,0.1)]">
          <Phone className="w-7 h-7 text-violet-400" />
        </div>
      </div>
      <h3 className="text-lg font-semibold text-white mb-2">
        Chitti is ready to answer
      </h3>
      <p className="text-sm text-[#6b8baf] max-w-sm mb-6">
        Set up call forwarding and your calls will appear here with full
        analysis, lead scoring, and AI-powered insights.
      </p>
      <Button
        className="bg-accent-500 hover:bg-accent-600 text-white glow-cta"
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
