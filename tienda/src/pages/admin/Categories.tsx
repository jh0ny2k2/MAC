import { useCallback, useEffect, useState } from 'react'
import { Pencil, Plus, Tags, Trash2, X } from 'lucide-react'
import PageHeader from '../../components/common/PageHeader'
import DataTable, { type Column } from '../../components/common/DataTable'
import ConfirmModal from '../../components/common/ConfirmModal'
import LoadingSkeleton from '../../components/common/LoadingSkeleton'
import Button from '../../components/ui/Button'
import { buttonStyles } from '../../components/ui/Button'
import { FormInput } from '../../components/common/FormControls'
import { useToast } from '../../context/ToastContext'
import { categoryService } from '../../services/categoryService'
import { productService } from '../../services/productService'
import type { Category } from '../../types'

const EMPTY_FORM: Omit<Category, 'id'> = {
  name: '',
  label: '',
  description: '',
}

export default function Categories() {
  const { showToast } = useToast()
  const [categories, setCategories] = useState<Category[]>([])
  const [productsByCategory, setProductsByCategory] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(true)
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<Category | null>(null)
  const [form, setForm] = useState<Omit<Category, 'id'>>(EMPTY_FORM)
  const [toDelete, setToDelete] = useState<Category | null>(null)
  const [saving, setSaving] = useState(false)

  const load = useCallback(async () => {
    const [list, products] = await Promise.all([
      categoryService.getAll(),
      productService.getAll(),
    ])
    setCategories(list)
    const counts: Record<string, number> = {}
    for (const product of products) {
      counts[product.category] = (counts[product.category] ?? 0) + 1
    }
    setProductsByCategory(counts)
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

  const openEdit = (category: Category) => {
    setEditing(category)
    setForm({
      name: category.name,
      label: category.label,
      description: category.description,
    })
    setFormOpen(true)
  }

  const handleSave = async () => {
    if (!form.name.trim()) {
      showToast('El nombre es obligatorio', 'error')
      return
    }
    setSaving(true)
    try {
      if (editing) {
        await categoryService.update(editing.id, form)
        showToast('Categoría actualizada')
      } else {
        await categoryService.create(form)
        showToast('Categoría creada')
      }
      setFormOpen(false)
      await load()
    } catch {
      showToast('No se pudo guardar la categoría', 'error')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!toDelete) return
    try {
      await categoryService.remove(toDelete.id)
      showToast('Categoría eliminada')
      await load()
    } catch {
      showToast('No se pudo eliminar la categoría', 'error')
    } finally {
      setToDelete(null)
    }
  }

  const columns: Column<Category>[] = [
    {
      key: 'category',
      header: 'Categoría',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-carbon-800 bg-carbon-950 text-carbon-400">
            <Tags size={15} />
          </div>
          <div>
            <p className="font-medium text-carbon-100">{row.name}</p>
            <p className="text-xs text-carbon-500">{row.label}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'products',
      header: 'Productos',
      render: (row) => (
        <span className="text-carbon-300">
          {productsByCategory[row.name] ?? 0} productos
        </span>
      ),
    },
    {
      key: 'description',
      header: 'Descripción',
      render: (row) => (
        <span className="line-clamp-1 max-w-xs text-carbon-400">{row.description}</span>
      ),
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
        title="Categorías"
        subtitle={`${categories.length} categorías configuradas`}
        actions={
          <Button onClick={openCreate}>
            <Plus size={16} />
            Nueva categoría
          </Button>
        }
      />

      {loading ? (
        <LoadingSkeleton variant="table" count={4} />
      ) : (
        <DataTable
          columns={columns}
          rows={categories}
          rowKey={(c) => c.id}
          onRowClick={openEdit}
        />
      )}

      {formOpen && (
        <div
          className="fixed inset-0 z-[70] flex items-start justify-end bg-black/60 backdrop-blur-sm sm:items-center sm:justify-center sm:p-4"
          onClick={() => !saving && setFormOpen(false)}
        >
          <div
            className="flex h-full w-full max-w-lg flex-col overflow-hidden rounded-none border-carbon-800 bg-carbon-950 sm:h-auto sm:rounded-2xl sm:border"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-carbon-800 px-5 py-4">
              <h3 className="font-display text-lg font-bold text-white">
                {editing ? 'Editar categoría' : 'Nueva categoría'}
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
                  label="Nombre"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Ej. Escala 1:43"
                />
                <FormInput
                  label="Etiqueta (label)"
                  value={form.label}
                  onChange={(e) => setForm({ ...form, label: e.target.value })}
                  placeholder="Ej. 1:43"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-carbon-400">
                  Descripción
                </label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full resize-y rounded-lg border border-carbon-700 bg-carbon-900/60 px-3.5 py-2.5 text-sm text-carbon-100 placeholder:text-carbon-500 focus:border-f1-500 focus:outline-none"
                />
              </div>
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
                  {saving ? 'Guardando...' : editing ? 'Guardar cambios' : 'Crear categoría'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <ConfirmModal
        open={toDelete !== null}
        title="Eliminar categoría"
        message={toDelete ? `¿Eliminar "${toDelete.name}"? Esta acción no se puede deshacer.` : ''}
        confirmLabel="Eliminar"
        onConfirm={handleDelete}
        onCancel={() => setToDelete(null)}
      />
    </div>
  )
}