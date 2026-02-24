"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import type { DailyCallVolume } from "@/lib/types/analytics";

interface CallsPerDayChartProps {
  data: DailyCallVolume[];
}

export function CallsPerDayChart({ data }: CallsPerDayChartProps): React.ReactElement {
  if (data.length === 0) {
    return (
      <div className="card-elevated p-6">
        <h3 className="text-base font-semibold text-white mb-1">Calls Per Day</h3>
        <div className="flex h-64 items-center justify-center text-[#4a6585]">
          No call data available
        </div>
      </div>
    );
  }

  const formatted = data.map((d) => ({
    ...d,
    date: new Date(d.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
  }));

  return (
    <div className="card-elevated p-6">
      <div className="mb-4">
        <h3 className="text-base font-semibold text-white">Calls Per Day</h3>
        <p className="text-xs text-[#4a6585] mt-0.5">Daily call volume breakdown</p>
      </div>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={formatted} margin={{ top: 4, right: 4, bottom: 0, left: -16 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e3050" />
          <XAxis dataKey="date" tick={{ fontSize: 12, fill: "#4a6585" }} axisLine={false} tickLine={false} interval="preserveStartEnd" />
          <YAxis tick={{ fontSize: 12, fill: "#4a6585" }} axisLine={false} tickLine={false} />
          <Tooltip
            contentStyle={{ backgroundColor: "#0d1726", border: "1px solid #1e3050", borderRadius: "8px", color: "#c8daf0" }}
            labelStyle={{ color: "#8ba8c8" }}
          />
          <Legend wrapperStyle={{ color: "#6b8baf" }} />
          <Bar dataKey="answered" stackId="calls" fill="#7c3aed" name="Answered" radius={[0, 0, 0, 0]} />
          <Bar dataKey="missed" stackId="calls" fill="#ef4444" name="Missed" />
          <Bar dataKey="voicemail" stackId="calls" fill="#f59e0b" name="Voicemail" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
