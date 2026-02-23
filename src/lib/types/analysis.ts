export type SentimentValue = 'positive' | 'neutral' | 'negative';
export type SignalStrength = 'strong' | 'moderate' | 'weak';

export interface QualificationDetail {
  question: string;
  answer: string;
  score: number;
}

export interface AnalysisResult {
  callId: string;
  leadScore: number;
  dealIntentScore: number;
  confidence: number;
  priceComfort: number;
  resistance: number;
  sentiment: SentimentValue;
  qualificationDetails: QualificationDetail[];
  summary: string;
}

export interface PriceSignal {
  signal: string;
  strength: SignalStrength;
  sourceUtterance: string;
}

export interface CallCost {
  vapiCost: number;
  llmCost: number;
  ttsCost: number;
  sttCost: number;
  totalCost: number;
}

export interface DetailedCallCost extends CallCost {
  llmInputTokens: number;
  llmOutputTokens: number;
  ttsCharacters: number;
  sttSeconds: number;
  smsCost: number;
}

export interface CostTrackingInput {
  callId: string;
  businessId: string;
  vapiCost: number;
  claudeTokens: { input: number; output: number };
  durationSeconds: number;
  smsCount: number;
}
