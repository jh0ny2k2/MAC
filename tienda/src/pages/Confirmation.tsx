import { Link, useSearchParams } from 'react-router-dom'
import { CheckCircle2, Package, PartyPopper, Timer } from 'lucide-react'
import type { Order } from '../types'
import { formatDate, formatPrice } from '../utils/format'
import { buttonStyles } from '../components/ui/Button'

function getStoredOrders(): Order[] {
  try {
    return JSON.parse(localStorage.getItem('apex-f1-orders') ?? '[]') as Order[]
  } catch {
    return []
  }
}

export default function Confirmation() {
  const [searchParams] = useSearchParams()
  const orderId = searchParams.get('order') ?? ''
  const order = getStoredOrders().find((o) => o.id === orderId)

  return (
    <div className="relative overflow-hidden">
      <div className="speed-lines absolute inset-0 opacity-50" />
      <div className="absolute -top-32 left-1/2 size-96 -translate-x-1/2 rounded-full bg-f1-500/15 blur-3xl" />

      <div className="relative mx-auto flex max-w-2xl flex-col items-center px-4 py-24 text-center sm:py-32">
        <div className="animate-scale-in flex size-20 items-center justify-center rounded-full bg-emerald-950/70 ring-1 ring-emerald-500/40">
          <CheckCircle2 size={40} className="text-emerald-400" />
        </div>

        <h1 className="mt-8 animate-fade-up font-display text-4xl font-bold uppercase leading-tight tracking-wide text-white sm:text-5xl">
          ¡Pedido realizado correctamente!
        </h1>
        <p className="mt-4 animate-fade-up max-w-lg text-sm leading-relaxed text-carbon-300 sm:text-base" style={{ animationDelay: '120ms' }}>
          Gracias por tu compra. Hemos recibido tu pedido y muy pronto estará en camino hasta tu vitrina.
        </p>

        <div className="mt-8 w-full animate-fade-up rounded-2xl border border-carbon-800 bg-carbon-900/80 p-6 backdrop-blur-xl sm:p-8" style={{ animationDelay: '200ms' }}>
          <div className="flex flex-col items-center justify-between gap-4 border-b border-carbon-800 pb-6 sm:flex-row">
            <div className="text-left">
              <p className="text-xs uppercase tracking-widest text-carbon-500">Número de pedido</p>
              <p className="font-display text-xl font-bold tracking-wide text-white">{order?.id ?? orderId}</p>
            </div>
            {order && (
              <div className="text-left sm:text-right">
                <p className="text-xs uppercase tracking-widest text-carbon-500">Fecha</p>
                <p className="text-sm font-medium text-carbon-200">{formatDate(order.date)}</p>
              </div>
            )}
          </div>

          {order && (
            <div className="mt-6 grid gap-6 text-left sm:grid-cols-2">
              <div>
                <p className="flex items-center gap-2 text-xs uppercase tracking-widest text-carbon-500">
                  <Package size={13} className="text-f1-500" /> {order.items.length} {order.items.length === 1 ? 'artículo' : 'artículos'}
                </p>
                <p className="mt-2 text-lg font-bold text-white">{formatPrice(order.total)}</p>
                <p className="mt-1 text-xs text-carbon-400">
                  Descuento aplicado: -{formatPrice(order.discount)} · Envío{' '}
                  {order.shippingCost === 0 ? 'gratis' : formatPrice(order.shippingCost)}
                </p>
              </div>
              <div>
                <p className="flex items-center gap-2 text-xs uppercase tracking-widest text-carbon-500">
                  <Timer size={13} className="text-f1-500" /> Entrega estimada
                </p>
                <p className="mt-2 text-sm font-medium text-carbon-200">
                  {order.shipping.days} · {order.shipping.name}
                </p>
                <p className="mt-1 text-xs text-carbon-400">
                  {order.customer.address} · {order.customer.city} ({order.customer.postalCode})
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="mt-8 flex animate-fade-up flex-wrap justify-center gap-3" style={{ animationDelay: '280ms' }}>
          <Link to="/tienda" className={buttonStyles({ size: 'lg' })}>
            Seguir comprando
          </Link>
          <Link
            to="/favoritos"
            className={buttonStyles({ size: 'lg', variant: 'outline' })}
          >
            Ir a mis favoritos
          </Link>
        </div>

        <p className="mt-10 flex animate-fade-up items-center gap-2 text-xs text-carbon-500" style={{ animationDelay: '340ms' }}>
          <PartyPopper size={13} className="text-f1-500" />
          Recibirás un email de confirmación en breve.
        </p>
      </div>
    </div>
  )
}