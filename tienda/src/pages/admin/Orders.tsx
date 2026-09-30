import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import PageHeader from '../../components/common/PageHeader'
import SearchInput from '../../components/common/SearchInput'
import FilterDropdown from '../../components/common/FilterDropdown'
import DataTable, { type Column } from '../../components/common/DataTable'
import Pagination from '../../components/common/Pagination'
import StatusBadge from '../../components/common/StatusBadge'
import { orderService, ORDER_STATUSES, PAYMENT_STATUSES } from '../../services/orderService'
import type { Order } from '../../types/admin'
import { formatPrice } from '../../utils/format'

const PAGE_SIZE = 10

export default function Orders() {
  const navigate = useNavigate()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<string>('all')
  const [payment, setPayment] = useState<string>('all')
  const [page, setPage] = useState(1)

  const load = useCallback(async () => {
    const list = await orderService.getAll()
    setOrders(list)
    setLoading(false)
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase()
    return orders.filter((o) => {
      if (status !== 'all' && o.status !== status) return false
      if (payment !== 'all' && o.payment !== payment) return false
      if (term) {
        const haystack = `${o.id} ${o.customerName} ${o.email}`.toLowerCase()
        if (!haystack.includes(term)) return false
      }
      return true
    })
  }, [orders, search, status, payment])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const safePage = Math.min(page, totalPages)
  const pageRows = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)

  const columns: Column<Order>[] = [
    {
      key: 'id',
      header: 'Pedido',
      render: (row) => (
        <span className="font-semibold text-carbon-100">{row.id}</span>
      ),
    },
    {
      key: 'customer',
      header: 'Cliente',
      render: (row) => (
        <div>
          <p className="font-medium text-carbon-100">{row.customerName}</p>
          <p className="text-xs text-carbon-500">{row.email}</p>
        </div>
      ),
    },
    {
      key: 'date',
      header: 'Fecha',
      render: (row) => (
        <span className="text-carbon-300">
          {new Date(row.date).toLocaleDateString('es-ES', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
          })}
        </span>
      ),
    },
    {
      key: 'items',
      header: 'Artículos',
      render: (row) => (
        <span className="text-carbon-300">
          {row.items.reduce((sum, item) => sum + item.quantity, 0)}
        </span>
      ),
    },
    {
      key: 'total',
      header: 'Total',
      render: (row) => (
        <span className="font-medium text-carbon-100">{formatPrice(row.total)}</span>
      ),
    },
    {
      key: 'status',
      header: 'Estado',
      render: (row) => <StatusBadge status={row.status} />,
    },
    {
      key: 'payment',
      header: 'Pago',
      render: (row) => <StatusBadge status={row.payment} />,
    },
    {
      key: 'actions',
      header: '',
      className: 'text-right',
      render: () => (
        <span
          className="inline-flex size-8 items-center justify-center rounded-lg border border-carbon-700 text-carbon-400 transition-colors hover:border-f1-500 hover:text-f1-400"
          onClick={(e) => e.stopPropagation()}
        >
          <ArrowRight size={14} />
        </span>
      ),
    },
  ]

  return (
    <div className="space-y-5">
      <PageHeader
        title="Pedidos"
        subtitle={`${orders.length} pedidos registrados`}
      />

      <div className="flex flex-wrap items-center gap-3">
        <div className="min-w-[220px] flex-1">
          <SearchInput
            value={search}
            onChange={(v) => {
              setSearch(v)
              setPage(1)
            }}
            placeholder="Buscar por nº de pedido, cliente o email..."
          />
        </div>
        <FilterDropdown
          label="Estado"
          value={status}
          onChange={(v) => {
            setStatus(v)
            setPage(1)
          }}
          options={ORDER_STATUSES.map((o) => ({ value: o.value, label: o.label }))}
          allLabel="Todos los estados"
        />
        <FilterDropdown
          label="Pago"
          value={payment}
          onChange={(v) => {
            setPayment(v)
            setPage(1)
          }}
          options={PAYMENT_STATUSES.map((o) => ({ value: o.value, label: o.label }))}
          allLabel="Todos"
        />
      </div>

      <DataTable
        columns={columns}
        rows={pageRows}
        rowKey={(o) => o.id}
        loading={loading}
        onRowClick={(order) => navigate(`/admin/pedidos/${order.id}`)}
      />

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