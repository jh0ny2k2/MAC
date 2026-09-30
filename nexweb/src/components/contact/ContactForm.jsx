import { useState } from 'react'
import { Send, Check, AlertCircle, ArrowRight, Loader2 } from 'lucide-react'
import { supabase } from '../../lib/supabase'

export default function ContactForm() {
  const [form, setForm] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    type: 'Web Corporativa',
    message: '',
  })
  const [status, setStatus] = useState('idle')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('sending')

    const today = new Date().toLocaleDateString('es-ES')
    const subject = `[${form.type}] ${form.company || form.name} — ${form.message.slice(0, 60)}${form.message.length > 60 ? '...' : ''}`
    const fullMessage = `Tipo: ${form.type}\nEmpresa: ${form.company || '—'}\nTeléfono: ${form.phone || '—'}\n\nMensaje:\n${form.message}`

    try {
      const { error: msgErr } = await supabase.from('messages').insert({
        name: form.name,
        email: form.email,
        subject,
        date: today,
        read: false,
      })

      if (msgErr) throw msgErr

      const { error: reqErr } = await supabase.from('requests').insert({
        name: form.name,
        type: form.type,
        budget: 'Consultar',
        date: today,
        status: 'new',
        email: form.email,
      })

      if (reqErr) {
        console.warn('requests insert failed (non-critical):', reqErr.message)
      }

      try {
        await supabase.rpc('send_reply_email', {
          to_email: 'info@nexweb.com',
          subject: `Nuevo lead: ${form.name} — ${form.company || form.type}`,
          message_text: fullMessage,
        })
      } catch {
        console.log('Email notification not configured (optional)')
      }

      setStatus('sent')
      setForm({ name: '', company: '', email: '', phone: '', type: 'Web Corporativa', message: '' })
      setTimeout(() => setStatus('idle'), 5000)
    } catch (err) {
      console.error('Form error:', err)
      setStatus('error')
      setTimeout(() => setStatus('idle'), 8000)
    }
  }

  if (status === 'sent') {
    return (
      <div className="bg-[#141414] rounded-xl border border-[#1e1e1e] shadow-card p-10 lg:p-12 text-center">
        <div className="w-16 h-16 rounded-full bg-[#f5b342]/10 flex items-center justify-center mx-auto mb-6">
          <Check className="w-8 h-8 text-[#f5b342]" />
        </div>
        <h3 className="text-2xl font-display font-bold text-white mb-3">Mensaje enviado con éxito</h3>
        <p className="text-[#5a5652] max-w-md mx-auto mb-8">
          Gracias por contactarnos. Te responderemos en menos de 24 horas a tu correo <strong className="text-white/80">{form.email}</strong>.
        </p>
        <button
          onClick={() => setStatus('idle')}
          className="inline-flex items-center gap-2 text-sm text-[#f5b342] hover:text-[#f7c65a] transition-colors"
        >
          Enviar otro mensaje <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="bg-[#141414] rounded-xl border border-[#1e1e1e] shadow-card p-8 lg:p-10">
      {status === 'error' && (
        <div className="mb-6 flex items-start gap-3 px-4 py-3 bg-red-500/10 text-red-400 rounded-xl text-sm border border-red-500/20">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <div>
            <p className="font-medium">Error al enviar</p>
            <p className="text-red-400/70 mt-1">
              No se pudieron guardar los datos. Asegúrate de haber ejecutado el schema SQL en Supabase.
              Inténtalo de nuevo o escríbenos directamente a <strong>info@nexweb.com</strong>.
            </p>
          </div>
        </div>
      )}

      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-medium text-[#8a8682] mb-1.5">
            Nombre <span className="text-[#f5b342]">*</span>
          </label>
          <input
            type="text" required value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            className="w-full px-4 py-3 rounded-lg border border-[#1e1e1e] bg-[#0a0a0a] text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#f5b342]/20 focus:border-[#f5b342]/40 transition-all placeholder:text-[#5a5652]"
            placeholder="Tu nombre"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#8a8682] mb-1.5">Empresa</label>
          <input
            type="text" value={form.company}
            onChange={e => setForm({ ...form, company: e.target.value })}
            className="w-full px-4 py-3 rounded-lg border border-[#1e1e1e] bg-[#0a0a0a] text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#f5b342]/20 focus:border-[#f5b342]/40 transition-all placeholder:text-[#5a5652]"
            placeholder="Tu empresa"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-[#8a8682] mb-1.5">
            Email <span className="text-[#f5b342]">*</span>
          </label>
          <input
            type="email" required value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
            className="w-full px-4 py-3 rounded-lg border border-[#1e1e1e] bg-[#0a0a0a] text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#f5b342]/20 focus:border-[#f5b342]/40 transition-all placeholder:text-[#5a5652]"
            placeholder="tu@email.com"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-[#8a8682] mb-1.5">Teléfono</label>
          <input
            type="tel" value={form.phone}
            onChange={e => setForm({ ...form, phone: e.target.value })}
            className="w-full px-4 py-3 rounded-lg border border-[#1e1e1e] bg-[#0a0a0a] text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#f5b342]/20 focus:border-[#f5b342]/40 transition-all placeholder:text-[#5a5652]"
            placeholder="+34 600 000 000"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-[#8a8682] mb-1.5">
            Tipo de proyecto <span className="text-[#f5b342]">*</span>
          </label>
          <select
            value={form.type}
            onChange={e => setForm({ ...form, type: e.target.value })}
            className="w-full px-4 py-3 rounded-lg border border-[#1e1e1e] bg-[#0a0a0a] text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#f5b342]/20 focus:border-[#f5b342]/40 transition-all"
          >
            <option>Web Corporativa</option>
            <option>Tienda Online</option>
            <option>Landing Page</option>
            <option>Blog Profesional</option>
            <option>Catálogo Digital</option>
            <option>Rediseño</option>
            <option>Otro</option>
          </select>
        </div>
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-[#8a8682] mb-1.5">
            Mensaje <span className="text-[#f5b342]">*</span>
          </label>
          <textarea
            rows={4} required value={form.message}
            onChange={e => setForm({ ...form, message: e.target.value })}
            className="w-full px-4 py-3 rounded-lg border border-[#1e1e1e] bg-[#0a0a0a] text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#f5b342]/20 focus:border-[#f5b342]/40 transition-all placeholder:text-[#5a5652] resize-none"
            placeholder="Cuéntanos sobre tu proyecto..."
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={status === 'sending'}
        className="w-full mt-6 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-accent text-black font-semibold text-sm hover:opacity-90 transition-all disabled:opacity-60"
      >
        {status === 'sending' ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Enviando...
          </>
        ) : (
          <>
            <Send className="w-4 h-4" />
            Enviar mensaje
          </>
        )}
      </button>
    </form>
  )
}
