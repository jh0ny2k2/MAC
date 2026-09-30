import type { Confidence, DetectedValue, F1Detection, ImportedSpec, RawImportedProduct } from '../../types/import'
import teamsData from '../../data/teams.json'
import driversData from '../../data/drivers.json'
import categoriesData from '../../data/categories.json'

/* ------------------------------------------------------------------ */
/* Utilidades                                                          */
/* ------------------------------------------------------------------ */

function normalizeText(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .trim()
    .replace(/\s+/g, ' ')
}

function buildDetected<T>(
  value: T,
  valueText: string,
  confidence: Confidence,
  source: DetectedValue<T>['source'],
): DetectedValue<T> {
  return { value, valueText, confidence, source }
}

/* ------------------------------------------------------------------ */
/* Tablas de referencia                                                */
/* ------------------------------------------------------------------ */

interface TeamRef {
  id: string
  name: string
  aliases: string[]
}

function buildTeamRefs(): TeamRef[] {
  return (teamsData as Array<{ id: string; name: string; code?: string }>).map((team) => {
    const aliases = [team.name]
    if (team.code) aliases.push(team.code)
    return { id: team.id, name: team.name, aliases }
  })
}

const TEAM_REFS = buildTeamRefs()

interface DriverRef {
  id: number
  name: string
  aliases: string[]
}

function buildDriverRefs(): DriverRef[] {
  return (driversData as Array<{ id: number; name: string; number?: number | string }>).map((driver) => {
    const aliases = [driver.name]
    const last = driver.name.split(' ').slice(-1)[0]
    if (last) aliases.push(last)
    if (driver.number) aliases.push(String(driver.number))
    return { id: Number(driver.id), name: driver.name, aliases }
  })
}

const DRIVER_REFS = buildDriverRefs()

/* ------------------------------------------------------------------ */
/* Contexto de búsqueda                                                */
/* ------------------------------------------------------------------ */

export interface SearchContext {
  title: string
  description: string
  sku: string | null
  brand: string | null
}

export function searchContextFromRaw(raw: RawImportedProduct): SearchContext {
  return {
    title: raw.title,
    description: raw.descriptionHtml || '',
    sku: raw.sku,
    brand: raw.brand,
  }
}

/* ------------------------------------------------------------------ */
/* Escudería                                                           */
/* ------------------------------------------------------------------ */

function detectTeam(ctx: SearchContext): DetectedValue<string> | null {
  const title = normalizeText(ctx.title)
  const team = TEAM_REFS.find((t) =>
    t.aliases.some((a) => {
      const norm = normalizeText(a)
      return norm.length >= 6 && title.includes(norm)
    }),
  )
  if (team) return buildDetected(team.name, team.name, 'high', 'extracted')

  const rest = normalizeText(`${ctx.description} ${ctx.sku ?? ''} ${ctx.brand ?? ''}`)
  const found = TEAM_REFS.find((t) =>
    t.aliases.some((a) => {
      const norm = normalizeText(a)
      return norm.length >= 8 && rest.includes(norm)
    }),
  )
  if (found) return buildDetected(found.name, found.name, 'medium', 'inferred')
  return null
}

export { detectTeam }

/* ------------------------------------------------------------------ */
/* Piloto                                                              */
/* ------------------------------------------------------------------ */

function detectDriver(ctx: SearchContext): DetectedValue<string> | null {
  const title = normalizeText(ctx.title)
  const driver = DRIVER_REFS.find((d) =>
    d.aliases.some((a) => {
      const norm = normalizeText(a)
      return norm.length >= 7 && title.includes(norm)
    }),
  )
  if (driver) return buildDetected(driver.name, driver.name, 'high', 'extracted')

  const rest = normalizeText(`${ctx.description} ${ctx.sku ?? ''} ${ctx.brand ?? ''}`)
  const found = DRIVER_REFS.find((d) =>
    d.aliases.some((a) => {
      const norm = normalizeText(a)
      return norm.length >= 8 && rest.includes(norm)
    }),
  )
  if (found) return buildDetected(found.name, found.name, 'medium', 'inferred')
  return null
}

export { detectDriver }

/* ------------------------------------------------------------------ */
/* Temporada                                                           */
/* ------------------------------------------------------------------ */

function detectSeason(ctx: SearchContext): DetectedValue<number> | null {
  let bestYear = 0
  let bestInTitle = false

  const collect = (parts: string[], inTitle: boolean): void => {
    for (const p of parts) {
      const matches = [...p.matchAll(/\b(19|20)\d{2}\b/g)].map((m) => Number(m[0]))
      const valid = matches.filter((y) => y >= 1950 && y <= 2030)
      if (valid.length === 0) continue
      const year = valid[valid.length - 1]
      if (year >= bestYear) {
        bestYear = year
        bestInTitle = inTitle
      }
    }
  }

  collect([ctx.title], true)
  collect([ctx.description, ctx.sku ?? '', ctx.brand ?? ''], false)

  if (bestYear > 0) {
    return buildDetected(bestYear, String(bestYear), bestInTitle ? 'high' : 'medium', 'extracted')
  }
  return null
}

