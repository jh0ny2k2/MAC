import { useState } from 'react'
import { SlidersHorizontal, X } from 'lucide-react'
import type { FilterState } from '../types'
import ProductFilters from './ProductFilters'
import Button from './ui/Button'

interface MobileFiltersProps {
  filters: FilterState
  onChange: (patch: Partial<FilterState>) => void
  onClear: () => void
  activeCount: number
}

export default function MobileFilters({ filters, onChange, onClear, activeCount }: MobileFiltersProps) {
  const [open, setOpen] = useState(false)

  return (
    <div className="lg:hidden">
      <Button
        variant="outline"
        onClick={() => setOpen(true)}
        className="flex-1"
      >
        <SlidersHorizontal size={15} />
        Filtros{activeCount > 0 && <span className="rounded-full bg-f1-500 px-1.5 text-[10px] font-bold text-white">{activeCount}</span>}
      </Button>

      {open && (
        <div className="fixed inset-0 z-[80] lg:hidden" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="absolute inset-y-0 left-0 w-[88vw] max-w-sm overflow-y-auto bg-carbon-900 shadow-2xl animate-slide-in-right">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-carbon-800 bg-carbon-900/95 px-5 py-4 backdrop-blur-xl">
              <h3 className="font-display text-sm font-semibold uppercase tracking-[0.18em] text-white">Filtros</h3>
              <button
                onClick={() => setOpen(false)}
                className="flex size-8 items-center justify-center rounded-lg text-carbon-300 transition-colors hover:bg-carbon-800 hover:text-white"
                aria-label="Cerrar filtros"
              >
                <X size={18} />
              </button>
            </div>
            <div className="px-5 pb-8 pt-2">
              <ProductFilters filters={filters} onChange={onChange} onClear={onClear} />
              <Button block className="mt-5" onClick={() => setOpen(false)}>
                Ver resultados
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}