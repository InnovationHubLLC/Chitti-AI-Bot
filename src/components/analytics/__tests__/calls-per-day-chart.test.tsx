import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { CallsPerDayChart } from "../calls-per-day-chart";
import type { DailyCallVolume } from "@/lib/types/analytics";

// Mock recharts to avoid canvas rendering issues in jsdom
vi.mock("recharts", () => ({
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="responsive-container">{children}</div>
  ),
  BarChart: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="bar-chart">{children}</div>
  ),
  Bar: () => <div data-testid="bar" />,
  XAxis: () => <div />,
  YAxis: () => <div />,
  CartesianGrid: () => <div />,
  Tooltip: () => <div />,
  Legend: () => <div />,
}));

const SAMPLE_DATA: DailyCallVolume[] = [
  { date: "2026-02-01", answered: 8, missed: 2, voicemail: 1 },
  { date: "2026-02-02", answered: 10, missed: 1, voicemail: 0 },
];

describe("CallsPerDayChart", () => {
  it("should render chart with data", () => {
    render(<CallsPerDayChart data={SAMPLE_DATA} />);

    expect(screen.getByText("Calls Per Day")).toBeInTheDocument();
    expect(screen.getByTestId("bar-chart")).toBeInTheDocument();
  });

  it("should show empty state when no data", () => {
    render(<CallsPerDayChart data={[]} />);

    expect(screen.getByText("No call data available")).toBeInTheDocument();
  });
});
