"use client";

import { useState, useEffect, useCallback } from "react";
import type { PricingItem, FaqItem } from "@/lib/types/knowledge-base";
import { PricingTab } from "@/components/knowledge-base/pricing-tab";
import { FaqTab } from "@/components/knowledge-base/faq-tab";
import { cn } from "@/lib/utils";

interface PricingRow {
  id: string;
  service_name: string;
  price_low: number;
  price_high: number;
  duration: string | null;
  category: string | null;
  is_active: boolean | null;
  conditions: string | null;
  created_at: string;
}

interface FaqRow {
  id: string;
  question: string;
  answer: string;
  source: "website" | "template" | "manual";
  category: string | null;
  is_active: boolean | null;
  created_at: string;
}

function getBusinessId(): string | null {
  const match = document.cookie.match(/(?:^|;\s*)onboarding_business_id=([^;]*)/);
  return match ? decodeURIComponent(match[1]) : null;
}

function mapPricing(row: PricingRow): PricingItem {
  return {
    id: row.id,
    service: row.service_name,
    price: row.price_low,
    duration: row.duration ?? "",
    category: row.category ?? "services",
    is_active: row.is_active ?? true,
    source: "manual",
    created_at: row.created_at,
  };
}

function mapFaq(row: FaqRow): FaqItem {
  return {
    id: row.id,
    question: row.question,
    answer: row.answer,
    category: row.category ?? "general",
    is_active: row.is_active ?? true,
    source: row.source,
    created_at: row.created_at,
  };
}

const TABS = [
  { value: "pricing", label: "Pricing Table" },
  { value: "faqs", label: "FAQs & Content" },
] as const;

type TabValue = (typeof TABS)[number]["value"];

export default function KnowledgeBasePage(): React.ReactElement {
  const [pricingItems, setPricingItems] = useState<PricingItem[]>([]);
  const [faqItems, setFaqItems] = useState<FaqItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabValue>("pricing");

  const fetchData = useCallback(async () => {
    const businessId = getBusinessId();
    if (!businessId) {
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`/api/dashboard/knowledge-base?businessId=${businessId}`);
      const json = await res.json();
      if (json.success && json.data) {
        setPricingItems((json.data.pricing ?? []).map(mapPricing));
        setFaqItems((json.data.faqs ?? []).map(mapFaq));
      }
    } catch (error) {
      console.error("Failed to fetch KB data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handlePricingChange = async (items: PricingItem[]) => {
    const businessId = getBusinessId();
    if (!businessId) return;

    const prev = pricingItems;
    setPricingItems(items);

    const added = items.find((item) => !prev.some((p) => p.id === item.id));
    if (added) {
      try {
        const res = await fetch("/api/dashboard/knowledge-base", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ businessId, type: "pricing", ...added }),
        });
        const json = await res.json();
        if (json.success && json.data) {
          setPricingItems((current) =>
            current.map((item) =>
              item.id === added.id ? mapPricing(json.data) : item
            )
          );
        }
      } catch (error) {
        console.error("Failed to create pricing item:", error);
        setPricingItems(prev);
      }
      return;
    }

    const deleted = prev.find((p) => !items.some((item) => item.id === p.id));
    if (deleted) {
      try {
        await fetch(
          `/api/dashboard/knowledge-base?id=${deleted.id}&businessId=${businessId}&type=pricing`,
          { method: "DELETE" }
        );
      } catch (error) {
        console.error("Failed to delete pricing item:", error);
        setPricingItems(prev);
      }
      return;
    }

    const updated = items.find((item) => {
      const original = prev.find((p) => p.id === item.id);
      return original && JSON.stringify(original) !== JSON.stringify(item);
    });
    if (updated) {
      try {
        await fetch("/api/dashboard/knowledge-base", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...updated, businessId, type: "pricing" }),
        });
      } catch (error) {
        console.error("Failed to update pricing item:", error);
        setPricingItems(prev);
      }
    }
  };

  const handleFaqChange = async (items: FaqItem[]) => {
    const businessId = getBusinessId();
    if (!businessId) return;

    const prev = faqItems;
    setFaqItems(items);

    const added = items.find((item) => !prev.some((p) => p.id === item.id));
    if (added) {
      try {
        const res = await fetch("/api/dashboard/knowledge-base", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ businessId, type: "faq", ...added }),
        });
        const json = await res.json();
        if (json.success && json.data) {
          setFaqItems((current) =>
            current.map((item) =>
              item.id === added.id ? mapFaq(json.data) : item
            )
          );
        }
      } catch (error) {
        console.error("Failed to create FAQ:", error);
        setFaqItems(prev);
      }
      return;
    }

    const deleted = prev.find((p) => !items.some((item) => item.id === p.id));
    if (deleted) {
      try {
        await fetch(
          `/api/dashboard/knowledge-base?id=${deleted.id}&businessId=${businessId}&type=faq`,
          { method: "DELETE" }
        );
      } catch (error) {
        console.error("Failed to delete FAQ:", error);
        setFaqItems(prev);
      }
      return;
    }

    const updated = items.find((item) => {
      const original = prev.find((p) => p.id === item.id);
      return original && JSON.stringify(original) !== JSON.stringify(item);
    });
    if (updated) {
      try {
        await fetch("/api/dashboard/knowledge-base", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...updated, businessId, type: "faq" }),
        });
      } catch (error) {
        console.error("Failed to update FAQ:", error);
        setFaqItems(prev);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Knowledge Base</h1>
        <p className="text-sm text-[#6b8baf]">
          Manage pricing and FAQs that Chitti uses during calls
        </p>
      </div>

      {/* Dark segment control tabs */}
      <div className="flex items-center gap-1 rounded-lg bg-[#0a1525] border border-[#1e3050] p-1 w-fit">
        {TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={cn(
              "rounded-md px-4 py-1.5 text-sm font-medium transition-colors",
              activeTab === tab.value
                ? "bg-[#1a2e4a] text-white border border-[#2a4268]"
                : "text-[#6b8baf] hover:text-white"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "pricing" && (
        <PricingTab items={pricingItems} onItemsChange={handlePricingChange} />
      )}
      {activeTab === "faqs" && (
        <FaqTab items={faqItems} onItemsChange={handleFaqChange} />
      )}
    </div>
  );
}
