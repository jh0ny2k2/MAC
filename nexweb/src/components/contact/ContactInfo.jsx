import { Mail, Phone, MapPin, Clock, ArrowRight } from 'lucide-react'

const contactInfo = [
  { icon: Mail, title: 'Email', value: 'info@nexweb.com', desc: 'Te respondemos en menos de 2h', href: 'mailto:info@nexweb.com' },
  { icon: Phone, title: 'Teléfono', value: '900 000 000', desc: 'L-V de 9:00 a 18:00', href: 'tel:+34900000000' },
  { icon: MapPin, title: 'Ubicación', value: 'Madrid, España', desc: 'Trabajamos con clientes de todo el país' },
  { icon: Clock, title: 'Disponibilidad', value: 'Respuesta en 24/7', desc: 'Incluso fines de semana' },
]

export default function ContactInfo() {
  return (
    <div className="space-y-4">
      {contactInfo.map((item) => {
        const Wrapper = item.href ? 'a' : 'div'
        return (
          <Wrapper
            key={item.title}
            href={item.href}
            className="group flex items-start gap-5 p-5 rounded-xl bg-[#141414] border border-[#1e1e1e] shadow-card hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-300"
          >
            <div className="w-12 h-12 rounded-xl bg-[#f5b342]/10 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-[#f5b342]/20 transition-all duration-300">
              <item.icon className="w-5 h-5 text-[#f5b342]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white">{item.title}</p>
              <p className="text-sm text-[#8a8682] mt-0.5">{item.value}</p>
              <p className="text-xs text-[#5a5652] mt-0.5">{item.desc}</p>
            </div>
            {item.href && <ArrowRight className="w-4 h-4 text-[#5a5652] group-hover:text-[#f5b342] group-hover:translate-x-0.5 transition-all mt-1" />}
          </Wrapper>
        )
      })}
    </div>
  )
}
