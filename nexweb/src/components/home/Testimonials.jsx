import ScrollReveal from '../common/ScrollReveal'
import TestimonialCard from '../common/TestimonialCard'

const testimonials = [
  { name: 'María García', role: 'Dueña de La Trattoria', text: 'NexWeb transformó completamente nuestra presencia online. Ahora recibimos reservas a diario a través de la web. Increíble trabajo.', rating: 5 },
  { name: 'Carlos Méndez', role: 'Consultor financiero', text: 'Necesitaba una web profesional y rápida. En 48 horas la tenían lista. El diseño es exactamente lo que quería. Muy recomendados.', rating: 5 },
  { name: 'Ana López', role: 'CEO de FitZone', text: 'La plataforma es espectacular. Nuestros clientes nos encuentran fácilmente y las reservas online aumentaron un 60%.', rating: 5 },
]

export default function Testimonials() {
  return (
    <section className="py-20 lg:py-28 bg-[#111111] relative">
      <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #f5b342 1px, transparent 0)', backgroundSize: '32px 32px' }} />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-sm font-semibold text-[#f5b342] uppercase tracking-[0.2em] font-body">Testimonios</span>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-white mt-4 leading-tight tracking-tight">Lo que dicen nuestros <span className="text-gradient">clientes</span></h2>
            <p className="mt-5 text-lg text-[#5a5652]">La satisfacción de nuestros clientes es nuestra mejor carta de presentación.</p>
          </div>
        </ScrollReveal>
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto">
          {testimonials.map((t, i) => (
            <ScrollReveal key={t.name} delay={i * 0.15}>
              <TestimonialCard {...t} />
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
