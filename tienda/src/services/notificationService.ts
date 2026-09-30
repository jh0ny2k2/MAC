import type { ActivityEntry, AdminNotification } from '../types/admin'
import { loadObject, saveObject, simulateDelay } from './storage'
import { orderService } from './orderService'
import { customerService } from './customerService'
import { inventoryService } from './inventoryService'

const KEY = 'notificationsRead'

function readIds(): string[] {
  return loadObject<string[]>(KEY, [])
}

function saveRead(ids: string[]): void {
  saveObject(KEY, ids)
}

export const notificationService = {
  async getAll(): Promise<AdminNotification[]> {
    await simulateDelay(300)
    const [orders, customers, alerts] = await Promise.all([
      orderService.recent(8),
      customerService.getAll(),
      inventoryService.getAlerts(),
    ])
    const read = readIds()
    const isRead = (id: string) => read.includes(id)
    const list: AdminNotification[] = orders.map((order) => {
      const kind =
        order.status === 'Cancelado'
          ? 'cancelled'
          : order.status === 'Pendiente' || order.status === 'Confirmado'
            ? 'order'
            : order.status === 'Preparando' || order.status === 'Enviado'
              ? 'shipped'
              : 'order'
      return {
        id: `order-${order.id}`,
        type: kind,
        message:
          order.status === 'Cancelado'
            ? `Pedido ${order.id} de ${order.customerName} cancelado`
            : `Nuevo pedido ${order.id} de ${order.customerName}`,
        date: order.date,
        read: isRead(`order-${order.id}`),
      }
    })

    const lowStockN = alerts.filter((a) => a.alert === 'stock-bajo')
    const out = alerts.filter((a) => a.alert === 'agotado')

    lowStockN.forEach((alert) => {
      list.push({
        id: `stock-${alert.product.id}`,
        type: 'stock',
        message: `Stock bajo: ${alert.product.name} (${alert.product.stock} uds.)`,
        date: new Date(Date.now() - 3600000).toISOString(),
        read: isRead(`stock-${alert.product.id}`),
      })
    })
    out.forEach((alert) => {
      list.push({
        id: `out-${alert.product.id}`,
        type: 'out',
        message: `Agotado: ${alert.product.name}`,
        date: new Date(Date.now() - 7200000).toISOString(),
        read: isRead(`out-${alert.product.id}`),
      })
    })

    const recentCustomer = customers[0]
    if (recentCustomer) {
      list.push({
        id: `customer-${recentCustomer.id}`,
        type: 'customer',
        message: `Nuevo cliente registrado: ${recentCustomer.name}`,
        date: recentCustomer.registeredAt,
        read: isRead(`customer-${recentCustomer.id}`),
      })
    }

    return list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  },

  async unreadCount(): Promise<number> {
    const list = await this.getAll()
    return list.filter((n) => !n.read).length
  },

  async markAllRead(): Promise<void> {
    const list = await this.getAll()
    const existing = readIds()
    const combined = Array.from(new Set([...existing, ...list.map((n) => n.id)]))
    saveRead(combined)
  },
}

export const activityService = {
  async getRecent(limit = 8): Promise<ActivityEntry[]> {
    await simulateDelay(250)
    const [orders, customers] = await Promise.all([
      orderService.recent(6),
      customerService.getAll(),
    ])
    const entries: ActivityEntry[] = []

    orders.forEach((order) => {
      entries.push({
        id: `order-${order.id}`,
        type: 'order',
        message:
          order.status === 'Entregado'
            ? `${order.customerName} recibió el pedido ${order.id}`
            : order.status === 'Cancelado'
              ? `Pedido ${order.id} de ${order.customerName} cancelado`
              : `Nuevo pedido ${order.id} de ${order.customerName} (${order.items.reduce((s, it) => s + it.quantity, 0)} uds.)`,
        date: order.date,
      })
    })

    customers.slice(0, 2).forEach((c) => {
      entries.push({
        id: `customer-${c.id}`,
        type: 'customer',
        message: `Nuevo cliente: ${c.name}`,
        date: c.registeredAt,
      })
    })

    return entries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, limit)
  },
}