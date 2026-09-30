import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'

const navLinks = [
  { to: '/', label: 'Inicio' },
  { to: '/servicios', label: 'Servicios' },
  { to: '/plantillas', label: 'Plantillas' },
  { to: '/precios', label: 'Precios' },
  { to: '/sobre-nosotros', label: 'Sobre Nosotros' },
  { to: '/contacto', label: 'Contacto' },
]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()
  const isHome = location.pathname === '/'

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      scrolled
        ? 'bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-[#1e1e1e]'
        : isHome ? 'bg-transparent' : 'bg-[#0a0a0a] border-b border-[#1e1e1e]'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <Link to="/" className="flex items-center gap-2.5 group">
            <img src="/logo.png" alt="NexWeb" className="h-9 w-auto" />
          </Link>

          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  location.pathname === link.to
                    ? 'text-[#f5b342] bg-[#f5b342]/10'
                    : 'text-[#8a8682] hover:text-white hover:bg-white/5'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-3">
            <Link
              to="/login"
              className="text-sm font-medium px-5 py-2.5 rounded-lg text-[#8a8682] hover:text-white hover:bg-white/5 transition-all duration-300"
            >
              Acceder
            </Link>
            <Link
              to="/contacto"
              className="text-sm font-semibold px-5 py-2.5 rounded-lg bg-gradient-accent text-[#0a0a0a] shadow-lg shadow-[#f5b342]/20 hover:shadow-xl hover:shadow-[#f5b342]/30 hover:-translate-y-0.5 transition-all duration-300"
            >
              Empezar proyecto
            </Link>
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2.5 rounded-lg text-[#8a8682] hover:text-white hover:bg-white/5 transition-all"
            aria-label="Menú de navegación"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      <div className={`lg:hidden transition-all duration-300 overflow-hidden ${
        isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
      }`}>
        <div className="bg-[#0a0a0a]/95 backdrop-blur-xl border-t border-[#1e1e1e] mx-4 sm:mx-6 mb-4 rounded-xl overflow-hidden">
          <div className="py-3 px-2 space-y-0.5">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setIsOpen(false)}
                className={`block px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                  location.pathname === link.to
                    ? 'text-[#f5b342] bg-[#f5b342]/10'
                    : 'text-[#8a8682] hover:text-white hover:bg-white/5'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <hr className="my-2 border-[#1e1e1e] mx-2" />
            <Link
              to="/login"
              onClick={() => setIsOpen(false)}
              className="block px-4 py-3 rounded-lg text-sm font-medium text-[#8a8682] hover:text-white hover:bg-white/5"
            >
              Acceder
            </Link>
            <Link
              to="/contacto"
              onClick={() => setIsOpen(false)}
              className="block px-4 py-3 rounded-lg text-sm font-semibold text-[#0a0a0a] bg-gradient-accent mx-2 mt-2 text-center shadow-lg shadow-[#f5b342]/20 transition-all"
            >
              Empezar proyecto
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
