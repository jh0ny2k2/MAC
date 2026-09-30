import type { RevenuePoint } from '../types/admin'
import analyticsData from '../data/analytics.json'
import { loadObject, simulateDelay } from './storage'
import { orderService } from './orderService'
import { productService } from './productService'
import { customerService } from './customerService'
import { inventoryService } from './inventoryService'

const KEY = 'analytics'
const round2 = (n: number): number => Math.round(n * 100) / 100

export type AnalyticsRange = '7d' | '30d' | '90d' | '1y'

function daysFromRange(range: AnalyticsRange): number {
  switch (range) {
    case '7d':
      return 7
    case '30d':
      return 30
    case '90d':
      return 90
    case '1y':
      return 365
  }
}

function buildSeries(days: number): RevenuePoint[] {
  const data = loadObject<{ monthly: RevenuePoint[]; daily: RevenuePoint[] }>(
    KEY,
    analyticsData,
  )
  const now = new Date()
  if (days <= 30) {
    return [...data.daily]
      .filter((p) => {
        const diff = (now.getTime() - new Date(p.period).getTime()) / 86400000
        return diff <= days && diff >= 0
      })
      .sort((a, b) => a.period.localeCompare(b.period))
  }
  const monthsBack = Math.ceil(days / 30)
  const cutoff = new Date(now)
  cutoff.setMonth(now.getMonth() - monthsBack)
  return [...data.monthly]
    .filter((p) => {
      const d = new Date(`${p.period}-01`)
      return d >= cutoff && d <= now
    })
    .sort((a, b) => a.period.localeCompare(b.period))
}

export const analyticsService = {
  async getSeries(range: AnalyticsRange = '30d'): Promise<RevenuePoint[]> {
    await simulateDelay(300)
    return buildSeries(daysFromRange(range))
  },

  async getKpis(range: AnalyticsRange = '30d') {
    await simulateDelay(250)
    const now = new Date()
    const days = daysFromRange(range)
    const fromMs = now.getTime() - days * 86400000
    const orders = (await orderService.getAll()).filter((o) => {
      const d = new Date(o.date).getTime()
      return d >= fromMs && d <= now.getTime()
    })
    const active = orders.filter((o) => o.status !== 'Cancelado')

    const revenue = round2(active.reduce((sum, o) => sum + o.total, 0))
    const profit = round2(
      active.reduce((sum, o) => {
        const cost = o.items.reduce((s, i) => s + i.price * 0.62 * i.quantity, 0)
        return sum + (o.total - cost)
      }, 0),
    )
    const customers = await customerService.getAll()
    const lowStock = await inventoryService.lowStockCount()

    return {
      revenue,
      profit,
      orders: active.length,
      averageTicket: active.length > 0 ? round2(revenue / active.length) : 0,
      customers: customers.length,
      lowStock,
      pendingOrders: orders.filter((o) => o.status === 'Pendiente').length,
    }
  },

  async getNovedades(limit = 6) {
    await simulateDelay(200)
    const orders = (await orderService.getAll()).filter(
      (o) => o.status !== 'Cancelado',
    )
    const products = await productService.getAll()
    const units: Record<number, number> = {}
    const revenue: Record<number, number> = {}
    for (const order of orders) {
      for (const item of order.items) {
        units[item.productId] = (units[item.productId] ?? 0) + item.quantity
        revenue[item.productId] =
          (revenue[item.productId] ?? 0) + item.price * item.quantity
      }
    }
    const entries = Object.entries(units)
      .map(([id, u]) => {
        const product = products.find((p) => p.id === Number(id))
        return {
          product,
          units: u,
          revenue: round2(revenue[Number(id)] ?? 0),
        }
      })
      .filter((e) => e.product)
      .sort((a, b) => b.units - a.units)
    return {
      topProducts: entries.slice(0, limit).map((e) => e.product!),
      topByUnits: entries,
    }
  },

  async getStatsByDimension(dim: 'team' | 'driver' | 'scale', limit = 8) {
    await simulateDelay(250)
    const orders = (await orderService.getAll()).filter(
      (o) => o.status !== 'Cancelado',
    )
    const products = await productService.getAll()
    const byKey: Record<string, { units: number; revenue: number }> = {}
    for (const order of orders) {
      for (const item of order.items) {
        const product = products.find((p) => p.id === item.productId)
        const key = product ? String(product[dim]) : item.name
        if (!byKey[key]) byKey[key] = { units: 0, revenue: 0 }
        byKey[key].units += item.quantity
        byKey[key].revenue += item.price * item.quantity
      }
    }
    return Object.entries(byKey)
      .map(([key, value]) => ({
        key,
        ...value,
        revenue: round2(value.revenue),
      }))
      .sort((a, b) => b.units - a.units)
      .slice(0, limit)
  },
}