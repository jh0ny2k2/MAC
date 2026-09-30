import SEO from '../components/SEO'
import ScrollReveal from '../components/common/ScrollReveal'
import Button from '../components/common/Button'
import { ArrowRight, Search, CheckCircle, Sparkles } from 'lucide-react'
import ServiceGrid from '../components/services/ServiceGrid'

const seoSchema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebPage',
      '@id': 'https://newwebdesing.netlify.app/servicios#webpage',
      url: 'https://newwebdesing.netlify.app/servicios',
      name: 'Servicios de Diseño Web | NexWeb',
      description: 'Soluciones web profesionales para impulsar tu negocio: diseño web, desarrollo, SEO, tiendas online y más.',
      inLanguage: 'es',
      isPartOf: { '@id': 'https://newwebdesing.netlify.app/#website' },
      breadcrumb: { '@id': 'https://newwebdesing.netlify.app/servicios#breadcrumb' },
    },
    {
      '@type': 'BreadcrumbList',
      '@id': 'https://newwebdesing.netlify.app/servicios#breadcrumb',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://newwebdesing.netlify.app/' },
        { '@type': 'ListItem', position: 2, name: 'Servicios', item: 'https://newwebdesing.netlify.app/servicios' },
      ],
    },
  ],
}

export default function Services() {
  return (
    <div className="pt-20">
      <SEO
        title="Servicios de Diseño Web Profesional"
        description="Descubre nuestros servicios de diseño web, desarrollo, tiendas online, SEO y marketing digital. Soluciones profesionales para impulsar tu negocio en internet."
        keywords="servicios web, diseño web profesional, desarrollo web, tiendas online, SEO, marketing digital, creación de páginas web"
        url="/servicios"
        type="website"
        schema={seoSchema}
      />
      <section className="py-20 lg:py-28 bg-gradient-dark noise-bg relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #f5b342 1px, transparent 0)', backgroundSize: '48px 48px' }} />
        <div className="absolute top-1/3 -left-32 w-[400px] h-[400px] bg-[#f5b342]/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/3 -right-32 w-[400px] h-[400px] bg-[#f08a3a]/5 rounded-full blur-[120px]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-display font-extrabold text-white leading-tight mb-6 tracking-tight">
                Nuestros <span className="text-gradient">servicios</span>
              </h1>
              <p className="text-lg text-[#5a5652] mb-8 max-w-xl mx-auto">
                Soluciones web profesionales para impulsar tu negocio en el mundo digital.
              </p>
              <Button to="/contacto" size="xl" icon={ArrowRight}>Solicitar presupuesto</Button>
            </div>
          </ScrollReveal>
        </div>
      </section>
      <ServiceGrid />
      <section className="py-20 lg:py-28 bg-gradient-section relative">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Search, title: 'Auditoría gratuita', desc: 'Analizamos tu competencia y tu mercado para ofrecerte la mejor solución.' },
              { icon: CheckCircle, title: 'Calidad garantizada', desc: 'Revisamos cada detalle antes de lanzar tu web para asegurar la máxima calidad.' },
              { icon: Sparkles, title: 'Soporte post-lanzamiento', desc: 'Seguimos contigo después del lanzamiento para asegurarnos de que todo funcione.' },
            ].map((item, i) => (
              <ScrollReveal key={item.title} delay={i * 0.12}>
                <div className="text-center p-8">
                  <div className="w-14 h-14 rounded-xl bg-[#f5b342]/10 flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform duration-500">
                    <item.icon className="w-6 h-6 text-[#f5b342]" />
                  </div>
                  <h3 className="text-lg font-display font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-sm text-[#5a5652] leading-relaxed">{item.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
