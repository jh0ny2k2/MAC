import type { RawImportedProduct } from '../../types/import'

/**
 * Contrato de un adaptador de proveedor.
 *
 * Un adaptador representa una fuente de datos AUTORIZADA (API oficial,
 * feed permitido, programa de afiliados, catálogo con licencia, etc.).
 *
 * Diseñado con una carencia deliberada de scraping: no se navega por el HTML
 * del proveedor, no se evaden CAPTCHAs ni sistemas anti-bot. El acceso real a
 * los datos debe ocurrir siempre en un backend autorizado; aquí solo consume
 * los resultados que esa integración devuelve.
 *
 * frontend ──► Import API ──► backend ──► proveedor / servicio autorizado
 */
export interface ProviderAdapter {
  /** Identificador único del proveedor (p. ej. "aliexpress"). */
  readonly providerId: string
  /** Nombre legible para la interfaz (p. ej. "AliExpress"). */
  readonly providerName: string

  /** Indica si este adaptador sabe leer el enlace recibido. */
  canHandle(url: string): boolean

  /** Extrae el identificador de producto externo a partir de la URL. */
  parseExternalId(url: string): string | null

  /** Analiza la URL y devuelve los datos brutos disponibles en la fuente. */
  analyze(url: string): Promise<RawImportedProduct>
}

/** Error legible que puede mostrarse directamente al usuario. */
export class ImportError extends Error {
  readonly code: string
  readonly hint?: string

  constructor(message: string, options: { code?: string; hint?: string } = {}) {
    super(message)
    this.name = 'ImportError'
    this.code = options.code ?? 'importer_error'
    this.hint = options.hint
  }
}

/** Normaliza una URL para comparaciones: sin protocolo, consulta ni barras finales. */
export function normalizedUrl(url: string): string {
  try {
    const parsed = new URL(url)
    return `${parsed.host}${parsed.pathname}`.toLowerCase().replace(/\/+$/, '')
  } catch {
    return url.trim().toLowerCase().replace(/\/+$/, '')
  }
}

/** Comprueba que la cadena es una URL HTTP(S) válida. */
export function isValidHttpUrl(url: string): boolean {
  try {
    const parsed = new URL(url)
    return parsed.protocol === 'http:' || parsed.protocol === 'https:'
  } catch {
    return false
  }
}