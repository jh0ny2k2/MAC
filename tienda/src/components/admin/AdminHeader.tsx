import { Menu, LogOut, ShieldCheck } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { buttonStyles } from '../ui/Button'
import { NotificationButton } from './NotificationPanel'

interface AdminHeaderProps {
  onOpenSidebar: () => void
}

export default function AdminHeader({ onOpenSidebar }: AdminHeaderProps) {
  const { session, logout } = useAuth()

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-carbon-800 bg-carbon-950/80 px-4 backdrop-blur-xl sm:px-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenSidebar}
          className="flex size-9 items-center justify-center rounded-lg border border-carbon-700 text-carbon-300 transition-colors hover:border-carbon-500 hover:text-white lg:hidden"
          aria-label="Abrir menú"
        >
          <Menu size={18} />
        </button>
        <div className="hidden sm:block">
          <p className="text-xs text-carbon-500">Tienda · Panel de administración</p>
          <p className="text-sm font-semibold text-white">Apex F1 Store</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <NotificationButton />
        <div className="hidden items-center gap-2.5 rounded-xl border border-carbon-800 bg-carbon-900/60 px-3 py-2 md:flex">
          <div className="flex size-8 items-center justify-center rounded-lg bg-f1-500/15 text-f1-400">
            <ShieldCheck size={16} />
          </div>
          <div>
            <p className="text-xs font-semibold text-white">
              {session?.name ?? 'Admin'}
            </p>
            <p className="text-[10px] text-carbon-500">{session?.role}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className={buttonStyles({
            variant: 'ghost',
            size: 'sm',
            className: 'gap-2',
          })}
          aria-label="Cerrar sesión"
        >
          <LogOut size={15} />
          <span className="hidden sm:inline">Salir</span>
        </button>
      </div>
    </header>
  )
}