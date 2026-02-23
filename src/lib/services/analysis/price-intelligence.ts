import type { PriceSignal, SignalStrength } from '@/lib/types/analysis';
import type { TranscriptMessage } from '@/lib/types/conversation';

const STRONG_SIGNALS: string[] = [
  'sounds good', 'that works', "let's do it", "i'll take it",
  'sign me up', 'book it', 'go ahead', "that's fine",
  'too expensive', "can't afford", 'out of budget', 'way too much',
];

const MODERATE_SIGNALS: string[] = [
  'how much', "what's the cost", 'price', 'pricing',
  'cheaper', 'expensive', 'discount', 'deal', 'special',
  'payment plan', 'financing', 'insurance cover',
];

const WEAK_SIGNALS: string[] = [
  'budget', 'worth it', 'value', 'compared to',
  'other quotes', 'shop around', 'think about it',
];

function findSignals(
  text: string,
  patterns: string[],
  strength: SignalStrength,
): PriceSignal[] {
  const lower = text.toLowerCase();
  const signals: PriceSignal[] = [];

  for (const pattern of patterns) {
    if (lower.includes(pattern)) {
      signals.push({
        signal: `Caller mentioned: "${pattern}"`,
        strength,
        sourceUtterance: text,
      });
    }
  }

  return signals;
}

export function extractPriceSignals(
  transcript: TranscriptMessage[],
): PriceSignal[] {
  const signals: PriceSignal[] = [];

  for (const message of transcript) {
    if (message.role !== 'user') continue;

    signals.push(
      ...findSignals(message.content, STRONG_SIGNALS, 'strong'),
      ...findSignals(message.content, MODERATE_SIGNALS, 'moderate'),
      ...findSignals(message.content, WEAK_SIGNALS, 'weak'),
    );
  }

  return signals;
}
