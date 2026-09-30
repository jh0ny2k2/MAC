import { useEffect, useRef, useState } from 'react'
import { Check, ChevronDown } from 'lucide-react'
import { cx } from '../../utils/format'

export interface FilterOption<T extends string = string> {
  value: T
  label: string
}

interface FilterDropdownProps<T extends string = string> {
  value: T | 'all'
  onChange: (value: T) => void
  options: FilterOption<T>[]
  label?: string
  allLabel?: string
}

export default function FilterDropdown<T extends string>({
  value,
  onChange,
  options,
  label,
  allLabel = 'Todos',
}: FilterDropdownProps<T>) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const current = options.find((o) => o.value === value)

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="inline-flex items-center gap-2 rounded-lg border border-carbon-700 bg-carbon-900/60 px-3.5 py-2.5 text-sm font-medium text-carbon-200 transition-colors hover:border-carbon-500"
      >
        {label && <span className="text-carbon-500">{label}:</span>}
        <span>{current ? current.label : allLabel}</span>
        <ChevronDown size={14} className={cx('text-carbon-400 transition-transform', open && 'rotate-180')} />
      </button>
      {open && (
        <div className="absolute left-0 z-40 mt-2 max-h-72 w-56 overflow-auto rounded-xl border border-carbon-700 bg-carbon-950 p-1.5 shadow-2xl shadow-black/40">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onChange(option.value)
                setOpen(false)
              }}
              className={cx(
                'flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition-colors',
                option.value === value
                  ? 'bg-f1-500/10 text-f1-400'
                  : 'text-carbon-300 hover:bg-carbon-800',
              )}
            >
              {option.label}
              {option.value === value && <Check size={14} />}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}