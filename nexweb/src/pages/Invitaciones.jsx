import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  Heart, Sparkles, Share2, Palette,
  CheckCircle, ArrowRight, Star,
  Smartphone, Camera, Calendar,
  MapPin, Music, MessageCircle,
  Menu, X, Mail, Phone, Globe, Heart as HeartIcon,
  Quote, Diamond,
} from 'lucide-react'
import InvitationScene3D from '../components/invitaciones/InvitationScene3D'
import SEO from '../components/SEO'

function useScrollReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed')
          }
        })
      },
      { threshold: 0.1, rootMargin: '0px 0px -60px 0px' }
    )
    const elements = document.querySelectorAll('.scroll-reveal, .scroll-reveal-left, .scroll-reveal-right')
    elements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])
}

function Ornament({ className = '', small = false }) {
  const w = small ? 80 : 140
  return (
    <svg viewBox={`0 0 ${w} 20`} className={`h-5 ${className}`} style={{ width: `${w}px` }}>
      <defs>
        <linearGradient id="og" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#C9A96E" stopOpacity="0" />
          <stop offset="50%" stopColor="#C9A96E" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#C9A96E" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={`M${small ? 0 : 0},10 L${w * 0.32},10`} stroke="url(#og)" strokeWidth="0.6" fill="none" />
      <circle cx={w * 0.42} cy="10" r="2" fill="#C9A96E" opacity="0.5" />
      <path d={`M${w * 0.46},4 Q${w * 0.5},0 ${w * 0.54},4 Q${w * 0.5},8 ${w * 0.46},4`} fill="none" stroke="#C9A96E" strokeWidth="0.7" opacity="0.4" />
      <circle cx={w * 0.58} cy="10" r="2" fill="#C9A96E" opacity="0.5" />
      <path d={`M${w * 0.68},10 L${w},10`} stroke="url(#og)" strokeWidth="0.6" fill="none" />
    </svg>
  )
}

const navLinks = [
  { href: '#', label: 'Inicio' },
  { href: '#como-funciona', label: 'Cómo funciona' },
  { href: '#disenos', label: 'Diseños' },
  { href: '#caracteristicas', label: 'Características' },
  { href: '#contacto', label: 'Contacto' },
]

function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleNavClick = (e, href) => {
    setIsOpen(false)
    if (href === '#') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }
    e.preventDefault()
    const el = document.querySelector(href)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-white/90 backdrop-blur-xl shadow-lg shadow-black/[0.02] border-b border-[#C9A96E]/10'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <a href="#" onClick={(e) => handleNavClick(e, '#')} className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-full bg-[#1C1816] flex items-center justify-center">
              <Diamond className="w-3.5 h-3.5 text-[#C9A96E]" />
            </div>
            <span className="font-display text-lg font-bold tracking-tight">
              <span className={scrolled ? 'text-[#1C1816]' : 'text-white'}>Eterno</span>
            </span>
          </a>

          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className={`px-4 py-2 text-sm font-body font-medium transition-all duration-300 ${
                  scrolled
                    ? 'text-[#7A7068] hover:text-[#1C1816]'
                    : 'text-white/70 hover:text-white'
                }`}
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-3">
            <Link
              to="/invitaciones/crear"
              className="group inline-flex items-center gap-2 px-6 py-2.5 bg-[#1C1816] hover:bg-[#3A3230] text-white font-body font-medium text-xs tracking-wider uppercase rounded-full transition-all duration-300"
            >
              Crear invitación
              <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
            </Link>
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? 'Cerrar menú' : 'Abrir menú'}
            className={`lg:hidden p-2.5 transition-all ${
              scrolled ? 'text-[#1C1816]' : 'text-white'
            }`}
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <div className={`lg:hidden transition-all duration-300 overflow-hidden ${
        isOpen ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0'
      }`}>
        <div className="bg-white/95 backdrop-blur-xl border-t border-[#C9A96E]/10 shadow-xl mx-4 sm:mx-6 mb-4 rounded-2xl overflow-hidden">
          <div className="py-3 px-2 space-y-0.5">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="block px-4 py-3 rounded-xl text-sm font-body font-medium text-[#7A7068] hover:text-[#1C1816] hover:bg-[#F7F2EA]/50 transition-all"
              >
                {link.label}
              </a>
            ))}
            <hr className="my-2 border-[#C9A96E]/10 mx-2" />
            <Link
              to="/invitaciones/crear"
              className="block px-4 py-3 rounded-xl text-sm font-semibold text-white bg-[#1C1816] mx-2 mt-2 text-center transition-all"
            >
              Crear invitación
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}

