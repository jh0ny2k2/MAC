import Ornament from './shared/Ornament'

const variants = {
  classic: ClassicRsvp,
  card: CardRsvp,
  banner: BannerRsvp,
  minimal: MinimalRsvp,
}

export default function RsvpSection({ data, style }) {
  const variantId = data.rsvpStyle || 'classic'
  const VariantComponent = variants[variantId] || ClassicRsvp
  return <VariantComponent data={data} style={style} />
}

function ClassicRsvp({ data, style }) {
  const isDark = style.id === 'gold-luxury'
  return (
    <section className="py-10 px-6" style={{ backgroundColor: isDark ? style.surface : `${style.primary}04` }}>
      <div className="text-center space-y-4 max-w-xs mx-auto">
        <Ornament color={style.secondary} variant={style.ornament} />
        <p className="text-xs tracking-[0.2em] uppercase" style={{ color: style.secondary }}>Confirmación</p>
        <p className="text-sm leading-relaxed" style={{ color: style.textMuted }}>
          Confirma tu asistencia antes del <span className="font-semibold" style={{ color: style.text }}>{data.fecha_limite || '1 de Junio de 2026'}</span>
        </p>
        <div className="space-y-3 text-left">
          <input type="text" placeholder="Tu nombre" readOnly
            className="w-full px-4 py-2.5 rounded-xl text-xs border text-center"
            style={{ borderColor: `${style.secondary}40`, backgroundColor: isDark ? '#0A0A0A' : '#FBF6F0', color: style.text }}
          />
          <input type="text" placeholder="Nº de invitados" readOnly
            className="w-full px-4 py-2.5 rounded-xl text-xs border text-center"
            style={{ borderColor: `${style.secondary}40`, backgroundColor: isDark ? '#0A0A0A' : '#FBF6F0', color: style.text }}
          />
          <button className="w-full py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider"
            style={{ backgroundColor: style.secondary, color: isDark ? style.primary : '#fff' }}>Confirmar asistencia</button>
        </div>
      </div>
    </section>
  )
}

function CardRsvp({ data, style }) {
  const isDark = style.id === 'gold-luxury' || style.id === 'celestial'
  return (
    <section className="py-10 px-6" style={{ backgroundColor: style.bg }}>
      <div className="max-w-xs mx-auto p-5 rounded-xl text-center" style={{ backgroundColor: isDark ? `${style.surface}88` : '#fff', border: `1px solid ${style.secondary}22`, boxShadow: `0 4px 16px ${style.primary}08` }}>
        <p className="text-xs tracking-[0.2em] uppercase mb-1" style={{ color: style.secondary }}>Confirmación</p>
        <p className="text-xs mt-3 mb-4" style={{ color: style.textMuted }}>
          Fecha límite: <span className="font-semibold" style={{ color: style.text }}>{data.fecha_limite || '1 de Junio de 2026'}</span>
        </p>
        <div className="space-y-2">
          <input type="text" placeholder="Tu nombre" readOnly
            className="w-full px-3 py-2 rounded-lg text-xs border text-center"
            style={{ borderColor: `${style.secondary}30`, backgroundColor: isDark ? '#0A0A0A' : '#FBF6F0', color: style.text }}
          />
          <button className="w-full py-2 rounded-lg text-xs font-semibold uppercase tracking-wider"
            style={{ backgroundColor: style.secondary, color: '#fff' }}>Confirmar</button>
        </div>
      </div>
    </section>
  )
}

function BannerRsvp({ data, style }) {
  return (
    <section className="py-10 px-6 text-center" style={{ backgroundColor: style.primary }}>
      <div className="space-y-4 max-w-xs mx-auto">
        <p className="text-xs tracking-[0.2em] uppercase" style={{ color: style.secondary }}>Confirmación</p>
        <p className="text-sm" style={{ color: 'rgba(255,255,255,0.8)' }}>
          Confirma antes del <span className="font-semibold" style={{ color: style.secondary }}>{data.fecha_limite || '1 de Junio de 2026'}</span>
        </p>
        <button className="px-8 py-3 rounded-full text-xs font-bold uppercase tracking-wider"
          style={{ backgroundColor: style.secondary, color: style.primary }}>Confirmar asistencia</button>
      </div>
    </section>
  )
}

function MinimalRsvp({ data, style }) {
  return (
    <section className="py-10 px-6 text-center" style={{ backgroundColor: style.bg }}>
      <div className="max-w-xs mx-auto space-y-3">
        <p className="text-[9px] tracking-[0.3em] uppercase font-semibold" style={{ color: style.secondary }}>Confirmación</p>
        <p className="text-sm" style={{ color: style.textMuted }}>
          Confirma tu asistencia antes del {data.fecha_limite || '1 de Junio de 2026'}
        </p>
        <button className="px-6 py-2 rounded-full text-xs font-medium border" style={{ borderColor: style.secondary, color: style.secondary }}>
          Confirmar ahora
        </button>
      </div>
    </section>
  )
}
