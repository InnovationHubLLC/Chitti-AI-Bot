import type {
  CreateAssistantPayload,
  VapiAssistant,
  VapiPhoneNumber,
  BuyPhoneNumberPayload,
  UpdatePhoneNumberPayload,
} from './types';

export class VapiApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly body: unknown,
  ) {
    super(`Vapi API error: ${status}`);
    this.name = 'VapiApiError';
  }
}

export class VapiClient {
  private readonly apiKey: string;
  private readonly baseUrl = 'https://api.vapi.ai';

  constructor() {
    const key = process.env.VAPI_API_KEY;
    if (!key) {
      throw new Error('VAPI_API_KEY environment variable is required');
    }
    this.apiKey = key;
  }

  private async request<T>(method: string, path: string, body?: unknown): Promise<T> {
    const response = await fetch(`${this.baseUrl}${path}`, {
      method,
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      const errorBody = await response.json().catch(() => null);
      throw new VapiApiError(response.status, errorBody);
    }

    return response.json() as Promise<T>;
  }

  async createAssistant(payload: CreateAssistantPayload): Promise<VapiAssistant> {
    return this.request<VapiAssistant>('POST', '/assistant', payload);
  }

  async getAssistant(id: string): Promise<VapiAssistant> {
    return this.request<VapiAssistant>('GET', `/assistant/${id}`);
  }

  async updateAssistant(id: string, payload: Partial<CreateAssistantPayload>): Promise<VapiAssistant> {
    return this.request<VapiAssistant>('PATCH', `/assistant/${id}`, payload);
  }

  async deleteAssistant(id: string): Promise<void> {
    await this.request<void>('DELETE', `/assistant/${id}`);
  }

  async createPhoneCall(assistantId: string, phoneNumber: string): Promise<{ id: string }> {
    return this.request<{ id: string }>('POST', '/call', {
      assistantId,
      customer: { number: phoneNumber },
    });
  }

  async listPhoneNumbers(): Promise<VapiPhoneNumber[]> {
    return this.request<VapiPhoneNumber[]>('GET', '/phone-number');
  }

  async buyPhoneNumber(payload: BuyPhoneNumberPayload): Promise<VapiPhoneNumber> {
    return this.request<VapiPhoneNumber>('POST', '/phone-number', payload);
  }

  async updatePhoneNumber(id: string, payload: UpdatePhoneNumberPayload): Promise<VapiPhoneNumber> {
    return this.request<VapiPhoneNumber>('PATCH', `/phone-number/${id}`, payload);
  }
}
