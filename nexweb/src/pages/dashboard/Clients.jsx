import { useState, useEffect, useRef } from 'react'
import { Search, Plus, Edit2, Trash2, ArrowLeft, User, Mail, Calendar, Globe, Phone, ExternalLink } from 'lucide-react'
import ScrollReveal from '../../components/common/ScrollReveal'
import { useDashboard } from '../../context/DashboardContext'
import { supabase } from '../../lib/supabase'

function DetailRow({ icon: Icon, label, value, color }) {
  return (
    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
      <Icon className={`w-5 h-5 ${color} shrink-0`} />
      <div>
        <p className="text-xs text-gray-500">{label}</p>
        <p className="text-sm font-medium text-gray-900">{value || '-'}</p>
      </div>
    </div>
  )
}

export default function Clients() {
  const { data, addClient, updateClient, deleteClient } = useDashboard()
  const [search, setSearch] = useState('')
  const [searchResults, setSearchResults] = useState(null)
  const [searching, setSearching] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ name: '', email: '', phone: '', webs: 1, status: 'active' })
  const [selected, setSelected] = useState(null)
  const timer = useRef(null)

  useEffect(() => {
    if (!search.trim()) { setSearchResults(null); return }
    setSearching(true)
    clearTimeout(timer.current)
    timer.current = setTimeout(async () => {
      const { data: results } = await supabase
        .from('clients')
        .select('*')
        .or(`name.ilike.%${search}%,email.ilike.%${search}%`)
        .order('created_at', { ascending: false })
      setSearchResults(results || [])
      setSearching(false)
    }, 300)
    return () => clearTimeout(timer.current)
  }, [search])

  const items = searchResults !== null ? searchResults : data.clients

  const activeClients = data.clients.filter(c => c.status === 'active').length
  const totalWebs = data.clients.reduce((s, c) => s + (c.webs || 0), 0)

  function openCreate() {
    setEditing(null)
    setForm({ name: '', email: '', phone: '', webs: 1, status: 'active' })
    setShowModal(true)
  }

  function openEdit(client) {
    setEditing(client)
    setForm({ name: client.name, email: client.email, phone: client.phone, webs: client.webs, status: client.status })
    setShowModal(true)
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (editing) {
      updateClient(editing.id, form)
    } else {
      addClient({ ...form, date: new Date().toLocaleDateString('es-ES') })
    }
    setShowModal(false)
  }

  const clientWebsites = selected
    ? data.websites.filter(w => w.client.toLowerCase() === selected.name.toLowerCase())
    : []

  const clientProjects = selected
    ? data.projects.filter(p => p.client.toLowerCase() === selected.name.toLowerCase())
    : []

  if (selected) {
    return (
      <div className="space-y-6">
        <button onClick={() => setSelected(null)} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Volver a clientes
        </button>

        <div className="grid lg:grid-cols-5 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-violet-500 flex items-center justify-center text-white text-sm font-bold">
                    {selected.name[0]}
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">{selected.name}</h2>
                    <span className={`px-2 py-0.5 rounded-lg text-xs font-medium ${selected.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
                      {selected.status === 'active' ? 'Activo' : 'Inactivo'}
                    </span>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => { openEdit(selected); setSelected(null) }} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><Edit2 className="w-4 h-4" /></button>
                  <button onClick={() => { if (confirm('¿Eliminar este cliente?')) { deleteClient(selected.id, selected.name); setSelected(null) } }} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
              <div className="p-5 space-y-3">
                <DetailRow icon={User} label="Nombre" value={selected.name} color="text-blue-500" />
                <DetailRow icon={Mail} label="Email" value={selected.email} color="text-violet-500" />
                <DetailRow icon={Phone} label="Teléfono" value={selected.phone} color="text-green-500" />
                <DetailRow icon={Globe} label="Webs contratadas" value={selected.webs} color="text-cyan-500" />
                <DetailRow icon={Calendar} label="Fecha de registro" value={selected.date} color="text-amber-500" />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <h3 className="font-semibold text-gray-900 text-sm mb-3">Acciones rápidas</h3>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => { updateClient(selected.id, { status: selected.status === 'active' ? 'inactive' : 'active' }); setSelected({ ...selected, status: selected.status === 'active' ? 'inactive' : 'active' }) }}
                  className="w-full px-4 py-2.5 rounded-xl text-sm font-medium transition-colors bg-gray-50 text-gray-700 hover:bg-gray-100"
                >
                  {selected.status === 'active' ? 'Desactivar cliente' : 'Activar cliente'}
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3 space-y-4">
            {clientWebsites.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 border-b border-gray-100">
                  <h3 className="font-semibold text-gray-900">Webs de {selected.name}</h3>
                </div>
                <div className="divide-y divide-gray-50">
                  {clientWebsites.map(w => (
                    <div key={w.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{w.project}</p>
                        <p className="text-xs text-gray-500">{w.type}</p>
                      </div>
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-medium ${
                        w.status === 'published' ? 'bg-emerald-100 text-emerald-700' :
                        w.status === 'review' ? 'bg-amber-100 text-amber-700' :
                        w.status === 'design' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {w.status === 'published' ? 'Publicada' : w.status === 'review' ? 'Revisión' : w.status === 'design' ? 'Diseño' : 'Pendiente'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {clientProjects.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 border-b border-gray-100">
                  <h3 className="font-semibold text-gray-900">Proyectos de {selected.name}</h3>
                </div>
                <div className="divide-y divide-gray-50">
                  {clientProjects.map(p => (
                    <div key={p.id} className="p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-medium text-gray-900">{p.name}</p>
                        <span className="text-xs text-gray-500">{p.deadline}</span>
                      </div>
                      <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${p.progress === 100 ? 'bg-emerald-500' : 'bg-blue-500'}`} style={{ width: `${p.progress}%` }} />
                      </div>
                      <p className="text-xs text-gray-400 mt-1">{p.progress}% completado</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {clientWebsites.length === 0 && clientProjects.length === 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
                <Globe className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-400">Este cliente aún no tiene webs ni proyectos</p>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Clientes</h1>
          <p className="text-gray-500 text-sm mt-1">{data.clients.length} clientes registrados</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors text-sm font-medium">
          <Plus className="w-4 h-4" /> Nuevo cliente
        </button>
      </div>

      <div className="grid sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <p className="text-2xl font-bold text-gray-900">{data.clients.length}</p>
          <p className="text-xs text-gray-500">Total clientes</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <p className="text-2xl font-bold text-emerald-600">{activeClients}</p>
          <p className="text-xs text-gray-500">Activos</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <p className="text-2xl font-bold text-gray-400">{data.clients.length - activeClients}</p>
          <p className="text-xs text-gray-500">Inactivos</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <p className="text-2xl font-bold text-blue-600">{totalWebs}</p>
          <p className="text-xs text-gray-500">Webs totales</p>
        </div>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input type="text" placeholder="Buscar clientes..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
        {searching && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-blue-500 font-medium">Buscando...</span>}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 text-xs uppercase tracking-wider bg-gray-50">
                <th className="p-4 font-medium w-[25%]">Cliente</th>
                <th className="p-4 font-medium w-[22%]">Email</th>
                <th className="p-4 font-medium w-[15%]">Teléfono</th>
                <th className="p-4 font-medium text-center w-[10%]">Webs</th>
                <th className="p-4 font-medium w-[12%]">Estado</th>
                <th className="p-4 font-medium w-[12%]">Fecha</th>
                <th className="p-4 font-medium text-right w-[4%]">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {items.length === 0 && searchResults ? (
                <tr><td colSpan={7} className="p-12 text-center text-sm text-gray-400">No se encontraron clientes</td></tr>
              ) : items.map((c, i) => (
                <ScrollReveal key={c.id} delay={i * 0.03} as="tr" className="hover:bg-gray-50 transition-colors cursor-pointer group" onClick={() => setSelected(c)}>
                  <td className="p-4 font-medium text-gray-900 truncate">{c.name}</td>
                  <td className="p-4 text-gray-600 truncate">{c.email}</td>
                  <td className="p-4 text-gray-500 whitespace-nowrap">{c.phone || '-'}</td>
                  <td className="p-4 text-center">
                    <span className="inline-flex items-center justify-center w-7 h-7 bg-blue-50 text-blue-600 rounded-lg text-xs font-semibold">{c.webs}</span>
                  </td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap ${c.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
                      {c.status === 'active' ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="p-4 text-gray-500 whitespace-nowrap">{c.date}</td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity" onClick={e => e.stopPropagation()}>
                      <button onClick={() => openEdit(c)} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><Edit2 className="w-3.5 h-3.5" /></button>
                      <button onClick={() => { if (confirm('¿Eliminar este cliente?')) deleteClient(c.id, c.name) }} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
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
            <h2 className="text-lg font-semibold text-gray-900 mb-4">{editing ? 'Editar cliente' : 'Nuevo cliente'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                <input required value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Webs</label>
                  <input type="number" min="1" value={form.webs} onChange={e => setForm({ ...form, webs: parseInt(e.target.value) || 0 })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                  <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500">
                    <option value="active">Activo</option>
                    <option value="inactive">Inactivo</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors">Cancelar</button>
                <button type="submit" className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors">{editing ? 'Guardar cambios' : 'Crear cliente'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
