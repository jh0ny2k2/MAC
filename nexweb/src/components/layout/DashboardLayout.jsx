import { useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import {
  LayoutDashboard, Users, Globe, FolderKanban, Inbox,
  Layout, CreditCard, Settings,
  ChevronLeft, Bell, Search, LogOut, Menu, X, Loader,
  Target, Send,
} from 'lucide-react'
import { useDashboard } from '../../context/DashboardContext'
import ActivityLogPanel from '../common/ActivityLogPanel'

const sidebarLinks = [
  { path: '/panel', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { path: '/panel/clientes', label: 'Clientes', icon: Users },
  { path: '/panel/webs', label: 'Webs creadas', icon: Globe },
  { path: '/panel/proyectos', label: 'Proyectos', icon: FolderKanban },
  { path: '/panel/solicitudes', label: 'Solicitudes', icon: Inbox },
  { path: '/panel/plantillas', label: 'Plantillas', icon: Layout },
  { path: '/panel/finderlead', label: 'FinderLead', icon: Target },
  { path: '/panel/campaigns', label: 'Campañas', icon: Send },
  { path: '/panel/facturacion', label: 'Facturación', icon: CreditCard },
  { path: '/panel/configuracion', label: 'Configuración', icon: Settings },
]

export default function DashboardLayout() {
  const { loading } = useDashboard()
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside className={`fixed lg:static inset-y-0 left-0 z-40 bg-white border-r border-gray-200 transition-all duration-300 flex flex-col ${
        sidebarOpen ? 'w-64' : 'w-0 lg:w-16'
      } overflow-hidden`}>
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            <img src="/logo.png" alt="NexWeb" className="h-8 w-auto" />
          </div>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hidden lg:block transition-colors">
            <ChevronLeft className={`w-4 h-4 transition-transform ${!sidebarOpen && 'rotate-180'}`} />
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {sidebarLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              end={link.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
                }`
              }
            >
              <link.icon className="w-5 h-5 shrink-0" />
              <span className={`transition-opacity ${sidebarOpen ? '' : 'lg:opacity-0'}`}>{link.label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="p-3 border-t border-gray-200 shrink-0">
          <NavLink to="/" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-500 hover:bg-gray-100 transition-colors">
            <LogOut className="w-5 h-5 shrink-0" />
            <span className={`transition-opacity ${sidebarOpen ? '' : 'lg:opacity-0'}`}>Volver a NexWeb</span>
          </NavLink>
        </div>
      </aside>

      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-6 shrink-0">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors">
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <div className="hidden sm:flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg text-sm text-gray-400 w-64 border border-gray-200">
              <Search className="w-4 h-4" />
              <input type="text" placeholder="Buscar..." className="bg-transparent outline-none text-gray-700 w-full placeholder:text-gray-400" />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-500 rounded-full" />
            </button>
            <div className="flex items-center gap-3 pl-3 border-l border-gray-200">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white text-sm font-semibold">
                A
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-gray-900 leading-tight">Admin NexWeb</p>
                <p className="text-xs text-gray-500">admin@nexweb.com</p>
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 lg:p-6">
          {loading ? (
            <div className="flex items-center justify-center h-full min-h-[400px]">
              <div className="flex flex-col items-center gap-3 text-gray-500">
                <Loader className="w-8 h-8 animate-spin text-blue-600" />
                <p className="text-sm">Cargando datos...</p>
              </div>
            </div>
          ) : (
            <Outlet />
          )}
        </div>
      </div>
      <ActivityLogPanel />
    </div>
  )
}
