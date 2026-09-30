import { ArrowRight } from 'lucide-react'
import Button from '../common/Button'

export default function CTASection() {
  return (
    <section className="py-20 lg:py-28 relative overflow-hidden bg-gradient-dark noise-bg">
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #f5b342 1px, transparent 0)', backgroundSize: '48px 48px' }} />
      <div className="absolute top-1/3 -left-32 w-[400px] h-[400px] bg-gradient-to-br from-[#f5b342]/5 to-transparent rounded-full blur-[100px]" />
      <div className="absolute bottom-1/3 -right-32 w-[400px] h-[400px] bg-gradient-to-br from-[#f08a3a]/5 to-transparent rounded-full blur-[100px]" />
      <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-white leading-tight tracking-tight mb-6">
          ¿Listo para llevar tu negocio al<br />
          <span className="text-gradient">siguiente nivel</span>?
        </h2>
        <p className="text-lg text-[#5a5652] mb-10 max-w-lg mx-auto leading-relaxed">
          Solicita tu web hoy y empieza a recibir clientes en menos de 48 horas.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button to="/contacto" size="xl" icon={ArrowRight}>Solicitar mi web</Button>
          <Button to="/precios" variant="outline" size="xl">Ver planes</Button>
        </div>
      </div>
    </section>
  )
}
