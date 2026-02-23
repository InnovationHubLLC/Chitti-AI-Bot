import { describe, it, expect } from 'vitest';
import { ConversationStateMachine } from '../state-machine';

describe('ConversationStateMachine', () => {
  it('should start in GREETING state', () => {
    const sm = new ConversationStateMachine();
    expect(sm.getState()).toBe('GREETING');
  });

  it('should allow valid transition', () => {
    const sm = new ConversationStateMachine();
    expect(sm.canTransition('CONSENT_CHECK')).toBe(true);
    expect(sm.transition('CONSENT_CHECK')).toBe(true);
    expect(sm.getState()).toBe('CONSENT_CHECK');
  });

  it('should reject invalid transition', () => {
    const sm = new ConversationStateMachine();
    expect(sm.canTransition('BOOKING')).toBe(false);
    expect(sm.transition('BOOKING')).toBe(false);
    expect(sm.getState()).toBe('GREETING');
  });

  it('should track history', () => {
    const sm = new ConversationStateMachine();
    sm.transition('CONSENT_CHECK');
    sm.transition('DISCOVERY');
    expect(sm.getHistory()).toEqual(['GREETING', 'CONSENT_CHECK', 'DISCOVERY']);
  });

  it('should handle full happy path', () => {
    const sm = new ConversationStateMachine();
    expect(sm.transition('CONSENT_CHECK')).toBe(true);
    expect(sm.transition('DISCOVERY')).toBe(true);
    expect(sm.transition('QUALIFICATION')).toBe(true);
    expect(sm.transition('PRICING')).toBe(true);
    expect(sm.transition('BOOKING')).toBe(true);
    expect(sm.transition('WRAP_UP')).toBe(true);
    expect(sm.getState()).toBe('WRAP_UP');
  });

  it('should allow escalation from multiple states', () => {
    const sm1 = new ConversationStateMachine('DISCOVERY');
    expect(sm1.canTransition('ESCALATION')).toBe(true);

    const sm2 = new ConversationStateMachine('QUALIFICATION');
    expect(sm2.canTransition('ESCALATION')).toBe(true);

    const sm3 = new ConversationStateMachine('PRICING');
    expect(sm3.canTransition('ESCALATION')).toBe(true);
  });

  it('should return available transitions', () => {
    const sm = new ConversationStateMachine('PRICING');
    const transitions = sm.getAvailableTransitions();
    expect(transitions).toHaveLength(3);
    expect(transitions.map((t) => t.to)).toContain('BOOKING');
    expect(transitions.map((t) => t.to)).toContain('WRAP_UP');
    expect(transitions.map((t) => t.to)).toContain('ESCALATION');
  });

  it('should accept custom initial state', () => {
    const sm = new ConversationStateMachine('QUALIFICATION');
    expect(sm.getState()).toBe('QUALIFICATION');
  });
});
