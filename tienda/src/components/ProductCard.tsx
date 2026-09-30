import { Link } from 'react-router-dom'
import { ShoppingBag } from 'lucide-react'
import type { Product } from '../types'
import { getTeamByName } from '../data'
import { cx, formatPrice, getDiscountPercent } from '../utils/format'
import { useCart } from '../context/CartContext'
import { useToast } from '../context/ToastContext'
import RatingStars from './ui/RatingStars'
import Chip from './ui/Chip'
import FavoriteButton from './ui/FavoriteButton'

interface ProductCardProps {
  product: Product
  className?: string
}

export default function ProductCard({ product, className }: ProductCardProps) {
  const { addItem } = useCart()
  const { showToast } = useToast()
  const team = getTeamByName(product.team)
  const discount = getDiscountPercent(product.price, product.oldPrice)
  const outOfStock = product.stock <= 0
  const lowStock = product.stock > 0 && product.stock <= 3

  const handleAdd = () => {
    addItem(product)
    showToast(`${product.name} añadido al carrito`)
  }

  return (
    <div
      className={cx(
        'group relative flex flex-col overflow-hidden rounded-2xl border border-carbon-800 bg-carbon-900 transition-all duration-500 hover:-translate-y-1.5 hover:border-carbon-600 hover:shadow-2xl hover:shadow-black/50',
        className,
      )}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-carbon-850">
        <Link to={`/producto/${product.id}`} aria-label={product.name}>
          <img
            src={product.images[0]}
            alt={product.name}
            loading="lazy"
            className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </Link>

        <div className="absolute inset-0 bg-gradient-to-t from-carbon-950/60 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

        <div className="absolute left-3 top-3 flex flex-col items-start gap-1.5">
          {discount > 0 && (
            <span className="rounded-md bg-f1-500 px-2 py-1 text-[11px] font-bold text-white shadow-lg shadow-f1-500/30">
              -{discount}%
            </span>
          )}
          {product.bestseller && (
            <span className="rounded-md bg-white px-2 py-1 text-[11px] font-bold text-carbon-950">
              Más vendido
            </span>
          )}
        </div>

        <div className="absolute right-3 top-3">
          <FavoriteButton productId={product.id} />
        </div>

        <div className="absolute bottom-3 left-3 flex items-center gap-2">
          {outOfStock && (
            <Chip className="border-red-900/50 bg-red-950/80 text-red-300">Agotado</Chip>
          )}
          {lowStock && !outOfStock && (
            <Chip className="border-amber-800/50 bg-amber-950/80 text-amber-300">
              Quedan {product.stock} uds.
            </Chip>
          )}
          {!lowStock && !outOfStock && (
            <Chip className="border-emerald-900/50 bg-emerald-950/80 text-emerald-300">En stock</Chip>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-2.5 p-5">
        <div className="flex flex-wrap items-center gap-2">
          {team && (
            <span className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-carbon-400">
              <span className="size-2 rounded-full" style={{ backgroundColor: team.color }} />
              {team.code}
            </span>
          )}
          <span className="text-[11px] uppercase tracking-wider text-carbon-500">
            {product.season} · {product.scale}
          </span>
        </div>

        <Link to={`/producto/${product.id}`} className="group-hover:text-white">
          <h3 className="font-display text-lg font-medium leading-snug text-carbon-100 transition-colors">
            {product.name}
          </h3>
        </Link>

        <p className="text-xs text-carbon-500">{product.driver}</p>

        <RatingStars rating={product.rating} reviews={product.reviews} />

        <div className="mt-auto flex items-end justify-between gap-3 pt-1">
          <div className="flex flex-col">
            {product.oldPrice && product.oldPrice > product.price && (
              <span className="text-xs text-carbon-500 line-through">{formatPrice(product.oldPrice)}</span>
            )}
            <span className="font-display text-xl font-semibold text-white">{formatPrice(product.price)}</span>
          </div>

          <button
            onClick={handleAdd}
            disabled={outOfStock}
            aria-label={`Añadir ${product.name} al carrito`}
            className="flex items-center gap-1.5 rounded-lg bg-carbon-800 px-3 py-2 text-xs font-semibold text-carbon-200 ring-1 ring-carbon-700 transition-all duration-300 hover:bg-f1-500 hover:text-white hover:ring-f1-500 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ShoppingBag size={14} />
            <span className="hidden sm:inline">{outOfStock ? 'Agotado' : 'Añadir'}</span>
          </button>
        </div>
      </div>
    </div>
  )
}