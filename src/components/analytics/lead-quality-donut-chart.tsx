"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import type { LeadQualityBreakdown } from "@/lib/types/analytics";

interface LeadQualityDonutChartProps {
  data: LeadQualityBreakdown[];
}

export function LeadQualityDonutChart({ data }: LeadQualityDonutChartProps): React.ReactElement {
  const total = data.reduce((sum, d) => sum + d.value, 0);

  return (
    <div className="card-elevated p-6">
      <div className="mb-4">
        <h3 className="text-base font-semibold text-white">Lead Quality</h3>
        <p className="text-xs text-[#4a6585] mt-0.5">Distribution by lead score</p>
      </div>
      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={65}
            outerRadius={100}
            paddingAngle={3}
            dataKey="value"
            nameKey="label"
          >
            {data.map((entry) => (
              <Cell key={entry.label} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{ backgroundColor: "#0d1726", border: "1px solid #1e3050", borderRadius: "8px", color: "#c8daf0" }}
            formatter={(value) => {
              const num = Number(value);
              return [
                `${num} (${Math.round((num / total) * 100)}%)`,
                "Leads",
              ];
            }}
          />
          <Legend wrapperStyle={{ color: "#6b8baf" }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
