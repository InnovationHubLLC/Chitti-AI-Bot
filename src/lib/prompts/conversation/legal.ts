import type { IndustryConfig } from '@/lib/types/conversation';

export const LEGAL_CONFIG: IndustryConfig = {
  industry: 'legal_law_firm',
  qualificationQuestions: [
    'What type of legal matter is this regarding?',
    'Is this a new matter or an existing case?',
    'Have you consulted with another attorney about this?',
    'What is your timeline — is there an upcoming deadline?',
    'Are you the directly affected party?',
  ],
  conversationTone: 'Professional and empathetic. Legal issues are often stressful. Be discreet, avoid giving legal advice, and focus on scheduling a consultation.',
  commonObjections: [
    'Can the attorney give me quick advice over the phone?',
    'How much will this cost in total?',
    'Do you offer free consultations?',
    'I want to know my chances before committing.',
  ],
  emergencySignals: [
    'arrest', 'court date tomorrow', 'restraining order',
    'custody emergency', 'served papers', 'deadline today',
  ],
  defaultPricingItems: [
    'Initial consultation',
    'Flat fee services',
    'Retainer agreement',
    'Document review',
    'Court representation',
    'Mediation services',
  ],
};

export function buildLegalPrompt(): string {
  return `LEGAL-SPECIFIC GUIDELINES:
- NEVER provide legal advice — only schedule consultations
- Be extra careful with confidentiality
- Ask about deadlines — legal timelines are often critical
- Emphasize the attorney's experience and credentials
- For criminal matters or emergencies, prioritize connecting with the attorney`;
}
