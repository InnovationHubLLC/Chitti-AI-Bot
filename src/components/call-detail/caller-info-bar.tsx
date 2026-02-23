"use client";

import { User, Phone, Calendar, Clock } from "lucide-react";
import { formatDateTime, formatDuration } from "@/components/shared/time-ago";

interface CallerInfoBarProps {
  callerName: string | null;
  phoneNumber: string;
  createdAt: string | null;
  duration: number | null;
}

const INFO_ITEMS = [
  { key: "name", label: "Name", icon: User },
  { key: "phone", label: "Phone", icon: Phone },
  { key: "called", label: "Called", icon: Calendar },
  { key: "duration", label: "Duration", icon: Clock },
] as const;

export function CallerInfoBar({
  callerName,
  phoneNumber,
  createdAt,
  duration,
}: CallerInfoBarProps): React.ReactElement {
  const values: Record<string, string> = {
    name: callerName || "Unknown Caller",
    phone: phoneNumber,
    called: formatDateTime(createdAt),
    duration: formatDuration(duration),
  };

  return (
    <div className="bg-white border rounded-xl p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {INFO_ITEMS.map(({ key, label, icon: Icon }) => (
          <div key={key} className="flex items-center gap-3">
            <div className="flex items-center justify-center size-10 rounded-full bg-navy-50">
              <Icon className="size-5 text-navy-600" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs text-navy-400 font-medium">{label}</span>
              <span className="text-sm font-semibold text-navy-900 truncate">
                {values[key]}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
