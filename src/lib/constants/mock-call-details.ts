import type { CallDetail } from "@/lib/types/calls";

const now = new Date();
const hoursAgo = (h: number) =>
  new Date(now.getTime() - h * 60 * 60 * 1000).toISOString();
const daysAgo = (d: number) =>
  new Date(now.getTime() - d * 24 * 60 * 60 * 1000).toISOString();

export const MOCK_CALL_DETAILS: Record<string, CallDetail> = {
  "call-001": {
    id: "call-001",
    business_id: null,
    caller_name: "Sarah Mitchell",
    phone_number: "(512) 555-0134",
    service_requested: "AC Unit Replacement",
    duration: 263,
    lead_score: "HOT",
    deal_intent_score: 9,
    confidence_level: "HIGH",
    price_comfort_low: 8000,
    price_comfort_high: 9500,
    price_stretch_ceiling: 11000,
    recommendation:
      "Sarah is looking for a full AC replacement for her 2,200 sqft home. She's gotten one other quote at $8,500 but wasn't happy with that contractor's timeline. She can stretch to $10,000-$11,000 if you offer faster scheduling. Lead with availability, not price.",
    status: "new",
    is_read: false,
    created_at: hoursAgo(2),
    qualification_details: [
      { label: "Service Requested", value: "AC Unit Replacement" },
      { label: "Home Square Footage", value: "2,200 sqft" },
      { label: "Current System Age", value: "18 years" },
      { label: "Timeline", value: "Within 2 weeks" },
      { label: "Decision Maker", value: "Yes — homeowner" },
      { label: "Other Quotes", value: "One at $8,500 from CoolAir Co" },
      { label: "Emergency", value: "No — system running but inefficient" },
    ],
    budget_signals: [
      "Mentioned a previous quote of $8,500 without flinching",
      "Asked about financing options (suggests willingness to spend more)",
      "Prioritized timeline over price twice",
    ],
    stretch_indicators: [
      'Said "I want it done right" — quality-over-price signal',
      "Asked about premium brands / higher efficiency units",
      "Didn't push back when AI mentioned $9,000-$10,000 range",
    ],
    transcript: [
      {
        role: "ai",
        content:
          "Hi, thank you for calling Austin Air Pros! My name is Chitti, how can I help you today?",
        timestamp: "0:00",
      },
      {
        role: "caller",
        content:
          "Hi, yeah I'm looking to get my AC unit replaced. It's pretty old and not cooling the house well anymore.",
        timestamp: "0:08",
      },
      {
        role: "ai",
        content:
          "I'd be happy to help with that! To give you the best recommendation, can you tell me about how big your home is?",
        timestamp: "0:18",
      },
      {
        role: "caller",
        content:
          "It's about 2,200 square feet. Two story. The unit is 18 years old — the repair guy said it's not worth fixing anymore.",
        timestamp: "0:25",
      },
      {
        role: "ai",
        content:
          "That makes sense — 18 years is definitely past the typical lifespan. Have you gotten any other quotes so far?",
        timestamp: "0:38",
      },
      {
        role: "caller",
        content:
          "Yeah, I got one from CoolAir Co for $8,500. But they said they couldn't get to it for like 3 weeks and I really want it done sooner. It's already getting hot.",
        timestamp: "0:46",
      },
      {
        role: "ai",
        content:
          "I understand — waiting weeks in this heat isn't ideal. We pride ourselves on fast scheduling. What timeline were you hoping for?",
        timestamp: "1:02",
      },
      {
        role: "caller",
        content:
          "Ideally within 2 weeks. I want it done right though — I don't want the cheapest option. Do you carry any of the higher efficiency models?",
        timestamp: "1:12",
      },
      {
        role: "ai",
        content:
          "Absolutely! We install Trane and Carrier systems, including their high-efficiency models that can save 30-40% on energy bills. For a 2,200 sqft home, you're typically looking at the $9,000 to $10,000 range depending on the model.",
        timestamp: "1:25",
      },
      {
        role: "caller",
        content:
          "That sounds reasonable. Do you offer any kind of financing? I could pay cash but financing would be nice.",
        timestamp: "1:45",
      },
      {
        role: "ai",
        content:
          "Yes, we do! We offer 0% financing for up to 18 months with approved credit. Would you like to schedule a free in-home estimate?",
        timestamp: "1:55",
      },
      {
        role: "caller",
        content:
          "Yes, that would be great. Can someone come out this week?",
        timestamp: "2:08",
      },
      {
        role: "ai",
        content:
          "Let me check our availability. It looks like we have openings on Wednesday and Thursday. Which works better for you?",
        timestamp: "2:15",
      },
      {
        role: "caller",
        content: "Thursday afternoon would be perfect.",
        timestamp: "2:25",
      },
      {
        role: "ai",
        content:
          "Wonderful! I'll have our team reach out to confirm Thursday afternoon. Can I get your name for the appointment?",
        timestamp: "2:30",
      },
      {
        role: "caller",
        content: "Sarah Mitchell.",
        timestamp: "2:40",
      },
      {
        role: "ai",
        content:
          "Thank you, Sarah! We'll confirm the appointment shortly. Is there anything else I can help with?",
        timestamp: "2:45",
      },
      {
        role: "caller",
        content: "No, that's it. Thanks!",
        timestamp: "2:52",
      },
    ],
  },
  "call-002": {
    id: "call-002",
    business_id: null,
    caller_name: null,
    phone_number: "(512) 555-0189",
    service_requested: "Pest Inspection",
    duration: 105,
    lead_score: "WARM",
    deal_intent_score: 5,
    confidence_level: "MEDIUM",
    price_comfort_low: 100,
    price_comfort_high: 250,
    price_stretch_ceiling: 350,
    recommendation:
      "Caller is shopping around for pest inspection services. They mentioned seeing some bugs but weren't sure of the type. Send pricing info via text and follow up in 2 days.",
    status: "new",
    is_read: false,
    created_at: hoursAgo(3),
    qualification_details: [
      { label: "Service Requested", value: "Pest Inspection" },
      { label: "Property Type", value: "Single-family home" },
      { label: "Issue Severity", value: "Low — occasional sightings" },
      { label: "Timeline", value: "No rush" },
      { label: "Decision Maker", value: "Unclear — renter" },
    ],
    budget_signals: [
      "Asked about prices first before describing the problem",
      "Mentioned looking at a couple of companies",
    ],
    stretch_indicators: [],
    transcript: [
      {
        role: "ai",
        content: "Thank you for calling! How can I help you today?",
        timestamp: "0:00",
      },
      {
        role: "caller",
        content: "Hi, I need someone to come check out my house for bugs.",
        timestamp: "0:06",
      },
      {
        role: "ai",
        content:
          "I'd be happy to help. Can you describe what you've been seeing?",
        timestamp: "0:12",
      },
      {
        role: "caller",
        content: "Just some small bugs here and there. Not sure what they are.",
        timestamp: "0:20",
      },
    ],
  },
  "call-003": {
    id: "call-003",
    business_id: null,
    caller_name: "James Rodriguez",
    phone_number: "(512) 555-0156",
    service_requested: "Roof Leak Repair",
    duration: 312,
    lead_score: "HOT",
    deal_intent_score: 8,
    confidence_level: "HIGH",
    price_comfort_low: 3000,
    price_comfort_high: 8000,
    price_stretch_ceiling: 10000,
    recommendation:
      "James has an active roof leak causing water damage. He owns the home and is the decision maker. Needs fast response. Schedule an estimate visit this week — urgency drives this deal.",
    status: "new",
    is_read: false,
    created_at: hoursAgo(5),
    qualification_details: [
      { label: "Service Requested", value: "Roof Leak Repair" },
      { label: "Issue", value: "Active leak in master bedroom" },
      { label: "Roof Age", value: "12 years" },
      { label: "Timeline", value: "ASAP — water damage accumulating" },
      { label: "Decision Maker", value: "Yes — homeowner" },
      { label: "Insurance", value: "Has homeowner's insurance, will file claim" },
    ],
    budget_signals: [
      "Mentioned insurance coverage — open to larger repairs",
      'Said "whatever it takes to stop the leak"',
    ],
    stretch_indicators: [
      "Asked about full roof replacement vs. patch repair",
      "Interested in premium materials for longevity",
    ],
    transcript: [
      {
        role: "ai",
        content: "Hello, thanks for calling! How can I help?",
        timestamp: "0:00",
      },
      {
        role: "caller",
        content:
          "I've got a leak in my roof — water is coming through the ceiling in my bedroom.",
        timestamp: "0:05",
      },
    ],
  },
  "call-007": {
    id: "call-007",
    business_id: null,
    caller_name: "Robert Kim",
    phone_number: "(512) 555-0178",
    service_requested: "Personal Injury Consultation",
    duration: 380,
    lead_score: "HOT",
    deal_intent_score: 10,
    confidence_level: "HIGH",
    price_comfort_low: 25000,
    price_comfort_high: 50000,
    price_stretch_ceiling: null,
    recommendation:
      "Robert was in a car accident 3 days ago with significant injuries. He has medical documentation and has not yet retained an attorney. This is a high-value personal injury case. Partner should call back today — he's interviewing firms.",
    status: "new",
    is_read: true,
    created_at: daysAgo(2),
    qualification_details: [
      { label: "Service Requested", value: "Personal Injury Consultation" },
      { label: "Incident Type", value: "Car accident, rear-ended" },
      { label: "Injuries", value: "Whiplash, back pain, bruising" },
      { label: "Medical Treatment", value: "ER visit, follow-up with orthopedist" },
      { label: "Incident Date", value: "3 days ago" },
      { label: "At Fault", value: "Other driver — police report filed" },
      { label: "Insurance", value: "Both parties insured" },
      { label: "Retained Attorney", value: "Not yet — interviewing firms" },
    ],
    budget_signals: [
      "Contingency fee model expected — no upfront cost concern",
      "Asked about typical settlement ranges",
    ],
    stretch_indicators: [
      "Has documentation ready (police report, medical records)",
      "Multiple injuries suggest higher case value",
    ],
    transcript: [
      {
        role: "ai",
        content:
          "Thank you for calling. I understand you're looking for a personal injury consultation. Can you tell me what happened?",
        timestamp: "0:00",
      },
      {
        role: "caller",
        content:
          "Yes, I was rear-ended 3 days ago. I have whiplash and back pain. I went to the ER and have a follow-up with an orthopedist next week.",
        timestamp: "0:10",
      },
    ],
  },
};

export function getCallDetail(callId: string): CallDetail | null {
  return MOCK_CALL_DETAILS[callId] ?? null;
}
