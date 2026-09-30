import { ArrowUpDown } from 'lucide-react'
import type { SortOption } from '../types'

const OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'featured', label: 'Destacados' },
  { value: 'bestsellers', label: 'Más vendidos' },
  { value: 'price-asc', label: 'Precio: menor a mayor' },
  { value: 'price-desc', label: 'Precio: mayor a menor' },
  { value: 'newest', label: 'Más recientes' },
]

interface SortSelectProps {
  value: SortOption
  onChange: (value: SortOption) => void
}

export default function SortSelect({ value, onChange }: SortSelectProps) {
  return (
    <div className="relative">
      <ArrowUpDown size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-carbon-500" />
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as SortOption)}
        className="w-full appearance-none rounded-lg border border-carbon-700 bg-carbon-800 py-2.5 pl-9 pr-8 text-sm text-carbon-100 transition-colors focus:border-f1-500/70 focus:outline-none sm:w-auto"
        aria-label="Ordenar productos"
      >
        {OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <svg
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-carbon-500"
        width="12"
        height="12"
        viewBox="0 0 12 12"
        fill="none"
      >
        <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  )
}