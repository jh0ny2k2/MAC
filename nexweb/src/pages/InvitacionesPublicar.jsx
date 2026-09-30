import { useState, useMemo } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { ArrowLeft, Check, Plus, Minus, Globe, Camera, Music, Shield, Users, Sparkles } from 'lucide-react'
import SEO from '../components/SEO'

const ADDONS = [
  { id: 'domain', name: 'Dominio personalizado', desc: 'tusnombres.com', price: 15, icon: Globe },
  { id: 'nobranding', name: 'Sin marca de agua', desc: 'Sin "Creado con Eterno"', price: 5, icon: Shield },
  { id: 'unlimited', name: 'Fotos y vídeos ilimitados', desc: 'Galería sin límite', price: 5, icon: Camera },
  { id: 'custommusic', name: 'Tu propia canción', desc: 'Sube el archivo de audio', price: 3, icon: Music },
  { id: 'guestphotos', name: 'Álbum compartido', desc: 'Invitados suben sus fotos', price: 5, icon: Users },
]

export default function InvitacionesPublicar() {
  const navigate = useNavigate()
  const [cart, setCart] = useState({})
  const basePrice = 10

  const toggleAddon = (id) => {
    setCart((prev) => {
      const next = { ...prev }
      if (next[id]) delete next[id]
      else next[id] = true
      return next
    })
  }

  const total = useMemo(() => {
    return basePrice + Object.keys(cart).reduce((sum, id) => {
      const addon = ADDONS.find((a) => a.id === id)
      return sum + (addon?.price || 0)
    }, 0)
  }, [cart])

  const addonCount = Object.keys(cart).length

  return (
    <>
      <SEO
        title="Publicar Invitación de Boda Online | Eterno"
        description="Publica tu invitación de boda online con dominio único. Pago único, sin suscripciones. Elige los extras que quieras."
        keywords="publicar invitacion boda online, dominio invitacion boda, subir invitacion digital, alojamiento invitacion boda"
        url="/invitaciones/publicar"
        type="website"
      />
      <div className="min-h-screen bg-[#FBF6F0]">
      <div className="bg-white/80 backdrop-blur border-b border-[#DFC5A8]/20 sticky top-0 z-40">
        <div className="max-w-3xl mx-auto px-6 sm:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={() => navigate('/invitaciones/crear')}
              className="w-9 h-9 rounded-full bg-[#7A1A2E]/5 flex items-center justify-center hover:bg-[#7A1A2E]/10 transition-all"
            >
              <ArrowLeft className="w-4 h-4 text-[#7A1A2E]" />
            </button>
            <span className="text-xs font-medium text-[#8C7C7A]">Pago único · Sin suscripción</span>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 sm:px-8 py-10">
        <div className="text-center mb-10">
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-[#2C1810] mb-2">Publica tu invitación</h1>
          <p className="text-sm text-[#8C7C7A]">Elige los extras que quieras y publica tu página web</p>
        </div>

        <div className="grid md:grid-cols-5 gap-8">
          <div className="md:col-span-3 space-y-4">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#DFC5A8]/20">
              <h3 className="text-sm font-bold text-[#7A1A2E] mb-4 flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Plan base
              </h3>
              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="text-sm font-semibold text-[#2C1810]">Publicación web</p>
                  <p className="text-[11px] text-[#8C7C7A] mt-0.5">
                    Invitación web completa · URL: <span className="font-mono text-[#7A1A2E]">eterno.app/inv/tu-enlace</span>
                  </p>
                </div>
                <span className="text-lg font-bold text-[#2C1810]">10€</span>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#DFC5A8]/20">
              <h3 className="text-sm font-bold text-[#7A1A2E] mb-4 flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Extras
                {addonCount > 0 && (
                  <span className="bg-[#7A1A2E] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">{addonCount}</span>
                )}
              </h3>
              <div className="space-y-2">
                {ADDONS.map((addon) => {
                  const active = !!cart[addon.id]
                  const Icon = addon.icon
                  return (
                    <button
                      key={addon.id}
                      onClick={() => toggleAddon(addon.id)}
                      className="w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left"
                      style={{
                        backgroundColor: active ? '#7A1A2E08' : 'transparent',
                        border: active ? '1.5px solid #7A1A2E' : '1.5px solid transparent',
                      }}
                    >
                      <div
                        className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                        style={{ backgroundColor: active ? '#7A1A2E' : '#DFC5A8' }}
                      >
                        {active ? <Check className="w-4 h-4 text-white" /> : <Icon className="w-4 h-4 text-white/70" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold" style={{ color: active ? '#2C1810' : '#8C7C7A' }}>{addon.name}</p>
                        <p className="text-[10px] mt-0.5" style={{ color: active ? '#8C7C7A' : '#B5A5A3' }}>{addon.desc}</p>
                      </div>
                      <span className="text-sm font-bold shrink-0" style={{ color: active ? '#7A1A2E' : '#8C7C7A' }}>
                        +{addon.price}€
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          <div className="md:col-span-2">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#DFC5A8]/20 md:sticky md:top-24">
              <h3 className="text-sm font-bold text-[#2C1810] mb-4">Resumen</h3>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1">
                  <span className="text-[#8C7C7A]">Publicación web</span>
                  <span className="font-medium text-[#2C1810]">10€</span>
                </div>
                {ADDONS.filter((a) => cart[a.id]).map((a) => (
                  <div key={a.id} className="flex justify-between py-1">
                    <span className="text-[#8C7C7A]">{a.name}</span>
                    <span className="font-medium text-[#2C1810]">+{a.price}€</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-[#DFC5A8]/20 mt-4 pt-4">
                <div className="flex justify-between items-baseline">
                  <span className="text-sm font-bold text-[#2C1810]">Total</span>
                  <span className="text-xl font-bold text-[#7A1A2E]">{total}€</span>
                </div>
                <p className="text-[9px] text-[#8C7C7A] mt-1">Pago único · Sin suscripciones ni cargos ocultos</p>
              </div>

              <div className="mt-6 space-y-3">
                <button
                  disabled
                  className="w-full py-3 rounded-full text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 opacity-50 cursor-not-allowed"
                  style={{ backgroundColor: '#7A1A2E', color: '#fff' }}
                >
                  Ir al pago · {total}€
                </button>
                <span className="block text-center text-[9px] text-[#8C7C7A] bg-[#F3EDE5] py-1.5 rounded-lg">
                  Próximamente
                </span>
              </div>

              <div className="mt-6 pt-4 border-t border-[#DFC5A8]/20">
                <div className="bg-gradient-to-br from-[#7A1A2E] to-[#5C1020] rounded-2xl p-5 text-center -mx-1">
                  <p className="text-sm font-display font-bold text-white mb-1">
                    ¿Quieres algo a medida?
                  </p>
                  <p className="text-[10px] text-white/60 mb-3 leading-relaxed">
                    Diseño exclusivo, animaciones, fotografías reales, videoinvitación y todo lo que imagines.
                  </p>
                  <a
                    href="/contact"
                    className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all duration-500 hover:shadow-xl hover:-translate-y-0.5"
                    style={{ backgroundColor: '#C4956A', color: '#fff' }}
                  >
                    Pedir presupuesto
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  )
}
