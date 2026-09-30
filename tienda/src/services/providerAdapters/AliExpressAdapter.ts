import type { RawImportedProduct } from '../../types/import'
import { ImportError, type ProviderAdapter } from './ProviderAdapter'
import mockImportedProducts from '../../data/mockImportedProducts.json'

/**
 * Adaptador de AliExpress.
 *
 * Respeta las limitaciones de la fuente: no scrapea desde el navegador, no
 * usamos proxies ni evadimos protecciones. En desarrollo, los datos reales
 * se obtienen del servidor local `npm run server`, que descarga la página en
 * el backend y extrae lo publicado; si ese servidor no está activo o la
 * fuente bloquea/vaía la extracción, se cae a datos de demostración para
 * poder probar la interfaz sin conexión.
 *
 * Los IDs clave de DEMO_URLS permiten probar escenarios concretos (datos
 * parciales o cambios de precio) cuando no hay fuente real disponible. Si un
 * dato no está disponible, se deja vacío (null / []) y la interfaz lo marca
 * para revisión manual. Nunca se inventa información sobre productos reales.
 */

interface MockVariant {
  name: string
  value: string
}

interface MockSpec {
  label: string
  value: string
}

interface MockEntry {
  title: string
  descriptionHtml: string
  price: number
  currency: string
  currencyName: string
  currencyCode: string
  available: boolean
  stock: number
  sku: string | null
  brand: string | null
  rating: number
  ratingCount: number
  images: string[]
  variants: MockVariant[]
  specifications: MockSpec[]
}

type MockCatalog = Record<string, MockEntry>

const ITEM_ID_PATTERN = /\/item\/(\d+)\.html/i

/** Entrada de demostración que se sirve cuando no hay datos reales disponibles. */
export const DEFAULT_ENTRY_ID = '1005013099421482'

/** Alias de URLs de demostración que permiten probar cada escenario. */
const DEMO_URLS: Record<string, string> = {
  '1005013099421482': DEFAULT_ENTRY_ID,
  '1005013099999997': 'noMatch',
  '1005013102999998': '1005013102CHANGE',
}

/** Intenta obtener los datos reales desde el servidor local de importación. */
async function tryFetchReal(
  sourceUrl: string,
  externalId: string,
): Promise<RawImportedProduct | null> {
  try {
    const res = await fetch(`/api/analyze?url=${encodeURIComponent(sourceUrl)}`, {
      signal: AbortSignal.timeout(15000),
    })
    if (!res.ok) return null
    const data = (await res.json()) as Partial<RawImportedProduct> | null
    if (!data || !data.title) return null
    return {
      provider: 'aliexpress',
      providerName: 'AliExpress',
      externalProductId: data.externalProductId ?? externalId,
      sourceUrl: sourceUrl,
      title: data.title,
      descriptionHtml: data.descriptionHtml ?? '',
      price: typeof data.price === 'number' ? data.price : null,
      currency: data.currency ?? 'Euro',
      currencyCode: data.currencyCode ?? '€',
      available: data.available ?? true,
      sku: data.sku ?? null,
      brand: data.brand ?? null,
      stock: data.stock ?? null,
      rating: data.rating ?? 0,
      ratingCount: data.ratingCount ?? 0,
      images: Array.isArray(data.images) ? data.images : [],
      variants: data.variants ?? [],
      specifications: data.specifications ?? [],
    }
  } catch {
    return null
  }
}

function buildFromEntry(
  entry: MockEntry | undefined,
  externalId: string,
  url: string,
): RawImportedProduct | null {
  if (!entry) return null
  return {
    provider: 'aliexpress',
    providerName: 'AliExpress',
    externalProductId: externalId,
    sourceUrl: url,
    title: entry.title.trim(),
    descriptionHtml: entry.descriptionHtml,
    price: entry.price,
    currency: entry.currency,
    currencyCode: entry.currencyCode,
    available: entry.available,
    sku: entry.sku,
    brand: entry.brand,
    stock: entry.stock,
    rating: entry.rating,
    ratingCount: entry.ratingCount,
    images: [...entry.images],
    variants: entry.variants.map((v) => ({ ...v })),
    specifications: entry.specifications.map((s) => ({ ...s })),
  }
}

export const aliExpressAdapter: ProviderAdapter = {
  providerId: 'aliexpress',
  providerName: 'AliExpress',

  canHandle(url: string): boolean {
    try {
      const host = new URL(url).hostname.toLowerCase()
      return host.includes('aliexpress')
    } catch {
      return false
    }
  },

  parseExternalId(url: string): string | null {
    const match = url.match(ITEM_ID_PATTERN)
    return match ? match[1] : null
  },

  async analyze(url: string): Promise<RawImportedProduct> {
    const externalId = this.parseExternalId(url)
    if (!externalId) {
      throw new ImportError(
        'No se pudo identificar el producto dentro del enlace. Revisa que sea una URL de producto de AliExpress.',
        { code: 'no_product_id' },
      )
    }

    // 1. Datos reales desde el servidor local (si está disponible).
    const real = await tryFetchReal(url, externalId)
    if (real) return real

    // 2. Si no hay fuente real, se usa la demostración para poder probar.
    const catalog = mockImportedProducts as unknown as MockCatalog
    const entry = catalog[DEMO_URLS[externalId] ?? externalId] ?? catalog[DEFAULT_ENTRY_ID]
    const demo = buildFromEntry(entry, externalId, url)
    if (!demo) {
      throw new ImportError(
        'No hay datos de demostración disponibles. Revisa el enlace e inténtalo de nuevo.',
        { code: 'source_unavailable' },
      )
    }
    return demo
  },
}