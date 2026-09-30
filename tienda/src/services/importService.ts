import type { Product } from '../types'
import type {
  AnalyzeResult,
  BatchResultItem,
  DuplicateResult,
  ImportedProduct,
  ImportPhase,
  ImportRecord,
  PriceConfig,
  SourceChanges,
  SourceDiff,
} from '../types/import'
import productsData from '../data/products.json'
import importsData from '../data/imports.json'
import { loadCollection, nextId, saveCollection, simulateDelay } from './storage'
import { authService } from './authService'
import { ImportError } from './providerAdapters/ProviderAdapter'
import { analyzeUrl as productImporterAnalyze } from './importer/ProductImporter'

const IMPORTS_KEY = 'imports'
const PRODUCTS_KEY = 'products'

export { ImportError }

function allImports(): ImportRecord[] {
  return loadCollection<ImportRecord>(IMPORTS_KEY, importsData as ImportRecord[])
}

function allProducts(): Product[] {
  return loadCollection<Product>(PRODUCTS_KEY, productsData as Product[])
}

/** Devuelve un mensaje legible para cualquier error de importación. */
export function toFriendlyError(error: unknown): string {
  if (error instanceof ImportError) return error.message
  return 'No se pudo analizar el producto. Revisa el enlace e inténtalo de nuevo.'
}

/** Decide la fase del análisis según la información disponible. */
export function computePhase(imported: ImportedProduct): 'success' | 'partial' {
  const essentialMissing =
    !imported.title.trim() ||
    imported.price === null ||
    imported.images.length === 0 ||
    !imported.detection.team ||
    !imported.detection.scale
  const needsReview = imported.sku === null || imported.brand === null
  return essentialMissing || needsReview ? 'partial' : 'success'
}

/* ------------------------------------------------------------------ */
/* Análisis                                                            */
/* ------------------------------------------------------------------ */

/** Analiza una URL, detecta duplicados y devuelve la fase resultante. */
export async function analyzeProductUrl(url: string): Promise<AnalyzeResult> {
  const imported = await productImporterAnalyze(url)
  const duplicate = checkDuplicate(imported)
  return { phase: computePhase(imported), imported, duplicate }
}

export { productImporterAnalyze as reanalyzeSource }

/** Analiza varias URLs de forma secuencial (importación masiva). */
export async function analyzeBatch(
  urls: string[],
  onProgress?: (done: number, total: number) => void,
): Promise<BatchResultItem[]> {
  const results: BatchResultItem[] = []
  const total = urls.length
  for (let i = 0; i < total; i += 1) {
    onProgress?.(i, total)
    const url = urls[i].trim()
    try {
      const imported = await productImporterAnalyze(url)
      results.push({
        url,
        index: i,
        ok: true,
        phase: computePhase(imported),
        imported,
      })
    } catch (error) {
      results.push({ url, index: i, ok: false, error: toFriendlyError(error) })
    }
  }
  onProgress?.(total, total)
  return results
}

/* ------------------------------------------------------------------ */
/* Duplicados                                                          */
/* ------------------------------------------------------------------ */

function sameUrl(a: string, b: string): boolean {
  return a.trim().toLowerCase().replace(/[/]+$/g, '') ===
    b.trim().toLowerCase().replace(/[/]+$/g, '')
}

/** Compara el producto importado contra el catálogo y el historial. */
export function checkDuplicate(imported: ImportedProduct): DuplicateResult {
  const normalizedUrl = imported.sourceUrl

  const matchReason = (p: Product): string | null => {
    if (p.source?.url && sameUrl(p.source.url, normalizedUrl)) return 'url'
    if (p.source?.productId && p.source.productId === imported.externalProductId)
      return 'externalId'
    if (imported.sku && p.sku && p.sku.toLowerCase() === imported.sku.toLowerCase())
      return 'sku'
    if (
      p.name.trim() &&
      imported.title &&
      p.name.trim().toLowerCase() === imported.title.trim().toLowerCase()
    ) {
      return 'name'
    }
    return null
  }

  let product: Product | undefined
  let reason: string | null = null
  for (const candidate of allProducts()) {
    const found = matchReason(candidate)
    if (found) {
      product = candidate
      reason = found
      break
    }
  }

  if (!product) return { duplicated: false }

  const reasonLabels: Record<string, string> = {
    url: 'Este producto ya ha sido importado desde el mismo enlace',
    externalId: 'Este producto ya ha sido importado (mismo ID externo)',
    sku: 'Este producto ya existe con el mismo SKU',
    name: 'Este producto ya existe con el mismo nombre',
  }

  const importRecord = allImports().find(
    (r) => r.externalProductId === imported.externalProductId,
  )

  return {
    duplicated: true,
    reason: (reason ?? 'url') as DuplicateResult['reason'],
    reasonLabel: reasonLabels[reason ?? 'url'],
    product,
    importRecord,
  }
}

