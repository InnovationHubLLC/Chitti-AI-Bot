"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Trash2, Plus } from "lucide-react";
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

const mockPricing = [
  { id: "1", service: "General Consultation", low: 50, high: 150, conditions: "Depends on complexity" },
  { id: "2", service: "Emergency Service Call", low: 150, high: 300, conditions: "After-hours rate applies" },
  { id: "3", service: "Standard Service Package", low: 500, high: 1500, conditions: "Based on scope of work" },
  { id: "4", service: "Premium Service Package", low: 2000, high: 5000, conditions: "Includes warranty" },
  { id: "5", service: "Annual Maintenance Plan", low: 200, high: 400, conditions: "Billed monthly available" },
];

const mockFAQs = [
  { id: "1", title: "Business Hours", content: "Monday-Friday 8AM-6PM, Saturday 9AM-1PM, Closed Sunday", source: "website" },
  { id: "2", title: "Emergency Services", content: "We offer 24/7 emergency services. Call our main number anytime.", source: "template" },
  { id: "3", title: "Payment Methods", content: "We accept cash, credit cards, and financing options are available for larger projects.", source: "website" },
  { id: "4", title: "Service Area", content: "We serve the greater metro area within a 30-mile radius.", source: "template" },
  { id: "5", title: "Cancellation Policy", content: "24-hour notice required for appointment cancellations.", source: "template" },
];

export default function OnboardingStep2() {
  const router = useRouter();
  const [pricing, setPricing] = useState(mockPricing);
  const [faqs, setFaqs] = useState(mockFAQs);
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleBack = () => {
    router.push("/onboarding/step-1");
  };

  const handleContinue = () => {
    router.push("/onboarding/step-3");
  };

  const addPricing = () => {
    const newItem = {
      id: Date.now().toString(),
      service: "",
      low: 0,
      high: 0,
      conditions: "",
    };
    setPricing([...pricing, newItem]);
    setEditingId(newItem.id);
  };

  const addFAQ = () => {
    const newItem = {
      id: Date.now().toString(),
      title: "",
      content: "",
      source: "manual" as const,
    };
    setFaqs([...faqs, newItem]);
    setEditingId(newItem.id);
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
                      <TableRow key={item.id}>
                        <TableCell>
                          {editingId === item.id ? (
                            <Input defaultValue={item.service} className="h-8" />
                          ) : (
                            item.service || <span className="text-gray-400">New service</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {editingId === item.id ? (
                            <Input type="number" defaultValue={item.low} className="h-8" />
                          ) : (
                            `$${item.low}`
                          )}
                        </TableCell>
                        <TableCell>
                          {editingId === item.id ? (
                            <Input type="number" defaultValue={item.high} className="h-8" />
                          ) : (
                            `$${item.high}`
                          )}
                        </TableCell>
                        <TableCell>
                          {editingId === item.id ? (
                            <Input defaultValue={item.conditions} className="h-8" />
                          ) : (
                            <span className="text-sm text-gray-600">{item.conditions}</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setEditingId(editingId === item.id ? null : item.id)}
                            >
                              <Pencil className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setPricing(pricing.filter((p) => p.id !== item.id))}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <Button onClick={addPricing} variant="outline" className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Add Service
              </Button>
            </TabsContent>

            <TabsContent value="faqs" className="space-y-4">
              {faqs.map((faq) => (
                <Card key={faq.id}>
                  <CardContent className="pt-6">
                    {editingId === faq.id ? (
                      <div className="space-y-4">
                        <div>
                          <Label>Title</Label>
                          <Input defaultValue={faq.title} />
                        </div>
                        <div>
                          <Label>Content</Label>
                          <Textarea defaultValue={faq.content} rows={4} />
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" onClick={() => setEditingId(null)}>
                            Save
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => setEditingId(null)}>
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
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setEditingId(faq.id)}
                            >
                              <Pencil className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setFaqs(faqs.filter((f) => f.id !== faq.id))}
                            >
                              <Trash2 className="w-4 h-4" />
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
                <Plus className="w-4 h-4 mr-2" />
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
