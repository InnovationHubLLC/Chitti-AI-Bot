"use client";

import { useState, useMemo } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { FaqItem, KbCategory } from "@/lib/types/knowledge-base";
import { cn } from "@/lib/utils";
import { SearchBar } from "./search-bar";
import { BulkActionBar } from "./bulk-action-bar";
import { FaqCard } from "./faq-card";
import { EmptyState } from "./empty-state";

interface FaqTabProps {
  items: FaqItem[];
  onItemsChange: (items: FaqItem[]) => void;
}

const CATEGORIES: { value: KbCategory; label: string }[] = [
  { value: "all", label: "All" },
  { value: "general", label: "General" },
  { value: "pricing", label: "Pricing" },
  { value: "services", label: "Services" },
  { value: "insurance", label: "Insurance" },
  { value: "scheduling", label: "Scheduling" },
  { value: "emergency", label: "Emergency" },
];

export function FaqTab({ items, onItemsChange }: FaqTabProps): React.ReactElement {
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState<KbCategory>("all");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const filtered = useMemo(() => {
    let result = items;

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (item) =>
          item.question.toLowerCase().includes(q) ||
          item.answer.toLowerCase().includes(q)
      );
    }

    if (category !== "all") {
      result = result.filter((item) => item.category === category);
    }

    return result;
  }, [items, searchQuery, category]);

  const toggleSelect = (id: string): void => {
    const next = new Set(selectedIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setSelectedIds(next);
  };

  const handleSave = (updated: FaqItem): void => {
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

    const headers = "Question,Answer,Category,Status,Source\n";
    const rows = exportItems
      .map((i) => `"${i.question}","${i.answer}","${i.category}",${i.is_active ? "Active" : "Inactive"},"${i.source}"`)
      .join("\n");

    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "faqs.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const addItem = (): void => {
    const newItem: FaqItem = {
      id: Date.now().toString(),
      question: "",
      answer: "",
      category: "general",
      is_active: true,
      source: "manual",
      created_at: new Date().toISOString(),
    };
    onItemsChange([...items, newItem]);
    setEditingId(newItem.id);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex-1 max-w-sm">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search FAQs..."
          />
        </div>
        <Button onClick={addItem} size="sm" className="bg-accent-500 hover:bg-accent-600 text-white">
          <Plus className="mr-1.5 size-4" />
          Add FAQ
        </Button>
      </div>

      {/* Category pills */}
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.value}
            onClick={() => setCategory(cat.value)}
            className={cn(
              "rounded-full px-3 py-1 text-xs font-medium transition-colors border",
              category === cat.value
                ? "bg-violet-500/15 text-violet-400 border-violet-500/30"
                : "bg-[#0d1726] text-[#4a6585] border-[#1e3050] hover:border-[#2a4268]"
            )}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <BulkActionBar
        selectedCount={selectedIds.size}
        onDelete={handleBulkDelete}
        onExport={handleExportCsv}
        onDeactivate={handleBulkDeactivate}
      />

      {filtered.length === 0 ? (
        <EmptyState message="No FAQs found" />
      ) : (
        <div className="space-y-3">
          {filtered.map((item) => (
            <FaqCard
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
        </div>
      )}
    </div>
  );
}
