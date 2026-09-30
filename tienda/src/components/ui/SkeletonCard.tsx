import { cx } from '../../utils/format'

export default function SkeletonCard({ className }: { className?: string }) {
  return (
    <div className={cx('overflow-hidden rounded-2xl border border-carbon-800 bg-carbon-900', className)}>
      <div className="relative aspect-[4/3] overflow-hidden bg-carbon-850">
        <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/5 to-transparent" />
      </div>
      <div className="space-y-3 p-5">
        <div className="h-3 w-1/3 animate-shimmer rounded-md bg-carbon-800" />
        <div className="h-4 w-3/4 animate-shimmer rounded-md bg-carbon-800" />
        <div className="h-3 w-1/2 animate-shimmer rounded-md bg-carbon-800" />
        <div className="h-9 w-full animate-shimmer rounded-lg bg-carbon-800" />
      </div>
    </div>
  )
}