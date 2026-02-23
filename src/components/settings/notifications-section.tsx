"use client";

import { useState } from "react";
import type React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardAction,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Pencil } from "lucide-react";
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
    <Card>
      <CardHeader>
        <CardTitle>Notifications</CardTitle>
        <CardDescription>
          Configure how and when you receive lead alerts and digests.
        </CardDescription>
        {!isEditing && (
          <CardAction>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleEdit}
              aria-label="Edit notification preferences"
            >
              <Pencil className="h-4 w-4" />
            </Button>
          </CardAction>
        )}
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {TOGGLE_FIELDS.map((field) => (
                <div
                  key={field.key}
                  className="flex items-center justify-between gap-2 rounded-md border p-3"
                >
                  <Label htmlFor={`notif-${field.key}`} className="text-sm">
                    {field.label}
                  </Label>
                  <Switch
                    id={`notif-${field.key}`}
                    checked={draft[field.key]}
                    onCheckedChange={(checked) =>
                      updateToggle(field.key, checked)
                    }
                  />
                </div>
              ))}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="notif-digest-time">Daily Digest Time</Label>
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
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="notif-email">Notification Email</Label>
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
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button onClick={handleSave}>Save</Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {TOGGLE_FIELDS.map((field) => (
                <div key={field.key} className="space-y-1">
                  <Label className="text-muted-foreground text-xs">
                    {field.label}
                  </Label>
                  <p
                    className={cn(
                      "text-sm font-medium",
                      preferences[field.key]
                        ? "text-green-600"
                        : "text-muted-foreground"
                    )}
                  >
                    {preferences[field.key] ? "Enabled" : "Disabled"}
                  </p>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t">
              <div className="space-y-1">
                <Label className="text-muted-foreground text-xs">
                  Daily Digest Time
                </Label>
                <p className="text-sm font-medium">
                  {preferences.dailyDigestTime}
                </p>
              </div>
              <div className="space-y-1">
                <Label className="text-muted-foreground text-xs">
                  Notification Email
                </Label>
                <p className="text-sm font-medium">
                  {preferences.notificationEmail}
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
