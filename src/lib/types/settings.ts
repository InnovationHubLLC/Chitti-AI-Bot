import type { IndustryValue } from '@/lib/constants/industries';
import type { USStateValue } from '@/lib/constants/us-states';

export interface TimeSlot {
  id: string;
  start: string;
  end: string;
}

export interface DayHours {
  day: string;
  isClosed: boolean;
  timeSlots: TimeSlot[];
}

export interface BusinessProfile {
  name: string;
  industry: IndustryValue;
  state: USStateValue;
  ownerName: string;
  phone: string;
  websiteUrl: string;
}

export interface NotificationPreferences {
  smsOnHotLead: boolean;
  smsOnWarmLead: boolean;
  smsOnColdLead: boolean;
  dailyDigestEnabled: boolean;
  dailyDigestTime: string;
  notificationEmail: string;
}

export type SubscriptionStatus = 'active' | 'trialing' | 'past_due' | 'canceled';

export interface SubscriptionInfo {
  plan: string;
  status: SubscriptionStatus;
  minutesUsed: number;
  minutesLimit: number;
  currentPeriodEnd: string;
  pricePerMonth: number;
}

export interface BusinessSettings {
  profile: BusinessProfile;
  hours: DayHours[];
  notifications: NotificationPreferences;
  subscription: SubscriptionInfo;
}
