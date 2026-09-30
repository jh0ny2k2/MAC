import { Link } from 'react-router-dom'
import { Home } from 'lucide-react'
import { buttonStyles } from '../components/ui/Button'

export default function NotFound() {
  return (
    <div className="speed-lines relative flex min-h-[70vh] flex-col items-center justify-center overflow-hidden px-4 py-24 text-center">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-f1-500/60 to-transparent" />
      <p className="font-display text-[9rem] font-bold leading-none text-white/10 sm:text-[13rem]">404</p>
      <h1 className="mt-2 font-display text-4xl font-bold uppercase tracking-wide text-white">
        Fuera de pista
      </h1>
      <p className="mt-4 max-w-md text-sm leading-relaxed text-carbon-400">
        La página que buscas no existe o ha abandonado la carrera. Vuelve a una zona segura
        y sigue explorando la colección.
      </p>
      <Link to="/" className={buttonStyles({ size: 'lg', className: 'mt-8' })}>
        <Home size={16} />
        Volver al inicio
      </Link>
    </div>
  )
}