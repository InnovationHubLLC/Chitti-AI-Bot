import type {
  CreateAssistantPayload,
  CreateChittiAssistantParams,
  VapiFunctionDefinition,
} from './types';

import { buildSystemPrompt } from '@/lib/prompts/conversation/index';

const ELEVENLABS_VOICE_ID = 'EXAVITQu4vr4xnSDxMaL'; // "Sarah"
const ELEVENLABS_MODEL = 'eleven_turbo_v2';

const FUNCTION_DEFINITIONS: VapiFunctionDefinition[] = [
  {
    name: 'lookup_pricing',
    description: 'Look up pricing information for a specific service the caller is asking about.',
    parameters: {
      type: 'object',
      properties: {
        service_query: {
          type: 'string',
          description: 'The service the caller is asking about pricing for',
        },
      },
      required: ['service_query'],
    },
  },
  {
    name: 'lookup_info',
    description: 'Look up general information about the business, services, or FAQs.',
    parameters: {
      type: 'object',
      properties: {
        question: {
          type: 'string',
          description: 'The question the caller is asking',
        },
      },
      required: ['question'],
    },
  },
  {
    name: 'check_availability',
    description: 'Check available appointment slots for a specific date or time range.',
    parameters: {
      type: 'object',
      properties: {
        preferred_date: {
          type: 'string',
          description: 'The preferred date in YYYY-MM-DD format',
        },
        preferred_time: {
          type: 'string',
          description: 'The preferred time of day (morning, afternoon, evening)',
        },
        service_type: {
          type: 'string',
          description: 'The type of service or appointment needed',
        },
      },
      required: ['service_type'],
    },
  },
  {
    name: 'book_appointment',
    description: 'Book an appointment for the caller.',
    parameters: {
      type: 'object',
      properties: {
        caller_name: {
          type: 'string',
          description: 'Full name of the caller',
        },
        caller_phone: {
          type: 'string',
          description: 'Phone number of the caller',
        },
        service_type: {
          type: 'string',
          description: 'The type of service or appointment',
        },
        preferred_date: {
          type: 'string',
          description: 'Preferred date in YYYY-MM-DD format',
        },
        preferred_time: {
          type: 'string',
          description: 'Preferred time of day',
        },
      },
      required: ['caller_name', 'caller_phone', 'service_type'],
    },
  },
];

export function buildAssistantPayload(
  params: CreateChittiAssistantParams,
): CreateAssistantPayload {
  const systemPrompt = buildSystemPrompt(
    params.businessName,
    params.industry,
    params.escalationRules,
  );

  const fullSystemMessage = params.consentScript
    ? `${systemPrompt}\n\nCALL RECORDING CONSENT SCRIPT:\nAt the start of every call, say: "${params.consentScript}"`
    : systemPrompt;

  const serverUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';

  return {
    name: `chitti-${params.businessId}`,
    model: {
      provider: 'anthropic',
      model: 'claude-sonnet-4-5-20250514',
      systemMessage: fullSystemMessage,
      temperature: 0.7,
      maxTokens: 1024,
    },
    voice: {
      provider: 'elevenlabs',
      voiceId: ELEVENLABS_VOICE_ID,
      model: ELEVENLABS_MODEL,
      stability: 0.5,
      similarityBoost: 0.75,
    },
    transcriber: {
      provider: 'deepgram',
      model: 'nova-2',
      language: 'en-US',
    },
    functions: FUNCTION_DEFINITIONS,
    serverUrl: `${serverUrl}/api/webhooks/vapi`,
    firstMessage: params.greeting,
    metadata: {
      businessId: params.businessId,
      industry: params.industry,
      ownerName: params.ownerName,
    },
  };
}
