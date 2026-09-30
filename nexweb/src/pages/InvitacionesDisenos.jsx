import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, ChevronRight, Sparkles } from 'lucide-react'
import SEO from '../components/SEO'
import DesignCardPreview from '../components/invitaciones/DesignCardPreview'

const designs = [
  {
    id: 'clasico-eterno',
    name: 'Clásico Eterno',
    tag: 'Clásico',
    badge: 'Popular',
    colors: { primary: '#7A1A2E', secondary: '#C4956A', bg: '#FBF6F0', text: '#2C1810' },
    layout: 'ornate-frame',
    font: 'serif',
    description: 'Un diseño atemporal con detalles dorados y tipografía clásica serif. Perfecto para bodas formales y tradicionales.',
  },
  {
    id: 'rustico-encanto',
    name: 'Rústico Encanto',
    tag: 'Rústico',
    badge: null,
    colors: { primary: '#5C3D2E', secondary: '#8BA888', bg: '#F8F5F0', text: '#3D2C1A' },
    layout: 'botanical-wreath',
    font: 'serif',
    description: 'Inspirado en la naturaleza, con tonos tierra y verdes suaves. Ideal para bodas al aire libre o en el campo.',
  },
  {
    id: 'moderno-minimal',
    name: 'Moderno Minimal',
    tag: 'Moderno',
    badge: 'Nuevo',
    colors: { primary: '#1A1A2E', secondary: '#B0B0C0', bg: '#FAFAFC', text: '#1A1A2E' },
    layout: 'asymmetric-geo',
    font: 'sans',
    description: 'Composición asimétrica con formas geométricas. Para parejas contemporáneas que buscan un estilo elegante y sobrio.',
  },
  {
    id: 'romance-vintage',
    name: 'Romance Vintage',
    tag: 'Vintage',
    badge: null,
    colors: { primary: '#8B4A5E', secondary: '#D4A5B5', bg: '#FDF8FA', text: '#4A2A30' },
    layout: 'floral-corners',
    font: 'script',
    description: 'Detalles florales en las esquinas con tipografía cursiva. Un diseño romántico con aire nostálgico.',
  },
  {
    id: 'gold-luxury',
    name: 'Gold Luxury',
    tag: 'Lujo',
    badge: 'Premium',
    colors: { primary: '#0A0A0A', secondary: '#D4AF37', bg: '#0A0A0A', text: '#F0EDE8' },
    layout: 'art-deco-dark',
    font: 'serif',
    description: 'Elegancia en oscuro con geometría Art Decó dorada. Una opción sofisticada para una boda de alta gama.',
  },
  {
    id: 'tropical-bliss',
    name: 'Tropical Bliss',
    tag: 'Tropical',
    badge: null,
    colors: { primary: '#2D6A4F', secondary: '#E8845A', bg: '#F5FBF7', text: '#1B3B2B' },
    layout: 'split-diagonal',
    font: 'sans',
    description: 'Composición dividida con motivos de hojas tropicales. Perfecto para bodas en playa o destinos paradisíacos.',
  },
  {
    id: 'boho-chic',
    name: 'Boho Chic',
    tag: 'Bohemio',
    badge: null,
    colors: { primary: '#C8664E', secondary: '#E8C8A0', bg: '#FDF8F0', text: '#3D2C1A' },
    layout: 'mandala-sun',
    font: 'script',
    description: 'Terracota y crema con mandala solar. Un estilo bohemio para parejas libres, auténticas y soñadoras.',
  },
  {
    id: 'celestial',
    name: 'Celestial Dreams',
    tag: 'Moderno',
    badge: 'Nuevo',
    colors: { primary: '#1B1B3A', secondary: '#A8B5E0', bg: '#0D0D1A', text: '#E8EAF6' },
    layout: 'constellation',
    font: 'sans',
    description: 'Noche estrellada con constelaciones plateadas. Un diseño celestial para una boda mágica e inolvidable.',
  },
]

function DesignCard({ design, index, onSelect }) {
  const d = design
  const [loaded, setLoaded] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 100 + index * 80)
    return () => clearTimeout(t)
  }, [index])

  const cardClass = `group cursor-pointer transition-all duration-700 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`

  return (
    <div className={cardClass} onClick={() => onSelect(d)}>
      <div className="relative group-hover:-translate-y-1 transition-all duration-700">
        <DesignCardPreview design={d} size="sm" />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500 z-10">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-white/90 flex items-center justify-center">
              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke={d.colors.primary} strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
            </div>
            <span className="text-white text-xs font-medium">Ver diseño</span>
          </div>
        </div>
      </div>
      <div className="mt-4 px-1">
        <h3 className="font-display font-bold text-base" style={{ color: d.colors.text }}>{d.name}</h3>
        <p className="text-xs mt-0.5" style={{ color: d.colors.secondary }}>{d.tag}</p>
      </div>
    </div>
  )
}

