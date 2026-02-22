import type { LeadStatus } from "@/lib/types/calls";

export interface Lead {
  id: string;
  call_id: string;
  caller_name: string | null;
  phone_number: string;
  service_requested: string | null;
  deal_intent_score: number;
  lead_score: string;
  price_comfort_low: number;
  price_comfort_high: number;
  status: LeadStatus;
  created_at: string;
}

const now = new Date();
const hoursAgo = (h: number) =>
  new Date(now.getTime() - h * 60 * 60 * 1000).toISOString();
const daysAgo = (d: number) =>
  new Date(now.getTime() - d * 24 * 60 * 60 * 1000).toISOString();

export const MOCK_LEADS: Lead[] = [
  {
    id: "lead-001",
    call_id: "call-007",
    caller_name: "Robert Kim",
    phone_number: "(512) 555-0178",
    service_requested: "Personal Injury Consultation",
    deal_intent_score: 10,
    lead_score: "HOT",
    price_comfort_low: 25000,
    price_comfort_high: 50000,
    status: "new",
    created_at: daysAgo(2),
  },
  {
    id: "lead-002",
    call_id: "call-001",
    caller_name: "Sarah Mitchell",
    phone_number: "(512) 555-0134",
    service_requested: "AC Unit Replacement",
    deal_intent_score: 9,
    lead_score: "HOT",
    price_comfort_low: 8000,
    price_comfort_high: 11000,
    status: "contacted",
    created_at: hoursAgo(2),
  },
  {
    id: "lead-003",
    call_id: "call-005",
    caller_name: "David Park",
    phone_number: "(512) 555-0167",
    service_requested: "Emergency Plumbing",
    deal_intent_score: 9,
    lead_score: "HOT",
    price_comfort_low: 500,
    price_comfort_high: 2000,
    status: "converted",
    created_at: daysAgo(1),
  },
  {
    id: "lead-004",
    call_id: "call-003",
    caller_name: "James Rodriguez",
    phone_number: "(512) 555-0156",
    service_requested: "Roof Leak Repair",
    deal_intent_score: 8,
    lead_score: "HOT",
    price_comfort_low: 3000,
    price_comfort_high: 8000,
    status: "new",
    created_at: hoursAgo(5),
  },
  {
    id: "lead-005",
    call_id: "call-009",
    caller_name: "Tom Wright",
    phone_number: "(512) 555-0190",
    service_requested: "Dental Crown",
    deal_intent_score: 7,
    lead_score: "WARM",
    price_comfort_low: 800,
    price_comfort_high: 1500,
    status: "contacted",
    created_at: daysAgo(3),
  },
  {
    id: "lead-006",
    call_id: "call-006",
    caller_name: "Lisa Thompson",
    phone_number: "(512) 555-0145",
    service_requested: "Termite Treatment",
    deal_intent_score: 6,
    lead_score: "WARM",
    price_comfort_low: 800,
    price_comfort_high: 1200,
    status: "new",
    created_at: daysAgo(1),
  },
  {
    id: "lead-007",
    call_id: "call-010",
    caller_name: "Karen Davis",
    phone_number: "(512) 555-0112",
    service_requested: "Carpenter Ant Removal",
    deal_intent_score: 5,
    lead_score: "WARM",
    price_comfort_low: 300,
    price_comfort_high: 600,
    status: "lost",
    created_at: daysAgo(3),
  },
  {
    id: "lead-008",
    call_id: "call-008",
    caller_name: "Amy Foster",
    phone_number: "(512) 555-0123",
    service_requested: "Annual HVAC Maintenance",
    deal_intent_score: 2,
    lead_score: "COLD",
    price_comfort_low: 200,
    price_comfort_high: 400,
    status: "contacted",
    created_at: daysAgo(2),
  },
];
