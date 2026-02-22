"use client";

import { useEffect } from "react";
import { UseFormReturn } from "react-hook-form";
import { Check, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useWebsiteScanner } from "@/hooks/use-website-scanner";
import { BusinessInfoFormData } from "@/lib/validations/business-info";

interface WebsiteScannerProps {
  form: UseFormReturn<BusinessInfoFormData>;
}

export function WebsiteScanner({ form }: WebsiteScannerProps) {
  const { status, servicesCount, faqsCount, error, scan } =
    useWebsiteScanner();
  const websiteUrl = form.watch("websiteUrl");

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (websiteUrl && websiteUrl.length > 0) {
        try {
          new URL(websiteUrl);
          scan(websiteUrl);
        } catch {
          // Invalid URL, don't scan
        }
      }
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [websiteUrl, scan]);

  return (
    <div className="space-y-2">
      <Input
        placeholder="https://yourbusiness.com"
        {...form.register("websiteUrl")}
      />
      {status === "scanning" && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Scanning your website...</span>
        </div>
      )}
      {status === "success" && servicesCount !== null && faqsCount !== null && (
        <div className="flex items-center gap-2 text-sm text-green-600">
          <Check className="h-4 w-4" />
          <span>
            Found {servicesCount} services and {faqsCount} FAQs — you&apos;ll review
            these next
          </span>
        </div>
      )}
      {status === "error" && error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}
