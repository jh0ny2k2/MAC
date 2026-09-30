import type { Product } from '../../types'
import type { ProductSource } from '../../types'
import type {
  DetectedValue,
  F1Detection,
  ImportedProduct,
  PriceConfig,
} from '../../types/import'
import { getDetectedKeys } from './ProductExtractor'

export interface DraftBuildResult {
  product: Product
  applied: string[]
  pending: string[]
  priceNote: string | null
}

/** Aplica los valores detectados sobre el borrador inicial. Devuelve las claves aplicadas. */
export function applyDetection(
  base: Product,
  detection: F1Detection,
): { product: Product; applied: string[] } {
  const product: Product = { ...base }
  const applied: string[] = []

  const str = (d: DetectedValue<string> | null, key: keyof Product): void => {
    if (d) {
      ;(product as unknown as Record<string, unknown>)[key] = d.value
      applied.push(key)
    }
  }
  const num = (d: DetectedValue<number> | null, key: keyof Product): void => {
    if (d && typeof d.value === 'number') {
      ;(product as unknown as Record<string, unknown>)[key] = d.value
      applied.push(key)
    }
  }

  str(detection.team, 'team')
  str(detection.driver, 'driver')
  num(detection.season, 'season')
  str(detection.scale, 'scale')
  str(detection.manufacturer, 'manufacturer')
  str(detection.category, 'category')
  str(detection.material, 'material')
  str(detection.dimensions, 'dimensions')
  str(detection.weight, 'weight')
  if (detection.specialEdition && typeof detection.specialEdition.value === 'boolean') {
    product.specialEdition = detection.specialEdition.value
    applied.push('specialEdition')
  }

  return { product, applied }
}

export function getAppliedFields(
  detection: F1Detection,
  base: Product,
  source: ImportedProduct,
): string[] {
  const keys = getDetectedKeys(detection)
  const applied: string[] = []
  for (const key of keys) {
    const d = detection[key]
    if (!d) continue
    if (key === 'team' && d.value !== base.team) applied.push('team')
    else if (key === 'driver' && d.value !== base.driver) applied.push('driver')
    else if (key === 'season' && d.value !== base.season) applied.push('season')
    else if (key === 'scale' && d.value !== base.scale) applied.push('scale')
    else if (key === 'manufacturer' && d.value !== base.manufacturer) applied.push('manufacturer')
    else if (key === 'category' && d.value !== base.category) applied.push('category')
    else if (key === 'material' && d.value !== base.material) applied.push('material')
    else if (key === 'dimensions' && d.value !== base.dimensions) applied.push('dimensions')
    else if (key === 'weight' && d.value !== base.weight) applied.push('weight')
    else if (key === 'specialEdition' && d.value !== base.specialEdition) applied.push('specialEdition')
  }
  void source
  return Array.from(new Set([...applied]))
}

export function getPendingFields(base: Product): (keyof Product)[] {
  const keys: (keyof Product)[] = ['team', 'driver', 'season', 'scale', 'category', 'manufacturer', 'material', 'dimensions', 'weight']
  return keys.filter((k) => {
    const v = base[k]
    return v === undefined || v === null || v === '' || v === 0
  })
}

/* ------------------------------------------------------------------ */
/* Configuración de precio                                             */
/* ------------------------------------------------------------------ */

export interface PriceContext {
  cost: number
  currency: string
  defaultStrategy: PriceConfig['strategy']
  defaultMarginPercent: number
  defaultFixedIncrease: number
}

export function suggestedPrice(cost: number, strategy: PriceConfig['strategy'], marginPercent: number, fixedIncrease: number): number {
  if (strategy === 'margin') return Math.round(cost * (1 + marginPercent / 100) * 100) / 100
  if (strategy === 'fixed') return Math.round((cost + fixedIncrease) * 100) / 100
  return cost
}

export function buildPriceConfig(
  ctx: PriceContext,
  overrides: Partial<PriceConfig> = {},
): PriceConfig {
  const strategy = overrides.strategy ?? ctx.defaultStrategy
  const marginPercent = overrides.marginPercent ?? ctx.defaultMarginPercent
  const fixedIncrease = overrides.fixedIncrease ?? ctx.defaultFixedIncrease
  const cost = overrides.cost ?? ctx.cost
  const salePrice = overrides.salePrice ?? suggestedPrice(cost, strategy, marginPercent, fixedIncrease)
  const oldPrice = overrides.oldPrice ?? Math.round(salePrice * 1.25 * 100) / 100
  const discountPercent = overrides.discountPercent ?? Math.round((1 - salePrice / oldPrice) * 100)
  return { strategy, cost, marginPercent, fixedIncrease, salePrice, oldPrice, discountPercent }
}

/* ------------------------------------------------------------------ */
/* Construcción del borrador                                           */
/* ------------------------------------------------------------------ */

export function buildDraft(
  imported: ImportedProduct,
  price: PriceConfig,
  existing?: Pick<Product, 'id'> | Product | null,
): DraftBuildResult {
  const styleKey = imported.detection.team?.value
    ? normalizeKey(imported.detection.team.value)
    : imported.brand
      ? normalizeKey(imported.brand)
      : 'f1'
  const scaleHint = imported.detection.scale?.value
    ? imported.detection.scale.value.replace(/[^0-9a-z]/gi, '')
    : '143'

  const base: Product = {
    id: existing?.id ?? 0,
    name: imported.title.trim(),
    team: imported.detection.team?.value ?? '',
    driver: imported.detection.driver?.value ?? '',
    season: imported.detection.season?.value ?? new Date().getFullYear(),
    scale: imported.detection.scale?.value ?? '1:43',
    price: price.salePrice,
    oldPrice: price.oldPrice,
    discount: price.discountPercent,
    rating: imported.rating ?? 0,
    reviews: imported.ratingCount ?? 0,
    stock: imported.stock ?? 0,
    featured: false,
    bestseller: false,
    category: imported.detection.category?.value ?? '1:43',
    manufacturer: imported.detection.manufacturer?.value ?? '',
    material: imported.detection.material?.value ?? '',
    dimensions: imported.detection.dimensions?.value ?? '',
    weight: imported.detection.weight?.value ?? '',
    images: imported.images.length > 0 ? imported.images : [],
    description: imported.descriptionCleaned || imported.description || imported.title,
    specifications: imported.features,
    sku: imported.sku ?? `${styleKey}-${scaleHint}-${imported.externalProductId}`,
    shortDescription: imported.shortDescription,
    cost: price.cost,
    source: {
      provider: imported.provider,
      productId: imported.externalProductId,
      url: imported.sourceUrl,
      importedAt: imported.analyzedAt,
      status: 'active',
    } as ProductSource,
    supplierCost: price.cost,
    supplierCurrency: imported.currencyCode,
    supplierStock: imported.stock ?? undefined,
    status: 'borrador',
    specialEdition: importIsSpecial(imported),
  }

  const { product, applied } = applyDetection(base, imported.detection)
  const pending = getPendingFields(product)

  return { product, applied, pending, priceNote: null }
}

function importIsSpecial(imported: ImportedProduct): boolean {
  return imported.detection.specialEdition?.value === true
}

export function normalizeKey(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/gi, '-')
    .replace(/(-)+/g, '-')
    .replace(/^-|-$/g, '')
}

/** Marca el borrador como visible/agotado/compatible con edition de la tienda. */
export function withStoreStatus(product: Product, status: Product['status']): Product {
  return { ...product, status }
}
