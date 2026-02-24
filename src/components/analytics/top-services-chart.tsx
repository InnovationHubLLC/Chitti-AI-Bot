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
import type { ServiceBreakdown } from "@/lib/types/analytics";

interface TopServicesChartProps {
  data: ServiceBreakdown[];
}

export function TopServicesChart({ data }: TopServicesChartProps): React.ReactElement {
  return (
    <div className="card-elevated p-6">
      <div className="mb-4">
        <h3 className="text-base font-semibold text-white">Top Services Inquired</h3>
        <p className="text-xs text-[#4a6585] mt-0.5">Most requested services</p>
      </div>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data} layout="vertical" margin={{ top: 4, right: 4, bottom: 0, left: 8 }}>
          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#1e3050" />
          <XAxis type="number" tick={{ fontSize: 12, fill: "#4a6585" }} axisLine={false} tickLine={false} />
          <YAxis dataKey="service" type="category" tick={{ fontSize: 12, fill: "#4a6585" }} width={90} axisLine={false} tickLine={false} />
          <Tooltip
            contentStyle={{ backgroundColor: "#0d1726", border: "1px solid #1e3050", borderRadius: "8px", color: "#c8daf0" }}
            formatter={(value, _name, props) => [
              `${value} calls (${(props.payload as ServiceBreakdown).percentage}%)`,
              "Inquiries",
            ]}
          />
          <Bar dataKey="count" fill="#ff5a1f" name="Inquiries" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
