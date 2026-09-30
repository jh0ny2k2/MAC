import { useState } from 'react'
import { Search, CheckCircle, Phone, XCircle, ArrowLeft, Send, User, Mail, Calendar, DollarSign, Tag, MessageCircle } from 'lucide-react'
import ScrollReveal from '../../components/common/ScrollReveal'
import { useDashboard } from '../../context/DashboardContext'

const statusConfig = {
  new: { label: 'Nueva', Icon: null, class: 'bg-blue-100 text-blue-700' },
  contacted: { label: 'Contactado', Icon: Phone, class: 'bg-amber-100 text-amber-700' },
  converted: { label: 'Convertido', Icon: CheckCircle, class: 'bg-emerald-100 text-emerald-700' },
  lost: { label: 'Perdido', Icon: XCircle, class: 'bg-red-100 text-red-700' },
}

function StatusBadge({ status }) {
  const cfg = statusConfig[status]
  const Icon = cfg.Icon
  return (
    <span className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium ${cfg.class}`}>
      {Icon && <Icon className="w-3.5 h-3.5" />}
      {cfg.label}
    </span>
  )
}

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

function CardActions({ status, request, update }) {
  if (status === 'new') {
    return (
      <div className="flex gap-2 mt-4 pt-3 border-t border-gray-100" onClick={e => e.stopPropagation()}>
        <button onClick={(e) => { e.stopPropagation(); update(request.id, 'contacted') }} className="flex-1 px-3 py-1.5 bg-amber-50 text-amber-700 rounded-lg text-xs font-medium hover:bg-amber-100 transition-colors">Contactar</button>
        <button onClick={(e) => { e.stopPropagation(); update(request.id, 'converted') }} className="flex-1 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-medium hover:bg-emerald-100 transition-colors">Convertir</button>
        <button onClick={(e) => { e.stopPropagation(); update(request.id, 'lost') }} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"><XCircle className="w-4 h-4" /></button>
      </div>
    )
  }
  if (status === 'contacted') {
    return (
      <div className="flex gap-2 mt-4 pt-3 border-t border-gray-100" onClick={e => e.stopPropagation()}>
        <button onClick={(e) => { e.stopPropagation(); update(request.id, 'converted') }} className="flex-1 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-medium hover:bg-emerald-100 transition-colors">Marcar convertido</button>
        <button onClick={(e) => { e.stopPropagation(); update(request.id, 'lost') }} className="flex-1 px-3 py-1.5 bg-red-50 text-red-700 rounded-lg text-xs font-medium hover:bg-red-100 transition-colors">Perdido</button>
      </div>
    )
  }
  return null
}

export default function Requests() {
  const { data, updateRequestStatus, addReply } = useDashboard()
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [selected, setSelected] = useState(null)
  const [replyText, setReplyText] = useState('')
  const [sending, setSending] = useState(false)
  const [replyStatus, setReplyStatus] = useState('idle')

  const filtered = data.requests.filter(r => {
    const matchSearch = r.name.toLowerCase().includes(search.toLowerCase()) || r.type.toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === 'all' || r.status === filter
    return matchSearch && matchFilter
  })

  const chatMessages = selected
    ? data.conversations.filter(c => c.request_id === selected.id)
    : []

  async function handleSendReply() {
    if (!replyText.trim() || !selected || sending) return
    setSending(true)
    setReplyStatus('sending')
    try {
      const { data, error } = await addReply(selected.id, replyText.trim(), selected.email, selected.name)
      if (error) {
        setReplyStatus('error')
      } else {
        setReplyStatus('sent')
        setReplyText('')
      }
    } catch (err) {
      setReplyStatus('error')
    }
    setSending(false)
    setTimeout(() => setReplyStatus('idle'), 4000)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Solicitudes</h1>
        <p className="text-gray-500 text-sm mt-1">{data.requests.length} solicitudes recibidas</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" placeholder="Buscar solicitudes..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
        </div>
        <div className="flex gap-1.5">
          {['all', 'new', 'contacted', 'converted', 'lost'].map(s => (
            <button key={s} onClick={() => setFilter(s)} className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${filter === s ? 'bg-blue-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
              {s === 'all' ? 'Todas' : statusConfig[s].label}
            </button>
          ))}
        </div>
      </div>

      {selected ? (
        <div>
          <button onClick={() => setSelected(null)} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Volver a solicitudes
          </button>

          <div className="grid lg:grid-cols-5 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">{selected.name}</h2>
                    <p className="text-xs text-gray-500 mt-0.5">{selected.type}</p>
                  </div>
                  <StatusBadge status={selected.status} />
                </div>
                <div className="p-5 space-y-3">
                  <DetailRow icon={User} label="Nombre" value={selected.name} color="text-blue-500" />
                  <DetailRow icon={Mail} label="Email" value={selected.email} color="text-violet-500" />
                  <DetailRow icon={Tag} label="Tipo de proyecto" value={selected.type} color="text-violet-500" />
                  <DetailRow icon={DollarSign} label="Presupuesto" value={selected.budget} color="text-emerald-500" />
                  <DetailRow icon={Calendar} label="Fecha" value={selected.date} color="text-amber-500" />
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                <h3 className="font-semibold text-gray-900 text-sm mb-3">Acciones</h3>
                <div className="flex flex-col gap-2">
                  {selected.status === 'new' && (
                    <>
                      <button onClick={() => { updateRequestStatus(selected.id, 'contacted'); setSelected({ ...selected, status: 'contacted' }) }} className="w-full px-4 py-2.5 bg-amber-50 text-amber-700 rounded-xl text-sm font-medium hover:bg-amber-100 transition-colors">Marcar como contactado</button>
                      <button onClick={() => { updateRequestStatus(selected.id, 'converted'); setSelected({ ...selected, status: 'converted' }) }} className="w-full px-4 py-2.5 bg-emerald-50 text-emerald-700 rounded-xl text-sm font-medium hover:bg-emerald-100 transition-colors">Marcar convertido</button>
                      <button onClick={() => { updateRequestStatus(selected.id, 'lost'); setSelected(null) }} className="w-full px-4 py-2.5 bg-red-50 text-red-700 rounded-xl text-sm font-medium hover:bg-red-100 transition-colors">Perdido</button>
                    </>
                  )}
                  {selected.status === 'contacted' && (
                    <>
                      <button onClick={() => { updateRequestStatus(selected.id, 'converted'); setSelected({ ...selected, status: 'converted' }) }} className="w-full px-4 py-2.5 bg-emerald-50 text-emerald-700 rounded-xl text-sm font-medium hover:bg-emerald-100 transition-colors">Marcar convertido</button>
                      <button onClick={() => { updateRequestStatus(selected.id, 'lost'); setSelected(null) }} className="w-full px-4 py-2.5 bg-red-50 text-red-700 rounded-xl text-sm font-medium hover:bg-red-100 transition-colors">Perdido</button>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="lg:col-span-3">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-[600px]">
                <div className="p-4 border-b border-gray-100 flex items-center gap-2">
                  <MessageCircle className="w-5 h-5 text-blue-500" />
                  <h3 className="font-semibold text-gray-900">Conversación</h3>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-xs font-bold shrink-0 mt-1">
                      {selected.name[0]}
                    </div>
                    <div className="flex-1 max-w-[80%]">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-medium text-gray-900">{selected.name}</span>
                        <span className="text-xs text-gray-400">{selected.date}</span>
                      </div>
                      <div className="bg-gray-100 rounded-2xl rounded-tl-sm px-4 py-3 text-sm text-gray-700">
                        {selected.type}
                        {selected.budget !== 'Consultar' && <span className="block text-xs text-gray-500 mt-1">Presupuesto: {selected.budget}</span>}
                      </div>
                    </div>
                  </div>

                  {chatMessages.map((msg) => (
                    <div key={msg.id} className={`flex gap-3 ${msg.sender === 'admin' ? 'flex-row-reverse' : ''}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-1 ${msg.sender === 'admin' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'}`}>
                        {msg.sender === 'admin' ? 'N' : selected.name[0]}
                      </div>
                      <div className={`flex-1 max-w-[80%] ${msg.sender === 'admin' ? 'items-end' : ''}`}>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-medium text-gray-900">
                            {msg.sender === 'admin' ? 'NexWeb' : selected.name}
                          </span>
                          <span className="text-xs text-gray-400">
                            {new Date(msg.created_at).toLocaleString('es-ES', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <div className={`rounded-2xl px-4 py-3 text-sm ${msg.sender === 'admin' ? 'bg-blue-500 text-white rounded-tr-sm' : 'bg-gray-100 text-gray-700 rounded-tl-sm'}`}>
                          {msg.message}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-4 border-t border-gray-100">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={replyText}
                      onChange={e => setReplyText(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendReply() } }}
                      placeholder="Escribe tu respuesta..."
                      className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                    <button
                      onClick={handleSendReply}
                      disabled={!replyText.trim() || sending}
                      className="px-4 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {sending ? (
                        <span className="w-4 h-4 block border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Send className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  <p className="text-xs text-gray-400 mt-1.5">Al enviar se guardará la conversación y se enviará un email a {selected.email}</p>
                  {replyStatus === 'sent' && <p className="text-xs text-emerald-600 mt-1">✓ Respuesta enviada y notificada por email</p>}
                  {replyStatus === 'error' && <p className="text-xs text-red-500 mt-1">✗ Error al enviar. Revisa la consola (F12) para más detalles</p>}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((r, i) => (
            <ScrollReveal key={r.id} delay={i * 0.03}>
              <div
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-all cursor-pointer"
                onClick={() => setSelected(r)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-900">{r.name}</h3>
                    <p className="text-sm text-gray-500 mt-0.5">{r.type}</p>
                  </div>
                  <StatusBadge status={r.status} />
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 font-medium">{r.budget}</span>
                  <span className="text-gray-400">{r.date}</span>
                </div>
                <CardActions status={r.status} request={r} update={updateRequestStatus} />
              </div>
            </ScrollReveal>
          ))}
        </div>
      )}
    </div>
  )
}
