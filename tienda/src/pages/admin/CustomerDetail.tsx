import { useCallback, useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Mail, Phone, ShoppingBag, User } from 'lucide-react'
import PageHeader from '../../components/common/PageHeader'
import LoadingSkeleton from '../../components/common/LoadingSkeleton'
import StatCard from '../../components/common/StatCard'
import StatusBadge from '../../components/common/StatusBadge'
import DataTable, { type Column } from '../../components/common/DataTable'
import { customerService } from '../../services/customerService'
import { orderService } from '../../services/orderService'
import type { Customer, CustomerStats, Order } from '../../types/admin'
import { formatPrice } from '../../utils/format'

export default function CustomerDetail() {
  const { id } = useParams<{ id: string }>()
  const customerId = Number(id)
  const navigate = useNavigate()
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [stats, setStats] = useState<CustomerStats | null>(null)
  const [orders, setOrders] = useState<Order[]>([])
  const [notFound, setNotFound] = useState(false)
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    const [found, statsData, allOrders] = await Promise.all([
      customerService.getById(customerId),
      customerService.getStats(customerId),
      orderService.getAll(),
    ])
    if (!found) {
      setNotFound(true)
      setLoading(false)
      return
    }
    setCustomer(found)
    setStats(statsData)
    setOrders(
      allOrders
        .filter((o) => o.customerId === customerId)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    )
    setLoading(false)
  }, [customerId])

  useEffect(() => {
    load()
  }, [load])

  if (notFound) {
    return (
      <div className="rounded-2xl border border-carbon-800 bg-carbon-900/40 px-6 py-16 text-center">
        <h2 className="font-display text-xl font-bold text-white">Cliente no encontrado</h2>
        <p className="mt-2 text-sm text-carbon-400">Este cliente no existe en el sistema.</p>
        <Link
          to="/admin/clientes"
          className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-f1-400 hover:text-f1-300"
        >
          <ArrowLeft size={15} />
          Volver a clientes
        </Link>
      </div>
    )
  }

  if (loading || !customer || !stats) {
    return <LoadingSkeleton variant="table" count={6} />
  }

  const columns: Column<Order>[] = [
    {
      key: 'id',
      header: 'Pedido',
      render: (row) => <span className="font-semibold text-carbon-100">{row.id}</span>,
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
    <div className="space-y-6">
      <button
        type="button"
        onClick={() => navigate('/admin/clientes')}
        className="inline-flex items-center gap-2 text-sm text-carbon-400 transition-colors hover:text-white"
      >
        <ArrowLeft size={15} />
        Volver a clientes
      </button>

      <PageHeader
        title={customer.name}
        subtitle={`Cliente #${customer.id} · Registrado el ${new Date(customer.registeredAt).toLocaleDateString('es-ES', {
          day: '2-digit',
          month: 'long',
          year: 'numeric',
        })}`}
        actions={<StatusBadge status={customer.status} />}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          title="Pedidos"
          value={String(stats.ordersCount)}
          icon={<ShoppingBag size={20} />}
          accent="f1"
        />
        <StatCard
          title="Gasto total"
          value={formatPrice(stats.totalSpent)}
          icon={<User size={20} />}
          accent="emerald"
        />
        <StatCard
          title="Ticket medio"
          value={formatPrice(stats.averageTicket)}
          icon={<ShoppingBag size={20} />}
          accent="racing"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-carbon-800 bg-carbon-900/40 p-5 lg:col-span-1">
          <h3 className="mb-4 font-display text-sm font-semibold text-white">
            Información de contacto
          </h3>
          <div className="space-y-3 text-sm text-carbon-300">
            <p className="flex items-center gap-2.5">
              <Mail size={15} className="shrink-0 text-carbon-500" />
              {customer.email}
            </p>
            {customer.phone && (
              <p className="flex items-center gap-2.5">
                <Phone size={15} className="shrink-0 text-carbon-500" />
                {customer.phone}
              </p>
            )}
          </div>
          {stats.lastOrderDate && (
            <div className="mt-5 rounded-xl border border-carbon-800 bg-carbon-950/50 p-4">
              <p className="text-[11px] uppercase tracking-wider text-carbon-500">
                Último pedido
              </p>
              <p className="mt-1 text-sm font-medium text-carbon-200">
                {new Date(stats.lastOrderDate).toLocaleDateString('es-ES', {
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric',
                })}
              </p>
            </div>
          )}
          {stats.favoriteProduct && (
            <div className="mt-3 rounded-xl border border-carbon-800 bg-carbon-950/50 p-4">
              <p className="text-[11px] uppercase tracking-wider text-carbon-500">
                Producto favorito
              </p>
              <p className="mt-1 text-sm font-medium text-carbon-200">
                {stats.favoriteProduct}
              </p>
            </div>
          )}
        </div>

        <div className="space-y-4 lg:col-span-2">
          <h3 className="font-display text-sm font-semibold text-white">
            Historial de pedidos
          </h3>
          <DataTable
            columns={columns}
            rows={orders}
            rowKey={(o) => o.id}
            empty={<p className="text-center text-sm text-carbon-500">Sin pedidos.</p>}
            onRowClick={(order) => navigate(`/admin/pedidos/${order.id}`)}
          />
        </div>
      </div>
    </div>
  )
}