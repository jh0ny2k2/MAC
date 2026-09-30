import { createContext, useCallback, useContext, useMemo, type ReactNode } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import type { CartItem, Product } from '../types'

const FREE_SHIPPING_THRESHOLD = 99
const BASE_SHIPPING_COST = 6.99
const STORAGE_KEY = 'apex-f1-cart'

interface CartContextValue {
  items: CartItem[]
  count: number
  subtotal: number
  discount: number
  shipping: number
  total: number
  addItem: (product: Product, quantity?: number) => void
  removeItem: (productId: number) => void
  updateQuantity: (productId: number, quantity: number) => void
  clear: () => void
  hasItem: (productId: number) => boolean
}

const CartContext = createContext<CartContextValue | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useLocalStorage<CartItem[]>(STORAGE_KEY, [])

  const addItem = useCallback(
    (product: Product, quantity = 1) => {
      setItems((prev) => {
        const existing = prev.find((item) => item.product.id === product.id)
        if (existing) {
          return prev.map((item) =>
            item.product.id === product.id
              ? { ...item, quantity: Math.min(item.quantity + quantity, product.stock) }
              : item,
          )
        }
        return [...prev, { product, quantity: Math.min(quantity, product.stock) }]
      })
    },
    [setItems],
  )

  const removeItem = useCallback(
    (productId: number) => {
      setItems((prev) => prev.filter((item) => item.product.id !== productId))
    },
    [setItems],
  )

  const updateQuantity = useCallback(
    (productId: number, quantity: number) => {
      setItems((prev) =>
        prev
          .map((item) =>
            item.product.id === productId
              ? { ...item, quantity: Math.max(1, Math.min(quantity, item.product.stock)) }
              : item,
          )
          .filter((item) => item.quantity > 0),
      )
    },
    [setItems],
  )

  const clear = useCallback(() => setItems([]), [setItems])

  const hasItem = useCallback(
    (productId: number) => items.some((item) => item.product.id === productId),
    [items],
  )

  const count = useMemo(() => items.reduce((acc, item) => acc + item.quantity, 0), [items])

  const subtotal = useMemo(
    () => items.reduce((acc, item) => acc + item.product.price * item.quantity, 0),
    [items],
  )

  const discount = useMemo(
    () =>
      items.reduce((acc, item) => {
        if (item.product.oldPrice && item.product.oldPrice > item.product.price) {
          return acc + (item.product.oldPrice - item.product.price) * item.quantity
        }
        return acc
      }, 0),
    [items],
  )

  const shipping = useMemo(() => {
    if (subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD) return 0
    return BASE_SHIPPING_COST
  }, [subtotal])

  const total = useMemo(() => Math.max(0, subtotal - discount + shipping), [subtotal, discount, shipping])

  const value = useMemo(
    () => ({
      items,
      count,
      subtotal,
      discount,
      shipping,
      total,
      addItem,
      removeItem,
      updateQuantity,
      clear,
      hasItem,
    }),
    [items, count, subtotal, discount, shipping, total, addItem, removeItem, updateQuantity, clear, hasItem],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within a CartProvider')
  return ctx
}