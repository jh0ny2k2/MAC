-- Run this in Supabase SQL Editor (https://supabase.com/dashboard/project/_/sql/new)
-- Crea las tablas si no existen y añade columnas company/phone

-- 7. messages (add company + phone if not exist)
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  email text NOT NULL DEFAULT '',
  subject text NOT NULL DEFAULT '',
  date text NOT NULL DEFAULT '',
  read boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE messages ADD COLUMN IF NOT EXISTS company text NOT NULL DEFAULT '';
ALTER TABLE messages ADD COLUMN IF NOT EXISTS phone text NOT NULL DEFAULT '';

ALTER TABLE messages DISABLE ROW LEVEL SECURITY;

-- 4. requests (crear si no existe)
CREATE TABLE IF NOT EXISTS requests (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  type text NOT NULL DEFAULT '',
  budget text NOT NULL DEFAULT '',
  date text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'converted', 'lost')),
  email text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE requests ADD COLUMN IF NOT EXISTS phone text NOT NULL DEFAULT '';
ALTER TABLE requests ADD COLUMN IF NOT EXISTS company text NOT NULL DEFAULT '';

ALTER TABLE requests DISABLE ROW LEVEL SECURITY;

-- Send email function (for admin notifications)
CREATE EXTENSION IF NOT EXISTS pg_net;

CREATE OR REPLACE FUNCTION send_reply_email(
  to_email text,
  subject text,
  message_text text
) RETURNS void AS $$
DECLARE
  api_key text := 'REPLACE_WITH_RESEND_API_KEY';
BEGIN
  PERFORM net.http_post(
    url := 'https://api.resend.com/emails',
    headers := jsonb_build_object(
      'Authorization', concat('Bearer ', api_key),
      'Content-Type', 'application/json'
    ),
    body := jsonb_build_object(
      'from', 'NexWeb <onboarding@resend.dev>',
      'to', to_email,
      'subject', subject,
      'text', message_text
    )
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION send_reply_email TO anon;
