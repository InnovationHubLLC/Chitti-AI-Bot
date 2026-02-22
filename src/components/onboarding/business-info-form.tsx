"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  businessInfoSchema,
  type BusinessInfoFormData,
} from "@/lib/validations/business-info";
import { INDUSTRIES } from "@/lib/constants/industries";
import { US_STATES } from "@/lib/constants/us-states";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { WebsiteScanner } from "./website-scanner";
import { Loader2 } from "lucide-react";

export function BusinessInfoForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<BusinessInfoFormData>({
    resolver: zodResolver(businessInfoSchema),
    mode: "onChange",
    defaultValues: {
      businessName: "",
      industry: undefined,
      customIndustry: "",
      websiteUrl: "",
      phoneNumber: "",
      businessState: undefined,
      ownerName: "",
    },
  });

  const selectedIndustry = form.watch("industry");
  const showCustomIndustry = selectedIndustry === "other";

  const onSubmit = async (data: BusinessInfoFormData) => {
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/onboarding/business", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to save business information");
      }

      const result = await response.json();

      if (result.success) {
        router.push(result.nextStep);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      form.setError("root", {
        message: "Failed to save business information. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="businessName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Business Name</FormLabel>
              <FormControl>
                <Input placeholder="Acme Dental Practice" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="industry"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Industry</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your industry" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {INDUSTRIES.map((industry) => (
                    <SelectItem key={industry.value} value={industry.value}>
                      {industry.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {showCustomIndustry && (
          <FormField
            control={form.control}
            name="customIndustry"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Specify Your Industry</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Dog Grooming" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="websiteUrl"
          render={() => (
            <FormItem>
              <FormLabel>Website URL (Optional)</FormLabel>
              <FormControl>
                <WebsiteScanner form={form} />
              </FormControl>
              <FormDescription>
                We&apos;ll pull your services and pricing automatically
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phoneNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Your Phone Number</FormLabel>
              <FormControl>
                <Input placeholder="(555) 123-4567" {...field} />
              </FormControl>
              <FormDescription>
                We&apos;ll forward calls to you if the AI needs to escalate
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="businessState"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Business State</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your state" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {US_STATES.map((state) => (
                    <SelectItem key={state.value} value={state.value}>
                      {state.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                Used to configure call recording consent requirements
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="ownerName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Your Name</FormLabel>
              <FormControl>
                <Input placeholder="John Smith" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {form.formState.errors.root && (
          <p className="text-sm text-red-600">
            {form.formState.errors.root.message}
          </p>
        )}

        <div className="flex justify-end pt-4">
          <Button
            type="submit"
            size="lg"
            disabled={!form.formState.isValid || isSubmitting}
            className="w-full sm:w-auto"
          >
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Continue
          </Button>
        </div>
      </form>
    </Form>
  );
}
