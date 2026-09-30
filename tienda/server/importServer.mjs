/**
 * Servidor local de importación desde AliExpress (MEJOR ESFUERZO).
 *
 * Descarga la página del producto en el servidor (sin CORS, sin capturas en
 * el navegador) e intenta extraer los datos publicados. AliExpress aplica
 * protecciones anti-bot, así que la extracción puede fallar o devolver datos
 * parciales; el frontend cae a datos de demostración en ese caso.
 *
 * No evade bloqueos ni captchas: si la fuente no devuelve la página, se limita
 * a responder con un error para que la UI decida.
 *
 * Uso:  node server/importServer.mjs        (puerto por defecto 8765)
 * Rutas:
 *   GET /health
 *   GET /api/analyze?url=<url-absoluta-de-producto>
 */

import { createServer } from 'node:http'

const PORT = Number(process.env.PORT ?? 8765)
const TIMEOUT_MS = 15000

const HEADERS = {
  'user-agent':
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36',
  accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
  'accept-language': 'es-ES,es;q=0.9,en;q=0.8',
  'cache-control': 'no-cache',
  pragma: 'no-cache',
}

function cleanText(value) {
  return String(value ?? '')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim()
}

function firstOf(patterns, text) {
  for (const pattern of patterns) {
    const match = text.match(pattern)
    if (match?.[1]) return match[1]
  }
  return null
}

function toNumber(value) {
  const n = Number(value)
  return Number.isFinite(n) ? n : null
}

function parsePrice(text) {
  const cents = text.match(/salePriceCents"?\s*:\s*"?(\d+)/i)
  if (cents) {
    const n = Number(cents[1])
    if (Number.isFinite(n) && n > 0) return n / 100
  }

  const priced = firstOf(
    [
      /formatedActivityPriceShortText"?\s*:\s*"?([^"']{1,20})"?/i,
      /formattedPrice"?\s*:\s*"?([^"']{1,20})"?/i,
      /salePrice"?\s*:\s*"?([0-9]+(?:\.[0-9]{1,2})?)"?/i,
    ],
    text,
  )
  if (priced) {
    const n = parseFloat(cleanText(priced).replace(/[^0-9.]/g, ''))
    if (Number.isFinite(n) && n > 0) return n
  }
  return null
}

function parseCurrency(text) {
  const code = text.match(/"currencyCode"?\s*:\s*"([A-Z]{3})"/i)?.[1]
  if (code) return { code: code.toUpperCase(), name: code.toUpperCase(), symbol: '' }
  const symbol = firstOf(
    [
      /<meta[^>]+name=["']description["'][^>]+content=["']([^"']*[€$£][^"']*)["']/i,
      /<meta[^>]+property=["']og:description["'][^>]+content=["']([^"']*[€$£][^"']*)["']/i,
    ],
    text,
  )
  if (symbol?.includes('€')) return { code: 'EUR', name: 'Euro', symbol: '€' }
  if (symbol?.includes('£')) return { code: 'GBP', name: 'Libra esterlina', symbol: '£' }
  return { code: 'USD', name: 'Dólar estadounidense', symbol: '$' }
}

function parseImages(text) {
  const images = []
  const seen = new Set()
  const candidates = [
    ...(text.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/gi) ?? []),
    ...(text.match(/"imagePath"?\s*:\s*"([^"]+)"/gi) ?? []),
  ]
  for (const raw of candidates) {
    const url = cleanText(raw.match(/content=["']([^"']+)["']/i)?.[1] ?? raw.match(/"([^"]+)"/)?.[1])
    if (!url || seen.has(url)) continue
    seen.add(url)
    images.push(url)
    if (images.length >= 6) break
  }
  return images
}

function parse(html, externalId, sourceUrl) {
  const ogTitle = firstOf(
    [
      /<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)["']/i,
      /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:title["']/i,
    ],
    html,
  )
  const title = cleanText(
    ogTitle ??
      firstOf(
        [
          /<meta[^>]+name=["']twitter:title["'][^>]+content=["']([^"']+)["']/i,
          /<title[^>]*>([^<]+)<\/title>/i,
          /<h1[^>]*>([^<]+)<\/h1>/i,
        ],
        html,
      ) ??
      '',
  ).replace(/[-|]\s*AliExpress.*$/i, '')
  const description = firstOf(
    [
      /<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i,
      /<meta[^>]+property=["']og:description["'][^>]+content=["']([^"']+)["']/i,
    ],
    html,
  )

  const price = parsePrice(html)
  const currency = parseCurrency(html)
  const images = parseImages(html)
  const rating = toNumber(firstOf([/"averageStar"?\s*:\s*([0-9.]+)/i, /"starRating"?\s*:\s*([0-9.]+)/i], html)) ?? 0
  const ratingCount =
    toNumber(firstOf([/"totalValidNum"?\s*:\s*(\d+)/i, /"commentsCount"?\s*:\s*(\d+)/i], html)) ?? 0

  if (!title || price === null) return null

  return {
    provider: 'aliexpress',
    providerName: 'AliExpress',
    externalProductId: externalId,
    sourceUrl,
    title,
    descriptionHtml: description ? `<p>${description}</p>` : '',
    price,
    currency: currency.name,
    currencyCode: currency.symbol,
    available: true,
    sku: null,
    brand: null,
    stock: null,
    rating,
    ratingCount,
    images,
    variants: [],
    specifications: [],
  }
}

function json(res, status, body) {
  const payload = JSON.stringify(body)
  res.writeHead(status, {
    'content-type': 'application/json; charset=utf-8',
    'access-control-allow-origin': '*',
    'access-control-allow-methods': 'GET, OPTIONS',
    'access-control-allow-headers': 'content-type',
    'content-length': Buffer.byteLength(payload),
  })
  res.end(payload)
}

const server = createServer(async (req, res) => {
  if (req.method === 'OPTIONS') {
    json(res, 204, {})
    return
  }

  const url = new URL(req.url, `http://localhost:${PORT}`)

  if (url.pathname === '/health') {
    json(res, 200, { ok: true })
    return
  }

  if (url.pathname !== '/api/analyze') {
    json(res, 404, { error: 'not_found' })
    return
  }

  const target = url.searchParams.get('url')
  if (!target || !/^https?:\/\//i.test(target)) {
    json(res, 400, { error: 'invalid_url' })
    return
  }

  try {
    const response = await fetch(target, {
      headers: HEADERS,
      redirect: 'follow',
      signal: AbortSignal.timeout(TIMEOUT_MS),
    })
    if (!response.ok) {
      json(res, 422, { error: 'source_unavailable', detail: `La fuente respondió HTTP ${response.status}` })
      return
    }

    const externalId =
      target.match(/\/item\/(\d+)\.html/i)?.[1] ?? 'producto'
    const html = await response.text()
    const product = parse(html, externalId, target)

    if (!product) {
      json(res, 422, {
        error: 'source_unavailable',
        detail: 'No se pudo extraer información de la página (protecciones anti-bot o página sin datos).',
      })
      return
    }
    json(res, 200, product)
  } catch (error) {
    json(res, 422, {
      error: 'source_unavailable',
      detail: `No se pudo descargar la página: ${error?.name ?? 'error'}`,
    })
  }
})

server.listen(PORT, () => {
  console.log(`Import server escuchando en http://localhost:${PORT}`)
})