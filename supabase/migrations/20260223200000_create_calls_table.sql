/*
  # Create production calls table

  1. New Tables
    - `calls` — production Vapi call records with lead scoring and analysis
      - All fields from the Call/CallDetail types
      - JSONB columns for transcript, qualification_details, budget_signals, stretch_indicators
      - Status tracking: new, contacted, converted, lost

  2. Security
    - Enable RLS with public access policies (matching existing pattern)

  3. Indexes
    - business_id, lead_score, created_at for dashboard queries
*/

-- Create calls table
CREATE TABLE IF NOT EXISTS calls (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id uuid NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  vapi_call_id text,

  -- Caller info
  caller_name text,
  phone_number text NOT NULL,
  service_requested text,
  duration integer,

  -- Lead scoring
  lead_score text CHECK (lead_score IN ('HOT', 'WARM', 'COLD')),
  deal_intent_score integer CHECK (deal_intent_score >= 1 AND deal_intent_score <= 10),
  confidence_level text CHECK (confidence_level IN ('HIGH', 'MEDIUM', 'LOW')),
  price_comfort_low numeric,
  price_comfort_high numeric,
  price_stretch_ceiling numeric,
  recommendation text,

  -- Status
  status text DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'converted', 'lost')),
  is_read boolean DEFAULT false,

  -- Detailed analysis (JSONB)
  call_summary text,
  transcript jsonb DEFAULT '[]'::jsonb,
  qualification_details jsonb DEFAULT '[]'::jsonb,
  budget_signals jsonb DEFAULT '[]'::jsonb,
  stretch_indicators jsonb DEFAULT '[]'::jsonb,

  -- Cost tracking
  vapi_call_cost numeric,

  -- Timestamps
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Indexes for dashboard queries
CREATE INDEX IF NOT EXISTS idx_calls_business_id ON calls(business_id);
CREATE INDEX IF NOT EXISTS idx_calls_lead_score ON calls(lead_score);
CREATE INDEX IF NOT EXISTS idx_calls_created_at ON calls(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_calls_business_created ON calls(business_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_calls_deal_intent ON calls(business_id, deal_intent_score DESC);

-- Trigger for updated_at
DROP TRIGGER IF EXISTS update_calls_updated_at ON calls;
CREATE TRIGGER update_calls_updated_at
  BEFORE UPDATE ON calls
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE calls ENABLE ROW LEVEL SECURITY;

-- RLS Policies (public access during pre-auth phase, matching existing pattern)
CREATE POLICY "Allow public to create calls"
  ON calls FOR INSERT TO public WITH CHECK (true);

CREATE POLICY "Allow public to read calls"
  ON calls FOR SELECT TO public USING (true);

CREATE POLICY "Allow public to update calls"
  ON calls FOR UPDATE TO public USING (true) WITH CHECK (true);

CREATE POLICY "Allow public to delete calls"
  ON calls FOR DELETE TO public USING (true);
