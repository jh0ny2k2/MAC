import { useState, useEffect, useMemo } from 'react'
import { supabase } from '../../lib/supabase'
import { useNavigate } from 'react-router-dom'

const MONTHS = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']

const ROLE_FILTERS = [
  { key: 'all', label: 'Todos' },
  { key: 'individual', label: 'Personas' },
  { key: 'company_owner', label: 'Empresas' },
  { key: 'employee', label: 'Empleados' },
]

const AVATAR_STYLES = {
  company_owner: 'from-fuchsia-500 to-pink-600 shadow-fuchsia-600/40',
  employee: 'from-sky-500 to-blue-600 shadow-sky-600/40',
  individual: 'from-violet-500 to-purple-600 shadow-violet-600/40',
}

function timeAgo(iso) {
  if (!iso) return 'nunca'
  const diff = Date.now() - new Date(iso).getTime()
  const min = Math.floor(diff / 60000)
  if (min < 1) return 'ahora'
  if (min < 60) return `${min} min`
  const h = Math.floor(min / 60)
  if (h < 24) return `${h} h`
  const d = Math.floor(h / 24)
  if (d < 30) return `${d} d`
  const date = new Date(iso)
  return `${date.getDate()} ${MONTHS[date.getMonth()]}`
}

export default function AdminUsers() {
  const navigate = useNavigate()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    try {
      setLoading(true)
      setError('')

      const { data, error: rpcError } = await supabase.rpc('admin_list_users')
      if (rpcError) throw rpcError

      setUsers(data || [])
    } catch (err) {
      setError(err.message || 'Error al cargar los usuarios')
    } finally {
      setLoading(false)
    }
  }

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return users.filter((u) => {
      if (roleFilter !== 'all' && u.role !== roleFilter) return false
      if (!q) return true
      return (
        u.email?.toLowerCase().includes(q) ||
        u.full_name?.toLowerCase().includes(q)
      )
    })
  }, [users, search, roleFilter])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <div className="relative w-14 h-14">
          <div className="absolute inset-0 rounded-full border-2 border-white/10" />
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-violet-400 animate-spin" />
        </div>
        <p className="text-slate-500 text-sm font-medium">Cargando usuarios...</p>
      </div>
    )
  }

  return (
    <div className="space-y-4 animate-fade-in">
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-300 text-sm p-3.5 rounded-2xl flex items-start justify-between gap-3 backdrop-blur-xl">
          <span>{error}</span>
          <button onClick={() => setError('')} className="font-bold leading-none hover:text-red-200">×</button>
        </div>
      )}

      {/* Buscador */}
      <div className="relative">
        <svg className="w-4.5 h-4.5 w-[18px] h-[18px] absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por email o nombre..."
          className="admin-input !pl-11"
        />
      </div>

      {/* Filtros */}
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
        {ROLE_FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => setRoleFilter(f.key)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 border ${
              roleFilter === f.key
                ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white border-transparent shadow-md shadow-violet-600/30'
                : 'bg-white/[0.04] text-slate-400 border-white/[0.08] hover:text-white hover:border-white/20'
            }`}
          >
            {f.label}
          </button>
        ))}
        <span className="ml-auto text-[11px] text-slate-500 font-mono flex-shrink-0">{filtered.length}/{users.length}</span>
        <button
          onClick={loadUsers}
          className="p-2 rounded-xl text-slate-500 hover:text-white hover:bg-white/5 transition-colors flex-shrink-0"
          title="Recargar"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>

      {/* Lista */}
      {filtered.length === 0 ? (
        <div className="glass py-16 flex flex-col items-center text-center px-6">
          <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-4">
            <svg className="w-7 h-7 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h3 className="font-semibold mb-1">Sin resultados</h3>
          <p className="text-sm text-slate-500">Ningún usuario coincide con la búsqueda</p>
        </div>
      ) : (
        <div className="glass !rounded-[26px] p-2 divide-y divide-white/[0.05]">
          {filtered.map((u, i) => (
            <button
              key={u.id}
              onClick={() => navigate(`/admin/users/${u.id}`)}
              className="w-full flex items-center justify-between gap-3 py-3 px-3 rounded-2xl hover:bg-white/[0.05] transition-all duration-200 text-left group"
              style={{ animationDelay: `${Math.min(i * 0.03, 0.4)}s` }}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="relative w-10 h-10 flex-shrink-0">
                  <div className={`absolute inset-0 rounded-xl bg-gradient-to-br ${AVATAR_STYLES[u.role] || AVATAR_STYLES.individual} blur-sm opacity-40 group-hover:opacity-80 transition-opacity`} />
                  <div className={`relative w-10 h-10 rounded-xl bg-gradient-to-br ${AVATAR_STYLES[u.role] || AVATAR_STYLES.individual} flex items-center justify-center`}>
                    <span className="text-sm font-bold text-white">{(u.full_name || u.email || '?')[0].toUpperCase()}</span>
                  </div>
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{u.full_name || u.email?.split('@')[0]}</p>
                  <p className="text-xs text-slate-500 truncate">{u.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 flex-shrink-0">
                <div className="text-right hidden sm:block">
                  <p className="text-[10px] uppercase tracking-wider text-slate-600 font-bold">Login</p>
                  <p className="text-xs text-slate-400 font-mono">{timeAgo(u.last_sign_in_at)}</p>
                </div>
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full border ${
                  u.role === 'company_owner'
                    ? 'bg-fuchsia-500/10 text-fuchsia-300 border-fuchsia-500/25'
                    : u.role === 'employee'
                      ? 'bg-sky-500/10 text-sky-300 border-sky-500/25'
                      : 'bg-white/5 text-slate-500 border-white/10'
                }`}>
                  {u.role === 'company_owner' ? 'Empresa' : u.role === 'employee' ? 'Empleado' : 'Persona'}
                </span>
                <svg className="w-4 h-4 text-slate-600 group-hover:text-violet-400 group-hover:translate-x-0.5 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
