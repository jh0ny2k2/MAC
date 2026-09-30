import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { CheckCircle2, Info, XCircle, X } from 'lucide-react'
import { cx } from '../utils/format'
import type { Toast } from '../types'

interface ToastContextValue {
  showToast: (message: string, type?: Toast['type']) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const timers = useRef<Record<string, number>>({})

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
    if (timers.current[id]) {
      window.clearTimeout(timers.current[id])
      delete timers.current[id]
    }
  }, [])

  const showToast = useCallback(
    (message: string, type: Toast['type'] = 'success') => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
      setToasts((prev) => [...prev.slice(-3), { id, message, type }])
      timers.current[id] = window.setTimeout(() => removeToast(id), 3500)
    },
    [removeToast],
  )

  const value = useMemo(() => ({ showToast }), [showToast])

  const icons: Record<Toast['type'], ReactNode> = {
    success: <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />,
    error: <XCircle size={18} className="text-f1-500 shrink-0" />,
    info: <Info size={18} className="text-racing-400 shrink-0" />,
  }

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 top-20 z-[100] flex flex-col items-center gap-2 px-4 sm:items-end sm:pr-6">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={cx(
              'pointer-events-auto flex w-full max-w-sm animate-toast-in items-center gap-3 rounded-xl border px-4 py-3 shadow-2xl',
              'bg-carbon-800/95 backdrop-blur-xl border-carbon-700',
            )}
            role="status"
          >
            {icons[toast.type]}
            <p className="flex-1 text-sm text-carbon-100">{toast.message}</p>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-carbon-400 transition-colors hover:text-white"
              aria-label="Cerrar notificación"
            >
              <X size={15} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within a ToastProvider')
  return ctx
}