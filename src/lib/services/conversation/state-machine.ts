import type { ConversationStateName, StateTransition } from '@/lib/types/conversation';

const VALID_TRANSITIONS: StateTransition[] = [
  { from: 'GREETING', to: 'CONSENT_CHECK', condition: 'Caller identified' },
  { from: 'CONSENT_CHECK', to: 'DISCOVERY', condition: 'Consent given' },
  { from: 'CONSENT_CHECK', to: 'WRAP_UP', condition: 'Consent refused' },
  { from: 'DISCOVERY', to: 'QUALIFICATION', condition: 'Need identified' },
  { from: 'DISCOVERY', to: 'ESCALATION', condition: 'Escalation triggered' },
  { from: 'QUALIFICATION', to: 'PRICING', condition: 'Qualified' },
  { from: 'QUALIFICATION', to: 'ESCALATION', condition: 'Escalation triggered' },
  { from: 'PRICING', to: 'BOOKING', condition: 'Price accepted' },
  { from: 'PRICING', to: 'WRAP_UP', condition: 'Price rejected' },
  { from: 'PRICING', to: 'ESCALATION', condition: 'Escalation triggered' },
  { from: 'BOOKING', to: 'WRAP_UP', condition: 'Booking confirmed' },
  { from: 'BOOKING', to: 'ESCALATION', condition: 'Escalation triggered' },
  { from: 'ESCALATION', to: 'WRAP_UP', condition: 'Escalation complete' },
];

export class ConversationStateMachine {
  private currentState: ConversationStateName;
  private history: ConversationStateName[];

  constructor(initialState: ConversationStateName = 'GREETING') {
    this.currentState = initialState;
    this.history = [initialState];
  }

  getState(): ConversationStateName {
    return this.currentState;
  }

  getHistory(): ConversationStateName[] {
    return [...this.history];
  }

  canTransition(to: ConversationStateName): boolean {
    return VALID_TRANSITIONS.some(
      (t) => t.from === this.currentState && t.to === to,
    );
  }

  transition(to: ConversationStateName): boolean {
    if (!this.canTransition(to)) return false;
    this.currentState = to;
    this.history.push(to);
    return true;
  }

  getAvailableTransitions(): StateTransition[] {
    return VALID_TRANSITIONS.filter((t) => t.from === this.currentState);
  }
}
