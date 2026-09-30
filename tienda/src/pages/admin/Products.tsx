import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Copy, Pencil, Plus, Trash2, AlertTriangle } from 'lucide-react'
import PageHeader from '../../components/common/PageHeader'
import SearchInput from '../../components/common/SearchInput'
import FilterDropdown from '../../components/common/FilterDropdown'
import DataTable from '../../components/common/DataTable'
import Pagination from '../../components/common/Pagination'
import ConfirmModal from '../../components/common/ConfirmModal'
import StatusBadge from '../../components/common/StatusBadge'
import Button from '../../components/ui/Button'
import { useToast } from '../../context/ToastContext'
import { productService } from '../../services/productService'
import { teamService } from '../../services/teamService'
import type { Product } from '../../types'
import { formatPrice } from '../../utils/format'

const STATUS_OPTIONS = [
  { value: 'disponible', label: 'Disponible' },
  { value: 'poco-stock', label: 'Poco stock' },
  { value: 'agotado', label: 'Agotado' },
  { value: 'borrador', label: 'Borrador' },
] as const

const PAGE_SIZE = 10

export default function Products() {
  const navigate = useNavigate()
  const { showToast } = useToast()
  const [products, setProducts] = useState<Product[]>([])
  const [teams, setTeams] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<string>('all')
  const [team, setTeam] = useState<string>('all')
  const [page, setPage] = useState(1)
  const [selected, setSelected] = useState<Set<number>>(new Set())
  const [confirm, setConfirm] = useState<{
    type: 'delete' | 'bulk'
    product?: Product
  } | null>(null)

  const load = useCallback(async () => {
    const [list, teamList] = await Promise.all([
      productService.getAll(),
      teamService.getAll(),
    ])
    setProducts(list)
    setTeams(teamList.map((t) => t.name))
    setLoading(false)
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase()
    return products.filter((p) => {
      if (status !== 'all' && p.status !== status) return false
      if (team !== 'all' && p.team !== team) return false
      if (term) {
        const haystack =
          `${p.name} ${p.team} ${p.driver} ${p.sku ?? ''} ${p.category}`.toLowerCase()
        if (!haystack.includes(term)) return false
      }
      return true
    })
  }, [products, search, status, team])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const safePage = Math.min(page, totalPages)
  const pageRows = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)

  const toggleOne = (id: number) => {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const handleDelete = async () => {
    if (!confirm) return
    try {
      if (confirm.type === 'bulk') {
        await productService.bulkRemove([...selected])
        showToast(`${selected.size} producto(s) eliminados`)
        setSelected(new Set())
      } else if (confirm.product) {
        await productService.remove(confirm.product.id)
        showToast('Producto eliminado')
      }
      setConfirm(null)
      await load()
    } catch {
      showToast('No se pudo eliminar el producto', 'error')
    }
  }

  const handleDuplicate = async (product: Product) => {
    await productService.duplicate(product.id)
    showToast('Producto duplicado')
    await load()
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="Productos"
        subtitle={`${products.length} productos en el catálogo`}
        actions={
          <Button onClick={() => navigate('/admin/productos/nuevo')}>
            <Plus size={16} />
            Nuevo producto
          </Button>
        }
      />

      <div className="flex flex-wrap items-center gap-3">
        <div className="min-w-[220px] flex-1">
          <SearchInput
            value={search}
            onChange={(v) => {
              setSearch(v)
              setPage(1)
            }}
            placeholder="Buscar por nombre, escudería, piloto, SKU..."
          />
        </div>
        <FilterDropdown
          label="Estado"
          value={status}
          onChange={(v) => {
            setStatus(v)
            setPage(1)
          }}
          options={STATUS_OPTIONS.map((o) => ({ value: o.value, label: o.label }))}
          allLabel="Todos los estados"
        />
        <FilterDropdown
          label="Escudería"
          value={team}
          onChange={(v) => {
            setTeam(v)
            setPage(1)
          }}
          options={teams.map((t) => ({ value: t, label: t }))}
          allLabel="Todas las escuderías"
        />
      </div>

      {selected.size > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-f1-500/30 bg-f1-500/10 px-4 py-3">
          <p className="text-sm text-carbon-200">
            <span className="font-semibold text-white">{selected.size}</span>{' '}
            producto(s) seleccionados
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setConfirm({ type: 'bulk' })}
          >
            <Trash2 size={14} />
            Eliminar seleccionados
          </Button>
        </div>
      )}

      <DataTable
        columns={[
          {
            key: 'select',
            header: '',
            className: 'w-10',
            render: (row) => (
              <input
                type="checkbox"
                checked={selected.has(row.id)}
                onChange={(e) => {
                  e.stopPropagation()
                  toggleOne(row.id)
                }}
                className="size-4 accent-f1-500"
                aria-label={`Seleccionar ${row.name}`}
              />
            ),
          },
          {
            key: 'product',
            header: 'Producto',
            render: (row) => (
              <div className="flex items-center gap-3">
                <div className="size-11 shrink-0 overflow-hidden rounded-lg border border-carbon-800 bg-carbon-950">
                  <img src={row.images[0]} alt="" className="size-full object-cover" />
                </div>
                <div className="min-w-0">
                  <p className="truncate font-medium text-carbon-100">{row.name}</p>
                  <p className="text-xs text-carbon-500">
                    {row.sku ?? `ID ${row.id}`} · {row.team}
                  </p>
                </div>
              </div>
            ),
          },
          {
            key: 'price',
            header: 'Precio',
            render: (row) => (
              <span className="font-medium text-carbon-100">{formatPrice(row.price)}</span>
            ),
          },
          {
            key: 'stock',
            header: 'Stock',
            render: (row) =>
              row.stock <= (row.minStock ?? 5) ? (
                <span className="inline-flex items-center gap-1.5 text-amber-400">
                  <AlertTriangle size={13} />
                  {row.stock} uds.
                </span>
              ) : (
                <span className="text-carbon-300">{row.stock} uds.</span>
              ),
          },
          {
            key: 'status',
            header: 'Estado',
            render: (row) => <StatusBadge status={row.status ?? 'disponible'} />,
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
                <Link
                  to={`/admin/productos/${row.id}/editar`}
                  className="flex size-8 items-center justify-center rounded-lg border border-carbon-700 text-carbon-400 transition-colors hover:border-f1-500 hover:text-f1-400"
                  aria-label="Editar"
                >
                  <Pencil size={14} />
                </Link>
                <button
                  type="button"
                  onClick={() => handleDuplicate(row)}
                  className="flex size-8 items-center justify-center rounded-lg border border-carbon-700 text-carbon-400 transition-colors hover:border-racing-400 hover:text-racing-400"
                  aria-label="Duplicar"
                >
                  <Copy size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => setConfirm({ type: 'delete', product: row })}
                  className="flex size-8 items-center justify-center rounded-lg border border-carbon-700 text-carbon-400 transition-colors hover:border-f1-500 hover:text-f1-400"
                  aria-label="Eliminar"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ),
          },
        ]}
        rows={pageRows}
        rowKey={(p) => p.id}
        loading={loading}
        onRowClick={(row) => navigate(`/admin/productos/${row.id}/editar`)}
      />

      <Pagination
        page={safePage}
        totalPages={totalPages}
        onPageChange={setPage}
        totalItems={filtered.length}
        pageSize={PAGE_SIZE}
      />

      <ConfirmModal
        open={confirm !== null}
        title={
          confirm?.type === 'bulk'
            ? `Eliminar ${selected.size} producto(s)`
            : 'Eliminar producto'
        }
        message={
          confirm?.type === 'bulk'
            ? 'Esta acción no se puede deshacer. Se eliminarán los productos seleccionados.'
            : confirm?.product
              ? `¿Seguro que quieres eliminar "${confirm.product.name}"? Esta acción no se puede deshacer.`
              : ''
        }
        confirmLabel="Eliminar"
        onConfirm={handleDelete}
        onCancel={() => setConfirm(null)}
      />
    </div>
  )
}