import { describe, it, expect, vi, afterEach } from 'vitest';
import { buildAssistantPayload } from '../create-assistant';
import type { CreateChittiAssistantParams } from '../types';

vi.mock('@/lib/prompts/conversation/index', () => ({
  buildSystemPrompt: vi.fn().mockReturnValue('SYSTEM PROMPT CONTENT'),
}));

describe('buildAssistantPayload', () => {
  const defaultParams: CreateChittiAssistantParams = {
    businessId: 'biz_001',
    businessName: 'Sunny Dental',
    industry: 'dental_practice',
    greeting: 'Hi, thanks for calling Sunny Dental!',
    ownerName: 'Dr. Smith',
    consentScript: 'This call may be recorded for quality purposes.',
    escalationRules: {
      triggerPhrases: ['speak to manager', 'talk to owner'],
      ownerPhone: '+15551234567',
      maxAttempts: 3,
    },
  };

  afterEach(() => {
    vi.restoreAllMocks();
    delete process.env.NEXT_PUBLIC_APP_URL;
  });

  it('should use 11labs provider with Sarah voice', () => {
    const payload = buildAssistantPayload(defaultParams);
    expect(payload.voice.provider).toBe('11labs');
    expect(payload.voice.voiceId).toBe('EXAVITQu4vr4xnSDxMaL');
    expect(payload.voice.model).toBe('eleven_turbo_v2');
    expect(payload.voice.stability).toBe(0.5);
    expect(payload.voice.similarityBoost).toBe(0.75);
  });

  it('should use anthropic provider with claude model', () => {
    const payload = buildAssistantPayload(defaultParams);
    expect(payload.model.provider).toBe('anthropic');
    expect(payload.model.model).toBe('claude-sonnet-4-6');
    expect(payload.model.temperature).toBe(0.7);
    expect(payload.model.maxTokens).toBe(1024);
  });

  it('should use deepgram nova-2 transcriber', () => {
    const payload = buildAssistantPayload(defaultParams);
    expect(payload.transcriber.provider).toBe('deepgram');
    expect(payload.transcriber.model).toBe('nova-2');
    expect(payload.transcriber.language).toBe('en-US');
  });

  it('should include all 4 function definitions', () => {
    const payload = buildAssistantPayload(defaultParams);
    expect(payload.functions).toHaveLength(4);
    const names = payload.functions.map((f) => f.name);
    expect(names).toContain('lookup_pricing');
    expect(names).toContain('lookup_info');
    expect(names).toContain('check_availability');
    expect(names).toContain('book_appointment');
  });

  it('should read serverUrl from NEXT_PUBLIC_APP_URL', () => {
    process.env.NEXT_PUBLIC_APP_URL = 'https://chitti.example.com';
    const payload = buildAssistantPayload(defaultParams);
    expect(payload.serverUrl).toBe('https://chitti.example.com/api/webhooks/vapi');
  });

  it('should default serverUrl to localhost when env is missing', () => {
    delete process.env.NEXT_PUBLIC_APP_URL;
    const payload = buildAssistantPayload(defaultParams);
    expect(payload.serverUrl).toBe('http://localhost:3000/api/webhooks/vapi');
  });

  it('should call buildSystemPrompt with correct args', async () => {
    const { buildSystemPrompt } = await import('@/lib/prompts/conversation/index');
    buildAssistantPayload(defaultParams);
    expect(buildSystemPrompt).toHaveBeenCalledWith(
      'Sunny Dental',
      'dental_practice',
      defaultParams.escalationRules,
    );
  });

  it('should append consent script to system message', () => {
    const payload = buildAssistantPayload(defaultParams);
    expect(payload.model.systemPrompt).toContain('This call may be recorded');
  });

  it('should not append consent section when consentScript is empty', () => {
    const params = { ...defaultParams, consentScript: '' };
    const payload = buildAssistantPayload(params);
    expect(payload.model.systemPrompt).not.toContain('CALL RECORDING CONSENT SCRIPT');
  });

  it('should set metadata with businessId and industry', () => {
    const payload = buildAssistantPayload(defaultParams);
    expect(payload.metadata.businessId).toBe('biz_001');
    expect(payload.metadata.industry).toBe('dental_practice');
    expect(payload.metadata.ownerName).toBe('Dr. Smith');
  });

  it('should set firstMessage from greeting param', () => {
    const payload = buildAssistantPayload(defaultParams);
    expect(payload.firstMessage).toBe('Hi, thanks for calling Sunny Dental!');
  });
});
