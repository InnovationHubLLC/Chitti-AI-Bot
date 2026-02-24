import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Phone } from "lucide-react";
import { StatCard } from "../stat-card";

describe("StatCard", () => {
  it("should render value and label", () => {
    render(<StatCard label="Total Calls" value="247" trend={12.5} icon={Phone} />);

    expect(screen.getByText("Total Calls")).toBeInTheDocument();
    expect(screen.getByText("247")).toBeInTheDocument();
  });

  it("should show positive trend with up arrow", () => {
    render(<StatCard label="Total Calls" value="247" trend={12.5} icon={Phone} />);

    expect(screen.getByText("+12.5%")).toBeInTheDocument();
    expect(screen.getByLabelText("Trending up")).toBeInTheDocument();
  });

  it("should show negative trend with down arrow", () => {
    render(<StatCard label="Avg Score" value="7.2" trend={-2.1} icon={Phone} />);

    expect(screen.getByText("-2.1%")).toBeInTheDocument();
    expect(screen.getByLabelText("Trending down")).toBeInTheDocument();
  });

  it("should apply green color for positive trends", () => {
    render(<StatCard label="Test" value="100" trend={5} icon={Phone} />);

    const trendText = screen.getByText("+5%");
    expect(trendText).toHaveClass("text-emerald-400");
  });

  it("should apply red color for negative trends", () => {
    render(<StatCard label="Test" value="100" trend={-3} icon={Phone} />);

    const trendText = screen.getByText("-3%");
    expect(trendText).toHaveClass("text-red-400");
  });
});
