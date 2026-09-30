import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import ScrollReveal from '../common/ScrollReveal'

const faqs = [
  { q: '¿Cuánto tiempo se tarda en crear una web?', a: 'Entregamos la mayoría de proyectos en 48 horas. Proyectos más complejos pueden requerir algo más de tiempo, pero te mantendremos informado.' },
  { q: '¿Necesito conocimientos técnicos?', a: 'No, nos encargamos de todo. Tú solo necesitas contarnos tu idea y nosotros la hacemos realidad.' },
  { q: '¿Puedo actualizar la web yo mismo después?', a: 'Sí, dependiendo del plan incluimos un panel de administración para que puedas gestionar contenido fácilmente.' },
  { q: '¿Ofrecen hosting y dominio?', a: 'Sí, podemos gestionarlo por ti. Te ayudamos con la contratación y configuración de hosting y dominio.' },
  { q: '¿El diseño es responsive?', a: 'Todas nuestras webs están optimizadas para móviles, tablets y ordenadores.' },
  { q: '¿Qué incluye el mantenimiento?', a: 'El mantenimiento incluye actualizaciones de seguridad, copias de seguridad, soporte técnico y modificaciones menores.' },
]

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(null)

  return (
    <section className="py-20 lg:py-28 bg-gradient-section">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-sm font-semibold text-[#f5b342] uppercase tracking-[0.2em] font-body">FAQ</span>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-white mt-4 leading-tight tracking-tight">Preguntas <span className="text-gradient">frecuentes</span></h2>
          </div>
        </ScrollReveal>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <ScrollReveal key={i} delay={i * 0.05}>
              <div className={`bg-[#141414] rounded-xl border overflow-hidden transition-all duration-300 ${
                openIndex === i ? 'shadow-lg shadow-[#f5b342]/5 border-[#f5b342]/30' : 'border-[#1e1e1e] shadow-card hover:shadow-card-hover hover:border-[#2a2a2a]'
              }`}>
                <button
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  className="w-full flex items-center justify-between px-6 py-5 text-left"
                >
                  <span className="text-sm font-semibold text-white pr-4">{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-[#f5b342] shrink-0 transition-transform duration-300 ${openIndex === i ? 'rotate-180' : ''}`} />
                </button>
                <div className={`transition-all duration-300 overflow-hidden ${
                  openIndex === i ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}>
                  <p className="px-6 pb-5 text-sm text-[#5a5652] leading-relaxed">{faq.a}</p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
