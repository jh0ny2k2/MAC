import { MessageSquare, Palette, Rocket, CheckCircle } from 'lucide-react'
import ScrollReveal from '../common/ScrollReveal'

const steps = [
  { icon: MessageSquare, title: 'Cuéntanos tu idea', desc: 'Háblanos de tu negocio, tus objetivos y el estilo que buscas.' },
  { icon: Palette, title: 'Diseñamos tu web', desc: 'Creamos un diseño moderno y profesional para tu marca.' },
  { icon: Rocket, title: 'Lanzamiento', desc: 'Publicamos tu web lista para recibir clientes.' },
  { icon: CheckCircle, title: 'Soporte continuo', desc: 'Seguimos contigo para asegurar que todo funcione.' },
]

export default function HowItWorks() {
  return (
    <section className="py-20 lg:py-28 bg-[#111111] relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#f5b342]/20 to-transparent" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center max-w-3xl mx-auto mb-20">
            <span className="text-sm font-semibold text-[#f5b342] uppercase tracking-[0.2em] font-body">Proceso</span>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-white mt-4 leading-tight tracking-tight">
              Así de <span className="text-gradient">fácil</span> funciona
            </h2>
          </div>
        </ScrollReveal>

        <div className="relative">
          <div className="hidden lg:block absolute left-16 right-16 top-8 h-px bg-gradient-to-r from-[#f5b342]/20 via-[#f5b342]/30 to-[#f5b342]/20" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, i) => (
              <ScrollReveal key={step.title} delay={i * 0.12}>
                <div className="group relative overflow-hidden rounded-xl bg-[#141414] border border-[#1e1e1e] shadow-card hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-500 active:scale-[0.98]">
                  <div className="absolute -right-4 -top-4 text-[100px] font-black text-white/[0.03] select-none leading-none">
                    {String(i + 1).padStart(2, '0')}
                  </div>
                  <div className="hidden lg:flex absolute left-1/2 -translate-x-1/2 -top-9 w-4 h-4 rounded-full bg-[#141414] border-2 border-[#f5b342]/40 group-hover:border-[#f5b342] transition-all duration-300 z-10" />
                  <div className="relative p-6 lg:p-8 lg:pt-14 text-center">
                    <div className="w-12 h-12 lg:w-14 lg:h-14 rounded-xl bg-[#f5b342]/10 flex items-center justify-center mx-auto mb-5 group-hover:scale-105 group-hover:bg-[#f5b342]/20 transition-all duration-500">
                      <step.icon className="w-5 h-5 lg:w-6 lg:h-6 text-[#f5b342]" />
                    </div>
                    <h3 className="text-base lg:text-lg font-display font-semibold text-white mb-2">{step.title}</h3>
                    <p className="text-sm text-[#5a5652] leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
