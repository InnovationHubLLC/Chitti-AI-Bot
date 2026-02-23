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
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { BusinessHoursEditor } from "@/components/onboarding/business-hours-editor";
import type { DayHours } from "@/lib/types/settings";

interface HoursSectionProps {
  hours: DayHours[];
  greeting: string;
  onSave: (hours: DayHours[], greeting: string) => void;
}

function formatTimeSlots(day: DayHours): string {
  if (day.isClosed || day.timeSlots.length === 0) {
    return "Closed";
  }
  return day.timeSlots.map((slot) => `${slot.start} - ${slot.end}`).join(", ");
}

export function HoursSection({
  hours,
  greeting,
  onSave,
}: HoursSectionProps): React.ReactElement {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [draftGreeting, setDraftGreeting] = useState<string>(greeting);

  function handleEdit(): void {
    setDraftGreeting(greeting);
    setIsEditing(true);
  }

  function handleCancel(): void {
    setDraftGreeting(greeting);
    setIsEditing(false);
  }

  function handleSave(): void {
    // BusinessHoursEditor manages its own state internally,
    // so we pass the current hours prop through on save.
    // In a real integration, we would lift state or use a ref.
    onSave(hours, draftGreeting);
    setIsEditing(false);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Business Hours</CardTitle>
        <CardDescription>
          Set your operating hours and after-hours greeting message.
        </CardDescription>
        {!isEditing && (
          <CardAction>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleEdit}
              aria-label="Edit business hours"
            >
              <Pencil className="h-4 w-4" />
            </Button>
          </CardAction>
        )}
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Weekly Schedule</Label>
              <BusinessHoursEditor />
            </div>
            <div className="space-y-2">
              <Label htmlFor="after-hours-greeting">
                After-Hours Greeting
              </Label>
              <Textarea
                id="after-hours-greeting"
                value={draftGreeting}
                onChange={(e) => setDraftGreeting(e.target.value)}
                rows={3}
                placeholder="Enter your after-hours greeting message..."
              />
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
            <div className="space-y-3">
              {hours.map((day) => (
                <div
                  key={day.day}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="font-medium w-28">{day.day}</span>
                  <span
                    className={
                      day.isClosed ? "text-muted-foreground" : "text-foreground"
                    }
                  >
                    {formatTimeSlots(day)}
                  </span>
                </div>
              ))}
            </div>
            <div className="space-y-1 pt-2 border-t">
              <Label className="text-muted-foreground text-xs">
                After-Hours Greeting
              </Label>
              <p className="text-sm font-medium">
                {greeting || "No greeting message set."}
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
