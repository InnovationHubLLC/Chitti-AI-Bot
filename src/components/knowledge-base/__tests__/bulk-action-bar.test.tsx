import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { BulkActionBar } from "../bulk-action-bar";

describe("BulkActionBar", () => {
  it("should render nothing when no items selected", () => {
    const { container } = render(
      <BulkActionBar
        selectedCount={0}
        onDelete={vi.fn()}
        onExport={vi.fn()}
        onDeactivate={vi.fn()}
      />
    );

    expect(container.firstChild).toBeNull();
  });

  it("should show count of selected items", () => {
    render(
      <BulkActionBar
        selectedCount={3}
        onDelete={vi.fn()}
        onExport={vi.fn()}
        onDeactivate={vi.fn()}
      />
    );

    expect(screen.getByText("3 items selected")).toBeInTheDocument();
  });

  it("should use singular form for 1 item", () => {
    render(
      <BulkActionBar
        selectedCount={1}
        onDelete={vi.fn()}
        onExport={vi.fn()}
        onDeactivate={vi.fn()}
      />
    );

    expect(screen.getByText("1 item selected")).toBeInTheDocument();
  });

  it("should call onDelete after confirming in dialog", async () => {
    const onDelete = vi.fn();
    const user = userEvent.setup();

    render(
      <BulkActionBar
        selectedCount={2}
        onDelete={onDelete}
        onExport={vi.fn()}
        onDeactivate={vi.fn()}
      />
    );

    // Click Delete opens confirmation dialog
    await user.click(screen.getByText("Delete"));
    expect(onDelete).not.toHaveBeenCalled();

    // Confirm in dialog
    const confirmButtons = screen.getAllByText("Delete");
    await user.click(confirmButtons[confirmButtons.length - 1]);
    expect(onDelete).toHaveBeenCalledOnce();
  });

  it("should call onExport when Export CSV button is clicked", async () => {
    const onExport = vi.fn();
    const user = userEvent.setup();

    render(
      <BulkActionBar
        selectedCount={2}
        onDelete={vi.fn()}
        onExport={onExport}
        onDeactivate={vi.fn()}
      />
    );

    await user.click(screen.getByText("Export CSV"));
    expect(onExport).toHaveBeenCalledOnce();
  });

  it("should call onDeactivate when Deactivate button is clicked", async () => {
    const onDeactivate = vi.fn();
    const user = userEvent.setup();

    render(
      <BulkActionBar
        selectedCount={2}
        onDelete={vi.fn()}
        onExport={vi.fn()}
        onDeactivate={onDeactivate}
      />
    );

    await user.click(screen.getByText("Deactivate"));
    expect(onDeactivate).toHaveBeenCalledOnce();
  });
});