export { detectSeason }

/* ------------------------------------------------------------------ */
/* Escala y categoría                                                  */
/* ------------------------------------------------------------------ */

function detectScale(ctx: SearchContext): DetectedValue<string> | null {
  const haystack = normalizeText(ctx.title)
  const matches = [...haystack.matchAll(/\b1\s*[:/]\s*(\d{2,3})\b/g)]
  if (matches.length > 0) {
    const scale = `1:${matches[matches.length - 1][1]}`
    return buildDetected(scale, scale, 'high', 'extracted')
  }
  const rest = normalizeText(`${ctx.description} ${ctx.sku ?? ''} ${ctx.brand ?? ''}`)
  const restMatches = [...rest.matchAll(/\b1\s*[:/]\s*(\d{2,3})\b/g)]
  if (restMatches.length > 0) {
    const scale = `1:${restMatches[restMatches.length - 1][1]}`
    return buildDetected(scale, scale, 'medium', 'inferred')
  }
  return null
}

export { detectScale }

function detectCategory(ctx: SearchContext, scale: DetectedValue<string> | null): DetectedValue<string> | null {
  if (scale) return buildDetected(scale.value, scale.value, scale.confidence, 'inferred')

  const haystack = normalizeText(`${ctx.title} ${ctx.description}`)
  const cat = (categoriesData as Array<{ name: string; label?: string }>).find((c) =>
    haystack.includes(normalizeText(c.name)),
  )
  if (cat) return buildDetected(cat.name, cat.label ?? cat.name, 'medium', 'extracted')
  return null
}

export { detectCategory }

/* ------------------------------------------------------------------ */
/* Fabricante                                                          */
/* ------------------------------------------------------------------ */

const MANUFACTURER_ALIASES: Array<[string, string]> = [
  ['bburago', 'Bburago'],
  ['minichamps', 'Minichamps'],
  ['amalgam', 'Amalgam'],
  ['maisto', 'Maisto'],
  ['solido', 'Solido'],
  ['norev', 'Norev'],
  ['ixo', 'IXO'],
  ['spark', 'Spark'],
  ['looksmart', 'Looksmart'],
  ['pocher', 'Pocher'],
  ['tecnomodel', 'Tecnomodel'],
  ['hot wheels', 'Hot Wheels'],
  ['die-cast', 'Die-cast'],
  ['saico', 'Saico'],
  ['bahar', 'Bahar'],
  ['bravo models', 'Bravo Models'],
  ['carrera', 'Carrera'],
]

function detectManufacturer(ctx: SearchContext): DetectedValue<string> | null {
  const haystack = normalizeText(`${ctx.title} ${ctx.description} ${ctx.sku ?? ''} ${ctx.brand ?? ''}`)
  let best: [string, string] | null = null
  let bestLen = 0
  for (const [alias, display] of MANUFACTURER_ALIASES) {
    const norm = normalizeText(alias)
    if (norm.length < 6) continue
    if (haystack.includes(norm) && norm.length > bestLen) {
      best = [display, norm]
      bestLen = norm.length
    }
  }
  if (!best) return null
  const inTitle = normalizeText(ctx.title).includes(best[1])
  return buildDetected(best[0], best[0], inTitle ? 'high' : 'medium', 'extracted')
}

export { detectManufacturer }

/* ------------------------------------------------------------------ */
/* Material                                                            */
/* ------------------------------------------------------------------ */

const MATERIAL_ALIASES: Array<[string, string]> = [
  ['aleación', 'Cuerpo de aleación'],
  ['aleacion', 'Cuerpo de aleación'],
  ['aleazione', 'Cuerpo de aleación'],
  ['die-cast', 'Cuerpo de aleación (die-cast)'],
  ['diecast', 'Cuerpo de aleación (die-cast)'],
  ['zamak', 'Chasis de zamak'],
  ['resina', 'Resina'],
  ['resin', 'Resina'],
  ['plástico', 'Plástico'],
  ['plastico', 'Plástico'],
  ['metal fundido', 'Metal fundido'],
  ['cuerpo de metal', 'Cuerpo de metal'],
]

function detectMaterial(ctx: SearchContext, specs: ImportedSpec[] = []): DetectedValue<string> | null {
  const findSpec = (keys: string[]) => {
    for (const spec of specs) {
      const label = normalizeText(spec.label)
      if (keys.some((k) => label.includes(normalizeText(k)))) return spec
    }
    return null
  }
  const spec = findSpec(['material', 'cuerpo', 'aleación', 'aleacion'])
  if (spec) return buildDetected(spec.value, spec.value, 'high', 'extracted')

  const haystack = normalizeText(`${ctx.title} ${ctx.description} ${ctx.brand ?? ''}`)
  let best: [string, string] | null = null
  let bestLen = 0
  for (const [alias, display] of MATERIAL_ALIASES) {
    const norm = normalizeText(alias)
    if (norm.length < 8) continue
    if (haystack.includes(norm) && norm.length > bestLen) {
      best = [display, norm]
      bestLen = norm.length
    }
  }
  if (!best) return null
  const inTitle = normalizeText(ctx.title).includes(best[1])
  return buildDetected(best[0], best[0], inTitle ? 'high' : 'medium', 'extracted')
}

