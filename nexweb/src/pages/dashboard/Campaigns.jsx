import { useState } from 'react'
import {
  Plus, Send, Play, Pause, Check, X, Edit2, Trash2,
  Mail, Users, Eye, MessageSquare, Loader,
  Search,
} from 'lucide-react'
import ScrollReveal from '../../components/common/ScrollReveal'
import { useDashboard } from '../../context/DashboardContext'

export default function Campaigns() {
  const { data, addCampaign, updateCampaign, deleteCampaign, addLeadsToCampaign, markCampaignSent } = useDashboard()
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ name: '', subject: '', content: '', status: 'draft' })
  const [showSendModal, setShowSendModal] = useState(null)
  const [selectedLeadIds, setSelectedLeadIds] = useState(new Set())
  const [sending, setSending] = useState(false)
  const [search, setSearch] = useState('')

  const campaigns = data.campaigns || []
  const leads = data.leads || []
  const campaignLeads = data.campaignLeads || []

  const filteredCampaigns = campaigns.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase())
  )

  function openCreate() {
    setEditing(null)
    setForm({ name: '', subject: '', content: '', status: 'draft' })
    setShowModal(true)
  }

  function openEdit(campaign) {
    setEditing(campaign)
    setForm({ name: campaign.name, subject: campaign.subject, content: campaign.content, status: campaign.status })
    setShowModal(true)
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (editing) {
      updateCampaign(editing.id, form)
    } else {
      addCampaign(form)
    }
    setShowModal(false)
  }

  function openSend(campaign) {
    setShowSendModal(campaign)
    setSelectedLeadIds(new Set())
  }

  async function handleSend() {
    if (!showSendModal || selectedLeadIds.size === 0) return
    setSending(true)
    await addLeadsToCampaign(showSendModal.id, Array.from(selectedLeadIds))
    await markCampaignSent(showSendModal.id, Array.from(selectedLeadIds))
    setSending(false)
    setShowSendModal(null)
  }

  function toggleLead(leadId) {
    setSelectedLeadIds(prev => {
      const next = new Set(prev)
      if (next.has(leadId)) next.delete(leadId)
      else next.add(leadId)
      return next
    })
  }

  function getCampaignLeadCount(campaignId) {
    return campaignLeads.filter(cl => cl.campaign_id === campaignId).length
  }

  function getCampaignSentCount(campaignId) {
    return campaignLeads.filter(cl => cl.campaign_id === campaignId && cl.sent).length
  }

  function statusIcon(status) {
    switch (status) {
      case 'active': return <Play className="w-3.5 h-3.5" />
      case 'paused': return <Pause className="w-3.5 h-3.5" />
      case 'completed': return <Check className="w-3.5 h-3.5" />
      default: return null
    }
  }

  const statusColors = {
    draft: { bg: 'bg-gray-100', text: 'text-gray-600' },
    active: { bg: 'bg-emerald-100', text: 'text-emerald-700' },
    paused: { bg: 'bg-amber-100', text: 'text-amber-700' },
    completed: { bg: 'bg-blue-100', text: 'text-blue-700' },
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Campañas de Email</h1>
          <p className="text-gray-500 text-sm mt-1">{campaigns.length} campañas creadas</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors text-sm font-medium">
          <Plus className="w-4 h-4" /> Nueva campaña
        </button>
      </div>

      <div className="grid sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <p className="text-2xl font-bold text-gray-900">{campaigns.length}</p>
          <p className="text-xs text-gray-500">Total campañas</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <p className="text-2xl font-bold text-emerald-600">{campaigns.filter(c => c.status === 'active').length}</p>
          <p className="text-xs text-gray-500">Activas</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <p className="text-2xl font-bold text-blue-600">{leads.length}</p>
          <p className="text-xs text-gray-500">Leads disponibles</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <p className="text-2xl font-bold text-violet-600">{campaignLeads.filter(cl => cl.sent).length}</p>
          <p className="text-xs text-gray-500">Emails enviados</p>
        </div>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input type="text" placeholder="Buscar campañas..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {filteredCampaigns.length === 0 ? (
          <div className="md:col-span-2 flex flex-col items-center justify-center py-20 text-gray-400 gap-3 bg-white rounded-xl border border-gray-100">
            <Mail className="w-12 h-12 text-gray-200" />
            <p className="text-sm">No hay campañas todavía. Crea tu primera campaña de email.</p>
          </div>
        ) : filteredCampaigns.map((c, i) => {
          const sc = statusColors[c.status] || statusColors.draft
          const leadCount = getCampaignLeadCount(c.id)
          const sentCount = getCampaignSentCount(c.id)
          return (
            <ScrollReveal key={c.id} delay={i * 0.03}>
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all group">
                <div className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-9 h-9 bg-gradient-to-br from-violet-400 to-pink-500 rounded-xl flex items-center justify-center">
                        <Mail className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{c.name}</h3>
                        <p className="text-xs text-gray-400 truncate max-w-[250px]">{c.subject}</p>
                      </div>
                    </div>
                    <span className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium ${sc.bg} ${sc.text}`}>
                      {statusIcon(c.status)} {c.status}
                    </span>
                  </div>

                  {c.content && (
                    <p className="text-sm text-gray-500 line-clamp-2 mb-3">{c.content}</p>
                  )}

                  <div className="flex items-center gap-4 text-xs text-gray-400">
                    <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {leadCount} leads</span>
                    <span className="flex items-center gap-1"><Send className="w-3.5 h-3.5" /> {sentCount} enviados</span>
                    <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" /> {c.open_count || 0} aperturas</span>
                    <span className="flex items-center gap-1"><MessageSquare className="w-3.5 h-3.5" /> {c.reply_count || 0} respuestas</span>
                  </div>
                </div>
                <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                  <div className="flex gap-1.5">
                    {c.status === 'draft' && (
                      <button
                        onClick={() => openSend(c)}
                        className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-xs font-medium"
                      >
                        <Send className="w-3 h-3" /> Enviar
                      </button>
                    )}
                    {c.status === 'active' && (
                      <button
                        onClick={() => updateCampaign(c.id, { status: 'paused' })}
                        className="flex items-center gap-1 px-3 py-1.5 bg-amber-100 text-amber-700 rounded-lg hover:bg-amber-200 transition-colors text-xs font-medium"
                      >
                        <Pause className="w-3 h-3" /> Pausar
                      </button>
                    )}
                    {c.status === 'paused' && (
                      <button
                        onClick={() => updateCampaign(c.id, { status: 'active' })}
                        className="flex items-center gap-1 px-3 py-1.5 bg-emerald-100 text-emerald-700 rounded-lg hover:bg-emerald-200 transition-colors text-xs font-medium"
                      >
                        <Play className="w-3 h-3" /> Reanudar
                      </button>
                    )}
                    {c.status !== 'completed' && (
                      <button
                        onClick={() => updateCampaign(c.id, { status: 'completed' })}
                        className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors text-xs font-medium"
                      >
                        <Check className="w-3 h-3" /> Completar
                      </button>
                    )}
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => openEdit(c)} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><Edit2 className="w-3.5 h-3.5" /></button>
                    <button onClick={() => { if (confirm('¿Eliminar esta campaña?')) deleteCampaign(c.id, c.name) }} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          )
        })}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-lg mx-4" onClick={e => e.stopPropagation()}>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">{editing ? 'Editar campaña' : 'Nueva campaña'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre de la campaña</label>
                <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" placeholder="Ej: Oferta verano 2025" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Asunto del email</label>
                <input required value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" placeholder="Ej: Descubre cómo podemos ayudarte" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contenido del email</label>
                <textarea
                  required
                  value={form.content}
                  onChange={e => setForm({ ...form, content: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none font-mono"
                  rows={8}
                  placeholder="Escribe el contenido del email aquí... Usa {nombre} para personalizar"
                />
                <p className="text-xs text-gray-400 mt-1">Usa {'{nombre}'} para personalizar con el nombre del lead</p>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors">Cancelar</button>
                <button type="submit" className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors">{editing ? 'Guardar cambios' : 'Crear campaña'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showSendModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm" onClick={() => setShowSendModal(null)}>
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-2xl mx-4 max-h-[80vh] flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Enviar campaña</h2>
                <p className="text-sm text-gray-500">Selecciona los leads para "{showSendModal.name}"</p>
              </div>
              <button onClick={() => setShowSendModal(null)} className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"><X className="w-4 h-4" /></button>
            </div>

            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input type="text" placeholder="Filtrar leads..." onChange={e => {
                const q = e.target.value.toLowerCase()
                document.querySelectorAll('.lead-row').forEach(el => {
                  el.style.display = el.textContent.toLowerCase().includes(q) ? '' : 'none'
                })
              }} className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
            </div>

            <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
              <span>{leads.length} leads disponibles</span>
              <span className="font-medium text-blue-600">{selectedLeadIds.size} seleccionados</span>
            </div>

            <div className="flex-1 overflow-y-auto space-y-1.5 min-h-0">
              {leads.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <Users className="w-8 h-8 mx-auto mb-2" />
                  <p className="text-sm">No hay leads disponibles. Primero añade leads desde FinderLead.</p>
                </div>
              ) : leads.map(l => (
                <div
                  key={l.id}
                  className={`lead-row flex items-center justify-between p-3 rounded-xl cursor-pointer transition-colors ${
                    selectedLeadIds.has(l.id) ? 'bg-blue-50 border border-blue-200' : 'hover:bg-gray-50 border border-transparent'
                  }`}
                  onClick={() => toggleLead(l.id)}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                      selectedLeadIds.has(l.id) ? 'bg-blue-600 border-blue-600' : 'border-gray-300'
                    }`}>
                      {selectedLeadIds.has(l.id) && <Check className="w-3 h-3 text-white" />}
                    </div>
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-400 to-violet-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
                      {l.business_name?.[0]}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{l.business_name}</p>
                      <p className="text-xs text-gray-400 truncate">{l.email || l.phone || 'Sin contacto'}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-xs font-medium shrink-0 ml-2 ${
                    l.status === 'new' ? 'bg-blue-100 text-blue-600' :
                    l.status === 'contacted' ? 'bg-amber-100 text-amber-600' :
                    l.status === 'qualified' ? 'bg-emerald-100 text-emerald-600' :
                    l.status === 'converted' ? 'bg-violet-100 text-violet-600' : 'bg-gray-100 text-gray-500'
                  }`}>
                    {l.status}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-4">
              <button
                onClick={() => {
                  if (selectedLeadIds.size === leads.length) setSelectedLeadIds(new Set())
                  else setSelectedLeadIds(new Set(leads.map(l => l.id)))
                }}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                {selectedLeadIds.size === leads.length ? 'Deseleccionar todos' : 'Seleccionar todos'}
              </button>
              <div className="flex gap-3">
                <button onClick={() => setShowSendModal(null)} className="px-4 py-2.5 border border-gray-200 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors">Cancelar</button>
                <button
                  onClick={handleSend}
                  disabled={selectedLeadIds.size === 0 || sending}
                  className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
                >
                  {sending ? <Loader className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  {sending ? 'Enviando...' : `Enviar a ${selectedLeadIds.size} leads`}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
