import { createContext, useCallback, useContext, useMemo, type ReactNode } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'

const STORAGE_KEY = 'apex-f1-favorites'

interface FavoritesContextValue {
  ids: number[]
  count: number
  isFavorite: (productId: number) => boolean
  toggleFavorite: (productId: number) => boolean
}

const FavoritesContext = createContext<FavoritesContextValue | null>(null)

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [ids, setIds] = useLocalStorage<number[]>(STORAGE_KEY, [])

  const isFavorite = useCallback(
    (productId: number) => ids.includes(productId),
    [ids],
  )

  const toggleFavorite = useCallback(
    (productId: number): boolean => {
      let result = true
      setIds((prev) => {
        if (prev.includes(productId)) {
          result = false
          return prev.filter((id) => id !== productId)
        }
        return [...prev, productId]
      })
      return result
    },
    [setIds],
  )

  const value = useMemo(
    () => ({ ids, count: ids.length, isFavorite, toggleFavorite }),
    [ids, isFavorite, toggleFavorite],
  )

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>
}

export function useFavorites(): FavoritesContextValue {
  const ctx = useContext(FavoritesContext)
  if (!ctx) throw new Error('useFavorites must be used within a FavoritesProvider')
  return ctx
}