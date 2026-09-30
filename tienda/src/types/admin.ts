export type OrderStatus =
  | 'Pendiente'
  | 'Confirmado'
  | 'Preparando'
  | 'Enviado'
  | 'Entregado'
  | 'Cancelado'

export type PaymentStatus = 'Pendiente' | 'Pagado' | 'Reembolsado'

export interface OrderItem {
  productId: number
  name: string
  price: number
  quantity: number
}

export interface ShippingAddress {
  name: string
  address: string
  city: string
  postalCode: string
  country: string
  phone: string
}

export interface Order {
  id: string
  customerId: number
  customerName: string
  email: string
  date: string
  items: OrderItem[]
  subtotal: number
  discount: number
  shipping: number
  tax: number
  total: number
  status: OrderStatus
  payment: PaymentStatus
  shippingAddress: ShippingAddress
}

export interface Customer {
  id: number
  name: string
  email: string
  phone?: string
  registeredAt: string
  status: 'activo' | 'inactivo'
}

export interface CustomerStats {
  ordersCount: number
  totalSpent: number
  averageTicket: number
  lastOrderDate?: string
  favoriteProduct?: string
}

export interface DiscountCode {
  id: number
  code: string
  type: 'percent' | 'fixed'
  value: number
  startDate: string
  endDate: string
  maxUses: number
  uses: number
  status: 'activo' | 'programado' | 'expirado' | 'desactivado'
}

export interface RevenuePoint {
  period: string
  revenue: number
  orders: number
  profit?: number
}

export interface AnalyticsData {
  monthly: RevenuePoint[]
  daily: RevenuePoint[]
}

export interface ActivityEntry {
  id: string
  type: 'order' | 'inventory' | 'customer' | 'product'
  message: string
  date: string
}

export interface AdminNotification {
  id: string
  type: 'order' | 'stock' | 'out' | 'customer' | 'cancelled' | 'shipped'
  message: string
  date: string
  read: boolean
}

export interface AdminSession {
  email: string
  name: string
  role: string
  loggedInAt: string
}

export interface StoreSettings {
  store: {
    name: string
    email: string
    phone: string
    address: string
  }
  shipping: {
    standardPrice: number
    freeFrom: number
    estimatedDays: string
  }
  tax: {
    vatRate: number
  }
  appearance: {
    logoLabel: string
    storeName: string
  }
  admin: {
    name: string
    email: string
    password: string
  }
}

export type SalesMetricProduct = {
  productId: number
  name: string
  units: number
  revenue: number
}