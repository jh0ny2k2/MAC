exports.handler = async (event) => {
  try {
    if (event.httpMethod !== 'POST') {
      return { statusCode: 405, body: JSON.stringify({ error: 'Method Not Allowed' }) };
    }
    const { Resend } = require('resend');
    const { createClient } = require('@supabase/supabase-js');
    const payload = JSON.parse(event.body || '{}');
    const email = String(payload.email || '').toLowerCase().trim();
    const nombre = String(payload.nombre || '').trim();
    if (!email) return { statusCode: 400, body: JSON.stringify({ success: false, error: 'email requerido' }) };
    const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!supabaseUrl) return { statusCode: 500, body: JSON.stringify({ success: false, error: 'SUPABASE_URL no configurada' }) };
    if (!serviceKey) return { statusCode: 500, body: JSON.stringify({ success: false, error: 'SUPABASE_SERVICE_ROLE_KEY no configurada' }) };
    const supabase = createClient(supabaseUrl, serviceKey);
    const { data: user } = await supabase.from('Users').select('id,email').eq('email', email).maybeSingle();
    if (!user) return { statusCode: 404, body: JSON.stringify({ success: false, error: 'usuario no encontrado' }) };
    const secret = process.env.EMAIL_VERIFICATION_SECRET;
    if (!secret) return { statusCode: 500, body: JSON.stringify({ success: false, error: 'EMAIL_VERIFICATION_SECRET no configurada' }) };
    const crypto = require('crypto');
    const iat = Math.floor(Date.now() / 1000);
    const exp = iat + 60 * 60;
    const base64url = (s) => Buffer.from(s).toString('base64url');
    const sig = crypto.createHmac('sha256', secret).update(`${email}:${iat}:${exp}:1`).digest('base64url');
    const token = `${base64url(email)}.${base64url(String(iat))}.${base64url(String(exp))}.${sig}`;

    const code = String(crypto.randomInt(0, 1000000)).padStart(6, '0');
    const codeHash = crypto.createHmac('sha256', secret).update(code).digest('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString();
    const { error: saveError } = await supabase
      .from('Users')
      .update({
        email_verification_code_hash: codeHash,
        email_verification_code_expires_at: expiresAt
      })
      .eq('id', user.id);
    if (saveError) return { statusCode: 500, body: JSON.stringify({ success: false, error: saveError.message }) };

    const appBaseUrl = process.env.APP_BASE_URL;
    const verifyUrl = appBaseUrl ? `${appBaseUrl}/verificacion-identidad` : '';
    const resendApiKey = process.env.RESEND_API_KEY;
    if (!resendApiKey) return { statusCode: 500, body: JSON.stringify({ success: false, error: 'RESEND_API_KEY no configurada' }) };
    const resend = new Resend(resendApiKey);
    const html = `<!DOCTYPE html><html><body style="font-family:Arial"><div style="max-width:560px;margin:24px auto;padding:24px;border:1px solid #e5e7eb;border-radius:12px"><h1 style="font-size:20px;margin:0 0 12px 0">Código de verificación</h1><p>Hola ${nombre || ''}, tu código es:</p><div style="font-size:24px;font-weight:700;letter-spacing:3px">${code}</div><p>Este código caduca en 1 hora.</p><p>Vuelve a Resmoke y pégalo en el modal para finalizar.</p>${verifyUrl ? `<p><a href="${verifyUrl}" style="display:inline-block;background:#111111;color:#fff;padding:12px 18px;border-radius:8px;text-decoration:none">Abrir Resmoke</a></p>` : ''}</div></body></html>`;
    const from = process.env.EMAIL_FROM || 'Resmoke <onboarding@resend.dev>';
    const sent = await resend.emails.send({ from, to: [email], subject: 'Tu código de verificación', html });
    const id = sent?.id || sent?.data?.id || null;
    return { statusCode: 200, body: JSON.stringify({ success: true, token, id }) };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ success: false, error: err.message }) };
  }
};
