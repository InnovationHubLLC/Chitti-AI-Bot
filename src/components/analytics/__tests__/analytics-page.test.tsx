import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import AnalyticsPage from "@/app/dashboard/analytics/page";

// Mock recharts
vi.mock("recharts", () => ({
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  BarChart: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  PieChart: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Pie: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Bar: () => <div />,
  Cell: () => <div />,
  XAxis: () => <div />,
  YAxis: () => <div />,
  CartesianGrid: () => <div />,
  Tooltip: () => <div />,
  Legend: () => <div />,
}));

describe("AnalyticsPage", () => {
  it("should render the page title", () => {
    render(<AnalyticsPage />);

    expect(screen.getByText("Analytics")).toBeInTheDocument();
    expect(screen.getByText("Track your call performance and lead metrics")).toBeInTheDocument();
  });

  it("should render stat cards with mock data", () => {
    render(<AnalyticsPage />);

    expect(screen.getByText("Total Calls")).toBeInTheDocument();
    expect(screen.getByText("Leads Generated")).toBeInTheDocument();
    expect(screen.getByText("Avg Score")).toBeInTheDocument();
    expect(screen.getByText("Conversion Rate")).toBeInTheDocument();
  });

  it("should render chart titles", () => {
    render(<AnalyticsPage />);

    expect(screen.getByText("Calls Per Day")).toBeInTheDocument();
    expect(screen.getByText("Lead Quality")).toBeInTheDocument();
    expect(screen.getByText("Peak Call Hours")).toBeInTheDocument();
    expect(screen.getByText("Top Services Inquired")).toBeInTheDocument();
  });

  it("should render time period selector with 30D active by default", () => {
    render(<AnalyticsPage />);

    const button30d = screen.getByText("30D");
    expect(button30d).toHaveAttribute("aria-pressed", "true");
  });

  it("should switch time period when clicking a button", async () => {
    const user = userEvent.setup();
    render(<AnalyticsPage />);

    await user.click(screen.getByText("7D"));

    expect(screen.getByText("7D")).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByText("30D")).toHaveAttribute("aria-pressed", "false");
  });
});
