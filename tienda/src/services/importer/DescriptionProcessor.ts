import type { ImportedSpec } from '../../types/import'

/**
 * Procesador de descripción.
 *
 * Transforma la descripción original del proveedor en contenido limpio y apto
 * para la tienda: elimina HTML que no aporta valor, descarta fragmentos que no
 * corresponden a nuestro escaparate (envíos, promociones, avisos comerciales)
 * y extrae características.
 *
 * REGLA: nunca se inventan especificaciones. Todo lo que sale se origina en el
 * texto o en las especificaciones que la fuente autorizada devuelve.
 */

/** Elimina la sintaxis HTML conservando el contenido textual. */
export function cleanHtml(html: string): string {
  if (!html) return ''
  const withoutBlocks = html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<\/(p|div|section|li|ul|ol|h[1-6]|tr|table)>/gi, '\n')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<li[^>]*>/gi, '\n• ')
  const text = withoutBlocks
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
  return text
    .replace(/[ \t]+/g, ' ')
    .replace(/\u2022\s*/g, '\n• ')
    .replace(/\n\s*\n+/g, '\n\n')
    .trim()
}

/** Fragmentos comerciales o de logística irrelevantes para nuestro escaparate. */
const IRRELEVANT_MARKERS = [
  'envío rápido',
  'envio rapido',
  'seguimiento completo',
  'promoción solo es válida',
  'promocion solo es valida',
  'solo es válida en algunos',
  'solo es valida en algunos',
  'esta promoción',
  'esta promocion',
  'el precio puede variar',
  'la imagen mostrada',
  'pueden diferir de la imagen',
  'color y la textura pueden',
  'el paquete puede tardar',
  'tardar 2-3 semanas',
  'envío gratuito',
  'envio gratuito',
  'el color y la textura',
]

/** Elimina líneas con contenido comercial/logístico irrelevante. */
export function removeIrrelevant(text: string): string {
  const lines = text.split('\n').map((line) => line.trim())
  const kept = lines.filter((line) => {
    if (!line) return false
    const lower = line.toLowerCase()
    return !IRRELEVANT_MARKERS.some((marker) => lower.includes(marker))
  })
  return kept.join('\n').replace(/\n{2,}/g, '\n\n').trim()
}

/** Extrae características: líneas con viñeta o pares label:value de specs. */
export function extractFeatures(
  descriptionHtml: string,
  specifications: ImportedSpec[] = [],
): string[] {
  const features: string[] = []

  const cleaned = removeIrrelevant(cleanHtml(descriptionHtml))
  for (const line of cleaned.split('\n')) {
    const trimmed = line.trim()
    if (trimmed.startsWith('• ')) {
      const feature = trimmed.slice(2).trim()
      if (feature) features.push(feature)
    }
  }

  for (const spec of specifications) {
    const label = spec.label.trim()
    const value = spec.value.trim()
    if (label && value) features.push(`${label}: ${value}`)
  }

  return Array.from(new Set(features)).slice(0, 16)
}

/** Genera una descripción corta (una o dos primeras frases). */
export function buildShortDescription(text: string, limit = 180): string {
  const clean = removeIrrelevant(text).replace(/\n+/g, ' ').trim()
  if (!clean) return ''

  const sentences = clean
    .split(/(?<=[.)!?])\s+/)
    .filter(Boolean)
    .map((s) => s.trim())

  let short = ''
  for (const sentence of sentences) {
    if (!short) short = sentence
    else if (short.length + sentence.length + 1 <= limit) short += ` ${sentence}`
    else break
  }

  if (short.length > limit) short = short.slice(0, limit - 1).trimEnd() + '…'
  return short.trim()
}

/** Normaliza la descripción completa para mostrarla como texto plano limpio. */
export function buildNormalizedDescription(text: string): string {
  return removeIrrelevant(text).trim()
}