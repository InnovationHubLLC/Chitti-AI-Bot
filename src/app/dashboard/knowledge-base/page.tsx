"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { PricingItem, FaqItem } from "@/lib/types/knowledge-base";
import { MOCK_PRICING_ITEMS, MOCK_FAQ_ITEMS } from "@/lib/constants/mock-knowledge-base";
import { PricingTab } from "@/components/knowledge-base/pricing-tab";
import { FaqTab } from "@/components/knowledge-base/faq-tab";

export default function KnowledgeBasePage(): React.ReactElement {
  const [pricingItems, setPricingItems] = useState<PricingItem[]>(MOCK_PRICING_ITEMS);
  const [faqItems, setFaqItems] = useState<FaqItem[]>(MOCK_FAQ_ITEMS);

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
          <PricingTab items={pricingItems} onItemsChange={setPricingItems} />
        </TabsContent>

        <TabsContent value="faqs" className="mt-6">
          <FaqTab items={faqItems} onItemsChange={setFaqItems} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
