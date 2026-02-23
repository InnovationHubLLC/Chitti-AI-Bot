import { describe, it, expect } from 'vitest';
import { routeKnowledgeQuery } from '../router';

describe('routeKnowledgeQuery', () => {
  it('should route pricing queries to structured', () => {
    const result = routeKnowledgeQuery('How much does a cleaning cost?');
    expect(result.source).toBe('structured');
  });

  it('should route with high confidence for multiple pricing keywords', () => {
    const result = routeKnowledgeQuery('What is the price and cost of whitening?');
    expect(result.source).toBe('structured');
    expect(result.confidence).toBe(0.9);
  });

  it('should route single keyword with moderate confidence', () => {
    const result = routeKnowledgeQuery('What is the fee?');
    expect(result.source).toBe('structured');
    expect(result.confidence).toBe(0.7);
  });

  it('should route general queries to rag', () => {
    const result = routeKnowledgeQuery('What are your business hours?');
    expect(result.source).toBe('rag');
  });

  it('should be case insensitive', () => {
    const result = routeKnowledgeQuery('HOW MUCH does PRICING work?');
    expect(result.source).toBe('structured');
  });
});
