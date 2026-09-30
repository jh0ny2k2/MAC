import type { Customer, CustomerStats } from '../types/admin'
import customersData from '../data/customers.json'
import { loadCollection, nextId, saveCollection, simulateDelay } from './storage'
import { orderService } from './orderService'
import { productService } from './productService'

const KEY = 'customers'

function all(): Customer[] {
  return loadCollection<Customer>(KEY, customersData as Customer[])
}

function save(collection: Customer[]): void {
  saveCollection(KEY, collection)
}

const round2 = (n: number): number => Math.round(n * 100) / 100

export const customerService = {
  async getAll(): Promise<Customer[]> {
    await simulateDelay()
    return all().sort(
      (a, b) => new Date(b.registeredAt).getTime() - new Date(a.registeredAt).getTime(),
    )
  },

  async getById(id: number): Promise<Customer | undefined> {
    await simulateDelay(200)
    return all().find((c) => c.id === id)
  },

  async getStats(customerId: number): Promise<CustomerStats> {
    await simulateDelay(250)
    const orders = (await orderService.getAll()).filter(
      (o) => o.customerId === customerId && o.status !== 'Cancelado',
    )
    const units: Record<number, number> = {}
    for (const order of orders) {
      for (const item of order.items) {
        units[item.productId] = (units[item.productId] ?? 0) + item.quantity
      }
    }
    const favoriteId = Object.entries(units).sort((a, b) => b[1] - a[1])[0]?.[0]
    const favoriteProduct = favoriteId
      ? (await productService.getById(Number(favoriteId)))?.name
      : undefined
    const totalSpent = round2(
      orders.reduce((sum, o) => sum + o.total, 0),
    )
    const ordersCount = orders.length
    const lastOrder =
      orders.length > 0
        ? orders.map((o) => o.date).sort((a, b) => new Date(b).getTime() - new Date(a).getTime())[0]
        : undefined
    return {
      ordersCount,
      totalSpent,
      averageTicket: ordersCount > 0 ? round2(totalSpent / ordersCount) : 0,
      lastOrderDate: lastOrder,
      favoriteProduct,
    }
  },

  async create(data: Omit<Customer, 'id' | 'registeredAt'> & { id?: number }): Promise<Customer> {
    await simulateDelay()
    const collection = all()
    const customer: Customer = {
      ...data,
      status: data.status ?? 'activo',
      id: data.id ?? nextId(collection),
      registeredAt: new Date().toISOString(),
    }
    collection.push(customer)
    save(collection)
    return customer
  },

  async update(id: number, data: Partial<Customer>): Promise<Customer> {
    await simulateDelay()
    const collection = all()
    const index = collection.findIndex((c) => c.id === id)
    if (index === -1) throw new Error('Cliente no encontrado')
    collection[index] = { ...collection[index], ...data, id }
    save(collection)
    return collection[index]
  },

  async updateStatus(id: number, status: 'activo' | 'inactivo'): Promise<void> {
    await this.update(id, { status })
  },

  async remove(id: number): Promise<void> {
    await simulateDelay()
    save(all().filter((c) => c.id !== id))
  },
}

export { round2 as roundMoney }