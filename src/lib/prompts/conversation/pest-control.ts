import type { IndustryConfig } from '@/lib/types/conversation';

export const PEST_CONTROL_CONFIG: IndustryConfig = {
  industry: 'pest_control',
  qualificationQuestions: [
    'What type of pest are you dealing with?',
    'How long have you noticed the issue?',
    'Is this a residential or commercial property?',
    'Have you tried any treatments already?',
    'Do you have pets or small children?',
  ],
  conversationTone: 'Calm and reassuring. Pest issues can be distressing. Normalize the situation and focus on solutions.',
  commonObjections: [
    'Is the treatment safe for my pets?',
    'How many visits will it take?',
    'Do you offer a guarantee?',
    'Can I just buy the products myself?',
  ],
  emergencySignals: [
    'wasp nest near door', 'bees inside house', 'snake',
    'rats in kitchen', 'bed bugs', 'termite damage',
  ],
  defaultPricingItems: [
    'Initial inspection',
    'General pest treatment',
    'Termite inspection',
    'Rodent control',
    'Bed bug treatment',
    'Monthly maintenance plan',
  ],
};

export function buildPestControlPrompt(): string {
  return `PEST CONTROL-SPECIFIC GUIDELINES:
- Always ask about pets and children for safety considerations
- Emphasize eco-friendly and safe treatment options
- For termites and bed bugs, stress the importance of professional treatment
- Offer a free inspection when appropriate
- Mention satisfaction guarantees to build confidence`;
}
