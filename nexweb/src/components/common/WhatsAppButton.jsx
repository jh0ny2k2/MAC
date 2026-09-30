import { MessageCircle } from 'lucide-react'

const WHATSAPP_NUMBER = '34600000000'
const DEFAULT_MESSAGE = '¡Hola! Me gustaría solicitar información sobre sus servicios web.'

export default function WhatsAppButton() {
  return (
    <a
      href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(DEFAULT_MESSAGE)}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-[#25D366] shadow-lg shadow-[#25D366]/30 hover:shadow-xl hover:shadow-[#25D366]/40 hover:-translate-y-0.5 hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center group"
      aria-label="Contactar por WhatsApp"
    >
      <div className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-20 group-hover:opacity-30" />
      <MessageCircle className="w-7 h-7 text-white relative" />
    </a>
  )
}
