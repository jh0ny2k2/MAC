import { useCallback, useEffect, useState } from 'react'
import { Pencil, Plus, Trash2, User, X } from 'lucide-react'
import PageHeader from '../../components/common/PageHeader'
import DataTable, { type Column } from '../../components/common/DataTable'
import ConfirmModal from '../../components/common/ConfirmModal'
import LoadingSkeleton from '../../components/common/LoadingSkeleton'
import Button from '../../components/ui/Button'
import { buttonStyles } from '../../components/ui/Button'
import { FormInput, FormSelect } from '../../components/common/FormControls'
import { useToast } from '../../context/ToastContext'
import { driverService } from '../../services/driverService'
import { teamService } from '../../services/teamService'
import type { Driver } from '../../types'

interface DriverForm {
  name: string
  number: string
  nationality: string
  countryCode: string
  team: string
  image: string
  description: string
}

const EMPTY_FORM: DriverForm = {
  name: '',
  number: '1',
  nationality: '',
  countryCode: '',
  team: '',
  image: '',
  description: '',
}

export default function Drivers() {
  const { showToast } = useToast()
  const [drivers, setDrivers] = useState<Driver[]>([])
  const [teams, setTeams] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<Driver | null>(null)
  const [form, setForm] = useState<DriverForm>(EMPTY_FORM)
  const [toDelete, setToDelete] = useState<Driver | null>(null)
  const [saving, setSaving] = useState(false)

  const load = useCallback(async () => {
    const [list, teamList] = await Promise.all([
      driverService.getAll(),
      teamService.getAll(),
    ])
    setDrivers(list)
    setTeams(teamList.map((t) => t.name))
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

  const openEdit = (driver: Driver) => {
    setEditing(driver)
    setForm({
      name: driver.name,
      number: String(driver.number),
      nationality: driver.nationality,
      countryCode: driver.countryCode,
      team: driver.team,
      image: driver.image,
      description: driver.description,
    })
    setFormOpen(true)
  }

  const handleSave = async () => {
    if (!form.name.trim() || !form.team) {
      showToast('Nombre y escudería son obligatorios', 'error')
      return
    }
    setSaving(true)
    const payload = {
      ...form,
      number: Number.parseInt(form.number, 10) || 1,
    }
    try {
      if (editing) {
        await driverService.update(editing.id, payload)
        showToast('Piloto actualizado')
      } else {
        await driverService.create(payload)
        showToast('Piloto creado')
      }
      setFormOpen(false)
      await load()
    } catch {
      showToast('No se pudo guardar el piloto', 'error')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!toDelete) return
    try {
      await driverService.remove(toDelete.id)
      showToast('Piloto eliminado')
      await load()
    } catch {
      showToast('No se pudo eliminar el piloto', 'error')
    } finally {
      setToDelete(null)
    }
  }

  const columns: Column<Driver>[] = [
    {
      key: 'driver',
      header: 'Piloto',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-carbon-800 bg-carbon-950">
            {row.image ? (
              <img src={row.image} alt="" className="size-full object-cover" />
            ) : (
              <User size={16} className="text-carbon-500" />
            )}
          </div>
          <div>
            <p className="font-medium text-carbon-100">{row.name}</p>
            <p className="text-xs text-carbon-500">
              #{row.number} · {row.nationality}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: 'team',
      header: 'Escudería',
      render: (row) => <span className="text-carbon-300">{row.team}</span>,
    },
    {
      key: 'number',
      header: 'Número',
      render: (row) => <span className="font-semibold text-carbon-100">{row.number}</span>,
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
        title="Pilotos"
        subtitle={`${drivers.length} pilotos en el catálogo`}
        actions={
          <Button onClick={openCreate}>
            <Plus size={16} />
            Nuevo piloto
          </Button>
        }
      />

      {loading ? (
        <LoadingSkeleton variant="table" count={8} />
      ) : (
        <DataTable
          columns={columns}
          rows={drivers}
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
                {editing ? 'Editar piloto' : 'Nuevo piloto'}
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
                  placeholder="Ej. Fernando Alonso"
                />
                <FormInput
                  label="Número"
                  type="number"
                  min="1"
                  value={form.number}
                  onChange={(e) => setForm({ ...form, number: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FormInput
                  label="Nacionalidad"
                  value={form.nationality}
                  onChange={(e) => setForm({ ...form, nationality: e.target.value })}
                  placeholder="Española"
                />
                <FormInput
                  label="Código país"
                  value={form.countryCode}
                  onChange={(e) => setForm({ ...form, countryCode: e.target.value })}
                  placeholder="ES"
                />
              </div>
              <FormSelect
                label="Escudería"
                value={form.team}
                onChange={(e) => setForm({ ...form, team: e.target.value })}
                options={teams.map((t) => ({ value: t, label: t }))}
                placeholder="Selecciona escudería"
              />
              <FormInput
                label="Imagen (ruta)"
                value={form.image}
                onChange={(e) => setForm({ ...form, image: e.target.value })}
                placeholder="/images/drivers/..."
              />
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
                  {saving ? 'Guardando...' : editing ? 'Guardar cambios' : 'Crear piloto'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <ConfirmModal
        open={toDelete !== null}
        title="Eliminar piloto"
        message={
          toDelete ? `¿Eliminar a "${toDelete.name}"? Esta acción no se puede deshacer.` : ''
        }
        confirmLabel="Eliminar"
        onConfirm={handleDelete}
        onCancel={() => setToDelete(null)}
      />
    </div>
  )
}