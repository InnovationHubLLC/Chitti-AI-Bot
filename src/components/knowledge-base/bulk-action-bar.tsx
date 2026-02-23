"use client";

import { useState } from "react";
import { Trash2, Download, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";

interface BulkActionBarProps {
  selectedCount: number;
  onDelete: () => void;
  onExport: () => void;
  onDeactivate: () => void;
}

export function BulkActionBar({
  selectedCount,
  onDelete,
  onExport,
  onDeactivate,
}: BulkActionBarProps): React.ReactElement | null {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (selectedCount === 0) return null;

  return (
    <>
      <div className="flex items-center gap-3 rounded-lg border border-navy-200 bg-navy-50 px-4 py-2.5">
        <span className="text-sm font-medium text-navy-700">
          {selectedCount} item{selectedCount !== 1 ? "s" : ""} selected
        </span>
        <div className="ml-auto flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={onDeactivate}>
            <EyeOff className="mr-1.5 size-4" />
            Deactivate
          </Button>
          <Button variant="outline" size="sm" onClick={onExport}>
            <Download className="mr-1.5 size-4" />
            Export CSV
          </Button>
          <Button variant="destructive" size="sm" onClick={() => setShowDeleteConfirm(true)}>
            <Trash2 className="mr-1.5 size-4" />
            Delete
          </Button>
        </div>
      </div>

      <ConfirmDialog
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
        title="Delete selected items?"
        description={`This will permanently delete ${selectedCount} item${selectedCount !== 1 ? "s" : ""} from your knowledge base. This action cannot be undone.`}
        confirmLabel="Delete"
        variant="destructive"
        onConfirm={onDelete}
      />
    </>
  );
}
