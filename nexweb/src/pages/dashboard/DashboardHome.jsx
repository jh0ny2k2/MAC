import { Globe, CheckCircle, Clock, Inbox, DollarSign, Users } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import ScrollReveal from '../../components/common/ScrollReveal'
import { useDashboard } from '../../context/DashboardContext'

const statConfig = [
  { icon: Globe, label: 'Total webs creadas', value: 'totalWebs', change: '+12%' },
  { icon: CheckCircle, label: 'Webs activas', value: 'activeWebs', change: '+5%' },
  { icon: Clock, label: 'Proyectos pendientes', value: 'pendingProjects', change: '-3' },
  { icon: Inbox, label: 'Solicitudes nuevas', value: 'newRequests', change: '+7' },
  { icon: DollarSign, label: 'Ingresos estimados', value: 'revenue', change: '+18%', format: v => `${v.toLocaleString()}€` },
  { icon: Users, label: 'Clientes registrados', value: 'registeredClients', change: '+9' },
]

const statusConfig = {
  pending: { label: 'Pendiente', class: 'bg-gray-100 text-gray-600' },
  design: { label: 'En diseño', class: 'bg-blue-100 text-blue-700' },
  review: { label: 'En revisión', class: 'bg-amber-100 text-amber-700' },
  published: { label: 'Publicado', class: 'bg-emerald-100 text-emerald-700' },
}

function CustomTooltip({ active, payload, label }) {
  if (active && payload?.length) {
    return (
      <div className="bg-white shadow-lg border border-gray-100 rounded-lg px-4 py-3 text-sm">
        <p className="font-medium text-gray-900 mb-1">{label}</p>
        {payload.map((p, i) => (
          <p key={i} className="text-gray-500">{p.name}: <span className="font-semibold text-gray-900">{p.value}</span></p>
        ))}
      </div>
    )
  }
  return null
}

export default function DashboardHome() {
  const { data } = useDashboard()

  const websitesByStatus = ['published', 'review', 'design', 'pending'].map(s => ({
    name: statusConfig[s].label,
    value: data.websites.filter(w => w.status === s).length,
    fill: s === 'published' ? '#059669' : s === 'review' ? '#d97706' : s === 'design' ? '#3b82f6' : '#9ca3af',
  }))

  const requestsByStatus = ['new', 'contacted', 'converted', 'lost'].map(s => ({
    name: s === 'new' ? 'Nueva' : s === 'contacted' ? 'Contactado' : s === 'converted' ? 'Convertido' : 'Perdido',
    value: data.requests.filter(r => r.status === s).length,
    color: s === 'new' ? '#3b82f6' : s === 'contacted' ? '#d97706' : s === 'converted' ? '#059669' : '#ef4444',
  }))

  const invoicesByMonth = (() => {
    const months = {}
    data.invoices.forEach(inv => {
      const parts = inv.date?.split('/')
      if (parts?.length === 3) {
        const key = `${parts[1]}/${parts[2]}`
        months[key] = (months[key] || 0) + (inv.amount || 0)
      }
    })
    return Object.entries(months).map(([month, total]) => ({ month, total }))
  })()

  const projectsByProgress = data.projects.slice(0, 8).map(p => ({
    name: p.name.length > 18 ? p.name.slice(0, 16) + '...' : p.name,
    progreso: p.progress,
    fill: p.progress === 100 ? '#059669' : p.progress >= 60 ? '#3b82f6' : p.progress >= 30 ? '#d97706' : '#ef4444',
  }))

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Bienvenido al panel de gestión NexWeb</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {statConfig.map((stat, i) => {
          const raw = data.stats[stat.value]
          const display = stat.format ? stat.format(raw) : raw
          return (
            <ScrollReveal key={stat.label} delay={i * 0.05}>
              <div className="bg-white rounded-xl p-4 border border-gray-100 hover:shadow-md transition-all">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center">
                    <stat.icon className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className={`text-xs font-medium ${stat.change.startsWith('+') ? 'text-emerald-600' : 'text-gray-500'}`}>{stat.change}</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">{display}</p>
                <p className="text-xs text-gray-500 mt-0.5">{stat.label}</p>
              </div>
            </ScrollReveal>
          )
        })}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
          <h2 className="font-semibold text-gray-900 mb-4">Webs por estado</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={websitesByStatus} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={4} dataKey="value">
                  {websitesByStatus.map((entry, i) => (
                    <Cell key={i} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap justify-center gap-4 mt-2">
            {websitesByStatus.map((e, i) => (
              <div key={i} className="flex items-center gap-1.5 text-xs text-gray-500">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: e.fill }} />
                {e.name}: {e.value}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
          <h2 className="font-semibold text-gray-900 mb-4">Solicitudes por estado</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={requestsByStatus} margin={{ top: 10, right: 10, left: -10, bottom: 5 }}>
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={36}>
                  {requestsByStatus.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {invoicesByMonth.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
            <h2 className="font-semibold text-gray-900 mb-4">Ingresos mensuales</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={invoicesByMonth} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
                  <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="total" fill="#3b82f6" radius={[6, 6, 0, 0]} barSize={36} name="Ingresos" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
          <h2 className="font-semibold text-gray-900 mb-4">Progreso de proyectos</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={projectsByProgress} layout="vertical" margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} width={120} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="progreso" radius={[0, 6, 6, 0]} barSize={16}>
                  {projectsByProgress.map((entry, i) => (
                    <Cell key={i} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-semibold text-gray-900">Proyectos recientes</h2>
          <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">Ver todos</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 text-xs uppercase tracking-wider">
                <th className="p-4 font-medium">Cliente</th>
                <th className="p-4 font-medium">Proyecto</th>
                <th className="p-4 font-medium">Tipo</th>
                <th className="p-4 font-medium">Estado</th>
                <th className="p-4 font-medium">Fecha</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {data.projects.slice(0, 5).map((p) => (
                <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 font-medium text-gray-900">{p.client}</td>
                  <td className="p-4 text-gray-600">{p.name}</td>
                  <td className="p-4 text-gray-500">{p.type}</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-medium ${statusConfig[p.status].class}`}>
                      {statusConfig[p.status].label}
                    </span>
                  </td>
                  <td className="p-4 text-gray-500">{p.deadline}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
