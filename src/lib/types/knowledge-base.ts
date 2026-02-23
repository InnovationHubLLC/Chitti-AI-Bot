export interface PricingItem {
  id: string;
  service: string;
  price: number;
  duration: string;
  category: string;
  is_active: boolean;
  source: 'website' | 'template' | 'manual';
  created_at: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  is_active: boolean;
  source: 'website' | 'template' | 'manual';
  created_at: string;
}

export type KbCategory = 'all' | 'general' | 'pricing' | 'services' | 'insurance' | 'scheduling' | 'emergency';

export type KbSortField = 'service' | 'price' | 'category' | 'created_at';

export type KbSortDirection = 'asc' | 'desc';
