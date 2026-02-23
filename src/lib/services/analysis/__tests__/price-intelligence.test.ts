import { describe, it, expect } from 'vitest';
import { extractPriceSignals } from '../price-intelligence';
import type { TranscriptMessage } from '@/lib/types/conversation';

function makeTranscript(
  messages: Array<{ role: 'user' | 'assistant'; content: string }>,
): TranscriptMessage[] {
  return messages.map((m, i) => ({
    ...m,
    timestamp: new Date(Date.now() + i * 1000).toISOString(),
  }));
}

describe('extractPriceSignals', () => {
  it('should detect strong positive signals', () => {
    const transcript = makeTranscript([
      { role: 'assistant', content: 'The cleaning costs $150.' },
      { role: 'user', content: "That sounds good, let's do it." },
    ]);
    const signals = extractPriceSignals(transcript);
    expect(signals.length).toBeGreaterThanOrEqual(1);
    expect(signals.some((s) => s.strength === 'strong')).toBe(true);
  });

  it('should detect strong negative signals', () => {
    const transcript = makeTranscript([
      { role: 'assistant', content: 'That will be $500.' },
      { role: 'user', content: "That's too expensive for me." },
    ]);
    const signals = extractPriceSignals(transcript);
    expect(signals.some((s) => s.strength === 'strong')).toBe(true);
  });

  it('should detect moderate signals', () => {
    const transcript = makeTranscript([
      { role: 'user', content: 'How much does a cleaning cost?' },
    ]);
    const signals = extractPriceSignals(transcript);
    expect(signals.some((s) => s.strength === 'moderate')).toBe(true);
  });

  it('should detect weak signals', () => {
    const transcript = makeTranscript([
      { role: 'user', content: 'Is it worth it compared to other options?' },
    ]);
    const signals = extractPriceSignals(transcript);
    expect(signals.some((s) => s.strength === 'weak')).toBe(true);
  });

  it('should only analyze user messages', () => {
    const transcript = makeTranscript([
      { role: 'assistant', content: 'The price is very affordable.' },
    ]);
    const signals = extractPriceSignals(transcript);
    expect(signals).toHaveLength(0);
  });

  it('should return empty for no signals', () => {
    const transcript = makeTranscript([
      { role: 'user', content: 'What time do you open?' },
    ]);
    const signals = extractPriceSignals(transcript);
    expect(signals).toHaveLength(0);
  });
});