function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-[#F7F2EA]">
      <div className="absolute inset-0 opacity-[0.08]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='48' height='48' viewBox='0 0 48 48' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M24 0v48M0 24h48' stroke='%23C9A96E' stroke-width='0.4' fill='none'/%3E%3C/svg%3E")`,
        backgroundSize: '48px 48px'
      }} />

      <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-[#C9A96E]/8 to-transparent pointer-events-none" />

      <div className="relative w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-32 sm:py-40">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          <div className="text-center lg:text-left space-y-8">
            <div className="space-y-5">
              <div className="flex items-center gap-3 justify-center lg:justify-start">
                <div className="h-px w-8 bg-[#C9A96E]/40" />
                <p
                  className="font-script text-[#C9A96E] text-xl sm:text-2xl opacity-0 animate-fade-up"
                  style={{ animationDelay: '200ms', animationFillMode: 'forwards' }}
                >
                  Save the Date
                </p>
                <div className="h-px w-8 bg-[#C9A96E]/40" />
              </div>
              <h1
                className="font-display text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold text-[#1C1816] leading-[1.05] tracking-tight opacity-0 animate-fade-up"
                style={{ animationDelay: '400ms', animationFillMode: 'forwards' }}
              >
                El primer{' '}
                <span className="relative">
                  <span className="italic text-[#C9A96E]">sí</span>
                  <span className="absolute -bottom-1 left-0 right-0 h-2 bg-[#C9A96E]/15 -skew-x-6 rounded-full" />
                </span>
                ,<br />
                empieza aquí
              </h1>
            </div>

            <div className="flex justify-center lg:justify-start opacity-0 animate-fade-up"
              style={{ animationDelay: '500ms', animationFillMode: 'forwards' }}>
              <Ornament />
            </div>

            <p
              className="text-[#7A7068] text-lg sm:text-xl font-body leading-relaxed max-w-md mx-auto lg:mx-0 opacity-0 animate-fade-up"
              style={{ animationDelay: '600ms', animationFillMode: 'forwards' }}
            >
              Invitaciones de boda online que capturan la esencia de su amor. De lo clásico a lo contemporáneo, en minutos.
            </p>

            <div
              className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start opacity-0 animate-fade-up"
              style={{ animationDelay: '800ms', animationFillMode: 'forwards' }}
            >
              <Link
                to="/invitaciones/crear"
                className="group inline-flex items-center gap-2.5 px-8 py-3.5 bg-[#1C1816] hover:bg-[#3A3230] text-white font-body font-medium text-sm tracking-wider uppercase rounded-full transition-all duration-300 shadow-lg shadow-[#1C1816]/10"
              >
                Crear invitación
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
              <Link
                to="/invitaciones/disenos"
                className="group inline-flex items-center gap-2 px-8 py-3.5 text-[#7A7068] hover:text-[#1C1816] font-body text-sm tracking-wider uppercase rounded-full border border-[#C9A96E]/30 hover:border-[#C9A96E]/60 bg-white/50 hover:bg-white/80 transition-all duration-300"
              >
                Ver diseños
              </Link>
            </div>

            <div
              className="flex items-center gap-6 justify-center lg:justify-start pt-4 text-[#7A7068]/50 text-xs font-body opacity-0 animate-fade-up"
              style={{ animationDelay: '1000ms', animationFillMode: 'forwards' }}
            >
              <span className="flex items-center gap-1.5"><CheckCircle className="w-3 h-3 text-[#C9A96E]" /> Sin descargar</span>
              <span className="flex items-center gap-1.5"><CheckCircle className="w-3 h-3 text-[#C9A96E]" /> Personalizable</span>
              <span className="flex items-center gap-1.5"><CheckCircle className="w-3 h-3 text-[#C9A96E]" /> Compartir al instante</span>
            </div>
          </div>

          <div className="hidden lg:flex items-center justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-[#C9A96E]/8 rounded-full blur-3xl" style={{ transform: 'scale(0.7)' }} />
              <div className="absolute inset-0 bg-[#D4A0A0]/5 rounded-full blur-2xl" style={{ transform: 'scale(0.5) translateY(30px)' }} />
              <div className="w-80 h-96">
                <InvitationScene3D />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 opacity-25">
        <svg width="14" height="24" viewBox="0 0 14 24" fill="none" className="text-[#1C1816]">
          <rect x="1" y="1" width="12" height="22" rx="6" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="7" cy="8" r="1.5" fill="currentColor" className="animate-bounce" style={{ animationDuration: '2.5s' }} />
        </svg>
      </div>
    </section>
  )
}

function HowItWorks() {
  const steps = [
    {
      number: '01',
      icon: Palette,
      title: 'Elige tu diseño',
      desc: 'Explore nuestra colección de plantillas exclusivas, desde lo clásico hasta lo contemporáneo.',
    },
    {
      number: '02',
      icon: Sparkles,
      title: 'Personaliza cada detalle',
      desc: 'Colores, textos, fotos y música. Haga que cada invitación refleje su historia única.',
    },
    {
      number: '03',
      icon: Share2,
      title: 'Comparte al instante',
      desc: 'Envíe por WhatsApp, email o redes sociales. Sus invitados confirman con un solo clic.',
    },
  ]

  return (
    <section id="como-funciona" className="relative bg-white py-24 sm:py-32">
      <div className="absolute inset-0 opacity-[0.015]" style={{
        backgroundImage: `radial-gradient(circle at 1px 1px, #C9A96E 1px, transparent 0)`,
        backgroundSize: '48px 48px'
      }} />
      <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="text-center space-y-3 mb-20">
          <p className="font-script text-[#C9A96E] text-xl sm:text-2xl">How it Works</p>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1C1816]">
            Tres pasos para un{' '}
            <span className="italic text-[#C9A96E]">sí</span> inolvidable
          </h2>
          <div className="flex justify-center pt-4">
            <Ornament />
          </div>
        </div>

        <div className="relative">
          <div className="hidden lg:block absolute top-16 left-[calc(16.66%+1.5rem)] right-[calc(16.66%+1.5rem)] h-px bg-gradient-to-r from-transparent via-[#C9A96E]/20 to-transparent" />

          <div className="grid md:grid-cols-3 gap-8 lg:gap-16">
            {steps.map((step, i) => {
              const Icon = step.icon
              return (
                <div
                  key={step.number}
                  className="scroll-reveal group text-center"
                  style={{ transitionDelay: `${i * 150}ms` }}
                >
                  <div className="relative inline-flex mb-8">
                    <div className="w-20 h-20 rounded-full bg-[#F7F2EA] flex items-center justify-center group-hover:bg-[#C9A96E]/10 transition-colors duration-500">
                      <Icon className="w-8 h-8 text-[#1C1816]" />
                    </div>
                    <span className="absolute -top-1 -right-1 w-7 h-7 rounded-full bg-[#1C1816] text-white text-[10px] font-display font-bold flex items-center justify-center shadow-lg">
                      {step.number}
                    </span>
                  </div>
                  <h3 className="font-display text-xl font-bold text-[#1C1816] mb-3">{step.title}</h3>
                  <p className="font-body text-[#7A7068] text-sm leading-relaxed max-w-xs mx-auto">{step.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

const designCards = [
  {
    name: 'Clásico Eterno',
    style: 'Clásico',
    badge: 'Popular',
    gradient: 'from-rose-100/60 via-rose-50/30 to-transparent',
    border: 'border-rose-200/50',
    label: 'rose-800',
    decor: 'bg-rose-100',
  },
  {
    name: 'Rústico Encanto',
    style: 'Rústico',
    badge: null,
    gradient: 'from-amber-100/60 via-amber-50/30 to-transparent',
    border: 'border-amber-200/50',
    label: 'amber-800',
    decor: 'bg-amber-100',
  },
  {
    name: 'Moderno Minimal',
    style: 'Moderno',
    badge: 'Nuevo',
    gradient: 'from-gray-100/60 via-gray-50/30 to-transparent',
    border: 'border-gray-200/50',
    label: 'gray-800',
    decor: 'bg-gray-100',
  },
  {
    name: 'Boho Chic',
    style: 'Boho',
    badge: null,
    gradient: 'from-orange-100/60 via-orange-50/30 to-transparent',
    border: 'border-orange-200/50',
    label: 'orange-800',
    decor: 'bg-orange-100',
  },
  {
    name: 'Romance Vintage',
    style: 'Vintage',
    badge: null,
    gradient: 'from-pink-100/60 via-pink-50/30 to-transparent',
    border: 'border-pink-200/50',
    label: 'pink-800',
    decor: 'bg-pink-100',
  },
  {
    name: 'Gold Luxury',
    style: 'Lujo',
    badge: 'Premium',
    gradient: 'from-yellow-100/60 via-yellow-50/30 to-transparent',
    border: 'border-yellow-200/50',
    label: 'yellow-800',
    decor: 'bg-yellow-100',
  },
  {
    name: 'Tropical Bliss',
    style: 'Tropical',
    badge: null,
    gradient: 'from-emerald-100/60 via-emerald-50/30 to-transparent',
    border: 'border-emerald-200/50',
    label: 'emerald-800',
    decor: 'bg-emerald-100',
  },
  {
    name: 'Celestial',
    style: 'Celestial',
    badge: null,
    gradient: 'from-indigo-100/60 via-indigo-50/30 to-transparent',
    border: 'border-indigo-200/50',
    label: 'indigo-800',
    decor: 'bg-indigo-100',
  },
]

function DesignPreview({ index }) {
  const previews = [
    // Clásico Eterno — ornate frame with heart
    <svg key={0} viewBox="0 0 140 190" className="w-full h-full max-w-[130px] max-h-[170px]">
      <rect x="8" y="8" width="124" height="174" rx="2" fill="white" opacity="0.9" />
      <rect x="14" y="14" width="112" height="162" rx="1" fill="none" stroke="#D4A0A0" strokeWidth="0.5" />
      <rect x="18" y="18" width="104" height="154" rx="1" fill="none" stroke="#D4A0A0" strokeWidth="0.3" opacity="0.5" />
      <path d="M48,62 Q70,42 92,62 Q70,82 48,62" fill="none" stroke="#D4A0A0" strokeWidth="0.8" />
      <text x="70" y="96" textAnchor="middle" fill="#1C1816" fontSize="9" fontFamily="serif" fontWeight="bold">Clásico</text>
      <text x="70" y="110" textAnchor="middle" fill="#1C1816" fontSize="7" fontFamily="serif">Save the Date</text>
      <line x1="40" y1="120" x2="100" y2="120" stroke="#D4A0A0" strokeWidth="0.4" />
      <circle cx="70" cy="130" r="1.5" fill="#D4A0A0" opacity="0.6" />
      <circle cx="66" cy="130" r="1.5" fill="#D4A0A0" opacity="0.4" />
      <circle cx="74" cy="130" r="1.5" fill="#D4A0A0" opacity="0.4" />
    </svg>,
    // Rústico Encanto — botanical wreath
    <svg key={1} viewBox="0 0 140 190" className="w-full h-full max-w-[130px] max-h-[170px]">
      <rect x="8" y="8" width="124" height="174" rx="2" fill="#FEFCF7" opacity="0.9" />
      <path d="M42,40 Q20,50 25,70 Q30,90 45,95" fill="none" stroke="#A0845C" strokeWidth="0.6" opacity="0.5" />
      <path d="M98,40 Q120,50 115,70 Q110,90 95,95" fill="none" stroke="#A0845C" strokeWidth="0.6" opacity="0.5" />
      <path d="M50,45 Q30,60 35,80 Q40,95 55,100" fill="none" stroke="#A0845C" strokeWidth="0.4" opacity="0.3" />
      <path d="M90,45 Q110,60 105,80 Q100,95 85,100" fill="none" stroke="#A0845C" strokeWidth="0.4" opacity="0.3" />
      <text x="70" y="98" textAnchor="middle" fill="#1C1816" fontSize="9" fontFamily="serif" fontWeight="bold">Rústico</text>
      <text x="70" y="112" textAnchor="middle" fill="#7A7068" fontSize="6" fontFamily="serif">&amp; Nuestras Familias</text>
      <line x1="25" y1="122" x2="115" y2="122" stroke="#A0845C" strokeWidth="0.3" opacity="0.4" />
      <circle cx="63" cy="132" r="1" fill="#A0845C" opacity="0.5" />
      <circle cx="70" cy="130" r="1.5" fill="#A0845C" opacity="0.6" />
      <circle cx="77" cy="132" r="1" fill="#A0845C" opacity="0.5" />
    </svg>,
    // Moderno Minimal — clean geometric
    <svg key={2} viewBox="0 0 140 190" className="w-full h-full max-w-[130px] max-h-[170px]">
      <rect x="8" y="8" width="124" height="174" rx="2" fill="white" opacity="0.9" />
      <rect x="24" y="28" width="92" height="92" fill="none" stroke="#9CA3AF" strokeWidth="0.4" />
      <rect x="34" y="38" width="72" height="72" fill="none" stroke="#9CA3AF" strokeWidth="0.2" opacity="0.5" />
      <text x="70" y="88" textAnchor="middle" fill="#1C1816" fontSize="10" fontFamily="sans-serif" fontWeight="bold">Moderno</text>
      <text x="70" y="102" textAnchor="middle" fill="#7A7068" fontSize="6" fontFamily="sans-serif">Juntos</text>
      <line x1="45" y1="140" x2="95" y2="140" stroke="#9CA3AF" strokeWidth="0.5" />
      <rect x="65" y="148" width="10" height="10" fill="none" stroke="#9CA3AF" strokeWidth="0.3" transform="rotate(45 70 153)" />
    </svg>,
    // Boho Chic — mandala sun
    <svg key={3} viewBox="0 0 140 190" className="w-full h-full max-w-[130px] max-h-[170px]">
      <rect x="8" y="8" width="124" height="174" rx="2" fill="#FFFAF5" opacity="0.9" />
      <circle cx="70" cy="65" r="22" fill="none" stroke="#D68C45" strokeWidth="0.4" />
      <circle cx="70" cy="65" r="16" fill="none" stroke="#D68C45" strokeWidth="0.3" opacity="0.6" />
      <circle cx="70" cy="65" r="4" fill="#D68C45" opacity="0.3" />
      {[0,45,90,135,180,225,270,315].map(a => (
        <line key={a} x1={70+18*Math.cos(a*Math.PI/180)} y1={65+18*Math.sin(a*Math.PI/180)} x2={70+26*Math.cos(a*Math.PI/180)} y2={65+26*Math.sin(a*Math.PI/180)} stroke="#D68C45" strokeWidth="0.4" opacity="0.5" />
      ))}
      <text x="70" y="108" textAnchor="middle" fill="#1C1816" fontSize="9" fontFamily="serif" fontWeight="bold">Boho</text>
      <text x="70" y="120" textAnchor="middle" fill="#7A7068" fontSize="6" fontFamily="serif">Free Spirit</text>
      <path d="M30,140 Q50,130 70,140 Q90,150 110,140" fill="none" stroke="#D68C45" strokeWidth="0.4" opacity="0.4" />
    </svg>,
    // Romance Vintage — oval frame
    <svg key={4} viewBox="0 0 140 190" className="w-full h-full max-w-[130px] max-h-[170px]">
      <rect x="8" y="8" width="124" height="174" rx="2" fill="#FDF2F8" opacity="0.9" />
      <ellipse cx="70" cy="78" rx="38" ry="48" fill="none" stroke="#D48A9E" strokeWidth="0.5" />
      <ellipse cx="70" cy="78" rx="34" ry="44" fill="none" stroke="#D48A9E" strokeWidth="0.3" opacity="0.4" />
      <text x="70" y="72" textAnchor="middle" fill="#1C1816" fontSize="8" fontFamily="serif" fontWeight="bold" fontStyle="italic">Romance</text>
      <text x="70" y="86" textAnchor="middle" fill="#7A7068" fontSize="6" fontFamily="serif">Vintage</text>
      <path d="M50,100 Q70,112 90,100" fill="none" stroke="#D48A9E" strokeWidth="0.4" />
      <circle cx="70" cy="110" r="1.5" fill="#D48A9E" opacity="0.5" />
      <line x1="48" y1="115" x2="92" y2="115" stroke="#D48A9E" strokeWidth="0.2" opacity="0.3" />
      <path d="M35,130 Q40,138 48,135" fill="none" stroke="#D48A9E" strokeWidth="0.3" opacity="0.4" />
      <path d="M92,135 Q100,138 105,130" fill="none" stroke="#D48A9E" strokeWidth="0.3" opacity="0.4" />
    </svg>,
    // Gold Luxury — art deco
    <svg key={5} viewBox="0 0 140 190" className="w-full h-full max-w-[130px] max-h-[170px]">
      <rect x="8" y="8" width="124" height="174" rx="2" fill="#FFFBEB" opacity="0.9" />
      <rect x="22" y="22" width="96" height="146" fill="none" stroke="#C9A96E" strokeWidth="0.6" />
      <rect x="28" y="28" width="84" height="134" fill="none" stroke="#C9A96E" strokeWidth="0.3" opacity="0.5" />
      <line x1="50" y1="42" x2="90" y2="42" stroke="#C9A96E" strokeWidth="0.4" />
      <line x1="42" y1="46" x2="98" y2="46" stroke="#C9A96E" strokeWidth="0.2" opacity="0.4" />
      <text x="70" y="82" textAnchor="middle" fill="#1C1816" fontSize="10" fontFamily="serif" fontWeight="bold">Luxury</text>
      <text x="70" y="96" textAnchor="middle" fill="#7A7068" fontSize="6" fontFamily="serif">Gold Edition</text>
      <polygon points="70,108 78,118 62,118" fill="#C9A96E" opacity="0.15" />
      <polygon points="70,114 78,124 62,124" fill="none" stroke="#C9A96E" strokeWidth="0.3" opacity="0.4" />
      <line x1="35" y1="138" x2="105" y2="138" stroke="#C9A96E" strokeWidth="0.3" />
      <line x1="42" y1="142" x2="98" y2="142" stroke="#C9A96E" strokeWidth="0.2" opacity="0.4" />
    </svg>,
    // Tropical Bliss — leaves
    <svg key={6} viewBox="0 0 140 190" className="w-full h-full max-w-[130px] max-h-[170px]">
      <rect x="8" y="8" width="124" height="174" rx="2" fill="#F0FDF4" opacity="0.9" />
      <path d="M38,38 Q30,60 38,85 Q46,60 38,38" fill="#2D6A4F" opacity="0.08" />
      <path d="M102,38 Q110,60 102,85 Q94,60 102,38" fill="#2D6A4F" opacity="0.08" />
      <path d="M55,30 Q45,55 55,80" fill="none" stroke="#2D6A4F" strokeWidth="0.5" opacity="0.3" />
      <path d="M85,30 Q95,55 85,80" fill="none" stroke="#2D6A4F" strokeWidth="0.5" opacity="0.3" />
      <text x="70" y="90" textAnchor="middle" fill="#1C1816" fontSize="9" fontFamily="serif" fontWeight="bold">Tropical</text>
      <text x="70" y="104" textAnchor="middle" fill="#7A7068" fontSize="6" fontFamily="serif">Paradise</text>
      <line x1="30" y1="116" x2="110" y2="116" stroke="#2D6A4F" strokeWidth="0.3" opacity="0.3" />
      <circle cx="63" cy="128" r="1" fill="#2D6A4F" opacity="0.4" />
      <circle cx="70" cy="126" r="1.5" fill="#2D6A4F" opacity="0.5" />
      <circle cx="77" cy="128" r="1" fill="#2D6A4F" opacity="0.4" />
      <path d="M45,140 Q55,135 60,140 Q55,145 45,140" fill="#2D6A4F" opacity="0.06" />
      <path d="M80,140 Q85,135 95,140 Q85,145 80,140" fill="#2D6A4F" opacity="0.06" />
    </svg>,
    // Celestial — stars and moon
    <svg key={7} viewBox="0 0 140 190" className="w-full h-full max-w-[130px] max-h-[170px]">
      <rect x="8" y="8" width="124" height="174" rx="2" fill="#EEF2FF" opacity="0.9" />
      <path d="M85,40 Q95,30 105,40 Q95,50 85,40" fill="#C7D2FE" opacity="0.7" />
      <circle cx="65" cy="48" r="1" fill="#C7D2FE" opacity="0.6" />
      <circle cx="52" cy="38" r="0.8" fill="#C7D2FE" opacity="0.5" />
      <circle cx="108" cy="55" r="0.8" fill="#C7D2FE" opacity="0.4" />
      <circle cx="58" cy="60" r="0.6" fill="#C7D2FE" opacity="0.4" />
      <circle cx="100" cy="35" r="0.6" fill="#C7D2FE" opacity="0.4" />
      <text x="70" y="92" textAnchor="middle" fill="#1C1816" fontSize="9" fontFamily="serif" fontWeight="bold">Celestial</text>
      <text x="70" y="106" textAnchor="middle" fill="#7A7068" fontSize="6" fontFamily="serif">Under the Stars</text>
      <line x1="30" y1="122" x2="110" y2="122" stroke="#A5B4FC" strokeWidth="0.3" opacity="0.4" />
      <circle cx="70" cy="138" r="8" fill="none" stroke="#A5B4FC" strokeWidth="0.3" opacity="0.3" />
      <circle cx="70" cy="138" r="4" fill="none" stroke="#A5B4FC" strokeWidth="0.2" opacity="0.5" />
      <circle cx="63" cy="150" r="0.8" fill="#A5B4FC" opacity="0.4" />
      <circle cx="77" cy="152" r="0.6" fill="#A5B4FC" opacity="0.3" />
      <circle cx="70" cy="155" r="0.5" fill="#A5B4FC" opacity="0.3" />
    </svg>,
  ]
  return previews[index] || null
}

function Gallery() {
  return (
    <section id="disenos" className="relative bg-[#F7F2EA] py-24 sm:py-32">
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='32' height='32' viewBox='0 0 32 32' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M16 0v32M0 16h32' stroke='%23C9A96E' stroke-width='0.3' fill='none'/%3E%3C/svg%3E")`,
        backgroundSize: '32px 32px'
      }} />
      <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="text-center space-y-3 mb-16">
          <p className="font-script text-[#C9A96E] text-xl sm:text-2xl">Nuestros Diseños</p>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1C1816]">
            Plantillas que{' '}
            <span className="italic text-[#C9A96E]">enamoran</span>
          </h2>
          <div className="flex justify-center pt-4">
            <Ornament />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {designCards.map((d, i) => (
            <Link
              key={d.name}
              to="/invitaciones/disenos"
              className="scroll-reveal group block"
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <div className={`relative aspect-[3/4] rounded-sm overflow-hidden bg-gradient-to-br ${d.gradient} border ${d.border} group-hover:border-[#C9A96E]/40 transition-all duration-500`}>
                <div className="absolute inset-0 opacity-[0.06]">
                  <div className={`w-full h-full ${d.decor}`} style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 0v40M0 20h40' stroke='%23000' stroke-width='0.2' fill='none'/%3E%3C/svg%3E")`,
                    backgroundSize: '40px 40px',
                  }} />
                </div>

                <DesignPreview index={i} />

                <div className="absolute inset-x-0 bottom-0 p-5 bg-gradient-to-t from-white/90 via-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="flex items-center justify-between">
                    <p className="font-body text-xs font-medium text-[#7A7068]">{d.style}</p>
                    <ArrowRight className="w-3 h-3 text-[#C9A96E]" />
                  </div>
                </div>

                <div className="absolute top-4 left-4 right-4 flex items-start justify-between">
                  <div className="bg-white/80 px-3 py-1.5">
                    <p className="text-xs font-display font-semibold text-[#1C1816]">{d.name}</p>
                  </div>
                  {d.badge && (
                    <span className="text-[10px] font-body font-semibold uppercase tracking-wider text-white bg-[#1C1816] px-2.5 py-1">
                      {d.badge}
                    </span>
                  )}
                </div>

                <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <span className="text-[10px] font-body text-[#C9A96E] flex items-center gap-1">
                    Ver más <ArrowRight className="w-2.5 h-2.5" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-12 scroll-reveal">
          <Link
            to="/invitaciones/disenos"
            className="inline-flex items-center gap-2 px-8 py-3.5 text-[#1C1816] hover:text-[#C9A96E] font-body text-sm tracking-wider uppercase border border-[#1C1816]/20 hover:border-[#C9A96E]/40 transition-all duration-300 bg-white hover:bg-white/80"
          >
            Ver todas las plantillas
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </section>
  )
}

const features = [
  { icon: Smartphone, title: 'Diseño responsive', desc: 'Se ve perfecto en cualquier dispositivo, desde el móvil hasta la pantalla más grande.' },
  { icon: Camera, title: 'Fotos y galería', desc: 'Sube tus mejores fotos y crea una galería que cuente su historia de amor.' },
  { icon: Calendar, title: 'Confirmación online', desc: 'Sus invitados confirman asistencia con un clic. Usted ve todo desde su panel.' },
  { icon: MapPin, title: 'Mapa interactivo', desc: 'Incluya la ubicación de la ceremonia y recepción con mapas integrados.' },
  { icon: Music, title: 'Música ambiente', desc: 'Añada su canción favorita para que suene al abrir la invitación.' },
  { icon: MessageCircle, title: 'Compartir directo', desc: 'Comparta por WhatsApp, email, redes sociales o con un enlace privado.' },
]

function Features() {
  return (
    <section id="caracteristicas" className="relative bg-white py-24 sm:py-32">
      <div className="absolute inset-0 opacity-[0.015]" style={{
        backgroundImage: `radial-gradient(circle at 1px 1px, #C9A96E 1px, transparent 0)`,
        backgroundSize: '48px 48px'
      }} />
      <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="text-center space-y-3 mb-16">
          <p className="font-script text-[#C9A96E] text-xl sm:text-2xl">Características</p>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1C1816]">
            Todo lo que necesita{' '}
            <span className="italic text-[#C9A96E]">en un solo lugar</span>
          </h2>
          <div className="flex justify-center pt-4">
            <Ornament />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => {
            const Icon = f.icon
            return (
              <div
                key={f.title}
                className="scroll-reveal group p-8 border border-[#C9A96E]/10 hover:border-[#C9A96E]/30 bg-white hover:bg-[#F7F2EA]/50 transition-all duration-500"
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <div className="w-10 h-10 rounded-full bg-[#F7F2EA] flex items-center justify-center mb-5 group-hover:bg-[#C9A96E]/10 transition-colors duration-500">
                  <Icon className="w-5 h-5 text-[#C9A96E]" />
                </div>
                <h3 className="font-display text-lg font-bold text-[#1C1816] mb-2">{f.title}</h3>
                <p className="font-body text-[#7A7068] text-sm leading-relaxed">{f.desc}</p>
                <div className="mt-4 w-8 h-px bg-[#C9A96E]/30 group-hover:w-12 transition-all duration-500" />
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

const testimonials = [
  {
    name: 'María & Carlos',
    date: '15 marzo 2026',
    text: 'La invitación fue un éxito total. Todos nuestros invitados nos dijeron que era la invitación más bonita que habían recibido. El proceso fue muy sencillo y el resultado espectacular.',
  },
  {
    name: 'Ana & Javier',
    date: '2 febrero 2026',
    text: 'Pudimos personalizar cada detalle hasta que quedó exactamente como soñábamos. La opción de confirmación online nos salvó de tener que estar llamando a cada invitado.',
  },
  {
    name: 'Elena & Diego',
    date: '20 enero 2026',
    text: 'Compartir la invitación por WhatsApp fue tan práctico. Nuestros invitados internacionales pudieron verla al instante, y el mapa interactivo les ayudó muchísimo.',
  },
]

function Testimonials() {
  return (
    <section id="testimonios" className="relative bg-[#F7F2EA] py-24 sm:py-32">
      <div className="absolute inset-0 opacity-[0.04]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='32' height='32' viewBox='0 0 32 32' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M16 0v32M0 16h32' stroke='%23C9A96E' stroke-width='0.3' fill='none'/%3E%3C/svg%3E")`,
        backgroundSize: '32px 32px'
      }} />
      <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="text-center space-y-3 mb-16">
          <p className="font-script text-[#C9A96E] text-xl sm:text-2xl">Testimonios</p>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1C1816]">
            Historias que{' '}
            <span className="italic text-[#C9A96E]">inspiran</span>
          </h2>
          <div className="flex justify-center pt-4">
            <Ornament />
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {testimonials.map((t, i) => (
            <div
              key={t.name}
              className="scroll-reveal bg-white p-8 border border-[#C9A96E]/10 hover:border-[#C9A96E]/25 transition-all duration-500"
              style={{ transitionDelay: `${i * 150}ms` }}
            >
              <Quote className="w-5 h-5 text-[#C9A96E]/30 mb-4" />
              <p className="font-body text-[#7A7068] text-sm leading-relaxed mb-6 italic">
                &ldquo;{t.text}&rdquo;
              </p>
              <div className="flex items-center justify-between pt-4 border-t border-[#C9A96E]/10">
                <div>
                  <p className="font-display font-bold text-[#1C1816] text-sm">{t.name}</p>
                  <p className="font-body text-[#8A7A70] text-xs mt-0.5">{t.date}</p>
                </div>
                <div className="flex gap-0.5">
                  {[1,2,3,4,5].map(s => (
                    <Star key={s} className="w-3 h-3 text-[#C9A96E]" fill="#C9A96E" fillOpacity={0.5} />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function FinalCTA() {
  return (
    <section id="contacto" className="relative bg-white py-24 sm:py-32 overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#C9A96E]/30 to-transparent" />
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `radial-gradient(circle at 2px 2px, #C9A96E 1px, transparent 0)`,
        backgroundSize: '32px 32px'
      }} />
      <div className="relative max-w-3xl mx-auto px-6 sm:px-8 lg:px-12 text-center">
        <div className="space-y-2 mb-8">
          <p
            className="font-script text-[#C9A96E] text-2xl sm:text-3xl opacity-0 animate-fade-up"
            style={{ animationFillMode: 'forwards' }}
          >
            ¡Empieza ahora!
          </p>
          <h2
            className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-[#1C1816] leading-[1.1] opacity-0 animate-fade-up"
            style={{ animationDelay: '200ms', animationFillMode: 'forwards' }}
          >
            Comienza su historia{' '}
            <span className="italic text-[#C9A96E]">hoy</span>
          </h2>
        </div>

        <p
          className="font-body text-[#7A7068] text-lg max-w-xl mx-auto mb-10 opacity-0 animate-fade-up"
          style={{ animationDelay: '400ms', animationFillMode: 'forwards' }}
        >
            Cree su invitación en minutos y comparta el amor con quienes más importan
        </p>

        <div
          className="flex flex-col sm:flex-row items-center gap-4 justify-center opacity-0 animate-fade-up"
          style={{ animationDelay: '600ms', animationFillMode: 'forwards' }}
        >
          <Link
            to="/invitaciones/crear"
            className="group inline-flex items-center gap-2.5 px-10 py-4 bg-[#1C1816] hover:bg-[#3A3230] text-white font-body font-medium text-sm tracking-wider uppercase transition-all duration-300 shadow-lg shadow-[#1C1816]/10"
          >
            Crear mi invitación
            <Heart className="w-4 h-4 transition-transform duration-300 group-hover:scale-125" />
          </Link>
          <Link
            to="/contacto"
            className="group inline-flex items-center gap-2 px-10 py-4 text-[#7A7068] hover:text-[#1C1816] font-body text-sm tracking-wider uppercase border border-[#C9A96E]/30 hover:border-[#C9A96E]/60 bg-white/50 hover:bg-white/80 transition-all duration-300"
          >
            Hablar con nosotros
          </Link>
        </div>

        <div
          className="flex items-center gap-6 justify-center mt-12 text-[#7A7068]/40 text-xs font-body opacity-0 animate-fade-up"
          style={{ animationDelay: '800ms', animationFillMode: 'forwards' }}
        >
          <span className="flex items-center gap-1.5"><CheckCircle className="w-3 h-3 text-[#C9A96E]" /> Sin compromiso</span>
          <span className="w-1 h-1 rounded-full bg-[#C9A96E]/20" />
          <span className="flex items-center gap-1.5"><CheckCircle className="w-3 h-3 text-[#C9A96E]" /> Personalización total</span>
          <span className="w-1 h-1 rounded-full bg-[#C9A96E]/20" />
          <span className="flex items-center gap-1.5"><CheckCircle className="w-3 h-3 text-[#C9A96E]" /> Cancelación gratuita</span>
        </div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="relative bg-[#1C1816] text-[#8A7A70]">
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: `radial-gradient(circle at 1px 1px, #C9A96E 1px, transparent 0)`,
        backgroundSize: '48px 48px'
      }} />

      <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="py-16 lg:py-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          <div className="sm:col-span-2 lg:col-span-1">
            <a href="#" className="flex items-center gap-2.5 mb-5">
              <div className="w-8 h-8 rounded-full bg-[#C9A96E]/20 flex items-center justify-center">
                <Diamond className="w-3.5 h-3.5 text-[#C9A96E]" />
              </div>
              <span className="font-display text-lg font-bold text-white tracking-tight">Eterno</span>
            </a>
            <p className="text-sm font-body leading-relaxed mb-6 max-w-xs">
              Invitaciones de boda online, tan únicas como su amor.
            </p>
            <div className="flex items-center gap-3">
              <a href="#" className="w-9 h-9 rounded-full bg-white/5 hover:bg-[#C9A96E]/10 border border-white/5 flex items-center justify-center transition-all duration-300 group">
                <Globe className="w-3.5 h-3.5 text-[#8A7A70] group-hover:text-[#C9A96E] transition-colors" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-white/5 hover:bg-[#C9A96E]/10 border border-white/5 flex items-center justify-center transition-all duration-300 group">
                <Camera className="w-3.5 h-3.5 text-[#8A7A70] group-hover:text-[#C9A96E] transition-colors" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-white/5 hover:bg-[#C9A96E]/10 border border-white/5 flex items-center justify-center transition-all duration-300 group">
                <MessageCircle className="w-3.5 h-3.5 text-[#8A7A70] group-hover:text-[#C9A96E] transition-colors" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-display font-bold text-white text-xs uppercase tracking-[0.15em] mb-5">Enlaces</h4>
            <ul className="space-y-3">
              {['Inicio', 'Cómo funciona', 'Diseños', 'Características', 'Contacto'].map((l) => (
                <li key={l}>
                  <a
                    href="#"
                    className="text-sm font-body text-[#8A7A70] hover:text-[#C9A96E] transition-colors"
                  >
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display font-bold text-white text-xs uppercase tracking-[0.15em] mb-5">Servicios</h4>
            <ul className="space-y-3">
              {['Invitaciones digitales', 'Confirmación online', 'Galería de fotos', 'Mapa interactivo', 'Música ambiental'].map((s) => (
                <li key={s}>
                  <span className="text-sm font-body text-[#8A7A70]">{s}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display font-bold text-white text-xs uppercase tracking-[0.15em] mb-5">Contacto</h4>
            <div className="space-y-3 text-sm font-body">
              <a href="mailto:hola@eterno.invitations" className="flex items-center gap-3 text-[#8A7A70] hover:text-[#C9A96E] transition-colors">
                <Mail className="w-3.5 h-3.5 text-[#C9A96E]" />
                hola@eterno.invitations
              </a>
              <a href="tel:+34900000000" className="flex items-center gap-3 text-[#8A7A70] hover:text-[#C9A96E] transition-colors">
                <Phone className="w-3.5 h-3.5 text-[#C9A96E]" />
                900 000 000
              </a>
            </div>
          </div>
        </div>

        <div className="py-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-body text-[#8A7A70]/50">
          <p>&copy; {new Date().getFullYear()} Eterno. Todos los derechos reservados.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-[#C9A96E] transition-colors">Términos</a>
            <a href="#" className="hover:text-[#C9A96E] transition-colors">Privacidad</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default function Invitaciones() {
  useScrollReveal()
  const location = useLocation()

  const seoSchema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `https://newwebdesing.netlify.app${location.pathname}`,
        url: `https://newwebdesing.netlify.app${location.pathname}`,
        name: 'Eterno - Invitaciones de Boda Online',
        description: 'Crea invitaciones de boda online únicas. Diseños exclusivos, personalización total, confirmación online y más.',
        inLanguage: 'es',
        isPartOf: {
          '@id': 'https://newwebdesing.netlify.app/#website',
        },
        breadcrumb: {
          '@id': `https://newwebdesing.netlify.app${location.pathname}#breadcrumb`,
        },
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `https://newwebdesing.netlify.app${location.pathname}#breadcrumb`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://newwebdesing.netlify.app/' },
          { '@type': 'ListItem', position: 2, name: 'Invitaciones de Boda', item: `https://newwebdesing.netlify.app${location.pathname}` },
        ],
      },
      {
        '@type': 'Service',
        name: 'Creador de Invitaciones de Boda Online',
        description: 'Plataforma para crear invitaciones de boda digitales personalizadas con diseños exclusivos, confirmación online, galería de fotos y música ambiente.',
        provider: {
          '@type': 'Organization',
          name: 'Eterno',
          url: 'https://newwebdesing.netlify.app',
        },
        offers: {
          '@type': 'Offer',
          price: '10.00',
          priceCurrency: 'EUR',
          description: 'Desde 10€ por invitación digital',
        },
      },
    ],
  }

  return (
    <div className="min-h-screen flex flex-col">
      <SEO
        title="Eterno - Invitaciones de Boda Online"
        description="Crea invitaciones de boda online únicas con Eterno. Diseños exclusivos, personalización total, confirmación online, galería de fotos y música. De lo clásico a lo contemporáneo."
        keywords="invitaciones de boda online, invitaciones digitales, invitaciones boda personalizadas, wedding invitations online, crear invitacion boda, invitaciones boda originales, diseño invitaciones boda"
        url="/invitaciones"
        type="website"
        schema={seoSchema}
      />
      <Navbar />
      <main className="flex-1">
        <Hero />
        <HowItWorks />
        <Gallery />
        <Features />
        <Testimonials />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  )
}
