import { HelpCircle } from 'lucide-react'
import Ornament from './shared/Ornament'

const variants = {
  accordion: AccordionFaq,
  list: ListFaq,
  grid: GridFaq,
  minimal: MinimalFaq,
}

const DEFAULT_FAQS = [
  { q: '¿Puedo llevar acompañante?', a: 'Sí, siempre que lo hayas indicado en la confirmación de asistencia.' },
  { q: '¿Hay estacionamiento?', a: 'Sí, contamos con estacionamiento privado con cupo limitado.' },
  { q: '¿La ceremonia será al aire libre?', a: 'La ceremonia será en el jardín principal. Recomendamos llevar calzado cómodo.' },
]

export default function FaqSection({ data, style }) {
  const variantId = data.faqStyle || 'accordion'
  const VariantComponent = variants[variantId] || AccordionFaq
  const faqs = data.faqs || DEFAULT_FAQS
  return <VariantComponent faqs={faqs} data={data} style={style} />
}

function AccordionFaq({ faqs, style }) {
  const isDark = style.id === 'gold-luxury'
  return (
    <section className="px-6 py-10" style={{ backgroundColor: isDark ? style.surface : `${style.primary}04` }}>
      <div className="text-center space-y-4 mb-8">
        <Ornament color={style.secondary} variant={style.ornament} />
        <p className="text-xs tracking-[0.2em] uppercase" style={{ color: style.secondary }}>Preguntas Frecuentes</p>
      </div>
      <div className="max-w-xs mx-auto space-y-3">
        {faqs.map((faq, i) => (
          <details key={i} className="group rounded-xl overflow-hidden" style={{ backgroundColor: isDark ? '#0A0A0A' : style.surface }}>
            <summary className="flex items-center justify-between px-4 py-3 cursor-pointer text-xs font-medium list-none" style={{ color: style.text }}>
              {faq.q}
              <HelpCircle className="w-3 h-3 shrink-0 ml-2 transition-transform group-open:rotate-180" style={{ color: style.secondary }} />
            </summary>
            <div className="px-4 pb-3 text-xs leading-relaxed" style={{ color: style.textMuted }}>{faq.a}</div>
          </details>
        ))}
      </div>
    </section>
  )
}

function ListFaq({ faqs, style }) {
  const isDark = style.id === 'gold-luxury' || style.id === 'celestial'
  return (
    <section className="px-6 py-10" style={{ backgroundColor: style.bg }}>
      <div className="text-center space-y-4 mb-8">
        <Ornament color={style.secondary} variant={style.ornament} />
        <p className="text-xs tracking-[0.2em] uppercase" style={{ color: style.secondary }}>Preguntas Frecuentes</p>
      </div>
      <div className="max-w-xs mx-auto space-y-4">
        {faqs.map((faq, i) => (
          <div key={i}>
            <p className="text-xs font-semibold mb-1 flex items-start gap-2" style={{ color: style.text }}>
              <span className="text-[9px] mt-0.5 shrink-0" style={{ color: style.secondary }}>Q:</span>
              {faq.q}
            </p>
            <p className="text-xs pl-4" style={{ color: style.textMuted }}>{faq.a}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

function GridFaq({ faqs, style }) {
  return (
    <section className="px-6 py-10" style={{ backgroundColor: `${style.primary}04` }}>
      <div className="text-center space-y-4 mb-8">
        <Ornament color={style.secondary} variant={style.ornament} />
        <p className="text-xs tracking-[0.2em] uppercase" style={{ color: style.secondary }}>Preguntas Frecuentes</p>
      </div>
      <div className="max-w-xs mx-auto grid grid-cols-1 gap-2">
        {faqs.map((faq, i) => (
          <div key={i} className="p-3 rounded-lg" style={{ backgroundColor: style.surface, border: `1px solid ${style.secondary}15` }}>
            <p className="text-[10px] font-semibold mb-1" style={{ color: style.text }}>{faq.q}</p>
            <p className="text-[10px]" style={{ color: style.textMuted }}>{faq.a}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

function MinimalFaq({ faqs, style }) {
  return (
    <section className="px-6 py-10" style={{ backgroundColor: style.bg }}>
      <div className="text-center space-y-4 mb-8">
        <p className="text-[9px] tracking-[0.3em] uppercase font-semibold" style={{ color: style.secondary }}>Preguntas Frecuentes</p>
      </div>
      <div className="max-w-xs mx-auto divide-y" style={{ borderColor: `${style.secondary}15` }}>
        {faqs.map((faq, i) => (
          <div key={i} className="py-3 first:pt-0 last:pb-0">
            <p className="text-xs font-medium" style={{ color: style.text }}>{faq.q}</p>
            <p className="text-xs mt-1" style={{ color: style.textMuted }}>{faq.a}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
