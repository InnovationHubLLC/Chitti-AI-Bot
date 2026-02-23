import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { ProfileSection } from "../profile-section";
import { MOCK_BUSINESS_PROFILE } from "@/lib/constants/mock-settings";
import type { BusinessProfile } from "@/lib/types/settings";

const PROFILE: BusinessProfile = { ...MOCK_BUSINESS_PROFILE };

function renderSection(
  props: Partial<React.ComponentProps<typeof ProfileSection>> = {}
): ReturnType<typeof render> {
  return render(
    <ProfileSection profile={PROFILE} onSave={vi.fn()} {...props} />
  );
}

describe("ProfileSection", () => {
  it("should render all field values in view mode", () => {
    renderSection();

    expect(screen.getByText("Bright Smiles Dental")).toBeInTheDocument();
    expect(screen.getByText("Dr. Sarah Chen")).toBeInTheDocument();
    expect(screen.getByText("(512) 555-0123")).toBeInTheDocument();
    expect(
      screen.getByText("https://brightsmilesdental.com")
    ).toBeInTheDocument();
    expect(screen.getByText("Dental Practice")).toBeInTheDocument();
    expect(screen.getByText("Texas")).toBeInTheDocument();
  });

  it("should show edit button", () => {
    renderSection();

    expect(
      screen.getByRole("button", { name: "Edit business profile" })
    ).toBeInTheDocument();
  });

  it("should show input fields when edit button is clicked", async () => {
    const user = userEvent.setup();
    renderSection();

    await user.click(
      screen.getByRole("button", { name: "Edit business profile" })
    );

    expect(screen.getByLabelText("Business Name")).toBeInTheDocument();
    expect(screen.getByLabelText("Owner Name")).toBeInTheDocument();
    expect(screen.getByLabelText("Phone")).toBeInTheDocument();
    expect(screen.getByLabelText("Website URL")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Bright Smiles Dental")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Dr. Sarah Chen")).toBeInTheDocument();
  });

  it("should call onSave with updated profile when saved", async () => {
    const user = userEvent.setup();
    const onSave = vi.fn();
    renderSection({ onSave });

    await user.click(
      screen.getByRole("button", { name: "Edit business profile" })
    );

    const nameInput = screen.getByLabelText("Business Name");
    await user.clear(nameInput);
    await user.type(nameInput, "New Dental Office");

    await user.click(screen.getByRole("button", { name: "Save" }));

    expect(onSave).toHaveBeenCalledOnce();
    expect(onSave).toHaveBeenCalledWith(
      expect.objectContaining({ name: "New Dental Office" })
    );
  });

  it("should revert changes when cancel is clicked", async () => {
    const user = userEvent.setup();
    const onSave = vi.fn();
    renderSection({ onSave });

    await user.click(
      screen.getByRole("button", { name: "Edit business profile" })
    );

    const nameInput = screen.getByLabelText("Business Name");
    await user.clear(nameInput);
    await user.type(nameInput, "Changed Name");

    await user.click(screen.getByRole("button", { name: "Cancel" }));

    // Should be back in view mode with original values
    expect(screen.getByText("Bright Smiles Dental")).toBeInTheDocument();
    expect(onSave).not.toHaveBeenCalled();
  });
});
