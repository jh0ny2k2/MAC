import SEO from '../components/SEO'
import { Target, Heart, Lightbulb, Users, ArrowRight } from 'lucide-react'
import ScrollReveal from '../components/common/ScrollReveal'
import Button from '../components/common/Button'

const seoSchema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'AboutPage',
      '@id': 'https://newwebdesing.netlify.app/sobre-nosotros#webpage',
      url: 'https://newwebdesing.netlify.app/sobre-nosotros',
      name: 'Sobre NexWeb - Agencia de Diseño Web',
      description: 'Conoce al equipo de NexWeb. Apasionados por crear experiencias digitales que impulsan negocios. Más de 100 proyectos realizados.',
      inLanguage: 'es',
      isPartOf: { '@id': 'https://newwebdesing.netlify.app/#website' },
      breadcrumb: { '@id': 'https://newwebdesing.netlify.app/sobre-nosotros#breadcrumb' },
    },
    {
      '@type': 'BreadcrumbList',
      '@id': 'https://newwebdesing.netlify.app/sobre-nosotros#breadcrumb',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://newwebdesing.netlify.app/' },
        { '@type': 'ListItem', position: 2, name: 'Sobre NexWeb', item: 'https://newwebdesing.netlify.app/sobre-nosotros' },
      ],
    },
  ],
}

const values = [
  { icon: Target, title: 'Compromiso', desc: 'Cada proyecto es importante para nosotros. Nos implicamos como si fuera nuestro.' },
  { icon: Heart, title: 'Pasión', desc: 'Amamos lo que hacemos. Eso se nota en cada web que creamos.' },
  { icon: Lightbulb, title: 'Innovación', desc: 'Siempre estamos al día de las últimas tendencias y tecnologías.' },
  { icon: Users, title: 'Cercanía', desc: 'Creemos en el trato humano y la comunicación directa con cada cliente.' },
]

const team = [
  { name: 'Jhonathan Chaves', role: 'CEO & Fundador', initials: 'JC' },
  { name: 'Julia Martínez', role: 'Project Manager', initials: 'JM' },
]

export default function About() {
  return (
    <div className="pt-20">
      <SEO
        title="Sobre NexWeb - Agencia de Diseño Web Profesional"
        description="Conoce al equipo de NexWeb. Somos apasionados por crear experiencias digitales que impulsan negocios. Más de 100 proyectos realizados con éxito."
        keywords="sobre NexWeb, agencia diseño web, equipo diseño web, nosotros, agencia web profesional"
        url="/sobre-nosotros"
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
                Sobre <span className="text-gradient">NexWeb</span>
              </h1>
              <p className="text-lg text-[#5a5652] mb-8 max-w-xl mx-auto">
                Somos un equipo apasionado por crear experiencias digitales que impulsan negocios.
              </p>
              <Button to="/contacto" size="lg" icon={ArrowRight}>Trabaja con nosotros</Button>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <section className="py-20 lg:py-28 bg-gradient-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <ScrollReveal>
              <div>
                <span className="text-sm font-semibold text-[#f5b342] uppercase tracking-[0.2em] font-body">Nuestra historia</span>
                <h2 className="text-4xl sm:text-5xl font-display font-bold text-white mt-4 leading-tight tracking-tight mb-6">
                  Creamos webs que <span className="text-gradient">transforman</span> negocios
                </h2>
                <div className="space-y-4 text-[#5a5652] leading-relaxed">
                  <p>NexWeb nació con una misión clara: democratizar la creación de páginas web profesionales. Creemos que cualquier negocio, independientemente de su tamaño, merece tener una presencia digital de calidad.</p>
                  <p>Desde nuestros inicios, hemos ayudado a más de 100 negocios a establecer su presencia online con webs modernas, rápidas y efectivas.</p>
                  <p>Nuestro equipo combina diseño, tecnología y estrategia para ofrecer soluciones que realmente funcionan.</p>
                </div>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={0.15}>
              <div className="space-y-6">
                {team.map((m) => (
                  <div key={m.name} className="flex items-center gap-6 p-4 bg-[#141414] rounded-xl border border-[#1e1e1e]">
                    <div className="w-14 h-14 rounded-full bg-gradient-accent flex items-center justify-center text-[#0a0a0a] font-bold text-lg shrink-0 shadow-lg shadow-[#f5b342]/20">
                      {m.initials}
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-white">{m.name}</h3>
                      <p className="text-sm text-[#5a5652]">{m.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-28 bg-[#111111]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-4xl sm:text-5xl font-display font-bold text-white leading-tight tracking-tight">Nuestros <span className="text-gradient">valores</span></h2>
              <p className="mt-4 text-[#5a5652]">Los principios que guían cada proyecto que hacemos.</p>
            </div>
          </ScrollReveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {values.map((v, i) => (
              <ScrollReveal key={v.title} delay={i * 0.1}>
                <div className="p-8 rounded-xl bg-[#141414] border border-[#1e1e1e] shadow-card text-center group hover:shadow-card-hover hover:-translate-y-1.5 transition-all duration-500">
                  <div className="w-14 h-14 rounded-xl bg-[#f5b342]/10 flex items-center justify-center mx-auto mb-5 group-hover:scale-110 group-hover:bg-[#f5b342]/20 transition-all duration-500">
                    <v.icon className="w-6 h-6 text-[#f5b342]" />
                  </div>
                  <h3 className="text-lg font-display font-bold text-white mb-2">{v.title}</h3>
                  <p className="text-sm text-[#5a5652] leading-relaxed">{v.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
