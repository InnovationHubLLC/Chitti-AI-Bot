"use client";

import { useState, useMemo } from "react";
import { Plus, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { PricingItem, KbSortField, KbSortDirection } from "@/lib/types/knowledge-base";
import { SearchBar } from "./search-bar";
import { BulkActionBar } from "./bulk-action-bar";
import { PricingTableRow } from "./pricing-table-row";
import { EmptyState } from "./empty-state";

interface PricingTabProps {
  items: PricingItem[];
  onItemsChange: (items: PricingItem[]) => void;
}

export function PricingTab({ items, onItemsChange }: PricingTabProps): React.ReactElement {
  const [searchQuery, setSearchQuery] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [sortField, setSortField] = useState<KbSortField>("service");
  const [sortDirection, setSortDirection] = useState<KbSortDirection>("asc");

  const filtered = useMemo(() => {
    let result = items;

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (item) =>
          item.service.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q)
      );
    }

    result = [...result].sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      const cmp = typeof aVal === "string" ? aVal.localeCompare(bVal as string) : (aVal as number) - (bVal as number);
      return sortDirection === "asc" ? cmp : -cmp;
    });

    return result;
  }, [items, searchQuery, sortField, sortDirection]);

  const toggleSort = (field: KbSortField): void => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const toggleSelect = (id: string): void => {
    const next = new Set(selectedIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setSelectedIds(next);
  };

  const handleSave = (updated: PricingItem): void => {
    onItemsChange(items.map((i) => (i.id === updated.id ? updated : i)));
    setEditingId(null);
  };

  const handleDelete = (id: string): void => {
    onItemsChange(items.filter((i) => i.id !== id));
    selectedIds.delete(id);
    setSelectedIds(new Set(selectedIds));
  };

  const handleBulkDelete = (): void => {
    onItemsChange(items.filter((i) => !selectedIds.has(i.id)));
    setSelectedIds(new Set());
  };

  const handleBulkDeactivate = (): void => {
    onItemsChange(
      items.map((i) => (selectedIds.has(i.id) ? { ...i, is_active: false } : i))
    );
    setSelectedIds(new Set());
  };

  const handleExportCsv = (): void => {
    const exportItems = selectedIds.size > 0
      ? items.filter((i) => selectedIds.has(i.id))
      : items;

    const headers = "Service,Price,Duration,Category,Status,Source\n";
    const rows = exportItems
      .map((i) => `"${i.service}",${i.price},"${i.duration}","${i.category}",${i.is_active ? "Active" : "Inactive"},"${i.source}"`)
      .join("\n");

    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "pricing.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const addItem = (): void => {
    const newItem: PricingItem = {
      id: Date.now().toString(),
      service: "",
      price: 0,
      duration: "",
      category: "services",
      is_active: true,
      source: "manual",
      created_at: new Date().toISOString(),
    };
    onItemsChange([...items, newItem]);
    setEditingId(newItem.id);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="flex-1 max-w-sm">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search services..."
          />
        </div>
        <Button onClick={addItem} size="sm">
          <Plus className="mr-1.5 size-4" />
          Add Service
        </Button>
      </div>

      <BulkActionBar
        selectedCount={selectedIds.size}
        onDelete={handleBulkDelete}
        onExport={handleExportCsv}
        onDeactivate={handleBulkDeactivate}
      />

      {filtered.length === 0 ? (
        <EmptyState message="No pricing items found" />
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-10" />
                <TableHead>
                  <button onClick={() => toggleSort("service")} className="flex items-center gap-1">
                    Service <ArrowUpDown className="size-3" />
                  </button>
                </TableHead>
                <TableHead>
                  <button onClick={() => toggleSort("price")} className="flex items-center gap-1">
                    Price <ArrowUpDown className="size-3" />
                  </button>
                </TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>
                  <button onClick={() => toggleSort("category")} className="flex items-center gap-1">
                    Category <ArrowUpDown className="size-3" />
                  </button>
                </TableHead>
                <TableHead>Source</TableHead>
                <TableHead className="w-24">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((item) => (
                <PricingTableRow
                  key={item.id}
                  item={item}
                  isEditing={editingId === item.id}
                  isSelected={selectedIds.has(item.id)}
                  onEdit={() => setEditingId(item.id)}
                  onSave={handleSave}
                  onCancel={() => setEditingId(null)}
                  onDelete={() => handleDelete(item.id)}
                  onToggleSelect={() => toggleSelect(item.id)}
                />
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
