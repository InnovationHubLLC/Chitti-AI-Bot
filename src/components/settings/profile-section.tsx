"use client";

import { useState } from "react";
import type React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Pencil, Building2 } from "lucide-react";
import { INDUSTRIES } from "@/lib/constants/industries";
import { US_STATES } from "@/lib/constants/us-states";
import type { BusinessProfile } from "@/lib/types/settings";
import type { IndustryValue } from "@/lib/constants/industries";
import type { USStateValue } from "@/lib/constants/us-states";

interface ProfileSectionProps {
  profile: BusinessProfile;
  onSave: (profile: BusinessProfile) => void;
}

function getIndustryLabel(value: IndustryValue): string {
  return INDUSTRIES.find((i) => i.value === value)?.label ?? value;
}

function getStateLabel(value: USStateValue): string {
  return US_STATES.find((s) => s.value === value)?.label ?? value;
}

export function ProfileSection({
  profile,
  onSave,
}: ProfileSectionProps): React.ReactElement {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [draft, setDraft] = useState<BusinessProfile>(profile);

  function handleEdit(): void {
    setDraft(profile);
    setIsEditing(true);
  }

  function handleCancel(): void {
    setDraft(profile);
    setIsEditing(false);
  }

  function handleSave(): void {
    onSave(draft);
    setIsEditing(false);
  }

  function updateField<K extends keyof BusinessProfile>(
    field: K,
    value: BusinessProfile[K]
  ): void {
    setDraft((prev) => ({ ...prev, [field]: value }));
  }

  return (
    <div className="card-elevated">
      <div className="flex items-center justify-between p-5 border-b border-[#1e3050]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-violet-500/15 flex items-center justify-center shadow-[0_0_12px_rgba(124,58,237,0.2)]">
            <Building2 className="size-5 text-violet-400" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-white">Business Profile</h3>
            <p className="text-xs text-[#6b8baf]">Your business name, contact info, and industry details.</p>
          </div>
        </div>
        {!isEditing && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleEdit}
            aria-label="Edit business profile"
            className="text-[#6b8baf] hover:text-white hover:bg-[#111f33]"
          >
            <Pencil className="h-4 w-4" />
          </Button>
        )}
      </div>
      <div className="p-5">
        {isEditing ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="profile-name" className="text-xs uppercase tracking-wider text-[#6b8baf]">Business Name</Label>
                <Input
                  id="profile-name"
                  value={draft.name}
                  onChange={(e) => updateField("name", e.target.value)}
                  className="bg-[#080f1a] border-[#1e3050] text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="profile-owner" className="text-xs uppercase tracking-wider text-[#6b8baf]">Owner Name</Label>
                <Input
                  id="profile-owner"
                  value={draft.ownerName}
                  onChange={(e) => updateField("ownerName", e.target.value)}
                  className="bg-[#080f1a] border-[#1e3050] text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="profile-phone" className="text-xs uppercase tracking-wider text-[#6b8baf]">Phone</Label>
                <Input
                  id="profile-phone"
                  type="tel"
                  value={draft.phone}
                  onChange={(e) => updateField("phone", e.target.value)}
                  className="bg-[#080f1a] border-[#1e3050] text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="profile-website" className="text-xs uppercase tracking-wider text-[#6b8baf]">Website URL</Label>
                <Input
                  id="profile-website"
                  type="url"
                  value={draft.websiteUrl}
                  onChange={(e) => updateField("websiteUrl", e.target.value)}
                  className="bg-[#080f1a] border-[#1e3050] text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="profile-industry" className="text-xs uppercase tracking-wider text-[#6b8baf]">Industry</Label>
                <Select
                  value={draft.industry}
                  onValueChange={(value) =>
                    updateField("industry", value as IndustryValue)
                  }
                >
                  <SelectTrigger id="profile-industry" className="bg-[#080f1a] border-[#1e3050] text-white">
                    <SelectValue placeholder="Select industry" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#0d1726] border-[#1e3050]">
                    {INDUSTRIES.map((industry) => (
                      <SelectItem key={industry.value} value={industry.value}>
                        {industry.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="profile-state" className="text-xs uppercase tracking-wider text-[#6b8baf]">State</Label>
                <Select
                  value={draft.state}
                  onValueChange={(value) =>
                    updateField("state", value as USStateValue)
                  }
                >
                  <SelectTrigger id="profile-state" className="bg-[#080f1a] border-[#1e3050] text-white">
                    <SelectValue placeholder="Select state" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#0d1726] border-[#1e3050]">
                    {US_STATES.map((state) => (
                      <SelectItem key={state.value} value={state.value}>
                        {state.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={handleCancel} className="border-[#1e3050] text-[#8ba8c8] hover:bg-[#111f33]">
                Cancel
              </Button>
              <Button onClick={handleSave} className="bg-accent-500 hover:bg-accent-600 text-white glow-cta">Save</Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label className="text-xs uppercase tracking-wider text-[#6b8baf]">
                Business Name
              </Label>
              <p className="text-sm font-medium text-[#c8daf0]">{profile.name}</p>
            </div>
            <div className="space-y-1">
              <Label className="text-xs uppercase tracking-wider text-[#6b8baf]">
                Owner Name
              </Label>
              <p className="text-sm font-medium text-[#c8daf0]">{profile.ownerName}</p>
            </div>
            <div className="space-y-1">
              <Label className="text-xs uppercase tracking-wider text-[#6b8baf]">Phone</Label>
              <p className="text-sm font-medium text-[#c8daf0]">{profile.phone}</p>
            </div>
            <div className="space-y-1">
              <Label className="text-xs uppercase tracking-wider text-[#6b8baf]">
                Website URL
              </Label>
              <p className="text-sm font-medium text-[#c8daf0]">{profile.websiteUrl}</p>
            </div>
            <div className="space-y-1">
              <Label className="text-xs uppercase tracking-wider text-[#6b8baf]">Industry</Label>
              <p className="text-sm font-medium text-[#c8daf0]">
                {getIndustryLabel(profile.industry)}
              </p>
            </div>
            <div className="space-y-1">
              <Label className="text-xs uppercase tracking-wider text-[#6b8baf]">State</Label>
              <p className="text-sm font-medium text-[#c8daf0]">
                {getStateLabel(profile.state)}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
