exports.handler = async (event) => {
  try {
    if (event.httpMethod !== 'POST') return { statusCode: 405, body: JSON.stringify({ error: 'Method Not Allowed' }) };
    const { createClient } = require('@supabase/supabase-js');
    const crypto = require('crypto');
    const payload = JSON.parse(event.body || '{}');
    const token = String(payload.token || '');
    const codeInput = String(payload.code || '').toUpperCase().trim();
    if (!token || !codeInput) return { statusCode: 400, body: JSON.stringify({ success: false, error: 'token y code requeridos' }) };
    const secret = process.env.EMAIL_VERIFICATION_SECRET;
    if (!secret) return { statusCode: 500, body: JSON.stringify({ success: false, error: 'EMAIL_VERIFICATION_SECRET no configurada' }) };
    const parts = token.split('.');
    if (parts.length !== 4) return { statusCode: 400, body: JSON.stringify({ success: false, error: 'token inválido' }) };
    const base64urlToStr = (b) => Buffer.from(b, 'base64url').toString();
    const email = base64urlToStr(parts[0]);
    const iat = parseInt(base64urlToStr(parts[1]));
    const exp = parseInt(base64urlToStr(parts[2]));
    const sig = parts[3];
    const expected = crypto.createHmac('sha256', secret).update(`${email}:${iat}:${exp}:1`).digest('base64url');
    if (expected !== sig) return { statusCode: 400, body: JSON.stringify({ success: false, error: 'firma inválida' }) };
    if (Math.floor(Date.now() / 1000) > exp) return { statusCode: 400, body: JSON.stringify({ success: false, error: 'token expirado' }) };
    const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!supabaseUrl) return { statusCode: 500, body: JSON.stringify({ success: false, error: 'SUPABASE_URL no configurada' }) };
    if (!serviceKey) return { statusCode: 500, body: JSON.stringify({ success: false, error: 'SUPABASE_SERVICE_ROLE_KEY no configurada' }) };
    const supabase = createClient(supabaseUrl, serviceKey);

    const normalizedEmail = email.toLowerCase().trim();
    const { data: user, error: fetchError } = await supabase
      .from('Users')
      .select('id,is_verified,email_verification_code_hash,email_verification_code_expires_at')
      .eq('email', normalizedEmail)
      .maybeSingle();
    if (fetchError) return { statusCode: 500, body: JSON.stringify({ success: false, error: fetchError.message }) };
    if (!user) return { statusCode: 404, body: JSON.stringify({ success: false, error: 'usuario no encontrado' }) };
    if (user.is_verified) return { statusCode: 200, body: JSON.stringify({ success: true }) };
    if (!user.email_verification_code_hash || !user.email_verification_code_expires_at) {
      return { statusCode: 400, body: JSON.stringify({ success: false, error: 'no hay verificación pendiente' }) };
    }
    const expiresAtMs = Date.parse(user.email_verification_code_expires_at);
    if (!expiresAtMs || Date.now() > expiresAtMs) {
      return { statusCode: 400, body: JSON.stringify({ success: false, error: 'código expirado' }) };
    }
    const codeHash = crypto.createHmac('sha256', secret).update(codeInput).digest('hex');
    if (codeHash !== user.email_verification_code_hash) {
      return { statusCode: 400, body: JSON.stringify({ success: false, error: 'código incorrecto' }) };
    }
    const { error: updateError } = await supabase
      .from('Users')
      .update({
        is_verified: true,
        email_verification_code_hash: null,
        email_verification_code_expires_at: null
      })
      .eq('id', user.id);
    if (updateError) return { statusCode: 500, body: JSON.stringify({ success: false, error: updateError.message }) };
    return { statusCode: 200, body: JSON.stringify({ success: true }) };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ success: false, error: err.message }) };
  }
};
