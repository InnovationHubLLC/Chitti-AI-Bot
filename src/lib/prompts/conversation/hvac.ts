import type { IndustryConfig } from '@/lib/types/conversation';

export const HVAC_CONFIG: IndustryConfig = {
  industry: 'hvac_air_conditioning',
  qualificationQuestions: [
    'Is this for heating or cooling service?',
    'What type of system do you have?',
    'How old is your current unit?',
    'Is this a repair, maintenance, or new installation?',
    'What is the square footage of the area?',
  ],
  conversationTone: 'Professional and solution-oriented. Callers often have urgent comfort issues. Be efficient and demonstrate expertise.',
  commonObjections: [
    'Can you give me a quote over the phone?',
    'I got a lower quote from another company.',
    'Can you come out today?',
    'Is the diagnostic fee waived if I go with you?',
  ],
  emergencySignals: [
    'no heat', 'no AC', 'gas smell', 'carbon monoxide',
    'system not working', 'flooding',
  ],
  defaultPricingItems: [
    'Diagnostic/service call',
    'AC tune-up',
    'Furnace tune-up',
    'Duct cleaning',
    'New AC installation',
    'Emergency service',
  ],
};

export function buildHvacPrompt(): string {
  return `HVAC-SPECIFIC GUIDELINES:
- Ask about the urgency — comfort issues are often time-sensitive
- For installations, emphasize the free in-home estimate
- Mention available financing options for large purchases
- If there's a gas smell or carbon monoxide concern, advise them to leave the house and call 911 first
- Offer maintenance plan membership for repeat service`;
}
