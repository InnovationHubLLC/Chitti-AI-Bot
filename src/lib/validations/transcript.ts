import { z } from 'zod';

export const transcriptMessageSchema = z.object({
  role: z.enum(['assistant', 'user', 'system']),
  content: z.string().min(1),
  timestamp: z.string().datetime(),
});

export const transcriptSchema = z.array(transcriptMessageSchema).min(1);

export const conversationStateSchema = z.enum([
  'GREETING',
  'CONSENT_CHECK',
  'DISCOVERY',
  'QUALIFICATION',
  'PRICING',
  'BOOKING',
  'WRAP_UP',
  'ESCALATION',
]);

export const stateTransitionSchema = z.object({
  from: conversationStateSchema,
  to: conversationStateSchema,
  condition: z.string().min(1),
});

export const conversationContextSchema = z.object({
  businessId: z.string().uuid(),
  callId: z.string().uuid(),
  currentState: conversationStateSchema,
  transcript: transcriptSchema,
  extractedInfo: z.record(z.string(), z.unknown()),
  startedAt: z.string().datetime(),
});

export const escalationRulesSchema = z.object({
  triggerPhrases: z.array(z.string().min(1)).min(1),
  ownerPhone: z.string().min(10),
  maxAttempts: z.number().int().min(1).max(10),
});

export type TranscriptMessageInput = z.infer<typeof transcriptMessageSchema>;
export type TranscriptInput = z.infer<typeof transcriptSchema>;
export type ConversationContextInput = z.infer<typeof conversationContextSchema>;
export type StateTransitionInput = z.infer<typeof stateTransitionSchema>;
export type EscalationRulesInput = z.infer<typeof escalationRulesSchema>;
