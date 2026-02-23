import { z } from 'zod';

export const qualificationDetailSchema = z.object({
  question: z.string().min(1),
  answer: z.string(),
  score: z.number().min(0).max(100),
});

export const analysisResultSchema = z.object({
  callId: z.string().uuid(),
  leadScore: z.number().min(0).max(100),
  dealIntentScore: z.number().min(0).max(100),
  confidence: z.number().min(0).max(1),
  priceComfort: z.number().min(0).max(100),
  resistance: z.number().min(0).max(100),
  sentiment: z.enum(['positive', 'neutral', 'negative']),
  qualificationDetails: z.array(qualificationDetailSchema),
  summary: z.string().min(1),
});

export const priceSignalSchema = z.object({
  signal: z.string().min(1),
  strength: z.enum(['strong', 'moderate', 'weak']),
  sourceUtterance: z.string().min(1),
});

export const callCostSchema = z.object({
  vapiCost: z.number().min(0),
  llmCost: z.number().min(0),
  ttsCost: z.number().min(0),
  sttCost: z.number().min(0),
  totalCost: z.number().min(0),
});

export type AnalysisResultInput = z.infer<typeof analysisResultSchema>;
export type PriceSignalInput = z.infer<typeof priceSignalSchema>;
export type CallCostInput = z.infer<typeof callCostSchema>;
