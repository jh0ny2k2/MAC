-- ============================================
-- PANEL DE ADMINISTRACIÓN (solo desarrollador)
-- ============================================
-- 1. Ejecuta este archivo en Supabase > SQL Editor
--    (se puede ejecutar varias veces sin error)
-- 2. Conviértete en admin ejecutando:
--
--    INSERT INTO public.admin_users (user_id)
--    SELECT id FROM auth.users WHERE email = 'tu-email@ejemplo.com';
--
-- ============================================

-- --------------------------------------------
-- TABLA: admin_users
-- --------------------------------------------
CREATE TABLE IF NOT EXISTS public.admin_users (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- --------------------------------------------
-- FUNCIÓN: is_admin()
-- (debe crearse ANTES de las políticas que la usan)
-- --------------------------------------------
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_users WHERE user_id = auth.uid()
  );
$$;

REVOKE EXECUTE ON FUNCTION public.is_admin() FROM anon, PUBLIC;

-- --------------------------------------------
-- POLÍTICAS DE admin_users
-- --------------------------------------------
DROP POLICY IF EXISTS "Admins can view admin users" ON public.admin_users;
CREATE POLICY "Admins can view admin users"
  ON public.admin_users FOR SELECT TO authenticated
  USING (public.is_admin());

DROP POLICY IF EXISTS "Admins can add admins" ON public.admin_users;
CREATE POLICY "Admins can add admins"
  ON public.admin_users FOR INSERT TO authenticated
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins can remove admins" ON public.admin_users;
CREATE POLICY "Admins can remove admins"
  ON public.admin_users FOR DELETE TO authenticated
  USING (public.is_admin());

-- --------------------------------------------
-- RPC: admin_list_users()
-- Devuelve todos los usuarios con email y último login
-- (auth.users no es accesible desde el cliente)
-- --------------------------------------------
CREATE OR REPLACE FUNCTION public.admin_list_users()
RETURNS TABLE (
  id UUID,
  email TEXT,
  role TEXT,
  full_name TEXT,
  hourly_rate NUMERIC,
  company_id UUID,
  created_at TIMESTAMPTZ,
  last_sign_in_at TIMESTAMPTZ,
  confirmed_at TIMESTAMPTZ
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    p.id,
    u.email::text,
    p.role,
    p.full_name,
    p.hourly_rate,
    p.company_id,
    p.created_at,
    u.last_sign_in_at,
    u.confirmed_at
  FROM public.profiles p
  JOIN auth.users u ON u.id = p.id
  WHERE public.is_admin()
  ORDER BY p.created_at DESC;
$$;

REVOKE EXECUTE ON FUNCTION public.admin_list_users() FROM anon, PUBLIC;
GRANT EXECUTE ON FUNCTION public.admin_list_users() TO authenticated;

-- --------------------------------------------
-- POLÍTICAS DE LECTURA GLOBAL PARA ADMINS
-- --------------------------------------------

-- profiles
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
CREATE POLICY "Admins can view all profiles"
  ON public.profiles FOR SELECT TO authenticated
  USING (public.is_admin());

-- companies
DROP POLICY IF EXISTS "Admins can view all companies" ON public.companies;
CREATE POLICY "Admins can view all companies"
  ON public.companies FOR SELECT TO authenticated
  USING (public.is_admin());

-- work_shifts
DROP POLICY IF EXISTS "Admins can view all shifts" ON public.work_shifts;
CREATE POLICY "Admins can view all shifts"
  ON public.work_shifts FOR SELECT TO authenticated
  USING (public.is_admin());

-- company_members
DROP POLICY IF EXISTS "Admins can view all members" ON public.company_members;
CREATE POLICY "Admins can view all members"
  ON public.company_members FOR SELECT TO authenticated
  USING (public.is_admin());

-- payments
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'payments') THEN
    EXECUTE 'DROP POLICY IF EXISTS "Admins can view all payments" ON public.payments';
    EXECUTE 'CREATE POLICY "Admins can view all payments"
      ON public.payments FOR SELECT TO authenticated
      USING (public.is_admin())';
  END IF;
END $$;

-- --------------------------------------------
-- POLÍTICAS DE GESTIÓN PARA ADMINS
-- (borrar turnos, pagos, invitaciones y perfiles)
-- --------------------------------------------

DROP POLICY IF EXISTS "Admins can delete any shift" ON public.work_shifts;
CREATE POLICY "Admins can delete any shift"
  ON public.work_shifts FOR DELETE TO authenticated
  USING (public.is_admin());

DROP POLICY IF EXISTS "Admins can delete any member" ON public.company_members;
CREATE POLICY "Admins can delete any member"
  ON public.company_members FOR DELETE TO authenticated
  USING (public.is_admin());

DROP POLICY IF EXISTS "Admins can delete any profile" ON public.profiles;
CREATE POLICY "Admins can delete any profile"
  ON public.profiles FOR DELETE TO authenticated
  USING (public.is_admin() AND id <> auth.uid());

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'payments') THEN
    EXECUTE 'DROP POLICY IF EXISTS "Admins can delete any payment" ON public.payments';
    EXECUTE 'CREATE POLICY "Admins can delete any payment"
      ON public.payments FOR DELETE TO authenticated
      USING (public.is_admin())';
  END IF;
END $$;
