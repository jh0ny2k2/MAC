import SEO from '../components/SEO'
import ScrollReveal from '../components/common/ScrollReveal'
import ContactForm from '../components/contact/ContactForm'
import ContactInfo from '../components/contact/ContactInfo'
import FAQSection from '../components/contact/FAQSection'

const seoSchema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'ContactPage',
      '@id': 'https://newwebdesing.netlify.app/contacto#webpage',
      url: 'https://newwebdesing.netlify.app/contacto',
      name: 'Contacto | NexWeb',
      description: 'Contáctanos para solicitar un presupuesto personalizado para tu página web. Te responderemos en menos de 24 horas.',
      inLanguage: 'es',
      isPartOf: { '@id': 'https://newwebdesing.netlify.app/#website' },
      breadcrumb: { '@id': 'https://newwebdesing.netlify.app/contacto#breadcrumb' },
    },
    {
      '@type': 'BreadcrumbList',
      '@id': 'https://newwebdesing.netlify.app/contacto#breadcrumb',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://newwebdesing.netlify.app/' },
        { '@type': 'ListItem', position: 2, name: 'Contacto', item: 'https://newwebdesing.netlify.app/contacto' },
      ],
    },
  ],
}

export default function Contact() {
  return (
    <div className="pt-20">
      <SEO
        title="Contacto - Solicita tu Presupuesto Web Gratis"
        description="Solicita un presupuesto personalizado para tu página web. Cuéntanos tu idea y te enviaremos un presupuesto en menos de 24 horas sin compromiso."
        keywords="contacto diseño web, presupuesto web gratis, solicitar página web, contacto agencia web, presupuesto personalizado"
        url="/contacto"
        type="website"
        schema={seoSchema}
      />
      <section className="py-20 lg:py-28 bg-gradient-dark noise-bg relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #f5b342 1px, transparent 0)', backgroundSize: '48px 48px' }} />
        <div className="absolute top-1/4 -right-32 w-[400px] h-[400px] bg-[#f08a3a]/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 -left-32 w-[300px] h-[300px] bg-[#f5b342]/5 rounded-full blur-[100px]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-display font-extrabold text-white leading-tight mb-6 tracking-tight">
                Hablemos de tu <span className="text-gradient">proyecto</span>
              </h1>
              <p className="text-lg text-[#5a5652] mb-4 max-w-xl mx-auto">
                Cuéntanos tu idea y te enviaremos un presupuesto personalizado en menos de 24 horas.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <section className="py-20 lg:py-28 bg-gradient-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-5 gap-10 lg:gap-16">
            <div className="lg:col-span-3">
              <ScrollReveal>
                <h2 className="text-2xl font-display font-bold text-white mb-2">Envíanos un mensaje</h2>
                <p className="text-sm text-[#5a5652] mb-8">Rellena el formulario y te responderemos en menos de 24h.</p>
              </ScrollReveal>
              <ScrollReveal delay={0.1}>
                <ContactForm />
              </ScrollReveal>
            </div>
            <div className="lg:col-span-2">
              <ScrollReveal delay={0.15}>
                <h2 className="text-2xl font-display font-bold text-white mb-2">Información de contacto</h2>
                <p className="text-sm text-[#5a5652] mb-8">También puedes contactarnos directamente.</p>
                <ContactInfo />
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      <FAQSection />
    </div>
  )
}
