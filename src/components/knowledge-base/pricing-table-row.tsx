"use client";

import { useState } from "react";
import { Pencil, Trash2, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { TableCell, TableRow } from "@/components/ui/table";
import type { PricingItem } from "@/lib/types/knowledge-base";

interface PricingTableRowProps {
  item: PricingItem;
  isEditing: boolean;
  isSelected: boolean;
  onEdit: () => void;
  onSave: (updated: PricingItem) => void;
  onCancel: () => void;
  onDelete: () => void;
  onToggleSelect: () => void;
}

const SOURCE_COLORS: Record<string, string> = {
  website: "bg-sky-500/15 text-sky-400 border-sky-500/30",
  template: "bg-violet-500/15 text-violet-400 border-violet-500/30",
  manual: "bg-gray-500/15 text-gray-400 border-gray-500/30",
};

export function PricingTableRow({
  item,
  isEditing,
  isSelected,
  onEdit,
  onSave,
  onCancel,
  onDelete,
  onToggleSelect,
}: PricingTableRowProps): React.ReactElement {
  const [draft, setDraft] = useState(item);

  const handleSave = (): void => {
    onSave(draft);
  };

  if (isEditing) {
    return (
      <TableRow className="bg-[#111f33]/50 border-[#1e3050] ring-1 ring-violet-500/50">
        <TableCell>
          <Checkbox checked={isSelected} onCheckedChange={onToggleSelect} />
        </TableCell>
        <TableCell>
          <Input
            value={draft.service}
            onChange={(e) => setDraft({ ...draft, service: e.target.value })}
            className="h-8 bg-[#080f1a] border-[#1e3050] text-white"
          />
        </TableCell>
        <TableCell>
          <Input
            type="number"
            value={draft.price}
            onChange={(e) => setDraft({ ...draft, price: Number(e.target.value) })}
            className="h-8 w-24 bg-[#080f1a] border-[#1e3050] text-white"
          />
        </TableCell>
        <TableCell>
          <Input
            value={draft.duration}
            onChange={(e) => setDraft({ ...draft, duration: e.target.value })}
            className="h-8 w-28 bg-[#080f1a] border-[#1e3050] text-white"
          />
        </TableCell>
        <TableCell>
          <Input
            value={draft.category}
            onChange={(e) => setDraft({ ...draft, category: e.target.value })}
            className="h-8 w-24 bg-[#080f1a] border-[#1e3050] text-white"
          />
        </TableCell>
        <TableCell>
          <Badge variant="secondary" className={SOURCE_COLORS[item.source]}>
            {item.source}
          </Badge>
        </TableCell>
        <TableCell>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" onClick={handleSave} aria-label="Save" className="hover:bg-[#111f33]">
              <Check className="size-4 text-emerald-400" />
            </Button>
            <Button variant="ghost" size="icon" onClick={onCancel} aria-label="Cancel" className="hover:bg-[#111f33]">
              <X className="size-4 text-[#6b8baf]" />
            </Button>
          </div>
        </TableCell>
      </TableRow>
    );
  }

  return (
    <TableRow className="border-[#1e3050] hover:bg-[#111f33]/50">
      <TableCell>
        <Checkbox checked={isSelected} onCheckedChange={onToggleSelect} />
      </TableCell>
      <TableCell className="font-medium text-[#c8daf0]">{item.service}</TableCell>
      <TableCell className="text-emerald-400 font-bold">${item.price.toLocaleString()}</TableCell>
      <TableCell className="text-[#8ba8c8]">{item.duration}</TableCell>
      <TableCell>
        <Badge variant="outline" className="capitalize text-[#8ba8c8] border-[#1e3050]">
          {item.category}
        </Badge>
      </TableCell>
      <TableCell>
        <Badge variant="secondary" className={SOURCE_COLORS[item.source]}>
          {item.source}
        </Badge>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" onClick={onEdit} aria-label="Edit" className="text-[#6b8baf] hover:text-white hover:bg-[#111f33]">
            <Pencil className="size-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={onDelete} aria-label="Delete" className="hover:bg-[#111f33]">
            <Trash2 className="size-4 text-red-400" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}
