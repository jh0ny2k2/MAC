import { useEffect, useState, useRef } from 'react'
import ScrollReveal from '../common/ScrollReveal'

function CountUp({ end, duration = 2000 }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const counted = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !counted.current) {
          counted.current = true
          const start = performance.now()
          const raw = parseInt(end.replace(/[^0-9]/g, ''))
          const step = (timestamp) => {
            const progress = Math.min((timestamp - start) / duration, 1)
            const eased = 1 - Math.pow(1 - progress, 3)
            setCount(Math.floor(eased * raw))
            if (progress < 1) requestAnimationFrame(step)
          }
          requestAnimationFrame(step)
        }
      },
      { threshold: 0.3 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [end, duration])

  const isPercent = end.includes('%')
  const hasPlus = end.includes('+')
  const display = isPercent ? `${count}%` : hasPlus ? `+${count}` : end.includes('/') ? end : count

  return <span ref={ref}>{display}</span>
}

const stats = [
  { end: '+120', label: 'webs creadas' },
  { end: '48h', label: 'entrega media' },
  { end: '98%', label: 'clientes satisfechos' },
  { end: '24/7', label: 'soporte continuo' },
]

export default function Statistics() {
  return (
    <section className="py-20 lg:py-28 relative overflow-hidden bg-gradient-dark noise-bg">
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #f5b342 1px, transparent 0)', backgroundSize: '48px 48px' }} />
      <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-[#f5b342]/5 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#f08a3a]/5 rounded-full blur-[120px]" />
      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-white leading-tight tracking-tight">Números que <span className="text-gradient">hablan</span></h2>
            <p className="mt-5 text-lg text-[#5a5652]">Resultados reales de nuestro compromiso con la calidad.</p>
          </div>
        </ScrollReveal>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <ScrollReveal key={stat.label} delay={i * 0.12}>
              <div className="text-center">
                <div className="text-5xl lg:text-6xl font-extrabold text-white tracking-tight mb-1">
                  <CountUp end={stat.end} />
                </div>
                <div className="text-[#5a5652] text-sm">{stat.label}</div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
