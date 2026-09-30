import type { Category, Driver, Product, Team } from '../types'
import { loadCollection } from '../services/storage'
import productsData from './products.json'
import teamsData from './teams.json'
import driversData from './drivers.json'
import categoriesData from './categories.json'

// Los productos en estado "borrador" nunca se muestran en la tienda pública.
// La gestión de productos (localStorage) sí puede verlos para su revisión.
export const products: Product[] = loadCollection<Product>(
  'products',
  productsData as Product[],
).filter((p) => p.status !== 'borrador')
export const teams: Team[] = loadCollection<Team>('teams', teamsData)
export const drivers: Driver[] = loadCollection<Driver>('drivers', driversData)
export const categories: Category[] = loadCollection<Category>(
  'categories',
  categoriesData,
)

export function getProductById(id: number): Product | undefined {
  return products.find((p) => p.id === id)
}

export function getTeamById(id: string): Team | undefined {
  return teams.find((t) => t.id === id)
}

export function getTeamByName(name: string): Team | undefined {
  return teams.find((t) => t.name === name)
}

export function getProductsByTeam(teamName: string): Product[] {
  return products.filter((p) => p.team === teamName)
}

export function getProductsByDriver(driverName: string): Product[] {
  return products.filter((p) => p.driver === driverName)
}

export function getDiscountedProducts(): Product[] {
  return products
    .filter((p) => (p.oldPrice ?? 0) > p.price)
    .sort((a, b) => (b.discount ?? 0) - (a.discount ?? 0))
}

export function getFeaturedProducts(): Product[] {
  return products.filter((p) => p.featured)
}

export function getBestsellers(): Product[] {
  return products.filter((p) => p.bestseller)
}

export function getRelatedProducts(product: Product, limit = 4): Product[] {
  const sameTeam = products.filter(
    (p) => p.id !== product.id && p.team === product.team,
  )
  const sameScale = products.filter(
    (p) => p.id !== product.id && p.scale === product.scale,
  )
  const pool = [...sameTeam, ...sameScale.filter((p) => !sameTeam.includes(p))]
  if (pool.length >= limit) return pool.slice(0, limit)
  const rest = products.filter((p) => p.id !== product.id && !pool.includes(p))
  return [...pool, ...rest].slice(0, limit)
}

export function filterProducts(
  options: {
    search?: string
    teams?: string[]
    drivers?: string[]
    scales?: string[]
    inStockOnly?: boolean
    minPrice?: number
    maxPrice?: number
  } = {},
): Product[] {
  const {
    search = '',
    teams: teamList = [],
    drivers: driverList = [],
    scales = [],
    inStockOnly = false,
    minPrice = 0,
    maxPrice = Number.MAX_SAFE_INTEGER,
  } = options

  const term = search.trim().toLowerCase()

  return products.filter((p) => {
    if (teamList.length > 0 && !teamList.includes(p.team)) return false
    if (driverList.length > 0 && !driverList.includes(p.driver)) return false
    if (scales.length > 0 && !scales.includes(p.scale)) return false
    if (inStockOnly && p.stock <= 0) return false
    if (p.price < minPrice || p.price > maxPrice) return false
    if (term) {
      const haystack = `${p.name} ${p.team} ${p.driver} ${p.manufacturer} ${p.scale} ${p.season}`.toLowerCase()
      if (!haystack.includes(term)) return false
    }
    return true
  })
}