import { Gift } from 'lucide-react'
import Ornament from './shared/Ornament'

const variants = {
  classic: ClassicRegistry,
  card: CardRegistry,
  highlight: HighlightRegistry,
  detail: DetailRegistry,
}

export default function RegistrySection({ data, style }) {
  const variantId = data.registryStyle || 'classic'
  const VariantComponent = variants[variantId] || ClassicRegistry
  return <VariantComponent data={data} style={style} />
}

function ClassicRegistry({ data, style }) {
  return (
    <section className="px-6 py-10 text-center space-y-4" style={{ backgroundColor: style.bg }}>
      <Ornament color={style.secondary} variant={style.ornament} />
      <p className="text-xs tracking-[0.2em] uppercase" style={{ color: style.secondary }}>Mesa de Regalos</p>
      <p className="text-sm leading-relaxed max-w-xs mx-auto" style={{ color: style.textMuted }}>
        {data.registry || 'El mejor regalo es tu presencia, pero si deseas contribuir, tendremos una mesa de regalos disponible.'}
      </p>
      <Gift className="w-5 h-5 mx-auto" style={{ color: style.secondary }} />
    </section>
  )
}

function CardRegistry({ data, style }) {
  const isDark = style.id === 'gold-luxury' || style.id === 'celestial'
  return (
    <section className="px-6 py-10" style={{ backgroundColor: `${style.primary}04` }}>
      <div className="max-w-xs mx-auto p-5 rounded-xl text-center" style={{ backgroundColor: isDark ? `${style.surface}88` : '#fff', border: `1px solid ${style.secondary}22`, boxShadow: `0 4px 16px ${style.primary}08` }}>
        <Gift className="w-5 h-5 mx-auto mb-3" style={{ color: style.secondary }} />
        <p className="text-xs tracking-[0.2em] uppercase mb-1" style={{ color: style.secondary }}>Mesa de Regalos</p>
        <p className="text-sm leading-relaxed mt-3" style={{ color: style.textMuted }}>
          {data.registry || 'El mejor regalo es tu presencia, pero si deseas contribuir, tendremos una mesa de regalos disponible.'}
        </p>
      </div>
    </section>
  )
}

function HighlightRegistry({ data, style }) {
  return (
    <section className="px-6 py-10 text-center" style={{ backgroundColor: style.primary }}>
      <div className="max-w-xs mx-auto space-y-4">
        <Gift className="w-6 h-6 mx-auto" style={{ color: style.secondary }} />
        <p className="text-xs tracking-[0.2em] uppercase" style={{ color: style.secondary }}>Mesa de Regalos</p>
        <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.8)' }}>
          {data.registry || 'El mejor regalo es tu presencia, pero si deseas contribuir, tendremos una mesa de regalos disponible.'}
        </p>
      </div>
    </section>
  )
}

function DetailRegistry({ data, style }) {
  return (
    <section className="px-6 py-10" style={{ backgroundColor: style.bg }}>
      <div className="text-center space-y-4 max-w-xs mx-auto">
        <p className="text-xs tracking-[0.2em] uppercase" style={{ color: style.secondary }}>Mesa de Regalos</p>
        <div className="p-4 rounded-xl text-left" style={{ backgroundColor: `${style.primary}04`, border: `1px solid ${style.secondary}15` }}>
          <p className="text-xs leading-relaxed" style={{ color: style.textMuted }}>
            {data.registry || 'El mejor regalo es tu presencia, pero si deseas contribuir, tendremos una mesa de regalos disponible.'}
          </p>
        </div>
        <p className="text-[9px] italic" style={{ color: style.textMuted }}>Gracias por tu generosidad</p>
      </div>
    </section>
  )
}
