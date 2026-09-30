import type { Confidence } from '../../../types/import'
import { cx } from '../../../utils/format'

const STYLES: Record<Confidence, string> = {
  high: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400',
  medium: 'border-amber-500/30 bg-amber-500/10 text-amber-400',
  low: 'border-f1-500/30 bg-f1-500/10 text-f1-400',
}

const LABELS: Record<Confidence, string> = {
  high: 'Alta confianza',
  medium: 'Media confianza',
  low: 'Baja confianza',
}

interface ConfidenceBadgeProps {
  confidence: Confidence
  className?: string
}

export default function ConfidenceBadge({ confidence, className }: ConfidenceBadgeProps) {
  return (
    <span
      className={cx(
        'inline-flex items-center rounded-md border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider whitespace-nowrap',
        STYLES[confidence],
        className,
      )}
    >
      {LABELS[confidence]}
    </span>
  )
}