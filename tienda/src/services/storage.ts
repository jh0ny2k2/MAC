/**
 * Capa de almacenamiento simulada.
 * Los archivos JSON actúan como datos iniciales (seed) y la persistencia
 * se simula con localStorage. En el futuro, sustituir esta capa por
 * llamadas reales a una API REST / base de datos sin tocar la interfaz.
 */

const PREFIX = 'apex.db.'

export function dbKey(key: string): string {
  return PREFIX + key
}

export function loadCollection<T>(key: string, seed: T[]): T[] {
  try {
    const raw = localStorage.getItem(dbKey(key))
    if (raw) return JSON.parse(raw) as T[]
  } catch {
    // Datos corruptos: se regeneran desde el seed
  }
  const copy = JSON.parse(JSON.stringify(seed)) as T[]
  try {
    localStorage.setItem(dbKey(key), JSON.stringify(copy))
  } catch {
    // Almacenamiento no disponible (modo privado, etc.)
  }
  return copy
}

export function saveCollection<T>(key: string, data: T[]): void {
  try {
    localStorage.setItem(dbKey(key), JSON.stringify(data))
  } catch {
    // Almacenamiento no disponible
  }
}

export function loadObject<T>(key: string, seed: T): T {
  try {
    const raw = localStorage.getItem(dbKey(key))
    if (raw) return JSON.parse(raw) as T
  } catch {
    // no-op
  }
  const copy = JSON.parse(JSON.stringify(seed)) as T
  try {
    localStorage.setItem(dbKey(key), JSON.stringify(copy))
  } catch {
    // no-op
  }
  return copy
}

export function saveObject<T>(key: string, data: T): void {
  try {
    localStorage.setItem(dbKey(key), JSON.stringify(data))
  } catch {
    // no-op
  }
}

export function nextId<T extends { id: number }>(collection: T[]): number {
  return collection.length > 0 ? Math.max(...collection.map((item) => item.id)) + 1 : 1
}

export function simulateDelay(ms = 350): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}