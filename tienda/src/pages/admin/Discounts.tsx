import { useCallback, useEffect, useState } from 'react'
import { Copy, Pencil, Percent, Plus, Tags, Trash2, X } from 'lucide-react'
import PageHeader from '../../components/common/PageHeader'
import DataTable, { type Column } from '../../components/common/DataTable'
import ConfirmModal from '../../components/common/ConfirmModal'
import LoadingSkeleton from '../../components/common/LoadingSkeleton'
import StatusBadge from '../../components/common/StatusBadge'
import Button from '../../components/ui/Button'
import { buttonStyles } from '../../components/ui/Button'
import { FormInput, FormSelect } from '../../components/common/FormControls'
import { useToast } from '../../context/ToastContext'
import { discountService } from '../../services/discountService'
import type { DiscountCode } from '../../types/admin'

interface DiscountForm {
  code: string
  type: 'percent' | 'fixed'
  value: string
  startDate: string
  endDate: string
  maxUses: string
  status: DiscountCode['status']
}

const EMPTY_FORM: DiscountForm = {
  code: '',
  type: 'percent',
  value: '10',
  startDate: new Date().toISOString().slice(0, 10),
  endDate: new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10),
  maxUses: '100',
  status: 'activo',
}

export default function Discounts() {
  const { showToast } = useToast()
  const [discounts, setDiscounts] = useState<DiscountCode[]>([])
  const [loading, setLoading] = useState(true)
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<DiscountCode | null>(null)
  const [form, setForm] = useState<DiscountForm>(EMPTY_FORM)
  const [toDelete, setToDelete] = useState<DiscountCode | null>(null)
  const [saving, setSaving] = useState(false)

  const load = useCallback(async () => {
    const list = await discountService.getAll()
    setDiscounts(list)
    setLoading(false)
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const openCreate = () => {
    setEditing(null)
    setForm(EMPTY_FORM)
    setFormOpen(true)
  }

  const openEdit = (discount: DiscountCode) => {
    setEditing(discount)
    setForm({
      code: discount.code,
      type: discount.type,
      value: String(discount.value),
      startDate: discount.startDate,
      endDate: discount.endDate,
      maxUses: String(discount.maxUses),
      status: discount.status,
    })
    setFormOpen(true)
  }

  const handleSave = async () => {
    if (!form.code.trim()) {
      showToast('El código es obligatorio', 'error')
      return
    }
    setSaving(true)
    const payload = {
      code: form.code.trim().toUpperCase(),
      type: form.type,
      value: Number.parseFloat(form.value) || 0,
      startDate: form.startDate,
      endDate: form.endDate,
      maxUses: Math.max(Number.parseInt(form.maxUses, 10) || 0, 1),
      status: form.status,
    }
    try {
      if (editing) {
        await discountService.update(editing.id, payload)
        showToast('Descuento actualizado')
      } else {
        await discountService.create(payload)
        showToast('Descuento creado')
      }
      setFormOpen(false)
      await load()
    } catch {
      showToast('No se pudo guardar el descuento', 'error')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!toDelete) return
    try {
      await discountService.remove(toDelete.id)
      showToast('Descuento eliminado')
      await load()
    } catch {
      showToast('No se pudo eliminar el descuento', 'error')
    } finally {
      setToDelete(null)
    }
  }

  const toggleStatus = async (discount: DiscountCode) => {
    const next: DiscountCode['status'] =
      discount.status === 'activo' ? 'desactivado' : 'activo'
    try {
      await discountService.setStatus(discount.id, next)
      showToast(
        next === 'activo' ? 'Descuento activado' : 'Descuento desactivado',
      )
      await load()
    } catch {
      showToast('No se pudo cambiar el estado', 'error')
    }
  }

  const copyCode = async (discount: DiscountCode) => {
    try {
      await navigator.clipboard.writeText(discount.code)
      showToast(`Código ${discount.code} copiado`)
    } catch {
      showToast('No se pudo copiar el código', 'error')
    }
  }

  const columns: Column<DiscountCode>[] = [
    {
      key: 'code',
      header: 'Código',
      render: (row) => (
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-lg border border-f1-500/30 bg-f1-500/10 px-2.5 py-1 font-mono text-sm font-semibold text-f1-400">
            <Tags size={12} />
            {row.code}
          </span>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              copyCode(row)
            }}
            className="text-carbon-500 transition-colors hover:text-white"
            aria-label="Copiar código"
          >
            <Copy size={13} />
          </button>
        </div>
      ),
    },
    {
      key: 'value',
      header: 'Descuento',
      render: (row) => (
        <span className="font-medium text-carbon-100">
          {row.type === 'percent' ? `${row.value}%` : `${row.value} €`}
        </span>
      ),
    },
    {
      key: 'dates',
      header: 'Vigencia',
      render: (row) => (
        <span className="text-xs text-carbon-300">
          {new Date(row.startDate).toLocaleDateString('es-ES')}
          {' → '}
          {new Date(row.endDate).toLocaleDateString('es-ES')}
        </span>
      ),
    },
    {
      key: 'uses',
      header: 'Usos',
      render: (row) => (
        <span className="text-carbon-300">
          <span className="font-medium text-carbon-100">{row.uses}</span> / {row.maxUses}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Estado',
      render: (row) => <StatusBadge status={row.status} />,
    },
    {
      key: 'actions',
      header: '',
      className: 'text-right',
      render: (row) => (
        <div className="flex justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            onClick={() => openEdit(row)}
            className="flex size-8 items-center justify-center rounded-lg border border-carbon-700 text-carbon-400 transition-colors hover:border-f1-500 hover:text-f1-400"
            aria-label="Editar"
          >
            <Pencil size={14} />
          </button>
          <button
            type="button"
            onClick={() => toggleStatus(row)}
            title={row.status === 'activo' ? 'Desactivar' : 'Activar'}
            className="flex size-8 items-center justify-center rounded-lg border border-carbon-700 text-carbon-400 transition-colors hover:border-racing-400 hover:text-racing-400"
          >
            {row.status === 'activo' ? <Percent size={14} /> : <Tags size={14} />}
          </button>
          <button
            type="button"
            onClick={() => setToDelete(row)}
            className="flex size-8 items-center justify-center rounded-lg border border-carbon-700 text-carbon-400 transition-colors hover:border-f1-500 hover:text-f1-400"
            aria-label="Eliminar"
          >
            <Trash2 size={14} />
          </button>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-5">
      <PageHeader
        title="Descuentos"
        subtitle={`${discounts.length} códigos de descuento`}
        actions={
          <Button onClick={openCreate}>
            <Plus size={16} />
            Nuevo descuento
          </Button>
        }
      />

      {loading ? (
        <LoadingSkeleton variant="table" count={5} />
      ) : (
        <DataTable
          columns={columns}
          rows={discounts}
          rowKey={(d) => d.id}
          onRowClick={openEdit}
        />
      )}

      {formOpen && (
        <div
          className="fixed inset-0 z-[70] flex items-start justify-end bg-black/60 backdrop-blur-sm sm:items-center sm:justify-center sm:p-4"
          onClick={() => !saving && setFormOpen(false)}
        >
          <div
            className="flex h-full w-full max-w-lg flex-col overflow-hidden rounded-none border-carbon-800 bg-carbon-950 sm:h-auto sm:max-h-[90vh] sm:rounded-2xl sm:border"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-carbon-800 px-5 py-4">
              <h3 className="font-display text-lg font-bold text-white">
                {editing ? 'Editar descuento' : 'Nuevo descuento'}
              </h3>
              <button
                type="button"
                onClick={() => !saving && setFormOpen(false)}
                className="text-carbon-500 transition-colors hover:text-white"
                aria-label="Cerrar"
              >
                <X size={18} />
              </button>
            </div>
            <div className="flex-1 space-y-4 overflow-y-auto px-5 py-5">
              <div className="grid grid-cols-2 gap-4">
                <FormInput
                  label="Código"
                  value={form.code}
                  onChange={(e) =>
                    setForm({ ...form, code: e.target.value.toUpperCase() })
                  }
                  placeholder="F1GRAND10"
                  hint="Se guarda en mayúsculas"
                />
                <FormSelect
                  label="Tipo"
                  value={form.type}
                  onChange={(e) =>
                    setForm({ ...form, type: e.target.value as DiscountForm['type'] })
                  }
                  options={[
                    { value: 'percent', label: 'Porcentaje (%)' },
                    { value: 'fixed', label: 'Importe fijo (€)' },
                  ]}
                />
              </div>
              <FormInput
                label={form.type === 'percent' ? 'Valor (%)' : 'Valor (EUR)'}
                type="number"
                step="0.01"
                min="0"
                value={form.value}
                onChange={(e) => setForm({ ...form, value: e.target.value })}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormInput
                  label="Inicio"
                  type="date"
                  value={form.startDate}
                  onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                />
                <FormInput
                  label="Fin"
                  type="date"
                  value={form.endDate}
                  onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FormInput
                  label="Usos máximos"
                  type="number"
                  min="1"
                  value={form.maxUses}
                  onChange={(e) => setForm({ ...form, maxUses: e.target.value })}
                />
                <FormSelect
                  label="Estado"
                  value={form.status}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      status: e.target.value as DiscountCode['status'],
                    })
                  }
                  options={[
                    { value: 'activo', label: 'Activo' },
                    { value: 'programado', label: 'Programado' },
                    { value: 'desactivado', label: 'Desactivado' },
                    { value: 'expirado', label: 'Expirado' },
                  ]}
                />
              </div>
              {editing && (
                <div className="rounded-xl border border-carbon-800 bg-carbon-950/50 p-4 text-sm text-carbon-400">
                  Usado <span className="font-semibold text-carbon-200">{editing.uses}</span> de{' '}
                  {editing.maxUses} veces.
                </div>
              )}
            </div>
            <div className="border-t border-carbon-800 px-5 py-4">
              <div className="flex justify-end gap-2.5">
                <button
                  type="button"
                  className={buttonStyles({ variant: 'ghost' })}
                  onClick={() => setFormOpen(false)}
                >
                  Cancelar
                </button>
                <Button onClick={handleSave} disabled={saving}>
                  {saving ? 'Guardando...' : editing ? 'Guardar cambios' : 'Crear descuento'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <ConfirmModal
        open={toDelete !== null}
        title="Eliminar descuento"
        message={toDelete ? `¿Eliminar el código "${toDelete.code}"?` : ''}
        confirmLabel="Eliminar"
        onConfirm={handleDelete}
        onCancel={() => setToDelete(null)}
      />
    </div>
  )
}