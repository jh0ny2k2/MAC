import type { Order, OrderItem, OrderStatus, PaymentStatus } from '../types/admin'
import ordersData from '../data/orders.json'
import { loadCollection, saveCollection, simulateDelay } from './storage'

const KEY = 'orders'
const VAT = 0.21

export const ORDER_STATUSES: { value: OrderStatus; label: string }[] = [
  { value: 'Pendiente', label: 'Pendiente' },
  { value: 'Confirmado', label: 'Confirmado' },
  { value: 'Preparando', label: 'Preparando' },
  { value: 'Enviado', label: 'Enviado' },
  { value: 'Entregado', label: 'Entregado' },
  { value: 'Cancelado', label: 'Cancelado' },
]

export const PAYMENT_STATUSES: { value: PaymentStatus; label: string }[] = [
  { value: 'Pendiente', label: 'Pendiente' },
  { value: 'Pagado', label: 'Pagado' },
  { value: 'Reembolsado', label: 'Reembolsado' },
]

const round2 = (n: number): number => Math.round(n * 100) / 100

function recompute(order: Order): Order {
  if (!order.items) return order
  const items = order.items as OrderItem[]
  const subtotal = round2(
    items.reduce((sum, item) => sum + item.price * item.quantity, 0),
  )
  const tax = round2((subtotal - (order.discount ?? 0)) * VAT)
  const total = round2(subtotal - (order.discount ?? 0) + (order.shipping ?? 0) + tax)
  return {
    ...order,
    subtotal,
    tax,
    total,
  }
}

function all(): Order[] {
  return loadCollection<Order>(KEY, ordersData as Order[]).map(recompute)
}

function save(collection: Order[]): void {
  saveCollection(KEY, collection)
}

function durationDays(start: string): number {
  const startMs = new Date(start).getTime()
  const now = Date.now()
  const ms = now - startMs
  const days = Math.floor(ms / (24 * 60 * 60 * 1000))
  return Math.max(days, 0)
}

export const orderService = {
  async getAll(): Promise<Order[]> {
    await simulateDelay()
    return all().sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    )
  },

  async getById(id: string): Promise<Order | undefined> {
    await simulateDelay(200)
    return all().find((o) => o.id === id)
  },

  async getByStatus(status: OrderStatus | 'todos'): Promise<Order[]> {
    await simulateDelay(250)
    const orders = all()
    if (status === 'todos') {
      return orders.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
      )
    }
    return orders.filter((o) => o.status === status)
  },

  async updateStatus(id: string, status: OrderStatus): Promise<Order> {
    await simulateDelay()
    const collection = all()
    const index = collection.findIndex((o) => o.id === id)
    if (index === -1) throw new Error('Pedido no encontrado')
    collection[index] = { ...collection[index], status }
    save(collection)
    return collection[index]
  },

  async updatePayment(id: string, payment: PaymentStatus): Promise<Order> {
    await simulateDelay()
    const collection = all()
    const index = collection.findIndex((o) => o.id === id)
    if (index === -1) throw new Error('Pedido no encontrado')
    collection[index] = { ...collection[index], payment }
    save(collection)
    return collection[index]
  },

  async create(data: Omit<Order, 'id' | 'date' | 'status' | 'payment' | 'subtotal' | 'tax' | 'total'> & {
    status?: OrderStatus
    payment?: PaymentStatus
  }): Promise<Order> {
    await simulateDelay()
    const collection = all()
    const maxNumber = collection.reduce((max, o) => {
      const n = Number.parseInt(o.id.replace(/\D/g, ''), 10)
      return Number.isNaN(n) ? max : Math.max(max, n)
    }, 1000)
    const raw: Order = {
      id: '',
      date: new Date().toISOString(),
      status: 'Pendiente',
      payment: 'Pendiente',
      ...data,
      subtotal: 0,
      tax: 0,
      total: 0,
    }
    const order = recompute(raw)
    order.id = `F1-${maxNumber + 1}`
    collection.push(order)
    save(collection)
    return order
  },

  async pendingCount(): Promise<number> {
    await simulateDelay(100)
    return all().filter((o) => o.status === 'Pendiente').length
  },

  async recent(limit = 6): Promise<Order[]> {
    await simulateDelay(150)
    return all()
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, limit)
  },

  durationDays,
}

export { durationDays as orderDurationDays }