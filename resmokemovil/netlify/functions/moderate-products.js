exports.config = {
  schedule: '*/10 * * * *'
};

const escapeHtml = (value) =>
  String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');

const normalize = (value) => {
  return String(value ?? '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
};

const buildBlocklist = () => {
  const categories = {
    sustancias: [
      'cocaina', 'heroina', 'metanfetamina', 'mdma', 'ketamina', 'lsd', 'anfetamina', 
      'marihuana', 'cannabis', 'weed', 'hachis', 'fentanilo', 'crack', 'extasis', 
      'perico', 'cristal', 'tusi', 'hongos', 'psilocibina', 'benzos', 'tramadol'
    ],
    armasYViolencia: [
      'arma', 'pistola', 'rifle', 'municion', 'explosivo', 'escopeta', 'granada', 
      'detonador', 'navaja', 'puñal', 'revolver', 'ametralladora', 'ak47', 'glock',
      'bomba', 'terrorismo', 'atentado', 'sicario', 'asesinato'
    ],
    adulto: [
      'porn', 'porno', 'escort', 'prostitucion', 'menores', 'cp', 'xxx', 'sexo', 
      'hentai', 'voyerismo', 'incesto', 'zoofilia', 'pedofilia', 'violacion', 
      'camgirl', 'onlyfans', 'xvideos', 'pornhub', 'ereccion', 'orgia'
    ],
    odioYHarassment: [
      'nazi', 'holocausto', 'hitler', 'supremacista', 'feminazi'
    ],
    estafasYFraude: [
      'hacking', 'phishing', 'carding', 'binero', 'cuentas gratis', 'clonacion', 
      'estafa', 'piramidal', 'criptoestafa'
    ]
  };

  const categoryTerms = Object.values(categories)
    .flat()
    .map((s) => normalize(s.trim()))
    .filter(Boolean);

  const extra = String(process.env.MODERATION_BLOCKLIST || '')
    .split(',')
    .map((s) => normalize(s.trim()))
    .filter(Boolean);

  return Array.from(new Set([...categoryTerms, ...extra]));
};

const detectViolations = (product) => {
  const violations = [];
  const name = normalize(product?.name);
  const description = normalize(product?.description);
  const location = normalize(product?.location);
  const text = [name, description, location].filter(Boolean).join(' ');

  const blocklist = buildBlocklist();
  for (const term of blocklist) {
    if (term && text.includes(term)) {
      violations.push(`Contiene término no permitido: "${term}"`);
    }
  }

  const hasEmail = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i.test(text);
  if (hasEmail) violations.push('Incluye un correo en el texto');

  const hasPhone = /(\+?\d[\d\s-]{8,}\d)/.test(text);
  if (hasPhone) violations.push('Incluye un número de teléfono en el texto');

  const hasExternalLink = /(https?:\/\/|www\.)/.test(text);
  if (hasExternalLink) violations.push('Incluye un enlace externo en el texto');

  if (!String(product?.name || '').trim()) violations.push('Falta el nombre del producto');
  if (!String(product?.description || '').trim()) violations.push('Falta la descripción del producto');

  const images = [
    product?.main_image,
    product?.extra_image_1,
    product?.extra_image_2,
    product?.extra_image_3,
    product?.extra_image_4
  ].filter(Boolean);

  if (!product?.main_image) violations.push('Falta la foto principal');

  const invalidImages = images.filter((url) => {
    const u = String(url || '');
    if (!u.startsWith('http')) return true;
    if (!/^https?:\/\//i.test(u)) return true;
    if (!/\.(jpg|jpeg|png|webp)(\?.*)?$/i.test(u)) return true;
    return false;
  });
  if (invalidImages.length > 0) violations.push('Hay imágenes con formato o URL inválida');

  return violations;
};

const buildDeveloperHtml = ({ product, user, violations, productUrl, reviewUrl }) => {
  const items = violations.map((v) => `<li>${escapeHtml(v)}</li>`).join('');
  return `<!doctype html><html><body style="font-family:Arial,sans-serif;background:#f9fafb;margin:0;padding:24px">
  <div style="max-width:640px;margin:0 auto;background:#fff;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden">
    <div style="background:#111827;color:#fff;padding:16px 20px;font-weight:700">Resmoke · Moderación automática</div>
    <div style="padding:20px">
      <h1 style="margin:0 0 12px 0;font-size:18px;color:#111827">Producto marcado para revisión humana</h1>
      <p style="margin:0 0 14px 0;color:#374151;font-size:14px">La verificación automática ha rechazado el producto y lo ha pasado a revisión humana.</p>
      <div style="border:1px solid #e5e7eb;border-radius:10px;padding:14px;margin:0 0 14px 0">
        <p style="margin:0 0 8px 0;font-size:14px"><strong>Producto:</strong> ${escapeHtml(product?.name || '')}</p>
        <p style="margin:0 0 8px 0;font-size:14px"><strong>ID:</strong> ${escapeHtml(product?.id || '')}</p>
        <p style="margin:0 0 8px 0;font-size:14px"><strong>Vendedor:</strong> ${escapeHtml(user?.nombre || '')} (${escapeHtml(user?.email || '')})</p>
        <p style="margin:0;font-size:14px"><strong>Ubicación:</strong> ${escapeHtml(product?.location || '')}</p>
      </div>
      <h2 style="margin:0 0 10px 0;font-size:14px;color:#111827">Motivos detectados</h2>
      <ul style="margin:0 0 16px 18px;padding:0;color:#374151;font-size:14px">${items}</ul>
      <div style="display:flex;gap:10px;flex-wrap:wrap">
        <a href="${escapeHtml(productUrl)}" style="display:inline-block;background:#111827;color:#fff;text-decoration:none;padding:10px 14px;border-radius:8px;font-weight:700;font-size:13px">Ver producto</a>
        <a href="${escapeHtml(reviewUrl)}" style="display:inline-block;background:#374151;color:#fff;text-decoration:none;padding:10px 14px;border-radius:8px;font-weight:700;font-size:13px">Panel de revisión</a>
      </div>
      <p style="margin:16px 0 0 0;color:#6b7280;font-size:12px">Este email se envía solo cuando un producto requiere revisión humana.</p>
    </div>
  </div>
  </body></html>`;
};

const buildUserHtml = ({ userName, productName, productUrl }) => {
  return `<!doctype html><html><body style="font-family:Arial,sans-serif;background:#f9fafb;margin:0;padding:24px">
  <div style="max-width:640px;margin:0 auto;background:#fff;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden">
    <div style="background:#111827;color:#fff;padding:16px 20px;font-weight:700">Resmoke</div>
    <div style="padding:20px">
      <h1 style="margin:0 0 12px 0;font-size:18px;color:#111827">Tu producto necesita verificación manual</h1>
      <p style="margin:0 0 14px 0;color:#374151;font-size:14px">Hola ${escapeHtml(userName || '')},</p>
      <p style="margin:0 0 14px 0;color:#374151;font-size:14px">Tu producto <strong>${escapeHtml(productName || '')}</strong> ha sido rechazado por nuestra verificación automática y ha pasado a una segunda verificación humana.</p>
      <p style="margin:0 0 16px 0;color:#374151;font-size:14px">Si todo está correcto, lo aprobamos y se publicará automáticamente. Si necesitamos cambios, te avisaremos.</p>
      <a href="${escapeHtml(productUrl)}" style="display:inline-block;background:#111827;color:#fff;text-decoration:none;padding:10px 14px;border-radius:8px;font-weight:700;font-size:13px">Ver mi producto</a>
      <p style="margin:16px 0 0 0;color:#6b7280;font-size:12px">Gracias por ayudar a mantener Resmoke seguro.</p>
    </div>
  </div>
  </body></html>`;
};

exports.handler = async () => {
  const headers = { 'Content-Type': 'application/json' };
  try {
    const { createClient } = require('@supabase/supabase-js');

    const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl) return { statusCode: 500, headers, body: JSON.stringify({ success: false, error: 'SUPABASE_URL no configurada' }) };
    if (!serviceKey) return { statusCode: 500, headers, body: JSON.stringify({ success: false, error: 'SUPABASE_SERVICE_ROLE_KEY no configurada' }) };

    const supabase = createClient(supabaseUrl, serviceKey);

    const appBaseUrl = process.env.APP_BASE_URL || process.env.URL || 'https://resmoke.es';
    const reviewUrl = `${appBaseUrl.replace(/\/$/, '')}/admin/productos/confirmaciones`;
    const developerEmail = process.env.MODERATION_ALERT_EMAIL || 'developerjhony@gmail.com';

    const { data: products, error } = await supabase
      .from('products')
      .select(
        `
        id,
        name,
        description,
        location,
        status,
        user_id,
        main_image,
        extra_image_1,
        extra_image_2,
        extra_image_3,
        extra_image_4,
        Users!products_user_id_fkey (id, nombre, email)
      `
      )
      .eq('status', 'pending')
      .limit(50);

    if (error) throw error;

    let approved = 0;
    let flagged = 0;
    const processed = [];

    for (const product of products || []) {
      const violations = detectViolations(product);
      const productUrl = `${appBaseUrl.replace(/\/$/, '')}/product/${encodeURIComponent(product.id)}`;

      if (violations.length === 0) {
        const { error: updateError } = await supabase.from('products').update({ status: 'available' }).eq('id', product.id);
        if (updateError) throw updateError;
        approved += 1;
        processed.push({ id: product.id, decision: 'approved' });
        continue;
      }

      const { error: updateError } = await supabase
        .from('products')
        .update({ status: 'pending_human_review' })
        .eq('id', product.id);
      if (updateError) throw updateError;

      flagged += 1;
      processed.push({ id: product.id, decision: 'pending_human_review', violations });
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ success: true, approved, flagged, processedCount: processed.length })
    };
  } catch (err) {
    return { statusCode: 500, headers, body: JSON.stringify({ success: false, error: err.message }) };
  }
};

