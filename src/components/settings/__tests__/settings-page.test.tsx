import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import SettingsPage from "@/app/dashboard/settings/page";

vi.mock("@/components/onboarding/business-hours-editor", () => ({
  BusinessHoursEditor: () => <div data-testid="business-hours-editor" />,
}));

function renderPage(): ReturnType<typeof render> {
  return render(<SettingsPage />);
}

describe("SettingsPage", () => {
  it("should render page heading", () => {
    renderPage();

    expect(
      screen.getByRole("heading", { name: "Settings" })
    ).toBeInTheDocument();
  });

  it("should render Business Profile section", () => {
    renderPage();

    expect(screen.getByText("Business Profile")).toBeInTheDocument();
  });

  it("should render Business Hours section", () => {
    renderPage();

    expect(screen.getByText("Business Hours")).toBeInTheDocument();
  });

  it("should render Notifications section", () => {
    renderPage();

    expect(screen.getByText("Notifications")).toBeInTheDocument();
  });

  it("should render Billing & Subscription section", () => {
    renderPage();

    expect(
      screen.getByText("Billing & Subscription")
    ).toBeInTheDocument();
  });
});
