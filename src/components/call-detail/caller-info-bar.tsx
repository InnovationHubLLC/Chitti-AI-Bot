"use client";

import { User, Phone, Calendar, Clock } from "lucide-react";

interface CallerInfoBarProps {
  callerName: string | null;
  phoneNumber: string;
  createdAt: string | null;
  duration: number | null;
}

function formatDateTime(dateString: string | null): string {
  if (!dateString) return "Unknown";

  const date = new Date(dateString);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const callDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

  const time = date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  if (callDate.getTime() === today.getTime()) {
    return `Today at ${time}`;
  } else if (callDate.getTime() === yesterday.getTime()) {
    return `Yesterday at ${time}`;
  } else {
    const month = date.toLocaleDateString("en-US", { month: "short" });
    const day = date.getDate();
    return `${month} ${day} at ${time}`;
  }
}

function formatDuration(seconds: number | null): string {
  if (seconds === null || seconds === 0) return "0:00";

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
}

export function CallerInfoBar({
  callerName,
  phoneNumber,
  createdAt,
  duration,
}: CallerInfoBarProps) {
  return (
    <div className="bg-white border rounded-xl p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-navy-50">
            <User className="w-5 h-5 text-navy-600" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-xs text-navy-400 font-medium">Name</span>
            <span className="text-sm font-semibold text-navy-900 truncate">
              {callerName || "Unknown Caller"}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-navy-50">
            <Phone className="w-5 h-5 text-navy-600" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-xs text-navy-400 font-medium">Phone</span>
            <span className="text-sm font-semibold text-navy-900 truncate">
              {phoneNumber}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-navy-50">
            <Calendar className="w-5 h-5 text-navy-600" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-xs text-navy-400 font-medium">Called</span>
            <span className="text-sm font-semibold text-navy-900 truncate">
              {formatDateTime(createdAt)}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-navy-50">
            <Clock className="w-5 h-5 text-navy-600" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-xs text-navy-400 font-medium">Duration</span>
            <span className="text-sm font-semibold text-navy-900 truncate">
              {formatDuration(duration)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
