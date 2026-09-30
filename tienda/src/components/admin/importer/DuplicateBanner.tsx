import { AlertTriangle, RefreshCcw } from 'lucide-react'
import type { DuplicateResult } from '../../../types/import'
import { formatDate } from '../../../utils/format'
import Button from '../../ui/Button'

interface DuplicateBannerProps {
  duplicate: DuplicateResult
  onUpdateExisting: () => void
  onCreateNew: () => void
  updating?: boolean
}

export default function DuplicateBanner({
  duplicate,
  onUpdateExisting,
  onCreateNew,
  updating,
}: DuplicateBannerProps) {
  if (!duplicate.duplicated || !duplicate.product) return null

  return (
    <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex min-w-0 items-start gap-3">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-amber-500/15 text-amber-400">
            <AlertTriangle size={18} />
          </span>
          <div className="min-w-0">
            <p className="font-semibold text-amber-300">{duplicate.reasonLabel ?? 'Este producto ya ha sido importado'}</p>
            <p className="mt-1 text-sm text-carbon-200">
              {duplicate.product.name}
              {duplicate.importRecord?.importedAt && (
                <span className="text-carbon-500">
                  {' · importado el '}
                  {formatDate(duplicate.importRecord.importedAt)}
                </span>
              )}
            </p>
          </div>
        </div>
        <div className="flex flex-col items-stretch gap-2 sm:flex-row">
          <Button type="button" size="sm" onClick={onUpdateExisting} disabled={updating}>
            <RefreshCcw size={14} />
            {updating ? 'Actualizando...' : 'Actualizar producto existente'}
          </Button>
          <Button type="button" size="sm" variant="outline" onClick={onCreateNew} disabled={updating}>
            Crear un nuevo producto
          </Button>
        </div>
      </div>
    </div>
  )
}