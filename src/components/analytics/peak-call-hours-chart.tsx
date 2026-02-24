"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { HourlyDistribution } from "@/lib/types/analytics";

interface PeakCallHoursChartProps {
  data: HourlyDistribution[];
}

export function PeakCallHoursChart({ data }: PeakCallHoursChartProps): React.ReactElement {
  return (
    <div className="card-elevated p-6">
      <div className="mb-4">
        <h3 className="text-base font-semibold text-white">Peak Call Hours</h3>
        <p className="text-xs text-[#4a6585] mt-0.5">When your calls come in</p>
      </div>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data} layout="vertical" margin={{ top: 4, right: 4, bottom: 0, left: 8 }}>
          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#1e3050" />
          <XAxis type="number" tick={{ fontSize: 12, fill: "#4a6585" }} axisLine={false} tickLine={false} />
          <YAxis dataKey="label" type="category" tick={{ fontSize: 12, fill: "#4a6585" }} width={50} axisLine={false} tickLine={false} />
          <Tooltip
            contentStyle={{ backgroundColor: "#0d1726", border: "1px solid #1e3050", borderRadius: "8px", color: "#c8daf0" }}
          />
          <Bar dataKey="calls" fill="#7c3aed" name="Calls" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
