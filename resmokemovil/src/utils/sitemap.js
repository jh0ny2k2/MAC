// Utilidades para generar sitemap dinámico

/**
 * Genera el contenido XML del sitemap
 * @param {Array} urls - Array de URLs con sus metadatos
 * @returns {string} - Contenido XML del sitemap
 */
export const generateSitemapXML = (urls) => {
  const baseUrl = 'https://resmoke.es';
  const currentDate = new Date().toISOString().split('T')[0];

  const urlsXML = urls.map(url => {
    const loc = `${baseUrl}${url.path}`;
    const lastmod = url.lastmod || currentDate;
    const changefreq = url.changefreq || 'weekly';
    const priority = url.priority || '0.5';

    return `  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
  }).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlsXML}
</urlset>`;
};

/**
 * Obtiene las URLs estáticas del sitio
 * @returns {Array} - Array de URLs estáticas
 */
export const getStaticUrls = () => {
  return [
    {
      path: '/',
      changefreq: 'daily',
      priority: '1.0'
    },
    {
      path: '/welcome',
      changefreq: 'daily',
      priority: '0.9'
    },
    {
      path: '/productos',
      changefreq: 'weekly',
      priority: '0.8'
    },
    {
      path: '/about',
      changefreq: 'monthly',
      priority: '0.6'
    },
    {
      path: '/contacto',
      changefreq: 'monthly',
      priority: '0.6'
    },
    {
      path: '/como-comprar',
      changefreq: 'monthly',
      priority: '0.5'
    },
    {
      path: '/metodos-pago',
      changefreq: 'monthly',
      priority: '0.5'
    },
    {
      path: '/como-publicar',
      changefreq: 'monthly',
      priority: '0.5'
    },
    {
      path: '/tutoriales',
      changefreq: 'monthly',
      priority: '0.5'
    },
    {
      path: '/aviso-legal',
      changefreq: 'yearly',
      priority: '0.3'
    },
    {
      path: '/privacidad',
      changefreq: 'yearly',
      priority: '0.3'
    },
    {
      path: '/cookies',
      changefreq: 'yearly',
      priority: '0.3'
    },
    {
      path: '/terminos',
      changefreq: 'yearly',
      priority: '0.3'
    }
  ];
};

/**
 * Genera URLs dinámicas para productos
 * @param {Array} products - Array de productos
 * @returns {Array} - Array de URLs de productos
 */
export const getProductUrls = (products) => {
  if (!products || products.length === 0) return [];

  return products.map(product => ({
    path: `/product/${product.id}`,
    lastmod: product.updated_at ? new Date(product.updated_at).toISOString().split('T')[0] : undefined,
    changefreq: 'weekly',
    priority: '0.7'
  }));
};

export const slugify = (value) => {
  if (value === null || value === undefined) return '';
  return String(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

export const getCategoryPath = (category) => {
  const id = category?.id;
  if (!id) return '/productos';
  const name = category?.name ?? category?.nombre ?? '';
  const slug = slugify(name) || String(id);
  return `/categoria/${id}-${slug}`;
};

/**
 * Genera URLs dinámicas para categorías
 * @param {Array} categories - Array de categorías
 * @returns {Array} - Array de URLs de categorías
 */
export const getCategoryUrls = (categories) => {
  if (!categories || categories.length === 0) return [];

  return categories.map(category => ({
    path: getCategoryPath(category),
    changefreq: 'weekly',
    priority: '0.8'
  }));
};

/**
 * Genera URLs dinámicas para perfiles de usuarios públicos
 * @param {Array} users - Array de usuarios con perfiles públicos
 * @returns {Array} - Array de URLs de perfiles
 */
export const getUserProfileUrls = (users) => {
  if (!users || users.length === 0) return [];

  return users.map(user => ({
    path: `/seller/${user.id}`,
    changefreq: 'monthly',
    priority: '0.6'
  }));
};

/**
 * Combina todas las URLs para el sitemap completo
 * @param {Object} data - Objeto con productos, categorías, etc.
 * @returns {Array} - Array completo de URLs
 */
export const getAllUrls = (data = {}) => {
  const { products = [], categories = [], users = [] } = data;

  return [
    ...getStaticUrls(),
    ...getProductUrls(products),
    ...getCategoryUrls(categories),
    ...getUserProfileUrls(users)
  ];
};

/**
 * Genera el sitemap completo
 * @param {Object} data - Datos para generar URLs dinámicas
 * @returns {string} - XML del sitemap completo
 */
export const generateCompleteSitemap = (data) => {
  const allUrls = getAllUrls(data);
  return generateSitemapXML(allUrls);
};
