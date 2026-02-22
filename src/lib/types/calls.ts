export interface TranscriptMessage {
  role: "ai" | "caller";
  content: string;
  timestamp: string;
}

export interface QualificationDetail {
  label: string;
  value: string;
}

export interface CallDetail {
  id: string;
  business_id: string | null;
  caller_name: string | null;
  phone_number: string;
  service_requested: string | null;
  duration: number | null;
  lead_score: string | null;
  deal_intent_score: number | null;
  confidence_level: string | null;
  price_comfort_low: number | null;
  price_comfort_high: number | null;
  price_stretch_ceiling: number | null;
  recommendation: string | null;
  status: string | null;
  is_read: boolean | null;
  created_at: string | null;
  qualification_details: QualificationDetail[];
  budget_signals: string[];
  stretch_indicators: string[];
  transcript: TranscriptMessage[];
}

export type Call = Omit<
  CallDetail,
  "qualification_details" | "budget_signals" | "stretch_indicators" | "transcript" | "price_stretch_ceiling"
> & {
  price_stretch_ceiling?: number | null;
  qualification_details?: QualificationDetail[];
  budget_signals?: string[];
  stretch_indicators?: string[];
  transcript?: TranscriptMessage[];
};

export type LeadScore = "HOT" | "WARM" | "COLD";
export type ConfidenceLevel = "HIGH" | "MEDIUM" | "LOW";
export type LeadStatus = "new" | "contacted" | "converted" | "lost";
export type DateRange = "today" | "week" | "month" | "all";
export type SortOption = "newest" | "highest_score";
export type LeadSortOption = "highest_score" | "newest" | "highest_value";
