"use client";

import { useState, useEffect, useCallback } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { PricingItem, FaqItem } from "@/lib/types/knowledge-base";
import { PricingTab } from "@/components/knowledge-base/pricing-tab";
import { FaqTab } from "@/components/knowledge-base/faq-tab";

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

export default function KnowledgeBasePage(): React.ReactElement {
  const [pricingItems, setPricingItems] = useState<PricingItem[]>([]);
  const [faqItems, setFaqItems] = useState<FaqItem[]>([]);
  const [loading, setLoading] = useState(true);

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

    // Detect added item (new item not in prev)
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

    // Detect deleted item
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

    // Detect updated item
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

    // Detect added
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

    // Detect deleted
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

    // Detect updated
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
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-navy-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-navy-900">Knowledge Base</h1>
        <p className="text-sm text-gray-500">
          Manage pricing and FAQs that Chitti uses during calls
        </p>
      </div>

      <Tabs defaultValue="pricing">
        <TabsList>
          <TabsTrigger value="pricing">Pricing Table</TabsTrigger>
          <TabsTrigger value="faqs">FAQs & Content</TabsTrigger>
        </TabsList>

        <TabsContent value="pricing" className="mt-6">
          <PricingTab items={pricingItems} onItemsChange={handlePricingChange} />
        </TabsContent>

        <TabsContent value="faqs" className="mt-6">
          <FaqTab items={faqItems} onItemsChange={handleFaqChange} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
