import { Globe, ShoppingCart, Layout, FileText, ArrowRight, Clock } from 'lucide-react'
import ScrollReveal from '../common/ScrollReveal'
import Button from '../common/Button'

const services = [
  { icon: Globe, title: 'Web Corporativa', desc: 'Presencia digital profesional con diseño moderno y adaptado a tu marca. Ideal para empresas y negocios.', features: ['Diseño personalizado', 'SEO básico', 'Formulario contacto', 'Responsive'], price: 'Desde 299€' },
  { icon: ShoppingCart, title: 'Tienda Online', desc: 'Vende tus productos con una tienda online optimizada para conversión y fácil de gestionar.', features: ['Catálogo productos', 'Carrito compra', 'Pasarela pago', 'Gestión pedidos'], price: 'Desde 599€' },
  { icon: Layout, title: 'Landing Page', desc: 'Páginas de alto impacto diseñadas para campañas, lanzamientos y captación de leads.', features: ['Diseño persuasivo', 'CTA optimizados', 'Analítica', 'A/B testing'], price: 'Desde 299€' },
  { icon: FileText, title: 'Blog Profesional', desc: 'Comparte conocimiento y posiciona tu marca con un blog moderno y optimizado.', features: ['Gestor contenido', 'Categorías', 'Comentarios', 'RSS'], price: 'Desde 299€' },
]

export default function ServiceGrid() {
  return (
    <section className="py-20 lg:py-28 bg-gradient-section relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-sm font-semibold text-[#f5b342] uppercase tracking-[0.2em] font-body">Servicios</span>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-white mt-4 leading-tight tracking-tight">
              Todo lo que necesitas en un solo <span className="text-gradient">lugar</span>
            </h2>
            <p className="mt-5 text-lg text-[#5a5652]">Soluciones completas para tu presencia digital.</p>
          </div>
        </ScrollReveal>

        <div className="flex items-center justify-center gap-3 mb-10">
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#f5b342]/10 border border-[#f5b342]/20">
            <Clock className="w-4 h-4 text-[#f5b342]" />
            <span className="text-sm text-[#f5b342] font-medium">Entrega en 48h — ¡Plazas limitadas este mes!</span>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
          {services.map((service, i) => (
            <ScrollReveal key={service.title} delay={i * 0.12}>
              <div className="group p-8 lg:p-10 rounded-xl bg-[#141414] border border-[#1e1e1e] shadow-card hover:shadow-card-hover hover:-translate-y-1.5 transition-all duration-500">
                <div className="flex items-start gap-6">
                  <div className="w-14 h-14 rounded-xl bg-[#f5b342]/10 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-[#f5b342]/20 transition-all duration-500">
                    <service.icon className="w-6 h-6 text-[#f5b342]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <h3 className="text-xl font-display font-bold text-white group-hover:text-[#f5b342] transition-colors">{service.title}</h3>
                      <span className="text-sm font-bold text-[#f5b342] whitespace-nowrap">{service.price}</span>
                    </div>
                    <p className="text-[#5a5652] text-sm leading-relaxed mb-4">{service.desc}</p>
                    <ul className="grid grid-cols-2 gap-2 mb-6">
                      {service.features.map((f) => (
                        <li key={f} className="flex items-center gap-2 text-xs text-[#5a5652]">
                          <span className="w-1 h-1 rounded-full bg-[#f5b342]/60" />
                          {f}
                        </li>
                      ))}
                    </ul>
                    <Button to="/contacto" variant="ghost" size="sm" icon={ArrowRight}>Solicitar presupuesto</Button>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal delay={0.3}>
          <div className="text-center mt-12 p-8 rounded-2xl bg-[#141414] border border-[#1e1e1e] max-w-2xl mx-auto">
            <p className="text-white font-display font-bold text-lg mb-2">¿No sabes qué necesitas?</p>
            <p className="text-[#5a5652] text-sm mb-5">Te asesoramos sin compromiso. Te regalamos una auditoría gratuita de tu proyecto.</p>
            <Button to="/contacto" size="lg" icon={ArrowRight}>Hablar con un asesor</Button>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
