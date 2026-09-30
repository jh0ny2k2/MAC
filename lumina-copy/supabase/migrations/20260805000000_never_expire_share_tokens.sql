-- Make shared album links never expire
-- Shared albums are meant to keep working (guests upload via token, no login).
-- Previously tokens expired 30 days after creation, breaking old links.

-- 1. Change DB default so new tokens never expire
ALTER TABLE public_share_tokens ALTER COLUMN expires_at SET DEFAULT NULL;

-- 2. Remove expiry from existing tokens
UPDATE public_share_tokens SET expires_at = NULL WHERE expires_at IS NOT NULL;

-- 3. Update the generator to always create non-expiring tokens
CREATE OR REPLACE FUNCTION generate_share_token(p_memory_id uuid)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_token text;
BEGIN
  -- Check ownership
  IF NOT EXISTS (SELECT 1 FROM memories WHERE id = p_memory_id AND user_id = auth.uid()) THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;

  -- Check if token exists
  SELECT token INTO v_token
  FROM public_share_tokens
  WHERE memory_id = p_memory_id
  AND (expires_at IS NULL OR expires_at > now())
  LIMIT 1;

  IF v_token IS NOT NULL THEN
    RETURN v_token;
  END IF;

  -- Create new token (non-expiring)
  v_token := encode(gen_random_bytes(16), 'hex');

  INSERT INTO public_share_tokens (memory_id, token, expires_at)
  VALUES (p_memory_id, v_token, NULL);

  RETURN v_token;
END;
$$;
