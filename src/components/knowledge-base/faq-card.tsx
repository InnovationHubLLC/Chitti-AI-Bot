"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight, Pencil, Trash2, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  general: "bg-gray-500/15 text-gray-400 border-gray-500/30",
  pricing: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  services: "bg-sky-500/15 text-sky-400 border-sky-500/30",
  insurance: "bg-violet-500/15 text-violet-400 border-violet-500/30",
  scheduling: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  emergency: "bg-red-500/15 text-red-400 border-red-500/30",
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
    <div className={cn(
      "card-glass p-4",
      isEditing && "ring-1 ring-violet-500/50"
    )}>
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
                className="bg-[#080f1a] border-[#1e3050] text-white placeholder:text-[#4a6585]"
              />
              <Textarea
                value={draft.answer}
                onChange={(e) => setDraft({ ...draft, answer: e.target.value })}
                placeholder="Answer"
                rows={3}
                className="bg-[#080f1a] border-[#1e3050] text-white placeholder:text-[#4a6585]"
              />
              <div className="flex items-center gap-2">
                <Button size="sm" onClick={handleSave} className="bg-accent-500 hover:bg-accent-600 text-white">
                  <Check className="mr-1.5 size-4" />
                  Save
                </Button>
                <Button variant="outline" size="sm" onClick={onCancel} className="border-[#1e3050] text-[#8ba8c8] hover:bg-[#111f33]">
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
                <div className="w-6 h-6 rounded-md bg-[#111f33] flex items-center justify-center shrink-0 transition-transform">
                  {expanded ? (
                    <ChevronDown className="size-4 text-[#6b8baf]" />
                  ) : (
                    <ChevronRight className="size-4 text-[#6b8baf]" />
                  )}
                </div>
                <span className="font-medium text-[#c8daf0]">{item.question}</span>
              </button>

              {expanded && (
                <p className="mt-2 pl-8 text-sm text-[#6b8baf]">{item.answer}</p>
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
              <Button variant="ghost" size="icon" onClick={onEdit} aria-label="Edit" className="text-[#6b8baf] hover:text-white hover:bg-[#111f33]">
                <Pencil className="size-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={onDelete} aria-label="Delete" className="hover:bg-[#111f33]">
                <Trash2 className="size-4 text-red-400" />
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
