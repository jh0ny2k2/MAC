import { Link } from 'react-router-dom'
import { ArrowRight, ShoppingBag } from 'lucide-react'
import { formatPrice } from '../utils/format'
import { useCart } from '../context/CartContext'
import PageHeader from '../components/PageHeader'
import CartItem from '../components/CartItem'
import EmptyState from '../components/ui/EmptyState'
import { buttonStyles } from '../components/ui/Button'

const FREE_SHIPPING_THRESHOLD = 99

export default function Cart() {
  const { items, subtotal, discount, shipping, total } = useCart()

  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal)
  const progress = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100)

  if (items.length === 0) {
    return (
      <div>
        <PageHeader eyebrow="Tu carrito" title="Carrito" />
        <div className="mx-auto max-w-[1440px] px-4 py-16 sm:px-6 lg:px-8">
          <EmptyState
            icon={<ShoppingBag size={28} />}
            title="Tu carrito está vacío"
            message="Aún no has añadido ningún modelo. Explora el catálogo y encuentra la pieza que dará vida a tu colección."
            action={
              <Link to="/tienda" className={buttonStyles({ size: 'lg' })}>
                Explorar la tienda
              </Link>
            }
          />
        </div>
      </div>
    )
  }

  return (
    <div>
      <PageHeader eyebrow="Tu carrito" title="Carrito" description="Revisa los modelos seleccionados antes de finalizar tu pedido." />

      <div className="mx-auto max-w-[1440px] px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_380px]">
          <div>
            <div className="rounded-2xl border border-carbon-800 bg-carbon-900/70 p-6 sm:p-8">
              {items.map((item) => (
                <CartItem key={item.product.id} item={item} />
              ))}
            </div>

            <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
              <Link
                to="/tienda"
                className="inline-flex items-center gap-2 text-sm font-semibold text-carbon-300 transition-colors hover:text-white"
              >
                <ArrowRight size={15} className="rotate-180" /> Seguir comprando
              </Link>
              <p className="text-xs text-carbon-500">
                {items.length} {items.length === 1 ? 'modelo' : 'modelos'} en tu carrito
              </p>
            </div>
          </div>

          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-2xl border border-carbon-800 bg-carbon-900/70 p-6 sm:p-7">
              <h2 className="font-display text-lg font-semibold uppercase tracking-wide text-white">
                Resumen del pedido
              </h2>

              <div className="mt-6 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-carbon-400">Subtotal</span>
                  <span className="font-medium text-carbon-100">{formatPrice(subtotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-carbon-400">Descuento</span>
                    <span className="font-medium text-emerald-400">-{formatPrice(discount)}</span>
                  </div>
                )}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-carbon-400">Envío</span>
                  <span className={shipping === 0 ? 'font-medium text-emerald-400' : 'font-medium text-carbon-100'}>
                    {shipping === 0 ? 'Gratis' : formatPrice(shipping)}
                  </span>
                </div>
              </div>

              <div className="my-5 h-px bg-carbon-800" />

              <div className="flex items-center justify-between">
                <span className="font-display text-base font-semibold uppercase tracking-wide text-white">Total</span>
                <span className="font-display text-2xl font-bold text-white">{formatPrice(total)}</span>
              </div>

              <Link to="/checkout" className={buttonStyles({ size: 'lg', block: true, className: 'mt-7' })}>
                Finalizar compra
              </Link>

              <div className="mt-6">
                <div className="flex items-center justify-between text-xs text-carbon-400">
                  <span>Envío gratuito desde {formatPrice(FREE_SHIPPING_THRESHOLD)}</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-carbon-800">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-f1-500 to-racing-500 transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                {remaining > 0 && (
                  <p className="mt-2 text-xs text-carbon-500">
                    Te faltan <span className="font-semibold text-carbon-300">{formatPrice(remaining)}</span> para el envío gratis.
                  </p>
                )}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}