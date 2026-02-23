import type { IndustryConfig } from '@/lib/types/conversation';

export const DENTAL_CONFIG: IndustryConfig = {
  industry: 'dental_practice',
  qualificationQuestions: [
    'Is this for a new patient or existing patient?',
    'What type of dental service are you looking for?',
    'Do you have dental insurance?',
    'When was your last dental visit?',
    'Are you experiencing any pain or discomfort?',
  ],
  conversationTone: 'Warm and reassuring. Many callers may be anxious about dental visits. Use empathetic language and avoid clinical jargon unless the caller uses it first.',
  commonObjections: [
    'The price seems high — can you offer a discount?',
    'I need to check with my insurance first.',
    'I want to think about it and call back.',
    'Do you offer payment plans?',
  ],
  emergencySignals: [
    'severe pain', 'tooth knocked out', 'bleeding won\'t stop',
    'swelling', 'broken tooth', 'abscess',
  ],
  defaultPricingItems: [
    'New patient exam & cleaning',
    'Dental X-rays',
    'Teeth whitening',
    'Crown',
    'Root canal',
    'Emergency visit',
  ],
};

export function buildDentalPrompt(): string {
  return `DENTAL-SPECIFIC GUIDELINES:
- Ask about dental insurance early in the conversation
- If the caller mentions pain or an emergency, prioritize scheduling ASAP
- For cosmetic procedures, emphasize the consultation process
- Always mention the new patient special if they're a new patient
- Be sensitive to dental anxiety — offer reassurance about comfort measures`;
}
