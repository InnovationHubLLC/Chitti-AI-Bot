import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { TimePeriodSelector } from "../time-period-selector";

describe("TimePeriodSelector", () => {
  it("should render all period options", () => {
    render(<TimePeriodSelector value="30d" onChange={vi.fn()} />);

    expect(screen.getByText("7D")).toBeInTheDocument();
    expect(screen.getByText("30D")).toBeInTheDocument();
    expect(screen.getByText("90D")).toBeInTheDocument();
    expect(screen.getByText("Custom")).toBeInTheDocument();
  });

  it("should highlight the active period", () => {
    render(<TimePeriodSelector value="30d" onChange={vi.fn()} />);

    const activeButton = screen.getByText("30D");
    expect(activeButton).toHaveAttribute("aria-pressed", "true");
  });

  it("should call onChange when clicking a period", async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();

    render(<TimePeriodSelector value="30d" onChange={onChange} />);

    await user.click(screen.getByText("7D"));
    expect(onChange).toHaveBeenCalledWith("7d");
  });

  it("should not highlight inactive periods", () => {
    render(<TimePeriodSelector value="7d" onChange={vi.fn()} />);

    const inactiveButton = screen.getByText("30D");
    expect(inactiveButton).toHaveAttribute("aria-pressed", "false");
  });
});
