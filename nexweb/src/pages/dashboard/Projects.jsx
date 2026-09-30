import { useState } from 'react'
import { Search, X, ChevronLeft, ChevronRight, Edit2, Trash2, Calendar, User, FileType, Globe, ExternalLink } from 'lucide-react'
import ScrollReveal from '../../components/common/ScrollReveal'
import { useDashboard } from '../../context/DashboardContext'

const statusList = [
  { key: 'pending', label: 'Pendiente', class: 'bg-gray-100 text-gray-700', dot: 'bg-gray-400' },
  { key: 'design', label: 'En diseño', class: 'bg-blue-100 text-blue-700', dot: 'bg-blue-500' },
  { key: 'review', label: 'En revisión', class: 'bg-amber-100 text-amber-700', dot: 'bg-amber-500' },
  { key: 'published', label: 'Publicado', class: 'bg-emerald-100 text-emerald-700', dot: 'bg-emerald-500' },
]

const statusMap = Object.fromEntries(statusList.map(s => [s.key, s]))

const typeImages = {
  ecommerce: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=250&fit=crop',
  landing: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=250&fit=crop',
  blog: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=400&h=250&fit=crop',
  portfolio: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=400&h=250&fit=crop',
  corporate: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&h=250&fit=crop',
}

const defaultImage = 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=250&fit=crop'

