import type { ImportedProduct, PriceConfig, RawImportedProduct } from '../../types/import'
import {
  ImportError,
  isValidHttpUrl,
  type ProviderAdapter,
} from '../providerAdapters/ProviderAdapter'
import { aliExpressAdapter } from '../providerAdapters/AliExpressAdapter'
import { mockProviderAdapter } from '../providerAdapters/MockProviderAdapter'
import { detectAll, searchContextFromRaw } from './ProductExtractor'
import { buildDraft, type DraftBuildResult } from './ProductNormalizer'
import {
  buildNormalizedDescription,
  buildShortDescription,
  extractFeatures,
} from './DescriptionProcessor'

/**
 * ProductImporter: capa de orquestación de la importación.
 *
 * Une el proveedor (adapter) → extracción de datos → detección F1 →
 * normalización. No conoce detalles de ningún proveedor concreto: trabaja
 * siempre contra la interfaz {@link ProviderAdapter}, de modo que en el futuro
 * basta con añadir AmazonAdapter, TemuAdapter, etc. sin tocar nada de aquí.
 *
 * La resolución real de URLs se ejecutará en un backend autorizado; aquí solo
 * se consume lo que la integración devuelve (en desarrollo, datos de prueba).
 */

/** Registro de adaptadores disponibles (orden de prioridad). */
export const ADAPTER_REGISTRY: ProviderAdapter[] = [
  aliExpressAdapter,
  mockProviderAdapter,
]

/** Busca el adaptador capaz de procesar la URL. */
export function findAdapter(url: string): ProviderAdapter {
  const adapter = ADAPTER_REGISTRY.find((a) => a.canHandle(url))
  if (!adapter) throw new ImportError('No se reconoce el enlace del proveedor.')
  return adapter
}

/** Extrae los datos brutos del proveedor a partir de la URL. */
export async function extractProductData(url: string): Promise<RawImportedProduct> {
  if (!isValidHttpUrl(url)) {
    throw new ImportError('Introduce un enlace válido (https://...).', {
      code: 'invalid_url',
    })
  }
  const adapter = findAdapter(url)
  return adapter.analyze(url)
}

/**
 * Convierte los datos brutos del proveedor en un producto importado
 * enriquecido: descripción procesada + detección F1 con confianza.
 */
export function buildImportedProduct(raw: RawImportedProduct): ImportedProduct {
  const normalizedDescription = buildNormalizedDescription(raw.descriptionHtml)
  const context = searchContextFromRaw(raw)

  return {
    provider: raw.provider,
    providerName: raw.providerName,
    externalProductId: raw.externalProductId,
    sourceUrl: raw.sourceUrl,
    title: raw.title.trim(),
    description: normalizedDescription,
    descriptionCleaned: normalizedDescription,
    shortDescription: buildShortDescription(normalizedDescription),
    price: raw.price,
    currency: raw.currency,
    currencyCode: raw.currencyCode,
    available: raw.available,
    availability: raw.available
      ? 'in-stock'
      : typeof raw.stock === 'number' && raw.stock === 0
        ? 'out-of-stock'
        : 'unknown',
    sku: raw.sku,
    brand: raw.brand,
    stock: raw.stock,
    rating: raw.rating,
    ratingCount: raw.ratingCount,
    images: [...raw.images],
    variants: raw.variants.map((v) => ({ ...v })),
    specifications: raw.specifications.map((s) => ({ ...s })),
    features: extractFeatures(raw.descriptionHtml, raw.specifications),
    detection: detectAll(context, raw.specifications),
    analyzedAt: new Date().toISOString(),
  }
}

/** Analiza la URL y devuelve el producto importado listo para revisar. */
export async function analyzeUrl(url: string): Promise<ImportedProduct> {
  const raw = await extractProductData(url)
  const imported = buildImportedProduct(raw)

  if (!imported.title) {
    throw new ImportError(
      'La fuente no ha devuelto un nombre para este producto. Completa la información manualmente o prueba con otro enlace.',
      { code: 'empty_title' },
    )
  }

  return imported
}

/** Alias descriptivo compatible con las funciones solicitadas. */
export function extractProduct(url: string): Promise<RawImportedProduct> {
  return extractProductData(url)
}

/** Normaliza un producto importado al formato interno de la tienda. */
export function normalizeProductData(
  imported: ImportedProduct,
  price: PriceConfig,
  existing?: { id: number } | null,
): DraftBuildResult {
  return buildDraft(imported, price, existing)
}

/** Re-expone las detecciones individuales del extractor. */
export { detectTeam, detectDriver, detectSeason, detectScale } from './ProductExtractor'

/** Re-expone el cálculo de precio sugerido. */
export { suggestedPrice as calculateSuggestedPrice } from './ProductNormalizer'

export { ImportError } from './ProviderAdapter'