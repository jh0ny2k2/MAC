import { TrendingUp, Users, ShoppingCart } from 'lucide-react'
import ScrollReveal from '../common/ScrollReveal'
import Button from '../common/Button'
import { ArrowRight } from 'lucide-react'

const caseStudies = [
  {
    title: 'La Trattoria',
    category: 'Restaurante',
    img: '/screenshots/mobel-design.png',
    metrics: [
      { icon: TrendingUp, value: '+150%', label: 'reservas online' },
      { icon: Users, value: '+2.800', label: 'visitas/mes' },
      { icon: ShoppingCart, value: '40%', label: 'más clientes' },
    ],
    quote: 'NexWeb transformó completamente nuestra presencia online. Ahora recibimos reservas a diario a través de la web. Increíble trabajo.',
    client: 'María García',
    role: 'Dueña de La Trattoria',
  },
  {
    title: 'FitZone',
    category: 'Gimnasio',
    img: '/screenshots/iron-forge.png',
    metrics: [
      { icon: TrendingUp, value: '+60%', label: 'altas online' },
      { icon: Users, value: '+4.500', label: 'visitas/mes' },
      { icon: ShoppingCart, value: '25%', label: 'retención' },
    ],
    quote: 'La plataforma es espectacular. Nuestros clientes nos encuentran fácilmente y las reservas online aumentaron un 60%.',
    client: 'Ana López',
    role: 'CEO de FitZone',
  },
  {
    title: 'ShopWave',
    category: 'E-commerce',
    img: '/screenshots/turbo-motors.png',
    metrics: [
      { icon: TrendingUp, value: '+200%', label: 'ventas online' },
      { icon: Users, value: '+6.000', label: 'visitas/mes' },
      { icon: ShoppingCart, value: '3.2%', label: 'tasa conversión' },
    ],
    quote: 'Pasamos de vender solo en tienda física a tener un e-commerce que ya factura más que el local. Increíble el trabajo de NexWeb.',
    client: 'Pedro Sánchez',
    role: 'CEO de ShopWave',
  },
]

export default function CaseStudies() {
  return (
    <section className="py-20 lg:py-28 bg-gradient-section relative">
      <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #f5b342 1px, transparent 0)', backgroundSize: '32px 32px' }} />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-sm font-semibold text-[#f5b342] uppercase tracking-[0.2em] font-body">Casos de Éxito</span>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-white mt-4 leading-tight tracking-tight">
              Resultados que <span className="text-gradient">hablan</span>
            </h2>
            <p className="mt-5 text-lg text-[#5a5652]">Mira cómo hemos ayudado a otros negocios a crecer con resultados medibles.</p>
          </div>
        </ScrollReveal>

        <div className="space-y-8">
          {caseStudies.map((study, i) => (
            <ScrollReveal key={study.title} delay={i * 0.15}>
              <div className="group grid lg:grid-cols-5 gap-8 items-center p-6 lg:p-8 rounded-2xl bg-[#141414] border border-[#1e1e1e] hover:border-[#2a2a2a] transition-all duration-500 hover:-translate-y-1 active:scale-[0.99]">
                <div className="lg:col-span-2 rounded-xl overflow-hidden h-48 lg:h-56 bg-[#0a0a0a]">
                  <img
                    src={study.img}
                    alt={study.title}
                    className="w-full h-full object-cover object-top transition-all duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
                <div className="lg:col-span-3">
                  <span className="text-xs font-semibold text-[#f5b342] uppercase tracking-wider">{study.category}</span>
                  <h3 className="text-2xl font-display font-bold text-white mt-1 mb-5">{study.title}</h3>

                  <div className="grid grid-cols-3 gap-3 mb-5">
                    {study.metrics.map((m) => (
                      <div key={m.label} className="text-center p-3 rounded-xl bg-[#0a0a0a] border border-[#1e1e1e]">
                        <m.icon className="w-4 h-4 text-[#f5b342] mx-auto mb-1" />
                        <p className="text-xl font-bold text-white">{m.value}</p>
                        <p className="text-[10px] text-[#5a5652] leading-tight mt-0.5">{m.label}</p>
                      </div>
                    ))}
                  </div>

                  <blockquote className="text-sm text-[#8a8682] italic border-l-2 border-[#f5b342]/40 pl-4 mb-2">
                    &ldquo;{study.quote}&rdquo;
                  </blockquote>
                  <p className="text-xs text-[#5a5652]">— {study.client}, <span className="text-[#8a8682]">{study.role}</span></p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal delay={0.4}>
          <div className="text-center mt-12">
            <Button to="/contacto" size="lg" icon={ArrowRight}>Consigue los mismos resultados</Button>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
