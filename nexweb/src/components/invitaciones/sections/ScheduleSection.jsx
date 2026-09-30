import { Clock } from 'lucide-react'
import Ornament from './shared/Ornament'

const variants = {
  classic: ClassicSchedule,
  cards: CardsSchedule,
  minimal: MinimalSchedule,
  circles: CirclesSchedule,
}

export default function ScheduleSection({ data, style }) {
  const variantId = data.scheduleStyle || 'classic'
  const VariantComponent = variants[variantId] || ClassicSchedule
  const items = data.schedule || [
    { time: '16:00', title: 'Ceremonia', desc: 'Iglesia San Miguel' },
    { time: '17:00', title: 'Cóctel', desc: 'Jardines de la Hacienda' },
    { time: '19:00', title: 'Cena', desc: 'Salón principal' },
    { time: '21:00', title: 'Fiesta', desc: 'Pista de baile' },
  ]
  return <VariantComponent items={items} data={data} style={style} />
}

function ClassicSchedule({ items, style }) {
  return (
    <section className="px-6 py-10" style={{ backgroundColor: style.bg }}>
      <div className="text-center space-y-4 mb-8">
        <Ornament color={style.secondary} variant={style.ornament} />
        <p className="text-xs tracking-[0.2em] uppercase" style={{ color: style.secondary }}>Cronograma</p>
      </div>
      <div className="max-w-xs mx-auto space-y-4">
        {items.map((item, i) => (
          <div key={i} className="flex items-start gap-4">
            <div className="shrink-0 w-16 text-right">
              <span className="text-xs font-bold" style={{ color: style.secondary }}>{item.time}</span>
            </div>
            <div className="w-px h-10 shrink-0" style={{ backgroundColor: style.secondary, opacity: 0.2 }} />
            <div>
              <p className="text-sm font-semibold" style={{ color: style.text }}>{item.title}</p>
              {item.desc && <p className="text-xs mt-0.5" style={{ color: style.textMuted }}>{item.desc}</p>}
            </div>
          </div>
        ))}
      </div>
      <Clock className="w-4 h-4 mx-auto mt-6" style={{ color: style.textMuted, opacity: 0.4 }} />
    </section>
  )
}

function CardsSchedule({ items, style }) {
  const isDark = style.id === 'gold-luxury' || style.id === 'celestial'
  return (
    <section className="px-6 py-10" style={{ backgroundColor: `${style.primary}04` }}>
      <div className="text-center space-y-4 mb-8">
        <Ornament color={style.secondary} variant={style.ornament} />
        <p className="text-xs tracking-[0.2em] uppercase" style={{ color: style.secondary }}>Cronograma</p>
      </div>
      <div className="max-w-xs mx-auto space-y-3">
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-4 p-3 rounded-xl" style={{ backgroundColor: isDark ? `${style.surface}88` : '#fff', border: `1px solid ${style.secondary}22`, boxShadow: `0 2px 8px ${style.primary}08` }}>
            <div className="shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold" style={{ backgroundColor: style.primary, color: '#fff' }}>
              {String(i + 1).padStart(2, '0')}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold tracking-[0.1em] uppercase" style={{ color: style.text }}>{item.title}</p>
              <p className="text-[10px] font-semibold mt-0.5" style={{ color: style.secondary }}>{item.time}</p>
              {item.desc && <p className="text-[10px] mt-0.5" style={{ color: style.textMuted }}>{item.desc}</p>}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

function MinimalSchedule({ items, style }) {
  return (
    <section className="px-6 py-10" style={{ backgroundColor: style.bg }}>
      <div className="text-center space-y-4 mb-8">
        <p className="text-[9px] tracking-[0.3em] uppercase font-semibold" style={{ color: style.secondary }}>Cronograma</p>
        <div className="w-8 h-px mx-auto" style={{ backgroundColor: `${style.secondary}33` }} />
      </div>
      <div className="max-w-xs mx-auto space-y-3">
        {items.map((item, i) => (
          <div key={i} className="flex items-baseline gap-3 pb-3" style={{ borderBottom: i < items.length - 1 ? `1px solid ${style.secondary}15` : 'none' }}>
            <span className="text-xs font-bold shrink-0" style={{ color: style.secondary }}>{item.time}</span>
            <span className="text-xs" style={{ color: style.textMuted }}>{item.title}</span>
          </div>
        ))}
      </div>
    </section>
  )
}

function CirclesSchedule({ items, style }) {
  return (
    <section className="px-6 py-10" style={{ backgroundColor: `${style.primary}04` }}>
      <div className="text-center space-y-4 mb-8">
        <Ornament color={style.secondary} variant={style.ornament} />
        <p className="text-xs tracking-[0.2em] uppercase" style={{ color: style.secondary }}>Cronograma</p>
      </div>
      <div className="max-w-xs mx-auto">
        <div className="relative">
          <div className="absolute left-[19px] top-8 bottom-8 w-px" style={{ backgroundColor: style.secondary, opacity: 0.2 }} />
          <div className="space-y-6">
            {items.map((item, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="shrink-0 w-[38px] h-[38px] rounded-full flex items-center justify-center text-[10px] font-bold border-2" style={{ borderColor: style.secondary, color: style.secondary, backgroundColor: style.bg }}>
                  {item.time?.split(':')[0]}
                </div>
                <div>
                  <p className="text-sm font-semibold" style={{ color: style.text }}>{item.title}</p>
                  {item.desc && <p className="text-xs mt-0.5" style={{ color: style.textMuted }}>{item.desc}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
