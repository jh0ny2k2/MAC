import SEO from '../components/SEO'
import ScrollReveal from '../components/common/ScrollReveal'
import TemplateGallery from '../components/templates/TemplateGallery'

const seoSchema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebPage',
      '@id': 'https://newwebdesing.netlify.app/plantillas#webpage',
      url: 'https://newwebdesing.netlify.app/plantillas',
      name: 'Plantillas Web Profesionales | NexWeb',
      description: 'Galería de plantillas web profesionales personalizables. Encuentra la plantilla perfecta para tu negocio.',
      inLanguage: 'es',
      isPartOf: { '@id': 'https://newwebdesing.netlify.app/#website' },
      breadcrumb: { '@id': 'https://newwebdesing.netlify.app/plantillas#breadcrumb' },
    },
    {
      '@type': 'BreadcrumbList',
      '@id': 'https://newwebdesing.netlify.app/plantillas#breadcrumb',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://newwebdesing.netlify.app/' },
        { '@type': 'ListItem', position: 2, name: 'Plantillas', item: 'https://newwebdesing.netlify.app/plantillas' },
      ],
    },
  ],
}

export default function Templates() {
  return (
    <div className="pt-20">
      <SEO
        title="Plantillas Web Profesionales Personalizables"
        description="Explora nuestra galería de plantillas web profesionales. Todos nuestros diseños son 100% personalizables para adaptarse a tu marca."
        keywords="plantillas web, plantillas profesionales, diseños web, plantillas personalizables, galería plantillas web"
        url="/plantillas"
        type="website"
        schema={seoSchema}
      />
      <section className="py-24 lg:py-32 bg-gradient-dark noise-bg relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #f5b342 1px, transparent 0)', backgroundSize: '48px 48px' }} />
        <div className="absolute top-1/4 -right-32 w-[400px] h-[400px] bg-[#f08a3a]/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 -left-32 w-[300px] h-[300px] bg-[#f5b342]/5 rounded-full blur-[100px]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="max-w-3xl mx-auto text-center">
              <span className="text-sm font-semibold text-[#f5b342] uppercase tracking-[0.2em] font-body">Galería</span>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-display font-extrabold text-white leading-tight mt-4 mb-6 tracking-tight">
                Plantillas <span className="text-gradient">profesionales</span>
              </h1>
              <p className="text-lg text-[#5a5652] max-w-xl mx-auto">
                Todas nuestras plantillas son personalizables al 100% para adaptarse a tu marca.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>
      <TemplateGallery />
    </div>
  )
}
