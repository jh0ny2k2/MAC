import { MessageCircle } from 'lucide-react'
import Ornament from './shared/Ornament'

const variants = {
  classic: ClassicGuestMessages,
  wall: WallGuestMessages,
  highlight: HighlightGuestMessages,
  minimal: MinimalGuestMessages,
}

const SAMPLE_MESSAGES = [
  { name: 'Lucía M.', message: '¡Felicidades! Estoy muy feliz por ustedes 💕', date: 'Hace 2 días' },
  { name: 'Carlos G.', message: 'Que hermoso amor. Nos vemos en la boda 🥂', date: 'Hace 5 días' },
  { name: 'Ana R.', message: 'Son el uno para el otro. Bendiciones 🙏', date: 'Hace 1 semana' },
]

export default function GuestMessagesSection({ data, style }) {
  const variantId = data.guestMessagesStyle || 'classic'
  const VariantComponent = variants[variantId] || ClassicGuestMessages
  return <VariantComponent data={data} style={style} />
}

function ClassicGuestMessages({ data, style }) {
  const isDark = style.id === 'gold-luxury'
  return (
    <section className="px-6 py-10" style={{ backgroundColor: isDark ? style.surface : `${style.primary}04` }}>
      <div className="text-center space-y-4 mb-6">
        <Ornament color={style.secondary} variant={style.ornament} />
        <p className="text-xs tracking-[0.2em] uppercase" style={{ color: style.secondary }}>Dedicatorias</p>
        <p className="text-sm leading-relaxed max-w-xs mx-auto" style={{ color: style.textMuted }}>Deja un mensaje para los novios</p>
      </div>
      <div className="max-w-xs mx-auto space-y-3 mb-4">
        {SAMPLE_MESSAGES.map((m, i) => (
          <div key={i} className="p-3 rounded-xl" style={{ backgroundColor: isDark ? '#0A0A0A' : '#FBF6F0' }}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-semibold" style={{ color: style.text }}>{m.name}</span>
              <span className="text-[9px]" style={{ color: style.textMuted }}>{m.date}</span>
            </div>
            <p className="text-xs leading-relaxed" style={{ color: style.textMuted }}>{m.message}</p>
          </div>
        ))}
      </div>
      <div className="max-w-xs mx-auto">
        <textarea placeholder="Escribe tu mensaje..." readOnly rows={2}
          className="w-full px-4 py-2.5 rounded-xl text-xs border resize-none"
          style={{ borderColor: `${style.secondary}30`, backgroundColor: isDark ? '#0A0A0A' : '#FBF6F0', color: style.text }}
        />
        <button className="w-full mt-2 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider"
          style={{ backgroundColor: style.secondary, color: isDark ? style.primary : '#fff' }}>Enviar mensaje</button>
      </div>
      <MessageCircle className="w-4 h-4 mx-auto mt-6" style={{ color: style.textMuted, opacity: 0.4 }} />
    </section>
  )
}

function WallGuestMessages({ data, style }) {
  const isDark = style.id === 'gold-luxury' || style.id === 'celestial'
  return (
    <section className="px-6 py-10" style={{ backgroundColor: style.bg }}>
      <div className="text-center space-y-4 mb-6">
        <p className="text-xs tracking-[0.2em] uppercase" style={{ color: style.secondary }}>Dedicatorias</p>
      </div>
      <div className="grid grid-cols-1 gap-3 max-w-xs mx-auto mb-4">
        {SAMPLE_MESSAGES.map((m, i) => (
          <div key={i} className="p-3 rounded-lg text-center" style={{ backgroundColor: isDark ? `${style.surface}88` : `${style.primary}04`, border: `1px solid ${style.secondary}15` }}>
            <p className="text-xs leading-relaxed italic mb-2" style={{ color: style.textMuted }}>&ldquo;{m.message}&rdquo;</p>
            <p className="text-[10px] font-semibold" style={{ color: style.text }}>{m.name}</p>
          </div>
        ))}
      </div>
      <div className="max-w-xs mx-auto">
        <textarea placeholder="Deja tu mensaje..." readOnly rows={2}
          className="w-full px-4 py-2.5 rounded-lg text-xs border resize-none"
          style={{ borderColor: `${style.secondary}30`, backgroundColor: isDark ? '#0A0A0A' : '#FBF6F0', color: style.text }}
        />
      </div>
    </section>
  )
}

function HighlightGuestMessages({ data, style }) {
  const isDark = style.id === 'gold-luxury' || style.id === 'celestial'
  const first = SAMPLE_MESSAGES[0]
  return (
    <section className="px-6 py-10" style={{ backgroundColor: `${style.primary}04` }}>
      <div className="text-center space-y-4 mb-6">
        <Ornament color={style.secondary} variant={style.ornament} />
        <p className="text-xs tracking-[0.2em] uppercase" style={{ color: style.secondary }}>Dedicatorias</p>
      </div>
      <div className="max-w-xs mx-auto mb-4 p-4 rounded-xl text-center" style={{ backgroundColor: isDark ? `${style.surface}88` : '#fff', border: `1px solid ${style.secondary}22` }}>
        <p className="text-sm leading-relaxed italic" style={{ color: style.text }}>&ldquo;{first.message}&rdquo;</p>
        <p className="text-xs font-semibold mt-2" style={{ color: style.secondary }}>{first.name}</p>
      </div>
      <div className="max-w-xs mx-auto space-y-2">
        {SAMPLE_MESSAGES.slice(1).map((m, i) => (
          <div key={i} className="flex items-start gap-2 p-2 rounded-lg" style={{ backgroundColor: isDark ? '#0A0A0A' : '#FBF6F0' }}>
            <p className="text-[10px] leading-relaxed flex-1" style={{ color: style.textMuted }}>{m.message}</p>
            <span className="text-[8px] shrink-0" style={{ color: style.textMuted }}>{m.name}</span>
          </div>
        ))}
      </div>
    </section>
  )
}

function MinimalGuestMessages({ data, style }) {
  const isDark = style.id === 'gold-luxury' || style.id === 'celestial'
  return (
    <section className="px-6 py-10" style={{ backgroundColor: style.bg }}>
      <div className="text-center space-y-4 mb-6">
        <p className="text-[9px] tracking-[0.3em] uppercase font-semibold" style={{ color: style.secondary }}>Dedicatorias</p>
      </div>
      <div className="max-w-xs mx-auto">
        <textarea placeholder="Escribe tu mensaje..." readOnly rows={2}
          className="w-full px-3 py-2 rounded-lg text-xs border resize-none text-center"
          style={{ borderColor: `${style.secondary}20`, backgroundColor: isDark ? '#0A0A0A' : '#FBF6F0', color: style.text }}
        />
      </div>
    </section>
  )
}