function DesignDetail({ design, onBack }) {
  const d = design

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={onBack}>
      <div
        className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl"
        style={{ backgroundColor: '#FBF6F0' }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onBack}
          className="absolute top-6 left-6 z-10 w-10 h-10 rounded-full bg-white/80 backdrop-blur flex items-center justify-center shadow-md hover:bg-white transition-all"
        >
          <ArrowLeft className="w-4 h-4" style={{ color: '#7A1A2E' }} />
        </button>

        <div className="grid lg:grid-cols-5 min-h-[60vh]">
          <div className="lg:col-span-3 p-8 lg:p-12 flex items-center justify-center">
            <div className="w-full max-w-sm mx-auto rounded-2xl overflow-hidden shadow-2xl">
              <DesignCardPreview design={d} size="lg" />
            </div>
          </div>

          <div className="lg:col-span-2 p-8 lg:p-12 lg:pl-0 flex flex-col justify-center">
            <p className="text-xs tracking-[0.25em] uppercase mb-3" style={{ color: d.colors.secondary }}>{d.tag}</p>
            <h2 className="text-3xl lg:text-4xl font-display font-bold mb-4" style={{ color: '#2C1810' }}>{d.name}</h2>
            <p className="text-sm leading-relaxed mb-6" style={{ color: '#8C7C7A' }}>
              {d.description}
            </p>

            <div className="flex flex-wrap gap-2 mb-8">
              {['Página web completa', 'Confirmación online', 'Galería de fotos', 'Cuenta regresiva', 'Mapa', 'Música'].map((f) => (
                <span
                  key={f}
                  className="text-[10px] font-medium uppercase tracking-wider px-3 py-1.5 rounded-full"
                  style={{ backgroundColor: '#7A1A2E10', color: '#7A1A2E' }}
                >
                  {f}
                </span>
              ))}
            </div>

            <Link
              to={`/invitaciones/crear?design=${d.id}`}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold transition-all duration-500 hover:shadow-xl hover:-translate-y-0.5"
              style={{ backgroundColor: '#7A1A2E', color: '#fff' }}
            >
              <Sparkles className="w-4 h-4" />
              Personalizar este diseño
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function InvitacionesDisenos() {
  const navigate = useNavigate()
  const [selected, setSelected] = useState(null)

  return (
    <div className="min-h-screen bg-[#FBF6F0]">
      <SEO
        title="Diseños de Invitaciones de Boda Online | Eterno"
        description="Explora nuestra colección de plantillas para invitaciones de boda online. Diseños clásicos, modernos, rústicos, lujo y más. Personaliza la tuya."
        keywords="diseños invitaciones boda, plantillas invitacion boda, invitaciones boda online diseños, modelos invitacion boda, estilos invitacion boda"
        url="/invitaciones/disenos"
        type="website"
      />
      <div className="bg-white/80 backdrop-blur border-b border-[#DFC5A8]/20 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={() => navigate('/invitaciones')}
              className="inline-flex items-center gap-2 text-sm font-medium transition-colors"
              style={{ color: '#8C7C7A' }}
            >
              <ArrowLeft className="w-4 h-4" />
              Volver
            </button>
            <Link
              to="/invitaciones/crear"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all"
              style={{ backgroundColor: '#7A1A2E', color: '#fff' }}
            >
              <Sparkles className="w-3.5 h-3.5" />
              Crear invitación
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-12 sm:py-16">
        <div className="text-center space-y-4 mb-12 sm:mb-16">
          <p className="font-script text-[#C4956A] text-xl sm:text-2xl">Nuestros Diseños</p>
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-[#2C1810]">
            Plantillas que <span className="italic text-[#7A1A2E]">enamoran</span>
          </h1>
          <p className="text-[#8C7C7A] text-base max-w-2xl mx-auto">
            Cada diseño está creado con el corazón, pensando en su historia. Seleccione el suyo y personalícelo.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
          {designs.map((d, i) => (
            <DesignCard key={d.id} design={d} index={i} onSelect={setSelected} />
          ))}
        </div>

        <div className="text-center mt-16">
          <Link
            to="/invitaciones/crear"
            className="inline-flex items-center gap-2.5 px-8 py-4 rounded-full text-sm font-semibold tracking-wider uppercase transition-all duration-500 hover:shadow-2xl hover:-translate-y-0.5"
            style={{ backgroundColor: '#7A1A2E', color: '#fff' }}
          >
            <Sparkles className="w-4 h-4" />
            Crear mi invitación personalizada
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {selected && (
        <DesignDetail design={selected} onBack={() => setSelected(null)} />
      )}
    </div>
  )
}
