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
        model: { provider: 'anthropic' as const, model: 'claude-sonnet-4-6', systemPrompt: 'hi', temperature: 0.7, maxTokens: 1024 },
        voice: { provider: '11labs' as const, voiceId: 'abc', model: 'eleven_turbo_v2', stability: 0.5, similarityBoost: 0.75 },
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
          model: { provider: 'anthropic', model: 'm', systemPrompt: '', temperature: 0, maxTokens: 0 },
          voice: { provider: '11labs', voiceId: '', model: '', stability: 0, similarityBoost: 0 },
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

  describe('listPhoneNumbers', () => {
    it('should GET /phone-number', async () => {
      process.env.VAPI_API_KEY = 'test-key';
      const mockNumbers = [
        { id: 'pn_1', number: '+15551111111', assistantId: null, createdAt: '2026-01-01' },
      ];
      const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue(
        new Response(JSON.stringify(mockNumbers), { status: 200 }),
      );

      const client = new VapiClient();
      const result = await client.listPhoneNumbers();

      expect(fetchSpy).toHaveBeenCalledWith(
        'https://api.vapi.ai/phone-number',
        expect.objectContaining({ method: 'GET' }),
      );
      expect(result).toHaveLength(1);
      expect(result[0].number).toBe('+15551111111');
    });
  });

  describe('buyPhoneNumber', () => {
    it('should POST to /phone-number with payload', async () => {
      process.env.VAPI_API_KEY = 'test-key';
      const mockPhone = { id: 'pn_2', number: '+15122223333', assistantId: 'ast_123', createdAt: '2026-01-01' };
      const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue(
        new Response(JSON.stringify(mockPhone), { status: 200 }),
      );

      const client = new VapiClient();
      const result = await client.buyPhoneNumber({ areaCode: '512', assistantId: 'ast_123' });

      expect(fetchSpy).toHaveBeenCalledWith(
        'https://api.vapi.ai/phone-number',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ areaCode: '512', assistantId: 'ast_123' }),
        }),
      );
      expect(result.id).toBe('pn_2');
      expect(result.number).toBe('+15122223333');
    });

    it('should throw VapiApiError when purchase fails', async () => {
      process.env.VAPI_API_KEY = 'test-key';
      vi.spyOn(globalThis, 'fetch').mockResolvedValue(
        new Response(JSON.stringify({ error: 'No numbers available' }), { status: 400 }),
      );

      const client = new VapiClient();
      await expect(client.buyPhoneNumber({ areaCode: '999' })).rejects.toThrow(VapiApiError);
    });
  });

  describe('updatePhoneNumber', () => {
    it('should PATCH /phone-number/:id with payload', async () => {
      process.env.VAPI_API_KEY = 'test-key';
      const mockPhone = { id: 'pn_2', number: '+15122223333', assistantId: 'ast_456', createdAt: '2026-01-01' };
      const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue(
        new Response(JSON.stringify(mockPhone), { status: 200 }),
      );

      const client = new VapiClient();
      const result = await client.updatePhoneNumber('pn_2', { assistantId: 'ast_456' });

      expect(fetchSpy).toHaveBeenCalledWith(
        'https://api.vapi.ai/phone-number/pn_2',
        expect.objectContaining({
          method: 'PATCH',
          body: JSON.stringify({ assistantId: 'ast_456' }),
        }),
      );
      expect(result.assistantId).toBe('ast_456');
    });
  });
});
