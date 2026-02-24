/*
  # Add Vapi assistant and phone number columns to businesses

  Stores the Vapi assistant ID and phone number provisioned
  for each business during setup.
*/

ALTER TABLE businesses
  ADD COLUMN IF NOT EXISTS vapi_assistant_id text,
  ADD COLUMN IF NOT EXISTS vapi_phone_number_id text,
  ADD COLUMN IF NOT EXISTS vapi_phone_number text;
