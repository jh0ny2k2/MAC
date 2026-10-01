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
