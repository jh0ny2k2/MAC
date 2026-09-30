import { Link } from 'react-router-dom'
import { Mail, Phone, MapPin, ArrowUpRight } from 'lucide-react'

const footerLinks = [
  {
    title: 'Navegación',
    links: [
      { to: '/', label: 'Inicio' },
      { to: '/servicios', label: 'Servicios' },
      { to: '/plantillas', label: 'Plantillas' },
      { to: '/precios', label: 'Precios' },
      { to: '/sobre-nosotros', label: 'Sobre Nosotros' },
      { to: '/contacto', label: 'Contacto' },
    ],
  },
  {
    title: 'Servicios',
    links: [
      { to: '/servicios', label: 'Web Corporativa' },
      { to: '/servicios', label: 'Tienda Online' },
      { to: '/servicios', label: 'Landing Page' },
      { to: '/servicios', label: 'Blog Profesional' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { to: '/sobre-nosotros', label: 'Política de Privacidad' },
      { to: '/sobre-nosotros', label: 'Términos del Servicio' },
      { to: '/sobre-nosotros', label: 'Política de Cookies' },
    ],
  },
]

export default function Footer() {
  return (
    <footer className="bg-[#050505] text-[#5a5652] relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #f5b342 1px, transparent 0)', backgroundSize: '48px 48px' }} />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#f5b342]/20 to-transparent" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-16 lg:py-20 grid grid-cols-1 lg:grid-cols-6 gap-12 lg:gap-8">
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center mb-5 group">
              <img src="/logo.png" alt="NexWeb" className="h-9 w-auto" />
            </Link>
            <p className="text-[#5a5652] text-sm leading-relaxed mb-6 max-w-sm">
              Creamos páginas web profesionales que impulsan tu negocio. Rápido, moderno y sin complicaciones.
            </p>
            <div className="space-y-3 text-sm">
              <a href="mailto:info@nexweb.com" className="flex items-center gap-3 text-[#5a5652] hover:text-[#f5b342] transition-colors group">
                <Mail className="w-4 h-4" />
                <span>info@nexweb.com</span>
                <ArrowUpRight className="w-3 h-3 opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all" />
              </a>
              <a href="tel:+34900000000" className="flex items-center gap-3 text-[#5a5652] hover:text-[#f5b342] transition-colors group">
                <Phone className="w-4 h-4" />
                <span>900 000 000</span>
                <ArrowUpRight className="w-3 h-3 opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all" />
              </a>
              <div className="flex items-center gap-3 text-[#5a5652]">
                <MapPin className="w-4 h-4" />
                <span>Madrid, España</span>
              </div>
            </div>
          </div>

          {footerLinks.map((col) => (
            <div key={col.title}>
              <h4 className="text-[#8a8682] font-semibold text-sm uppercase tracking-wider mb-5">{col.title}</h4>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="text-sm text-[#5a5652] hover:text-[#f5b342] transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="py-6 border-t border-[#1e1e1e] flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-[#5a5652]">
          <p>&copy; {new Date().getFullYear()} NexWeb. Todos los derechos reservados.</p>
          <div className="flex items-center gap-6">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#f5b342] transition-colors">Instagram</a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#f5b342] transition-colors">LinkedIn</a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#f5b342] transition-colors">Twitter</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
