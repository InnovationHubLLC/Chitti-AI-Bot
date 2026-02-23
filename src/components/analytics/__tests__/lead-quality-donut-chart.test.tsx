import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { LeadQualityDonutChart } from "../lead-quality-donut-chart";

vi.mock("recharts", () => ({
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="responsive-container">{children}</div>
  ),
  PieChart: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="pie-chart">{children}</div>
  ),
  Pie: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="pie">{children}</div>
  ),
  Cell: () => <div data-testid="cell" />,
  Tooltip: () => <div />,
  Legend: () => <div />,
}));

describe("LeadQualityDonutChart", () => {
  const data = [
    { label: "Hot", value: 18, color: "#ef4444" },
    { label: "Warm", value: 34, color: "#f59e0b" },
    { label: "Cold", value: 12, color: "#3b82f6" },
  ];

  it("should render the chart title", () => {
    render(<LeadQualityDonutChart data={data} />);

    expect(screen.getByText("Lead Quality")).toBeInTheDocument();
  });

  it("should render the pie chart", () => {
    render(<LeadQualityDonutChart data={data} />);

    expect(screen.getByTestId("pie-chart")).toBeInTheDocument();
  });

  it("should render cells for each segment", () => {
    render(<LeadQualityDonutChart data={data} />);

    const cells = screen.getAllByTestId("cell");
    expect(cells).toHaveLength(3);
  });
});
