export type TimePeriod = '7d' | '30d' | '90d' | 'custom';

export interface DailyCallVolume {
  date: string;
  answered: number;
  missed: number;
  voicemail: number;
}

export interface LeadQualityBreakdown {
  label: string;
  value: number;
  color: string;
}

export interface HourlyDistribution {
  hour: number;
  label: string;
  calls: number;
}

export interface ServiceBreakdown {
  service: string;
  count: number;
  percentage: number;
}

export interface AnalyticsStats {
  total_calls: number;
  total_calls_trend: number;
  leads_generated: number;
  leads_generated_trend: number;
  avg_score: number;
  avg_score_trend: number;
  conversion_rate: number;
  conversion_rate_trend: number;
}
