"use client";

import {
  CheckCircle,
  Flame,
  ThermometerSun,
  Snowflake,
  Target,
  Shield,
  DollarSign,
  Zap,
  Wrench,
  ArrowRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export interface CallAnalysisData {
  leadScore: "hot" | "warm" | "cold";
  dealIntentScore: number;
  confidenceLevel: "high" | "medium" | "low";
  priceComfortLow: number;
  priceComfortHigh: number;
  recommendedAction: string;
  serviceRequested: string;
  callSummary: string;
}

interface CallCompleteProps {
  analysis: CallAnalysisData;
  onFinishSetup: () => void;
  onAnotherCall: () => void;
}

const LEAD_SCORE_CONFIG = {
  hot: {
    label: "HOT",
    icon: Flame,
    className: "bg-red-100 text-red-700 border-red-200",
  },
  warm: {
    label: "WARM",
    icon: ThermometerSun,
    className: "bg-amber-100 text-amber-700 border-amber-200",
  },
  cold: {
    label: "COLD",
    icon: Snowflake,
    className: "bg-sky-100 text-sky-700 border-sky-200",
  },
};

const CONFIDENCE_CONFIG = {
  high: { className: "bg-emerald-100 text-emerald-700 border-emerald-200" },
  medium: { className: "bg-amber-100 text-amber-700 border-amber-200" },
  low: { className: "bg-gray-100 text-gray-600 border-gray-200" },
};

export function CallComplete({
  analysis,
  onFinishSetup,
  onAnotherCall,
}: CallCompleteProps) {
  const leadConfig = LEAD_SCORE_CONFIG[analysis.leadScore];
  const LeadIcon = leadConfig.icon;
  const confidenceConfig = CONFIDENCE_CONFIG[analysis.confidenceLevel];

  return (
    <div className="space-y-8">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 mb-2">
          <CheckCircle className="w-8 h-8 text-emerald-600" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-navy-900">
          Here&apos;s what Chitti learned from that call
        </h1>
        <p className="text-navy-500">
          {analysis.callSummary}
        </p>
      </div>

      <Card className="border-navy-100 overflow-hidden">
        <CardHeader className="bg-navy-50 border-b border-navy-100">
          <CardTitle className="text-lg flex items-center gap-2">
            <Target className="w-5 h-5 text-accent-500" />
            Call Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-2 gap-6">
            <AnalysisItem
              icon={<LeadIcon className="w-4 h-4" />}
              label="Lead Score"
            >
              <Badge className={`${leadConfig.className} text-sm px-3 py-1`}>
                {leadConfig.label}
              </Badge>
            </AnalysisItem>

            <AnalysisItem
              icon={<Target className="w-4 h-4 text-navy-400" />}
              label="Deal Intent"
            >
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-navy-900">
                  {analysis.dealIntentScore}
                </span>
                <span className="text-sm text-navy-400">/10</span>
              </div>
            </AnalysisItem>

            <AnalysisItem
              icon={<Shield className="w-4 h-4 text-navy-400" />}
              label="Confidence"
            >
              <Badge className={`${confidenceConfig.className} text-sm px-3 py-1`}>
                {analysis.confidenceLevel.toUpperCase()}
              </Badge>
            </AnalysisItem>

            <AnalysisItem
              icon={<DollarSign className="w-4 h-4 text-navy-400" />}
              label="Price Comfort"
            >
              <span className="text-sm font-semibold text-navy-800">
                ${analysis.priceComfortLow.toLocaleString()} &ndash; $
                {analysis.priceComfortHigh.toLocaleString()}
              </span>
            </AnalysisItem>
          </div>

          <div className="mt-6 pt-6 border-t border-navy-100 space-y-4">
            <div className="flex items-start gap-3">
              <Wrench className="w-4 h-4 text-accent-500 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-medium text-navy-400 uppercase tracking-wide">
                  Service Requested
                </p>
                <p className="text-sm font-medium text-navy-800 mt-0.5">
                  {analysis.serviceRequested}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Zap className="w-4 h-4 text-accent-500 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-medium text-navy-400 uppercase tracking-wide">
                  Recommended Action
                </p>
                <p className="text-sm font-medium text-navy-800 mt-0.5">
                  {analysis.recommendedAction}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <p className="text-center text-sm text-navy-400">
        This is what you&apos;ll see for every call, plus an SMS notification
        for hot leads.
      </p>

      <div className="flex flex-col items-center gap-3">
        <Button
          size="lg"
          onClick={onFinishSetup}
          className="bg-accent-500 hover:bg-accent-600 text-white w-full sm:w-auto px-8"
        >
          Finish Setup
          <ArrowRight className="w-4 h-4" />
        </Button>
        <button
          onClick={onAnotherCall}
          className="text-sm text-navy-400 hover:text-accent-500 transition-colors"
        >
          Make Another Test Call
        </button>
      </div>
    </div>
  );
}

function AnalysisItem({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-1.5">
        {icon}
        <p className="text-xs font-medium text-navy-400 uppercase tracking-wide">
          {label}
        </p>
      </div>
      {children}
    </div>
  );
}
