import { Zap, Shield, Palette, Gauge, Smartphone, Headphones } from 'lucide-react'
import ScrollReveal from '../common/ScrollReveal'

const benefits = [
  { icon: Zap, title: 'Rapidez', desc: 'Entregamos tu web en 48 horas. Sin largas esperas ni procesos eternos.' },
  { icon: Shield, title: 'Profesional', desc: 'Diseños modernos y pulidos que generan confianza en tus clientes.' },
  { icon: Palette, title: 'Personalizado', desc: 'Cada web es única, adaptada a tu marca y a tus necesidades.' },
  { icon: Gauge, title: 'Optimizado', desc: 'Velocidad de carga ultrarrápida y rendimiento impecable.' },
  { icon: Smartphone, title: 'Responsive', desc: 'Tu web se verá perfecta en móvil, tablet y escritorio.' },
  { icon: Headphones, title: 'Soporte', desc: 'Te acompañamos antes, durante y después del lanzamiento.' },
]

export default function Benefits() {
  return (
    <section className="py-20 lg:py-28 bg-[#0a0a0a] relative">
      <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #f5b342 1px, transparent 0)', backgroundSize: '32px 32px' }} />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-sm font-semibold text-[#f5b342] uppercase tracking-[0.2em] font-body">Beneficios</span>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-white mt-4 leading-tight tracking-tight">
              ¿Por qué elegir <span className="text-gradient">NexWeb</span>?
            </h2>
            <p className="mt-5 text-lg text-[#5a5652] leading-relaxed">No solo creamos webs, creamos experiencias digitales que impulsan tu negocio.</p>
          </div>
        </ScrollReveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {benefits.map((benefit, i) => (
            <ScrollReveal key={benefit.title} delay={i * 0.1}>
              <div className="group relative p-8 rounded-xl bg-[#141414] border border-[#1e1e1e] shadow-card hover:shadow-card-hover hover:-translate-y-1.5 transition-all duration-500 active:scale-[0.98]">
                <div className="w-14 h-14 rounded-xl bg-[#f5b342]/10 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-[#f5b342]/20 transition-all duration-500">
                  <benefit.icon className="w-6 h-6 text-[#f5b342]" />
                </div>
                <h3 className="text-xl font-display font-bold text-white mb-3 group-hover:text-[#f5b342] transition-colors duration-200">{benefit.title}</h3>
                <p className="text-[#5a5652] leading-relaxed">{benefit.desc}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
