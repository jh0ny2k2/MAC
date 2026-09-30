import { useCallback, useEffect, useState } from 'react'
import { Flag, Pencil, Plus, Trash2, X } from 'lucide-react'
import PageHeader from '../../components/common/PageHeader'
import DataTable, { type Column } from '../../components/common/DataTable'
import ConfirmModal from '../../components/common/ConfirmModal'
import LoadingSkeleton from '../../components/common/LoadingSkeleton'
import Button from '../../components/ui/Button'
import { buttonStyles } from '../../components/ui/Button'
import { FormInput } from '../../components/common/FormControls'
import { useToast } from '../../context/ToastContext'
import { teamService } from '../../services/teamService'
import type { Team } from '../../types'

const EMPTY_FORM: Omit<Team, 'id'> = {
  name: '',
  country: '',
  countryCode: '',
  code: '',
  color: '#e10600',
  color2: '#ffffff',
  founded: 1950,
  titles: 0,
  logo: '',
  description: '',
}

export default function Teams() {
  const { showToast } = useToast()
  const [teams, setTeams] = useState<Team[]>([])
  const [loading, setLoading] = useState(true)
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<Team | null>(null)
  const [form, setForm] = useState<Omit<Team, 'id'>>(EMPTY_FORM)
  const [toDelete, setToDelete] = useState<Team | null>(null)
  const [saving, setSaving] = useState(false)

  const load = useCallback(async () => {
    const list = await teamService.getAll()
    setTeams(list)
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

  const openEdit = (team: Team) => {
    setEditing(team)
    setForm({
      name: team.name,
      country: team.country,
      countryCode: team.countryCode,
      code: team.code,
      color: team.color,
      color2: team.color2,
      founded: team.founded,
      titles: team.titles,
      logo: team.logo,
      description: team.description,
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
        await teamService.update(editing.id, form)
        showToast('Escudería actualizada')
      } else {
        await teamService.create(form)
        showToast('Escudería creada')
      }
      setFormOpen(false)
      await load()
    } catch {
      showToast('No se pudo guardar la escudería', 'error')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!toDelete) return
    try {
      await teamService.remove(toDelete.id)
      showToast('Escudería eliminada')
      await load()
    } catch {
      showToast('No se pudo eliminar la escudería', 'error')
    } finally {
      setToDelete(null)
    }
  }

  const columns: Column<Team>[] = [
    {
      key: 'team',
      header: 'Escudería',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-carbon-800 bg-carbon-950">
            {row.logo ? (
              <img src={row.logo} alt="" className="size-full object-contain" />
            ) : (
              <Flag size={16} className="text-carbon-500" />
            )}
          </div>
          <div>
            <p className="font-medium text-carbon-100">{row.name}</p>
            <p className="text-xs text-carbon-500">
              {row.code} · {row.country}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: 'founded',
      header: 'Fundación',
      render: (row) => <span className="text-carbon-300">{row.founded}</span>,
    },
    {
      key: 'titles',
      header: 'Títulos',
      render: (row) => <span className="text-carbon-300">{row.titles}</span>,
    },
    {
      key: 'color',
      header: 'Color',
      render: (row) => (
        <div className="flex items-center gap-1.5">
          <span
            className="size-4 rounded-full border border-white/20"
            style={{ backgroundColor: row.color }}
          />
          <span className="text-xs text-carbon-400">{row.color}</span>
        </div>
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
        title="Escuderías"
        subtitle={`${teams.length} escuderías en el catálogo`}
        actions={
          <Button onClick={openCreate}>
            <Plus size={16} />
            Nueva escudería
          </Button>
        }
      />

      {loading ? (
        <LoadingSkeleton variant="table" count={8} />
      ) : (
        <DataTable
          columns={columns}
          rows={teams}
          rowKey={(t) => t.id}
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
                {editing ? 'Editar escudería' : 'Nueva escudería'}
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
              <FormInput
                label="Nombre"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Ej. Ferrari"
              />
              <div className="grid grid-cols-2 gap-4">
                <FormInput
                  label="País"
                  value={form.country}
                  onChange={(e) => setForm({ ...form, country: e.target.value })}
                />
                <FormInput
                  label="Código país"
                  value={form.countryCode}
                  onChange={(e) => setForm({ ...form, countryCode: e.target.value })}
                  placeholder="IT"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FormInput
                  label="Código (abrev.)"
                  value={form.code}
                  onChange={(e) => setForm({ ...form, code: e.target.value })}
                  placeholder="FER"
                />
                <FormInput
                  label="Año de fundación"
                  type="number"
                  value={String(form.founded)}
                  onChange={(e) => setForm({ ...form, founded: Number(e.target.value) })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FormInput
                  label="Títulos mundiales"
                  type="number"
                  value={String(form.titles)}
                  onChange={(e) => setForm({ ...form, titles: Number(e.target.value) })}
                />
                <div>
                  <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-carbon-400">
                    Logo (ruta)
                  </label>
                  <input
                    value={form.logo}
                    onChange={(e) => setForm({ ...form, logo: e.target.value })}
                    placeholder="/images/teams/..."
                    className="w-full rounded-lg border border-carbon-700 bg-carbon-900/60 px-3 py-2.5 text-sm text-carbon-100 placeholder:text-carbon-500 focus:border-f1-500 focus:outline-none"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-carbon-400">
                    Color principal
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={form.color}
                      onChange={(e) => setForm({ ...form, color: e.target.value })}
                      className="size-10 cursor-pointer rounded-lg border border-carbon-700 bg-carbon-900"
                    />
                    <input
                      value={form.color}
                      onChange={(e) => setForm({ ...form, color: e.target.value })}
                      className="w-full rounded-lg border border-carbon-700 bg-carbon-900/60 px-3 py-2 text-sm text-carbon-100 focus:border-f1-500 focus:outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-carbon-400">
                    Color secundario
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={form.color2}
                      onChange={(e) => setForm({ ...form, color2: e.target.value })}
                      className="size-10 cursor-pointer rounded-lg border border-carbon-700 bg-carbon-900"
                    />
                    <input
                      value={form.color2}
                      onChange={(e) => setForm({ ...form, color2: e.target.value })}
                      className="w-full rounded-lg border border-carbon-700 bg-carbon-900/60 px-3 py-2 text-sm text-carbon-100 focus:border-f1-500 focus:outline-none"
                    />
                  </div>
                </div>
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
                  {saving ? 'Guardando...' : editing ? 'Guardar cambios' : 'Crear escudería'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <ConfirmModal
        open={toDelete !== null}
        title="Eliminar escudería"
        message={
          toDelete
            ? `¿Eliminar "${toDelete.name}"? Los productos asociados mantienen su escudería.`
            : ''
        }
        confirmLabel="Eliminar"
        onConfirm={handleDelete}
        onCancel={() => setToDelete(null)}
      />
    </div>
  )
}