import type { Product } from '../types'
import { productService } from './productService'
import { orderService } from './orderService'

export interface InventoryAlertItem {
  product: Product
  soldUnits: number
  alert: 'stock-bajo' | 'agotado'
  projectedDays: number
}

export function productDerivedStatus(product: Product): Product['status'] {
  if (product.status === 'borrador') return product.status
  if (product.stock <= 0) return 'agotado'
  if (product.minStock !== undefined && product.stock <= product.minStock) {
    return 'poco-stock'
  }
  return 'disponible'
}

async function getSoldUnits(): Promise<Map<number, number>> {
  const map = new Map<number, number>()
  const orders = await orderService.getAll()
  for (const order of orders) {
    if (order.status === 'Cancelado') continue
    for (const item of order.items) {
      map.set(item.productId, (map.get(item.productId) ?? 0) + item.quantity)
    }
  }
  return map
}

export const inventoryService = {
  async getAlerts(): Promise<InventoryAlertItem[]> {
    const [products, sold] = await Promise.all([productService.getAll(), getSoldUnits()])
    const alerts: InventoryAlertItem[] = []

    for (const product of products) {
      if (product.status === 'borrador') continue
      const soldUnits = sold.get(product.id) ?? 0
      const rate = soldUnits / 30
      const projectedDays = rate > 0 ? Math.round(product.stock / rate) : 999
      if (product.stock <= 0) {
        alerts.push({ product, soldUnits, alert: 'agotado', projectedDays })
      } else if (
        product.minStock !== undefined &&
        product.stock <= product.minStock
      ) {
        alerts.push({ product, soldUnits, alert: 'stock-bajo', projectedDays })
      }
    }

    return alerts.sort((a, b) => a.product.stock - b.product.stock)
  },

  async adjustStock(productId: number, delta: number): Promise<Product> {
    const product = await productService.getById(productId)
    if (!product) throw new Error('Producto no encontrado')
    const next = Math.max(product.stock + delta, 0)
    return productService.updateStock(productId, next)
  },

  async setStock(productId: number, stock: number): Promise<Product> {
    return productService.updateStock(productId, Math.max(stock, 0))
  },

  async setMinStock(productId: number, minStock: number): Promise<Product> {
    return productService.update(productId, { minStock: Math.max(minStock, 0) })
  },

  async lowStockCount(): Promise<number> {
    const alerts = await this.getAlerts()
    return alerts.length
  },
}

export { getSoldUnits }