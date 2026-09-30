const bcrypt = require('bcryptjs');

const { createClient } = require('@supabase/supabase-js');

const getSupabase = () => {
  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl) throw new Error('SUPABASE_URL no configurada');
  if (!serviceKey) throw new Error('SUPABASE_SERVICE_ROLE_KEY no configurada');
  return createClient(supabaseUrl, serviceKey);
};

exports.handler = async (event) => {
  try {
    if (event.httpMethod !== 'POST') {
      return { statusCode: 405, body: JSON.stringify({ error: 'Method Not Allowed' }) };
    }
    const payload = JSON.parse(event.body || '{}');
    const action = payload.action || event.path.split('/').pop();
    const supabase = getSupabase();

    switch (action) {
      case 'register': {
        const { nombre, email, password, telefono, fecha_nacimiento } = payload;
        if (!nombre || !email || !password) {
          return { statusCode: 400, body: JSON.stringify({ success: false, error: 'nombre, email y password son requeridos' }) };
        }
        const normalizedEmail = email.toLowerCase().trim();
        const { data: existing } = await supabase.from('Users').select('id').eq('email', normalizedEmail).maybeSingle();
        if (existing) {
          return { statusCode: 409, body: JSON.stringify({ success: false, error: 'Ya existe una cuenta con este correo electrónico' }) };
        }
        const hashedPassword = await bcrypt.hash(password, 12);
        const { data: newUser, error: insertError } = await supabase
          .from('Users')
          .insert({
            nombre: nombre.trim(),
            email: normalizedEmail,
            telefono: (telefono || '').trim(),
            fecha_nacimiento: fecha_nacimiento || null,
            password: hashedPassword,
            rol: 'usuario',
            creado_en: new Date().toISOString()
          })
          .select()
          .single();
        if (insertError) {
          return { statusCode: 500, body: JSON.stringify({ success: false, error: insertError.message }) };
        }
        const { password: _, ...userWithoutPassword } = newUser;
        return { statusCode: 201, body: JSON.stringify({ success: true, user: userWithoutPassword }) };
      }

      case 'login': {
        const { email, password } = payload;
        if (!email || !password) {
          return { statusCode: 400, body: JSON.stringify({ success: false, error: 'email y password son requeridos' }) };
        }
        const normalizedEmail = email.toLowerCase().trim();
        const { data: user, error } = await supabase
          .from('Users')
          .select('*')
          .eq('email', normalizedEmail)
          .maybeSingle();
        if (error) return { statusCode: 500, body: JSON.stringify({ success: false, error: error.message }) };
        if (!user) return { statusCode: 401, body: JSON.stringify({ success: false, error: 'Credenciales incorrectas' }) };
        if (!user.password) {
          return { statusCode: 401, body: JSON.stringify({ success: false, error: 'Esta cuenta usa Google. Inicia sesión con Google.' }) };
        }
        let passwordMatch = false;
        try { passwordMatch = await bcrypt.compare(password, user.password); } catch (_) {}
        if (!passwordMatch) {
          try {
            const hash = require('hash.js');
            const sha256 = hash.sha256().update(password).digest('hex');
            if (sha256 === user.password) {
              passwordMatch = true;
              const newHash = await bcrypt.hash(password, 12);
              await supabase.from('Users').update({ password: newHash }).eq('id', user.id);
            }
          } catch (_) {}
        }
        if (!passwordMatch) {
          return { statusCode: 401, body: JSON.stringify({ success: false, error: 'Credenciales incorrectas' }) };
        }
        await supabase.from('Users').update({ ultimo_acceso: new Date().toISOString() }).eq('id', user.id);
        const { password: _, ...userWithoutPassword } = user;
        return { statusCode: 200, body: JSON.stringify({ success: true, user: userWithoutPassword }) };
      }

      case 'change-password': {
        const { userId, currentPassword, newPassword } = payload;
        if (!userId || !currentPassword || !newPassword) {
          return { statusCode: 400, body: JSON.stringify({ success: false, error: 'userId, currentPassword y newPassword son requeridos' }) };
        }
        const { data: user, error } = await supabase
          .from('Users')
          .select('password')
          .eq('id', userId)
          .maybeSingle();
        if (error) return { statusCode: 500, body: JSON.stringify({ success: false, error: error.message }) };
        if (!user) return { statusCode: 404, body: JSON.stringify({ success: false, error: 'Usuario no encontrado' }) };
        if (!user.password) {
          return { statusCode: 400, body: JSON.stringify({ success: false, error: 'Esta cuenta usa Google. No puedes cambiar la contraseña.' }) };
        }
        let passwordMatch = false;
        try { passwordMatch = await bcrypt.compare(currentPassword, user.password); } catch (_) {}
        if (!passwordMatch) {
          try {
            const hash = require('hash.js');
            const sha256 = hash.sha256().update(currentPassword).digest('hex');
            if (sha256 === user.password) passwordMatch = true;
          } catch (_) {}
        }
        if (!passwordMatch) {
          return { statusCode: 401, body: JSON.stringify({ success: false, error: 'La contraseña actual es incorrecta' }) };
        }
        const hashedPassword = await bcrypt.hash(newPassword, 12);
        const { error: updateError } = await supabase
          .from('Users')
          .update({ password: hashedPassword })
          .eq('id', userId);
        if (updateError) return { statusCode: 500, body: JSON.stringify({ success: false, error: updateError.message }) };
        return { statusCode: 200, body: JSON.stringify({ success: true, message: 'Contraseña actualizada exitosamente' }) };
      }

      case 'reset-password': {
        const { token, email: rEmail, newPassword } = payload;
        if (!token || !rEmail || !newPassword) {
          return { statusCode: 400, body: JSON.stringify({ success: false, error: 'token, email y newPassword son requeridos' }) };
        }
        const { data: tokenRecord, error: tokenError } = await supabase
          .from('password_reset_tokens')
          .select('*')
          .eq('token', token)
          .eq('email', rEmail.toLowerCase().trim())
          .eq('used', false)
          .single();
        if (tokenError || !tokenRecord) {
          return { statusCode: 400, body: JSON.stringify({ success: false, error: 'Token inválido o expirado' }) };
        }
        if (new Date(tokenRecord.expires_at) < new Date()) {
          return { statusCode: 400, body: JSON.stringify({ success: false, error: 'Token expirado' }) };
        }
        const hashedPassword = await bcrypt.hash(newPassword, 12);
        const { error: updateError } = await supabase
          .from('Users')
          .update({ password: hashedPassword })
          .eq('email', rEmail.toLowerCase().trim());
        if (updateError) return { statusCode: 500, body: JSON.stringify({ success: false, error: updateError.message }) };
        await supabase.from('password_reset_tokens').update({ used: true }).eq('id', tokenRecord.id);
        return { statusCode: 200, body: JSON.stringify({ success: true, message: 'Contraseña actualizada exitosamente' }) };
      }

      default:
        return { statusCode: 400, body: JSON.stringify({ success: false, error: 'Acción no válida' }) };
    }
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ success: false, error: err.message }) };
  }
};
