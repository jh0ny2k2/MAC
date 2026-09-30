import { Bed, Wifi, Coffee, Car } from 'lucide-react'
import Ornament from './shared/Ornament'

const variants = {
  classic: ClassicAccommodation,
  list: ListAccommodation,
  featured: FeaturedAccommodation,
  icons: IconsAccommodation,
}

export default function AccommodationSection({ data, style }) {
  const variantId = data.accommodationStyle || 'classic'
  const VariantComponent = variants[variantId] || ClassicAccommodation
  const hotels = data.hotels || [
    { name: 'Hotel Boutique El Jardín', address: 'Calle Principal 123', discount: '10% de descuento' },
    { name: 'Posada del Valle', address: 'Carretera Nacional km 5', discount: 'Transporte incluido' },
  ]
  return <VariantComponent hotels={hotels} data={data} style={style} />
}

function ClassicAccommodation({ hotels, style }) {
  return (
    <section className="px-6 py-10" style={{ backgroundColor: `${style.primary}04` }}>
      <div className="text-center space-y-4 mb-8">
        <Ornament color={style.secondary} variant={style.ornament} />
        <p className="text-xs tracking-[0.2em] uppercase" style={{ color: style.secondary }}>Hospedaje</p>
        <p className="text-sm leading-relaxed max-w-xs mx-auto" style={{ color: style.textMuted }}>Recomendaciones para invitados que vienen de fuera</p>
      </div>
      <div className="max-w-xs mx-auto space-y-4">
        {hotels.map((h, i) => (
          <div key={i} className="p-4 rounded-xl" style={{ backgroundColor: style.surface, border: `1px solid ${style.secondary}15` }}>
            <p className="text-sm font-semibold" style={{ color: style.text }}>{h.name}</p>
            <p className="text-xs mt-1" style={{ color: style.textMuted }}>{h.address}</p>
            {h.discount && <p className="text-[10px] mt-1 font-medium" style={{ color: style.secondary }}>{h.discount}</p>}
          </div>
        ))}
      </div>
      <Bed className="w-4 h-4 mx-auto mt-6" style={{ color: style.textMuted, opacity: 0.4 }} />
    </section>
  )
}

function ListAccommodation({ hotels, style }) {
  return (
    <section className="px-6 py-10" style={{ backgroundColor: style.bg }}>
      <div className="text-center space-y-4 mb-8">
        <p className="text-xs tracking-[0.2em] uppercase" style={{ color: style.secondary }}>Hospedaje</p>
      </div>
      <div className="max-w-xs mx-auto space-y-3">
        {hotels.map((h, i) => (
          <div key={i} className="flex items-center gap-3 py-3" style={{ borderBottom: `1px solid ${style.secondary}15` }}>
            <span className="text-[10px] font-bold shrink-0 w-5 h-5 rounded-full flex items-center justify-center" style={{ backgroundColor: `${style.secondary}20`, color: style.secondary }}>{i + 1}</span>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold" style={{ color: style.text }}>{h.name}</p>
              <p className="text-[10px]" style={{ color: style.textMuted }}>{h.address}</p>
            </div>
            {h.discount && <span className="text-[9px] font-medium shrink-0" style={{ color: style.secondary }}>{h.discount}</span>}
          </div>
        ))}
      </div>
    </section>
  )
}

function FeaturedAccommodation({ hotels, style }) {
  const isDark = style.id === 'gold-luxury' || style.id === 'celestial'
  return (
    <section className="px-6 py-10" style={{ backgroundColor: `${style.primary}04` }}>
      <div className="text-center space-y-4 mb-8">
        <Ornament color={style.secondary} variant={style.ornament} />
        <p className="text-xs tracking-[0.2em] uppercase" style={{ color: style.secondary }}>Hospedaje</p>
      </div>
      <div className="max-w-xs mx-auto space-y-3">
        {hotels.map((h, i) => (
          <div key={i} className={`rounded-xl overflow-hidden ${i === 0 ? 'ring-2' : ''}`} style={{ ringColor: style.secondary }}>
            <div className="p-4" style={{ backgroundColor: isDark ? `${style.surface}88` : '#fff' }}>
              {i === 0 && <p className="text-[8px] uppercase tracking-wider font-semibold mb-1" style={{ color: style.secondary }}>Recomendado</p>}
              <p className="text-sm font-semibold" style={{ color: style.text }}>{h.name}</p>
              <p className="text-xs mt-1" style={{ color: style.textMuted }}>{h.address}</p>
              {h.discount && <p className="text-[10px] mt-1 font-medium" style={{ color: style.secondary }}>{h.discount}</p>}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

function IconsAccommodation({ hotels, style }) {
  const icons = [Wifi, Coffee, Car]
  return (
    <section className="px-6 py-10" style={{ backgroundColor: style.bg }}>
      <div className="text-center space-y-4 mb-8">
        <p className="text-xs tracking-[0.2em] uppercase" style={{ color: style.secondary }}>Hospedaje</p>
      </div>
      <div className="max-w-xs mx-auto space-y-4">
        {hotels.map((h, i) => {
          const Icon = icons[i % icons.length]
          return (
            <div key={i} className="flex items-start gap-3 p-4 rounded-xl" style={{ backgroundColor: `${style.primary}04`, border: `1px solid ${style.secondary}15` }}>
              <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: `${style.secondary}15` }}>
                <Icon className="w-4 h-4" style={{ color: style.secondary }} />
              </div>
              <div>
                <p className="text-sm font-semibold" style={{ color: style.text }}>{h.name}</p>
                <p className="text-xs mt-0.5" style={{ color: style.textMuted }}>{h.address}</p>
                {h.discount && <p className="text-[10px] mt-1 font-medium" style={{ color: style.secondary }}>{h.discount}</p>}
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
