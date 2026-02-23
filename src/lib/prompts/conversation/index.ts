import type { EscalationRules, IndustryConfig } from '@/lib/types/conversation';

import { buildBasePrompt } from './base';
import { buildDentalPrompt, DENTAL_CONFIG } from './dental';
import { buildHvacPrompt, HVAC_CONFIG } from './hvac';
import { buildPestControlPrompt, PEST_CONTROL_CONFIG } from './pest-control';
import { buildLegalPrompt, LEGAL_CONFIG } from './legal';

const INDUSTRY_PROMPT_BUILDERS: Record<string, () => string> = {
  dental_practice: buildDentalPrompt,
  hvac_air_conditioning: buildHvacPrompt,
  pest_control: buildPestControlPrompt,
  legal_law_firm: buildLegalPrompt,
};

const INDUSTRY_CONFIGS: Record<string, IndustryConfig> = {
  dental_practice: DENTAL_CONFIG,
  hvac_air_conditioning: HVAC_CONFIG,
  pest_control: PEST_CONTROL_CONFIG,
  legal_law_firm: LEGAL_CONFIG,
};

export function getIndustryConfig(industry: string): IndustryConfig | undefined {
  return INDUSTRY_CONFIGS[industry];
}

export function buildSystemPrompt(
  businessName: string,
  industry: string,
  escalation: EscalationRules,
): string {
  const base = buildBasePrompt(businessName, escalation);
  const industryPromptBuilder = INDUSTRY_PROMPT_BUILDERS[industry];
  const config = INDUSTRY_CONFIGS[industry];

  const parts: string[] = [base];

  if (industryPromptBuilder) {
    parts.push(industryPromptBuilder());
  }

  if (config) {
    parts.push(`QUALIFICATION QUESTIONS:\n${config.qualificationQuestions.map((q, i) => `${i + 1}. ${q}`).join('\n')}`);
    parts.push(`TONE: ${config.conversationTone}`);
  }

  parts.push(`SAFETY GUARDRAILS:
- Never share other customers' information
- Do not store or repeat back sensitive personal data (SSN, medical details)
- If the caller becomes abusive, politely end the call
- Do not make promises about outcomes or guarantees not in the approved script`);

  return parts.join('\n\n');
}
