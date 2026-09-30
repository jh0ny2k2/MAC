import { useState, useEffect } from 'react'
import { X, ArrowRight, FileSearch, Sparkles } from 'lucide-react'
import { supabase } from '../../lib/supabase'

export default function LeadPopup() {
  const [show, setShow] = useState(false)
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const dismissed = localStorage.getItem('nexweb_lead_popup')
    const converted = localStorage.getItem('nexweb_lead_converted')
    if (dismissed || converted) return

    const timer = setTimeout(() => setShow(true), 25000)

    let exitFired = false
    const handleMouseLeave = (e) => {
      if (exitFired) return
      if (e.clientY <= 0) {
        exitFired = true
        setShow(true)
      }
    }
    document.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      clearTimeout(timer)
      document.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { error } = await supabase.from('leads').insert({
        business_name: formData.name,
        email: formData.email,
        phone: formData.phone,
        source: 'popup_auditoria',
        notes: 'Lead capturado desde popup de auditoría gratuita',
        status: 'new',
      })
      if (error) {
        console.error('Supabase error:', error)
      }
      setSubmitted(true)
      localStorage.setItem('nexweb_lead_converted', 'true')
      localStorage.removeItem('nexweb_lead_popup')
    } catch (err) {
      console.error('Error saving lead:', err)
      setSubmitted(true)
    }
    setLoading(false)
  }

  const dismiss = () => {
    setShow(false)
    localStorage.setItem('nexweb_lead_popup', 'true')
  }

  if (!show) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={dismiss} />
      <div className="relative bg-[#0a0a0a] border border-[#2a2a2a] rounded-2xl p-8 max-w-md w-full shadow-2xl animate-scale-in">
        <button
          onClick={dismiss}
          className="absolute top-4 right-4 text-[#5a5652] hover:text-white transition-colors p-1 rounded-lg hover:bg-white/5 z-10"
          aria-label="Cerrar"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="text-center py-6">
            <div className="w-16 h-16 rounded-full bg-[#f5b342]/10 flex items-center justify-center mx-auto mb-5">
              <FileSearch className="w-8 h-8 text-[#f5b342]" />
            </div>
            <h3 className="text-2xl font-display font-bold text-white mb-2">¡Revisa tu bandeja de entrada!</h3>
            <p className="text-[#5a5652] text-sm leading-relaxed">
              En menos de 24h recibirás tu auditoría gratuita personalizada con recomendaciones concretas para mejorar tu web.
            </p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-center gap-2 mb-5">
              <Sparkles className="w-5 h-5 text-[#f5b342]" />
              <span className="text-xs font-semibold text-[#f5b342] uppercase tracking-[0.15em]">Oferta exclusiva</span>
            </div>
            <div className="w-16 h-16 rounded-full bg-[#f5b342]/10 flex items-center justify-center mx-auto mb-4">
              <FileSearch className="w-8 h-8 text-[#f5b342]" />
            </div>
            <h3 className="text-2xl font-display font-bold text-white text-center mb-2 leading-tight">
              ¿Sabes lo que le falta a tu web para captar más clientes?
            </h3>
            <p className="text-[#5a5652] text-center mb-6 text-sm leading-relaxed">
              Solicita tu <strong className="text-white">auditoría gratuita</strong> y descubre exactamente qué mejorar en tu sitio web actual.
            </p>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="text"
                placeholder="Tu nombre"
                required
                className="w-full px-4 py-3 rounded-lg bg-[#141414] border border-[#2a2a2a] text-white text-sm focus:outline-none focus:border-[#f5b342]/50 transition-colors placeholder:text-[#5a5652]"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
              />
              <input
                type="email"
                placeholder="Tu email"
                required
                className="w-full px-4 py-3 rounded-lg bg-[#141414] border border-[#2a2a2a] text-white text-sm focus:outline-none focus:border-[#f5b342]/50 transition-colors placeholder:text-[#5a5652]"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
              />
              <input
                type="tel"
                placeholder="Tu teléfono (opcional)"
                className="w-full px-4 py-3 rounded-lg bg-[#141414] border border-[#2a2a2a] text-white text-sm focus:outline-none focus:border-[#f5b342]/50 transition-colors placeholder:text-[#5a5652]"
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-lg bg-gradient-accent text-[#0a0a0a] font-semibold text-sm shadow-lg shadow-[#f5b342]/20 hover:shadow-xl hover:shadow-[#f5b342]/30 transition-all disabled:opacity-50 flex items-center justify-center gap-2 group active:scale-[0.98]"
              >
                {loading ? 'Enviando...' : '¡Quiero mi auditoría gratis!'}
                {!loading && <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />}
              </button>
            </form>
            <p className="text-xs text-[#5a5652] text-center mt-4">Sin spam. Análisis real y personalizado.</p>
          </>
        )}
      </div>
    </div>
  )
}
