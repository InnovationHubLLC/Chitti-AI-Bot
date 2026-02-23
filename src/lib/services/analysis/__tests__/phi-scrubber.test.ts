import { describe, it, expect } from 'vitest';
import { scrubPHIRegex } from '../phi-scrubber';

describe('scrubPHIRegex', () => {
  it('should redact SSN', () => {
    const result = scrubPHIRegex('My SSN is 123-45-6789');
    expect(result.text).toContain('[SSN REDACTED]');
    expect(result.text).not.toContain('123-45-6789');
    expect(result.redactedCount).toBeGreaterThanOrEqual(1);
  });

  it('should redact email addresses', () => {
    const result = scrubPHIRegex('Contact me at john@example.com');
    expect(result.text).toContain('[EMAIL REDACTED]');
    expect(result.text).not.toContain('john@example.com');
  });

  it('should redact credit card numbers', () => {
    const result = scrubPHIRegex('Card number 4111-1111-1111-1111');
    expect(result.text).toContain('[CARD REDACTED]');
  });

  it('should redact medical conditions', () => {
    const result = scrubPHIRegex('I was diagnosed with diabetes');
    expect(result.text).toContain('[MEDICAL CONDITION REDACTED]');
  });

  it('should redact medications', () => {
    const result = scrubPHIRegex('I am taking Metformin 500 mg');
    expect(result.text).toContain('[MEDICATION REDACTED]');
  });

  it('should handle text with no PHI', () => {
    const result = scrubPHIRegex('I need a dental cleaning please');
    expect(result.text).toBe('I need a dental cleaning please');
    expect(result.redactedCount).toBe(0);
  });

  it('should handle multiple patterns in one text', () => {
    const result = scrubPHIRegex('SSN 111-22-3333, email test@test.com');
    expect(result.redactedCount).toBeGreaterThanOrEqual(2);
  });

  it('should redact addresses', () => {
    const result = scrubPHIRegex('I live at 123 Main Street');
    expect(result.text).toContain('[ADDRESS REDACTED]');
  });
});
