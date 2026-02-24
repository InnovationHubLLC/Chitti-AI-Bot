"use client";

import { useState } from "react";
import type React from "react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Pencil, Clock } from "lucide-react";
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
    onSave(hours, draftGreeting);
    setIsEditing(false);
  }

  return (
    <div className="card-elevated">
      <div className="flex items-center justify-between p-5 border-b border-[#1e3050]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-violet-500/15 flex items-center justify-center shadow-[0_0_12px_rgba(124,58,237,0.2)]">
            <Clock className="size-5 text-violet-400" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-white">Business Hours</h3>
            <p className="text-xs text-[#6b8baf]">Set your operating hours and after-hours greeting message.</p>
          </div>
        </div>
        {!isEditing && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleEdit}
            aria-label="Edit business hours"
            className="text-[#6b8baf] hover:text-white hover:bg-[#111f33]"
          >
            <Pencil className="h-4 w-4" />
          </Button>
        )}
      </div>
      <div className="p-5">
        {isEditing ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-wider text-[#6b8baf]">Weekly Schedule</Label>
              <BusinessHoursEditor />
            </div>
            <div className="space-y-2">
              <Label htmlFor="after-hours-greeting" className="text-xs uppercase tracking-wider text-[#6b8baf]">
                After-Hours Greeting
              </Label>
              <Textarea
                id="after-hours-greeting"
                value={draftGreeting}
                onChange={(e) => setDraftGreeting(e.target.value)}
                rows={3}
                placeholder="Enter your after-hours greeting message..."
                className="bg-[#080f1a] border-[#1e3050] text-white placeholder:text-[#4a6585]"
              />
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
            <div className="space-y-3">
              {hours.map((day) => (
                <div
                  key={day.day}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="font-medium w-28 text-[#c8daf0]">{day.day}</span>
                  <span className={day.isClosed ? "text-[#4a6585]" : "text-[#8ba8c8]"}>
                    {formatTimeSlots(day)}
                  </span>
                </div>
              ))}
            </div>
            <div className="space-y-1 pt-2 border-t border-[#1e3050]">
              <Label className="text-xs uppercase tracking-wider text-[#6b8baf]">
                After-Hours Greeting
              </Label>
              <p className="text-sm font-medium text-[#c8daf0]">
                {greeting || "No greeting message set."}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
