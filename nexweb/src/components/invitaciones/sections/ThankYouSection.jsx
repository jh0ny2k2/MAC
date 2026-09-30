import { Heart } from 'lucide-react'
import Ornament from './shared/Ornament'

const variants = {
  classic: ClassicThankYou,
  letter: LetterThankYou,
  photo: PhotoThankYou,
  minimal: MinimalThankYou,
}

export default function ThankYouSection({ data, style }) {
  const variantId = data.thankYouStyle || 'classic'
  const VariantComponent = variants[variantId] || ClassicThankYou
  return <VariantComponent data={data} style={style} />
}

function ClassicThankYou({ data, style }) {
  const isDark = style.id === 'gold-luxury' || style.id === 'celestial'
  return (
    <section className="px-6 py-12 text-center space-y-4" style={{ backgroundColor: isDark ? style.surface : style.primary }}>
      <Heart className="w-5 h-5 mx-auto" style={{ color: isDark ? style.secondary : '#fff', opacity: 0.8 }} />
      <p className="text-lg font-serif" style={{ color: isDark ? style.text : '#fff' }}>¡Gracias!</p>
      <p className="text-xs leading-relaxed max-w-xs mx-auto" style={{ color: isDark ? style.textMuted : 'rgba(255,255,255,0.75)' }}>
        Agradecemos de corazón que nos acompañes en este día tan especial. Tu presencia es el mejor regalo.
      </p>
      <p className="text-xs font-semibold" style={{ color: isDark ? style.secondary : '#fff' }}>Con amor,</p>
      <p className="text-sm uppercase tracking-[0.3em]" style={{ color: isDark ? style.text : '#fff' }}>
        {data.nombre_novio || 'Carlos'} & {data.nombre_novia || 'María'}
      </p>
    </section>
  )
}

function LetterThankYou({ data, style }) {
  const isDark = style.id === 'gold-luxury' || style.id === 'celestial'
  return (
    <section className="px-6 py-10" style={{ backgroundColor: `${style.primary}04` }}>
      <div className="max-w-xs mx-auto p-5 rounded-xl space-y-4" style={{ backgroundColor: isDark ? style.surface : '#fff', border: `1px solid ${style.secondary}22` }}>
        <Ornament color={style.secondary} variant={style.ornament} />
        <p className="text-base font-serif text-center" style={{ color: style.text }}>Gracias</p>
        <p className="text-xs leading-relaxed text-center" style={{ color: style.textMuted }}>
          Agradecemos de corazón que nos acompañes en este día tan especial. Tu presencia es el mejor regalo.
        </p>
        <p className="text-[10px] text-center font-semibold" style={{ color: style.secondary }}>Con cariño,</p>
        <p className="text-xs text-center font-medium" style={{ color: style.text }}>
          {data.nombre_novio || 'Carlos'} & {data.nombre_novia || 'María'}
        </p>
      </div>
    </section>
  )
}

function PhotoThankYou({ data, style }) {
  const heroImg = data.heroImg || 'https://images.unsplash.com/photo-1519741497674-611481863552?w=400&q=80'
  return (
    <section className="relative px-6 py-16 text-center space-y-3 overflow-hidden" style={{ backgroundColor: style.primary }}>
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${heroImg})`, opacity: 0.25 }} />
      <div className="relative z-10">
        <p className="text-lg font-serif text-white">¡Gracias!</p>
        <p className="text-xs leading-relaxed max-w-xs mx-auto" style={{ color: 'rgba(255,255,255,0.8)' }}>
          Gracias por ser parte de nuestra historia.
        </p>
        <p className="text-xs mt-4 font-semibold uppercase tracking-[0.3em]" style={{ color: 'rgba(255,255,255,0.9)' }}>
          {data.nombre_novio || 'Carlos'} & {data.nombre_novia || 'María'}
        </p>
      </div>
    </section>
  )
}

function MinimalThankYou({ data, style }) {
  return (
    <section className="px-6 py-10 text-center space-y-3" style={{ backgroundColor: style.bg }}>
      <p className="text-sm" style={{ color: style.textMuted }}>Gracias por acompañarnos</p>
      <p className="text-xs tracking-[0.3em] uppercase" style={{ color: style.secondary }}>
        {data.nombre_novio || 'Carlos'} & {data.nombre_novia || 'María'}
      </p>
    </section>
  )
}
