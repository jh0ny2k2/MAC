-- Migration: conversations + email sending
-- Run this in Supabase SQL Editor

-- Add email column to requests (if not exists)
ALTER TABLE requests ADD COLUMN IF NOT EXISTS email text NOT NULL DEFAULT '';

-- Create conversations table
CREATE TABLE IF NOT EXISTS conversations (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  request_id uuid REFERENCES requests(id) ON DELETE CASCADE,
  sender text NOT NULL CHECK (sender IN ('admin', 'client')),
  message text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE conversations DISABLE ROW LEVEL SECURITY;

-- Function to add reply
CREATE OR REPLACE FUNCTION add_admin_reply(
  p_request_id uuid,
  p_message text,
  p_client_email text,
  p_client_name text
) RETURNS json AS $$
DECLARE
  new_msg conversations;
BEGIN
  INSERT INTO conversations (request_id, sender, message)
  VALUES (p_request_id, 'admin', p_message)
  RETURNING * INTO new_msg;

  RETURN row_to_json(new_msg);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION add_admin_reply TO anon;

-- Update existing seed data with emails
UPDATE requests SET email = 'pedro@email.com' WHERE name = 'Pedro Sánchez' AND email = '';
UPDATE requests SET email = 'sofia@email.com' WHERE name = 'Sofía Pérez' AND email = '';
UPDATE requests SET email = 'miguel@email.com' WHERE name = 'Miguel Ángel' AND email = '';
UPDATE requests SET email = 'elena@email.com' WHERE name = 'Elena Gómez' AND email = '';
UPDATE requests SET email = 'david@email.com' WHERE name = 'David López' AND email = '';
UPDATE requests SET email = 'raquel@email.com' WHERE name = 'Raquel Martín' AND email = '';

-- Migration: project logs (daily work diary per project)
CREATE TABLE IF NOT EXISTS project_logs (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  message text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE project_logs DISABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_project_logs_project ON project_logs(project_id);

-- ============================================
-- FinderLead: Leads & Campaigns
-- ============================================

CREATE TABLE IF NOT EXISTS leads (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_name text NOT NULL,
  phone text NOT NULL DEFAULT '',
  email text NOT NULL DEFAULT '',
  website text NOT NULL DEFAULT '',
  address text NOT NULL DEFAULT '',
  category text NOT NULL DEFAULT '',
  rating numeric DEFAULT 0,
  reviews_count integer DEFAULT 0,
  source text NOT NULL DEFAULT 'manual',
  notes text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'converted', 'lost')),
  keyword text NOT NULL DEFAULT '',
  location text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE leads DISABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS campaigns (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  subject text NOT NULL DEFAULT '',
  content text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'paused', 'completed')),
  sent_count integer NOT NULL DEFAULT 0,
  open_count integer NOT NULL DEFAULT 0,
  reply_count integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE campaigns DISABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS campaign_leads (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  campaign_id uuid REFERENCES campaigns(id) ON DELETE CASCADE,
  lead_id uuid REFERENCES leads(id) ON DELETE CASCADE,
  sent boolean NOT NULL DEFAULT false,
  opened boolean NOT NULL DEFAULT false,
  replied boolean NOT NULL DEFAULT false,
  sent_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(campaign_id, lead_id)
);

ALTER TABLE campaign_leads DISABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_keyword ON leads(keyword);
CREATE INDEX IF NOT EXISTS idx_campaign_leads_campaign ON campaign_leads(campaign_id);
CREATE INDEX IF NOT EXISTS idx_campaign_leads_lead ON campaign_leads(lead_id);
