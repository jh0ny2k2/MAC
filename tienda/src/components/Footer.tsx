import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useFavorites } from '../context/FavoritesContext'
import { formatPrice } from '../utils/format'

const SHOP_LINKS = [
  { to: '/tienda', label: 'Catálogo completo' },
  { to: '/ofertas', label: 'Ofertas' },
  { to: '/favoritos', label: 'Mis favoritos' },
  { to: '/carrito', label: 'Mi carrito' },
]

const INFO_LINKS = [
  { to: '/sobre-nosotros', label: 'Sobre nosotros' },
  { to: '/escuderias', label: 'Escuderías' },
  { to: '/pilotos', label: 'Pilotos' },
  { to: '/sobre-nosotros', label: 'Envíos y devoluciones' },
  { to: '/sobre-nosotros', label: 'Atención al cliente' },
]

const SOCIALS = [
  {
    label: 'Instagram',
    path: 'M7.9 2h8.2A5.9 5.9 0 0 1 22 7.9v8.2A5.9 5.9 0 0 1 16.1 22H7.9A5.9 5.9 0 0 1 2 16.1V7.9A5.9 5.9 0 0 1 7.9 2Zm.9 10a3.2 3.2 0 1 0 6.4 0 3.2 3.2 0 0 0-6.4 0Zm5.8-5.6a.9.9 0 1 0 1.8 0 .9.9 0 0 0-1.8 0ZM12 6.9a5.1 5.1 0 1 1 0 10.2 5.1 5.1 0 0 1 0-10.2Z',
  },
  {
    label: 'X (Twitter)',
    path: 'M17.9 3H21l-6.8 7.8L22.2 21h-6.3l-4.9-6.4L5.4 21H2.2l7.3-8.4L2 3h6.4l4.4 5.9L17.9 3Zm-1.1 16h1.7L7.1 4.8H5.3L16.8 19Z',
  },
  {
    label: 'YouTube',
    path: 'M23.5 7.2a3 3 0 0 0-2.1-2.2C19.5 4.5 12 4.5 12 4.5s-7.5 0-9.4.5A3 3 0 0 0 .5 7.2C0 9.1 0 13 0 13s0 3.9.5 5.8a3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1c.5-1.9.5-5.8.5-5.8s0-3.9-.5-5.8ZM9.5 16.5v-7l6.5 3.5-6.5 3.5Z',
  },
  {
    label: 'Facebook',
    path: 'M13.5 22v-8h2.7l.4-3.1h-3.1V8.9c0-.9.3-1.5 1.6-1.5h1.6V4.6c-.3 0-1.2-.1-2.3-.1-2.3 0-3.9 1.4-3.9 4v2.4H8v3.1h2.5v8h3Z',
  },
]

export default function Footer() {
  const cartCount = useCart().count
  const favoritesCount = useFavorites().count
  const year = new Date().getFullYear()

  return (
    <footer className="speed-lines relative border-t border-carbon-800 bg-carbon-900">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-f1-500/70 to-transparent" />
      <div className="mx-auto max-w-[1440px] px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          <div>
            <Link to="/" className="flex items-center gap-3" aria-label="APEX F1 Collection">
              <span className="relative flex size-9 items-center justify-center overflow-hidden rounded-lg bg-white">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M3 16 L10 4 L17 16 H14 L10 9 L6 16 Z" fill="#0b0b0d" />
                </svg>
                <span className="absolute bottom-0 left-0 h-1 w-full bg-f1-500" />
              </span>
              <span className="flex flex-col leading-none">
                <span className="font-display text-xl font-bold uppercase tracking-[0.08em] text-white">APEX</span>
                <span className="text-[9px] font-medium uppercase tracking-[0.32em] text-carbon-400">F1 Collection</span>
              </span>
            </Link>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-carbon-400">
              La tienda de referencia para coleccionistas de coches de Fórmula 1 a escala.
              Réplicas oficiales de las escuderías más legendarias, con una obsesión por el detalle.
            </p>
            <div className="mt-6 flex gap-2">
              {SOCIALS.map(({ label, path }) => (
                <a
                  key={label}
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  aria-label={label}
                  className="flex size-9 items-center justify-center rounded-lg border border-carbon-700 text-carbon-400 transition-all duration-300 hover:border-f1-500 hover:bg-f1-500 hover:text-white"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d={path} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-display text-sm font-semibold uppercase tracking-[0.18em] text-white">Tienda</h4>
            <ul className="mt-5 space-y-3">
              {SHOP_LINKS.map((link) => (
                <li key={link.label}>
                  <Link to={link.to} className="text-sm text-carbon-400 transition-colors hover:text-f1-400">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display text-sm font-semibold uppercase tracking-[0.18em] text-white">Información</h4>
            <ul className="mt-5 space-y-3">
              {INFO_LINKS.map((link) => (
                <li key={link.label}>
                  <Link to={link.to} className="text-sm text-carbon-400 transition-colors hover:text-f1-400">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display text-sm font-semibold uppercase tracking-[0.18em] text-white">En esta temporada</h4>
            <p className="mt-5 text-sm text-carbon-400">
              <span className="font-semibold text-carbon-200">{cartCount}</span> artículos en tu carrito y{' '}
              <span className="font-semibold text-carbon-200">{favoritesCount}</span> favoritos guardados.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-carbon-500">
              Envío GRATIS a partir de {formatPrice(99)} en la península.
            </p>
            <div className="mt-5 rounded-xl border border-carbon-800 bg-carbon-850 p-4">
              <p className="text-xs uppercase tracking-widest text-carbon-500">Newsletter</p>
              <p className="mt-1.5 text-sm text-carbon-300">Novedades y ediciones limitadas, cada semana.</p>
              <div className="mt-3 flex gap-2">
                <input
                  type="email"
                  placeholder="tu@email.com"
                  className="w-full rounded-lg border border-carbon-700 bg-carbon-800 px-3 py-2 text-sm text-carbon-100 placeholder:text-carbon-500 focus:border-f1-500/70 focus:outline-none"
                />
                <button className="shrink-0 rounded-lg bg-f1-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-f1-400">
                  Unirme
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-carbon-800 pt-8 sm:flex-row">
          <p className="text-xs text-carbon-500">
            © {year} APEX F1 Collection. Todos los derechos reservados.
          </p>
          <p className="text-xs uppercase tracking-[0.2em] text-carbon-600">
            La Fórmula 1, en tus manos.
          </p>
        </div>
      </div>
    </footer>
  )
}