/* ------------------------------------------------------------------ */
/* Guardado                                                            */
/* ------------------------------------------------------------------ */

export interface SaveImportOptions {
  imported: ImportedProduct
  product: Product
  recordStatus: ImportRecord['status']
  price: PriceConfig
  error?: string
}

/** Guarda/actualiza el producto y registra la importación en el historial. */
export async function saveImport(options: SaveImportOptions): Promise<{
  product: Product
  record: ImportRecord
}> {
  await simulateDelay(250)
  const { imported, recordStatus, error, product } = options
  const products = allProducts()
  const index = products.findIndex((p) => p.id === product.id)
  if (index === -1) products.push(product)
  else products[index] = product
  saveCollection(PRODUCTS_KEY, products)

  const records = allImports()
  const session = authService.getSession()
  const now = new Date().toISOString()
  let record: ImportRecord
  const existingIndex = records.findIndex(
    (r) => r.externalProductId === imported.externalProductId,
  )
  if (existingIndex >= 0) {
    record = {
      ...records[existingIndex],
      provider: imported.provider,
      providerName: imported.providerName,
      sourceUrl: imported.sourceUrl,
      productId: product.id,
      productName: product.name,
      productStatus: product.status,
      status: recordStatus,
      checkedAt: now,
      user: session?.name ?? records[existingIndex].user,
      missingFields: imported.detection
        ? Object.entries(imported.detection)
            .filter(([, v]) => v === null)
            .map(([k]) => k)
        : undefined,
      error,
    }
    records[existingIndex] = record
  } else {
    record = {
      id: nextId(records),
      provider: imported.provider,
      providerName: imported.providerName,
      externalProductId: imported.externalProductId,
      sourceUrl: imported.sourceUrl,
      productId: product.id,
      productName: product.name,
      productStatus: product.status,
      status: recordStatus,
      importedAt: now,
      checkedAt: now,
      user: session?.name,
      missingFields: imported.detection
        ? Object.entries(imported.detection)
            .filter(([, v]) => v === null)
            .map(([k]) => k)
        : undefined,
      error,
    }
    records.push(record)
  }
  saveCollection(IMPORTS_KEY, records)
  return { product, record }
}

/** Elimina un registro de importación (no borra el producto). */
export async function removeImport(id: number): Promise<void> {
  await simulateDelay(200)
  saveCollection(
    IMPORTS_KEY,
    allImports().filter((r) => r.id !== id),
  )
}

/* ------------------------------------------------------------------ */
/* Historial                                                           */
/* ------------------------------------------------------------------ */

export function getImportHistory(): ImportRecord[] {
  return allImports()
    .slice()
    .sort((a, b) => (b.importedAt ?? '').localeCompare(a.importedAt ?? ''))
}

export function getImportById(id: number): ImportRecord | undefined {
  return allImports().find((r) => r.id === id)
}

/* ------------------------------------------------------------------ */
/* Actualización desde el proveedor                                    */
/* ------------------------------------------------------------------ */

