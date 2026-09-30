import { useEffect, useRef, useState } from 'react'
import {
  Bell,
  CheckCheck,
  ShoppingCart,
  AlertTriangle,
  PackageX,
  UserPlus,
  Truck,
} from 'lucide-react'
import { notificationService } from '../../services/notificationService'
import type { AdminNotification } from '../../types/admin'
import { cx } from '../../utils/format'

const typeStyle: Record<
  AdminNotification['type'],
  { icon: React.ReactNode; className: string }
> = {
  order: {
    icon: <ShoppingCart size={16} />,
    className: 'bg-sky-500/15 text-sky-400 border-sky-500/30',
  },
  stock: {
    icon: <AlertTriangle size={16} />,
    className: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  },
  out: {
    icon: <PackageX size={16} />,
    className: 'bg-f1-500/15 text-f1-400 border-f1-500/30',
  },
  customer: {
    icon: <UserPlus size={16} />,
    className: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  },
  cancelled: {
    icon: <PackageX size={16} />,
    className: 'bg-f1-500/15 text-f1-400 border-f1-500/30',
  },
  shipped: {
    icon: <Truck size={16} />,
    className: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30',
  },
}

function relativeTime(date: string): string {
  const ms = Date.now() - new Date(date).getTime()
  const mins = Math.floor(ms / 60000)
  if (mins < 1) return 'ahora'
  if (mins < 60) return `hace ${mins} min`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `hace ${hours} h`
  const days = Math.floor(hours / 24)
  return `hace ${days} d`
}

export function NotificationButton() {
  const [open, setOpen] = useState(false)
  const [notifications, setNotifications] = useState<AdminNotification[]>([])
  const [unread, setUnread] = useState(0)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let mounted = true
    notificationService.getAll().then((list) => {
      if (!mounted) return
      setNotifications(list)
      setUnread(list.filter((n) => !n.read).length)
    })
    return () => {
      mounted = false
    }
  }, [open])

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const markAll = async () => {
    await notificationService.markAllRead()
    setUnread(0)
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="relative flex size-9 items-center justify-center rounded-lg border border-carbon-700 text-carbon-300 transition-colors hover:border-carbon-500 hover:text-white"
        aria-label="Notificaciones"
      >
        <Bell size={17} />
        {unread > 0 && (
          <span className="absolute -right-1.5 -top-1.5 flex size-4.5 min-w-[18px] items-center justify-center rounded-full bg-f1-500 px-1 text-[10px] font-bold text-white">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>
      {open && (
        <div className="absolute right-0 z-50 mt-2 w-80 overflow-hidden rounded-xl border border-carbon-700 bg-carbon-950 shadow-2xl shadow-black/50 sm:w-96">
          <div className="flex items-center justify-between border-b border-carbon-800 px-4 py-3">
            <p className="text-sm font-semibold text-white">Notificaciones</p>
            <button
              type="button"
              onClick={markAll}
              className="inline-flex items-center gap-1.5 text-xs text-carbon-400 transition-colors hover:text-white"
            >
              <CheckCheck size={14} />
              Marcar como leídas
            </button>
          </div>
          <div className="max-h-96 overflow-auto">
            {notifications.length === 0 ? (
              <p className="px-4 py-10 text-center text-sm text-carbon-500">
                No hay notificaciones.
              </p>
            ) : (
              notifications.slice(0, 12).map((notification) => {
                const style = typeStyle[notification.type] ?? typeStyle.order
                return (
                  <div
                    key={notification.id}
                    className={cx(
                      'flex items-start gap-3 border-b border-carbon-800/60 px-4 py-3',
                      !notification.read && 'bg-carbon-900/50',
                    )}
                  >
                    <div
                      className={cx(
                        'flex size-8 shrink-0 items-center justify-center rounded-lg border',
                        style.className,
                      )}
                    >
                      {style.icon}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm leading-snug text-carbon-200">
                        {notification.message}
                      </p>
                      <p className="mt-0.5 text-[11px] text-carbon-500">
                        {relativeTime(notification.date)}
                      </p>
                    </div>
                    {!notification.read && (
                      <span className="mt-1.5 size-2 shrink-0 rounded-full bg-f1-500" />
                    )}
                  </div>
                )
              })
            )}
          </div>
        </div>
      )}
    </div>
  )
}