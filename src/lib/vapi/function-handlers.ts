import type { VapiFunctionCall, FunctionCallResult } from './types';

import { routeKnowledgeQuery } from '@/lib/services/knowledge/router';
import { lookupStructuredPricing } from '@/lib/services/knowledge/structured';
import { lookupRAG } from '@/lib/services/knowledge/rag';

export async function dispatchFunctionCall(
  businessId: string,
  functionCall: VapiFunctionCall,
): Promise<FunctionCallResult> {
  switch (functionCall.name) {
    case 'lookup_pricing':
      return handlePricingLookup(businessId, functionCall.parameters.service_query as string);
    case 'lookup_info':
      return handleInfoLookup(businessId, functionCall.parameters.question as string);
    case 'check_availability':
      return handleCheckAvailability(businessId, functionCall.parameters);
    case 'book_appointment':
      return handleBookAppointment(businessId, functionCall.parameters);
    default:
      return { found: false, instruction: `Unknown function: ${functionCall.name}` };
  }
}

async function handlePricingLookup(
  businessId: string,
  serviceQuery: string,
): Promise<FunctionCallResult> {
  const route = routeKnowledgeQuery(serviceQuery);

  if (route.source === 'structured') {
    const results = await lookupStructuredPricing(businessId, serviceQuery);
    if (results.length > 0) {
      return {
        found: true,
        instruction: `Found pricing for the requested service. Share these prices with the caller naturally.`,
        services: results.map((r) => ({
          name: r.serviceName,
          priceLow: r.priceLow,
          priceHigh: r.priceHigh,
          unit: r.unit,
        })),
      };
    }
  }

  const ragResults = await lookupRAG(businessId, serviceQuery);
  if (ragResults.length > 0) {
    return {
      found: true,
      instruction: `Found related information: ${ragResults[0].content}`,
    };
  }

  return {
    found: false,
    instruction: 'No pricing information found for that service. Offer to have someone call them back with details.',
  };
}

async function handleInfoLookup(
  businessId: string,
  question: string,
): Promise<FunctionCallResult> {
  const results = await lookupRAG(businessId, question);

  if (results.length > 0) {
    return {
      found: true,
      instruction: `Answer based on this knowledge: ${results[0].content}`,
    };
  }

  return {
    found: false,
    instruction: 'Could not find an answer to that question. Offer to connect them with a team member who can help.',
  };
}

async function handleCheckAvailability(
  _businessId: string,
  _params: Record<string, unknown>,
): Promise<FunctionCallResult> {
  return {
    found: false,
    instruction: 'Calendar integration is not yet connected. Let the caller know you can take their information and someone will call back to schedule.',
  };
}

async function handleBookAppointment(
  _businessId: string,
  _params: Record<string, unknown>,
): Promise<FunctionCallResult> {
  return {
    found: false,
    instruction: 'Online booking is not yet available. Offer to take their name and number so someone can call back to schedule.',
  };
}
