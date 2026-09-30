import { Heart, MapPin, CalendarDays } from 'lucide-react'
import Ornament from './shared/Ornament'

const variants = {
  classic: ClassicEvents,
  cards: CardsEvents,
  timeline: TimelineEvents,
  modern: ModernEvents,
}

export default function EventsSection({ data, style }) {
  const variantId = data.eventsStyle || 'classic'
  const VariantComponent = variants[variantId] || ClassicEvents
  return <VariantComponent data={data} style={style} />
}

function MapLink({ location }) {
  if (!location) return null
  return (
    <a
      href={`https://maps.google.com/?q=${encodeURIComponent(location)}`}
      target="_blank" rel="noopener noreferrer"
      className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider mt-2"
      style={{ color: 'inherit', opacity: 0.7 }}
    >
      <MapPin className="w-3 h-3" />
      Ver en mapa
    </a>
  )
}

function ClassicEvents({ data, style }) {
  const isDark = style.id === 'gold-luxury'
  return (
    <section className="py-10 px-6" style={{ backgroundColor: isDark ? style.surface : `${style.primary}04` }}>
      <div className="text-center space-y-6 max-w-xs mx-auto">
        <Ornament color={style.secondary} variant={style.ornament} />
        <p className="text-xs tracking-[0.2em] uppercase" style={{ color: style.secondary }}>La Boda</p>
        {[
          { icon: Heart, title: 'Ceremonia', time: data.hora_ceremonia || '17:00 h', location: data.lugar_ceremonia || 'Iglesia San Miguel' },
          { icon: CalendarDays, title: 'Recepción', time: data.hora_recepcion || '19:30 h', location: data.lugar_recepcion || 'Hacienda Los Olivos' },
        ].map((evt) => (
          <div key={evt.title} className="text-center">
            <evt.icon className="w-4 h-4 mx-auto mb-2" style={{ color: style.secondary }} />
            <p className="text-xs font-bold tracking-[0.15em] uppercase mb-1" style={{ color: style.text }}>{evt.title}</p>
            <p className="text-xs" style={{ color: style.secondary }}>{evt.time}</p>
            <p className="text-xs mt-1" style={{ color: style.textMuted }}>{evt.location}</p>
            <MapLink location={evt.location} />
          </div>
        ))}
      </div>
    </section>
  )
}

function CardsEvents({ data, style }) {
  const isDark = style.id === 'gold-luxury' || style.id === 'celestial'
  return (
    <section className="py-10 px-6" style={{ backgroundColor: style.bg }}>
      <div className="text-center space-y-6 max-w-xs mx-auto">
        <Ornament color={style.secondary} variant={style.ornament} />
        <p className="text-xs tracking-[0.2em] uppercase" style={{ color: style.secondary }}>La Boda</p>
        <div className="grid gap-4">
          {[
            { title: 'Ceremonia', time: data.hora_ceremonia || '17:00 h', location: data.lugar_ceremonia || 'Iglesia San Miguel' },
            { title: 'Recepción', time: data.hora_recepcion || '19:30 h', location: data.lugar_recepcion || 'Hacienda Los Olivos' },
          ].map((evt) => (
            <div
              key={evt.title}
              className="rounded-xl p-5 text-center"
              style={{
                backgroundColor: isDark ? `${style.surface}88` : '#fff',
                border: `1px solid ${style.secondary}22`,
                boxShadow: `0 2px 12px ${style.primary}08`,
              }}
            >
              <div className="w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-3" style={{ backgroundColor: `${style.secondary}15` }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={style.secondary} strokeWidth="1.5">
                  {evt.title === 'Ceremonia'
                    ? <><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></>
                    : <><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></>
                  }
                </svg>
              </div>
              <p className="text-xs font-bold tracking-[0.15em] uppercase mb-2" style={{ color: style.text }}>{evt.title}</p>
              <p className="text-sm font-semibold" style={{ color: style.secondary }}>{evt.time}</p>
              <p className="text-xs mt-1" style={{ color: style.textMuted }}>{evt.location}</p>
              <MapLink location={evt.location} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function TimelineEvents({ data, style }) {
  return (
    <section className="py-10 px-6" style={{ backgroundColor: `${style.primary}04` }}>
      <div className="text-center space-y-6 max-w-xs mx-auto">
        <Ornament color={style.secondary} variant={style.ornament} />
        <p className="text-xs tracking-[0.2em] uppercase" style={{ color: style.secondary }}>La Boda</p>
        <div className="relative">
          <div className="absolute left-1/2 top-0 bottom-0 w-px -translate-x-px" style={{ backgroundColor: style.secondary, opacity: 0.25 }} />
          {[
            { time: data.hora_ceremonia || '17:00', location: data.lugar_ceremonia || 'Iglesia San Miguel', label: 'Ceremonia' },
            { time: data.hora_recepcion || '19:30', location: data.lugar_recepcion || 'Hacienda Los Olivos', label: 'Recepción' },
          ].map((evt, i) => (
            <div key={i} className="flex items-start gap-4 pb-8 last:pb-0 relative">
              <div className="flex-1 text-right">
                <p className="text-xs font-bold tracking-[0.15em] uppercase" style={{ color: style.text }}>{evt.label}</p>
                <p className="text-[10px] mt-1" style={{ color: style.secondary }}>{evt.time}</p>
              </div>
              <div className="shrink-0 w-[24px] flex justify-center pt-0.5">
                <div className="w-2.5 h-2.5 rounded-full border-2" style={{ borderColor: style.secondary, backgroundColor: style.bg }} />
              </div>
              <div className="flex-1">
                <p className="text-xs" style={{ color: style.textMuted }}>{evt.location}</p>
                <MapLink location={evt.location} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function ModernEvents({ data, style }) {
  const isDark = style.id === 'gold-luxury' || style.id === 'celestial'
  return (
    <section className="py-10 px-6" style={{ backgroundColor: style.bg }}>
      <div className="max-w-xs mx-auto space-y-6">
        <div className="text-center">
          <p className="text-[9px] tracking-[0.3em] uppercase font-semibold" style={{ color: style.secondary }}>La Boda</p>
          <div className="w-8 h-px mx-auto mt-2" style={{ backgroundColor: `${style.secondary}33` }} />
        </div>
        {[
          { title: 'Ceremonia', time: data.hora_ceremonia || '17:00 h', location: data.lugar_ceremonia || 'Iglesia San Miguel' },
          { title: 'Recepción', time: data.hora_recepcion || '19:30 h', location: data.lugar_recepcion || 'Hacienda Los Olivos' },
        ].map((evt, i) => (
          <div key={evt.title} className="flex gap-4 items-start">
            <div
              className="shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold"
              style={{ backgroundColor: style.primary, color: '#fff' }}
            >
              {i + 1}
            </div>
            <div className="flex-1 min-w-0 pb-4" style={{ borderBottom: i === 0 ? `1px solid ${style.secondary}22` : 'none' }}>
              <p className="text-xs font-bold tracking-[0.1em] uppercase" style={{ color: style.text }}>{evt.title}</p>
              <p className="text-sm font-semibold mt-1" style={{ color: style.secondary }}>{evt.time}</p>
              <p className="text-xs mt-0.5" style={{ color: style.textMuted }}>{evt.location}</p>
              <MapLink location={evt.location} />
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
