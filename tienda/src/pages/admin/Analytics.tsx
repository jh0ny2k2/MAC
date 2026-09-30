import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
} from 'recharts'
import {
  CircleDollarSign,
  ShoppingBag,
  TrendingUp,
  Users,
  Wallet,
  Trophy,
  LayoutGrid,
} from 'lucide-react'
import PageHeader from '../../components/common/PageHeader'
import StatCard from '../../components/common/StatCard'
import ChartCard from '../../components/admin/ChartCard'
import LoadingSkeleton from '../../components/common/LoadingSkeleton'
import { analyticsService, type AnalyticsRange } from '../../services/analyticsService'
import { formatPrice } from '../../utils/format'

const RANGE_OPTIONS: { value: AnalyticsRange; label: string }[] = [
  { value: '7d', label: '7 días' },
  { value: '30d', label: '30 días' },
  { value: '90d', label: '90 días' },
  { value: '1y', label: '1 año' },
]

const PIE_COLORS = ['#e10600', '#1b7cff', '#37d67a', '#f5b301', '#a96bf5', '#22d3ee', '#f97316', '#e879f9']

interface Kpis {
  revenue: number
  profit: number
  orders: number
  averageTicket: number
  customers: number
  lowStock: number
  pendingOrders: number
}

export default function Analytics() {
  const [range, setRange] = useState<AnalyticsRange>('30d')
  const [kpis, setKpis] = useState<Kpis | null>(null)
  const [series, setSeries] = useState<any[]>([])
  const [byTeam, setByTeam] = useState<any[]>([])
  const [byScale, setByScale] = useState<any[]>([])
  const [topProducts, setTopProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async (selected: AnalyticsRange) => {
    setLoading(true)
    const [kpiData, seriesData, teamStats, scaleStats, topData] = await Promise.all([
      analyticsService.getKpis(selected),
      analyticsService.getSeries(selected),
      analyticsService.getStatsByDimension('team', 8),
      analyticsService.getStatsByDimension('scale', 6),
      analyticsService.getNovedades(6),
    ])
    setKpis(kpiData)
    setSeries(seriesData)
    setByTeam(teamStats)
    setByScale(scaleStats)
    setTopProducts(topData.topProducts.map((p, index) => ({ ...p, rank: index + 1, units: topData.topByUnits[index]?.units ?? 0 })))
    setLoading(false)
  }, [])

  useEffect(() => {
    load(range)
  }, [range, load])

  const totalUnits = useMemo(
    () => byScale.reduce((sum, item) => sum + item.units, 0),
    [byScale],
  )

  return (
    <div className="space-y-6">
      <PageHeader
        title="Analíticas"
        subtitle="Rendimiento económico y de ventas"
        actions={
          <div className="flex gap-1 rounded-lg border border-carbon-700 bg-carbon-900/60 p-1">
            {RANGE_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setRange(option.value)}
                className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${
                  range === option.value
                    ? 'bg-f1-500 text-white'
                    : 'text-carbon-400 hover:text-carbon-200'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        }
      />

      {loading || !kpis ? (
        <>
          <LoadingSkeleton variant="cards" count={5} />
          <LoadingSkeleton variant="table" count={6} />
        </>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
            <StatCard
              title="Ingresos"
              value={formatPrice(kpis.revenue)}
              icon={<CircleDollarSign size={20} />}
              accent="emerald"
              sub="en el periodo"
            />
            <StatCard
              title="Pedidos"
              value={String(kpis.orders)}
              icon={<ShoppingBag size={20} />}
              delta={`${kpis.pendingOrders} pendientes`}
              accent="f1"
            />
            <StatCard
              title="Beneficio"
              value={formatPrice(kpis.profit)}
              icon={<TrendingUp size={20} />}
              accent="amber"
            />
            <StatCard
              title="Ticket medio"
              value={formatPrice(kpis.averageTicket)}
              icon={<Wallet size={20} />}
              accent="racing"
            />
            <StatCard
              title="Clientes"
              value={String(kpis.customers)}
              icon={<Users size={20} />}
              delta={`${kpis.lowStock} alertas stock`}
              accent="carbon"
            />
          </div>

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            <ChartCard
              title="Ingresos y beneficio"
              subtitle="Evolución en el periodo seleccionado"
              className="xl:col-span-2"
            >
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={series} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#e10600" stopOpacity={0.35} />
                        <stop offset="100%" stopColor="#e10600" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="prof" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#37d67a" stopOpacity={0.3} />
                        <stop offset="100%" stopColor="#37d67a" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#26262e" vertical={false} />
                    <XAxis
                      dataKey="period"
                      tick={{ fill: '#8a8a94', fontSize: 11 }}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(value: string) =>
                        value.length === 10
                          ? new Date(value).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })
                          : value
                      }
                    />
                    <YAxis
                      tick={{ fill: '#8a8a94', fontSize: 11 }}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(value: number) => `€${value}`}
                      width={52}
                    />
                    <Tooltip
                      contentStyle={{
                        background: '#0d0d12',
                        border: '1px solid #2a2a33',
                        borderRadius: 12,
                        color: '#fff',
                      }}
                      formatter={(value, name) => [
                        formatPrice(Number(value)),
                        name === 'revenue' ? 'Ingresos' : 'Beneficio',
                      ]}
                    />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke="#e10600"
                      strokeWidth={2}
                      fill="url(#rev)"
                    />
                    <Area
                      type="monotone"
                      dataKey="profit"
                      stroke="#37d67a"
                      strokeWidth={2}
                      fill="url(#prof)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>

            <ChartCard title="Pedidos" subtitle="Número de pedidos por periodo">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={series} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#26262e" vertical={false} />
                    <XAxis
                      dataKey="period"
                      tick={{ fill: '#8a8a94', fontSize: 11 }}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(value: string) =>
                        value.length === 10
                          ? new Date(value).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })
                          : value
                      }
                    />
                    <YAxis
                      tick={{ fill: '#8a8a94', fontSize: 11 }}
                      axisLine={false}
                      tickLine={false}
                      allowDecimals={false}
                      width={36}
                    />
                    <Tooltip
                      cursor={{ fill: '#ffffff08' }}
                      contentStyle={{
                        background: '#0d0d12',
                        border: '1px solid #2a2a33',
                        borderRadius: 12,
                        color: '#fff',
                      }}
                      formatter={(value) => [Number(value), 'Pedidos']}
                    />
                    <Bar dataKey="orders" fill="#e10600" radius={[4, 4, 0, 0]} maxBarSize={28} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>

            <ChartCard title="Ventas por escudería" subtitle="Unidades vendidas">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={byTeam}
                      dataKey="units"
                      nameKey="key"
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={85}
                      paddingAngle={2}
                    >
                      {byTeam.map((_, index) => (
                        <Cell key={index} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        background: '#0d0d12',
                        border: '1px solid #2a2a33',
                        borderRadius: 12,
                        color: '#fff',
                      }}
                      formatter={(value) => [Number(value), 'unidades']}
                    />
                    <Legend
                      wrapperStyle={{ fontSize: 11, color: '#a1a1aa' }}
                      iconType="circle"
                      iconSize={8}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>

            <ChartCard title="Unidades por escala" subtitle={totalUnits > 0 ? `${totalUnits} unidades vendidas` : undefined}>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={byScale}
                    layout="vertical"
                    margin={{ top: 5, right: 12, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#26262e" horizontal={false} />
                    <XAxis
                      type="number"
                      tick={{ fill: '#8a8a94', fontSize: 11 }}
                      axisLine={false}
                      tickLine={false}
                      allowDecimals={false}
                    />
                    <YAxis
                      type="category"
                      dataKey="key"
                      tick={{ fill: '#a1a1aa', fontSize: 11 }}
                      axisLine={false}
                      tickLine={false}
                      width={80}
                    />
                    <Tooltip
                      cursor={{ fill: '#ffffff08' }}
                      contentStyle={{
                        background: '#0d0d12',
                        border: '1px solid #2a2a33',
                        borderRadius: 12,
                        color: '#fff',
                      }}
                      formatter={(value) => [`${value} uds.`, 'Unidades']}
                    />
                    <Bar dataKey="units" fill="#22d3ee" radius={[0, 4, 4, 0]} maxBarSize={18} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>

            <ChartCard
              title="Productos más vendidos"
              subtitle="Top por unidades vendidas"
              actions={<Trophy size={18} className="text-amber-400" />}
            >
              {topProducts.length === 0 ? (
                <p className="py-10 text-center text-sm text-carbon-500">Sin datos de ventas.</p>
              ) : (
                <ul className="space-y-3">
                  {topProducts.map((product) => (
                    <li key={product.id} className="flex items-center gap-3">
                      <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-carbon-800 text-xs font-bold text-carbon-300">
                        {product.rank}
                      </span>
                      <div className="size-10 shrink-0 overflow-hidden rounded-lg border border-carbon-800 bg-carbon-950">
                        <img src={product.images[0]} alt="" className="size-full object-cover" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-carbon-100">
                          {product.name}
                        </p>
                        <p className="text-xs text-carbon-500">{product.team}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-carbon-100">
                          {product.units} uds.
                        </p>
                        <p className="text-xs text-carbon-500">{formatPrice(product.price)}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </ChartCard>

            <ChartCard
              title="Estructura de ventas"
              subtitle="Reparto por escudería en unidades"
              actions={<LayoutGrid size={18} className="text-racing-400" />}
            >
              <ul className="space-y-2.5">
                {byTeam.map((item, index) => {
                  const maxUnits = byTeam[0]?.units ?? 1
                  const pct = Math.round((item.units / maxUnits) * 100)
                  return (
                    <li key={item.key} className="flex items-center gap-3 text-sm">
                      <span className="w-28 shrink-0 truncate text-carbon-300">{item.key}</span>
                      <div className="h-2 flex-1 overflow-hidden rounded-full bg-carbon-800">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${Math.max(pct, 4)}%`,
                            backgroundColor: PIE_COLORS[index % PIE_COLORS.length],
                          }}
                        />
                      </div>
                      <span className="w-12 shrink-0 text-right font-medium text-carbon-100">
                        {item.units}
                      </span>
                    </li>
                  )
                })}
              </ul>
            </ChartCard>
          </div>
        </>
      )}
    </div>
  )
}