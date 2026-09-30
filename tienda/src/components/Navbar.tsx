import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { Heart, Menu, Search, ShoppingBag, Trophy, X } from 'lucide-react'
import { cx } from '../utils/format'
import { useCart } from '../context/CartContext'
import { useFavorites } from '../context/FavoritesContext'
import SearchBar from './SearchBar'
import { teams } from '../data'

const NAV_LINKS = [
  { to: '/', label: 'Inicio' },
  { to: '/tienda', label: 'Tienda' },
  { to: '/escuderias', label: 'Escuderías' },
  { to: '/pilotos', label: 'Pilotos' },
  { to: '/ofertas', label: 'Ofertas' },
  { to: '/sobre-nosotros', label: 'Sobre nosotros' },
]

const PROMOS = [
  'Envío GRATIS en pedidos superiores a 99 €',
  'Colección oficial de Fórmula 1',
  'Pago seguro y envío a toda España',
]

function Logo() {
  return (
    <Link to="/" className="flex items-center gap-3" aria-label="APEX F1 Collection - Inicio">
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
  )
}

function CountBadge({ count }: { count: number }) {
  if (count === 0) return null
  return (
    <span className="absolute -right-1 -top-1 flex min-w-[18px] h-[18px] items-center justify-center rounded-full bg-f1-500 px-1 text-[10px] font-bold text-white shadow-lg shadow-f1-500/40">
      {count > 99 ? '99+' : count}
    </span>
  )
}

export default function Navbar() {
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [mobileOpen, setMobileOpen] = useState(false)
  const searchInputRef = useRef<HTMLInputElement>(null)

  const location = useLocation()
  const navigate = useNavigate()
  const cartCount = useCart().count
  const favoritesCount = useFavorites().count

  useEffect(() => {
    setSearchOpen(false)
    setMobileOpen(false)
  }, [location.pathname, location.search])

  useEffect(() => {
    if (searchOpen) searchInputRef.current?.focus()
  }, [searchOpen])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSearchOpen(false)
        setMobileOpen(false)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileOpen])

  const runSearch = () => {
    setSearchOpen(false)
    navigate(`/tienda?search=${encodeURIComponent(searchTerm)}`)
    setSearchTerm('')
  }

  return (
    <header className="sticky top-0 z-50 border-b border-carbon-800/80 bg-carbon-950/85 backdrop-blur-xl">
      <div className="speed-lines overflow-hidden border-b border-carbon-800 bg-carbon-900/60 py-1.5">
        <div className="flex w-max animate-marquee gap-12 whitespace-nowrap">
          {[0, 1].map((rep) => (
            <div key={rep} className="flex gap-12">
              {PROMOS.map((promo) => (
                <span key={promo} className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.18em] text-carbon-400">
                  <Trophy size={11} className="text-f1-500" />
                  {promo}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      <nav className="mx-auto flex h-[68px] max-w-[1440px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Logo />

        <div className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) =>
                cx(
                  'relative px-4 py-2 text-sm font-medium transition-colors duration-300 before:absolute before:inset-x-4 before:bottom-0 before:h-0.5 before:origin-center before:bg-f1-500 before:transition-transform before:duration-300',
                  isActive
                    ? 'text-white before:scale-x-100'
                    : 'text-carbon-400 before:scale-x-0 hover:text-white hover:before:scale-x-100',
                )
              }
            >
              {link.label}
            </NavLink>
          ))}
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            onClick={() => setSearchOpen((v) => !v)}
            aria-label="Buscar"
            className={cx(
              'relative flex size-10 items-center justify-center rounded-lg transition-colors duration-300',
              searchOpen ? 'bg-carbon-800 text-f1-500' : 'text-carbon-300 hover:bg-carbon-800 hover:text-white',
            )}
          >
            <Search size={19} />
          </button>

          <Link
            to="/favoritos"
            aria-label="Favoritos"
            className="relative flex size-10 items-center justify-center rounded-lg text-carbon-300 transition-colors duration-300 hover:bg-carbon-800 hover:text-white"
          >
            <Heart size={19} />
            <CountBadge count={favoritesCount} />
          </Link>

          <Link
            to="/carrito"
            aria-label="Carrito"
            className="relative flex size-10 items-center justify-center rounded-lg text-carbon-300 transition-colors duration-300 hover:bg-carbon-800 hover:text-white"
          >
            <ShoppingBag size={19} />
            <CountBadge count={cartCount} />
          </Link>

          <button
            onClick={() => setMobileOpen(true)}
            aria-label="Abrir menú"
            className="flex size-10 items-center justify-center rounded-lg text-carbon-300 transition-colors hover:bg-carbon-800 hover:text-white lg:hidden"
          >
            <Menu size={20} />
          </button>
        </div>
      </nav>

      {searchOpen && (
        <div className="absolute inset-x-0 top-full border-b border-carbon-800 bg-carbon-950/95 shadow-2xl backdrop-blur-xl animate-fade-in">
          <div className="mx-auto max-w-[1440px] px-4 py-6 sm:px-6 lg:px-8">
            <SearchBar
              value={searchTerm}
              onChange={setSearchTerm}
              onSubmit={runSearch}
              autoFocus
            />
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="text-xs uppercase tracking-widest text-carbon-500">Búsquedas rápidas:</span>
              {teams.slice(0, 5).map((team) => (
                <button
                  key={team.id}
                  onClick={() => {
                    setSearchOpen(false)
                    navigate(`/tienda?team=${team.id}`)
                  }}
                  className="rounded-full border border-carbon-700 px-3 py-1.5 text-xs text-carbon-300 transition-colors hover:border-f1-500 hover:text-f1-400"
                >
                  {team.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {mobileOpen && (
        <div className="fixed inset-0 z-[70] lg:hidden" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <div className="absolute inset-y-0 right-0 flex w-[84vw] max-w-xs flex-col border-l border-carbon-800 bg-carbon-900 shadow-2xl animate-slide-in-right">
            <div className="flex items-center justify-between border-b border-carbon-800 px-5 py-4">
              <span className="font-display text-base font-semibold uppercase tracking-widest text-white">Menú</span>
              <button
                onClick={() => setMobileOpen(false)}
                aria-label="Cerrar menú"
                className="flex size-9 items-center justify-center rounded-lg text-carbon-300 hover:bg-carbon-800 hover:text-white"
              >
                <X size={19} />
              </button>
            </div>
            <nav className="flex flex-1 flex-col gap-1 px-4 py-4">
              {NAV_LINKS.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.to === '/'}
                  className={({ isActive }) =>
                    cx(
                      'rounded-lg px-4 py-3 font-display text-base uppercase tracking-wide transition-colors',
                      isActive ? 'bg-carbon-800 text-f1-500' : 'text-carbon-300 hover:bg-carbon-800 hover:text-white',
                    )
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </nav>
            <div className="border-t border-carbon-800 p-5">
              <p className="text-center text-xs text-carbon-500">
                La Fórmula 1, en tus manos.
              </p>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}