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
import type { HourlyDistribution } from "@/lib/types/analytics";

interface PeakCallHoursChartProps {
  data: HourlyDistribution[];
}

export function PeakCallHoursChart({ data }: PeakCallHoursChartProps): React.ReactElement {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Peak Call Hours</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={data} layout="vertical" margin={{ top: 4, right: 4, bottom: 0, left: 8 }}>
            <CartesianGrid strokeDasharray="3 3" horizontal={false} />
            <XAxis type="number" tick={{ fontSize: 12 }} />
            <YAxis dataKey="label" type="category" tick={{ fontSize: 12 }} width={50} />
            <Tooltip />
            <Bar dataKey="calls" fill="#486581" name="Calls" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