/** Vuelve a consultar el proveedor y calcula las diferencias. */
export async function updateFromSource(productId: number): Promise<SourceChanges> {
  const products = allProducts()
  const product = products.find((p) => p.id === productId)
  if (!product) throw new ImportError('Producto no encontrado.')
  if (!product.source?.url) {
    throw new ImportError('Este producto no tiene una fuente de importación configurada.')
  }

  const current = { ...product }
  const imported = await productImporterAnalyze(product.source.url)
  const diffs: SourceDiff[] = []

  const currencyFormat = (value: number): string =>
    new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2,
    }).format(value)

  const supplierCost = current.supplierCost ?? current.cost
  if (imported.price !== null && Math.abs((supplierCost ?? 0) - imported.price) > 0.001) {
    diffs.push({
      field: 'supplierCost',
      label: 'Precio del proveedor',
      group: 'price',
      kind: 'changed',
      before: supplierCost ? currencyFormat(supplierCost) : '—',
      after: currencyFormat(imported.price),
    })
  }

  if (imported.currencyCode && imported.currencyCode !== current.supplierCurrency) {
    diffs.push({
      field: 'supplierCurrency',
      label: 'Moneda del proveedor',
      group: 'price',
      kind: 'changed',
      before: current.supplierCurrency ?? '—',
      after: imported.currencyCode,
    })
  }

  if (
    imported.stock !== null &&
    (current.supplierStock ?? imported.stock) !== imported.stock
  ) {
    diffs.push({
      field: 'supplierStock',
      label: 'Stock del proveedor',
      group: 'stock',
      kind: 'changed',
      before: String(current.supplierStock ?? '—'),
      after: String(imported.stock),
    })
  }

  if (imported.title && imported.title.trim() !== current.name.trim()) {
    diffs.push({
      field: 'name',
      label: 'Nombre del producto',
      group: 'product',
      kind: 'changed',
      before: current.name,
      after: imported.title.trim(),
    })
  }

  const addedImages = imported.images.filter((img) => !current.images.includes(img))
  const removedImages = current.images.filter((img) => !imported.images.includes(img))
  if (addedImages.length > 0) {
    diffs.push({
      field: 'images',
      label: 'Imágenes del proveedor',
      group: 'media',
      kind: 'added',
      before: `${current.images.length} actuales`,
      after: `${imported.images.length} en la fuente (${addedImages.length} nueva${addedImages.length === 1 ? '' : 's'})`,
    })
  }
  if (removedImages.length > 0) {
    diffs.push({
      field: 'imagesRemoved',
      label: 'Imágenes retiradas',
      group: 'media',
      kind: 'removed',
      before: `${removedImages.length} en nuestro catálogo`,
      after: '—',
    })
  }

  return {
    productId,
    fetchedAt: new Date().toISOString(),
    diffs,
    unchanged: diffs.length === 0,
  }
}

/**
 * Aplica SOLO los cambios seleccionados. El precio de venta de nuestra tienda
 * (price/oldPrice/discount) nunca se toca automáticamente.
 */
export async function applySourceChanges(
  productId: number,
  toApply: SourceDiff[],
): Promise<Product> {
  await simulateDelay(250)
  const products = allProducts()
  const index = products.findIndex((p) => p.id === productId)
  if (index === -1) throw new ImportError('Producto no encontrado.')
  const product = products[index]
  const imported = await productImporterAnalyze(product.source?.url ?? '')

  const applied = { ...product }

  for (const diff of toApply) {
    if (diff.field === 'supplierCost' && imported.price !== null) {
      applied.supplierCost = imported.price
    }
    if (diff.field === 'supplierCurrency' && imported.currencyCode) {
      applied.supplierCurrency = imported.currencyCode
    }
    if (diff.field === 'supplierStock' && imported.stock !== null) {
      applied.supplierStock = imported.stock
    }
    if (diff.field === 'name' && imported.title) {
      applied.name = imported.title.trim()
    }
    if (diff.field === 'images') {
      applied.images = imported.images.length > 0 ? [...imported.images] : applied.images
    }
  }

  applied.source = {
    ...(applied.source ?? {
      provider: imported.provider,
      productId: imported.externalProductId,
      url: imported.sourceUrl,
      importedAt: new Date().toISOString(),
    }),
    lastCheckedAt: new Date().toISOString(),
    status: 'active',
  }

  products[index] = applied
  saveCollection(PRODUCTS_KEY, products)
  return applied
}

/* ------------------------------------------------------------------ */
/* Utilidades públicas                                                 */
/* ------------------------------------------------------------------ */

export function isPartialPhase(phase: ImportPhase): boolean {
  return phase === 'partial'
}

export function isSuccessPhase(phase: ImportPhase): boolean {
  return phase === 'success'
}

export function isErrorPhase(phase: ImportPhase): boolean {
  return phase === 'error'
}