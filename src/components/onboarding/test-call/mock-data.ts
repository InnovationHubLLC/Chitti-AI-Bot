import type { TranscriptMessage } from "./call-in-progress";
import type { CallAnalysisData } from "./call-complete";

export const MOCK_PHONE_NUMBER = "+1 (555) 123-4567";

export const MOCK_TRANSCRIPT: TranscriptMessage[] = [
  {
    id: "1",
    role: "ai",
    content:
      "Thanks for calling! This is Chitti, your AI assistant. How can I help you today?",
  },
  {
    id: "2",
    role: "caller",
    content: "Hi, I was wondering how much a general consultation costs?",
  },
  {
    id: "3",
    role: "ai",
    content:
      "A general consultation ranges from $50 to $150 depending on the complexity of your situation. Would you like to schedule one?",
  },
  {
    id: "4",
    role: "caller",
    content: "That sounds good. Are you open on Saturday?",
  },
  {
    id: "5",
    role: "ai",
    content:
      "Yes! We're open Saturday from 9 AM to 1 PM. I have a few slots available this Saturday. Would you like me to book one for you?",
  },
  {
    id: "6",
    role: "caller",
    content: "Can I come in at 10 AM?",
  },
  {
    id: "7",
    role: "ai",
    content:
      "10 AM on Saturday works perfectly. I've got that penciled in for you. Can I get your name and a callback number to confirm the appointment?",
  },
  {
    id: "8",
    role: "caller",
    content: "Sure, it's John. My number is 555-987-6543.",
  },
  {
    id: "9",
    role: "ai",
    content:
      "You're all set, John! I've booked your general consultation for Saturday at 10 AM. You'll get a confirmation text shortly. Anything else I can help with?",
  },
  {
    id: "10",
    role: "caller",
    content: "No, that's it. Thanks!",
  },
  {
    id: "11",
    role: "ai",
    content:
      "Great, have a wonderful day, John! We look forward to seeing you Saturday.",
  },
];

export const MOCK_ANALYSIS: CallAnalysisData = {
  leadScore: "hot",
  dealIntentScore: 8,
  confidenceLevel: "high",
  priceComfortLow: 50,
  priceComfortHigh: 150,
  recommendedAction:
    "Follow up with a confirmation text. High-intent lead ready to buy — appointment already booked for Saturday at 10 AM.",
  serviceRequested: "General Consultation",
  callSummary:
    "Caller inquired about consultation pricing, asked about Saturday availability, and successfully booked an appointment for 10 AM.",
};
