export interface VapiModelConfig {
  provider: 'anthropic';
  model: string;
  systemMessage: string;
  temperature: number;
  maxTokens: number;
}

export interface VapiVoiceConfig {
  provider: 'elevenlabs';
  voiceId: string;
  model: string;
  stability: number;
  similarityBoost: number;
}

export interface VapiTranscriberConfig {
  provider: 'deepgram';
  model: string;
  language: string;
}

export interface VapiFunctionParameter {
  type: string;
  properties: Record<string, { type: string; description: string }>;
  required?: string[];
}

export interface VapiFunctionDefinition {
  name: string;
  description: string;
  parameters: VapiFunctionParameter;
}

export interface CreateAssistantPayload {
  name: string;
  model: VapiModelConfig;
  voice: VapiVoiceConfig;
  transcriber: VapiTranscriberConfig;
  functions: VapiFunctionDefinition[];
  serverUrl: string;
  firstMessage: string;
  metadata: Record<string, string>;
}

export interface VapiAssistant {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface VapiCallInfo {
  id: string;
  metadata: Record<string, string>;
  customer: {
    number: string;
  };
  duration: number;
  cost: number;
}

export interface VapiFunctionCall {
  name: string;
  parameters: Record<string, unknown>;
}

export interface VapiWebhookFunctionCall {
  type: 'function-call';
  functionCall: VapiFunctionCall;
  call: VapiCallInfo;
}

export interface VapiWebhookEndOfCallReport {
  type: 'end-of-call-report';
  call: VapiCallInfo;
  transcript: string;
  summary: string;
  recordingUrl?: string;
}

export interface VapiWebhookStatusUpdate {
  type: 'status-update';
  status: string;
  call: VapiCallInfo;
}

export type VapiWebhookMessage =
  | VapiWebhookFunctionCall
  | VapiWebhookEndOfCallReport
  | VapiWebhookStatusUpdate;

export interface VapiWebhookBody {
  message: VapiWebhookMessage;
}

export interface FunctionCallResult {
  found: boolean;
  instruction: string;
  services?: Array<{ name: string; priceLow: number; priceHigh: number; unit: string }>;
  slots?: string[];
}

export interface CreateChittiAssistantParams {
  businessId: string;
  businessName: string;
  industry: string;
  greeting: string;
  ownerName: string;
  consentScript: string;
  escalationRules: {
    triggerPhrases: string[];
    ownerPhone: string;
    maxAttempts: number;
  };
}
