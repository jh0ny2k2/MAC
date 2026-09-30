import { cx } from '../../utils/format'

interface LoadingSkeletonProps {
  variant?: 'lines' | 'cards' | 'table'
  count?: number
}

export default function LoadingSkeleton({
  variant = 'cards',
  count = 4,
}: LoadingSkeletonProps) {
  const items = Array.from({ length: count })

  if (variant === 'lines') {
    return (
      <div className="space-y-3">
        {items.map((_, i) => (
          <div key={i} className="animate-pulse">
            <div
              className="h-4 rounded bg-carbon-800"
              style={{ width: `${90 - i * 8}%` }}
            />
            <div className="mt-2 h-3 rounded bg-carbon-900/80 w-[60%]" />
          </div>
        ))}
      </div>
    )
  }

  if (variant === 'table') {
    return (
      <div className="space-y-2">
        <div className="h-9 animate-pulse rounded-lg bg-carbon-800" />
        {items.map((_, i) => (
          <div
            key={i}
            className="h-12 animate-pulse rounded-lg bg-carbon-900/80"
            style={{ animationDelay: `${i * 80}ms` }}
          />
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((_, i) => (
        <div
          key={i}
          className="h-32 animate-pulse rounded-2xl border border-carbon-800 bg-carbon-900/50"
          style={{ animationDelay: `${i * 100}ms` }}
        />
      ))}
    </div>
  )
}

export function TdSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cx('h-3 animate-pulse rounded bg-carbon-800', className)}
    />
  )
}