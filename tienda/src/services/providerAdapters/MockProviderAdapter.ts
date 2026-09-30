import type { RawImportedProduct, ImportedVariant, ImportedSpec } from '../../types/import'
import type { ProviderAdapter } from './ProviderAdapter'
import mockImportedProducts from '../../data/mockImportedProducts.json'

/**
 * MockProvider: simula una futura integración de proveedor autorizado.
 *
 * Permite probar toda la interfaz sin backend ni conexión externa. En
 * desarrollo sirve datos de demostración para cualquier enlace, se use la
 * fuente que se use; para un despliegue real se sustituirá por adaptadores
 * autorizados (API, feed o afiliación) ejecutados en el backend.
 */

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
  variants: Array<{ name: string; value: string }>
  specifications: Array<{ label: string; value: string }>
}

export const mockProviderAdapter: ProviderAdapter = {
  providerId: 'mock',
  providerName: 'Proveedor de prueba',

  canHandle(_url: string): boolean {
    // Es el adaptador de reserva: se usa solo si ningún adaptador concreto
    // aceptó la URL.
    return true
  },

  parseExternalId(url: string): string | null {
    try {
      return new URL(url).pathname.split('/').filter(Boolean).slice(-1)[0] ?? null
    } catch {
      return null
    }
  },

  async analyze(url: string): Promise<RawImportedProduct> {
    const catalog = mockImportedProducts as unknown as Record<string, MockEntry>
    const demoEntry = catalog['1005013099421482'] as MockEntry

    const variants: ImportedVariant[] = demoEntry.variants.map((v) => ({ ...v }))
    const specifications: ImportedSpec[] = demoEntry.specifications.map((s) => ({
      label: s.label,
      value: s.value,
    }))

    return {
      provider: this.providerId,
      providerName: this.providerName,
      externalProductId: this.parseExternalId(url) ?? 'demo-producto',
      sourceUrl: url,
      title: demoEntry.title.trim(),
      descriptionHtml: demoEntry.descriptionHtml,
      price: demoEntry.price,
      currency: demoEntry.currency,
      currencyCode: demoEntry.currencyCode,
      available: demoEntry.available,
      sku: demoEntry.sku,
      brand: demoEntry.brand,
      stock: demoEntry.stock,
      rating: demoEntry.rating,
      ratingCount: demoEntry.ratingCount,
      images: [...demoEntry.images],
      variants,
      specifications,
    }
  },
}