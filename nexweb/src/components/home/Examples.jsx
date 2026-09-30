import { ExternalLink, ArrowRight } from 'lucide-react'
import ScrollReveal from '../common/ScrollReveal'
import Button from '../common/Button'

const examples = [
  { title: 'Møbel Design', category: 'Muebles', img: '/screenshots/mobel-design.png', desc: 'E-commerce minimalista con diseño nórdico y galería masonry.', url: 'https://jcportofolio.netlify.app/15-furniture-design/' },
  { title: 'Obsidian', category: 'Automoción', img: '/screenshots/obsidian.png', desc: 'Detailing premium con slider antes/después.', url: 'https://jcportofolio.netlify.app/20-car-detailing/' },
  { title: 'Iron Forge', category: 'Gimnasio', img: '/screenshots/iron-forge.png', desc: 'CrossFit gym con diseño bold, alto contraste y energía.', url: 'https://jcportofolio.netlify.app/08-crossfit-gym/' },
  { title: 'Turbo Motors', category: 'Automoción', img: '/screenshots/turbo-motors.png', desc: 'Concesionario con estilo brutalista y alta conversión.', url: 'https://jcportofolio.netlify.app/10-used-cars/' },
  { title: "The Gentleman's Cut", category: 'Barbería', img: '/screenshots/gentlemans-cut.png', desc: 'Barbería premium con estética oscura y dorada.', url: 'https://jcportofolio.netlify.app/17-modern-barbershop/' },
  { title: 'Sarah & Daniel', category: 'Bodas', img: '/screenshots/sarah-daniel.png', desc: 'Invitación de boda etérea con storytelling y countdown.', url: 'https://jcportofolio.netlify.app/16-wedding-invite/' },
]

export default function Examples() {
  return (
    <section className="py-20 lg:py-28 bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-sm font-semibold text-[#f5b342] uppercase tracking-[0.2em] font-body">Ejemplos</span>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-white mt-4 leading-tight tracking-tight">Webs que <span className="text-gradient">hablan</span> por sí solas</h2>
            <p className="mt-5 text-lg text-[#5a5652]">Mira algunos de los proyectos que hemos creado para nuestros clientes.</p>
          </div>
        </ScrollReveal>

        <div className="grid sm:grid-cols-2 gap-8 lg:gap-10">
          {examples.map((item, i) => (
            <ScrollReveal key={item.title} delay={i * 0.12}>
              <div className="group relative rounded-xl overflow-hidden bg-[#141414] shadow-card hover:shadow-card-hover transition-all duration-500 hover:-translate-y-2 active:scale-[0.99]">
                <div className="absolute top-0 left-0 right-0 h-9 bg-[#1a1a1a] z-10 flex items-center px-4 gap-2 border-b border-[#2a2a2a]">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#5a5a5a]" />
                    <div className="w-2.5 h-2.5 rounded-full bg-[#5a5a5a]" />
                    <div className="w-2.5 h-2.5 rounded-full bg-[#5a5a5a]" />
                  </div>
                  <div className="flex-1 flex justify-center">
                    <div className="w-48 h-5 rounded-md bg-[#2a2a2a] flex items-center justify-center">
                      <span className="text-[10px] text-[#5a5652] font-medium">{item.title.toLowerCase().replace(/[^a-z0-9]/g, '')}.com</span>
                    </div>
                  </div>
                </div>
                <div className="h-52 lg:h-64 mt-9 relative overflow-hidden bg-[#0a0a0a]">
                  <img
                    src={item.img}
                    alt={item.title}
                    className="w-full h-full object-cover object-top transition-all duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-colors duration-500" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
                    <a href={item.url} target="_blank" rel="noopener noreferrer" className="px-5 py-2.5 bg-[#0a0a0a]/80 backdrop-blur-md rounded-lg text-sm font-medium text-white flex items-center gap-2 shadow-xl translate-y-4 group-hover:translate-y-0 transition-all duration-500 border border-[#2a2a2a] hover:border-[#f5b342]/40">
                      Ver demo <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>
                <div className="p-6">
                  <span className="text-xs font-semibold text-[#f5b342] uppercase tracking-wider">{item.category}</span>
                  <h3 className="text-xl font-display font-bold text-white mt-1">{item.title}</h3>
                  <p className="text-sm text-[#5a5652] mt-1">{item.desc}</p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal delay={0.3}>
          <div className="text-center mt-12">
            <Button to="/plantillas" variant="primary" size="lg" icon={ArrowRight}>Ver todos los ejemplos</Button>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
