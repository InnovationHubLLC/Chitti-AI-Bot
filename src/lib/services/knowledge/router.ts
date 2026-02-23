export type KnowledgeSource = 'structured' | 'rag';

export interface RouteResult {
  source: KnowledgeSource;
  confidence: number;
}

const PRICING_KEYWORDS: string[] = [
  'price', 'pricing', 'cost', 'how much', 'fee', 'charge',
  'rate', 'rates', 'expensive', 'affordable', 'payment',
  'insurance', 'financing', 'discount', 'special', 'deal',
  'estimate', 'quote',
];

export function routeKnowledgeQuery(query: string): RouteResult {
  const lower = query.toLowerCase();
  const matchCount = PRICING_KEYWORDS.filter((kw) => lower.includes(kw)).length;

  if (matchCount >= 2) return { source: 'structured', confidence: 0.9 };
  if (matchCount === 1) return { source: 'structured', confidence: 0.7 };
  return { source: 'rag', confidence: 0.8 };
}
