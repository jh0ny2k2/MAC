import { MapPin } from 'lucide-react'
import Ornament from './shared/Ornament'

const variants = {
  classic: ClassicLocation,
  cards: CardsLocation,
  map: MapLocation,
  minimal: MinimalLocation,
}

export default function LocationSection({ data, style }) {
  const variantId = data.locationStyle || 'classic'
  const VariantComponent = variants[variantId] || ClassicLocation
  return <VariantComponent data={data} style={style} />
}

function ClassicLocation({ data, style }) {
  return (
    <section className="px-6 py-10 text-center space-y-4" style={{ backgroundColor: style.bg }}>
      <Ornament color={style.secondary} variant={style.ornament} />
      <p className="text-xs tracking-[0.2em] uppercase" style={{ color: style.secondary }}>Ubicación</p>
      <div className="space-y-4 max-w-xs mx-auto">
        {[
          { label: 'Ceremonia', location: data.lugar_ceremonia || 'Iglesia San Miguel' },
          { label: 'Recepción', location: data.lugar_recepcion || 'Hacienda Los Olivos' },
        ].map((l, i) => (
          <div key={i} className="flex items-start gap-3 text-left">
            <MapPin className="w-4 h-4 mt-0.5 shrink-0" style={{ color: style.secondary }} />
            <div>
              <p className="text-xs font-semibold" style={{ color: style.text }}>{l.label}</p>
              <p className="text-xs mt-0.5" style={{ color: style.textMuted }}>{l.location}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

function CardsLocation({ data, style }) {
  const isDark = style.id === 'gold-luxury' || style.id === 'celestial'
  return (
    <section className="px-6 py-10" style={{ backgroundColor: `${style.primary}04` }}>
      <div className="text-center space-y-4 mb-6">
        <Ornament color={style.secondary} variant={style.ornament} />
        <p className="text-xs tracking-[0.2em] uppercase" style={{ color: style.secondary }}>Ubicación</p>
      </div>
      <div className="max-w-xs mx-auto space-y-3">
        {[
          { label: 'Ceremonia', location: data.lugar_ceremonia || 'Iglesia San Miguel' },
          { label: 'Recepción', location: data.lugar_recepcion || 'Hacienda Los Olivos' },
        ].map((l, i) => (
          <div key={i} className="p-4 rounded-xl flex items-start gap-3" style={{ backgroundColor: isDark ? `${style.surface}88` : '#fff', border: `1px solid ${style.secondary}22` }}>
            <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: `${style.secondary}15` }}>
              <MapPin className="w-4 h-4" style={{ color: style.secondary }} />
            </div>
            <div>
              <p className="text-xs font-semibold" style={{ color: style.text }}>{l.label}</p>
              <p className="text-xs mt-0.5" style={{ color: style.textMuted }}>{l.location}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

function MapLocation({ data, style }) {
  return (
    <section className="px-6 py-10" style={{ backgroundColor: style.bg }}>
      <div className="text-center space-y-4 mb-6">
        <p className="text-xs tracking-[0.2em] uppercase" style={{ color: style.secondary }}>Ubicación</p>
      </div>
      <div className="max-w-xs mx-auto space-y-0">
        {[
          { label: 'Ceremonia', location: data.lugar_ceremonia || 'Iglesia San Miguel' },
          { label: 'Recepción', location: data.lugar_recepcion || 'Hacienda Los Olivos' },
        ].map((l, i) => (
          <div key={i} className="flex items-center gap-3 py-4" style={{ borderBottom: i === 0 ? `2px dashed ${style.secondary}30` : 'none' }}>
            <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: style.primary, color: '#fff' }}>
              <span className="text-[10px] font-bold">{i + 1}</span>
            </div>
            <div className="flex-1">
              <p className="text-xs tracking-[0.1em] uppercase font-semibold" style={{ color: style.text }}>{l.label}</p>
              <p className="text-[11px] mt-0.5" style={{ color: style.textMuted }}>{l.location}</p>
            </div>
            <MapPin className="w-3.5 h-3.5 shrink-0" style={{ color: style.secondary }} />
          </div>
        ))}
      </div>
    </section>
  )
}

function MinimalLocation({ data, style }) {
  return (
    <section className="px-6 py-10" style={{ backgroundColor: `${style.primary}04` }}>
      <div className="max-w-xs mx-auto space-y-4 text-center">
        <p className="text-[9px] tracking-[0.3em] uppercase font-semibold" style={{ color: style.secondary }}>Ubicación</p>
        {[
          { label: 'Ceremonia', location: data.lugar_ceremonia || 'Iglesia San Miguel' },
          { label: 'Recepción', location: data.lugar_recepcion || 'Hacienda Los Olivos' },
        ].map((l, i) => (
          <div key={i} className="space-y-1">
            <p className="text-[10px] uppercase tracking-wider font-medium" style={{ color: style.secondary }}>{l.label}</p>
            <p className="text-sm" style={{ color: style.text }}>{l.location}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
