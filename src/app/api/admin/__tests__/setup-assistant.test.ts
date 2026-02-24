import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import { POST, GET } from '../setup-assistant/route';

// Mock Supabase
const mockSelect = vi.fn();
const mockUpdate = vi.fn();
const mockFrom = vi.fn();

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn().mockResolvedValue({
    from: (...args: unknown[]) => mockFrom(...args),
  }),
}));

// Mock Vapi client
const mockCreateAssistant = vi.fn();
const mockDeleteAssistant = vi.fn();
const mockUpdatePhoneNumber = vi.fn();

vi.mock('@/lib/vapi/client', () => {
  class MockVapiClient {
    createAssistant = mockCreateAssistant;
    deleteAssistant = mockDeleteAssistant;
    updatePhoneNumber = mockUpdatePhoneNumber;
  }
  class MockVapiApiError extends Error {
    status: number;
    body: unknown;
    constructor(status: number, body: unknown) {
      super(`Vapi API error: ${status}`);
      this.name = 'VapiApiError';
      this.status = status;
      this.body = body;
    }
  }
  return {
    VapiClient: MockVapiClient,
    VapiApiError: MockVapiApiError,
  };
});

// Mock buildAssistantPayload
vi.mock('@/lib/vapi/create-assistant', () => ({
  buildAssistantPayload: vi.fn().mockReturnValue({
    name: 'chitti-test',
    model: { provider: 'anthropic', model: 'claude-sonnet-4-5-20250514', systemMessage: '', temperature: 0.7, maxTokens: 1024 },
    voice: { provider: 'elevenlabs', voiceId: 'abc', model: 'eleven_turbo_v2', stability: 0.5, similarityBoost: 0.75 },
    transcriber: { provider: 'deepgram', model: 'nova-2', language: 'en-US' },
    functions: [],
    serverUrl: 'http://localhost:3000/api/webhooks/vapi',
    firstMessage: 'Hello!',
    metadata: { businessId: 'biz_001' },
  }),
}));

const VALID_UUID = '550e8400-e29b-41d4-a716-446655440000';
const PHONE_NUMBER_ID = 'pn_existing_123';

const mockBusiness = {
  id: VALID_UUID,
  business_name: 'Sunny Dental',
  industry: 'dental_practice',
  owner_name: 'Dr. Smith',
  phone_number: '+15551234567',
  vapi_assistant_id: null,
  vapi_phone_number_id: null,
  vapi_phone_number: null,
};

function setupSupabaseMock(options: {
  selectData?: Record<string, unknown> | null;
  selectError?: { message: string } | null;
  updateError?: { message: string } | null;
}): void {
  mockFrom.mockImplementation(() => ({
    select: vi.fn().mockReturnValue({
      eq: vi.fn().mockReturnValue({
        single: vi.fn().mockResolvedValue({
          data: options.selectData ?? null,
          error: options.selectError ?? null,
        }),
      }),
    }),
    update: vi.fn().mockReturnValue({
      eq: vi.fn().mockResolvedValue({
        error: options.updateError ?? null,
      }),
    }),
  }));
}

function createPostRequest(body: Record<string, unknown>): NextRequest {
  return new NextRequest('http://localhost:3000/api/admin/setup-assistant', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
  });
}

function createGetRequest(businessId?: string): NextRequest {
  const url = businessId
    ? `http://localhost:3000/api/admin/setup-assistant?businessId=${businessId}`
    : 'http://localhost:3000/api/admin/setup-assistant';
  return new NextRequest(url, { method: 'GET' });
}

