import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { SearchX } from 'lucide-react'
import type { FilterState, Product, SortOption } from '../types'
import { DEFAULT_FILTERS } from '../types'
import { filterProducts, getTeamById, getTeamByName } from '../data'
import PageHeader from '../components/PageHeader'
import ProductGrid from '../components/ProductGrid'
import ProductFilters from '../components/ProductFilters'
import MobileFilters from '../components/MobileFilters'
import SortSelect from '../components/SortSelect'
import Button from '../components/ui/Button'
import EmptyState from '../components/ui/EmptyState'

function parseFilters(params: URLSearchParams): FilterState {
  const teams = params
    .getAll('team')
    .map((id) => getTeamById(id)?.name)
    .filter((n): n is string => Boolean(n))
  const drivers = params.getAll('driver')
  const scales = params.getAll('scale')
  const inStockOnly = params.get('inStockOnly') === '1'
  const minPrice = params.get('minPrice') ? Number(params.get('minPrice')) : DEFAULT_FILTERS.minPrice
  const maxPrice = params.get('maxPrice') ? Number(params.get('maxPrice')) : DEFAULT_FILTERS.maxPrice
  const sortBy = (params.get('sortBy') as SortOption) || DEFAULT_FILTERS.sortBy

  return {
    search: params.get('search') ?? DEFAULT_FILTERS.search,
    teams,
    drivers,
    scales,
    inStockOnly,
    minPrice,
    maxPrice,
    sortBy,
  }
}

function sortProducts(list: Product[], sortBy: SortOption): Product[] {
  const sorted = [...list]
  switch (sortBy) {
    case 'bestsellers':
      return sorted.sort((a, b) => Number(b.bestseller) - Number(a.bestseller) || b.rating - a.rating)
    case 'price-asc':
      return sorted.sort((a, b) => a.price - b.price)
    case 'price-desc':
      return sorted.sort((a, b) => b.price - a.price)
    case 'newest':
      return sorted.sort((a, b) => b.season - a.season)
    case 'featured':
    default:
      return sorted.sort(
        (a, b) => Number(b.featured) - Number(a.featured) || Number(b.bestseller) - Number(a.bestseller),
      )
  }
}

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [loading, setLoading] = useState(true)

  const filters = useMemo(() => parseFilters(searchParams), [searchParams])

  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 500)
    return () => window.clearTimeout(timer)
  }, [])

  const applyPatch = (patch: Partial<FilterState>) => {
    const next = new URLSearchParams(searchParams)
    const merged = { ...filters, ...patch }

    if (merged.search) next.set('search', merged.search)
    else next.delete('search')

    next.delete('team')
    for (const name of merged.teams) {
      const team = getTeamByName(name)
      if (team) next.append('team', team.id)
    }

    next.delete('driver')
    for (const driver of merged.drivers) next.append('driver', driver)

    next.delete('scale')
    for (const scale of merged.scales) next.append('scale', scale)

    if (merged.inStockOnly) next.set('inStockOnly', '1')
    else next.delete('inStockOnly')

    if (merged.minPrice > 0) next.set('minPrice', String(merged.minPrice))
    else next.delete('minPrice')

    if (merged.maxPrice < 200) next.set('maxPrice', String(merged.maxPrice))
    else next.delete('maxPrice')

    next.set('sortBy', merged.sortBy)
    setSearchParams(next, { replace: true })
  }

  const clearFilters = () => {
    const next = new URLSearchParams()
    next.set('sortBy', 'featured')
    setSearchParams(next, { replace: true })
  }

  const results = useMemo(() => {
    const filtered = filterProducts({
      search: filters.search,
      teams: filters.teams,
      drivers: filters.drivers,
      scales: filters.scales,
      inStockOnly: filters.inStockOnly,
      minPrice: filters.minPrice,
      maxPrice: filters.maxPrice,
    })
    return sortProducts(filtered, filters.sortBy)
  }, [filters])

  const activeCount =
    filters.teams.length +
    filters.drivers.length +
    filters.scales.length +
    (filters.inStockOnly ? 1 : 0) +
    (filters.search ? 1 : 0) +
    (filters.minPrice > 0 || filters.maxPrice < 200 ? 1 : 0)

  return (
    <div>
      <PageHeader
        eyebrow="Colección"
        title="La Tienda"
        description="Explora nuestro catálogo de réplicas oficiales de Fórmula 1 a escala. Filtra por escudería, piloto, escala o precio y encuentra tu próxima pieza de colección."
      />

      <section className="mx-auto max-w-[1440px] px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[290px_1fr]">
          <aside className="hidden lg:block lg:max-h-fit lg:sticky lg:top-28">
            <ProductFilters filters={filters} onChange={applyPatch} onClear={clearFilters} />
          </aside>

          <div>
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-1 gap-3 sm:max-w-xs lg:hidden">
                <MobileFilters
                  filters={filters}
                  onChange={applyPatch}
                  onClear={clearFilters}
                  activeCount={activeCount}
                />
              </div>
              <div className="flex flex-1 items-center justify-between gap-3 sm:flex-none">
                <p className="text-sm text-carbon-400">
                  <span className="font-display text-lg font-semibold text-white">{results.length}</span>{' '}
                  {results.length === 1 ? 'modelo' : 'modelos'}
                </p>
                <SortSelect value={filters.sortBy} onChange={(sortBy) => applyPatch({ sortBy })} />
              </div>
            </div>

            <ProductGrid products={results} loading={loading} />

            {!loading && results.length === 0 && (
              <EmptyState
                icon={<SearchX size={28} />}
                title="Sin resultados"
                message="No hemos encontrado modelos que coincidan con tus filtros. Prueba a ampliar la búsqueda o limpiar los filtros."
                action={
                  <Button variant="primary" onClick={clearFilters}>
                    Limpiar filtros
                  </Button>
                }
              />
            )}
          </div>
        </div>
      </section>
    </div>
  )
}