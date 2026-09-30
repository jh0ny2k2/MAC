import { type ReactNode } from 'react'
import { cx } from '../../utils/format'

interface ChipProps {
  children: ReactNode
  className?: string
  variant?: 'default' | 'team' | 'outline'
}

export default function Chip({ children, className, variant = 'default' }: ChipProps) {
  const variants = {
    default: 'bg-carbon-800 text-carbon-300 border border-carbon-700',
    team: 'text-white',
    outline: 'border border-carbon-600 text-carbon-200 hover:border-carbon-400',
  }
  return (
    <span
      className={cx(
        'inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-[11px] font-medium',
        variants[variant],
        className,
      )}
    >
      {children}
    </span>
  )
}