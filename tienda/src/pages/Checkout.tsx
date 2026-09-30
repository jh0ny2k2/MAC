import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ShoppingBag } from 'lucide-react'
import type { CustomerInfo, PaymentMethod, ShippingMethod } from '../types'
import { formatPrice } from '../utils/format'
import { useCart } from '../context/CartContext'
import { useToast } from '../context/ToastContext'
import PageHeader from '../components/PageHeader'
import EmptyState from '../components/ui/EmptyState'
import Button from '../components/ui/Button'
import { buttonStyles } from '../components/ui/Button'

const FREE_SHIPPING_THRESHOLD = 99

const SHIPPING_METHODS: ShippingMethod[] = [
  { id: 'standard', name: 'Estándar', description: '3-5 días laborables', price: 6.99, days: '3-5 días' },
  { id: 'express', name: 'Express', description: '2-3 días laborables', price: 12.99, days: '2-3 días' },
  { id: 'premium', name: 'Premium', description: 'Entrega en 24h', price: 19.99, days: '24 horas' },
]

const PAYMENT_METHODS: PaymentMethod[] = [
  { id: 'card', name: 'Tarjeta de crédito/débito', description: 'Visa, Mastercard, Amex', icon: 'card' },
  { id: 'paypal', name: 'PayPal', description: 'Pago con tu cuenta PayPal', icon: 'paypal' },
  { id: 'applepay', name: 'Apple Pay', description: 'Pago rápido con Face/Touch ID', icon: 'apple' },
  { id: 'klarna', name: 'Klarna', description: 'Paga en 3 plazos sin intereses', icon: 'klarna' },
]

const INITIAL_CUSTOMER: CustomerInfo = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  postalCode: '',
  country: 'España',
}

const inputClass =
  'w-full rounded-lg border border-carbon-700 bg-carbon-800 px-4 py-2.5 text-sm text-carbon-100 placeholder:text-carbon-500 transition-colors focus:border-f1-500/70 focus:outline-none focus:ring-1 focus:ring-f1-500/40'

function Field({
  label,
  error,
  children,
}: {
  label: string
  error?: string
  children: React.ReactNode
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-carbon-400">{label}</span>
      {children}
      {error && <span className="mt-1 block text-xs text-red-400">{error}</span>}
    </label>
  )
}

