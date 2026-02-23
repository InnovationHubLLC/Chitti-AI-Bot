"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Trash2, Plus, Check, X } from "lucide-react";
import { ProgressBar } from "@/components/onboarding/progress-bar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface PricingRow {
  id: string;
  service: string;
  low: number;
  high: number;
  conditions: string;
}

interface FaqRow {
  id: string;
  title: string;
  content: string;
  source: "website" | "template" | "manual";
}

const INITIAL_PRICING: PricingRow[] = [
  { id: "1", service: "General Consultation", low: 50, high: 150, conditions: "Depends on complexity" },
  { id: "2", service: "Emergency Service Call", low: 150, high: 300, conditions: "After-hours rate applies" },
  { id: "3", service: "Standard Service Package", low: 500, high: 1500, conditions: "Based on scope of work" },
  { id: "4", service: "Premium Service Package", low: 2000, high: 5000, conditions: "Includes warranty" },
  { id: "5", service: "Annual Maintenance Plan", low: 200, high: 400, conditions: "Billed monthly available" },
];

const INITIAL_FAQS: FaqRow[] = [
  { id: "1", title: "Business Hours", content: "Monday-Friday 8AM-6PM, Saturday 9AM-1PM, Closed Sunday", source: "website" },
  { id: "2", title: "Emergency Services", content: "We offer 24/7 emergency services. Call our main number anytime.", source: "template" },
  { id: "3", title: "Payment Methods", content: "We accept cash, credit cards, and financing options are available for larger projects.", source: "website" },
  { id: "4", title: "Service Area", content: "We serve the greater metro area within a 30-mile radius.", source: "template" },
  { id: "5", title: "Cancellation Policy", content: "24-hour notice required for appointment cancellations.", source: "template" },
];

function validatePricingRow(row: PricingRow): string | null {
  if (!row.service.trim()) return "Service name is required";
  if (row.low < 0 || row.high < 0) return "Prices must be non-negative";
  if (row.low > row.high) return "Low price must not exceed high price";
  return null;
}

