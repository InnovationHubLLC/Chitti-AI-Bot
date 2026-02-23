import { z } from 'zod';

export const vapiFunctionCallSchema = z.object({
  name: z.string(),
  parameters: z.record(z.string(), z.unknown()),
});

export const vapiCallInfoSchema = z.object({
  id: z.string(),
  metadata: z.record(z.string(), z.string()).default({}),
  customer: z.object({
    number: z.string(),
  }),
  duration: z.number().default(0),
  cost: z.number().default(0),
});

const vapiWebhookFunctionCallSchema = z.object({
  type: z.literal('function-call'),
  functionCall: vapiFunctionCallSchema,
  call: vapiCallInfoSchema,
});

const vapiWebhookEndOfCallReportSchema = z.object({
  type: z.literal('end-of-call-report'),
  call: vapiCallInfoSchema,
  transcript: z.string().default(''),
  summary: z.string().default(''),
  recordingUrl: z.string().optional(),
});

const vapiWebhookStatusUpdateSchema = z.object({
  type: z.literal('status-update'),
  status: z.string(),
  call: vapiCallInfoSchema,
});

export const vapiWebhookMessageSchema = z.discriminatedUnion('type', [
  vapiWebhookFunctionCallSchema,
  vapiWebhookEndOfCallReportSchema,
  vapiWebhookStatusUpdateSchema,
]);

export const vapiWebhookBodySchema = z.object({
  message: vapiWebhookMessageSchema,
});