export default function Checkout() {
  const { items, subtotal, discount, clear } = useCart()
  const { showToast } = useToast()
  const navigate = useNavigate()

  const [customer, setCustomer] = useState<CustomerInfo>(INITIAL_CUSTOMER)
  const [shippingMethod, setShippingMethod] = useState(SHIPPING_METHODS[0])
  const [paymentMethod, setPaymentMethod] = useState(PAYMENT_METHODS[0].id)
  const [errors, setErrors] = useState<Partial<Record<keyof CustomerInfo, string>>>({})

  const setField = (field: keyof CustomerInfo, value: string) => {
    setCustomer((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  const shippingCost =
    shippingMethod.id === 'standard' && subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : shippingMethod.price

  const validate = (): boolean => {
    const next: Partial<Record<keyof CustomerInfo, string>> = {}

    if (!customer.firstName.trim()) next.firstName = 'El nombre es obligatorio'
    if (!customer.lastName.trim()) next.lastName = 'Los apellidos son obligatorios'
    if (!customer.email.trim()) {
      next.email = 'El email es obligatorio'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email)) {
      next.email = 'Introduce un email válido'
    }
    if (!customer.phone.trim()) next.phone = 'El teléfono es obligatorio'
    if (!customer.address.trim()) next.address = 'La dirección es obligatoria'
    if (!customer.city.trim()) next.city = 'La ciudad es obligatoria'
    if (!customer.postalCode.trim()) {
      next.postalCode = 'El código postal es obligatorio'
    } else if (!/^[0-9]{5}$/.test(customer.postalCode)) {
      next.postalCode = 'Código postal no válido'
    }

    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (items.length === 0) return
    if (!validate()) {
      showToast('Revisa los campos del formulario', 'error')
      return
    }

    const orderId = `APX-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`
    const order = {
      id: orderId,
      items,
      shipping: { ...shippingMethod, price: shippingCost },
      customer,
      subtotal,
      discount,
      shippingCost,
      total: subtotal + shippingCost - discount,
      date: new Date().toISOString(),
    }

    try {
      const stored = JSON.parse(localStorage.getItem('apex-f1-orders') ?? '[]')
      localStorage.setItem('apex-f1-orders', JSON.stringify([order, ...stored]))
    } catch {
      localStorage.setItem('apex-f1-orders', JSON.stringify([order]))
    }

    clear()
    showToast('Pedido realizado correctamente')
    navigate(`/checkout/exito?order=${encodeURIComponent(orderId)}`)
  }

  if (items.length === 0) {
    return (
      <div>
        <PageHeader eyebrow="Checkout" title="Finalizar compra" />
        <div className="mx-auto max-w-[1440px] px-4 py-16 sm:px-6 lg:px-8">
          <EmptyState
            icon={<ShoppingBag size={28} />}
            title="Tu carrito está vacío"
            message="Añade algunos modelos a tu carrito antes de finalizar la compra."
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
      <PageHeader eyebrow="Checkout" title="Finalizar compra" description="Rellena tus datos para completar el pedido. El pago es 100% simulado." />

      <div className="mx-auto max-w-[1440px] px-4 py-12 sm:px-6 lg:px-8">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_400px]">
          <div className="space-y-8">
            <section className="rounded-2xl border border-carbon-800 bg-carbon-900/70 p-6 sm:p-8">
              <h2 className="font-display text-lg font-semibold uppercase tracking-wide text-white">
                1 · Datos personales
              </h2>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <Field label="Nombre" error={errors.firstName}>
                  <input
                    className={inputClass}
                    value={customer.firstName}
                    onChange={(e) => setField('firstName', e.target.value)}
                    placeholder="Max"
                  />
                </Field>
                <Field label="Apellidos" error={errors.lastName}>
                  <input
                    className={inputClass}
                    value={customer.lastName}
                    onChange={(e) => setField('lastName', e.target.value)}
                    placeholder="Verstappen"
                  />
                </Field>
                <Field label="Email" error={errors.email}>
                  <input
                    type="email"
                    className={inputClass}
                    value={customer.email}
                    onChange={(e) => setField('email', e.target.value)}
                    placeholder="max@apex.f1"
                  />
                </Field>
                <Field label="Teléfono" error={errors.phone}>
                  <input
                    type="tel"
                    className={inputClass}
                    value={customer.phone}
                    onChange={(e) => setField('phone', e.target.value)}
                    placeholder="+34 600 000 000"
                  />
                </Field>
              </div>
            </section>

            <section className="rounded-2xl border border-carbon-800 bg-carbon-900/70 p-6 sm:p-8">
              <h2 className="font-display text-lg font-semibold uppercase tracking-wide text-white">
                2 · Dirección de envío
              </h2>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <Field label="Dirección" error={errors.address}>
                    <input
                      className={inputClass}
                      value={customer.address}
                      onChange={(e) => setField('address', e.target.value)}
                      placeholder="Calle de la raya de meta, 44"
                    />
                  </Field>
                </div>
                <Field label="Ciudad" error={errors.city}>
                  <input
                    className={inputClass}
                    value={customer.city}
                    onChange={(e) => setField('city', e.target.value)}
                    placeholder="Madrid"
                  />
                </Field>
                <Field label="Código postal" error={errors.postalCode}>
                  <input
                    className={inputClass}
                    value={customer.postalCode}
                    onChange={(e) => setField('postalCode', e.target.value)}
                    placeholder="28001"
                  />
                </Field>
                <Field label="País">
                  <select className={inputClass} value={customer.country} onChange={(e) => setField('country', e.target.value)}>
                    <option>España</option>
                    <option>Portugal</option>
                    <option>Francia</option>
                    <option>Italia</option>
                    <option>Alemania</option>
                    <option>Reino Unido</option>
                    <option>México</option>
                    <option>Argentina</option>
                  </select>
                </Field>
              </div>
            </section>

            <section className="rounded-2xl border border-carbon-800 bg-carbon-900/70 p-6 sm:p-8">
              <h2 className="font-display text-lg font-semibold uppercase tracking-wide text-white">
                3 · Método de envío
              </h2>
              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                {SHIPPING_METHODS.map((method) => {
                  const cost = method.id === 'standard' && subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : method.price
                  const selected = shippingMethod.id === method.id
                  return (
                    <label
                      key={method.id}
                      className={`cursor-pointer rounded-xl border p-4 transition-all duration-300 ${
                        selected ? 'border-f1-500 bg-f1-500/10' : 'border-carbon-700 bg-carbon-800/60 hover:border-carbon-500'
                      }`}
                    >
                      <input
                        type="radio"
                        name="shipping"
                        className="sr-only"
                        checked={selected}
                        onChange={() => setShippingMethod(method)}
                      />
                      <span className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-white">{method.name}</span>
                        <span className={`text-sm font-bold ${cost === 0 ? 'text-emerald-400' : 'text-white'}`}>
                          {cost === 0 ? 'Gratis' : formatPrice(cost)}
                        </span>
                      </span>
                      <span className="mt-1 block text-xs text-carbon-400">{method.description}</span>
                    </label>
                  )
                })}
              </div>
            </section>

            <section className="rounded-2xl border border-carbon-800 bg-carbon-900/70 p-6 sm:p-8">
              <h2 className="font-display text-lg font-semibold uppercase tracking-wide text-white">
                4 · Método de pago
              </h2>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {PAYMENT_METHODS.map((method) => {
                  const selected = paymentMethod === method.id
                  return (
                    <label
                      key={method.id}
                      className={`cursor-pointer rounded-xl border p-4 transition-all duration-300 ${
                        selected ? 'border-f1-500 bg-f1-500/10' : 'border-carbon-700 bg-carbon-800/60 hover:border-carbon-500'
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        className="sr-only"
                        checked={selected}
                        onChange={() => setPaymentMethod(method.id)}
                      />
                      <span className="flex items-center gap-3">
                        <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-carbon-800 text-carbon-300">
                          {method.icon === 'card' && (
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                              <rect x="2" y="5" width="20" height="14" rx="2" />
                              <path d="M2 10h20M6 15h4" strokeLinecap="round" />
                            </svg>
                          )}
                          {method.icon === 'paypal' && (
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M6.5 20.5H3.2l1.5-8.6h4.2c3.5 0 5.6 1.8 5.2 5-.4 3.9-2.4 5.6-7.1 4.8z" />
                            </svg>
                          )}
                          {method.icon === 'apple' && (
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M17 12.5c0-2.3 1.9-3.4 2-3.5-1.1-1.6-2.8-1.8-3.4-1.9-1.4-.2-2.8.9-3.6.9-.8 0-2-0.8-3.4-0.8-1.8 0-3.4 1-4.3 2.6-1.8 3.2-0.5 8 1.3 10.6 0.9 1.3 2 2.7 3.4 2.7 1.3 0 1.8-0.9 3.4-0.9s2 0.9 3.5 0.9c1.4 0 2.3-1.3 3.2-2.6 0.9-1.4 1.3-2.8 1.3-2.8s-2.4-0.9-2.4-3.2zM14 4.5c0.7-0.9 1.2-2.1 1.1-3.3-1 0-2.3 0.7-3 1.6-0.7 0.8-1.3 2-1.2 3.2 1.2 0.1 2.4-0.6 3.1-1.5z" />
                            </svg>
                          )}
                          {method.icon === 'klarna' && (
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                              <circle cx="6" cy="12" r="2.6" />
                              <path d="M12 9.4C10.6 7.9 8.9 7 7 7v10c1.9 0 3.6-0.9 5-2.4 1.4-1.5 2.2-3.5 2.2-5.5 0 2.3 0.8 4.2 2.2 5.5 1.4 1.5 2.7 2.4 4.6 2.4V7c-1.9 0-3.6 0.9-5 2.4-1.4 1.5-2.2 2.7-2.2 5.5 0-2.8-0.8-5.5-2.8-5.5z" />
                            </svg>
                          )}
                        </span>
                        <span className="flex flex-col">
                          <span className="text-sm font-semibold text-white">{method.name}</span>
                          <span className="text-xs text-carbon-400">{method.description}</span>
                        </span>
                      </span>
                    </label>
                  )
                })}
              </div>
            </section>
          </div>

          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-2xl border border-carbon-800 bg-carbon-900/70 p-6 sm:p-7">
              <h2 className="font-display text-lg font-semibold uppercase tracking-wide text-white">
                Tu pedido
              </h2>

              <ul className="mt-5 max-h-64 space-y-3 overflow-y-auto pr-1">
                {items.map(({ product, quantity }) => (
                  <li key={product.id} className="flex items-center gap-3">
                    <img src={product.images[0]} alt="" className="size-12 shrink-0 rounded-lg border border-carbon-800 object-cover" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm text-carbon-200">{product.name}</p>
                      <p className="text-xs text-carbon-500">Cantidad: {quantity}</p>
                    </div>
                    <span className="text-sm font-semibold text-white">{formatPrice(product.price * quantity)}</span>
                  </li>
                ))}
              </ul>

              <div className="my-5 h-px bg-carbon-800" />

              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-carbon-400">Subtotal</span>
                  <span className="text-carbon-100">{formatPrice(subtotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="text-carbon-400">Descuento</span>
                    <span className="text-emerald-400">-{formatPrice(discount)}</span>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-carbon-400">Envío ({shippingMethod.name})</span>
                  <span className={shippingCost === 0 ? 'text-emerald-400' : 'text-carbon-100'}>
                    {shippingCost === 0 ? 'Gratis' : formatPrice(shippingCost)}
                  </span>
                </div>
              </div>

              <div className="my-5 h-px bg-carbon-800" />

              <div className="flex items-center justify-between">
                <span className="font-display text-base font-semibold uppercase tracking-wide text-white">Total</span>
                <span className="font-display text-2xl font-bold text-white">
                  {formatPrice(subtotal - discount + shippingCost)}
                </span>
              </div>

              <Button type="submit" size="lg" block className="mt-7">
                Realizar pedido
              </Button>

              <p className="mt-4 text-center text-[11px] leading-relaxed text-carbon-500">
                Al realizar el pedido aceptas nuestras condiciones de compra.
                Este es un checkout de demostración: no se realizará ningún cargo real.
              </p>
            </div>
          </aside>
        </form>
      </div>
    </div>
  )
}