import type { CallCost } from '@/lib/types/analysis';

// Rates per minute (in USD)
const VAPI_RATE_PER_MIN = 0.05;
const LLM_RATE_PER_MIN = 0.03;
const TTS_RATE_PER_MIN = 0.02;
const STT_RATE_PER_MIN = 0.01;

export function calculateCallCost(durationSeconds: number): CallCost {
  const minutes = durationSeconds / 60;

  const vapiCost = Math.round(minutes * VAPI_RATE_PER_MIN * 10000) / 10000;
  const llmCost = Math.round(minutes * LLM_RATE_PER_MIN * 10000) / 10000;
  const ttsCost = Math.round(minutes * TTS_RATE_PER_MIN * 10000) / 10000;
  const sttCost = Math.round(minutes * STT_RATE_PER_MIN * 10000) / 10000;
  const totalCost =
    Math.round((vapiCost + llmCost + ttsCost + sttCost) * 10000) / 10000;

  return { vapiCost, llmCost, ttsCost, sttCost, totalCost };
}
