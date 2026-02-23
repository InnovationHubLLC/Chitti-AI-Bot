import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { NotificationsSection } from "../notifications-section";
import { MOCK_NOTIFICATION_PREFERENCES } from "@/lib/constants/mock-settings";
import type { NotificationPreferences } from "@/lib/types/settings";

const PREFERENCES: NotificationPreferences = {
  ...MOCK_NOTIFICATION_PREFERENCES,
};

function renderSection(
  props: Partial<React.ComponentProps<typeof NotificationsSection>> = {}
): ReturnType<typeof render> {
  return render(
    <NotificationsSection
      preferences={PREFERENCES}
      onSave={vi.fn()}
      {...props}
    />
  );
}

describe("NotificationsSection", () => {
  it("should render toggle states as Enabled/Disabled text", () => {
    renderSection();

    // smsOnHotLead: true, smsOnWarmLead: true, smsOnColdLead: false, dailyDigestEnabled: true
    const enabledItems = screen.getAllByText("Enabled");
    const disabledItems = screen.getAllByText("Disabled");

    expect(enabledItems).toHaveLength(3);
    expect(disabledItems).toHaveLength(1);
  });

  it("should show edit button", () => {
    renderSection();

    expect(
      screen.getByRole("button", { name: "Edit notification preferences" })
    ).toBeInTheDocument();
  });

  it("should show switch toggles when edit button is clicked", async () => {
    const user = userEvent.setup();
    renderSection();

    await user.click(
      screen.getByRole("button", { name: "Edit notification preferences" })
    );

    expect(screen.getAllByRole("switch")).toHaveLength(4);
  });

  it("should call onSave with updated preferences when toggle is changed and saved", async () => {
    const user = userEvent.setup();
    const onSave = vi.fn();
    renderSection({ onSave });

    await user.click(
      screen.getByRole("button", { name: "Edit notification preferences" })
    );

    // The SMS on Cold Lead switch should be unchecked (smsOnColdLead: false)
    // Click it to enable it
    const switches = screen.getAllByRole("switch");
    // Order: smsOnHotLead, smsOnWarmLead, smsOnColdLead, dailyDigestEnabled
    const coldLeadSwitch = switches[2];
    await user.click(coldLeadSwitch);

    await user.click(screen.getByRole("button", { name: "Save" }));

    expect(onSave).toHaveBeenCalledOnce();
    expect(onSave).toHaveBeenCalledWith(
      expect.objectContaining({ smsOnColdLead: true })
    );
  });

  it("should show email and digest time in view mode", () => {
    renderSection();

    expect(
      screen.getByText("sarah@brightsmilesdental.com")
    ).toBeInTheDocument();
    expect(screen.getByText("08:00")).toBeInTheDocument();
  });
});
