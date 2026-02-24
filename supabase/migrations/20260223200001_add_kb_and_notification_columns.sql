/*
  # Add missing columns to KB tables and businesses

  1. Alterations
    - `pricing_services`: add duration, category, is_active columns
    - `faqs`: add category, is_active columns
    - `businesses`: add notification_preferences jsonb column

  2. Notes
    - All new columns have defaults so existing rows are unaffected
*/

-- Add columns to pricing_services
ALTER TABLE pricing_services
  ADD COLUMN IF NOT EXISTS duration text,
  ADD COLUMN IF NOT EXISTS category text DEFAULT 'services',
  ADD COLUMN IF NOT EXISTS is_active boolean DEFAULT true;

-- Add columns to faqs
ALTER TABLE faqs
  ADD COLUMN IF NOT EXISTS category text DEFAULT 'general',
  ADD COLUMN IF NOT EXISTS is_active boolean DEFAULT true;

-- Add notification_preferences to businesses
ALTER TABLE businesses
  ADD COLUMN IF NOT EXISTS notification_preferences jsonb DEFAULT '{}'::jsonb;
