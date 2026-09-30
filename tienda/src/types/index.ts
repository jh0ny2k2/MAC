export interface ProductSource {
  provider: string
  productId: string
  url: string
  importedAt: string
  lastCheckedAt?: string
  status?: 'active' | 'changed' | 'discontinued'
}

export interface Product {
  id: number
  name: string
  team: string
  driver: string
  season: number
  scale: string
  price: number
  oldPrice?: number
  discount?: number
  rating: number
  reviews: number
  stock: number
  featured: boolean
  bestseller: boolean
  category: string
  manufacturer: string
  material: string
  dimensions: string
  weight: string
  images: string[]
  description: string
  specifications: string[]
  sku?: string
  shortDescription?: string
  cost?: number
  minStock?: number
  isNew?: boolean
  status?: 'disponible' | 'poco-stock' | 'agotado' | 'borrador'
  specialEdition?: boolean
  source?: ProductSource
  supplierCost?: number
  supplierCurrency?: string
  supplierStock?: number
}

export interface Team {
  id: string
  name: string
  country: string
  countryCode: string
  code: string
  color: string
  color2: string
  founded: number
  titles: number
  logo: string
  description: string
}

export interface Driver {
  id: number
  name: string
  number: number
  nationality: string
  countryCode: string
  team: string
  image: string
  description: string
}

export interface Category {
  id: string
  name: string
  label: string
  description: string
}

export interface CartItem {
  product: Product
  quantity: number
}

export interface ShippingMethod {
  id: string
  name: string
  description: string
  price: number
  days: string
}

export interface PaymentMethod {
  id: string
  name: string
  description: string
  icon: string
}

export interface CustomerInfo {
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  city: string
  postalCode: string
  country: string
}

export interface Order {
  id: string
  items: CartItem[]
  shipping: ShippingMethod
  customer: CustomerInfo
  subtotal: number
  discount: number
  shippingCost: number
  total: number
  date: string
}

export interface Toast {
  id: string
  message: string
  type: 'success' | 'error' | 'info'
}

export type SortOption =
  | 'bestsellers'
  | 'price-asc'
  | 'price-desc'
  | 'newest'
  | 'featured'

export interface FilterState {
  search: string
  teams: string[]
  drivers: string[]
  scales: string[]
  inStockOnly: boolean
  minPrice: number
  maxPrice: number
  sortBy: SortOption
}

export const DEFAULT_FILTERS: FilterState = {
  search: '',
  teams: [],
  drivers: [],
  scales: [],
  inStockOnly: false,
  minPrice: 0,
  maxPrice: 200,
  sortBy: 'featured',
}