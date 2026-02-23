import type { CallCost, DetailedCallCost, CostTrackingInput } from '@/lib/types/analysis';

import { createServiceClient } from '@/lib/supabase/service';

// Rates per minute (in USD)
const VAPI_RATE_PER_MIN = 0.05;
const LLM_RATE_PER_MIN = 0.03;
const TTS_RATE_PER_MIN = 0.02;
const STT_RATE_PER_MIN = 0.01;

// Per-unit pricing
const ELEVENLABS_PER_CHAR = 0.00003;
const DEEPGRAM_PER_MIN = 0.0059;
const CLAUDE_INPUT_PER_TOKEN = 0.000003;
const CLAUDE_OUTPUT_PER_TOKEN = 0.000015;
const SMS_COST_PER_MSG = 0.0075;

function round4(value: number): number {
  return Math.round(value * 10000) / 10000;
}

export function calculateCallCost(durationSeconds: number): CallCost {
  const minutes = durationSeconds / 60;

  const vapiCost = round4(minutes * VAPI_RATE_PER_MIN);
  const llmCost = round4(minutes * LLM_RATE_PER_MIN);
  const ttsCost = round4(minutes * TTS_RATE_PER_MIN);
  const sttCost = round4(minutes * STT_RATE_PER_MIN);
  const totalCost = round4(vapiCost + llmCost + ttsCost + sttCost);

  return { vapiCost, llmCost, ttsCost, sttCost, totalCost };
}

export function calculateDetailedCost(input: CostTrackingInput): DetailedCallCost {
  const minutes = input.durationSeconds / 60;

  // Estimate TTS characters (~150 words/min, ~5 chars/word, assistant speaks ~half)
  const estimatedTtsChars = Math.round(minutes * 150 * 5 * 0.5);
  const sttSeconds = input.durationSeconds;

  const llmCost = round4(
    input.claudeTokens.input * CLAUDE_INPUT_PER_TOKEN +
    input.claudeTokens.output * CLAUDE_OUTPUT_PER_TOKEN,
  );
  const ttsCost = round4(estimatedTtsChars * ELEVENLABS_PER_CHAR);
  const sttCost = round4(minutes * DEEPGRAM_PER_MIN);
  const smsCost = round4(input.smsCount * SMS_COST_PER_MSG);
  const totalCost = round4(input.vapiCost + llmCost + ttsCost + sttCost + smsCost);

  return {
    vapiCost: input.vapiCost,
    llmCost,
    ttsCost,
    sttCost,
    totalCost,
    llmInputTokens: input.claudeTokens.input,
    llmOutputTokens: input.claudeTokens.output,
    ttsCharacters: estimatedTtsChars,
    sttSeconds,
    smsCost,
  };
}

export async function trackCallCosts(input: CostTrackingInput): Promise<DetailedCallCost> {
  const costs = calculateDetailedCost(input);
  const supabase = createServiceClient();

  const { error } = await supabase.from('call_costs' as never).insert({
    call_id: input.callId,
    business_id: input.businessId,
    vapi_cost: costs.vapiCost,
    llm_cost: costs.llmCost,
    tts_cost: costs.ttsCost,
    stt_cost: costs.sttCost,
    sms_cost: costs.smsCost,
    total_cost: costs.totalCost,
    llm_input_tokens: costs.llmInputTokens,
    llm_output_tokens: costs.llmOutputTokens,
    tts_characters: costs.ttsCharacters,
    stt_seconds: costs.sttSeconds,
  } as never);

  if (error) {
    console.error('Failed to track call costs', { callId: input.callId, error: error.message });
  }

  return costs;
}
