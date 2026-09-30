import { useState, useEffect, useRef } from 'react'
import { Search, Plus, ExternalLink, Edit2, Trash2 } from 'lucide-react'
import ScrollReveal from '../../components/common/ScrollReveal'
import { useDashboard } from '../../context/DashboardContext'
import { supabase } from '../../lib/supabase'

const statusConfig = {
  pending: { label: 'Pendiente', class: 'bg-gray-100 text-gray-700' },
  design: { label: 'En diseño', class: 'bg-blue-100 text-blue-700' },
  review: { label: 'En revisión', class: 'bg-amber-100 text-amber-700' },
  published: { label: 'Publicado', class: 'bg-emerald-100 text-emerald-700' },
}

export default function Websites() {
  const { data, addWebsite, updateWebsite, deleteWebsite } = useDashboard()
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [searchResults, setSearchResults] = useState(null)
  const [searching, setSearching] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ client: '', project: '', type: '', status: 'pending' })
  const timer = useRef(null)

  useEffect(() => {
    if (!search.trim()) { setSearchResults(null); return }
    setSearching(true)
    clearTimeout(timer.current)
    timer.current = setTimeout(async () => {
      const { data: results } = await supabase
        .from('websites')
        .select('*')
        .or(`client.ilike.%${search}%,project.ilike.%${search}%`)
        .order('created_at', { ascending: false })
      setSearchResults(results || [])
      setSearching(false)
    }, 300)
    return () => clearTimeout(timer.current)
  }, [search])

  const items = (searchResults !== null ? searchResults : data.websites).filter(w =>
    filter === 'all' || w.status === filter
  )

  function openCreate() {
    setEditing(null)
    setForm({ client: '', project: '', type: '', status: 'pending' })
    setShowModal(true)
  }

  function openEdit(website) {
    setEditing(website)
    setForm({ client: website.client, project: website.project, type: website.type, status: website.status })
    setShowModal(true)
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (editing) {
      updateWebsite(editing.id, form)
    } else {
      addWebsite(form)
    }
    setShowModal(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Webs</h1>
          <p className="text-gray-500 text-sm mt-1">{data.websites.length} sitios web</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors text-sm font-medium">
          <Plus className="w-4 h-4" /> Nueva web
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" placeholder="Buscar webs..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
          {searching && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-blue-500 font-medium">Buscando...</span>}
        </div>
        <div className="flex gap-1.5">
          {['all', 'pending', 'design', 'review', 'published'].map(s => (
            <button key={s} onClick={() => setFilter(s)} className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${filter === s ? 'bg-blue-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
              {s === 'all' ? 'Todas' : statusConfig[s].label}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 text-xs uppercase tracking-wider bg-gray-50">
                <th className="p-4 font-medium">Cliente</th>
                <th className="p-4 font-medium">Proyecto</th>
                <th className="p-4 font-medium">Tipo</th>
                <th className="p-4 font-medium">Estado</th>
                <th className="p-4 font-medium">Creada</th>
                <th className="p-4 font-medium">Actualizada</th>
                <th className="p-4 font-medium text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {items.length === 0 && searchResults ? (
                <tr><td colSpan={7} className="p-8 text-center text-sm text-gray-400">No se encontraron webs</td></tr>
              ) : items.map((w, i) => (
                <ScrollReveal key={w.id} delay={i * 0.03} as="tr" className="hover:bg-gray-50 transition-colors group">
                  <td className="p-4 font-medium text-gray-900">{w.client}</td>
                  <td className="p-4 text-gray-600">{w.project}</td>
                  <td className="p-4 text-gray-500">{w.type}</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-medium ${statusConfig[w.status].class}`}>{statusConfig[w.status].label}</span>
                  </td>
                  <td className="p-4 text-gray-500">{w.created}</td>
                  <td className="p-4 text-gray-500">{w.updated}</td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><ExternalLink className="w-3.5 h-3.5" /></button>
                      <button onClick={() => openEdit(w)} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><Edit2 className="w-3.5 h-3.5" /></button>
                      <button onClick={() => { if (confirm('¿Eliminar esta web?')) deleteWebsite(w.id, w.project) }} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </td>
                </ScrollReveal>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md mx-4" onClick={e => e.stopPropagation()}>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">{editing ? 'Editar web' : 'Nueva web'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cliente</label>
                <input required value={form.client} onChange={e => setForm({ ...form, client: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Proyecto</label>
                <input required value={form.project} onChange={e => setForm({ ...form, project: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                  <input required value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                  <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500">
                    <option value="pending">Pendiente</option>
                    <option value="design">En diseño</option>
                    <option value="review">En revisión</option>
                    <option value="published">Publicado</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors">Cancelar</button>
                <button type="submit" className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors">{editing ? 'Guardar cambios' : 'Crear web'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
