"use client";

import { useState, useEffect, useCallback } from "react";
import { ProfileSection } from "@/components/settings/profile-section";
import { HoursSection } from "@/components/settings/hours-section";
import { NotificationsSection } from "@/components/settings/notifications-section";
import { BillingSection } from "@/components/settings/billing-section";
import { MOCK_SUBSCRIPTION_INFO } from "@/lib/constants/mock-settings";
import type { BusinessProfile, DayHours, NotificationPreferences } from "@/lib/types/settings";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"] as const;

const DEFAULT_PROFILE: BusinessProfile = {
  name: "",
  industry: "dental_practice",
  state: "TX",
  ownerName: "",
  phone: "",
  websiteUrl: "",
};

const DEFAULT_NOTIFICATIONS: NotificationPreferences = {
  smsOnHotLead: true,
  smsOnWarmLead: false,
  smsOnColdLead: false,
  dailyDigestEnabled: false,
  dailyDigestTime: "08:00",
  notificationEmail: "",
};

interface BusinessRow {
  business_name: string;
  industry: string;
  business_state: string;
  owner_name: string;
  phone_number: string;
  website_url: string | null;
  notification_preferences: NotificationPreferences | null;
}

interface HoursRow {
  day_of_week: number;
  is_closed: boolean;
  open_time: string | null;
  close_time: string | null;
}

function getBusinessId(): string | null {
  const match = document.cookie.match(/(?:^|;\s*)onboarding_business_id=([^;]*)/);
  return match ? decodeURIComponent(match[1]) : null;
}

function mapBusinessToProfile(biz: BusinessRow): BusinessProfile {
  return {
    name: biz.business_name,
    industry: biz.industry as BusinessProfile["industry"],
    state: biz.business_state as BusinessProfile["state"],
    ownerName: biz.owner_name,
    phone: biz.phone_number,
    websiteUrl: biz.website_url ?? "",
  };
}

function mapHoursRows(rows: HoursRow[]): DayHours[] {
  return DAYS.map((day, idx) => {
    const row = rows.find((r) => r.day_of_week === idx);
    if (!row || row.is_closed) {
      return { day, isClosed: true, timeSlots: [] };
    }
    return {
      day,
      isClosed: false,
      timeSlots: [
        { id: "1", start: row.open_time ?? "09:00", end: row.close_time ?? "17:00" },
      ],
    };
  });
}

export default function SettingsPage(): React.ReactElement {
  const [profile, setProfile] = useState<BusinessProfile>(DEFAULT_PROFILE);
  const [hours, setHours] = useState<DayHours[]>([]);
  const [greeting, setGreeting] = useState<string>(
    "Thanks for calling! We're currently closed. Please leave a message and we'll get back to you during business hours."
  );
  const [notifications, setNotifications] = useState<NotificationPreferences>(DEFAULT_NOTIFICATIONS);
  const [loading, setLoading] = useState(true);

  const fetchSettings = useCallback(async () => {
    const businessId = getBusinessId();
    if (!businessId) {
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`/api/dashboard/settings?businessId=${businessId}`);
      const json = await res.json();
      if (json.success && json.data) {
        const biz = json.data.business;
        if (biz) {
          setProfile(mapBusinessToProfile(biz));
          if (biz.notification_preferences && Object.keys(biz.notification_preferences).length > 0) {
            setNotifications(biz.notification_preferences);
          }
        }
        if (json.data.hours && json.data.hours.length > 0) {
          setHours(mapHoursRows(json.data.hours));
        } else {
          setHours(DAYS.map((day) => ({
            day,
            isClosed: day === "Sunday",
            timeSlots: day === "Sunday" ? [] : [{ id: "1", start: "09:00", end: "17:00" }],
          })));
        }
      }
    } catch (error) {
      console.error("Failed to fetch settings:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const handleSaveProfile = async (updated: BusinessProfile) => {
    setProfile(updated);
    const businessId = getBusinessId();
    if (!businessId) return;

    try {
      await fetch("/api/dashboard/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ businessId, section: "profile", ...updated }),
      });
    } catch (error) {
      console.error("Failed to save profile:", error);
    }
  };

  function handleSaveHours(updatedHours: DayHours[], updatedGreeting: string): void {
    setHours(updatedHours);
    setGreeting(updatedGreeting);

    const businessId = getBusinessId();
    if (!businessId) return;

    const hoursPayload = updatedHours.map((dh, idx) => ({
      dayOfWeek: idx,
      isClosed: dh.isClosed,
      openTime: dh.timeSlots[0]?.start ?? null,
      closeTime: dh.timeSlots[0]?.end ?? null,
    }));

    fetch("/api/dashboard/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ businessId, section: "hours", hours: hoursPayload }),
    }).catch((error) => {
      console.error("Failed to save hours:", error);
    });
  }

  const handleSaveNotifications = async (updated: NotificationPreferences) => {
    setNotifications(updated);
    const businessId = getBusinessId();
    if (!businessId) return;

    try {
      await fetch("/api/dashboard/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ businessId, section: "notifications", preferences: updated }),
      });
    } catch (error) {
      console.error("Failed to save notifications:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-navy-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-sm text-[#6b8baf]">
          Manage your business profile, hours, notifications, and billing
        </p>
      </div>

      <ProfileSection profile={profile} onSave={handleSaveProfile} />
      <HoursSection hours={hours} greeting={greeting} onSave={handleSaveHours} />
      <NotificationsSection preferences={notifications} onSave={handleSaveNotifications} />
      <BillingSection subscription={MOCK_SUBSCRIPTION_INFO} />
    </div>
  );
}
