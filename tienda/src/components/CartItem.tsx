import { Link } from 'react-router-dom'
import { Trash2 } from 'lucide-react'
import type { CartItem as CartItemType } from '../types'
import { formatPrice } from '../utils/format'
import { useCart } from '../context/CartContext'
import { useToast } from '../context/ToastContext'
import QuantitySelector from './ui/QuantitySelector'
import Chip from './ui/Chip'

export default function CartItem({ item }: { item: CartItemType }) {
  const { product, quantity } = item
  const { updateQuantity, removeItem } = useCart()
  const { showToast } = useToast()

  return (
    <div className="flex gap-4 border-b border-carbon-800 pb-5 last:border-b-0 sm:gap-5">
      <Link
        to={`/producto/${product.id}`}
        className="block shrink-0 overflow-hidden rounded-xl border border-carbon-800 bg-carbon-850"
      >
        <img
          src={product.images[0]}
          alt={product.name}
          className="size-24 object-cover transition-transform duration-500 hover:scale-105 sm:size-28"
        />
      </Link>

      <div className="flex flex-1 flex-col justify-between gap-3 py-1">
        <div className="flex items-start justify-between gap-3">
          <div>
            <Link
              to={`/producto/${product.id}`}
              className="font-display text-sm font-medium leading-snug text-carbon-100 transition-colors hover:text-white sm:text-base"
            >
              {product.name}
            </Link>
            <div className="mt-1.5 flex items-center gap-2">
              <Chip className="text-[10px]">{product.scale}</Chip>
              <span className="text-[11px] text-carbon-500">
                {product.team} · {product.season}
              </span>
            </div>
            {product.oldPrice && product.oldPrice > product.price && (
              <span className="mt-1 inline-block text-xs text-carbon-500 line-through">
                {formatPrice(product.oldPrice)}
              </span>
            )}
          </div>
          <button
            onClick={() => {
              removeItem(product.id)
              showToast('Producto eliminado del carrito', 'info')
            }}
            aria-label="Eliminar producto"
            className="flex size-8 shrink-0 items-center justify-center rounded-lg text-carbon-500 transition-colors hover:bg-red-950/60 hover:text-red-400"
          >
            <Trash2 size={16} />
          </button>
        </div>

        <div className="flex items-center justify-between gap-3">
          <QuantitySelector
            size="sm"
            value={quantity}
            min={1}
            max={product.stock}
            onChange={(value) => updateQuantity(product.id, value)}
          />
          <span className="font-display text-lg font-semibold text-white">
            {formatPrice(product.price * quantity)}
          </span>
        </div>
      </div>
    </div>
  )
}