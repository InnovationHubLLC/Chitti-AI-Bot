import { z } from "zod";
import { INDUSTRIES } from "@/lib/constants/industries";
import { US_STATES } from "@/lib/constants/us-states";

const industryValues = INDUSTRIES.map((i) => i.value) as [string, ...string[]];
const stateValues = US_STATES.map((s) => s.value) as [string, ...string[]];

export const businessInfoSchema = z
  .object({
    businessName: z
      .string()
      .min(2, "Business name must be at least 2 characters")
      .max(255, "Business name must be less than 255 characters"),

    industry: z.enum(industryValues, {
      message: "Please select an industry",
    }),

    customIndustry: z.string().max(255).optional(),

    websiteUrl: z
      .string()
      .url("Please enter a valid URL")
      .optional()
      .or(z.literal("")),

    phoneNumber: z
      .string()
      .min(10, "Please enter a valid phone number")
      .regex(
        /^[\d\s\-\(\)\+]+$/,
        "Phone number can only contain digits, spaces, dashes, and parentheses"
      ),

    businessState: z.enum(stateValues, {
      message: "Please select your business state",
    }),

    ownerName: z
      .string()
      .min(2, "Name must be at least 2 characters")
      .max(255, "Name must be less than 255 characters"),
  })
  .refine(
    (data) => {
      if (data.industry === "other") {
        return data.customIndustry && data.customIndustry.length >= 2;
      }
      return true;
    },
    {
      message: "Please specify your industry",
      path: ["customIndustry"],
    }
  );

export type BusinessInfoFormData = z.infer<typeof businessInfoSchema>;
