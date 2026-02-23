import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { BillingSection } from "../billing-section";
import { MOCK_SUBSCRIPTION_INFO } from "@/lib/constants/mock-settings";
import type { SubscriptionInfo } from "@/lib/types/settings";

const SUBSCRIPTION: SubscriptionInfo = { ...MOCK_SUBSCRIPTION_INFO };

function renderSection(
  props: Partial<React.ComponentProps<typeof BillingSection>> = {}
): ReturnType<typeof render> {
  return render(
    <BillingSection subscription={SUBSCRIPTION} {...props} />
  );
}

describe("BillingSection", () => {
  it("should render plan name", () => {
    renderSection();

    expect(screen.getByText("Chitti Pro")).toBeInTheDocument();
  });

  it("should render status badge with Active text", () => {
    renderSection();

    expect(screen.getByText("Active")).toBeInTheDocument();
  });

  it("should render usage text", () => {
    renderSection();

    expect(screen.getByText("187 / 300 minutes")).toBeInTheDocument();
  });

  it("should render price", () => {
    renderSection();

    expect(screen.getByText("$149/month")).toBeInTheDocument();
  });

  it("should render period end date", () => {
    renderSection();

    // formatDate uses en-US locale with toLocaleDateString
    // The exact output depends on timezone, so match flexibly
    expect(screen.getByText(/March 1[45], 2026/)).toBeInTheDocument();
  });

  it("should have a disabled manage subscription button", () => {
    renderSection();

    const button = screen.getByRole("button", {
      name: "Manage Subscription",
    });
    expect(button).toBeDisabled();
  });
});
