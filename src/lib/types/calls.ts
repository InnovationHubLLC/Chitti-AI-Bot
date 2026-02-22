export interface Call {
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
  recommendation: string | null;
  status: string | null;
  is_read: boolean | null;
  created_at: string | null;
}

export type LeadScore = "HOT" | "WARM" | "COLD";
export type ConfidenceLevel = "HIGH" | "MEDIUM" | "LOW";
export type DateRange = "today" | "week" | "month" | "all";
export type SortOption = "newest" | "highest_score";
