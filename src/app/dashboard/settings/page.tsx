"use client";

import { useState } from "react";
import { ProfileSection } from "@/components/settings/profile-section";
import { HoursSection } from "@/components/settings/hours-section";
import { NotificationsSection } from "@/components/settings/notifications-section";
import { BillingSection } from "@/components/settings/billing-section";
import {
  MOCK_BUSINESS_PROFILE,
  MOCK_BUSINESS_HOURS,
  MOCK_NOTIFICATION_PREFERENCES,
  MOCK_SUBSCRIPTION_INFO,
} from "@/lib/constants/mock-settings";
import type { BusinessProfile, DayHours, NotificationPreferences } from "@/lib/types/settings";

export default function SettingsPage(): React.ReactElement {
  const [profile, setProfile] = useState<BusinessProfile>(MOCK_BUSINESS_PROFILE);
  const [hours, setHours] = useState<DayHours[]>(MOCK_BUSINESS_HOURS);
  const [greeting, setGreeting] = useState<string>(
    "Thanks for calling! We're currently closed. Please leave a message and we'll get back to you during business hours."
  );
  const [notifications, setNotifications] = useState<NotificationPreferences>(
    MOCK_NOTIFICATION_PREFERENCES
  );

  function handleSaveHours(updatedHours: DayHours[], updatedGreeting: string): void {
    setHours(updatedHours);
    setGreeting(updatedGreeting);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-navy-900">Settings</h1>
        <p className="text-sm text-gray-500">
          Manage your business profile, hours, notifications, and billing
        </p>
      </div>

      <ProfileSection profile={profile} onSave={setProfile} />
      <HoursSection hours={hours} greeting={greeting} onSave={handleSaveHours} />
      <NotificationsSection preferences={notifications} onSave={setNotifications} />
      <BillingSection subscription={MOCK_SUBSCRIPTION_INFO} />
    </div>
  );
}
