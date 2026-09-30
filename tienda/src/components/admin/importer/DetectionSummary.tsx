import { AlertTriangle, CheckCircle2 } from 'lucide-react'
import type { F1Detection } from '../../../types/import'
import {
  detectionStats,
  getDetectedKeys,
  getMissingKeys,
} from '../../../services/importer/ProductExtractor'
import ConfidenceBadge from './ConfidenceBadge'

export const FIELD_LABELS: Record<keyof F1Detection, string> = {
  team: 'Escudería',
  driver: 'Piloto',
  season: 'Temporada',
  scale: 'Escala',
  manufacturer: 'Fabricante',
  category: 'Categoría',
  material: 'Material',
  dimensions: 'Dimensiones',
  weight: 'Peso',
  specialEdition: 'Edición especial',
}

interface DetectionSummaryProps {
  detection: F1Detection
}

function DetectedRow({
  fieldKey,
  detected,
}: {
  fieldKey: keyof F1Detection
  detected: { valueText?: string }
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-carbon-800 bg-carbon-950/50 px-3 py-2.5">
      <div className="flex min-w-0 flex-col">
        <span className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-carbon-500">
          <CheckCircle2 size={12} className="shrink-0 text-emerald-400" />
          {FIELD_LABELS[fieldKey]}
        </span>
        <span className="truncate text-sm font-medium text-carbon-100">
          {detected.valueText ?? ''}
        </span>
      </div>
      <ConfidenceBadge confidence={detected.valueText ? 'high' : 'low'} className="shrink-0" />
    </div>
  )
}

export default function DetectionSummary({ detection }: DetectionSummaryProps) {
  const stats = detectionStats(detection)
  const detectedKeys = getDetectedKeys(detection)
  const missing = getMissingKeys(detection)

  return (
    <div className="rounded-2xl border border-carbon-800 bg-carbon-900/40 p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h3 className="font-display text-sm font-semibold text-white">
          Detección automática
        </h3>
        <div className="flex flex-wrap gap-1.5">
          <span className="rounded-md border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-400">
            {stats.detected} detectados
          </span>
          <span className="rounded-md border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold text-amber-400">
            {stats.missing} pendientes
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-2.5 md:grid-cols-2">
        {detectedKeys.map((key) => (
          <DetectedRow key={key} fieldKey={key} detected={detection[key] as { valueText?: string }} />
        ))}
        {missing.map((key) => (
          <div
            key={key}
            className="flex items-center justify-between gap-3 rounded-xl border border-dashed border-carbon-800 bg-carbon-950/30 px-3 py-2.5"
          >
            <div className="flex min-w-0 flex-col">
              <span className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-carbon-500">
                <AlertTriangle size={12} className="shrink-0 text-amber-400" />
                {FIELD_LABELS[key]}
              </span>
              <span className="truncate text-sm text-carbon-500">Por revisar</span>
            </div>
          </div>
        ))}
      </div>

      {stats.detected > 0 && (
        <p className="mt-3 text-xs text-carbon-500">
          La detección es automática; puedes modificar cualquier valor en el editor.
        </p>
      )}
    </div>
  )
}