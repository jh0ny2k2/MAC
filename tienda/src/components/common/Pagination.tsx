import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cx } from '../../utils/format'

interface PaginationProps {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
  totalItems?: number
  pageSize?: number
}

export default function Pagination({
  page,
  totalPages,
  onPageChange,
  totalItems,
  pageSize,
}: PaginationProps) {
  if (totalPages <= 1) return null

  const visiblePages = Array.from(
    { length: totalPages },
    (_, i) => i + 1,
  ).filter((p) => {
    if (Math.abs(p - page) <= 1) return true
    if (p === 1 || p === totalPages) return true
    return false
  })

  const orderedVisible = [...new Set(visiblePages)]

  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="text-xs text-carbon-500">
        Página {page} de {totalPages}
        {totalItems !== undefined && (
          <>
            {' '}
            · {totalItems} elementos
            {pageSize ? ` (${pageSize} por página)` : ''}
          </>
        )}
      </div>
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          className="inline-flex size-8 items-center justify-center rounded-lg border border-carbon-700 text-carbon-300 transition-colors hover:border-carbon-500 disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Página anterior"
        >
          <ChevronLeft size={15} />
        </button>
        {orderedVisible.map((p, i) => {
          const gap = i > 0 && p - orderedVisible[i - 1] > 1
          return (
            <span key={p} className="flex items-center gap-1.5">
              {gap && <span className="px-1 text-xs text-carbon-600">…</span>}
              <button
                type="button"
                onClick={() => onPageChange(p)}
                className={cx(
                  'inline-flex size-8 items-center justify-center rounded-lg text-sm font-medium transition-colors',
                  p === page
                    ? 'bg-f1-500 text-white'
                    : 'border border-carbon-700 text-carbon-300 hover:border-carbon-500',
                )}
              >
                {p}
              </button>
            </span>
          )
        })}
        <button
          type="button"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          className="inline-flex size-8 items-center justify-center rounded-lg border border-carbon-700 text-carbon-300 transition-colors hover:border-carbon-500 disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Página siguiente"
        >
          <ChevronRight size={15} />
        </button>
      </div>
    </div>
  )
}