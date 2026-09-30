import { useState, useEffect, useRef } from 'react'
import { Search, Mail, Trash2, ArrowLeft, User, Calendar } from 'lucide-react'
import ScrollReveal from '../../components/common/ScrollReveal'
import { useDashboard } from '../../context/DashboardContext'
import { supabase } from '../../lib/supabase'

export default function Messages() {
  const { data, toggleMessageRead, deleteMessage } = useDashboard()
  const [search, setSearch] = useState('')
  const [searchResults, setSearchResults] = useState(null)
  const [searching, setSearching] = useState(false)
  const [selected, setSelected] = useState(null)
  const timer = useRef(null)

  const unread = data.messages.filter(m => !m.read).length

  useEffect(() => {
    if (!search.trim()) { setSearchResults(null); return }
    setSearching(true)
    clearTimeout(timer.current)
    timer.current = setTimeout(async () => {
      const { data: results } = await supabase
        .from('messages')
        .select('*')
        .or(`name.ilike.%${search}%,email.ilike.%${search}%,subject.ilike.%${search}%`)
        .order('created_at', { ascending: false })
      setSearchResults(results || [])
      setSearching(false)
    }, 300)
    return () => clearTimeout(timer.current)
  }, [search])

  const items = searchResults !== null ? searchResults : data.messages

  function handleSelect(m) {
    if (!m.read) toggleMessageRead(m.id)
    setSelected(m)
  }

  if (selected) {
    return (
      <div className="space-y-6 max-w-2xl">
        <button onClick={() => setSelected(null)} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Volver a mensajes
        </button>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-violet-500 flex items-center justify-center text-white text-sm font-bold shrink-0">
                {selected.name[0]}
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">{selected.name}</h2>
                <p className="text-sm text-gray-500">{selected.email}</p>
              </div>
            </div>
            <button
              onClick={() => { if (confirm('¿Eliminar mensaje?')) { deleteMessage(selected.id); setSelected(null) } }}
              className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-5">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <User className="w-5 h-5 text-blue-500 shrink-0" />
                <div>
                  <p className="text-xs text-gray-500">Nombre</p>
                  <p className="text-sm font-medium text-gray-900">{selected.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <Mail className="w-5 h-5 text-violet-500 shrink-0" />
                <div>
                  <p className="text-xs text-gray-500">Email</p>
                  <p className="text-sm font-medium text-gray-900">{selected.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <Calendar className="w-5 h-5 text-amber-500 shrink-0" />
                <div>
                  <p className="text-xs text-gray-500">Fecha</p>
                  <p className="text-sm font-medium text-gray-900">{selected.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <span className={`w-5 h-5 flex items-center justify-center text-xs font-bold rounded-full shrink-0 ${selected.read ? 'bg-gray-200 text-gray-500' : 'bg-blue-100 text-blue-600'}`}>
                  {selected.read ? 'L' : 'N'}
                </span>
                <div>
                  <p className="text-xs text-gray-500">Estado</p>
                  <p className="text-sm font-medium text-gray-900">{selected.read ? 'Leído' : 'No leído'}</p>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-5">
              <h3 className="font-semibold text-gray-900 mb-2">Asunto</h3>
              <p className="text-sm text-gray-700 bg-gray-50 rounded-xl p-4">{selected.subject}</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mensajes</h1>
          <p className="text-gray-500 text-sm mt-1">{unread > 0 ? `${unread} sin leer` : 'Todos leídos'}</p>
        </div>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input type="text" placeholder="Buscar mensajes..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
        {searching && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-blue-500 font-medium">Buscando...</span>}
      </div>

      <div className="space-y-2">
        {items.length === 0 && searchResults ? (
          <div className="text-center py-12 text-sm text-gray-400">No se encontraron mensajes</div>
        ) : items.map((m, i) => (
          <ScrollReveal key={m.id} delay={i * 0.03}>
            <div
              className={`bg-white rounded-xl shadow-sm border p-4 hover:shadow-md transition-all cursor-pointer ${m.read ? 'border-gray-100' : 'border-blue-200 bg-blue-50/30'}`}
              onClick={() => handleSelect(m)}
            >
              <div className="flex items-start gap-4">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-400 to-violet-500 flex items-center justify-center text-white text-sm font-bold shrink-0">
                  {m.name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="font-medium truncate text-gray-900">{m.name}</span>
                      {!m.read && <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />}
                    </div>
                    <span className="text-xs text-gray-400 shrink-0">{m.date}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-0.5">{m.subject}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Mail className="w-3 h-3 text-gray-400" />
                    <span className="text-xs text-gray-400">{m.email}</span>
                  </div>
                </div>
                <button
                  onClick={e => { e.stopPropagation(); if (confirm('¿Eliminar mensaje?')) deleteMessage(m.id) }}
                  className="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors shrink-0"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </div>
  )
}
