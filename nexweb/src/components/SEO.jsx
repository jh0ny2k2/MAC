import { Helmet } from 'react-helmet-async'

const SITE_URL = 'https://newwebdesing.netlify.app'
const DEFAULT_IMAGE = '/logo.png'
const SITE_NAME = 'NexWeb'

export default function SEO({
  title,
  description,
  keywords,
  image = DEFAULT_IMAGE,
  url,
  type = 'website',
  schema = null,
  publishedTime,
  author,
  noIndex = false,
  children,
}) {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME
  const canonical = url ? `${SITE_URL}${url}` : SITE_URL
  const imgUrl = image?.startsWith('http') ? image : `${SITE_URL}${image}`

  const defaultSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: fullTitle,
    description,
    url: canonical,
    inLanguage: 'es',
    isPartOf: {
      '@type': 'WebSite',
      name: SITE_NAME,
      url: SITE_URL,
    },
  }

  const fullSchema = schema || defaultSchema

  return (
    <Helmet>
      <html lang="es" />
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <link rel="canonical" href={canonical} />
      <meta name="robots" content={noIndex ? 'noindex,nofollow' : 'index,follow,max-image-preview:large'} />
      <meta name="author" content={author || SITE_NAME} />
      <meta name="referrer" content="origin-when-cross-origin" />

      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content="es_ES" />
      <meta property="og:image" content={imgUrl} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={title || SITE_NAME} />
      {publishedTime && <meta property="article:published_time" content={publishedTime} />}

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imgUrl} />
      <meta name="twitter:image:alt" content={title || SITE_NAME} />

      <script type="application/ld+json">
        {JSON.stringify(fullSchema)}
      </script>

      {children}
    </Helmet>
  )
}
