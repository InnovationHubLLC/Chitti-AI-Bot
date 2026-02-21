"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";

interface TimeSlot {
  id: string;
  start: string;
  end: string;
}

interface DayHours {
  day: string;
  isClosed: boolean;
  timeSlots: TimeSlot[];
}

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const defaultHours: DayHours[] = DAYS.map((day) => ({
  day,
  isClosed: day === "Sunday",
  timeSlots: day === "Sunday" ? [] : [{ id: "1", start: "09:00", end: "17:00" }],
}));

export function BusinessHoursEditor() {
  const [hours, setHours] = useState<DayHours[]>(defaultHours);

  const toggleDay = (dayIndex: number) => {
    const newHours = [...hours];
    newHours[dayIndex].isClosed = !newHours[dayIndex].isClosed;
    if (!newHours[dayIndex].isClosed && newHours[dayIndex].timeSlots.length === 0) {
      newHours[dayIndex].timeSlots = [{ id: Date.now().toString(), start: "09:00", end: "17:00" }];
    }
    setHours(newHours);
  };

  const addTimeSlot = (dayIndex: number) => {
    const newHours = [...hours];
    newHours[dayIndex].timeSlots.push({
      id: Date.now().toString(),
      start: "09:00",
      end: "17:00",
    });
    setHours(newHours);
  };

  const removeTimeSlot = (dayIndex: number, slotId: string) => {
    const newHours = [...hours];
    newHours[dayIndex].timeSlots = newHours[dayIndex].timeSlots.filter(
      (slot) => slot.id !== slotId
    );
    setHours(newHours);
  };

  const updateTimeSlot = (
    dayIndex: number,
    slotId: string,
    field: "start" | "end",
    value: string
  ) => {
    const newHours = [...hours];
    const slot = newHours[dayIndex].timeSlots.find((s) => s.id === slotId);
    if (slot) {
      slot[field] = value;
      setHours(newHours);
    }
  };

  return (
    <div className="space-y-3">
      {hours.map((dayHours, dayIndex) => (
        <Card key={dayHours.day}>
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="flex items-center gap-3 min-w-[140px]">
                <input
                  type="checkbox"
                  checked={!dayHours.isClosed}
                  onChange={() => toggleDay(dayIndex)}
                  className="w-4 h-4 rounded border-gray-300"
                />
                <span className="font-medium">{dayHours.day}</span>
              </div>

              <div className="flex-1">
                {dayHours.isClosed ? (
                  <span className="text-gray-500 text-sm">Closed</span>
                ) : (
                  <div className="space-y-2">
                    {dayHours.timeSlots.map((slot) => (
                      <div key={slot.id} className="flex items-center gap-2">
                        <Input
                          type="time"
                          value={slot.start}
                          onChange={(e) =>
                            updateTimeSlot(dayIndex, slot.id, "start", e.target.value)
                          }
                          className="w-32"
                        />
                        <span className="text-gray-500">to</span>
                        <Input
                          type="time"
                          value={slot.end}
                          onChange={(e) =>
                            updateTimeSlot(dayIndex, slot.id, "end", e.target.value)
                          }
                          className="w-32"
                        />
                        {dayHours.timeSlots.length > 1 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeTimeSlot(dayIndex, slot.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => addTimeSlot(dayIndex)}
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Add hours
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
