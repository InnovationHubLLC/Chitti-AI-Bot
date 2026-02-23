export type ConversationStateName =
  | 'GREETING'
  | 'CONSENT_CHECK'
  | 'DISCOVERY'
  | 'QUALIFICATION'
  | 'PRICING'
  | 'BOOKING'
  | 'WRAP_UP'
  | 'ESCALATION';

export interface StateTransition {
  from: ConversationStateName;
  to: ConversationStateName;
  condition: string;
}

export type TranscriptRole = 'assistant' | 'user' | 'system';

export interface TranscriptMessage {
  role: TranscriptRole;
  content: string;
  timestamp: string;
}

export interface ConversationContext {
  businessId: string;
  callId: string;
  currentState: ConversationStateName;
  transcript: TranscriptMessage[];
  extractedInfo: Record<string, unknown>;
  startedAt: string;
}

export interface IndustryConfig {
  industry: string;
  qualificationQuestions: string[];
  conversationTone: string;
  commonObjections: string[];
  emergencySignals: string[];
  defaultPricingItems: string[];
}

export interface EscalationRules {
  triggerPhrases: string[];
  ownerPhone: string;
  maxAttempts: number;
}