export { detectMaterial }

/* ------------------------------------------------------------------ */
/* Dimensiones y peso                                                  */
/* ------------------------------------------------------------------ */

function detectDimensions(ctx: SearchContext, specs: ImportedSpec[] = []): DetectedValue<string> | null {
  const findSpec = (keys: string[]) => {
    for (const spec of specs) {
      const label = normalizeText(spec.label)
      if (keys.some((k) => label.includes(normalizeText(k)))) return spec
    }
    return null
  }
  const spec = findSpec(['dimensión', 'dimension', 'medida', 'tamaño', 'tamano'])
  if (spec) return buildDetected(spec.value, spec.value, 'high', 'extracted')

  const haystack = normalizeText(`${ctx.title} ${ctx.description}`)
  const m = haystack.match(/(\d+(?:[.,]\d+)?)\s*[x×]\s*(\d+(?:[.,]\d+)?)\s*[x×]\s*(\d+(?:[.,]\d+)?)\s*cm/i)
  if (m) {
    const value = `${m[1]} × ${m[2]} × ${m[3]} cm`
    return buildDetected(value, value, 'medium', 'inferred')
  }
  return null
}

export { detectDimensions }

function detectWeight(ctx: SearchContext, specs: ImportedSpec[] = []): DetectedValue<string> | null {
  const findSpec = (keys: string[]) => {
    for (const spec of specs) {
      const label = normalizeText(spec.label)
      if (keys.some((k) => label.includes(normalizeText(k)))) return spec
    }
    return null
  }
  const spec = findSpec(['peso', 'weight'])
  if (spec) return buildDetected(spec.value, spec.value, 'high', 'extracted')

  const haystack = normalizeText(`${ctx.title} ${ctx.description}`)
  const m = haystack.match(/(\d+(?:[.,]\d+)?)\s*g\b/i)
  if (m) {
    const value = `${m[1]} g`
    return buildDetected(value, value, 'medium', 'inferred')
  }
  return null
}

export { detectWeight }

/* ------------------------------------------------------------------ */
/* Edición especial                                                    */
/* ------------------------------------------------------------------ */

const SPECIAL_EDITION_TERMS = [
  'edición especial',
  'edicion especial',
  'edición limitada',
  'edicion limitada',
  'edición única',
  'edicion unica',
  'edición de colección',
  'edicion de coleccion',
  'limited edition',
  'special edition',
  'single edition',
]

function detectSpecialEdition(ctx: SearchContext): DetectedValue<boolean> | null {
  const haystack = normalizeText(`${ctx.title} ${ctx.description}`)
  for (const term of SPECIAL_EDITION_TERMS) {
    const norm = normalizeText(term)
    if (haystack.includes(norm)) return buildDetected(true, 'Sí', 'high', 'extracted')
  }
  return null
}

export { detectSpecialEdition }

/* ------------------------------------------------------------------ */
/* Detección completa                                                  */
/* ------------------------------------------------------------------ */

export function detectAll(
  ctx: SearchContext,
  specs: ImportedSpec[] = [],
): F1Detection {
  const scale = detectScale(ctx)
  return {
    team: detectTeam(ctx),
    driver: detectDriver(ctx),
    season: detectSeason(ctx),
    scale,
    category: detectCategory(ctx, scale),
    manufacturer: detectManufacturer(ctx),
    material: detectMaterial(ctx, specs),
    dimensions: detectDimensions(ctx, specs),
    weight: detectWeight(ctx, specs),
    specialEdition: detectSpecialEdition(ctx),
  }
}

export function getDetectedKeys(detection: F1Detection): (keyof F1Detection)[] {
  return (Object.keys(detection) as (keyof F1Detection)[]).filter((k) => detection[k] !== null)
}

export function getMissingKeys(detection: F1Detection): (keyof F1Detection)[] {
  return (Object.keys(detection) as (keyof F1Detection)[]).filter((k) => detection[k] === null)
}

export function detectionStats(detection: F1Detection): {
  detected: number
  missing: number
  high: number
  medium: number
  low: number
  total: number
} {
  const keys = getDetectedKeys(detection)
  return {
    detected: keys.length,
    missing: (Object.keys(detection) as (keyof F1Detection)[]).length - keys.length,
    high: keys.filter((k) => detection[k]?.confidence === 'high').length,
    medium: keys.filter((k) => detection[k]?.confidence === 'medium').length,
    low: keys.filter((k) => detection[k]?.confidence === 'low').length,
    total: (Object.keys(detection) as (keyof F1Detection)[]).length,
  }
}

/** Convierte una detección F1 en una lista de valores detectados con metadatos. */
export function toDetectedList(
  detection: F1Detection,
): Array<{ key: keyof F1Detection; detected: DetectedValue<unknown> }> {
  return getDetectedKeys(detection).map((key) => ({
    key,
    detected: detection[key] as DetectedValue<unknown>,
  }))
}
