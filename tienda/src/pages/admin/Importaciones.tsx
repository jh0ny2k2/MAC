import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ExternalLink, FolderOpen, Plus, RefreshCcw, Trash2 } from 'lucide-react'
import type { ImportRecord } from '../../types/import'
import {
  getImportHistory,
  removeImport,
} from '../../services/importService'
import { useToast } from '../../context/ToastContext'
import PageHeader from '../../components/common/PageHeader'
import DataTable from '../../components/common/DataTable'
import ConfirmModal from '../../components/common/ConfirmModal'
import StatusBadge from '../../components/common/StatusBadge'
import Button from '../../components/ui/Button'
import SourceChangesModal from '../../components/admin/importer/SourceChangesModal'
import { PROVIDER_LABELS } from '../../types/import'
import { formatDate } from '../../utils/format'

const STATUS_META: Record<
  ImportRecord['status'],
  { label: string; tone: 'success' | 'warning' | 'danger' | 'neutral' | 'info' }
> = {
  draft: { label: 'Borrador', tone: 'neutral' },
  published: { label: 'Publicado', tone: 'success' },
  partial: { label: 'Parcial', tone: 'warning' },
  error: { label: 'Error', tone: 'danger' },
}

export default function Importaciones() {
  const navigate = useNavigate()
  const { showToast } = useToast()
  const [records, setRecords] = useState<ImportRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [confirm, setConfirm] = useState<ImportRecord | null>(null)
  const [checkProduct, setCheckProduct] = useState<number | null>(null)

  const load = useCallback(() => {
    setRecords(getImportHistory())
    setLoading(false)
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const handleDelete = async () => {
    if (!confirm) return
    try {
      await removeImport(confirm.id)
      showToast('Importación eliminada del historial')
      setConfirm(null)
      load()
    } catch {
      showToast('No se pudo eliminar la importación', 'error')
    }
  }

  const resultCell = (row: ImportRecord) => {
    if (row.error) {
      return (
        <span className="block max-w-[260px] truncate text-xs text-f1-400" title={row.error}>
          ✕ {row.error}
        </span>
      )
    }
    const missing = row.missingFields ?? []
    if (missing.length > 0) {
      return (
        <span className="block max-w-[260px] truncate text-xs text-amber-400">
          ⚠ {missing.length} campo{missing.length === 1 ? '' : 's'} por revisar
        </span>
      )
    }
    return <span className="text-xs text-emerald-400">✓ Información correcta</span>
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="Importaciones"
        subtitle="Historial de productos importados desde proveedores"
        actions={
          <Button onClick={() => navigate('/admin/importar')}>
            <Plus size={16} />
            Importar producto
          </Button>
        }
      />

      <DataTable
        columns={[
          {
            key: 'date',
            header: 'Fecha',
            render: (row) => (
              <span className="whitespace-nowrap text-carbon-200">
                {formatDate(row.importedAt)}
              </span>
            ),
          },
          {
            key: 'url',
            header: 'URL',
            render: (row) => (
              <a
                href={row.sourceUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex max-w-[240px] items-center gap-1.5 truncate text-xs text-carbon-400 hover:text-f1-400"
                title={row.sourceUrl}
                onClick={(e) => e.stopPropagation()}
              >
                {row.sourceUrl}
                <ExternalLink size={11} className="shrink-0" />
              </a>
            ),
          },
          {
            key: 'provider',
            header: 'Proveedor',
            render: (row) => (
              <span className="text-carbon-200">
                {PROVIDER_LABELS[row.provider] ?? row.providerName ?? row.provider}
              </span>
            ),
          },
          {
            key: 'product',
            header: 'Producto',
            render: (row) => (
              <div className="min-w-0 max-w-[260px]">
                <p className="truncate font-medium text-carbon-100">
                  {row.productName ?? row.productId ? `Producto #${row.productId}` : '—'}
                </p>
                {row.productStatus && row.productStatus !== 'disponible' && (
                  <p className="text-xs text-carbon-500">{row.productStatus}</p>
                )}
              </div>
            ),
          },
          {
            key: 'status',
            header: 'Estado',
            render: (row) => {
              const meta = STATUS_META[row.status] ?? STATUS_META.draft
              return <StatusBadge status={meta.label} tone={meta.tone} />
            },
          },
          {
            key: 'result',
            header: 'Resultado',
            render: resultCell,
          },
          {
            key: 'user',
            header: 'Usuario',
            render: (row) => <span className="text-carbon-300">{row.user ?? '—'}</span>,
          },
          {
            key: 'actions',
            header: '',
            className: 'text-right',
            render: (row) => (
              <div
                className="flex items-center justify-end gap-1.5"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  type="button"
                  onClick={() => navigate(`/admin/importar?importId=${row.id}`)}
                  className="flex size-8 items-center justify-center rounded-lg border border-carbon-700 text-carbon-400 transition-colors hover:border-f1-500 hover:text-f1-400"
                  aria-label="Volver a abrir importación"
                  title="Volver a abrir"
                >
                  <FolderOpen size={14} />
                </button>
                <button
                  type="button"
                  disabled={!row.productId}
                  onClick={() => setCheckProduct(row.productId ?? 0)}
                  className="flex size-8 items-center justify-center rounded-lg border border-carbon-700 text-carbon-400 transition-colors hover:border-emerald-500 hover:text-emerald-400 disabled:cursor-not-allowed disabled:opacity-40"
                  aria-label="Comprobar cambios"
                  title="Comprobar cambios con la fuente"
                >
                  <RefreshCcw size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => setConfirm(row)}
                  className="flex size-8 items-center justify-center rounded-lg border border-carbon-700 text-carbon-400 transition-colors hover:border-f1-500 hover:text-f1-400"
                  aria-label="Eliminar importación"
                  title="Eliminar del historial"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ),
          },
        ]}
        rows={records}
        rowKey={(r) => r.id}
        loading={loading}
        empty={
          <div className="px-6 py-16 text-center">
            <p className="text-sm text-carbon-500">Todavía no hay importaciones registradas.</p>
            <Button
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={() => navigate('/admin/importar')}
            >
              <Plus size={14} />
              Importar tu primer producto
            </Button>
          </div>
        }
      />

      <ConfirmModal
        open={confirm !== null}
        title="Eliminar importación"
        message={`¿Seguro que quieres eliminar la importación de "${confirm?.productName ?? confirm?.sourceUrl}" del historial? El producto no se eliminará.`}
        confirmLabel="Eliminar"
        onConfirm={handleDelete}
        onCancel={() => setConfirm(null)}
      />

      {checkProduct !== null && (
        <SourceChangesModal
          open={checkProduct !== null}
          productId={checkProduct}
          onClose={() => setCheckProduct(null)}
          onApplied={load}
        />
      )}
    </div>
  )
}