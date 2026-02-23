import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { Table, TableBody } from "@/components/ui/table";
import { PricingTableRow } from "../pricing-table-row";
import type { PricingItem } from "@/lib/types/knowledge-base";

const ITEM: PricingItem = {
  id: "price-001",
  service: "AC Tune-Up",
  price: 89,
  duration: "1 hour",
  category: "services",
  is_active: true,
  source: "website",
  created_at: "2026-01-01T00:00:00Z",
};

function renderRow(props: Partial<React.ComponentProps<typeof PricingTableRow>> = {}): ReturnType<typeof render> {
  return render(
    <Table>
      <TableBody>
        <PricingTableRow
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
      </TableBody>
    </Table>
  );
}

describe("PricingTableRow", () => {
  it("should render service name and price in display mode", () => {
    renderRow();

    expect(screen.getByText("AC Tune-Up")).toBeInTheDocument();
    expect(screen.getByText("$89")).toBeInTheDocument();
    expect(screen.getByText("1 hour")).toBeInTheDocument();
  });

  it("should show edit and delete buttons in display mode", () => {
    renderRow();

    expect(screen.getByLabelText("Edit")).toBeInTheDocument();
    expect(screen.getByLabelText("Delete")).toBeInTheDocument();
  });

  it("should render input fields in edit mode", () => {
    renderRow({ isEditing: true });

    const inputs = screen.getAllByRole("textbox");
    expect(inputs.length).toBeGreaterThanOrEqual(3);
    expect(screen.getByLabelText("Save")).toBeInTheDocument();
    expect(screen.getByLabelText("Cancel")).toBeInTheDocument();
  });

  it("should call onEdit when edit button is clicked", async () => {
    const onEdit = vi.fn();
    const user = userEvent.setup();

    renderRow({ onEdit });

    await user.click(screen.getByLabelText("Edit"));
    expect(onEdit).toHaveBeenCalledOnce();
  });

  it("should call onDelete when delete button is clicked", async () => {
    const onDelete = vi.fn();
    const user = userEvent.setup();

    renderRow({ onDelete });

    await user.click(screen.getByLabelText("Delete"));
    expect(onDelete).toHaveBeenCalledOnce();
  });

  it("should call onCancel when cancel button is clicked in edit mode", async () => {
    const onCancel = vi.fn();
    const user = userEvent.setup();

    renderRow({ isEditing: true, onCancel });

    await user.click(screen.getByLabelText("Cancel"));
    expect(onCancel).toHaveBeenCalledOnce();
  });

  it("should show source badge", () => {
    renderRow();

    expect(screen.getByText("website")).toBeInTheDocument();
  });
});
