export interface PricingLookupResult {
  serviceName: string;
  priceLow: number;
  priceHigh: number;
  unit: string;
}

// TODO: Wire to Supabase when ready
export async function lookupStructuredPricing(
  businessId: string,
  serviceQuery: string,
): Promise<PricingLookupResult[]> {
  void businessId;
  void serviceQuery;
  return [];
}
