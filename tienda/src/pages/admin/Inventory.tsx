import { useCallback, useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Minus, Plus } from 'lucide-react'
import PageHeader from '../../components/common/PageHeader'
import SearchInput from '../../components/common/SearchInput'
import FilterDropdown from '../../components/common/FilterDropdown'
import DataTable, { type Column } from '../../components/common/DataTable'
import Pagination from '../../components/common/Pagination'
import StatusBadge from '../../components/common/StatusBadge'
import LoadingSkeleton from '../../components/common/LoadingSkeleton'
import { InventoryAlertsBanner } from '../../components/admin/InventoryAlert'
import { useToast } from '../../context/ToastContext'
import { inventoryService, getSoldUnits, productDerivedStatus } from '../../services/inventoryService'
import { productService } from '../../services/productService'
import type { Product } from '../../types'
import { cx } from '../../utils/format'

const PAGE_SIZE = 12

export default function Inventory() {
  const { showToast } = useToast()
  const [searchParams] = useSearchParams()
  const [products, setProducts] = useState<Product[]>([])
  const [sold, setSold] = useState<Map<number, number>>(new Map())
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<string>('all')
  const [page, setPage] = useState(1)
  const [saving, setSaving] = useState<number | null>(null)

  const highlightId = Number(searchParams.get('destacar')) || null

  const load = useCallback(async () => {
    const [list, soldMap] = await Promise.all([
      productService.getAll(),
      getSoldUnits(),
    ])
    setProducts(list)
    setSold(soldMap)
    setLoading(false)
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase()
    return products.filter((p) => {
      if (status !== 'all' && productDerivedStatus(p) !== status) return false
      if (term) {
        const haystack = `${p.name} ${p.team} ${p.sku ?? ''}`.toLowerCase()
        if (!haystack.includes(term)) return false
      }
      return true
    })
  }, [products, search, status])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const safePage = Math.min(page, totalPages)
  const pageRows = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)

  const adjustStock = async (product: Product, delta: number) => {
    setSaving(product.id)
    try {
      const updated = await inventoryService.adjustStock(product.id, delta)
      setProducts((prev) =>
        prev.map((p) => (p.id === product.id ? { ...p, stock: updated.stock } : p)),
      )
    } catch {
      showToast('No se pudo ajustar el stock', 'error')
    } finally {
      setSaving(null)
    }
  }

  const setStockInline = async (product: Product, stock: number) => {
    if (Number.isNaN(stock) || stock < 0) return
    setSaving(product.id)
    try {
      const updated = await inventoryService.setStock(product.id, stock)
      setProducts((prev) =>
        prev.map((p) => (p.id === product.id ? { ...p, stock: updated.stock } : p)),
      )
      showToast('Stock actualizado')
    } catch {
      showToast('No se pudo actualizar el stock', 'error')
    } finally {
      setSaving(null)
    }
  }

  const blurSetMin = async (product: Product, minStock: number) => {
    if (Number.isNaN(minStock) || minStock < 0) return
    const updated = await inventoryService.setMinStock(product.id, minStock)
    setProducts((prev) =>
      prev.map((p) => (p.id === product.id ? { ...p, minStock: updated.minStock } : p)),
    )
    showToast('Stock mínimo actualizado')
  }

  const columns: Column<Product>[] = [
    {
      key: 'highlight',
      header: '',
      className: 'w-6',
      render: (row) =>
        row.id === highlightId ? (
          <span className="inline-block size-2 rounded-full bg-f1-500" title="En alerta" />
        ) : null,
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
      key: 'sold',
      header: 'Vendidos (30d)',
      render: (row) => <span className="text-carbon-300">{sold.get(row.id) ?? 0}</span>,
    },
    {
      key: 'stock',
      header: 'Stock',
      render: (row) => (
        <div
          className="flex items-center gap-1.5"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            onClick={() => adjustStock(row, -1)}
            disabled={saving === row.id}
            className="flex size-7 items-center justify-center rounded-md border border-carbon-700 text-carbon-400 transition-colors hover:border-f1-500 hover:text-f1-400 disabled:opacity-40"
            aria-label="Restar unidad"
          >
            <Minus size={13} />
          </button>
          <input
            type="number"
            min={0}
            value={row.stock}
            onChange={(e) =>
              setProducts((prev) =>
                prev.map((p) =>
                  p.id === row.id ? { ...p, stock: Number(e.target.value) } : p,
                ),
              )
            }
            onBlur={(e) => setStockInline(row, Number(e.target.value))}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.currentTarget.blur()
              }
            }}
            className={cx(
              'w-16 rounded-md border border-carbon-700 bg-carbon-950/60 px-2 py-1.5 text-center text-sm font-medium text-carbon-100 focus:border-f1-500 focus:outline-none',
              row.stock <= (row.minStock ?? 5) && row.stock > 0 && 'border-amber-500/50',
              row.stock <= 0 && 'border-f1-500/50',
            )}
            aria-label={`Stock de ${row.name}`}
          />
          <button
            type="button"
            onClick={() => adjustStock(row, 1)}
            disabled={saving === row.id}
            className="flex size-7 items-center justify-center rounded-md border border-carbon-700 text-carbon-400 transition-colors hover:border-emerald-500 hover:text-emerald-400 disabled:opacity-40"
            aria-label="Sumar unidad"
          >
            <Plus size={13} />
          </button>
        </div>
      ),
    },
    {
      key: 'minStock',
      header: 'Mín.',
      render: (row) => (
        <input
          type="number"
          min={0}
          value={row.minStock ?? 5}
          onChange={(e) =>
            setProducts((prev) =>
              prev.map((p) =>
                p.id === row.id ? { ...p, minStock: Number(e.target.value) } : p,
              ),
            )
          }
          onBlur={(e) => blurSetMin(row, Number(e.target.value))}
          onKeyDown={(e) => {
            if (e.key === 'Enter') e.currentTarget.blur()
          }}
          className="w-16 rounded-md border border-carbon-700 bg-carbon-950/60 px-2 py-1.5 text-center text-sm font-medium text-carbon-100 focus:border-f1-500 focus:outline-none"
          onClick={(e) => e.stopPropagation()}
          aria-label={`Stock mínimo de ${row.name}`}
        />
      ),
    },
    {
      key: 'status',
      header: 'Estado',
      render: (row) => (
        <StatusBadge status={productDerivedStatus(row) ?? 'disponible'} />
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Inventario"
        subtitle="Controla las existencias de cada producto"
      />

      {highlightId && (
        <p className="text-sm text-f1-400">
          🔸 Producto en alerta destacado en la tabla de abajo.
        </p>
      )}

      <InventoryAlertsBanner />

      <div className="flex flex-wrap items-center gap-3">
        <div className="min-w-[220px] flex-1">
          <SearchInput
            value={search}
            onChange={(v) => {
              setSearch(v)
              setPage(1)
            }}
            placeholder="Buscar producto o SKU..."
          />
        </div>
        <FilterDropdown
          label="Estado"
          value={status}
          onChange={(v) => {
            setStatus(v)
            setPage(1)
          }}
          options={[
            { value: 'disponible', label: 'Disponible' },
            { value: 'poco-stock', label: 'Poco stock' },
            { value: 'agotado', label: 'Agotado' },
            { value: 'borrador', label: 'Borrador' },
          ]}
          allLabel="Todos los estados"
        />
      </div>

      {loading ? (
        <LoadingSkeleton variant="table" count={8} />
      ) : (
        <DataTable
          columns={columns}
          rows={pageRows}
          rowKey={(p) => p.id}
          loading={false}
        />
      )}

      <Pagination
        page={safePage}
        totalPages={totalPages}
        onPageChange={setPage}
        totalItems={filtered.length}
        pageSize={PAGE_SIZE}
      />
    </div>
  )
}