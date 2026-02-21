/*
  # Create businesses table for onboarding

  1. New Tables
    - `businesses`
      - `id` (uuid, primary key)
      - `business_name` (text, required)
      - `industry` (text, required)
      - `custom_industry` (text, optional) - used when industry is "other"
      - `website_url` (text, optional)
      - `phone_number` (text, required)
      - `business_state` (text, required)
      - `owner_name` (text, required)
      - `website_scan_status` (text) - tracks scanning progress
      - `website_services_count` (integer) - number of services found
      - `website_faqs_count` (integer) - number of FAQs found
      - `website_scan_data` (jsonb) - raw scan results
      - `onboarding_step` (text) - tracks onboarding progress
      - `onboarding_completed_at` (timestamptz)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `businesses` table
    - Add policies for public access during onboarding

  3. Important Notes
    - Uses CHECK constraints instead of ENUMs for flexibility
    - Includes auto-update trigger for updated_at timestamp
    - Designed for anonymous onboarding flow (auth integration later)
*/

-- Create businesses table
CREATE TABLE IF NOT EXISTS businesses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Step 1: Business Info fields
  business_name text NOT NULL,
  industry text NOT NULL CHECK (industry IN (
    'dental_practice',
    'hvac_air_conditioning',
    'pest_control',
    'plumbing',
    'roofing',
    'legal_law_firm',
    'real_estate',
    'auto_repair',
    'other'
  )),
  custom_industry text,
  website_url text,
  phone_number text NOT NULL,
  business_state text NOT NULL CHECK (business_state IN (
    'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
    'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
    'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
    'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
    'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY',
    'DC'
  )),
  owner_name text NOT NULL,
  
  -- Website scan results (populated asynchronously)
  website_scan_status text DEFAULT 'pending' CHECK (website_scan_status IN ('pending', 'scanning', 'completed', 'failed')),
  website_services_count integer,
  website_faqs_count integer,
  website_scan_data jsonb,
  
  -- Onboarding progress tracking
  onboarding_step text DEFAULT 'business_info' CHECK (onboarding_step IN (
    'business_info',
    'review_content',
    'hours_calendar',
    'test_call',
    'completed'
  )),
  onboarding_completed_at timestamptz,
  
  -- Timestamps
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_businesses_onboarding_step ON businesses(onboarding_step);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for auto-updating updated_at
DROP TRIGGER IF EXISTS update_businesses_updated_at ON businesses;
CREATE TRIGGER update_businesses_updated_at
  BEFORE UPDATE ON businesses
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;

-- Policy: Allow public to create businesses during onboarding
CREATE POLICY "Allow public to create businesses"
  ON businesses
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Policy: Allow public to read businesses
CREATE POLICY "Allow public to read businesses"
  ON businesses
  FOR SELECT
  TO public
  USING (true);

-- Policy: Allow public to update businesses
CREATE POLICY "Allow public to update businesses"
  ON businesses
  FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);