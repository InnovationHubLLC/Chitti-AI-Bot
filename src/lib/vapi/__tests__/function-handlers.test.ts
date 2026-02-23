import { describe, it, expect, vi, beforeEach } from 'vitest';
import { dispatchFunctionCall } from '../function-handlers';

vi.mock('@/lib/services/knowledge/router', () => ({
  routeKnowledgeQuery: vi.fn().mockReturnValue({ source: 'structured', confidence: 0.9 }),
}));

vi.mock('@/lib/services/knowledge/structured', () => ({
  lookupStructuredPricing: vi.fn().mockResolvedValue([]),
}));

vi.mock('@/lib/services/knowledge/rag', () => ({
  lookupRAG: vi.fn().mockResolvedValue([]),
}));

describe('dispatchFunctionCall', () => {
  const businessId = 'biz_001';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should route lookup_pricing to pricing handler', async () => {
    const result = await dispatchFunctionCall(businessId, {
      name: 'lookup_pricing',
      parameters: { service_query: 'teeth cleaning' },
    });
    expect(result).toHaveProperty('instruction');
    expect(result).toHaveProperty('found');
  });

  it('should route lookup_info to info handler', async () => {
    const result = await dispatchFunctionCall(businessId, {
      name: 'lookup_info',
      parameters: { question: 'What are your hours?' },
    });
    expect(result.found).toBe(false);
    expect(result.instruction).toContain('connect them');
  });

  it('should route check_availability to stub handler', async () => {
    const result = await dispatchFunctionCall(businessId, {
      name: 'check_availability',
      parameters: { service_type: 'cleaning', preferred_date: '2026-03-01' },
    });
    expect(result.found).toBe(false);
    expect(result.instruction).toContain('not yet connected');
  });

  it('should route book_appointment to stub handler', async () => {
    const result = await dispatchFunctionCall(businessId, {
      name: 'book_appointment',
      parameters: { caller_name: 'Jane', caller_phone: '+15551234567', service_type: 'cleaning' },
    });
    expect(result.found).toBe(false);
    expect(result.instruction).toContain('not yet available');
  });

  it('should return error for unknown function', async () => {
    const result = await dispatchFunctionCall(businessId, {
      name: 'unknown_function',
      parameters: {},
    });
    expect(result.found).toBe(false);
    expect(result.instruction).toContain('Unknown function');
  });

  describe('handlePricingLookup', () => {
    it('should return found with services when structured pricing exists', async () => {
      const { lookupStructuredPricing } = await import('@/lib/services/knowledge/structured');
      vi.mocked(lookupStructuredPricing).mockResolvedValueOnce([
        { serviceName: 'Teeth Cleaning', priceLow: 100, priceHigh: 200, unit: 'per visit' },
      ]);

      const result = await dispatchFunctionCall(businessId, {
        name: 'lookup_pricing',
        parameters: { service_query: 'how much for teeth cleaning' },
      });

      expect(result.found).toBe(true);
      expect(result.services).toHaveLength(1);
      expect(result.services![0].name).toBe('Teeth Cleaning');
    });

    it('should fall back to RAG when structured returns empty', async () => {
      const { lookupRAG } = await import('@/lib/services/knowledge/rag');
      vi.mocked(lookupRAG).mockResolvedValueOnce([
        { content: 'Cleaning starts at $99', title: 'Pricing', score: 0.85 },
      ]);

      const result = await dispatchFunctionCall(businessId, {
        name: 'lookup_pricing',
        parameters: { service_query: 'cleaning price' },
      });

      expect(result.found).toBe(true);
      expect(result.instruction).toContain('Cleaning starts at $99');
    });

    it('should return not found when both sources return empty', async () => {
      const result = await dispatchFunctionCall(businessId, {
        name: 'lookup_pricing',
        parameters: { service_query: 'exotic procedure' },
      });

      expect(result.found).toBe(false);
      expect(result.instruction).toContain('No pricing information found');
    });
  });
});
