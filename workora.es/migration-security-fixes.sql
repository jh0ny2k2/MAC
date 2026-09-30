-- ============================================
-- MIGRACIÓN: FIXES DE SEGURIDAD
-- Ejecutar en el SQL Editor de Supabase
-- (una sola vez, después de las migraciones previas)
-- ============================================

-- ============================================
-- 1. INVITACIONES
--    Elimina las políticas con USING(true) y las
--    sustituye por acceso ligado al usuario (email/user_id)
--    + RPCs con validación en servidor.
-- ============================================

-- 1.1 Quitar políticas inseguras
DROP POLICY IF EXISTS "Anyone can view invitation by token" ON public.company_members;
DROP POLICY IF EXISTS "Users can accept own invitation by token" ON public.company_members;

-- 1.2 Expiración de invitaciones (30 días por defecto)
ALTER TABLE public.company_members
  ADD COLUMN IF NOT EXISTS expires_at TIMESTAMPTZ DEFAULT (now() + interval '30 days');

-- 1.3 Solo puedes ver tus propias invitaciones (por email o user_id)
DROP POLICY IF EXISTS "Users can view their invitations by email" ON public.company_members;
CREATE POLICY "Users can view their invitations by email"
  ON public.company_members FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR lower(email) = lower(auth.jwt()->>'email'));

-- 1.4 Solo puedes aceptar/rechazar tus propias invitaciones pendientes
DROP POLICY IF EXISTS "Users can accept their invitations by email" ON public.company_members;
CREATE POLICY "Users can accept their invitations by email"
  ON public.company_members FOR UPDATE TO authenticated
  USING (user_id = auth.uid() OR lower(email) = lower(auth.jwt()->>'email'))
  WITH CHECK (
    (user_id = auth.uid() OR lower(email) = lower(auth.jwt()->>'email'))
    AND OLD.status = 'pending'
    AND NEW.status IN ('accepted', 'rejected')
    AND (OLD.expires_at IS NULL OR OLD.expires_at > now())
  );

-- 1.5 RPC: ver invitación por token (el token es el secreto)
CREATE OR REPLACE FUNCTION public.get_invitation(token uuid)
RETURNS TABLE (
  id uuid,
  company_id uuid,
  email text,
  hourly_rate numeric,
  status text,
  company_name text,
  expires_at timestamptz
)
LANGUAGE sql SECURITY DEFINER SET search_path = public
AS $$
  SELECT m.id, m.company_id, m.email, m.hourly_rate, m.status, c.name, m.expires_at
  FROM public.company_members m
  LEFT JOIN public.companies c ON c.id = m.company_id
  WHERE m.invitation_token = token;
$$;

GRANT EXECUTE ON FUNCTION public.get_invitation(uuid) TO anon, authenticated;

-- 1.6 RPC: aceptar invitación por token (validación en servidor)
CREATE OR REPLACE FUNCTION public.accept_invitation(token uuid)
RETURNS uuid
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  inv public.company_members%ROWTYPE;
  uid uuid := auth.uid();
  existing_role text;
BEGIN
  IF uid IS NULL THEN
    RAISE EXCEPTION 'Debes iniciar sesión para aceptar la invitación';
  END IF;

  SELECT * INTO inv FROM public.company_members WHERE invitation_token = token;
  IF NOT FOUND THEN RAISE EXCEPTION 'Invitación no válida'; END IF;
  IF inv.status <> 'pending' THEN
    RAISE EXCEPTION 'Esta invitación ya fue aceptada o rechazada';
  END IF;
  IF inv.expires_at IS NOT NULL AND inv.expires_at < now() THEN
    RAISE EXCEPTION 'Esta invitación ha caducado';
  END IF;
  IF inv.email LIKE '%@%' AND lower(inv.email) <> lower(coalesce(auth.jwt()->>'email', '')) THEN
    RAISE EXCEPTION 'Esta invitación está dirigida a otro correo';
  END IF;

  SELECT role INTO existing_role FROM public.profiles WHERE id = uid;
  IF FOUND AND existing_role <> 'individual' THEN
    RAISE EXCEPTION 'Tu cuenta ya tiene un rol asignado';
  END IF;

  UPDATE public.company_members
  SET status = 'accepted', user_id = uid
  WHERE id = inv.id;

  INSERT INTO public.profiles (id, role, company_id, hourly_rate, role_changed, full_name)
  VALUES (uid, 'employee', inv.company_id, inv.hourly_rate, true, '')
  ON CONFLICT (id) DO UPDATE SET
    role = 'employee',
    company_id = EXCLUDED.company_id,
    hourly_rate = EXCLUDED.hourly_rate,
    role_changed = true;

  RETURN inv.company_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.accept_invitation(uuid) TO authenticated;

-- ============================================
-- 2. PERFILES: el rol solo puede cambiarse UNA vez.
--    El usuario puede tocar su perfil, pero si toca role/role_changed
--    debe pasar de role_changed=false a true.
-- ============================================
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id
    AND (
      (NEW.role = OLD.role AND NEW.role_changed IS NOT DISTINCT FROM OLD.role_changed)
      OR (OLD.role_changed = false AND NEW.role_changed = true)
    )
  );

-- ============================================
-- 3. WORK_SHIFTS: el empleado NO puede auto-aprobar.
--    Conserva editar/borrar sus turnos, pero `approved`
--    solo puede ser modificado por el dueño.
-- ============================================
DROP POLICY IF EXISTS "Users can update their own shifts" ON public.work_shifts;

CREATE POLICY "Users can update their own shifts"
  ON public.work_shifts FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id AND NEW.approved = OLD.approved);
