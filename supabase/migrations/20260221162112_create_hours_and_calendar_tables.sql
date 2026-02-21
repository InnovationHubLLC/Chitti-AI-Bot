/*
  # Create Business Hours and Calendar Settings Tables

  1. New Tables
    - `business_hours`
      - `id` (uuid, primary key)
      - `business_id` (uuid, foreign key to businesses)
      - `day_of_week` (integer, 0-6 where 0 is Sunday)
      - `is_closed` (boolean, whether the business is closed on this day)
      - `open_time` (time, opening time)
      - `close_time` (time, closing time)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `calendar_settings`
      - `id` (uuid, primary key)
      - `business_id` (uuid, foreign key to businesses, unique)
      - `integration_type` (text, 'none' | 'google' | 'manual')
      - `calendar_email` (text, nullable)
      - `default_duration_minutes` (integer, default appointment duration)
      - `buffer_time_minutes` (integer, buffer between appointments)
      - `advance_booking_days` (integer, how far in advance can book)
      - `same_day_cutoff_time` (time, latest time for same-day bookings)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on both tables
    - Add policies for public access to match businesses table pattern
*/

CREATE TABLE IF NOT EXISTS business_hours (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id uuid NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  day_of_week integer NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
  is_closed boolean DEFAULT false,
  open_time time,
  close_time time,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_business_hours_business_id ON business_hours(business_id);

CREATE TABLE IF NOT EXISTS calendar_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id uuid NOT NULL UNIQUE REFERENCES businesses(id) ON DELETE CASCADE,
  integration_type text DEFAULT 'none' CHECK (integration_type IN ('none', 'google', 'manual')),
  calendar_email text,
  default_duration_minutes integer DEFAULT 60,
  buffer_time_minutes integer DEFAULT 15,
  advance_booking_days integer DEFAULT 30,
  same_day_cutoff_time time DEFAULT '16:00',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_calendar_settings_business_id ON calendar_settings(business_id);

ALTER TABLE business_hours ENABLE ROW LEVEL SECURITY;
ALTER TABLE calendar_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public to view business hours"
  ON business_hours FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public to insert business hours"
  ON business_hours FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow public to update business hours"
  ON business_hours FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public to delete business hours"
  ON business_hours FOR DELETE
  TO public
  USING (true);

CREATE POLICY "Allow public to view calendar settings"
  ON calendar_settings FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public to insert calendar settings"
  ON calendar_settings FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow public to update calendar settings"
  ON calendar_settings FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public to delete calendar settings"
  ON calendar_settings FOR DELETE
  TO public
  USING (true);
