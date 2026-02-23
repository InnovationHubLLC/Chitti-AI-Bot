import type { PricingItem, FaqItem } from '@/lib/types/knowledge-base';

const daysAgo = (d: number): string =>
  new Date(Date.now() - d * 24 * 60 * 60 * 1000).toISOString();

export const MOCK_PRICING_ITEMS: PricingItem[] = [
  { id: 'price-001', service: 'AC Tune-Up', price: 89, duration: '1 hour', category: 'services', is_active: true, source: 'website', created_at: daysAgo(30) },
  { id: 'price-002', service: 'AC Unit Replacement', price: 4500, duration: '4-6 hours', category: 'services', is_active: true, source: 'website', created_at: daysAgo(30) },
  { id: 'price-003', service: 'Pest Inspection', price: 150, duration: '45 min', category: 'services', is_active: true, source: 'template', created_at: daysAgo(25) },
  { id: 'price-004', service: 'Termite Treatment', price: 800, duration: '2-3 hours', category: 'services', is_active: true, source: 'template', created_at: daysAgo(25) },
  { id: 'price-005', service: 'Roof Leak Repair', price: 350, duration: '2 hours', category: 'services', is_active: true, source: 'manual', created_at: daysAgo(20) },
  { id: 'price-006', service: 'Full Roof Replacement', price: 8500, duration: '2-3 days', category: 'services', is_active: false, source: 'manual', created_at: daysAgo(20) },
  { id: 'price-007', service: 'Emergency Service Call', price: 175, duration: '1 hour', category: 'emergency', is_active: true, source: 'manual', created_at: daysAgo(15) },
  { id: 'price-008', service: 'Diagnostic Fee', price: 49, duration: '30 min', category: 'general', is_active: true, source: 'website', created_at: daysAgo(10) },
  { id: 'price-009', service: 'Duct Cleaning', price: 299, duration: '2 hours', category: 'services', is_active: true, source: 'template', created_at: daysAgo(5) },
  { id: 'price-010', service: 'Water Heater Install', price: 1200, duration: '3-4 hours', category: 'services', is_active: true, source: 'manual', created_at: daysAgo(3) },
];

export const MOCK_FAQ_ITEMS: FaqItem[] = [
  { id: 'faq-001', question: 'What are your business hours?', answer: 'We are open Monday through Friday from 8 AM to 6 PM, and Saturday from 9 AM to 2 PM. We are closed on Sundays.', category: 'general', is_active: true, source: 'website', created_at: daysAgo(30) },
  { id: 'faq-002', question: 'Do you offer emergency services?', answer: 'Yes, we offer 24/7 emergency services. Our emergency service call fee is $175, which includes the first hour of work.', category: 'emergency', is_active: true, source: 'website', created_at: daysAgo(30) },
  { id: 'faq-003', question: 'What payment methods do you accept?', answer: 'We accept cash, checks, all major credit cards (Visa, Mastercard, Amex, Discover), and offer financing through GreenSky for jobs over $1,000.', category: 'general', is_active: true, source: 'template', created_at: daysAgo(28) },
  { id: 'faq-004', question: 'Do you offer free estimates?', answer: 'Yes, we offer free estimates for most services. A diagnostic fee of $49 applies for troubleshooting existing issues, which is waived if you proceed with the repair.', category: 'pricing', is_active: true, source: 'website', created_at: daysAgo(25) },
  { id: 'faq-005', question: 'What areas do you serve?', answer: 'We serve the greater Austin metro area including Round Rock, Cedar Park, Pflugerville, Georgetown, and Kyle. We also cover areas within a 30-mile radius of downtown Austin.', category: 'general', is_active: true, source: 'website', created_at: daysAgo(25) },
  { id: 'faq-006', question: 'Do you offer financing options?', answer: 'Yes, we partner with GreenSky to offer financing for jobs over $1,000. We offer 0% APR for 12 months and low monthly payment plans for up to 60 months.', category: 'pricing', is_active: true, source: 'template', created_at: daysAgo(20) },
  { id: 'faq-007', question: 'How long does an AC replacement take?', answer: 'A typical AC unit replacement takes 4-6 hours for a standard residential system. More complex installations may require an additional day.', category: 'services', is_active: true, source: 'manual', created_at: daysAgo(18) },
  { id: 'faq-008', question: 'Do you offer warranties?', answer: 'All our work comes with a 1-year labor warranty. Equipment warranties vary by manufacturer but typically range from 5-10 years. We also offer extended warranty packages.', category: 'general', is_active: true, source: 'template', created_at: daysAgo(15) },
  { id: 'faq-009', question: 'How soon can you schedule an appointment?', answer: 'For routine services, we can typically schedule within 2-3 business days. Emergency services are available 24/7 with same-day response.', category: 'scheduling', is_active: true, source: 'manual', created_at: daysAgo(12) },
  { id: 'faq-010', question: 'Do you accept insurance claims?', answer: 'We work with most major insurance providers for covered repairs. We can provide detailed documentation and invoices for your insurance claim.', category: 'insurance', is_active: true, source: 'template', created_at: daysAgo(10) },
  { id: 'faq-011', question: 'What brands of AC units do you install?', answer: 'We install and service all major brands including Carrier, Trane, Lennox, Rheem, and Goodman. We can recommend the best option based on your home and budget.', category: 'services', is_active: true, source: 'manual', created_at: daysAgo(7) },
  { id: 'faq-012', question: 'Can I get a callback instead of waiting on hold?', answer: 'Absolutely! If all our team members are busy, Chitti can schedule a callback at your preferred time. You will never have to wait on hold.', category: 'general', is_active: false, source: 'manual', created_at: daysAgo(3) },
];
