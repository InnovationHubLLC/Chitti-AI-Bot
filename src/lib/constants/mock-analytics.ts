import type {
  DailyCallVolume,
  LeadQualityBreakdown,
  HourlyDistribution,
  ServiceBreakdown,
  AnalyticsStats,
} from '@/lib/types/analytics';

const daysAgoDate = (d: number): string => {
  const date = new Date();
  date.setDate(date.getDate() - d);
  return date.toISOString().split('T')[0];
};

export const MOCK_DAILY_CALLS: DailyCallVolume[] = Array.from({ length: 30 }, (_, i) => {
  const dayOffset = 29 - i;
  return {
    date: daysAgoDate(dayOffset),
    answered: Math.floor(Math.random() * 8) + 4,
    missed: Math.floor(Math.random() * 3),
    voicemail: Math.floor(Math.random() * 2),
  };
});

export const MOCK_LEAD_QUALITY: LeadQualityBreakdown[] = [
  { label: 'Hot', value: 18, color: '#ef4444' },
  { label: 'Warm', value: 34, color: '#f59e0b' },
  { label: 'Cold', value: 12, color: '#3b82f6' },
];

export const MOCK_HOURLY_DISTRIBUTION: HourlyDistribution[] = [
  { hour: 8, label: '8 AM', calls: 5 },
  { hour: 9, label: '9 AM', calls: 12 },
  { hour: 10, label: '10 AM', calls: 18 },
  { hour: 11, label: '11 AM', calls: 15 },
  { hour: 12, label: '12 PM', calls: 8 },
  { hour: 13, label: '1 PM', calls: 10 },
  { hour: 14, label: '2 PM', calls: 14 },
  { hour: 15, label: '3 PM', calls: 16 },
  { hour: 16, label: '4 PM', calls: 11 },
  { hour: 17, label: '5 PM', calls: 6 },
  { hour: 18, label: '6 PM', calls: 3 },
  { hour: 19, label: '7 PM', calls: 1 },
];

export const MOCK_TOP_SERVICES: ServiceBreakdown[] = [
  { service: 'AC Repair', count: 28, percentage: 32 },
  { service: 'Pest Inspection', count: 18, percentage: 21 },
  { service: 'Roof Repair', count: 14, percentage: 16 },
  { service: 'Plumbing', count: 12, percentage: 14 },
  { service: 'Electrical', count: 8, percentage: 9 },
];

export const MOCK_ANALYTICS_STATS: AnalyticsStats = {
  total_calls: 247,
  total_calls_trend: 12.5,
  leads_generated: 64,
  leads_generated_trend: 8.3,
  avg_score: 7.2,
  avg_score_trend: -2.1,
  conversion_rate: 34.5,
  conversion_rate_trend: 5.7,
};
