import { useEffect } from 'react'
import { AlertTriangle, X } from 'lucide-react'
import { buttonStyles } from '../ui/Button'

interface ConfirmModalProps {
  open: boolean
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  onConfirm: () => void
  onCancel: () => void
}

export default function ConfirmModal({
  open,
  title,
  message,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onCancel()
    }
    if (open) document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [open, onCancel])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      onClick={onCancel}
    >
      <div
        role="dialog"
        aria-modal="true"
        className="w-full max-w-md rounded-2xl border border-carbon-700 bg-carbon-950 p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start gap-4">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-400">
            <AlertTriangle size={20} />
          </div>
          <div className="flex-1">
            <h3 className="font-display text-lg font-bold text-white">{title}</h3>
            <p className="mt-1.5 text-sm text-carbon-400">{message}</p>
          </div>
          <button
            onClick={onCancel}
            className="text-carbon-500 transition-colors hover:text-white"
            aria-label="Cerrar"
          >
            <X size={18} />
          </button>
        </div>
        <div className="mt-6 flex justify-end gap-2.5">
          <button className={buttonStyles({ variant: 'ghost' })} onClick={onCancel}>
            {cancelLabel}
          </button>
          <button
            className={buttonStyles({ variant: 'primary' })}
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}