import { Check } from 'lucide-react'
import type { OrderStatus } from '../../types/admin'
import { cx } from '../../utils/format'

export const ORDER_FLOW: OrderStatus[] = [
  'Pendiente',
  'Confirmado',
  'Preparando',
  'Enviado',
  'Entregado',
]

interface OrderStatusProps {
  status: OrderStatus
  onSelect?: (status: OrderStatus) => void
  compact?: boolean
}

function flowIndex(status: OrderStatus): number {
  if (status === 'Cancelado') return -1
  return ORDER_FLOW.indexOf(status)
}

export default function OrderStatus({ status, onSelect, compact }: OrderStatusProps) {
  const current = flowIndex(status)

  if (status === 'Cancelado') {
    return (
      <div className="inline-flex w-full max-w-xl items-center gap-2.5 rounded-xl border border-f1-500/30 bg-f1-500/10 px-4 py-3">
        <span className="text-sm text-f1-400">Pedido cancelado</span>
      </div>
    )
  }

  return (
    <div className="w-full max-w-xl">
      <div className="flex items-center">
        {ORDER_FLOW.map((step, index) => {
          const done = index <= current
          const isCurrent = index === current
          return (
            <div key={step} className="flex flex-1 items-center last:flex-none">
              <button
                type="button"
                disabled={!onSelect}
                onClick={() => onSelect?.(step)}
                className="flex flex-col items-center gap-2"
              >
                <span
                  className={cx(
                    'flex size-8 items-center justify-center rounded-full border-2 text-[11px] font-bold transition-colors',
                    done
                      ? 'border-emerald-400 bg-emerald-400 text-carbon-950'
                      : 'border-carbon-700 bg-carbon-900 text-carbon-500',
                    isCurrent && !onSelect && 'ring-2 ring-f1-500/40',
                  )}
                >
                  {done ? <Check size={14} /> : index + 1}
                </span>
                {!compact && (
                  <span
                    className={cx(
                      'text-[10px] font-medium text-center whitespace-nowrap',
                      done ? 'text-carbon-200' : 'text-carbon-500',
                    )}
                  >
                    {step}
                  </span>
                )}
              </button>
              {index < ORDER_FLOW.length - 1 && (
                <div
                  className={cx(
                    'mx-1 h-0.5 flex-1 rounded-full -translate-y-4',
                    index < current ? 'bg-emerald-400' : 'bg-carbon-800',
                  )}
                />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}