export default function Projects() {
  const { data, updateProject, deleteProject, addProjectLog, deleteProjectLog } = useDashboard()
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState(null)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ name: '', client: '', type: '', status: 'design', deadline: '', progress: 0 })
  const [showModal, setShowModal] = useState(false)
  const [logInput, setLogInput] = useState('')

  const filtered = data.projects.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.client.toLowerCase().includes(search.toLowerCase())
  )

  function openCreate() {
    setEditing(null)
    setForm({ name: '', client: '', type: '', status: 'design', deadline: '', progress: 0 })
    setShowModal(true)
  }

  function openEdit(project) {
    setEditing(project)
    setForm({ name: project.name, client: project.client, type: project.type, status: project.status, deadline: project.deadline, progress: project.progress })
    setShowModal(true)
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (editing) {
      updateProject(editing.id, form)
    }
    setShowModal(false)
    if (selected && editing?.id === selected.id) {
      setSelected({ ...selected, ...form })
    }
  }

  function cycleStatus(project, dir) {
    const idx = statusList.findIndex(s => s.key === project.status)
    const next = statusList[Math.min(Math.max(idx + dir, 0), statusList.length - 1)]
    if (next.key !== project.status) {
      updateProject(project.id, { status: next.key })
      if (selected?.id === project.id) setSelected({ ...project, status: next.key })
    }
  }

  function adjustProgress(project, delta) {
    const next = Math.min(Math.max(project.progress + delta, 0), 100)
    updateProject(project.id, { progress: next })
    if (selected?.id === project.id) setSelected({ ...project, progress: next })
  }

  function handleDelete(project) {
    if (confirm('¿Eliminar este proyecto?')) {
      deleteProject(project.id, project.name)
      if (selected?.id === project.id) setSelected(null)
    }
  }

  const relatedWebsite = selected
    ? data.websites.find(w => w.project === selected.name || w.client === selected.client)
    : null

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Proyectos</h1>
          <p className="text-gray-500 text-sm mt-1">{data.projects.length} proyectos en total</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors text-sm font-medium">
          + Nuevo proyecto
        </button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input type="text" placeholder="Buscar proyectos..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((p, i) => {
          const st = statusMap[p.status]
          return (
            <ScrollReveal key={p.id} delay={i * 0.03}>
              <div
                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all group cursor-pointer"
                onClick={() => setSelected(p)}
              >
                <div className="h-36 bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden">
                  <img
                    src={typeImages[p.type] || defaultImage}
                    alt=""
                    className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  <span className={`absolute top-3 right-3 px-2.5 py-1 rounded-lg text-xs font-medium ${st.class}`}>{st.label}</span>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 truncate">{p.name}</h3>
                  <p className="text-sm text-gray-500 mt-0.5 truncate">{p.client}</p>
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-gray-400">Progreso</span>
                      <span className="font-medium text-gray-600">{p.progress}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full transition-all duration-700 ${p.progress === 100 ? 'bg-emerald-500' : 'bg-blue-500'}`} style={{ width: `${p.progress}%` }} />
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50">
                    <span className="text-xs text-gray-400">{p.deadline || 'Sin fecha'}</span>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          )
        })}
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-start justify-center overflow-y-auto py-8" onClick={() => setSelected(null)}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl mx-4 overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="relative h-52 bg-gradient-to-br from-gray-100 to-gray-200">
              <img
                src={typeImages[selected.type] || defaultImage}
                alt=""
                className="w-full h-full object-cover opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              <div className="absolute bottom-4 left-5 right-5">
                <h2 className="text-xl font-bold text-white">{selected.name}</h2>
                <p className="text-sm text-white/80">{selected.client}</p>
              </div>
              <button onClick={() => setSelected(null)} className="absolute top-3 right-3 p-1.5 bg-black/30 hover:bg-black/50 rounded-xl text-white transition-colors">
                <X className="w-4 h-4" />
              </button>
              <div className="absolute top-3 left-3 flex gap-2">
                <button onClick={() => openEdit(selected)} className="p-1.5 bg-white/90 hover:bg-white rounded-xl text-gray-700 transition-colors shadow-sm">
                  <Edit2 className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(selected)} className="p-1.5 bg-white/90 hover:bg-white rounded-xl text-red-600 transition-colors shadow-sm">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="p-5 space-y-5">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-2 text-gray-400 mb-1">
                    <FileType className="w-3.5 h-3.5" />
                    <span className="text-xs">Tipo</span>
                  </div>
                  <p className="text-sm font-medium text-gray-900 capitalize">{selected.type || 'General'}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-2 text-gray-400 mb-1">
                    <User className="w-3.5 h-3.5" />
                    <span className="text-xs">Cliente</span>
                  </div>
                  <p className="text-sm font-medium text-gray-900 truncate">{selected.client}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-2 text-gray-400 mb-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span className="text-xs">Vence</span>
                  </div>
                  <p className="text-sm font-medium text-gray-900">{selected.deadline || '—'}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-2 text-gray-400 mb-1">
                    <Globe className="w-3.5 h-3.5" />
                    <span className="text-xs">Web</span>
                  </div>
                  <p className="text-sm font-medium text-gray-900">{relatedWebsite ? 'Vinculada' : 'Sin web'}</p>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Estado</span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => cycleStatus(selected, -1)}
                      disabled={selected.status === 'pending'}
                      className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    {statusList.map(s => (
                      <button
                        key={s.key}
                        onClick={() => {
                          if (s.key !== selected.status) {
                            updateProject(selected.id, { status: s.key })
                            setSelected({ ...selected, status: s.key })
                          }
                        }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                          selected.status === s.key
                            ? `${s.class} ring-2 ring-offset-1`
                            : 'bg-gray-50 text-gray-400 hover:bg-gray-100'
                        }`}
                      >
                        {s.label}
                      </button>
                    ))}
                    <button
                      onClick={() => cycleStatus(selected, 1)}
                      disabled={selected.status === 'published'}
                      className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Progreso</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => adjustProgress(selected, -10)}
                      disabled={selected.progress <= 0}
                      className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="text-sm font-semibold text-gray-900 min-w-[3ch] text-center">{selected.progress}%</span>
                    <button
                      onClick={() => adjustProgress(selected, 10)}
                      disabled={selected.progress >= 100}
                      className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${selected.progress === 100 ? 'bg-emerald-500' : 'bg-blue-500'}`}
                    style={{ width: `${selected.progress}%` }}
                  />
                </div>
              </div>

              {relatedWebsite && (
                <div className="p-4 bg-blue-50 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-blue-900">Web vinculada</p>
                      <p className="text-xs text-blue-600 mt-0.5">{relatedWebsite.project}</p>
                    </div>
                    <a href={relatedWebsite.url || '#'} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 font-medium">
                      Ver web <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                    Diario de trabajo
                    <span className="text-xs text-gray-400 font-normal">({data.projectLogs.filter(l => l.project_id === selected.id).length} anotaciones)</span>
                  </h3>
                </div>
                <div className="flex gap-2 mb-3">
                  <input
                    value={logInput}
                    onChange={e => setLogInput(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter' && logInput.trim()) {
                        addProjectLog(selected.id, logInput.trim())
                        setLogInput('')
                      }
                    }}
                    placeholder="¿Qué hiciste hoy? Ej: Maqueté el navbar..."
                    className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                  <button
                    onClick={() => {
                      if (logInput.trim()) {
                        addProjectLog(selected.id, logInput.trim())
                        setLogInput('')
                      }
                    }}
                    className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                  >
                    + Añadir
                  </button>
                </div>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {data.projectLogs.filter(l => l.project_id === selected.id).length === 0 ? (
                    <p className="text-sm text-gray-400 text-center py-4">No hay anotaciones todavía. Añade lo que vayas haciendo.</p>
                  ) : (
                    data.projectLogs
                      .filter(l => l.project_id === selected.id)
                      .map(log => {
                        const d = new Date(log.created_at)
                        const dateStr = d.toLocaleDateString('es', { day: 'numeric', month: 'short', year: 'numeric' })
                        const timeStr = d.toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' })
                        return (
                          <div key={log.id} className="p-3 bg-gray-50 rounded-xl group hover:bg-gray-100 transition-colors">
                            <div className="flex items-start justify-between gap-2">
                              <p className="text-sm text-gray-700 leading-relaxed">{log.message}</p>
                              <button
                                onClick={() => deleteProjectLog(log.id)}
                                className="p-1 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all shrink-0"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                            <p className="text-xs text-gray-400 mt-1">{dateStr} · {timeStr}</p>
                          </div>
                        )
                      })
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md mx-4" onClick={e => e.stopPropagation()}>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">{editing ? 'Editar proyecto' : 'Nuevo proyecto'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cliente</label>
                <input required value={form.client} onChange={e => setForm({ ...form, client: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                  <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500">
                    <option value="">General</option>
                    <option value="landing">Landing</option>
                    <option value="corporate">Corporativa</option>
                    <option value="ecommerce">E-commerce</option>
                    <option value="blog">Blog</option>
                    <option value="portfolio">Portfolio</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                  <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500">
                    {statusList.map(s => <option key={s.key} value={s.key}>{s.label}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Progreso (%)</label>
                  <input type="number" min={0} max={100} value={form.progress} onChange={e => setForm({ ...form, progress: Math.min(100, Math.max(0, Number(e.target.value))) })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fecha límite</label>
                  <input type="date" value={form.deadline} onChange={e => setForm({ ...form, deadline: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors text-sm font-medium">Guardar</button>
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2.5 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-colors text-sm font-medium">Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
