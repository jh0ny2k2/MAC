import { type ReactNode } from 'react'
import { cx } from '../../utils/format'

interface SectionHeaderProps {
  eyebrow?: string
  title: string
  description?: string
  align?: 'left' | 'center'
  action?: ReactNode
  className?: string
}

export default function SectionHeader({
  eyebrow,
  title,
  description,
  align = 'left',
  action,
  className,
}: SectionHeaderProps) {
  return (
    <div
      className={cx(
        'flex flex-wrap items-end justify-between gap-4',
        align === 'center' && 'flex-col items-center text-center',
        className,
      )}
    >
      <div className={cx('max-w-2xl', align === 'center' && 'mx-auto')}>
        {eyebrow && (
          <p className="mb-2 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-f1-500">
            <span className="h-px w-8 bg-f1-500" />
            {eyebrow}
          </p>
        )}
        <h2 className="font-display text-3xl font-semibold uppercase leading-tight tracking-wide text-white sm:text-4xl">
          {title}
        </h2>
        {description && <p className="mt-3 text-sm leading-relaxed text-carbon-400">{description}</p>}
      </div>
      {action}
    </div>
  )
}