import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { FaqCard } from "../faq-card";
import type { FaqItem } from "@/lib/types/knowledge-base";

const ITEM: FaqItem = {
  id: "faq-001",
  question: "What are your business hours?",
  answer: "We are open Monday through Friday from 8 AM to 6 PM.",
  category: "general",
  is_active: true,
  source: "website",
  created_at: "2026-01-01T00:00:00Z",
};

function renderCard(props: Partial<React.ComponentProps<typeof FaqCard>> = {}): ReturnType<typeof render> {
  return render(
    <FaqCard
      item={ITEM}
      isEditing={false}
      isSelected={false}
      onEdit={vi.fn()}
      onSave={vi.fn()}
      onCancel={vi.fn()}
      onDelete={vi.fn()}
      onToggleSelect={vi.fn()}
      {...props}
    />
  );
}

describe("FaqCard", () => {
  it("should render question text", () => {
    renderCard();

    expect(screen.getByText("What are your business hours?")).toBeInTheDocument();
  });

  it("should show category badge", () => {
    renderCard();

    expect(screen.getByText("general")).toBeInTheDocument();
  });

  it("should expand to show answer when clicked", async () => {
    const user = userEvent.setup();
    renderCard();

    expect(screen.queryByText(/Monday through Friday/)).not.toBeInTheDocument();

    await user.click(screen.getByText("What are your business hours?"));

    expect(screen.getByText(/Monday through Friday/)).toBeInTheDocument();
  });

  it("should collapse when clicked again", async () => {
    const user = userEvent.setup();
    renderCard();

    await user.click(screen.getByText("What are your business hours?"));
    expect(screen.getByText(/Monday through Friday/)).toBeInTheDocument();

    await user.click(screen.getByText("What are your business hours?"));
    expect(screen.queryByText(/Monday through Friday/)).not.toBeInTheDocument();
  });

  it("should show edit inputs in edit mode", () => {
    renderCard({ isEditing: true });

    expect(screen.getByDisplayValue("What are your business hours?")).toBeInTheDocument();
    expect(screen.getByDisplayValue(/Monday through Friday/)).toBeInTheDocument();
  });

  it("should call onEdit when edit button is clicked", async () => {
    const onEdit = vi.fn();
    const user = userEvent.setup();
    renderCard({ onEdit });

    await user.click(screen.getByLabelText("Edit"));
    expect(onEdit).toHaveBeenCalledOnce();
  });

  it("should call onDelete when delete button is clicked", async () => {
    const onDelete = vi.fn();
    const user = userEvent.setup();
    renderCard({ onDelete });

    await user.click(screen.getByLabelText("Delete"));
    expect(onDelete).toHaveBeenCalledOnce();
  });
});
