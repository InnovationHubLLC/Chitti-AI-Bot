export const INDUSTRIES = [
  { value: "dental_practice", label: "Dental Practice" },
  { value: "hvac_air_conditioning", label: "HVAC & Air Conditioning" },
  { value: "pest_control", label: "Pest Control" },
  { value: "plumbing", label: "Plumbing" },
  { value: "roofing", label: "Roofing" },
  { value: "legal_law_firm", label: "Legal / Law Firm" },
  { value: "real_estate", label: "Real Estate" },
  { value: "auto_repair", label: "Auto Repair" },
  { value: "other", label: "Other (specify)" },
] as const;

export type IndustryValue = typeof INDUSTRIES[number]["value"];
