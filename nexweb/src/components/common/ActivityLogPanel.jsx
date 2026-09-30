import { useState, useEffect, useRef } from 'react'
import { useDashboard } from '../../context/DashboardContext'
import { Terminal, X, Clock, Plus, Pencil, Trash2, Reply, Settings } from 'lucide-react'

const actionIcons = {
  create: Plus,
  update: Pencil,
  delete: Trash2,
  reply: Reply,
  settings: Settings,
}

const actionColors = {
  create: 'text-emerald-500 bg-emerald-50',
  update: 'text-blue-500 bg-blue-50',
  delete: 'text-red-500 bg-red-50',
  reply: 'text-violet-500 bg-violet-50',
  settings: 'text-gray-500 bg-gray-100',
}

export default function ActivityLogPanel() {
  const { activityLog } = useDashboard()
  const [open, setOpen] = useState(false)
  const listRef = useRef(null)

  useEffect(() => {
    if (open && listRef.current) {
      listRef.current.scrollTop = 0
    }
  }, [activityLog, open])

  return (
    <>
      {open && (
        <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
      )}

      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
        {open && (
          <div
            ref={listRef}
            className="w-80 sm:w-96 h-96 bg-gray-900/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 overflow-hidden flex flex-col"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 shrink-0">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-emerald-400" />
                <span className="text-sm font-semibold text-white">Registro de actividad</span>
              </div>
              <button onClick={() => setOpen(false)} className="p-1 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
              {activityLog.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-500">
                  <Terminal className="w-8 h-8 mb-2 opacity-50" />
                  <p className="text-sm">No hay actividad aún</p>
                </div>
              ) : (
                activityLog.map((entry) => {
                  const Icon = actionIcons[entry.action] || Terminal
                  const color = actionColors[entry.action] || 'text-gray-400 bg-gray-800'
                  const time = new Date(entry.timestamp)
                  const timeStr = time.toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' })
                  return (
                    <div key={entry.id} className="flex items-start gap-2.5 p-2.5 rounded-xl hover:bg-white/5 transition-colors">
                      <div className={`p-1.5 rounded-lg shrink-0 ${color}`}>
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm text-gray-200 leading-snug">{entry.label}</p>
                        <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {timeStr}
                        </p>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </div>
        )}

        <button
          onClick={() => setOpen(!open)}
          className={`p-3 rounded-2xl shadow-lg transition-all duration-300 ${
            open
              ? 'bg-red-500 hover:bg-red-600 rotate-90'
              : 'bg-gray-900 hover:bg-gray-800'
          } text-white`}
        >
          {open ? <X className="w-5 h-5" /> : <Terminal className="w-5 h-5" />}
        </button>
      </div>
    </>
  )
}
