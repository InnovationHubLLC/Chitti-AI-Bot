/*
  # Create test calls and call analysis tables

  1. New Tables
    - `test_calls`
      - `id` (uuid, primary key)
      - `business_id` (uuid, FK to businesses)
      - `phone_number` (text) - the Chitti number used for the test
      - `status` (text) - pending, ringing, in_progress, completed, failed
      - `started_at` (timestamptz) - when call began
      - `ended_at` (timestamptz) - when call ended
      - `duration_seconds` (integer) - call length
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `call_transcripts`
      - `id` (uuid, primary key)
      - `test_call_id` (uuid, FK to test_calls)
      - `role` (text) - ai or caller
      - `content` (text) - the message text
      - `timestamp_offset` (integer) - seconds from call start
      - `created_at` (timestamptz)

    - `call_analysis`
      - `id` (uuid, primary key)
      - `test_call_id` (uuid, FK to test_calls)
      - `lead_score` (text) - hot, warm, cold
      - `deal_intent_score` (integer) - 1-10 scale
      - `confidence_level` (text) - high, medium, low
      - `price_comfort_low` (numeric) - low end of price range
      - `price_comfort_high` (numeric) - high end of price range
      - `recommended_action` (text) - suggested follow-up
      - `service_requested` (text) - what the caller asked about
      - `call_summary` (text) - brief summary of the call
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all three tables
    - Add policies for public access during onboarding (matches existing pattern)

  3. Important Notes
    - Designed for the test call flow during onboarding step 4
    - Transcript entries are ordered by timestamp_offset
    - Call analysis is generated after call completes
    - Public policies match the existing onboarding pattern (no auth yet)
*/

-- Create test_calls table
CREATE TABLE IF NOT EXISTS test_calls (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id uuid NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  phone_number text NOT NULL DEFAULT '+1 (555) 123-4567',
  status text NOT NULL DEFAULT 'pending' CHECK (status IN (
    'pending', 'ringing', 'in_progress', 'completed', 'failed'
  )),
  started_at timestamptz,
  ended_at timestamptz,
  duration_seconds integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_test_calls_business_id ON test_calls(business_id);
CREATE INDEX IF NOT EXISTS idx_test_calls_status ON test_calls(status);

DROP TRIGGER IF EXISTS update_test_calls_updated_at ON test_calls;
CREATE TRIGGER update_test_calls_updated_at
  BEFORE UPDATE ON test_calls
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

ALTER TABLE test_calls ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public to create test calls"
  ON test_calls
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow public to read test calls"
  ON test_calls
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public to update test calls"
  ON test_calls
  FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

-- Create call_transcripts table
CREATE TABLE IF NOT EXISTS call_transcripts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  test_call_id uuid NOT NULL REFERENCES test_calls(id) ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('ai', 'caller')),
  content text NOT NULL DEFAULT '',
  timestamp_offset integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_call_transcripts_test_call_id ON call_transcripts(test_call_id);

ALTER TABLE call_transcripts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public to create call transcripts"
  ON call_transcripts
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow public to read call transcripts"
  ON call_transcripts
  FOR SELECT
  TO public
  USING (true);

-- Create call_analysis table
CREATE TABLE IF NOT EXISTS call_analysis (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  test_call_id uuid NOT NULL REFERENCES test_calls(id) ON DELETE CASCADE,
  lead_score text NOT NULL DEFAULT 'warm' CHECK (lead_score IN ('hot', 'warm', 'cold')),
  deal_intent_score integer NOT NULL DEFAULT 5 CHECK (deal_intent_score >= 1 AND deal_intent_score <= 10),
  confidence_level text NOT NULL DEFAULT 'medium' CHECK (confidence_level IN ('high', 'medium', 'low')),
  price_comfort_low numeric DEFAULT 0,
  price_comfort_high numeric DEFAULT 0,
  recommended_action text NOT NULL DEFAULT '',
  service_requested text NOT NULL DEFAULT '',
  call_summary text NOT NULL DEFAULT '',
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_call_analysis_test_call_id ON call_analysis(test_call_id);

ALTER TABLE call_analysis ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public to create call analysis"
  ON call_analysis
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow public to read call analysis"
  ON call_analysis
  FOR SELECT
  TO public
  USING (true);
