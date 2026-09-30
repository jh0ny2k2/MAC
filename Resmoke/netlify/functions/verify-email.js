exports.handler = async (event) => {
  try {
    if (event.httpMethod === 'OPTIONS') {
      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Allow-Methods': 'GET, OPTIONS'
        },
        body: ''
      };
    }
    if (event.httpMethod !== 'GET') {
      return {
        statusCode: 405,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type'
        },
        body: JSON.stringify({ error: 'Method Not Allowed' })
      };
    }
    const url = new URL(event.rawUrl || `https://${event.headers.host}${event.path}${event.rawQuery ? '?' + event.rawQuery : ''}`);
    const token = url.searchParams.get('token');
    const emailParam = url.searchParams.get('email');
    if (!token && !emailParam) {
      return { statusCode: 400, headers: { 'Access-Control-Allow-Origin': '*' }, body: JSON.stringify({ success: false, error: 'token o email requerido' }) };
    }
    const { createClient } = require('@supabase/supabase-js');
    const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!supabaseUrl) return { statusCode: 500, headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' }, body: JSON.stringify({ success: false, error: 'SUPABASE_URL no configurada' }) };
    if (!serviceKey) return { statusCode: 500, headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' }, body: JSON.stringify({ success: false, error: 'SUPABASE_SERVICE_ROLE_KEY no configurada' }) };
    const supabase = createClient(supabaseUrl, serviceKey);
    if (emailParam) {
      const { error } = await supabase.from('Users').update({ is_verified: true }).eq('email', emailParam.toLowerCase().trim());
      if (error) return { statusCode: 500, headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' }, body: JSON.stringify({ success: false, error: error.message }) };
      return { statusCode: 302, headers: { 'Access-Control-Allow-Origin': '*', Location: '/verificacion-identidad' }, body: '' };
    }
    const crypto = require('crypto');
    const secret = process.env.EMAIL_VERIFICATION_SECRET;
    if (!secret) return { statusCode: 500, headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' }, body: JSON.stringify({ success: false, error: 'EMAIL_VERIFICATION_SECRET no configurada' }) };
    const parts = String(token).split('.');
    if (parts.length !== 4) return { statusCode: 400, body: JSON.stringify({ success: false, error: 'token inválido' }) };
    const base64urlToStr = (b) => Buffer.from(b, 'base64url').toString();
    const email = base64urlToStr(parts[0]);
    const iat = parseInt(base64urlToStr(parts[1]));
    const exp = parseInt(base64urlToStr(parts[2]));
    const sig = parts[3];
    const expected = crypto.createHmac('sha256', secret).update(`${email}:${iat}:${exp}:1`).digest('base64url');
    if (expected !== sig) return { statusCode: 400, body: JSON.stringify({ success: false, error: 'firma inválida' }) };
    if (Math.floor(Date.now() / 1000) > exp) return { statusCode: 400, body: JSON.stringify({ success: false, error: 'token expirado' }) };
    const appBaseUrl = process.env.APP_BASE_URL || '';
    const redirect = `${appBaseUrl}/verificacion-identidad?token=${encodeURIComponent(token)}`;
    return { statusCode: 302, headers: { 'Access-Control-Allow-Origin': '*', Location: redirect }, body: '' };
  } catch (err) {
    return {
      statusCode: 500,
      headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' },
      body: JSON.stringify({ success: false, error: err.message })
    };
  }
};
