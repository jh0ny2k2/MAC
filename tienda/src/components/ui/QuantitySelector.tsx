import { Minus, Plus } from 'lucide-react'
import { cx } from '../../utils/format'

interface QuantitySelectorProps {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  size?: 'sm' | 'md'
  className?: string
}

export default function QuantitySelector({
  value,
  onChange,
  min = 1,
  max = 99,
  size = 'md',
  className,
}: QuantitySelectorProps) {
  const buttonSize = size === 'md' ? 'size-9' : 'size-8'

  return (
    <div
      className={cx(
        'inline-flex items-center rounded-lg border border-carbon-600 bg-carbon-800',
        className,
      )}
    >
      <button
        type="button"
        aria-label="Disminuir cantidad"
        onClick={() => onChange(Math.max(min, value - 1))}
        className={cx('flex items-center justify-center text-carbon-300 transition-colors hover:text-white', buttonSize)}
      >
        <Minus size={14} />
      </button>
      <span className={cx('flex items-center justify-center font-display font-semibold text-white', size === 'md' ? 'w-10 text-base' : 'w-8 text-sm')}>
        {value}
      </span>
      <button
        type="button"
        aria-label="Aumentar cantidad"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        className={cx('flex items-center justify-center text-carbon-300 transition-colors hover:text-white disabled:cursor-not-allowed disabled:opacity-40', buttonSize)}
      >
        <Plus size={14} />
      </button>
    </div>
  )
}