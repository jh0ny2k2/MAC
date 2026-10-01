-- NexWeb Database Schema
-- Run this in Supabase SQL Editor (https://supabase.com/dashboard/project/_/sql/new)

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. clients
CREATE TABLE clients (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL DEFAULT '',
  webs integer NOT NULL DEFAULT 1,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  date text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 2. websites
CREATE TABLE websites (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  client text NOT NULL,
  project text NOT NULL,
  type text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'design', 'review', 'published')),
  created text NOT NULL DEFAULT '',
  updated text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 3. projects
CREATE TABLE projects (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  client text NOT NULL,
  type text NOT NULL DEFAULT '',
  progress integer NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'design' CHECK (status IN ('pending', 'design', 'review', 'published')),
  deadline text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 4. requests
CREATE TABLE requests (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  type text NOT NULL DEFAULT '',
  budget text NOT NULL DEFAULT '',
  date text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'converted', 'lost')),
  email text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 5. templates
CREATE TABLE templates (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  category text NOT NULL DEFAULT '',
  used integer NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'draft')),
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 6. invoices
CREATE TABLE invoices (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  client text NOT NULL,
  plan text NOT NULL DEFAULT '',
  amount integer NOT NULL DEFAULT 0,
  date text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('paid', 'pending', 'overdue')),
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 7. messages
CREATE TABLE messages (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  email text NOT NULL DEFAULT '',
  subject text NOT NULL DEFAULT '',
  date text NOT NULL DEFAULT '',
  read boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 8. settings (single row)
CREATE TABLE settings (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_name text NOT NULL DEFAULT 'NexWeb',
  email text NOT NULL DEFAULT '',
  phone text NOT NULL DEFAULT '',
  address text NOT NULL DEFAULT '',
  timezone text NOT NULL DEFAULT 'Europe/Madrid',
  language text NOT NULL DEFAULT 'es',
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 9. conversations (chat messages per request)
CREATE TABLE conversations (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  request_id uuid REFERENCES requests(id) ON DELETE CASCADE,
  sender text NOT NULL CHECK (sender IN ('admin', 'client')),
  message text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Disable RLS for simplicity (single-tenant admin panel)
ALTER TABLE clients DISABLE ROW LEVEL SECURITY;
ALTER TABLE websites DISABLE ROW LEVEL SECURITY;
ALTER TABLE projects DISABLE ROW LEVEL SECURITY;
ALTER TABLE requests DISABLE ROW LEVEL SECURITY;
ALTER TABLE templates DISABLE ROW LEVEL SECURITY;
ALTER TABLE invoices DISABLE ROW LEVEL SECURITY;
ALTER TABLE messages DISABLE ROW LEVEL SECURITY;
ALTER TABLE settings DISABLE ROW LEVEL SECURITY;
ALTER TABLE conversations DISABLE ROW LEVEL SECURITY;

-- Function to add a reply
CREATE OR REPLACE FUNCTION add_admin_reply(
  p_request_id uuid,
  p_message text,
  p_client_email text,
  p_client_name text
) RETURNS conversations AS $$
DECLARE
  new_msg conversations;
BEGIN
  INSERT INTO conversations (request_id, sender, message)
  VALUES (p_request_id, 'admin', p_message)
  RETURNING * INTO new_msg;

  RETURN new_msg;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION add_admin_reply TO anon;

-- Seed data
INSERT INTO clients (name, email, phone, webs, status, date) VALUES
  ('María García', 'maria@latrattoria.com', '+34 611 111 111', 2, 'active', '15/01/2025'),
  ('Carlos Méndez', 'carlos@consultor.com', '+34 622 222 222', 1, 'active', '28/02/2025'),
  ('Ana López', 'ana@fitzone.com', '+34 633 333 333', 1, 'active', '10/03/2025'),
  ('Pedro Sánchez', 'pedro@shopwave.com', '+34 644 444 444', 3, 'active', '05/04/2025'),
  ('Laura Martínez', 'laura@medicenter.com', '+34 655 555 555', 1, 'inactive', '20/04/2025'),
  ('Jorge Ruiz', 'jorge@creactive.com', '+34 666 666 666', 2, 'active', '01/05/2025');

INSERT INTO websites (client, project, type, status, created, updated) VALUES
  ('María García', 'La Trattoria', 'Restaurante', 'published', '01/06/2025', '05/06/2025'),
  ('Carlos Méndez', 'Consultoría Financiera', 'Consultor', 'review', '28/05/2025', '03/06/2025'),
  ('Ana López', 'FitZone', 'Gimnasio', 'design', '25/05/2025', '02/06/2025'),
  ('Pedro Sánchez', 'ShopWave', 'Tienda online', 'pending', '22/05/2025', '01/06/2025'),
  ('Laura Martínez', 'MediCenter', 'Clínica', 'published', '20/05/2025', '30/05/2025'),
  ('Jorge Ruiz', 'CreActive Agency', 'Agencia', 'published', '15/05/2025', '28/05/2025');

INSERT INTO projects (name, client, type, progress, status, deadline) VALUES
  ('Web La Trattoria', 'María García', 'Restaurante', 100, 'published', '05/06/2025'),
  ('Consultoría Financiera', 'Carlos Méndez', 'Consultor', 80, 'review', '10/06/2025'),
  ('FitZone Gym', 'Ana López', 'Gimnasio', 45, 'design', '15/06/2025'),
  ('ShopWave Ecommerce', 'Pedro Sánchez', 'Tienda online', 20, 'design', '20/06/2025'),
  ('MediCenter', 'Laura Martínez', 'Clínica', 100, 'published', '30/05/2025'),
  ('CreActive Agency', 'Jorge Ruiz', 'Agencia', 60, 'review', '12/06/2025');

INSERT INTO requests (name, type, budget, date, status, email) VALUES
  ('Pedro Sánchez', 'Tienda online', '800-1200€', '22/05/2025', 'new', 'pedro@email.com'),
  ('Sofía Pérez', 'Landing page', '200-400€', '02/06/2025', 'new', 'sofia@email.com'),
  ('Miguel Ángel', 'Web corporativa', '400-600€', '01/06/2025', 'contacted', 'miguel@email.com'),
  ('Elena Gómez', 'Blog profesional', '300-500€', '30/05/2025', 'converted', 'elena@email.com'),
  ('David López', 'Rediseño', '500-800€', '28/05/2025', 'contacted', 'david@email.com'),
  ('Raquel Martín', 'Web corporativa', '400-700€', '25/05/2025', 'converted', 'raquel@email.com');

INSERT INTO templates (name, category, used, status) VALUES
  ('Restaurante', 'Comida', 12, 'active'),
  ('Gimnasio', 'Deporte', 8, 'active'),
  ('Inmobiliaria', 'Propiedades', 6, 'active'),
  ('Consultor', 'Servicios', 15, 'active'),
  ('Tienda online', 'Ecommerce', 9, 'active'),
  ('Portfolio', 'Personal', 11, 'active'),
  ('Clínica', 'Salud', 5, 'active'),
  ('Agencia', 'Creativo', 7, 'draft');

INSERT INTO invoices (client, plan, amount, date, status) VALUES
  ('María García', 'Profesional', 399, '01/06/2025', 'paid'),
  ('Carlos Méndez', 'Básico', 199, '28/05/2025', 'paid'),
  ('Ana López', 'Profesional', 399, '25/05/2025', 'paid'),
  ('Pedro Sánchez', 'Premium', 799, '22/05/2025', 'pending'),
  ('Laura Martínez', 'Básico', 199, '20/05/2025', 'paid'),
  ('Jorge Ruiz', 'Profesional', 399, '15/05/2025', 'overdue');

INSERT INTO messages (name, email, subject, date, read) VALUES
  ('Pedro Sánchez', 'pedro@email.com', 'Solicitud tienda online', '02/06/2025', false),
  ('Sofía Pérez', 'sofia@email.com', 'Consulta sobre planes', '01/06/2025', false),
  ('Miguel Ángel', 'miguel@email.com', 'Presupuesto web corporativa', '30/05/2025', true),
  ('Elena Gómez', 'elena@email.com', 'Información blog', '28/05/2025', true),
  ('David López', 'david@email.com', 'Rediseño web actual', '25/05/2025', true);

INSERT INTO settings (company_name, email, phone, address, timezone, language) VALUES
  ('NexWeb', 'info@nexweb.com', '+34 900 123 456', 'Calle Gran Vía 42, Madrid', 'Europe/Madrid', 'es');
