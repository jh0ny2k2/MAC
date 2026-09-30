import { useEffect, useState } from 'react'
import { ArrowRight, Play } from 'lucide-react'
import Button from '../common/Button'
import HeroBackground from '../three/HeroBackground'

const stats = [
  { number: '+100', label: 'webs creadas' },
  { number: '48h', label: 'entrega media' },
  { number: '98%', label: 'clientes satisfechos' },
]

export default function Hero() {
  const [loaded, setLoaded] = useState(false)
  useEffect(() => {
    const frame = requestAnimationFrame(() => setLoaded(true))
    return () => cancelAnimationFrame(frame)
  }, [])

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-[#0a0a0a]">
      <HeroBackground />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 lg:py-40">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className={`transition-all duration-700 delay-200 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
            <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-lg bg-[#f5b342]/10 border border-[#f5b342]/20 text-sm text-[#f5b342] mb-8">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#f5b342] opacity-60" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#f5b342]" />
              </span>
              Plataforma profesional de creación web
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-display font-bold text-white leading-[1.05] mb-8 tracking-tight">
              <span className="text-gradient">NexWeb</span>
              <br />
              Tu web profesional,
              <br />
              en tiempo récord
            </h1>

            <p className="text-lg sm:text-xl text-[#5a5652] max-w-xl mb-12 leading-relaxed font-body">
              Creamos páginas web profesionales, modernas y optimizadas para que tu negocio
              destaque en el mundo digital. Rápido, sencillo y sin complicaciones técnicas.
            </p>

            <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
              <Button to="/contacto" size="xl" icon={ArrowRight}>
                Crear mi web
              </Button>
              <Button to="/plantillas" variant="outline" size="xl" icon={Play}>
                Ver ejemplos
              </Button>
            </div>

            <div className="flex flex-wrap items-center gap-10 mt-16 pt-12 border-t border-[#1e1e1e]">
              {stats.map((item, i) => (
                <div
                  key={item.label}
                  className="text-center transition-all duration-500"
                  style={{ transitionDelay: `${400 + i * 120}ms`, opacity: loaded ? 1 : 0, transform: loaded ? 'translateY(0)' : 'translateY(12px)' }}
                >
                  <p className="text-2xl font-bold text-white/90">{item.number}</p>
                  <p className="text-xs text-[#5a5652] mt-1">{item.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="hidden lg:flex items-center justify-center">
            <div className={`transition-all duration-1000 delay-500 ${loaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
              <div className="relative w-[400px] h-[400px] flex items-center justify-center">
                <div className="absolute inset-0 rounded-full bg-[#f5b342]/3 blur-[80px]" />
                <div className="absolute inset-8 rounded-full bg-[#f5b342]/5 blur-[60px]" />
                <div className="relative w-full h-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
