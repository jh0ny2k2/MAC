import { type ReactNode } from 'react'

interface EmptyStateProps {
  icon: ReactNode
  title: string
  message: string
  action?: ReactNode
}

export default function EmptyState({ icon, title, message, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-carbon-700 bg-carbon-900/50 px-6 py-20 text-center">
      <div className="mb-5 flex size-16 items-center justify-center rounded-full border border-carbon-700 bg-carbon-800/70 text-carbon-400">
        {icon}
      </div>
      <h3 className="font-display text-2xl font-semibold uppercase tracking-wide text-white">{title}</h3>
      <p className="mt-2 max-w-md text-sm text-carbon-400">{message}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  )
}