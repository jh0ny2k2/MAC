import { Link, NavLink, useLocation } from 'react-router-dom'
import {
  BarChart3,
  Boxes,
  ExternalLink,
  Flag,
  History,
  LayoutDashboard,
  Package,
  Percent,
  Settings,
  ShoppingBag,
  Tags,
  Upload,
  User,
  Users,
  Warehouse,
  X,
  type LucideIcon,
} from 'lucide-react'
import { cx } from '../../utils/format'

interface NavItem {
  to: string
  label: string
  icon: LucideIcon
  end?: boolean
}

interface NavGroup {
  title: string
  items: NavItem[]
}

const NAV_GROUPS: NavGroup[] = [
  {
    title: 'Principal',
    items: [{ to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true }],
  },
  {
    title: 'Comercio',
    items: [
      { to: '/admin/productos', label: 'Productos', icon: Boxes },
      { to: '/admin/pedidos', label: 'Pedidos', icon: ShoppingBag },
      { to: '/admin/clientes', label: 'Clientes', icon: Users },
      { to: '/admin/descuentos', label: 'Descuentos', icon: Percent },
    ],
  },
  {
    title: 'Importación',
    items: [
      { to: '/admin/importar', label: 'Importar producto', icon: Upload },
      { to: '/admin/importaciones', label: 'Importaciones', icon: History },
    ],
  },
  {
    title: 'Catálogo',
    items: [
      { to: '/admin/inventario', label: 'Inventario', icon: Warehouse },
      { to: '/admin/escuderias', label: 'Escuderías', icon: Flag },
      { to: '/admin/pilotos', label: 'Pilotos', icon: User },
      { to: '/admin/categorias', label: 'Categorías', icon: Tags },
    ],
  },
  {
    title: 'Análisis',
    items: [{ to: '/admin/analiticas', label: 'Analíticas', icon: BarChart3 }],
  },
  {
    title: 'Sistema',
    items: [{ to: '/admin/ajustes', label: 'Ajustes', icon: Settings }],
  },
]

interface AdminSidebarProps {
  open: boolean
  onClose: () => void
}

export default function AdminSidebar({ open, onClose }: AdminSidebarProps) {
  const location = useLocation()

  const isActiveOrder = (path: string) => {
    if (path === '/admin') return location.pathname === '/admin'
    return (
      location.pathname === path ||
      location.pathname.startsWith(`${path}/`)
    )
  }

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}
      <aside
        className={cx(
          'fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-carbon-800 bg-carbon-950 transition-transform duration-300 lg:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="flex items-center justify-between border-b border-carbon-800 px-5 py-4">
          <Link to="/admin" onClick={onClose} className="flex items-center gap-2.5">
            <span className="flex size-8 items-center justify-center rounded-lg bg-f1-500 font-display text-xs font-bold text-white">
              F1
            </span>
            <div>
              <p className="font-display text-sm font-bold uppercase tracking-wider text-white">
                Apex Admin
              </p>
              <p className="text-[10px] uppercase tracking-widest text-carbon-500">
                Panel de gestión
              </p>
            </div>
          </Link>
          <button
            type="button"
            onClick={onClose}
            className="text-carbon-500 transition-colors hover:text-white lg:hidden"
            aria-label="Cerrar menú"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 space-y-5 overflow-y-auto px-3 py-4">
          {NAV_GROUPS.map((group) => (
            <div key={group.title}>
              <p className="mb-1.5 px-3 text-[10px] font-semibold uppercase tracking-widest text-carbon-600">
                {group.title}
              </p>
              <ul className="space-y-0.5">
                {group.items.map((item) => {
                  const active = isActiveOrder(item.to)
                  return (
                    <li key={item.to}>
                      <NavLink
                        to={item.to}
                        end={item.end}
                        onClick={onClose}
                        className={cx(
                          'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                          active
                            ? 'bg-f1-500/10 text-f1-400'
                            : 'text-carbon-400 hover:bg-carbon-900 hover:text-carbon-200',
                        )}
                      >
                        <item.icon size={17} className={cx(active && 'text-f1-400')} />
                        {item.label}
                        {active && (
                          <span className="ml-auto size-1.5 rounded-full bg-f1-500" />
                        )}
                      </NavLink>
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </nav>

        <div className="border-t border-carbon-800 p-3">
          <a
            href="/"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-carbon-400 transition-colors hover:bg-carbon-900 hover:text-carbon-200"
          >
            <Package size={17} />
            Ver tienda
            <ExternalLink size={14} className="ml-auto text-carbon-600" />
          </a>
        </div>
      </aside>
    </>
  )
}