import type { Product } from './index'

/** Nivel de confianza de un dato detectado automáticamente. */
export type Confidence = 'high' | 'medium' | 'low'

/** Fases del flujo de análisis de una URL. */
export type ImportPhase = 'idle' | 'analyzing' | 'success' | 'partial' | 'error'

/** Estados persistidos en el historial de importaciones. */
export type ImportRecordStatus = 'draft' | 'published' | 'partial' | 'error'

/** Tipo de proveedor soportado. */
export type ProviderId = 'aliexpress' | 'mock'

export interface DetectedValue<T = string> {
  value: T
  valueText: string
  confidence: Confidence
  source: 'extracted' | 'inferred'
}

/** Información F1 detectada automáticamente con su nivel de confianza. */
export interface F1Detection {
  team: DetectedValue<string> | null
  driver: DetectedValue<string> | null
  season: DetectedValue<number> | null
  scale: DetectedValue<string> | null
  manufacturer: DetectedValue<string> | null
  category: DetectedValue<string> | null
  material: DetectedValue<string> | null
  dimensions: DetectedValue<string> | null
  weight: DetectedValue<string> | null
  specialEdition: DetectedValue<boolean> | null
}

export interface ImportedVariant {
  name: string
  value: string
}

export interface ImportedSpec {
  label: string
  value: string
}

/** Datos brutos devueltos por un proveedor (antes de normalizar). */
export interface RawImportedProduct {
  provider: ProviderId | string
  providerName: string
  externalProductId: string
  sourceUrl: string
  title: string
  descriptionHtml: string
  price: number | null
  currency: string
  currencyCode: string
  available: boolean
  sku: string | null
  brand: string | null
  stock: number | null
  rating: number | null
  ratingCount: number | null
  images: string[]
  variants: ImportedVariant[]
  specifications: ImportedSpec[]
}

/** Producto importado, normalizado y enriquecido por el extractor. */
export interface ImportedProduct extends Omit<RawImportedProduct, 'descriptionHtml'> {
  description: string
  descriptionCleaned: string
  shortDescription: string
  availability: 'in-stock' | 'out-of-stock' | 'unknown'
  features: string[]
  detection: F1Detection
  analyzedAt: string
}

export type DuplicateReason = 'url' | 'externalId' | 'sku' | 'name'

export interface DuplicateResult {
  duplicated: boolean
  reason?: DuplicateReason
  reasonLabel?: string
  product?: Product
  importRecord?: ImportRecord
}

export interface AnalyzeResult {
  phase: 'success' | 'partial'
  imported: ImportedProduct
  duplicate: DuplicateResult
}

export type PriceStrategy = 'margin' | 'fixed' | 'manual'

export interface PriceConfig {
  strategy: PriceStrategy
  cost: number
  marginPercent: number
  fixedIncrease: number
  salePrice: number
  oldPrice: number
  discountPercent: number
}

export interface ImportRecord {
  id: number
  provider: string
  providerName: string
  externalProductId: string
  sourceUrl: string
  status: ImportRecordStatus
  importedAt: string
  productId?: number
  productName?: string
  productStatus?: Product['status']
  user?: string
  checkedAt?: string
  missingFields?: string[]
  error?: string
}

/** Resultado individual de una importación múltiple. */
export interface BatchResultItem {
  url: string
  index: number
  ok: boolean
  phase?: ImportPhase
  imported?: ImportedProduct
  error?: string
}

export interface SourceDiff {
  field: string
  label: string
  group: 'price' | 'stock' | 'product' | 'media'
  kind: 'changed' | 'added' | 'removed'
  before?: string
  after?: string
}

export interface SourceChanges {
  productId: number
  fetchedAt: string
  diffs: SourceDiff[]
  unchanged: boolean
}

export const PROVIDER_LABELS: Record<string, string> = {
  aliexpress: 'AliExpress',
  mock: 'Proveedor de prueba',
}