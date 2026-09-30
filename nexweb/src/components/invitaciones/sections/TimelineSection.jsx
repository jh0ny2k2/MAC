import Ornament from './shared/Ornament'

const variants = {
  classic: ClassicTimeline,
  cards: CardsTimeline,
  zigzag: ZigzagTimeline,
  minimal: MinimalTimeline,
}

export default function TimelineSection({ data, style }) {
  const events = data.timeline?.length ? data.timeline : [
    { date: 'Enero 2020', title: 'Primer Encuentro', desc: 'Nos conocimos en casa de amigos en común.', img: '' },
    { date: 'Marzo 2020', title: 'Primera Cita', desc: 'Nuestra primera cita fue en un café del centro.', img: '' },
    { date: 'Julio 2022', title: 'Primer Viaje', desc: 'Viajamos juntos por primera vez a la playa.', img: '' },
    { date: 'Diciembre 2024', title: 'Compromiso', desc: 'Dijo que sí en el lugar donde nos conocimos.', img: '' },
  ]

  const variantId = data.timelineStyle || 'classic'
  const VariantComponent = variants[variantId] || ClassicTimeline

  return (
    <section className="px-6 py-10" style={{ backgroundColor: `${style.primary}04` }}>
      <div className="text-center space-y-4 mb-8">
        <Ornament color={style.secondary} variant={style.ornament} />
        <p className="text-xs tracking-[0.2em] uppercase" style={{ color: style.secondary }}>
          Línea de Tiempo
        </p>
      </div>
      <VariantComponent events={events} style={style} />
    </section>
  )
}

function TimelineImage({ src, alt, style }) {
  if (!src) return null
  return (
    <img
      src={src}
      alt={alt}
      className="rounded-lg object-cover w-full h-32 mt-2"
      style={{ border: `1px solid ${style.secondary}22` }}
      loading="lazy"
    />
  )
}

function ClassicTimeline({ events, style }) {
  return (
    <div className="relative max-w-xs mx-auto">
      <div className="absolute left-[11px] top-2 bottom-2 w-px" style={{ backgroundColor: style.secondary, opacity: 0.3 }} />
      {events.map((evt, i) => (
        <div key={i} className="flex gap-4 pb-6 last:pb-0 relative">
          <div className="shrink-0 w-[24px] flex justify-center pt-0.5">
            <div className="w-2.5 h-2.5 rounded-full border-2" style={{ borderColor: style.secondary, backgroundColor: style.bg }} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] uppercase tracking-wider font-semibold" style={{ color: style.secondary }}>{evt.date}</p>
            <p className="text-sm font-semibold mt-0.5" style={{ color: style.text }}>{evt.title}</p>
            {evt.desc && <p className="text-xs mt-0.5" style={{ color: style.textMuted }}>{evt.desc}</p>}
            <TimelineImage src={evt.img} alt={evt.title} style={style} />
          </div>
        </div>
      ))}
    </div>
  )
}

function CardsTimeline({ events, style }) {
  return (
    <div className="space-y-4 max-w-xs mx-auto">
      {events.map((evt, i) => (
        <div
          key={i}
          className="rounded-xl overflow-hidden"
          style={{
            backgroundColor: style.surface,
            border: `1px solid ${style.secondary}22`,
            boxShadow: `0 2px 8px ${style.primary}10`,
          }}
        >
          {evt.img && (
            <img
              src={evt.img}
              alt={evt.title}
              className="w-full h-36 object-cover"
              loading="lazy"
            />
          )}
          <div className="p-3">
            <p className="text-[10px] uppercase tracking-wider font-semibold" style={{ color: style.secondary }}>{evt.date}</p>
            <p className="text-sm font-semibold mt-1" style={{ color: style.text }}>{evt.title}</p>
            {evt.desc && <p className="text-xs mt-1" style={{ color: style.textMuted }}>{evt.desc}</p>}
          </div>
        </div>
      ))}
    </div>
  )
}

function ZigzagTimeline({ events, style }) {
  return (
    <div className="relative max-w-xs mx-auto">
      <div className="absolute left-1/2 top-2 bottom-2 w-px -translate-x-px" style={{ backgroundColor: style.secondary, opacity: 0.25 }} />
      {events.map((evt, i) => {
        const isLeft = i % 2 === 0
        return (
          <div key={i} className={`flex items-start gap-3 pb-8 last:pb-0 ${isLeft ? 'flex-row' : 'flex-row-reverse'}`}>
            <div className="flex-1 min-w-0 text-right" style={{ textAlign: isLeft ? 'right' : 'left' }}>
              <p className="text-[10px] uppercase tracking-wider font-semibold" style={{ color: style.secondary }}>{evt.date}</p>
              <p className="text-sm font-semibold mt-0.5" style={{ color: style.text }}>{evt.title}</p>
              {evt.desc && <p className="text-xs mt-0.5" style={{ color: style.textMuted }}>{evt.desc}</p>}
              {evt.img && (
                <img
                  src={evt.img}
                  alt={evt.title}
                  className={`rounded-lg object-cover w-full h-24 mt-2 ${isLeft ? 'ml-auto' : 'mr-auto'}`}
                  style={{ maxWidth: '80%', border: `1px solid ${style.secondary}22` }}
                  loading="lazy"
                />
              )}
            </div>
            <div className="shrink-0 w-[24px] flex justify-center pt-0.5">
              <div className="w-2.5 h-2.5 rounded-full border-2" style={{ borderColor: style.secondary, backgroundColor: style.bg }} />
            </div>
            <div className="flex-1" />
          </div>
        )
      })}
    </div>
  )
}

function MinimalTimeline({ events, style }) {
  return (
    <div className="max-w-xs mx-auto divide-y" style={{ borderColor: `${style.secondary}22` }}>
      {events.map((evt, i) => (
        <div key={i} className="py-4 first:pt-0 last:pb-0">
          <div className="flex items-baseline gap-2">
            <span className="text-[9px] uppercase tracking-wider font-semibold shrink-0" style={{ color: style.secondary }}>{evt.date}</span>
            <div className="flex-1 h-px" style={{ backgroundColor: `${style.secondary}22` }} />
          </div>
          <p className="text-sm font-semibold mt-1" style={{ color: style.text }}>{evt.title}</p>
          {evt.desc && <p className="text-xs mt-0.5" style={{ color: style.textMuted }}>{evt.desc}</p>}
          {evt.img && (
            <img
              src={evt.img}
              alt={evt.title}
              className="rounded-lg object-cover w-full h-28 mt-2"
              style={{ border: `1px solid ${style.secondary}22` }}
              loading="lazy"
            />
          )}
        </div>
      ))}
    </div>
  )
}
