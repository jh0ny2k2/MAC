import { Navigate, NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

const navItems = [
  {
    to: '/admin',
    label: 'Resumen',
    end: true,
    icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
  },
  {
    to: '/admin/users',
    label: 'Usuarios',
    end: false,
    icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z',
  },
  {
    to: '/admin/companies',
    label: 'Empresas',
    end: false,
    icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4',
  },
]

function Logo() {
  return (
    <div className="relative w-10 h-10 flex-shrink-0">
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-violet-500 via-fuchsia-500 to-indigo-500 blur-md opacity-40" />
      <div className="relative w-10 h-10 rounded-2xl bg-gradient-to-br from-violet-500 via-fuchsia-500 to-indigo-500 flex items-center justify-center shadow-lg shadow-violet-500/30">
        <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      </div>
    </div>
  )
}

export default function AdminLayout() {
  const { user, isAdmin, loading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  if (loading) {
    return (
      <div className="min-h-screen admin-shell flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-12 h-12">
            <div className="absolute inset-0 rounded-full border-2 border-slate-200" />
            <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-violet-500 animate-spin" />
          </div>
          <p className="text-slate-400 text-sm font-medium">Cargando panel...</p>
        </div>
      </div>
    )
  }

  if (!user) return <Navigate to="/auth/login" replace />
  if (!isAdmin) return <Navigate to="/" replace />

  const isDetail = /\/admin\/(users|companies)\/[^/]+$/.test(location.pathname)

  return (
    <div className="min-h-screen admin-shell text-slate-800 relative">
      {/* Orbes decorativos */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="admin-orb w-[420px] h-[420px] bg-violet-300/25 -top-48 -right-32" />
        <div className="admin-orb w-[380px] h-[380px] bg-fuchsia-200/30 bottom-0 -left-40" style={{ animationDelay: '-8s' }} />
      </div>

      <div className="relative lg:flex">
        {/* Sidebar desktop */}
        <aside className="hidden lg:flex flex-col fixed inset-y-0 left-0 w-64 admin-sidebar z-40">
          <div className="flex items-center gap-3 px-5 py-6">
            <Logo />
            <div>
              <h1 className="text-[15px] font-extrabold tracking-tight leading-tight">
                Consola <span className="text-gradient">Admin</span>
              </h1>
              <p className="text-[11px] text-slate-400 font-medium">Horas de Trabajo</p>
            </div>
          </div>

          <nav className="flex-1 px-3 space-y-1 mt-2">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-lg shadow-violet-500/25'
                      : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100/80'
                  }`
                }
              >
                <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                </svg>
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="p-4 space-y-2 border-t border-slate-200/70">
            <button
              onClick={() => navigate('/')}
              className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl text-sm font-semibold text-slate-500 hover:text-slate-800 hover:bg-slate-100/80 transition-all"
            >
              <svg className="w-4.5 h-4.5 w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Volver a la app
            </button>
            <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200/70">
              <span className="relative flex h-2 w-2 flex-shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="text-[11px] text-slate-500 truncate font-mono">{user.email}</span>
            </div>
          </div>
        </aside>

        {/* Header móvil */}
        <header className="lg:hidden sticky top-0 z-40 backdrop-blur-xl bg-white/80 border-b border-slate-200/70 safe-area-top">
          <div className="px-4 py-3 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <Logo />
              <div className="min-w-0">
                <h1 className="text-sm font-extrabold tracking-tight leading-tight">
                  Consola <span className="text-gradient">Admin</span>
                </h1>
                <p className="text-[10px] text-slate-400 truncate font-mono">{user.email}</p>
              </div>
            </div>
            <button
              onClick={() => navigate('/')}
              className="text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors px-3 py-2 rounded-xl hover:bg-slate-100 flex-shrink-0"
            >
              App
            </button>
          </div>
          {!isDetail && (
            <nav className="px-4 pb-2.5 flex gap-1.5 overflow-x-auto scrollbar-none">
              {navItems.map((tab) => (
                <NavLink
                  key={tab.to}
                  to={tab.to}
                  end={tab.end}
                  className={({ isActive }) =>
                    `px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                      isActive
                        ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-md shadow-violet-500/25'
                        : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                    }`
                  }
                >
                  {tab.label}
                </NavLink>
              ))}
            </nav>
          )}
        </header>

        {/* Contenido */}
        <main className="flex-1 min-w-0 lg:ml-64">
          <div className="mx-auto w-full max-w-5xl px-4 py-5 pb-16 lg:px-8 lg:py-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
