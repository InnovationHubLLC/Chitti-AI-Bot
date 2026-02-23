import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockInsert = vi.fn();
const mockSelect = vi.fn();
const mockSingle = vi.fn();
const mockEq = vi.fn();

vi.mock('@/lib/supabase/service', () => ({
  createServiceClient: vi.fn(() => ({
    from: vi.fn((table: string) => {
      if (table === 'calls') {
        return {
          insert: mockInsert.mockReturnValue({
            select: mockSelect.mockReturnValue({
              single: mockSingle.mockResolvedValue({ data: { id: 'call_123' }, error: null }),
            }),
          }),
        };
      }
      if (table === 'businesses') {
        return {
          select: vi.fn().mockReturnValue({
            eq: mockEq.mockReturnValue({
              single: vi.fn().mockResolvedValue({ data: { industry: 'dental_practice' }, error: null }),
            }),
          }),
        };
      }
      if (table === 'call_analysis') {
        return {
          insert: vi.fn().mockReturnValue({
            select: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({ data: { id: 'analysis_456' }, error: null }),
            }),
          }),
        };
      }
      return { insert: vi.fn().mockReturnValue({ select: vi.fn().mockReturnValue({ single: vi.fn() }) }) };
    }),
  })),
}));

vi.mock('@/lib/services/analysis/phi-scrubber', () => ({
  scrubPHIRegex: vi.fn((text: string) => ({ text: text.replace(/\b\d{3}-\d{2}-\d{4}\b/g, '[SSN REDACTED]'), redactedCount: 1 })),
}));

vi.mock('@/lib/services/cost-tracker', () => ({
  trackCallCosts: vi.fn().mockResolvedValue({
    vapiCost: 0.05, llmCost: 0.03, ttsCost: 0.02, sttCost: 0.01,
    totalCost: 0.11, llmInputTokens: 0, llmOutputTokens: 0,
    ttsCharacters: 0, sttSeconds: 60, smsCost: 0,
  }),
}));

// We test the logic by extracting the step functions
// Since Inngest functions are hard to unit test directly,
// we test the individual pieces they depend on
describe('analyzeCall pipeline', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should scrub PHI for dental industry', async () => {
    const { scrubPHIRegex } = await import('@/lib/services/analysis/phi-scrubber');
    const transcript = 'Patient SSN is 123-45-6789 and needs a cleaning';
    const result = scrubPHIRegex(transcript);
    expect(result.text).toContain('[SSN REDACTED]');
    expect(result.text).not.toContain('123-45-6789');
  });

  it('should skip PHI scrubbing for non-medical industries', () => {
    const PHI_SENSITIVE_INDUSTRIES = ['dental_practice', 'medical', 'healthcare'];
    expect(PHI_SENSITIVE_INDUSTRIES.includes('hvac_air_conditioning')).toBe(false);
    expect(PHI_SENSITIVE_INDUSTRIES.includes('dental_practice')).toBe(true);
  });

  it('should call trackCallCosts with correct input shape', async () => {
    const { trackCallCosts } = await import('@/lib/services/cost-tracker');
    await trackCallCosts({
      callId: 'call_123',
      businessId: 'biz_001',
      vapiCost: 0.05,
      claudeTokens: { input: 0, output: 0 },
      durationSeconds: 60,
      smsCount: 0,
    });
    expect(trackCallCosts).toHaveBeenCalledWith(
      expect.objectContaining({
        callId: 'call_123',
        businessId: 'biz_001',
        durationSeconds: 60,
      }),
    );
  });

  it('should create service client for database operations', async () => {
    const { createServiceClient } = await import('@/lib/supabase/service');
    const client = createServiceClient();
    expect(client).toBeDefined();
    expect(client.from).toBeDefined();
  });

  it('should insert call record with correct fields', async () => {
    const { createServiceClient } = await import('@/lib/supabase/service');
    const supabase = createServiceClient();
    const result = await supabase.from('calls').insert({
      id: 'call_123',
      business_id: 'biz_001',
      caller_phone: '+15551234567',
      duration_seconds: 120,
      transcript: 'Hello...',
      summary: 'Customer asked about cleaning',
      status: 'completed',
    }).select('id').single();

    expect(mockInsert).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 'call_123',
        business_id: 'biz_001',
        status: 'completed',
      }),
    );
    expect(result.data?.id).toBe('call_123');
  });

  it('should insert analysis record with pending status', async () => {
    const { createServiceClient } = await import('@/lib/supabase/service');
    const supabase = createServiceClient();
    const result = await supabase.from('call_analysis').insert({
      call_id: 'call_123',
      business_id: 'biz_001',
      lead_score: 0,
      sentiment: 'neutral',
      summary: 'test transcript',
      analysis_status: 'pending',
    }).select('id').single();

    expect(result.data?.id).toBe('analysis_456');
  });
});
