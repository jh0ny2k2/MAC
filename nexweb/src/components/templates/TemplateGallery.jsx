import { ExternalLink, ArrowRight } from 'lucide-react'
import { useState } from 'react'
import ScrollReveal from '../common/ScrollReveal'
import Button from '../common/Button'

const allTemplates = [
  { title: 'Møbel Design', category: 'Corporativas', img: '/screenshots/mobel-design.png', desc: 'Diseño nórdico minimalista para marca premium', url: 'https://jcportofolio.netlify.app/15-furniture-design/' },
  { title: 'Obsidian', category: 'Tiendas', img: '/screenshots/obsidian.png', desc: 'Tienda online con slider antes/después', url: 'https://jcportofolio.netlify.app/20-car-detailing/' },
  { title: 'Étereo', category: 'Landing Pages', img: '/screenshots/coffee.png', desc: 'Landing con parallax y efectos de humo', url: 'https://jcportofolio.netlify.app/21-specialty-coffee/' },
  { title: 'Sarah & Daniel', category: 'Blogs', img: '/screenshots/sarah-daniel.png', desc: 'Blog con storytelling y línea temporal', url: 'https://jcportofolio.netlify.app/16-wedding-invite/' },
  { title: "The Gentleman's Cut", category: 'Corporativas', img: '/screenshots/gentlemans-cut.png', desc: 'Web corporativa con estética oscura premium', url: 'https://jcportofolio.netlify.app/17-modern-barbershop/' },
  { title: 'Iron Forge', category: 'Tiendas', img: '/screenshots/iron-forge.png', desc: 'E-commerce bold con alto contraste', url: 'https://jcportofolio.netlify.app/08-crossfit-gym/' },
  { title: 'Turbo Motors', category: 'Landing Pages', img: '/screenshots/turbo-motors.png', desc: 'Landing de alto impacto y conversión', url: 'https://jcportofolio.netlify.app/10-used-cars/' },
  { title: 'Zen Sushi', category: 'Blogs', img: '/screenshots/sushi.png', desc: 'Blog elegante con diseño editorial', url: 'https://jcportofolio.netlify.app/09-sushi-restaurant/' },
]

const categories = ['Todos', 'Corporativas', 'Tiendas', 'Landing Pages', 'Blogs']

export default function TemplateGallery() {
  const [active, setActive] = useState('Todos')

  const filtered = active === 'Todos' ? allTemplates : allTemplates.filter(t => t.category === active)

  return (
    <section className="py-20 lg:py-28 bg-gradient-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-14">
          <div>
            <span className="text-sm font-semibold text-[#f5b342] uppercase tracking-[0.2em] font-body">Plantillas</span>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-white mt-3 leading-tight max-w-xl tracking-tight">
              Elige la que mejor se adapte a tu <span className="text-gradient">negocio</span>
            </h2>
          </div>
          <div className="flex gap-2 flex-wrap shrink-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActive(cat)}
                className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  active === cat
                    ? 'bg-[#f5b342] text-[#0a0a0a] shadow-lg shadow-[#f5b342]/20'
                    : 'bg-[#141414] text-[#5a5652] border border-[#1e1e1e] hover:bg-[#1e1e1e] hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filtered.map((template, i) => (
            <ScrollReveal key={template.title} delay={i * 0.08}>
              <div className="group rounded-xl overflow-hidden bg-[#141414] border border-[#1e1e1e] shadow-card hover:shadow-card-hover hover:-translate-y-1.5 transition-all duration-500">
                <div className="h-44 relative overflow-hidden bg-[#0a0a0a]">
                  <img
                    src={template.img}
                    alt={template.title}
                    className="w-full h-full object-cover object-top transition-all duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-500" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
                    <a href={template.url} target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-[#0a0a0a]/80 backdrop-blur-md rounded-lg text-xs font-medium text-white flex items-center gap-1.5 shadow-xl border border-[#2a2a2a] hover:border-[#f5b342]/40 transition-all">
                      Vista previa <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
                <div className="p-5">
                  <span className="text-xs font-semibold text-[#f5b342] uppercase tracking-wider">{template.category}</span>
                  <h3 className="text-base font-display font-bold text-white mt-1">{template.title}</h3>
                  <p className="text-sm text-[#5a5652] mt-1">{template.desc}</p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal delay={0.3}>
          <div className="text-center mt-12">
            <Button to="/contacto" variant="primary" size="lg" icon={ArrowRight}>Solicitar plantilla personalizada</Button>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
