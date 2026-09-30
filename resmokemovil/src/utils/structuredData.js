// Utilidades para generar structured data (JSON-LD) para SEO

/**
 * Genera structured data para un producto individual
 * @param {Object} product - Objeto del producto
 * @returns {Object} - JSON-LD structured data
 */
export const generateProductStructuredData = (product) => {
  if (!product) return null;

  const siteUrl = 'https://resmoke.es';

  const resolveAbsoluteUrl = (value) => {
    if (!value) return undefined;
    if (typeof value !== 'string') return undefined;
    if (value.startsWith('http://') || value.startsWith('https://')) return value;
    if (value.startsWith('/')) return `${siteUrl}${value}`;
    return `${siteUrl}/${value}`;
  };

  const price =
    product.precio ??
    product.price ??
    product.amount ??
    product.offers?.price ??
    product.offers?.amount;
  const currency =
    product.currency ||
    product.priceCurrency ||
    product.offers?.priceCurrency ||
    product.offers?.currency ||
    'EUR';
  const imageCandidate =
    product.imagen_url ||
    product.image ||
    product.main_image ||
    (Array.isArray(product.images) ? product.images[0] : undefined) ||
    undefined;
  const isAvailable =
    product.disponible ??
    product.available ??
    (typeof product.status === 'string' ? product.status === 'available' : undefined) ??
    (typeof product.offers?.availability === 'string'
      ? product.offers.availability.toLowerCase() === 'instock'
      : undefined);

  return {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": product.nombre || product.title || product.name,
    "description": product.descripcion || product.description,
    "image": resolveAbsoluteUrl(imageCandidate),
    "brand": {
      "@type": "Brand",
      "name": product.brand || product.marca || "Resmoke"
    },
    "offers": {
      "@type": "Offer",
      "price": price,
      "priceCurrency": currency,
      "availability": isAvailable === false ? "https://schema.org/OutOfStock" : "https://schema.org/InStock",
      "seller": {
        "@type": "Organization",
        "name": "Resmoke"
      }
    },
    "category": product.categoria || product.category,
    "condition": "https://schema.org/UsedCondition",
    "url": resolveAbsoluteUrl(product.url || `/product/${product.id}`)
  };
};

/**
 * Genera structured data para una lista de productos
 * @param {Array} products - Array de productos
 * @returns {Object} - JSON-LD structured data
 */
export const generateProductListStructuredData = (products) => {
  if (!products || products.length === 0) return null;

  return {
    "@context": "https://schema.org/",
    "@type": "ItemList",
    "numberOfItems": products.length,
    "itemListElement": products.map((product, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": generateProductStructuredData(product)
    }))
  };
};

/**
 * Genera structured data para la organización/sitio web
 * @returns {Object} - JSON-LD structured data
 */
export const generateOrganizationStructuredData = () => {
  const siteUrl = 'https://resmoke.es';
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Resmoke",
    "url": siteUrl,
    "logo": `${siteUrl}/img/resmoke/logo.png`,
    "description": "Marketplace especializado en cachimbas, vapers, accesorios y productos de segunda mano de calidad.",
    "sameAs": [
      "https://www.facebook.com/resmoke",
      "https://www.instagram.com/resmoke",
      "https://twitter.com/resmoke"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer service",
      "email": "soporte@resmoke.es"
    }
  };
};

/**
 * Genera structured data para breadcrumbs
 * @param {Array} breadcrumbs - Array de breadcrumbs [{name, url}]
 * @returns {Object} - JSON-LD structured data
 */
export const generateBreadcrumbStructuredData = (breadcrumbs) => {
  if (!breadcrumbs || breadcrumbs.length === 0) return null;

  const siteUrl = 'https://resmoke.es';
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs.map((breadcrumb, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": breadcrumb.name,
      "item": `${siteUrl}${breadcrumb.url}`
    }))
  };
};

/**
 * Genera structured data para una página web
 * @param {Object} pageData - Datos de la página
 * @returns {Object} - JSON-LD structured data
 */
export const generateWebPageStructuredData = (pageData) => {
  const siteUrl = 'https://resmoke.es';
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": pageData.title,
    "description": pageData.description,
    "url": `${siteUrl}${pageData.url}`,
    "isPartOf": {
      "@type": "WebSite",
      "name": "Resmoke",
      "url": siteUrl
    },
    "about": {
      "@type": "Thing",
      "name": pageData.about || "Marketplace de productos"
    }
  };
};

export const generateCollectionPageStructuredData = (pageData) => {
  if (!pageData) return null;
  const siteUrl = 'https://resmoke.es';
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": pageData.title,
    "description": pageData.description,
    "url": `${siteUrl}${pageData.url}`,
    "isPartOf": {
      "@type": "WebSite",
      "name": "Resmoke",
      "url": siteUrl
    }
  };
};

/**
 * Genera structured data para el sitio web principal
 * @returns {Object} - JSON-LD structured data
 */
export const generateWebSiteStructuredData = () => {
  const siteUrl = 'https://resmoke.es';
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Resmoke",
    "url": siteUrl,
    "description": "Marketplace especializado en cachimbas, vapers, accesorios y productos de segunda mano de calidad.",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${siteUrl}/productos?search={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    }
  };
};
