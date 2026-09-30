import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  CreditCard,
  ExternalLink,
  Mail,
  MapPin,
  Phone,
  Truck,
  User,
} from 'lucide-react'
import PageHeader from '../../components/common/PageHeader'
import LoadingSkeleton from '../../components/common/LoadingSkeleton'
import StatusBadge from '../../components/common/StatusBadge'
import OrderStatus from '../../components/admin/OrderStatus'
import { useToast } from '../../context/ToastContext'
import { orderService } from '../../services/orderService'
import { productService } from '../../services/productService'
import type { Order, OrderStatus as OrderStatusType, PaymentStatus } from '../../types/admin'
import { formatPrice } from '../../utils/format'

export default function OrderDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { showToast } = useToast()
  const [order, setOrder] = useState<Order | null>(null)
  const [notFound, setNotFound] = useState(false)
  const [images, setImages] = useState<Record<number, string>>({})
  const [updating, setUpdating] = useState<string | null>(null)

  const load = useCallback(async () => {
    const found = await orderService.getById(id ?? '')
    if (!found) {
      setNotFound(true)
      return
    }
    setOrder(found)
    const imageMap: Record<number, string> = {}
    await Promise.all(
      found.items.map(async (item) => {
        const product = await productService.getById(item.productId)
        imageMap[item.productId] = product?.images[0] ?? '/images/products/placeholder.svg'
      }),
    )
    setImages(imageMap)
  }, [id])

  useEffect(() => {
    load()
  }, [load])

  const itemsCount = useMemo(
    () => (order ? order.items.reduce((sum, item) => sum + item.quantity, 0) : 0),
    [order],
  )

  const updateStatus = async (status: OrderStatusType) => {
    if (!order || updating) return
    setUpdating(status)
    try {
      const updated = await orderService.updateStatus(order.id, status)
      setOrder(updated)
      showToast(`Pedido ${order.id} marcado como "${status}"`)
    } catch {
      showToast('No se pudo actualizar el estado', 'error')
    } finally {
      setUpdating(null)
    }
  }

  const updatePayment = async (payment: PaymentStatus) => {
    if (!order || updating) return
    setUpdating(payment)
    try {
      const updated = await orderService.updatePayment(order.id, payment)
      setOrder(updated)
      showToast('Estado de pago actualizado')
    } catch {
      showToast('No se pudo actualizar el pago', 'error')
    } finally {
      setUpdating(null)
    }
  }

  if (notFound) {
    return (
      <div className="rounded-2xl border border-carbon-800 bg-carbon-900/40 px-6 py-16 text-center">
        <h2 className="font-display text-xl font-bold text-white">Pedido no encontrado</h2>
        <p className="mt-2 text-sm text-carbon-400">Este pedido no existe en el sistema.</p>
        <Link
          to="/admin/pedidos"
          className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-f1-400 hover:text-f1-300"
        >
          <ArrowLeft size={15} />
          Volver a pedidos
        </Link>
      </div>
    )
  }

  if (!order) {
    return <LoadingSkeleton variant="table" count={6} />
  }

  return (
    <div className="space-y-6">
      <button
        type="button"
        onClick={() => navigate('/admin/pedidos')}
        className="inline-flex items-center gap-2 text-sm text-carbon-400 transition-colors hover:text-white"
      >
        <ArrowLeft size={15} />
        Volver a pedidos
      </button>

      <PageHeader
        title={`Pedido ${order.id}`}
        subtitle={`Realizado el ${new Date(order.date).toLocaleString('es-ES', {
          day: '2-digit',
          month: 'long',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        })} · ${itemsCount} artículo(s)`}
        actions={
          <div className="flex items-center gap-2">
            <StatusBadge status={order.status} />
            <StatusBadge status={order.payment} />
          </div>
        }
      />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="space-y-6 xl:col-span-2">
          {/* Estado del pedido */}
          <div className="rounded-2xl border border-carbon-800 bg-carbon-900/40 p-5">
            <h3 className="mb-5 font-display text-sm font-semibold text-white">
              Estado del pedido
            </h3>
            <OrderStatus status={order.status} onSelect={updateStatus} />
            <p className="mt-3 text-xs text-carbon-500">
              Haz clic en un estado para actualizarlo.
            </p>
          </div>

          {/* Artículos */}
          <div className="rounded-2xl border border-carbon-800 bg-carbon-900/40 p-5">
            <h3 className="mb-4 font-display text-sm font-semibold text-white">
              Artículos
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[480px] text-left text-sm">
                <thead>
                  <tr className="border-b border-carbon-800 text-[11px] uppercase tracking-wider text-carbon-500">
                    <th className="pb-2.5 pr-4 font-semibold">Producto</th>
                    <th className="pb-2.5 pr-4 font-semibold">Precio</th>
                    <th className="pb-2.5 pr-4 font-semibold">Cant.</th>
                    <th className="pb-2.5 font-semibold text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((item) => (
                    <tr key={item.productId} className="border-b border-carbon-800/60 last:border-0">
                      <td className="py-3 pr-4">
                        <div className="flex items-center gap-3">
                          <div className="size-10 shrink-0 overflow-hidden rounded-lg border border-carbon-800 bg-carbon-950">
                            <img
                              src={images[item.productId] ?? '/images/products/placeholder.svg'}
                              alt=""
                              className="size-full object-cover"
                            />
                          </div>
                          <span className="text-carbon-200">{item.name}</span>
                        </div>
                      </td>
                      <td className="py-3 pr-4 text-carbon-300">
                        {formatPrice(item.price)}
                      </td>
                      <td className="py-3 pr-4 text-carbon-300">{item.quantity}</td>
                      <td className="py-3 text-right font-medium text-carbon-100">
                        {formatPrice(item.price * item.quantity)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-4 ml-auto max-w-sm space-y-1.5 border-t border-carbon-800 pt-4 text-sm">
              <div className="flex justify-between text-carbon-400">
                <span>Subtotal</span>
                <span>{formatPrice(order.subtotal)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>Descuento</span>
                  <span>−{formatPrice(order.discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-carbon-400">
                <span>Envío</span>
                <span>{order.shipping === 0 ? 'Gratis' : formatPrice(order.shipping)}</span>
              </div>
              <div className="flex justify-between text-carbon-400">
                <span>IVA (21%)</span>
                <span>{formatPrice(order.tax)}</span>
              </div>
              <div className="flex justify-between border-t border-carbon-800 pt-2 text-base font-bold text-white">
                <span>Total</span>
                <span>{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Pago */}
          <div className="rounded-2xl border border-carbon-800 bg-carbon-900/40 p-5">
            <div className="mb-3 flex items-center gap-2">
              <CreditCard size={16} className="text-f1-400" />
              <h3 className="font-display text-sm font-semibold text-white">Pago</h3>
            </div>
            <div className="flex items-center justify-between gap-3">
              <StatusBadge status={order.payment} />
              <select
                value={order.payment}
                onChange={(e) => updatePayment(e.target.value as PaymentStatus)}
                className="rounded-lg border border-carbon-700 bg-carbon-900/60 px-3 py-2 text-sm text-carbon-200 focus:border-f1-500 focus:outline-none"
              >
                <option value="Pendiente">Pendiente</option>
                <option value="Pagado">Pagado</option>
                <option value="Reembolsado">Reembolsado</option>
              </select>
            </div>
          </div>

          {/* Cliente */}
          <div className="rounded-2xl border border-carbon-800 bg-carbon-900/40 p-5">
            <div className="mb-3 flex items-center gap-2">
              <User size={16} className="text-racing-400" />
              <h3 className="font-display text-sm font-semibold text-white">Cliente</h3>
            </div>
            <p className="text-sm font-medium text-carbon-100">{order.customerName}</p>
            <Link
              to={`/admin/clientes/${order.customerId}`}
              className="mt-1 inline-flex items-center gap-1 text-sm text-f1-400 hover:text-f1-300"
            >
              Ver ficha de cliente
              <ExternalLink size={13} />
            </Link>
            <div className="mt-3 space-y-1.5 text-sm text-carbon-400">
              <p className="flex items-center gap-2">
                <Mail size={14} className="shrink-0" />
                {order.email}
              </p>
              <p className="flex items-center gap-2">
                <Phone size={14} className="shrink-0" />
                {order.shippingAddress.phone}
              </p>
            </div>
          </div>

          {/* Envío */}
          <div className="rounded-2xl border border-carbon-800 bg-carbon-900/40 p-5">
            <div className="mb-3 flex items-center gap-2">
              <Truck size={16} className="text-emerald-400" />
              <h3 className="font-display text-sm font-semibold text-white">Dirección de envío</h3>
            </div>
            <p className="flex items-start gap-2 text-sm text-carbon-300">
              <MapPin size={15} className="mt-0.5 shrink-0 text-carbon-500" />
              <span>
                {order.shippingAddress.name}
                <br />
                {order.shippingAddress.address}
                <br />
                {order.shippingAddress.postalCode} · {order.shippingAddress.city}
                <br />
                {order.shippingAddress.country}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}