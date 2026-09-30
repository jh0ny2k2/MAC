import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import {
  ArrowRight,
  CircleDollarSign,
  Clock,
  Package,
  ShoppingBag,
  TrendingUp,
  Users,
  Wallet,
} from 'lucide-react'
import PageHeader from '../../components/common/PageHeader'
import StatCard from '../../components/common/StatCard'
import LoadingSkeleton from '../../components/common/LoadingSkeleton'
import { InventoryAlertsBanner } from '../../components/admin/InventoryAlert'
import { analyticsService } from '../../services/analyticsService'
import { orderService } from '../../services/orderService'
import { activityService } from '../../services/notificationService'
import type { Order } from '../../types/admin'
import { formatPrice } from '../../utils/format'
import StatusBadge from '../../components/common/StatusBadge'

const activityIcons: Record<string, React.ReactNode> = {
  order: '🛒',
  customer: '👤',
  product: '📦',
  inventory: '⚠️',
}

export default function Dashboard() {
  const [kpis, setKpis] = useState<ReturnType<typeof Object> | null>(null)
  const [series, setSeries] = useState<any[]>([])
  const [recentOrders, setRecentOrders] = useState<Order[]>([])
  const [activity, setActivity] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    setLoading(true)
    Promise.all([
      analyticsService.getKpis('30d'),
      analyticsService.getSeries('30d'),
      orderService.recent(6),
      activityService.getRecent(8),
    ]).then(([kpiData, seriesData, orders, activityData]) => {
      if (!mounted) return
      setKpis(kpiData)
      setSeries(seriesData)
      setRecentOrders(orders)
      setActivity(activityData)
      setLoading(false)
    })
    return () => {
      mounted = false
    }
  }, [])

  const weekTrend = useMemo(() => {
    if (series.length < 2) return '0%'
    const prev = series[series.length - 2]?.revenue ?? 0
    const last = series[series.length - 1]?.revenue ?? 0
    if (prev === 0) return '0%'
    const delta = ((last - prev) / prev) * 100
    return `${delta >= 0 ? '+' : ''}${delta.toFixed(1)}%`
  }, [series])

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        subtitle="Resumen general de la tienda"
      />

      {loading || !kpis ? (
        <LoadingSkeleton variant="cards" count={4} />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Ingresos (30d)"
            value={formatPrice(kpis.revenue)}
            icon={<CircleDollarSign size={20} />}
            delta={weekTrend}
            trend="up"
            sub="vs. periodo anterior"
            accent="emerald"
          />
          <StatCard
            title="Pedidos"
            value={String(kpis.orders)}
            icon={<ShoppingBag size={20} />}
            delta={`${kpis.pendingOrders} pendientes`}
            trend="neutral"
            sub="últimos 30 días"
            accent="f1"
          />
          <StatCard
            title="Ticket medio"
            value={formatPrice(kpis.averageTicket)}
            icon={<Wallet size={20} />}
            delta={`${kpis.customers} clientes`}
            trend="neutral"
            accent="racing"
          />
          <StatCard
            title="Beneficio"
            value={formatPrice(kpis.profit)}
            icon={<TrendingUp size={20} />}
            delta={`${kpis.lowStock} alertas stock`}
            trend={kpis.lowStock > 0 ? 'neutral' : 'up'}
            accent="amber"
          />
        </div>
      )}

      <InventoryAlertsBanner />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="space-y-6 xl:col-span-2">
          <div className="rounded-2xl border border-carbon-800 bg-carbon-900/40 p-5">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <h3 className="font-display text-base font-semibold text-white">
                  Ingresos · últimos 30 días
                </h3>
                <p className="text-xs text-carbon-500">
                  Ventas diarias simuladas en EUR
                </p>
              </div>
              <Link
                to="/admin/analiticas"
                className="inline-flex items-center gap-1.5 text-sm text-f1-400 transition-colors hover:text-f1-300"
              >
                Analíticas
                <ArrowRight size={14} />
              </Link>
            </div>
            {loading ? (
              <div className="h-64">
                <LoadingSkeleton variant="lines" count={6} />
              </div>
            ) : (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={series} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#e10600" stopOpacity={0.35} />
                        <stop offset="100%" stopColor="#e10600" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#26262e" vertical={false} />
                    <XAxis
                      dataKey="period"
                      tick={{ fill: '#8a8a94', fontSize: 11 }}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(value: string) =>
                        new Date(value).toLocaleDateString('es-ES', {
                          day: '2-digit',
                          month: 'short',
                        })
                      }
                    />
                    <YAxis
                      tick={{ fill: '#8a8a94', fontSize: 11 }}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(value: number) => `€${value}`}
                      width={54}
                    />
                    <Tooltip
                      contentStyle={{
                        background: '#0d0d12',
                        border: '1px solid #2a2a33',
                        borderRadius: 12,
                        color: '#fff',
                      }}
                      formatter={(value) => [formatPrice(Number(value)), 'Ingresos']}
                      labelFormatter={(label) =>
                        new Date(String(label)).toLocaleDateString('es-ES', {
                          day: 'numeric',
                          month: 'long',
                        })
                      }
                    />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke="#e10600"
                      strokeWidth={2}
                      fill="url(#revGrad)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-carbon-800 bg-carbon-900/40 p-5">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="font-display text-base font-semibold text-white">
                  Pedidos recientes
                </h3>
                <p className="text-xs text-carbon-500">Últimas operaciones</p>
              </div>
              <Link
                to="/admin/pedidos"
                className="inline-flex items-center gap-1.5 text-sm text-f1-400 transition-colors hover:text-f1-300"
              >
                Ver todos
                <ArrowRight size={14} />
              </Link>
            </div>
            {loading ? (
              <LoadingSkeleton variant="table" count={5} />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[480px] text-left text-sm">
                  <thead>
                    <tr className="border-b border-carbon-800 text-[11px] uppercase tracking-wider text-carbon-500">
                      <th className="pb-2.5 pr-4 font-semibold">Pedido</th>
                      <th className="pb-2.5 pr-4 font-semibold">Cliente</th>
                      <th className="pb-2.5 pr-4 font-semibold">Total</th>
                      <th className="pb-2.5 pr-4 font-semibold">Estado</th>
                      <th className="pb-2.5 font-semibold text-right">Ver</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map((order) => (
                      <tr key={order.id} className="border-b border-carbon-800/60 last:border-0">
                        <td className="py-3 pr-4 font-semibold text-carbon-100">{order.id}</td>
                        <td className="py-3 pr-4 text-carbon-300">{order.customerName}</td>
                        <td className="py-3 pr-4 font-medium text-carbon-100">
                          {formatPrice(order.total)}
                        </td>
                        <td className="py-3 pr-4">
                          <StatusBadge status={order.status} />
                        </td>
                        <td className="py-3 text-right">
                          <Link
                            to={`/admin/pedidos/${order.id}`}
                            className="inline-flex size-8 items-center justify-center rounded-lg border border-carbon-700 text-carbon-400 transition-colors hover:border-f1-500 hover:text-f1-400"
                            aria-label={`Ver pedido ${order.id}`}
                          >
                            <ArrowRight size={14} />
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-carbon-800 bg-carbon-900/40 p-5">
            <div className="mb-4 flex items-center gap-2">
              <Clock size={16} className="text-f1-400" />
              <h3 className="font-display text-base font-semibold text-white">
                Actividad reciente
              </h3>
            </div>
            {loading ? (
              <LoadingSkeleton variant="lines" count={6} />
            ) : (
              <ul className="space-y-4">
                {activity.map((entry) => (
                  <li key={entry.id} className="flex items-start gap-3">
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-carbon-800 bg-carbon-950 text-base">
                      {activityIcons[entry.type] ?? '•'}
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm leading-snug text-carbon-200">
                        {entry.message}
                      </p>
                      <p className="text-[11px] text-carbon-500">
                        {new Date(entry.date).toLocaleString('es-ES', {
                          day: '2-digit',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="rounded-2xl border border-carbon-800 bg-carbon-900/40 p-5">
            <div className="mb-4 flex items-center gap-2">
              <Users size={16} className="text-racing-400" />
              <h3 className="font-display text-base font-semibold text-white">
                Accesos rápidos
              </h3>
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              {[
                { to: '/admin/productos/nuevo', label: 'Nuevo producto', icon: <Package size={15} /> },
                { to: '/admin/inventario', label: 'Inventario', icon: <ShoppingBag size={15} /> },
                { to: '/admin/descuentos', label: 'Descuentos', icon: <TrendingUp size={15} /> },
                { to: '/admin/ajustes', label: 'Ajustes', icon: <Wallet size={15} /> },
              ].map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className="flex items-center gap-2.5 rounded-xl border border-carbon-800 bg-carbon-950/50 px-3.5 py-3 text-sm font-medium text-carbon-200 transition-colors hover:border-f1-500/50 hover:text-white"
                >
                  <span className="text-f1-400">{item.icon}</span>
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}