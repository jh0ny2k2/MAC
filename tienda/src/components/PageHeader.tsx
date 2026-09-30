import { type ReactNode } from 'react'

interface PageHeaderProps {
  eyebrow: string
  title: string
  description?: string
  children?: ReactNode
}

export default function PageHeader({ eyebrow, title, description, children }: PageHeaderProps) {
  return (
    <div className="relative overflow-hidden border-b border-carbon-800 bg-carbon-900/60">
      <div className="speed-lines absolute inset-0 opacity-60" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-f1-500/60 to-transparent" />
      <div className="relative mx-auto flex max-w-[1440px] flex-wrap items-end justify-between gap-6 px-4 py-14 sm:px-6 lg:px-8">
        <div>
          <p className="mb-3 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-f1-500">
            <span className="h-px w-8 bg-f1-500" />
            {eyebrow}
          </p>
          <h1 className="font-display text-4xl font-bold uppercase leading-tight tracking-wide text-white sm:text-5xl">
            {title}
          </h1>
          {description && (
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-carbon-400">{description}</p>
          )}
        </div>
        {children}
      </div>
    </div>
  )
}