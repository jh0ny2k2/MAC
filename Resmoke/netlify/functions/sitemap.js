const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const BASE_URL = 'https://resmoke.es';
const CURRENT_DATE = new Date().toISOString().split('T')[0];

const slugify = (value) => {
  if (value === null || value === undefined) return '';
  return String(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

const getCategoryPath = (category) => {
  const id = category?.id;
  if (!id) return '/productos';
  const name = category?.name ?? category?.nombre ?? '';
  const slug = slugify(name) || String(id);
  return `/categoria/${id}-${slug}`;
};

const getStaticUrls = () => [
  { path: '/', changefreq: 'daily', priority: '1.0' },
  { path: '/welcome', changefreq: 'daily', priority: '0.9' },
  { path: '/productos', changefreq: 'weekly', priority: '0.8' },
  { path: '/about', changefreq: 'monthly', priority: '0.6' },
  { path: '/contacto', changefreq: 'monthly', priority: '0.6' },
  { path: '/como-comprar', changefreq: 'monthly', priority: '0.5' },
  { path: '/metodos-pago', changefreq: 'monthly', priority: '0.5' },
  { path: '/como-publicar', changefreq: 'monthly', priority: '0.5' },
  { path: '/tutoriales', changefreq: 'monthly', priority: '0.5' },
  { path: '/aviso-legal', changefreq: 'yearly', priority: '0.3' },
  { path: '/privacidad', changefreq: 'yearly', priority: '0.3' },
  { path: '/cookies', changefreq: 'yearly', priority: '0.3' },
  { path: '/terminos', changefreq: 'yearly', priority: '0.3' }
];

const generateSitemapXML = (urls) => {
  const urlsXML = urls.map(url => {
    const loc = `${BASE_URL}${url.path}`;
    const lastmod = url.lastmod || CURRENT_DATE;
    const changefreq = url.changefreq || 'weekly';
    const priority = url.priority || '0.5';
    return [
      '  <url>',
      `    <loc>${loc}</loc>`,
      `    <lastmod>${lastmod}</lastmod>`,
      `    <changefreq>${changefreq}</changefreq>`,
      `    <priority>${priority}</priority>`,
      '  </url>'
    ].join('\n');
  }).join('\n');

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    urlsXML,
    '</urlset>'
  ].join('\n');
};

exports.handler = async (event) => {
  const headers = {
    'Content-Type': 'application/xml',
    'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    'Access-Control-Allow-Origin': '*'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return {
      statusCode: 500,
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Missing Supabase credentials' })
    };
  }

  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const [productsResult, categoriesResult] = await Promise.all([
      supabase.from('products').select('id, updated_at').eq('status', 'active'),
      supabase.from('categories').select('id, name')
    ]);

    const products = productsResult.data || [];
    const categories = categoriesResult.data || [];

    const productUrls = products.map(p => ({
      path: `/product/${p.id}`,
      lastmod: p.updated_at ? new Date(p.updated_at).toISOString().split('T')[0] : undefined,
      changefreq: 'weekly',
      priority: '0.7'
    }));

    const categoryUrls = categories.map(c => ({
      path: getCategoryPath(c),
      changefreq: 'weekly',
      priority: '0.8'
    }));

    const allUrls = [...getStaticUrls(), ...productUrls, ...categoryUrls];
    const xml = generateSitemapXML(allUrls);

    return {
      statusCode: 200,
      headers,
      body: xml
    };
  } catch (error) {
    console.error('Sitemap generation error:', error);
    return {
      statusCode: 500,
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Failed to generate sitemap' })
    };
  }
};
