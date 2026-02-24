"use client";

import { useState } from "react";
import type React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Pencil, Bell } from "lucide-react";
import { cn } from "@/lib/utils";
import type { NotificationPreferences } from "@/lib/types/settings";

interface NotificationsSectionProps {
  preferences: NotificationPreferences;
  onSave: (preferences: NotificationPreferences) => void;
}

interface ToggleFieldConfig {
  key: keyof Pick<
    NotificationPreferences,
    "smsOnHotLead" | "smsOnWarmLead" | "smsOnColdLead" | "dailyDigestEnabled"
  >;
  label: string;
}

const TOGGLE_FIELDS: ToggleFieldConfig[] = [
  { key: "smsOnHotLead", label: "SMS on Hot Lead" },
  { key: "smsOnWarmLead", label: "SMS on Warm Lead" },
  { key: "smsOnColdLead", label: "SMS on Cold Lead" },
  { key: "dailyDigestEnabled", label: "Daily Digest Email" },
];

export function NotificationsSection({
  preferences,
  onSave,
}: NotificationsSectionProps): React.ReactElement {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [draft, setDraft] = useState<NotificationPreferences>(preferences);

  function handleEdit(): void {
    setDraft(preferences);
    setIsEditing(true);
  }

  function handleCancel(): void {
    setDraft(preferences);
    setIsEditing(false);
  }

  function handleSave(): void {
    onSave(draft);
    setIsEditing(false);
  }

  function updateToggle(
    field: ToggleFieldConfig["key"],
    value: boolean
  ): void {
    setDraft((prev) => ({ ...prev, [field]: value }));
  }

  return (
    <div className="card-elevated">
      <div className="flex items-center justify-between p-5 border-b border-[#1e3050]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-violet-500/15 flex items-center justify-center shadow-[0_0_12px_rgba(124,58,237,0.2)]">
            <Bell className="size-5 text-violet-400" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-white">Notifications</h3>
            <p className="text-xs text-[#6b8baf]">Configure how and when you receive lead alerts and digests.</p>
          </div>
        </div>
        {!isEditing && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleEdit}
            aria-label="Edit notification preferences"
            className="text-[#6b8baf] hover:text-white hover:bg-[#111f33]"
          >
            <Pencil className="h-4 w-4" />
          </Button>
        )}
      </div>
      <div className="p-5">
        {isEditing ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {TOGGLE_FIELDS.map((field) => (
                <div
                  key={field.key}
                  className="flex items-center justify-between gap-2 rounded-md border border-[#1e3050] bg-[#0d1726] p-3"
                >
                  <Label htmlFor={`notif-${field.key}`} className="text-sm text-[#c8daf0]">
                    {field.label}
                  </Label>
                  <Switch
                    id={`notif-${field.key}`}
                    checked={draft[field.key]}
                    onCheckedChange={(checked) =>
                      updateToggle(field.key, checked)
                    }
                    className="data-[state=checked]:bg-accent-500"
                  />
                </div>
              ))}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="notif-digest-time" className="text-xs uppercase tracking-wider text-[#6b8baf]">Daily Digest Time</Label>
                <Input
                  id="notif-digest-time"
                  type="time"
                  value={draft.dailyDigestTime}
                  onChange={(e) =>
                    setDraft((prev) => ({
                      ...prev,
                      dailyDigestTime: e.target.value,
                    }))
                  }
                  className="bg-[#080f1a] border-[#1e3050] text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="notif-email" className="text-xs uppercase tracking-wider text-[#6b8baf]">Notification Email</Label>
                <Input
                  id="notif-email"
                  type="email"
                  value={draft.notificationEmail}
                  onChange={(e) =>
                    setDraft((prev) => ({
                      ...prev,
                      notificationEmail: e.target.value,
                    }))
                  }
                  className="bg-[#080f1a] border-[#1e3050] text-white"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={handleCancel} className="border-[#1e3050] text-[#8ba8c8] hover:bg-[#111f33]">
                Cancel
              </Button>
              <Button onClick={handleSave} className="bg-accent-500 hover:bg-accent-600 text-white glow-cta">Save</Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {TOGGLE_FIELDS.map((field) => (
                <div key={field.key} className="space-y-1">
                  <Label className="text-xs uppercase tracking-wider text-[#6b8baf]">
                    {field.label}
                  </Label>
                  <p
                    className={cn(
                      "text-sm font-medium",
                      preferences[field.key]
                        ? "text-emerald-400"
                        : "text-[#4a6585]"
                    )}
                  >
                    {preferences[field.key] ? "Enabled" : "Disabled"}
                  </p>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-[#1e3050]">
              <div className="space-y-1">
                <Label className="text-xs uppercase tracking-wider text-[#6b8baf]">
                  Daily Digest Time
                </Label>
                <p className="text-sm font-medium text-[#c8daf0]">
                  {preferences.dailyDigestTime}
                </p>
              </div>
              <div className="space-y-1">
                <Label className="text-xs uppercase tracking-wider text-[#6b8baf]">
                  Notification Email
                </Label>
                <p className="text-sm font-medium text-[#c8daf0]">
                  {preferences.notificationEmail}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
