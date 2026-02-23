import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { VapiClient, VapiApiError } from '../client';

describe('VapiClient', () => {
  const originalEnv = process.env.VAPI_API_KEY;

  afterEach(() => {
    if (originalEnv) {
      process.env.VAPI_API_KEY = originalEnv;
    } else {
      delete process.env.VAPI_API_KEY;
    }
    vi.restoreAllMocks();
  });

  describe('constructor', () => {
    it('should throw when VAPI_API_KEY is missing', () => {
      delete process.env.VAPI_API_KEY;
      expect(() => new VapiClient()).toThrow('VAPI_API_KEY environment variable is required');
    });

    it('should create client when VAPI_API_KEY is set', () => {
      process.env.VAPI_API_KEY = 'test-key';
      expect(() => new VapiClient()).not.toThrow();
    });
  });

  describe('createAssistant', () => {
    beforeEach(() => {
      process.env.VAPI_API_KEY = 'test-key';
    });

    it('should POST correct payload to /assistant', async () => {
      const mockResponse = { id: 'ast_123', name: 'test', createdAt: '2026-01-01', updatedAt: '2026-01-01' };
      const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue(
        new Response(JSON.stringify(mockResponse), { status: 200 }),
      );

      const client = new VapiClient();
      const payload = {
        name: 'test-assistant',
        model: { provider: 'anthropic' as const, model: 'claude-sonnet-4-5-20250514', systemMessage: 'hi', temperature: 0.7, maxTokens: 1024 },
        voice: { provider: 'elevenlabs' as const, voiceId: 'abc', model: 'eleven_turbo_v2', stability: 0.5, similarityBoost: 0.75 },
        transcriber: { provider: 'deepgram' as const, model: 'nova-2', language: 'en-US' },
        functions: [],
        serverUrl: 'http://localhost:3000/api/webhooks/vapi',
        firstMessage: 'Hello!',
        metadata: { businessId: 'biz_1' },
      };

      const result = await client.createAssistant(payload);

      expect(fetchSpy).toHaveBeenCalledWith(
        'https://api.vapi.ai/assistant',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Authorization': 'Bearer test-key',
            'Content-Type': 'application/json',
          }),
          body: JSON.stringify(payload),
        }),
      );
      expect(result.id).toBe('ast_123');
    });

    it('should throw VapiApiError on non-2xx response', async () => {
      vi.spyOn(globalThis, 'fetch').mockResolvedValue(
        new Response(JSON.stringify({ error: 'Bad request' }), { status: 400 }),
      );

      const client = new VapiClient();
      await expect(
        client.createAssistant({
          name: 'test',
          model: { provider: 'anthropic', model: 'm', systemMessage: '', temperature: 0, maxTokens: 0 },
          voice: { provider: 'elevenlabs', voiceId: '', model: '', stability: 0, similarityBoost: 0 },
          transcriber: { provider: 'deepgram', model: '', language: '' },
          functions: [],
          serverUrl: '',
          firstMessage: '',
          metadata: {},
        }),
      ).rejects.toThrow(VapiApiError);
    });
  });

  describe('getAssistant', () => {
    it('should GET /assistant/:id', async () => {
      process.env.VAPI_API_KEY = 'test-key';
      const mockResponse = { id: 'ast_123', name: 'test', createdAt: '2026-01-01', updatedAt: '2026-01-01' };
      const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue(
        new Response(JSON.stringify(mockResponse), { status: 200 }),
      );

      const client = new VapiClient();
      await client.getAssistant('ast_123');

      expect(fetchSpy).toHaveBeenCalledWith(
        'https://api.vapi.ai/assistant/ast_123',
        expect.objectContaining({ method: 'GET' }),
      );
    });
  });

  describe('createPhoneCall', () => {
    it('should POST to /call with assistantId and phone number', async () => {
      process.env.VAPI_API_KEY = 'test-key';
      vi.spyOn(globalThis, 'fetch').mockResolvedValue(
        new Response(JSON.stringify({ id: 'call_456' }), { status: 200 }),
      );

      const client = new VapiClient();
      const result = await client.createPhoneCall('ast_123', '+15551234567');

      expect(result.id).toBe('call_456');
    });
  });
});
