import { describe, it, expect } from 'vitest';
import { calculateCallCost } from '../cost-tracker';

describe('calculateCallCost', () => {
  it('should calculate cost for a 60-second call', () => {
    const cost = calculateCallCost(60);
    // 1 minute: vapi=0.05, llm=0.03, tts=0.02, stt=0.01, total=0.11
    expect(cost.vapiCost).toBe(0.05);
    expect(cost.llmCost).toBe(0.03);
    expect(cost.ttsCost).toBe(0.02);
    expect(cost.sttCost).toBe(0.01);
    expect(cost.totalCost).toBe(0.11);
  });

  it('should calculate cost for a 0-second call', () => {
    const cost = calculateCallCost(0);
    expect(cost.totalCost).toBe(0);
  });

  it('should calculate cost for a 300-second (5 min) call', () => {
    const cost = calculateCallCost(300);
    // 5 minutes: vapi=0.25, llm=0.15, tts=0.10, stt=0.05, total=0.55
    expect(cost.vapiCost).toBe(0.25);
    expect(cost.llmCost).toBe(0.15);
    expect(cost.ttsCost).toBe(0.1);
    expect(cost.sttCost).toBe(0.05);
    expect(cost.totalCost).toBe(0.55);
  });

  it('should handle fractional seconds without floating point errors', () => {
    const cost = calculateCallCost(90);
    // 1.5 minutes: vapi=0.075, llm=0.045, tts=0.03, stt=0.015, total=0.165
    expect(cost.vapiCost).toBe(0.075);
    expect(cost.llmCost).toBe(0.045);
    expect(cost.ttsCost).toBe(0.03);
    expect(cost.sttCost).toBe(0.015);
    expect(cost.totalCost).toBe(0.165);
  });

  it('should return all required CallCost fields', () => {
    const cost = calculateCallCost(120);
    expect(cost).toHaveProperty('vapiCost');
    expect(cost).toHaveProperty('llmCost');
    expect(cost).toHaveProperty('ttsCost');
    expect(cost).toHaveProperty('sttCost');
    expect(cost).toHaveProperty('totalCost');
  });
});
