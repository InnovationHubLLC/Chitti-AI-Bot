import type { IndustryConfig } from '@/lib/types/conversation';

import { DENTAL_CONFIG } from '@/lib/prompts/conversation/dental';
import { HVAC_CONFIG } from '@/lib/prompts/conversation/hvac';
import { PEST_CONTROL_CONFIG } from '@/lib/prompts/conversation/pest-control';
import { LEGAL_CONFIG } from '@/lib/prompts/conversation/legal';

export const INDUSTRY_CONFIGS: Record<string, IndustryConfig> = {
  dental_practice: DENTAL_CONFIG,
  hvac_air_conditioning: HVAC_CONFIG,
  pest_control: PEST_CONTROL_CONFIG,
  legal_law_firm: LEGAL_CONFIG,
};

export function getIndustryConfig(industry: string): IndustryConfig | undefined {
  return INDUSTRY_CONFIGS[industry];
}

export function getSupportedIndustries(): string[] {
  return Object.keys(INDUSTRY_CONFIGS);
}
