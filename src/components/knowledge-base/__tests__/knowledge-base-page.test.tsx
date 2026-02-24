import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, beforeEach, vi } from "vitest";
import KnowledgeBasePage from "@/app/dashboard/knowledge-base/page";

const MOCK_KB_RESPONSE = {
  success: true,
  data: {
    pricing: [
      { id: "price-001", service_name: "AC Tune-Up", price_low: 89, price_high: 89, duration: "1 hour", category: "services", is_active: true, conditions: null, created_at: "2026-01-01T00:00:00Z" },
      { id: "price-002", service_name: "AC Unit Replacement", price_low: 4500, price_high: 4500, duration: "4-6 hours", category: "services", is_active: true, conditions: null, created_at: "2026-01-01T00:00:00Z" },
      { id: "price-003", service_name: "Pest Inspection", price_low: 150, price_high: 150, duration: "45 min", category: "services", is_active: true, conditions: null, created_at: "2026-01-01T00:00:00Z" },
    ],
    faqs: [
      { id: "faq-001", question: "What are your business hours?", answer: "Mon-Fri 8-6", source: "website", category: "general", is_active: true, created_at: "2026-01-01T00:00:00Z" },
    ],
  },
};

beforeEach(() => {
  vi.restoreAllMocks();
  Object.defineProperty(document, "cookie", {
    writable: true,
    value: "onboarding_business_id=test-business-id",
  });
  vi.spyOn(globalThis, "fetch").mockResolvedValue(
    new Response(JSON.stringify(MOCK_KB_RESPONSE), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })
  );
});

describe("KnowledgeBasePage", () => {
  it("should render the page title", async () => {
    render(<KnowledgeBasePage />);

    await waitFor(() => {
      expect(screen.getByText("Knowledge Base")).toBeInTheDocument();
    });
    expect(screen.getByText("Manage pricing and FAQs that Chitti uses during calls")).toBeInTheDocument();
  });

  it("should render two tabs", async () => {
    render(<KnowledgeBasePage />);

    await waitFor(() => {
      expect(screen.getByText("Pricing Table")).toBeInTheDocument();
    });
    expect(screen.getByText("FAQs & Content")).toBeInTheDocument();
  });

  it("should show pricing tab by default with items", async () => {
    render(<KnowledgeBasePage />);

    await waitFor(() => {
      expect(screen.getByText("AC Tune-Up")).toBeInTheDocument();
    });
    expect(screen.getByText("$89")).toBeInTheDocument();
  });

  it("should switch to FAQs tab when clicked", async () => {
    const user = userEvent.setup();
    render(<KnowledgeBasePage />);

    await waitFor(() => {
      expect(screen.getByText("Pricing Table")).toBeInTheDocument();
    });

    await user.click(screen.getByText("FAQs & Content"));

    expect(screen.getByText("What are your business hours?")).toBeInTheDocument();
  });

  it("should filter pricing items when searching", async () => {
    const user = userEvent.setup();
    render(<KnowledgeBasePage />);

    await waitFor(() => {
      expect(screen.getByText("AC Tune-Up")).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText("Search services...");
    await user.type(searchInput, "AC");

    expect(screen.getByText("AC Tune-Up")).toBeInTheDocument();
    expect(screen.getByText("AC Unit Replacement")).toBeInTheDocument();
    expect(screen.queryByText("Pest Inspection")).not.toBeInTheDocument();
  });

  it("should enter edit mode when edit button is clicked on pricing row", async () => {
    const user = userEvent.setup();
    render(<KnowledgeBasePage />);

    await waitFor(() => {
      expect(screen.getAllByLabelText("Edit").length).toBeGreaterThan(0);
    });

    const editButtons = screen.getAllByLabelText("Edit");
    await user.click(editButtons[0]);

    expect(screen.getByLabelText("Save")).toBeInTheDocument();
    expect(screen.getByLabelText("Cancel")).toBeInTheDocument();
  });
});
