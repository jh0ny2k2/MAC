import { type ReactNode } from 'react'

interface ChartCardProps {
  title: string
  subtitle?: string
  actions?: ReactNode
  children: ReactNode
  className?: string
}

export default function ChartCard({
  title,
  subtitle,
  actions,
  children,
  className,
}: ChartCardProps) {
  return (
    <div className={`rounded-2xl border border-carbon-800 bg-carbon-900/40 p-5 shadow-lg shadow-black/20 ${className ?? ''}`}>
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="font-display text-base font-semibold text-white">
            {title}
          </h3>
          {subtitle && <p className="mt-0.5 text-xs text-carbon-500">{subtitle}</p>}
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
      {children}
    </div>
  )
}