import { CalendarRange } from 'lucide-react'
import { cx } from '../../utils/format'

export interface DateRangeValue {
  from: string
  to: string
}

interface DateRangeFilterProps {
  value: DateRangeValue
  onChange: (value: DateRangeValue) => void
  presets?: boolean
}

function isoDaysAgo(days: number): string {
  const d = new Date()
  d.setDate(d.getDate() - days)
  return d.toISOString().slice(0, 10)
}

const today = () => new Date().toISOString().slice(0, 10)

const presets: { label: string; from: string; to: string }[] = [
  { label: 'Hoy', from: today(), to: today() },
  { label: '7 días', from: isoDaysAgo(7), to: today() },
  { label: '30 días', from: isoDaysAgo(30), to: today() },
  { label: '90 días', from: isoDaysAgo(90), to: today() },
]

function isPreset(value: DateRangeValue): boolean {
  return presets.some((p) => p.from === value.from && p.to === value.to)
}

export default function DateRangeFilter({
  value,
  onChange,
  presets: showPresets = true,
}: DateRangeFilterProps) {
  const activePreset = presets.find(
    (p) => p.from === value.from && p.to === value.to,
  )

  return (
    <div className="flex flex-wrap items-center gap-2">
      {showPresets && (
        <div className="flex items-center gap-1 rounded-lg border border-carbon-700 bg-carbon-900/60 p-1">
          <CalendarRange size={14} className="ml-2 text-carbon-500" />
          {presets.map((preset) => (
            <button
              key={preset.label}
              type="button"
              onClick={() => onChange({ from: preset.from, to: preset.to })}
              className={cx(
                'rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors',
                activePreset?.label === preset.label
                  ? 'bg-f1-500 text-white'
                  : 'text-carbon-400 hover:text-carbon-200',
              )}
            >
              {preset.label}
            </button>
          ))}
        </div>
      )}
      <div className="flex items-center gap-2 rounded-lg border border-carbon-700 bg-carbon-900/60 p-1">
        <input
          type="date"
          value={value.from}
          onChange={(e) => onChange({ ...value, from: e.target.value })}
          className={cx(
            'rounded-md bg-transparent px-2.5 py-1.5 text-xs text-carbon-200 focus:outline-none',
            isPreset(value) && 'text-carbon-500',
          )}
        />
        <span className="text-carbon-600">→</span>
        <input
          type="date"
          value={value.to}
          onChange={(e) => onChange({ ...value, to: e.target.value })}
          className="rounded-md bg-transparent px-2.5 py-1.5 text-xs text-carbon-200 focus:outline-none"
        />
      </div>
    </div>
  )
}