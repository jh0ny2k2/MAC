import { cx } from '../../utils/format'

export type BadgeTone =
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
  | 'neutral'
  | 'violet'
  | 'cyan'

const tones: Record<BadgeTone, string> = {
  success: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
  warning: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
  danger: 'bg-f1-500/10 text-f1-400 border-f1-500/30',
  info: 'bg-sky-500/10 text-sky-400 border-sky-500/30',
  neutral: 'bg-carbon-800 text-carbon-400 border-carbon-700',
  violet: 'bg-violet-500/10 text-violet-400 border-violet-500/30',
  cyan: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
}

interface StatusBadgeProps {
  status: string
  tone?: BadgeTone
  dot?: boolean
  className?: string
}

const statusTone: Record<string, BadgeTone> = {
  Pendiente: 'warning',
  Confirmado: 'info',
  Preparando: 'violet',
  Enviado: 'cyan',
  Entregado: 'success',
  Cancelado: 'danger',
  Pagado: 'success',
  Reembolsado: 'neutral',
  activo: 'success',
  inactivo: 'neutral',
  disponible: 'success',
  'poco-stock': 'warning',
  agotado: 'danger',
  borrador: 'neutral',
  draft: 'neutral',
  published: 'success',
  publishedActivo: 'success',
  partial: 'warning',
  error: 'danger',
  Parcial: 'warning',
  Correcto: 'success',
  programado: 'info',
  expirado: 'danger',
  desactivado: 'neutral',
}

const dotColor: Record<BadgeTone, string> = {
  success: 'bg-emerald-400',
  warning: 'bg-amber-400',
  danger: 'bg-f1-500',
  info: 'bg-sky-400',
  neutral: 'bg-carbon-500',
  violet: 'bg-violet-400',
  cyan: 'bg-cyan-400',
}

export default function StatusBadge({
  status,
  tone,
  dot = true,
  className,
}: StatusBadgeProps) {
  const style = (tone ?? statusTone[status] ?? 'neutral') as BadgeTone
  return (
    <span
      className={cx(
        'inline-flex items-center gap-1.5 rounded-md border px-2 py-1 text-[11px] font-semibold whitespace-nowrap',
        tones[style],
        className,
      )}
    >
      {dot && (
        <span className={cx('size-1.5 rounded-full', dotColor[style])} />
      )}
      {status}
    </span>
  )
}