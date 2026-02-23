"use client";

import { useState } from "react";
import type React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardAction,
} from "@/components/ui/card";
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
import { Pencil } from "lucide-react";
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
    <Card>
      <CardHeader>
        <CardTitle>Business Profile</CardTitle>
        <CardDescription>
          Your business name, contact info, and industry details.
        </CardDescription>
        {!isEditing && (
          <CardAction>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleEdit}
              aria-label="Edit business profile"
            >
              <Pencil className="h-4 w-4" />
            </Button>
          </CardAction>
        )}
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="profile-name">Business Name</Label>
                <Input
                  id="profile-name"
                  value={draft.name}
                  onChange={(e) => updateField("name", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="profile-owner">Owner Name</Label>
                <Input
                  id="profile-owner"
                  value={draft.ownerName}
                  onChange={(e) => updateField("ownerName", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="profile-phone">Phone</Label>
                <Input
                  id="profile-phone"
                  type="tel"
                  value={draft.phone}
                  onChange={(e) => updateField("phone", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="profile-website">Website URL</Label>
                <Input
                  id="profile-website"
                  type="url"
                  value={draft.websiteUrl}
                  onChange={(e) => updateField("websiteUrl", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="profile-industry">Industry</Label>
                <Select
                  value={draft.industry}
                  onValueChange={(value) =>
                    updateField("industry", value as IndustryValue)
                  }
                >
                  <SelectTrigger id="profile-industry">
                    <SelectValue placeholder="Select industry" />
                  </SelectTrigger>
                  <SelectContent>
                    {INDUSTRIES.map((industry) => (
                      <SelectItem key={industry.value} value={industry.value}>
                        {industry.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="profile-state">State</Label>
                <Select
                  value={draft.state}
                  onValueChange={(value) =>
                    updateField("state", value as USStateValue)
                  }
                >
                  <SelectTrigger id="profile-state">
                    <SelectValue placeholder="Select state" />
                  </SelectTrigger>
                  <SelectContent>
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
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button onClick={handleSave}>Save</Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label className="text-muted-foreground text-xs">
                Business Name
              </Label>
              <p className="text-sm font-medium">{profile.name}</p>
            </div>
            <div className="space-y-1">
              <Label className="text-muted-foreground text-xs">
                Owner Name
              </Label>
              <p className="text-sm font-medium">{profile.ownerName}</p>
            </div>
            <div className="space-y-1">
              <Label className="text-muted-foreground text-xs">Phone</Label>
              <p className="text-sm font-medium">{profile.phone}</p>
            </div>
            <div className="space-y-1">
              <Label className="text-muted-foreground text-xs">
                Website URL
              </Label>
              <p className="text-sm font-medium">{profile.websiteUrl}</p>
            </div>
            <div className="space-y-1">
              <Label className="text-muted-foreground text-xs">Industry</Label>
              <p className="text-sm font-medium">
                {getIndustryLabel(profile.industry)}
              </p>
            </div>
            <div className="space-y-1">
              <Label className="text-muted-foreground text-xs">State</Label>
              <p className="text-sm font-medium">
                {getStateLabel(profile.state)}
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
