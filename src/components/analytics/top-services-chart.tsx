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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ServiceBreakdown } from "@/lib/types/analytics";

interface TopServicesChartProps {
  data: ServiceBreakdown[];
}

export function TopServicesChart({ data }: TopServicesChartProps): React.ReactElement {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Top Services Inquired</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={data} layout="vertical" margin={{ top: 4, right: 4, bottom: 0, left: 8 }}>
            <CartesianGrid strokeDasharray="3 3" horizontal={false} />
            <XAxis type="number" tick={{ fontSize: 12 }} />
            <YAxis dataKey="service" type="category" tick={{ fontSize: 12 }} width={90} />
            <Tooltip
              formatter={(value, _name, props) => [
                `${value} calls (${(props.payload as ServiceBreakdown).percentage}%)`,
                "Inquiries",
              ]}
            />
            <Bar dataKey="count" fill="#ff5a1f" name="Inquiries" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
