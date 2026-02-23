"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight, Pencil, Trash2, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import type { FaqItem } from "@/lib/types/knowledge-base";

interface FaqCardProps {
  item: FaqItem;
  isEditing: boolean;
  isSelected: boolean;
  onEdit: () => void;
  onSave: (updated: FaqItem) => void;
  onCancel: () => void;
  onDelete: () => void;
  onToggleSelect: () => void;
}

const CATEGORY_COLORS: Record<string, string> = {
  general: "bg-gray-100 text-gray-700",
  pricing: "bg-green-100 text-green-700",
  services: "bg-blue-100 text-blue-700",
  insurance: "bg-purple-100 text-purple-700",
  scheduling: "bg-amber-100 text-amber-700",
  emergency: "bg-red-100 text-red-700",
};

export function FaqCard({
  item,
  isEditing,
  isSelected,
  onEdit,
  onSave,
  onCancel,
  onDelete,
  onToggleSelect,
}: FaqCardProps): React.ReactElement {
  const [expanded, setExpanded] = useState(false);
  const [draft, setDraft] = useState(item);

  const handleSave = (): void => {
    onSave(draft);
  };

  return (
    <Card className={cn(isEditing && "ring-2 ring-blue-300")}>
      <CardContent className="pt-4">
        <div className="flex items-start gap-3">
          <Checkbox
            checked={isSelected}
            onCheckedChange={onToggleSelect}
            className="mt-1"
          />

          <div className="flex-1 min-w-0">
            {isEditing ? (
              <div className="space-y-3">
                <Input
                  value={draft.question}
                  onChange={(e) => setDraft({ ...draft, question: e.target.value })}
                  placeholder="Question"
                />
                <Textarea
                  value={draft.answer}
                  onChange={(e) => setDraft({ ...draft, answer: e.target.value })}
                  placeholder="Answer"
                  rows={3}
                />
                <div className="flex items-center gap-2">
                  <Button size="sm" onClick={handleSave}>
                    <Check className="mr-1.5 size-4" />
                    Save
                  </Button>
                  <Button variant="outline" size="sm" onClick={onCancel}>
                    <X className="mr-1.5 size-4" />
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <button
                  onClick={() => setExpanded(!expanded)}
                  className="flex w-full items-center gap-2 text-left"
                >
                  {expanded ? (
                    <ChevronDown className="size-4 shrink-0 text-gray-400" />
                  ) : (
                    <ChevronRight className="size-4 shrink-0 text-gray-400" />
                  )}
                  <span className="font-medium text-navy-900">{item.question}</span>
                </button>

                {expanded && (
                  <p className="mt-2 pl-6 text-sm text-gray-600">{item.answer}</p>
                )}
              </>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Badge variant="secondary" className={CATEGORY_COLORS[item.category] ?? CATEGORY_COLORS.general}>
              {item.category}
            </Badge>
            {!isEditing && (
              <>
                <Button variant="ghost" size="icon" onClick={onEdit} aria-label="Edit">
                  <Pencil className="size-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={onDelete} aria-label="Delete">
                  <Trash2 className="size-4 text-red-500" />
                </Button>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
