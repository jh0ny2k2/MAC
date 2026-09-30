import { useState, useEffect, useMemo } from 'react'
import { supabase } from '../../lib/supabase'
import { formatHours } from '../../lib/calculations'
import useCountUp from '../../hooks/useCountUp'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts'

const MONTHS = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']

function timeAgo(iso) {
  if (!iso) return 'nunca'
  const diff = Date.now() - new Date(iso).getTime()
  const min = Math.floor(diff / 60000)
  if (min < 1) return 'ahora mismo'
  if (min < 60) return `hace ${min} min`
  const h = Math.floor(min / 60)
  if (h < 24) return `hace ${h} h`
  const d = Math.floor(h / 24)
  if (d < 30) return `hace ${d} d`
  const date = new Date(iso)
  return `${date.getDate()} ${MONTHS[date.getMonth()]}`
}

function RoleBadge({ role }) {
  const styles = {
    company_owner: 'bg-fuchsia-50 dark:bg-fuchsia-500/10 text-fuchsia-700 dark:text-fuchsia-300 border border-fuchsia-200 dark:border-fuchsia-500/20',
    employee: 'bg-sky-50 dark:bg-sky-500/10 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-500/20',
    individual: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700',
  }
  const labels = { company_owner: 'Empresa', employee: 'Empleado', individual: 'Persona' }
  return (
    <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full whitespace-nowrap ${styles[role] || styles.individual}`}>
      {labels[role] || role}
    </span>
  )
}

export default function AdminDashboard() {
  const [users, setUsers] = useState([])
  const [companies, setCompanies] = useState([])
  const [shifts, setShifts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [chartView, setChartView] = useState('daily')

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      setError('')

      const { data: usersData, error: usersError } = await supabase.rpc('admin_list_users')
      if (usersError) throw usersError

      const [companiesRes, shiftsRes] = await Promise.all([
        supabase.from('companies').select('*').order('created_at', { ascending: false }),
        supabase.from('work_shifts').select('user_id, total_hours, work_date'),
      ])

      setUsers(usersData || [])
      setCompanies(companiesRes.data || [])
      setShifts(shiftsRes.data || [])
    } catch (err) {
      setError(err.message || 'Error al cargar los datos')
    } finally {
      setLoading(false)
    }
  }

  const stats = useMemo(() => {
    const now = Date.now()
    const day = 86400000
    const todayStr = new Date().toISOString().split('T')[0]

    const newToday = users.filter(u => u.created_at?.split('T')[0] === todayStr).length
    const newWeek = users.filter(u => u.created_at && now - new Date(u.created_at).getTime() < 7 * day).length
    const newMonth = users.filter(u => u.created_at && now - new Date(u.created_at).getTime() < 30 * day).length
    const activeUsers = users.filter(u => u.last_sign_in_at && now - new Date(u.last_sign_in_at).getTime() < 30 * day).length
    const totalHours = shifts.reduce((acc, s) => acc + Number(s.total_hours), 0)

    return {
      total: users.length,
      newToday,
      newWeek,
      newMonth,
      activeUsers,
      totalHours,
      totalShifts: shifts.length,
      companies: companies.length,
    }
  }, [users, companies, shifts])

  const animatedTotal = useCountUp(stats.total)
  const animatedActive = useCountUp(stats.activeUsers)
  const animatedShifts = useCountUp(stats.totalShifts)
  const animatedCompanies = useCountUp(stats.companies)

  const totalUsers = Math.round(animatedTotal)
  const activeUsers = Math.round(animatedActive)
  const totalShifts = Math.round(animatedShifts)
  const totalCompanies = Math.round(animatedCompanies)

  const chartData = useMemo(() => {
    if (chartView === 'daily') {
      const days = []
      for (let i = 29; i >= 0; i--) {
        const d = new Date()
        d.setDate(d.getDate() - i)
        const key = d.toISOString().split('T')[0]
        days.push({
          key,
          label: `${d.getDate()}/${d.getMonth() + 1}`,
          registros: users.filter(u => u.created_at?.split('T')[0] === key).length,
        })
      }
      return days
    }

    const months = []
    for (let i = 11; i >= 0; i--) {
      const d = new Date()
      d.setDate(1)
      d.setMonth(d.getMonth() - i)
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
      months.push({
        key,
        label: MONTHS[d.getMonth()],
        registros: users.filter(u => u.created_at?.split('T')[0]?.startsWith(key)).length,
      })
    }
    return months
  }, [users, chartView])

  const recentUsers = useMemo(() => users.slice(0, 6), [users])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <div className="relative w-14 h-14">
          <div className="absolute inset-0 rounded-full border-2 border-white/10" />
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-violet-400 animate-spin" />
        </div>
        <p className="text-slate-500 text-sm font-medium">Inicializando consola...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {error && (
        <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 text-red-700 dark:text-red-300 text-sm p-4 rounded-2xl flex items-start justify-between gap-3">
          <span>{error}</span>
          <button onClick={() => setError('')} className="font-bold leading-none hover:text-red-800 dark:hover:text-red-200">×</button>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Panel de administración</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Monitorea la actividad del sistema</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 rounded-full">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-300">En vivo</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 stagger">
        {/* Usuarios */}
        <div className="card group">
          <div className="flex items-start justify-between mb-3">
            <div className="w-12 h-12 rounded-2xl bg-violet-50 dark:bg-violet-500/10 flex items-center justify-center">
              <svg className="w-6 h-6 text-violet-600 dark:text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
          </div>
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Usuarios registrados</p>
          <p className="text-4xl font-extrabold text-slate-900 dark:text-white mt-2 tabular-nums">{totalUsers}</p>
          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-600 dark:text-slate-400">+{stats.newWeek} esta semana</span>
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">↑</span>
          </div>
        </div>

        {/* Turnos */}
        <div className="card group">
          <div className="flex items-start justify-between mb-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center">
              <svg className="w-6 h-6 text-amber-600 dark:text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Turnos registrados</p>
          <p className="text-4xl font-extrabold text-slate-900 dark:text-white mt-2 tabular-nums">{totalShifts}</p>
          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            <span className="text-xs text-slate-600 dark:text-slate-400">{formatHours(stats.totalHours)} horas totales</span>
          </div>
        </div>

        {/* Horas */}
        <div className="card group">
          <div className="flex items-start justify-between mb-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Activos 30 días</p>
          <p className="text-4xl font-extrabold text-slate-900 dark:text-white mt-2 tabular-nums">{activeUsers}</p>
          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            <span className="text-xs text-slate-600 dark:text-slate-400">{users.filter(u => u.role === 'employee').length} empleados</span>
          </div>
        </div>

        {/* Empresas */}
        <div className="card group">
          <div className="flex items-start justify-between mb-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center">
              <svg className="w-6 h-6 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
          </div>
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Empresas</p>
          <p className="text-4xl font-extrabold text-slate-900 dark:text-white mt-2 tabular-nums">{totalCompanies}</p>
          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            <span className="text-xs text-slate-600 dark:text-slate-400">+{stats.newWeek} esta semana</span>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="card">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Crecimiento de registros</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Nuevos usuarios por período</p>
          </div>
          <div className="flex gap-1.5 bg-slate-100 dark:bg-slate-800 rounded-xl p-1">
            {[
              { key: 'daily', label: '30 días' },
              { key: 'monthly', label: '12 meses' },
            ].map((opt) => (
              <button
                key={opt.key}
                onClick={() => setChartView(opt.key)}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                  chartView === opt.key
                    ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-md'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {chartData.every(d => d.registros === 0) ? (
          <p className="text-sm text-slate-500 dark:text-slate-400 text-center py-14">Sin registros en este período</p>
        ) : (
          <div className="h-60 -ml-3">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 5, right: 5, bottom: 0, left: -18 }}>
                <defs>
                  <linearGradient id="regGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" vertical={false} />
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 10, fill: 'var(--chart-tick)' }}
                  axisLine={false}
                  tickLine={false}
                  interval="preserveStartEnd"
                  minTickGap={24}
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ fontSize: 10, fill: 'var(--chart-tick)' }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  cursor={{ strokeWidth: 0 }}
                  contentStyle={{
                    background: 'var(--chart-tooltip-bg)',
                    border: '1px solid rgba(139,92,246,0.2)',
                    borderRadius: '14px',
                    fontSize: '12px',
                    boxShadow: '0 8px 30px rgba(0,0,0,0.1)',
                  }}
                  labelStyle={{ color: '#64748b' }}
                  itemStyle={{ color: '#a78bfa' }}
                />
                <Area
                  type="monotone"
                  dataKey="registros"
                  stroke="#a78bfa"
                  strokeWidth={2.5}
                  fill="url(#regGradient)"
                  dot={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Últimos registrados */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Últimos registrados</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{users.length} usuarios en total</p>
          </div>
        </div>
        {recentUsers.length === 0 ? (
          <div className="text-center py-10">
            <svg className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Cuando alguien se registre aparecerá aquí</p>
          </div>
        ) : (
          <div className="space-y-1 divide-y divide-slate-100 dark:divide-slate-800">
            {recentUsers.map((u) => (
              <div key={u.id} className="flex items-center justify-between gap-3 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/40 px-2 rounded-lg transition-colors">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-bold text-white">{(u.email || '?')[0].toUpperCase()}</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">{u.email}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{timeAgo(u.created_at)}</p>
                  </div>
                </div>
                <RoleBadge role={u.role} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
