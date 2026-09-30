import SEO from '../components/SEO'
import Hero from '../components/home/Hero'
import Benefits from '../components/home/Benefits'
import ScrollScene3D from '../components/home/ScrollScene3D'
import HowItWorks from '../components/home/HowItWorks'
import Examples from '../components/home/Examples'
import Statistics from '../components/home/Statistics'
import Testimonials from '../components/home/Testimonials'
import CaseStudies from '../components/home/CaseStudies'
import CTASection from '../components/home/CTASection'

const seoSchema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebPage',
      '@id': 'https://newwebdesing.netlify.app/#webpage',
      url: 'https://newwebdesing.netlify.app/',
      name: 'NexWeb | Páginas Web Profesionales',
      description: 'Creamos páginas web profesionales que impulsan tu negocio. Rápido, moderno y sin complicaciones.',
      inLanguage: 'es',
      isPartOf: { '@id': 'https://newwebdesing.netlify.app/#website' },
    },
    {
      '@type': 'Organization',
      '@id': 'https://newwebdesing.netlify.app/#organization',
      name: 'NexWeb',
      url: 'https://newwebdesing.netlify.app',
      logo: 'https://newwebdesing.netlify.app/logo.png',
      description: 'Agencia de creación de páginas web profesionales.',
      foundingDate: '2025',
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'customer service',
        url: 'https://newwebdesing.netlify.app/contacto',
      },
    },
  ],
}

export default function Home() {
  return (
    <>
      <SEO
        title="Páginas Web Profesionales para tu Negocio"
        description="NexWeb crea páginas web profesionales, modernas y rápidas para impulsar tu negocio. Diseño web, desarrollo, SEO y más. Solicita tu presupuesto gratis."
        keywords="páginas web profesionales, diseño web, desarrollo web, crear página web, agencia web, páginas web para negocios, diseño web profesional, SEO"
        url="/"
        type="website"
        schema={seoSchema}
      />
      <Hero />
      <Benefits />
      <ScrollScene3D />
      <HowItWorks />
      <Examples />
      <Statistics />
      <CaseStudies />
      <Testimonials />
      <CTASection />
    </>
  )
}
