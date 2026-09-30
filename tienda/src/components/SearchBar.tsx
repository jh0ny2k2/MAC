import { type FormEvent } from 'react'
import { Search } from 'lucide-react'
import { cx } from '../utils/format'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  onSubmit?: () => void
  placeholder?: string
  autoFocus?: boolean
  className?: string
}

export default function SearchBar({
  value,
  onChange,
  onSubmit,
  placeholder = 'Buscar coches, escuderías, pilotos…',
  autoFocus,
  className,
}: SearchBarProps) {
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    onSubmit?.()
  }

  return (
    <form onSubmit={handleSubmit} className={cx('relative', className)}>
      <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-carbon-500" />
      <input
        type="search"
        value={value}
        autoFocus={autoFocus}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-carbon-700 bg-carbon-800 py-2.5 pl-10 pr-4 text-sm text-carbon-100 placeholder:text-carbon-500 transition-colors focus:border-f1-500/70 focus:outline-none focus:ring-1 focus:ring-f1-500/40"
      />
    </form>
  )
}