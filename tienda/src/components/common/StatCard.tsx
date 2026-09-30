import { type ReactNode } from 'react'
import { TrendingDown, TrendingUp, Minus } from 'lucide-react'
import { cx } from '../../utils/format'

interface StatCardProps {
  title: string
  value: string
  icon: ReactNode
  delta?: string
  trend?: 'up' | 'down' | 'neutral'
  sub?: string
  accent?: 'f1' | 'emerald' | 'amber' | 'racing' | 'carbon'
}

const accents: Record<NonNullable<StatCardProps['accent']>, string> = {
  f1: 'bg-f1-500/15 text-f1-400 border-f1-500/30',
  emerald: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  amber: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  racing: 'bg-racing-500/15 text-racing-400 border-racing-500/30',
  carbon: 'bg-carbon-800 text-carbon-300 border-carbon-700',
}

export default function StatCard({
  title,
  value,
  icon,
  delta,
  trend,
  sub,
  accent = 'f1',
}: StatCardProps) {
  const trendIcon =
    trend === 'up' ? (
      <TrendingUp size={14} className="text-emerald-400" />
    ) : trend === 'down' ? (
      <TrendingDown size={14} className="text-f1-500" />
    ) : (
      <Minus size={14} className="text-carbon-500" />
    )
  return (
    <div className="rounded-2xl border border-carbon-800 bg-carbon-900/40 p-5 shadow-lg shadow-black/20">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-carbon-400">
            {title}
          </p>
          <p className="mt-2 font-display text-3xl font-bold text-white">{value}</p>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            {delta && (
              <span
                className={cx(
                  'inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-semibold',
                  trend === 'up'
                    ? 'bg-emerald-500/10 text-emerald-400'
                    : trend === 'down'
                      ? 'bg-f1-500/10 text-f1-400'
                      : 'bg-carbon-800 text-carbon-400',
                )}
              >
                {trendIcon}
                {delta}
              </span>
            )}
            {sub && (
              <span className="text-[11px] text-carbon-500">{sub}</span>
            )}
          </div>
        </div>
        <div
          className={cx(
            'flex size-11 shrink-0 items-center justify-center rounded-xl border',
            accents[accent],
          )}
        >
          {icon}
        </div>
      </div>
    </div>
  )
}