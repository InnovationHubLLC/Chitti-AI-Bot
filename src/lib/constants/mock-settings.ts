import type {
  BusinessProfile,
  NotificationPreferences,
  SubscriptionInfo,
  DayHours,
} from '@/lib/types/settings';

const DAYS = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
] as const;

export const MOCK_BUSINESS_HOURS: DayHours[] = DAYS.map((day) => ({
  day,
  isClosed: day === 'Sunday',
  timeSlots:
    day === 'Sunday' ? [] : [{ id: '1', start: '09:00', end: '17:00' }],
}));

export const MOCK_BUSINESS_PROFILE: BusinessProfile = {
  name: 'Bright Smiles Dental',
  industry: 'dental_practice',
  state: 'TX',
  ownerName: 'Dr. Sarah Chen',
  phone: '(512) 555-0123',
  websiteUrl: 'https://brightsmilesdental.com',
};

export const MOCK_NOTIFICATION_PREFERENCES: NotificationPreferences = {
  smsOnHotLead: true,
  smsOnWarmLead: true,
  smsOnColdLead: false,
  dailyDigestEnabled: true,
  dailyDigestTime: '08:00',
  notificationEmail: 'sarah@brightsmilesdental.com',
};

export const MOCK_SUBSCRIPTION_INFO: SubscriptionInfo = {
  plan: 'Chitti Pro',
  status: 'active',
  minutesUsed: 187,
  minutesLimit: 300,
  currentPeriodEnd: '2026-03-15T00:00:00Z',
  pricePerMonth: 149,
};
