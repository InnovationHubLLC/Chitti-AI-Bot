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
  website: "bg-blue-100 text-blue-700",
  template: "bg-purple-100 text-purple-700",
  manual: "bg-gray-100 text-gray-700",
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
      <TableRow className="bg-blue-50/50">
        <TableCell>
          <Checkbox checked={isSelected} onCheckedChange={onToggleSelect} />
        </TableCell>
        <TableCell>
          <Input
            value={draft.service}
            onChange={(e) => setDraft({ ...draft, service: e.target.value })}
            className="h-8"
          />
        </TableCell>
        <TableCell>
          <Input
            type="number"
            value={draft.price}
            onChange={(e) => setDraft({ ...draft, price: Number(e.target.value) })}
            className="h-8 w-24"
          />
        </TableCell>
        <TableCell>
          <Input
            value={draft.duration}
            onChange={(e) => setDraft({ ...draft, duration: e.target.value })}
            className="h-8 w-28"
          />
        </TableCell>
        <TableCell>
          <Input
            value={draft.category}
            onChange={(e) => setDraft({ ...draft, category: e.target.value })}
            className="h-8 w-24"
          />
        </TableCell>
        <TableCell>
          <Badge variant="secondary" className={SOURCE_COLORS[item.source]}>
            {item.source}
          </Badge>
        </TableCell>
        <TableCell>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" onClick={handleSave} aria-label="Save">
              <Check className="size-4 text-green-600" />
            </Button>
            <Button variant="ghost" size="icon" onClick={onCancel} aria-label="Cancel">
              <X className="size-4 text-gray-500" />
            </Button>
          </div>
        </TableCell>
      </TableRow>
    );
  }

  return (
    <TableRow>
      <TableCell>
        <Checkbox checked={isSelected} onCheckedChange={onToggleSelect} />
      </TableCell>
      <TableCell className="font-medium">{item.service}</TableCell>
      <TableCell>${item.price.toLocaleString()}</TableCell>
      <TableCell>{item.duration}</TableCell>
      <TableCell>
        <Badge variant="outline" className="capitalize">
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
          <Button variant="ghost" size="icon" onClick={onEdit} aria-label="Edit">
            <Pencil className="size-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={onDelete} aria-label="Delete">
            <Trash2 className="size-4 text-red-500" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}
