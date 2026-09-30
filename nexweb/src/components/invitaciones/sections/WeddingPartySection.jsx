import { Users } from 'lucide-react'
import Ornament from './shared/Ornament'

const variants = {
  classic: ClassicWeddingParty,
  grid: GridWeddingParty,
  circles: CirclesWeddingParty,
  minimal: MinimalWeddingParty,
}

export default function WeddingPartySection({ data, style }) {
  const variantId = data.weddingPartyStyle || 'classic'
  const VariantComponent = variants[variantId] || ClassicWeddingParty
  const members = data.weddingParty || [
    { name: 'María & Juan', role: 'Padrinos de Velación' },
    { name: 'Laura & Pedro', role: 'Padrinos de Arras' },
    { name: 'Sofía & Diego', role: 'Damas de Honor' },
  ]
  return <VariantComponent members={members} data={data} style={style} />
}

function ClassicWeddingParty({ members, style }) {
  return (
    <section className="px-6 py-10 text-center space-y-6" style={{ backgroundColor: style.bg }}>
      <Ornament color={style.secondary} variant={style.ornament} />
      <p className="text-xs tracking-[0.2em] uppercase" style={{ color: style.secondary }}>Cortejo</p>
      <div className="max-w-xs mx-auto space-y-4">
        {members.map((m, i) => (
          <div key={i} className="p-3 rounded-xl" style={{ backgroundColor: `${style.primary}06`, border: `1px solid ${style.secondary}15` }}>
            <p className="text-sm font-semibold" style={{ color: style.text }}>{m.name}</p>
            <p className="text-[10px] uppercase tracking-wider mt-0.5" style={{ color: style.secondary }}>{m.role}</p>
          </div>
        ))}
      </div>
      <Users className="w-4 h-4 mx-auto" style={{ color: style.textMuted, opacity: 0.4 }} />
    </section>
  )
}

function GridWeddingParty({ members, style }) {
  return (
    <section className="px-6 py-10" style={{ backgroundColor: `${style.primary}04` }}>
      <div className="text-center space-y-4 mb-8">
        <Ornament color={style.secondary} variant={style.ornament} />
        <p className="text-xs tracking-[0.2em] uppercase" style={{ color: style.secondary }}>Cortejo</p>
      </div>
      <div className="grid grid-cols-2 gap-3 max-w-xs mx-auto">
        {members.map((m, i) => (
          <div key={i} className="p-3 rounded-xl text-center" style={{ backgroundColor: style.surface, border: `1px solid ${style.secondary}15` }}>
            <p className="text-xs font-semibold" style={{ color: style.text }}>{m.name}</p>
            <p className="text-[9px] uppercase tracking-wider mt-1" style={{ color: style.secondary }}>{m.role}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

function CirclesWeddingParty({ members, style }) {
  const initials = (name) => name.split(' & ').map(n => n.charAt(0)).join('') || name.charAt(0)
  return (
    <section className="px-6 py-10 text-center" style={{ backgroundColor: style.bg }}>
      <div className="text-center space-y-4 mb-8">
        <Ornament color={style.secondary} variant={style.ornament} />
        <p className="text-xs tracking-[0.2em] uppercase" style={{ color: style.secondary }}>Cortejo</p>
      </div>
      <div className="flex flex-wrap justify-center gap-4 max-w-xs mx-auto">
        {members.map((m, i) => (
          <div key={i} className="text-center" style={{ width: '80px' }}>
            <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-2 text-sm font-bold" style={{ backgroundColor: style.primary, color: '#fff' }}>
              {initials(m.name)}
            </div>
            <p className="text-[10px] font-semibold" style={{ color: style.text }}>{m.name}</p>
            <p className="text-[8px] uppercase tracking-wider mt-0.5" style={{ color: style.secondary }}>{m.role}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

function MinimalWeddingParty({ members, style }) {
  return (
    <section className="px-6 py-10" style={{ backgroundColor: `${style.primary}04` }}>
      <div className="text-center space-y-4 mb-8">
        <p className="text-[9px] tracking-[0.3em] uppercase font-semibold" style={{ color: style.secondary }}>Cortejo</p>
      </div>
      <div className="max-w-xs mx-auto divide-y" style={{ borderColor: `${style.secondary}15` }}>
        {members.map((m, i) => (
          <div key={i} className="flex justify-between items-center py-2">
            <span className="text-xs font-medium" style={{ color: style.text }}>{m.name}</span>
            <span className="text-[9px]" style={{ color: style.secondary }}>{m.role}</span>
          </div>
        ))}
      </div>
    </section>
  )
}