describe('POST /api/admin/setup-assistant', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.VAPI_API_KEY = 'test-key';
  });

  it('should create assistant + link existing phone number + save to DB', async () => {
    setupSupabaseMock({ selectData: mockBusiness });

    mockCreateAssistant.mockResolvedValue({ id: 'ast_new', name: 'chitti-test', createdAt: '2026-01-01', updatedAt: '2026-01-01' });
    mockUpdatePhoneNumber.mockResolvedValue({ id: PHONE_NUMBER_ID, number: '+12194070006', assistantId: 'ast_new', createdAt: '2026-01-01' });

    const res = await POST(createPostRequest({ businessId: VALID_UUID, phoneNumberId: PHONE_NUMBER_ID }));
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.success).toBe(true);
    expect(json.assistantId).toBe('ast_new');
    expect(json.phoneNumberId).toBe(PHONE_NUMBER_ID);
    expect(json.phoneNumber).toBe('+12194070006');
    expect(mockCreateAssistant).toHaveBeenCalledOnce();
    expect(mockUpdatePhoneNumber).toHaveBeenCalledWith(PHONE_NUMBER_ID, { assistantId: 'ast_new' });
  });

  it('should return 404 when business not found', async () => {
    setupSupabaseMock({ selectData: null, selectError: { message: 'Not found' } });

    const res = await POST(createPostRequest({ businessId: VALID_UUID, phoneNumberId: PHONE_NUMBER_ID }));
    const json = await res.json();

    expect(res.status).toBe(404);
    expect(json.error).toBe('Business not found');
  });

  it('should return 400 on invalid input', async () => {
    const res = await POST(createPostRequest({ businessId: 'not-a-uuid' }));
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.error).toBe('Invalid input');
  });

  it('should clean up assistant if phone linking fails', async () => {
    setupSupabaseMock({ selectData: mockBusiness });

    mockCreateAssistant.mockResolvedValue({ id: 'ast_cleanup', name: 'test', createdAt: '', updatedAt: '' });
    mockUpdatePhoneNumber.mockRejectedValue(new Error('Phone number not found'));
    mockDeleteAssistant.mockResolvedValue(undefined);

    const res = await POST(createPostRequest({ businessId: VALID_UUID, phoneNumberId: 'pn_bad' }));
    const json = await res.json();

    expect(res.status).toBe(502);
    expect(json.error).toBe('Failed to link phone number');
    expect(mockDeleteAssistant).toHaveBeenCalledWith('ast_cleanup');
  });

  it('should return existing setup when already provisioned', async () => {
    const provisionedBusiness = {
      ...mockBusiness,
      vapi_assistant_id: 'ast_existing',
      vapi_phone_number_id: 'pn_existing',
      vapi_phone_number: '+12194070006',
    };

    setupSupabaseMock({ selectData: provisionedBusiness });

    const res = await POST(createPostRequest({ businessId: VALID_UUID, phoneNumberId: PHONE_NUMBER_ID }));
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.alreadyProvisioned).toBe(true);
    expect(json.assistantId).toBe('ast_existing');
    expect(mockCreateAssistant).not.toHaveBeenCalled();
  });
});

describe('GET /api/admin/setup-assistant', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return setup status for a provisioned business', async () => {
    setupSupabaseMock({
      selectData: {
        id: VALID_UUID,
        vapi_assistant_id: 'ast_123',
        vapi_phone_number_id: 'pn_456',
        vapi_phone_number: '+12194070006',
      },
    });

    const res = await GET(createGetRequest(VALID_UUID));
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.provisioned).toBe(true);
    expect(json.assistantId).toBe('ast_123');
    expect(json.phoneNumber).toBe('+12194070006');
  });

  it('should return 400 when businessId missing', async () => {
    const res = await GET(createGetRequest());
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.error).toBe('businessId query parameter is required');
  });

  it('should return 404 when business not found', async () => {
    setupSupabaseMock({ selectData: null, selectError: { message: 'Not found' } });

    const res = await GET(createGetRequest(VALID_UUID));
    const json = await res.json();

    expect(res.status).toBe(404);
    expect(json.error).toBe('Business not found');
  });

  it('should return provisioned=false when not set up', async () => {
    setupSupabaseMock({
      selectData: {
        id: VALID_UUID,
        vapi_assistant_id: null,
        vapi_phone_number_id: null,
        vapi_phone_number: null,
      },
    });

    const res = await GET(createGetRequest(VALID_UUID));
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.provisioned).toBe(false);
    expect(json.assistantId).toBeNull();
  });
});
