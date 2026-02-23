export interface CallEndedEvent {
  name: 'call/ended';
  data: {
    businessId: string;
    callId: string;
    callerPhone: string;
    duration: number;
    transcript: string;
    summary: string;
    vapiCallCost: number;
  };
}

export type InngestEvents = {
  'call/ended': CallEndedEvent;
};
