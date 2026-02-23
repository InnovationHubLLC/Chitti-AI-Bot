import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect } from "vitest";
import KnowledgeBasePage from "@/app/dashboard/knowledge-base/page";

describe("KnowledgeBasePage", () => {
  it("should render the page title", () => {
    render(<KnowledgeBasePage />);

    expect(screen.getByText("Knowledge Base")).toBeInTheDocument();
    expect(screen.getByText("Manage pricing and FAQs that Chitti uses during calls")).toBeInTheDocument();
  });

  it("should render two tabs", () => {
    render(<KnowledgeBasePage />);

    expect(screen.getByText("Pricing Table")).toBeInTheDocument();
    expect(screen.getByText("FAQs & Content")).toBeInTheDocument();
  });

  it("should show pricing tab by default with items", () => {
    render(<KnowledgeBasePage />);

    expect(screen.getByText("AC Tune-Up")).toBeInTheDocument();
    expect(screen.getByText("$89")).toBeInTheDocument();
  });

  it("should switch to FAQs tab when clicked", async () => {
    const user = userEvent.setup();
    render(<KnowledgeBasePage />);

    await user.click(screen.getByText("FAQs & Content"));

    expect(screen.getByText("What are your business hours?")).toBeInTheDocument();
  });

  it("should filter pricing items when searching", async () => {
    const user = userEvent.setup();
    render(<KnowledgeBasePage />);

    const searchInput = screen.getByPlaceholderText("Search services...");
    await user.type(searchInput, "AC");

    expect(screen.getByText("AC Tune-Up")).toBeInTheDocument();
    expect(screen.getByText("AC Unit Replacement")).toBeInTheDocument();
    expect(screen.queryByText("Pest Inspection")).not.toBeInTheDocument();
  });

  it("should enter edit mode when edit button is clicked on pricing row", async () => {
    const user = userEvent.setup();
    render(<KnowledgeBasePage />);

    const editButtons = screen.getAllByLabelText("Edit");
    await user.click(editButtons[0]);

    expect(screen.getByLabelText("Save")).toBeInTheDocument();
    expect(screen.getByLabelText("Cancel")).toBeInTheDocument();
  });
});
