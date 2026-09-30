import { RotateCcw } from 'lucide-react'
import type { FilterState } from '../types'
import { products, teams } from '../data'
import { cx, formatPrice } from '../utils/format'
import SearchBar from './SearchBar'

interface ProductFiltersProps {
  filters: FilterState
  onChange: (patch: Partial<FilterState>) => void
  onClear: () => void
  className?: string
}

function FilterSection({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="space-y-3 border-b border-carbon-800 py-5">
      <h4 className="font-display text-xs font-semibold uppercase tracking-[0.18em] text-carbon-300">
        {title}
      </h4>
      <div className="space-y-2.5">{children}</div>
    </section>
  )
}

function CheckboxRow({
  label,
  count,
  checked,
  color,
  onChange,
}: {
  label: string
  count: number
  checked: boolean
  color?: string
  onChange: (checked: boolean) => void
}) {
  return (
    <label className="group flex cursor-pointer items-center gap-3 text-sm">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="size-4 shrink-0 cursor-pointer appearance-none rounded border border-carbon-600 bg-carbon-800 transition-colors checked:border-f1-500 checked:bg-f1-500"
      />
      <span className="flex flex-1 items-center gap-2 text-carbon-300 transition-colors group-hover:text-white">
        {color && <span className="size-2 rounded-full" style={{ backgroundColor: color }} />}
        {label}
      </span>
      <span className="text-xs text-carbon-500">{count}</span>
    </label>
  )
}

export default function ProductFilters({ filters, onChange, onClear, className }: ProductFiltersProps) {
  const availableTeams = [...new Set(products.map((p) => p.team))].sort()
  const drivers = [...new Set(products.map((p) => p.driver))].sort()
  const scales = [...new Set(products.map((p) => p.scale))].sort(
    (a, b) => Number(a.split(':')[1]) - Number(b.split(':')[1]),
  )

  const teamColorMap = Object.fromEntries(teams.map((t) => [t.name, t.color]))

  const activeCount =
    filters.teams.length +
    filters.drivers.length +
    filters.scales.length +
    (filters.inStockOnly ? 1 : 0) +
    (filters.search ? 1 : 0) +
    (filters.minPrice > 0 || filters.maxPrice < 200 ? 1 : 0)

  return (
    <div className={cx('rounded-2xl border border-carbon-800 bg-carbon-900/70 p-6', className)}>
      <div className="flex items-center justify-between border-b border-carbon-800 pb-4">
        <h3 className="font-display text-sm font-semibold uppercase tracking-[0.18em] text-white">
          Filtros
        </h3>
        {activeCount > 0 && (
          <button
            onClick={onClear}
            className="inline-flex items-center gap-1 text-xs text-f1-500 transition-colors hover:text-f1-400"
          >
            <RotateCcw size={12} />
            Limpiar ({activeCount})
          </button>
        )}
      </div>

      <FilterSection title="Búsqueda">
        <SearchBar
          value={filters.search}
          onChange={(search) => onChange({ search })}
          placeholder="Buscar por modelo…"
        />
      </FilterSection>

      <FilterSection title="Escuderías">
        {availableTeams.map((team) => {
          return (
            <CheckboxRow
              key={team}
              label={team}
              count={products.filter((p) => p.team === team).length}
              color={teamColorMap[team]}
              checked={filters.teams.includes(team)}
              onChange={(checked) =>
                onChange({
                  teams: checked
                    ? [...filters.teams, team]
                    : filters.teams.filter((t) => t !== team),
                })
              }
            />
          )
        })}
      </FilterSection>

      <FilterSection title="Pilotos">
        {drivers.map((driver) => (
          <CheckboxRow
            key={driver}
            label={driver}
            count={products.filter((p) => p.driver === driver).length}
            checked={filters.drivers.includes(driver)}
            onChange={(checked) =>
              onChange({
                drivers: checked
                  ? [...filters.drivers, driver]
                  : filters.drivers.filter((d) => d !== driver),
              })
            }
          />
        ))}
      </FilterSection>

      <FilterSection title="Escala">
        {scales.map((scale) => (
          <CheckboxRow
            key={scale}
            label={`Escala ${scale}`}
            count={products.filter((p) => p.scale === scale).length}
            checked={filters.scales.includes(scale)}
            onChange={(checked) =>
              onChange({
                scales: checked ? [...filters.scales, scale] : filters.scales.filter((s) => s !== scale),
              })
            }
          />
        ))}
      </FilterSection>

      <FilterSection title="Precio (€)">
        <div className="flex items-center gap-3">
          <input
            type="number"
            value={filters.minPrice}
            min={0}
            onChange={(e) => onChange({ minPrice: Number(e.target.value) || 0 })}
            className="w-full rounded-lg border border-carbon-700 bg-carbon-800 px-3 py-2 text-sm text-carbon-100 transition-colors focus:border-f1-500/70 focus:outline-none"
            placeholder="0"
          />
          <span className="text-carbon-500">—</span>
          <input
            type="number"
            value={filters.maxPrice}
            min={0}
            onChange={(e) => onChange({ maxPrice: Number(e.target.value) || 0 })}
            className="w-full rounded-lg border border-carbon-700 bg-carbon-800 px-3 py-2 text-sm text-carbon-100 transition-colors focus:border-f1-500/70 focus:outline-none"
            placeholder={formatPrice(200)}
          />
        </div>
      </FilterSection>

      <FilterSection title="Disponibilidad">
        <CheckboxRow
          label="Solo artículos en stock"
          count={0}
          checked={filters.inStockOnly}
          onChange={(checked) => onChange({ inStockOnly: checked })}
        />
      </FilterSection>
    </div>
  )
}