import { type ReactNode } from 'react'
import { cx } from '../../utils/format'

export interface Column<T> {
  key: string
  header: string
  className?: string
  headerClassName?: string
  render: (row: T) => ReactNode
}

interface DataTableProps<T> {
  columns: Column<T>[]
  rows: T[]
  rowKey: (row: T) => string | number
  loading?: boolean
  empty?: ReactNode
  onRowClick?: (row: T) => void
}

function SkeletonRows({ count = 6 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <tr key={i} className="border-b border-carbon-800/60">
          {[32, 22, 26, 20, 24, 16].map((w, j) => (
            <td key={j} className="px-4 py-4">
              <div
                className="h-3.5 animate-pulse rounded bg-carbon-800"
                style={{ width: `${w}%` }}
              />
            </td>
          ))}
        </tr>
      ))}
    </>
  )
}

export default function DataTable<T>({
  columns,
  rows,
  rowKey,
  loading,
  empty,
  onRowClick,
}: DataTableProps<T>) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-carbon-800 bg-carbon-900/40">
      <table className="w-full min-w-[640px] border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-carbon-800 bg-carbon-950/40">
            {columns.map((col) => (
              <th
                key={col.key}
                className={cx(
                  'px-4 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-carbon-400',
                  col.headerClassName,
                )}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <SkeletonRows />
          ) : rows.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-4 py-16">
                {empty ?? (
                  <p className="text-center text-sm text-carbon-500">
                    No hay resultados para mostrar.
                  </p>
                )}
              </td>
            </tr>
          ) : (
            rows.map((row) => (
              <tr
                key={rowKey(row)}
                onClick={() => onRowClick?.(row)}
                className={cx(
                  'border-b border-carbon-800/60 transition-colors',
                  onRowClick
                    ? 'cursor-pointer hover:bg-carbon-800/40'
                    : 'hover:bg-carbon-800/20',
                )}
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={cx('px-4 py-4 align-middle text-carbon-200', col.className)}
                  >
                    {col.render(row)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}