export default function OnboardingStep2(): React.ReactElement {
  const router = useRouter();
  const [pricing, setPricing] = useState<PricingRow[]>(INITIAL_PRICING);
  const [faqs, setFaqs] = useState<FaqRow[]>(INITIAL_FAQS);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<PricingRow | null>(null);
  const [faqDraft, setFaqDraft] = useState<FaqRow | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleBack = (): void => {
    router.push("/onboarding/step-1");
  };

  const handleContinue = (): void => {
    router.push("/onboarding/step-3");
  };

  const startEditPricing = (item: PricingRow): void => {
    setEditingId(item.id);
    setDraft({ ...item });
    setValidationError(null);
  };

  const savePricing = (): void => {
    if (!draft) return;
    const error = validatePricingRow(draft);
    if (error) {
      setValidationError(error);
      return;
    }
    setPricing(pricing.map((p) => (p.id === draft.id ? draft : p)));
    setEditingId(null);
    setDraft(null);
    setValidationError(null);
  };

  const cancelEdit = (): void => {
    // If it was a new empty item, remove it
    if (draft && !draft.service.trim() && pricing.find((p) => p.id === draft.id && !p.service.trim())) {
      setPricing(pricing.filter((p) => p.id !== draft.id));
    }
    setEditingId(null);
    setDraft(null);
    setFaqDraft(null);
    setValidationError(null);
  };

  const addPricing = (): void => {
    const newItem: PricingRow = {
      id: Date.now().toString(),
      service: "",
      low: 0,
      high: 0,
      conditions: "",
    };
    setPricing([...pricing, newItem]);
    startEditPricing(newItem);
  };

  const startEditFaq = (item: FaqRow): void => {
    setEditingId(item.id);
    setFaqDraft({ ...item });
  };

  const saveFaq = (): void => {
    if (!faqDraft) return;
    if (!faqDraft.title.trim()) return;
    setFaqs(faqs.map((f) => (f.id === faqDraft.id ? faqDraft : f)));
    setEditingId(null);
    setFaqDraft(null);
  };

  const addFAQ = (): void => {
    const newItem: FaqRow = {
      id: Date.now().toString(),
      title: "",
      content: "",
      source: "manual",
    };
    setFaqs([...faqs, newItem]);
    startEditFaq(newItem);
  };

  return (
    <>
      <ProgressBar currentStep={2} />

      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">We pulled this from your website — review and correct</CardTitle>
          <CardDescription>
            Chitti uses this to answer caller questions accurately. The more complete this is, the better your AI assistant performs.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Tabs defaultValue="pricing" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="pricing">Pricing Table</TabsTrigger>
              <TabsTrigger value="faqs">FAQs & Content</TabsTrigger>
            </TabsList>

            <TabsContent value="pricing" className="space-y-4">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Service Name</TableHead>
                      <TableHead className="w-[120px]">Price Low</TableHead>
                      <TableHead className="w-[120px]">Price High</TableHead>
                      <TableHead>Conditions/Notes</TableHead>
                      <TableHead className="w-[100px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pricing.map((item) => (
                      <TableRow key={item.id} className={editingId === item.id ? "bg-blue-50/50" : ""}>
                        <TableCell>
                          {editingId === item.id && draft ? (
                            <Input
                              value={draft.service}
                              onChange={(e) => setDraft({ ...draft, service: e.target.value })}
                              className="h-8"
                              placeholder="Service name"
                            />
                          ) : (
                            item.service || <span className="text-gray-400">New service</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {editingId === item.id && draft ? (
                            <Input
                              type="number"
                              value={draft.low}
                              onChange={(e) => setDraft({ ...draft, low: Number(e.target.value) })}
                              className="h-8"
                              min={0}
                            />
                          ) : (
                            `$${item.low}`
                          )}
                        </TableCell>
                        <TableCell>
                          {editingId === item.id && draft ? (
                            <Input
                              type="number"
                              value={draft.high}
                              onChange={(e) => setDraft({ ...draft, high: Number(e.target.value) })}
                              className="h-8"
                              min={0}
                            />
                          ) : (
                            `$${item.high}`
                          )}
                        </TableCell>
                        <TableCell>
                          {editingId === item.id && draft ? (
                            <Input
                              value={draft.conditions}
                              onChange={(e) => setDraft({ ...draft, conditions: e.target.value })}
                              className="h-8"
                              placeholder="Notes"
                            />
                          ) : (
                            <span className="text-sm text-gray-600">{item.conditions}</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {editingId === item.id ? (
                            <div className="flex items-center gap-1">
                              <Button variant="ghost" size="sm" onClick={savePricing}>
                                <Check className="size-4 text-green-600" />
                              </Button>
                              <Button variant="ghost" size="sm" onClick={cancelEdit}>
                                <X className="size-4 text-gray-500" />
                              </Button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1">
                              <Button variant="ghost" size="sm" onClick={() => startEditPricing(item)}>
                                <Pencil className="size-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setPricing(pricing.filter((p) => p.id !== item.id))}
                              >
                                <Trash2 className="size-4" />
                              </Button>
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {validationError && (
                <p className="text-sm text-red-600">{validationError}</p>
              )}

              <Button onClick={addPricing} variant="outline" className="w-full">
                <Plus className="size-4 mr-2" />
                Add Service
              </Button>
            </TabsContent>

            <TabsContent value="faqs" className="space-y-4">
              {faqs.map((faq) => (
                <Card key={faq.id}>
                  <CardContent className="pt-6">
                    {editingId === faq.id && faqDraft ? (
                      <div className="space-y-4">
                        <div>
                          <Label>Title</Label>
                          <Input
                            value={faqDraft.title}
                            onChange={(e) => setFaqDraft({ ...faqDraft, title: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label>Content</Label>
                          <Textarea
                            value={faqDraft.content}
                            onChange={(e) => setFaqDraft({ ...faqDraft, content: e.target.value })}
                            rows={4}
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" onClick={saveFaq}>
                            <Check className="size-4 mr-1.5" />
                            Save
                          </Button>
                          <Button size="sm" variant="outline" onClick={cancelEdit}>
                            <X className="size-4 mr-1.5" />
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-semibold">{faq.title || "Untitled"}</h4>
                          <div className="flex items-center gap-2">
                            <Badge variant={faq.source === "website" ? "default" : faq.source === "template" ? "secondary" : "outline"}>
                              {faq.source === "website" ? "From website" : faq.source === "template" ? "From template" : "Manual"}
                            </Badge>
                            <Button variant="ghost" size="sm" onClick={() => startEditFaq(faq)}>
                              <Pencil className="size-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setFaqs(faqs.filter((f) => f.id !== faq.id))}
                            >
                              <Trash2 className="size-4" />
                            </Button>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600">{faq.content}</p>
                      </>
                    )}
                  </CardContent>
                </Card>
              ))}

              <Button onClick={addFAQ} variant="outline" className="w-full">
                <Plus className="size-4 mr-2" />
                Add New
              </Button>
            </TabsContent>
          </Tabs>

          <div className="flex justify-between pt-6 mt-6 border-t">
            <Button variant="outline" onClick={handleBack}>
              Back
            </Button>
            <Button onClick={handleContinue}>Continue</Button>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
