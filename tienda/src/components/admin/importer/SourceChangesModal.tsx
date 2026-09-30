import { useEffect, useState } from 'react'
import { ArrowRight, RefreshCcw, X } from 'lucide-react'
import type { SourceChanges, SourceDiff } from '../../../types/import'
import { useToast } from '../../../context/ToastContext'
import { applySourceChanges, updateFromSource } from '../../../services/importService'
import { cx } from '../../../utils/format'
import Button from '../../ui/Button'
import LoadingSkeleton from '../../common/LoadingSkeleton'

interface SourceChangesModalProps {
  open: boolean
  productId: number
  onClose: () => void
  onApplied?: () => void
}

const GROUP_LABELS: Record<SourceDiff['group'], string> = {
  price: 'Precio (datos del proveedor)',
  stock: 'Stock del proveedor',
  product: 'Información del producto',
  media: 'Medios (imágenes)',
}

export default function SourceChangesModal({
  open,
  productId,
  onClose,
  onApplied,
}: SourceChangesModalProps) {
  const { showToast } = useToast()
  const [changes, setChanges] = useState<SourceChanges | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selected, setSelected] = useState<Record<string, boolean>>({})
  const [applying, setApplying] = useState(false)

  useEffect(() => {
    if (!open) return
    setChanges(null)
    setError(null)
    setSelected({})
    setLoading(true)
    updateFromSource(productId)
      .then((result) => {
        setChanges(result)
        const initial: Record<string, boolean> = {}
        for (const diff of result.diffs) initial[diff.field] = true
        setSelected(initial)
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : 'No se pudo comprobar la fuente.')
      })
      .finally(() => setLoading(false))
  }, [open, productId])

  const toggle = (field: string) =>
    setSelected((prev) => ({ ...prev, [field]: !prev[field] }))

  const handleApply = async () => {
    if (!changes) return
    setApplying(true)
    try {
      const toApply = changes.diffs.filter((diff) => selected[diff.field])
      await applySourceChanges(productId, toApply)
      showToast('Cambios aplicados desde el proveedor')
      onApplied?.()
      onClose()
    } catch {
      showToast('No se pudieron aplicar los cambios', 'error')
    } finally {
      setApplying(false)
    }
  }

  if (!open) return null

  const grouped = (changes?.diffs ?? []).reduce<Record<string, SourceDiff[]>>((acc, diff) => {
    ;(acc[diff.group] ??= []).push(diff)
    return acc
  }, {})

  return (
    <div className="fixed inset-0 z-[115] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
      <div className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-carbon-700 bg-carbon-900 shadow-2xl">
        <div className="flex items-center justify-between border-b border-carbon-800 px-6 py-4">
          <div>
            <h3 className="font-display text-lg font-bold uppercase tracking-wide text-white">
              Comprobar cambios
            </h3>
            <p className="text-xs text-carbon-400">
              Compara los datos actuales con los del proveedor.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex size-8 items-center justify-center rounded-lg border border-carbon-700 text-carbon-400 transition-colors hover:text-white"
            aria-label="Cerrar"
          >
            <X size={16} />
          </button>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto px-6 py-5">
          {loading ? (
            <LoadingSkeleton variant="lines" count={4} />
          ) : error ? (
            <div className="rounded-xl border border-f1-500/30 bg-f1-500/10 px-4 py-3 text-sm text-f1-400">
              {error}
            </div>
          ) : changes?.unchanged ? (
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-4 text-sm text-emerald-300">
              No hay cambios con respecto a la fuente. El producto está al día.
            </div>
          ) : changes ? (
            <>
              {Object.entries(grouped).map(([group, diffs]) => (
                <div key={group} className="space-y-2">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-carbon-400">
                    {GROUP_LABELS[group as SourceDiff['group']]}
                  </p>
                  {diffs.map((diff) => (
                    <label
                      key={diff.field}
                      className={cx(
                        'flex cursor-pointer items-start gap-3 rounded-xl border px-4 py-3 transition-colors',
                        selected[diff.field]
                          ? 'border-carbon-600 bg-carbon-800/50'
                          : 'border-carbon-800 bg-carbon-950/30',
                      )}
                    >
                      <input
                        type="checkbox"
                        checked={Boolean(selected[diff.field])}
                        onChange={() => toggle(diff.field)}
                        className="mt-0.5 size-4 accent-f1-500"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-sm font-medium text-carbon-100">{diff.label}</p>
                          <span
                            className={cx(
                              'rounded-md px-2 py-0.5 text-[10px] font-semibold',
                              diff.kind === 'added'
                                ? 'bg-emerald-500/10 text-emerald-400'
                                : diff.kind === 'removed'
                                  ? 'bg-carbon-800 text-carbon-400'
                                  : 'bg-amber-500/10 text-amber-400',
                            )}
                          >
                            {diff.kind === 'added'
                              ? 'NUEVO'
                              : diff.kind === 'removed'
                                ? 'ELIMINADO'
                                : 'CAMBIADO'}
                          </span>
                        </div>
                        {diff.before !== undefined && diff.after !== '-' && (
                          <div className="mt-1.5 flex flex-wrap items-center gap-2 text-xs text-carbon-400">
                            <span className="line-through">{diff.before}</span>
                            <ArrowRight size={12} className="text-carbon-600" />
                            <span className="text-carbon-200">{diff.after}</span>
                          </div>
                        )}
                      </div>
                    </label>
                  ))}
                </div>
              ))}
              <p className="rounded-lg border border-carbon-800 bg-carbon-950/40 px-3 py-2 text-xs text-carbon-500">
                El precio de venta de la tienda nunca se sobrescribe automáticamente:
                solo se actualiza la información de la fuente.
              </p>
            </>
          ) : null}
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-carbon-800 px-6 py-4">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cerrar
          </Button>
          <Button
            type="button"
            onClick={handleApply}
            disabled={!changes || changes.unchanged || applying}
          >
            <RefreshCcw size={15} />
            {applying ? 'Aplicando...' : 'Aplicar cambios seleccionados'}
          </Button>
        </div>
      </div>
    </div>
  )
}