import { Heart } from 'lucide-react'
import { useFavorites } from '../../context/FavoritesContext'
import { useToast } from '../../context/ToastContext'
import { cx } from '../../utils/format'

interface FavoriteButtonProps {
  productId: number
  size?: 'sm' | 'md' | 'lg'
  showToastOnChange?: boolean
  className?: string
}

export default function FavoriteButton({
  productId,
  size = 'md',
  showToastOnChange = true,
  className,
}: FavoriteButtonProps) {
  const { isFavorite, toggleFavorite } = useFavorites()
  const { showToast } = useToast()
  const active = isFavorite(productId)

  const sizes = {
    sm: 'size-8',
    md: 'size-9',
    lg: 'size-11',
  }

  const iconSizes = { sm: 15, md: 17, lg: 20 }

  return (
    <button
      type="button"
      aria-label={active ? 'Eliminar de favoritos' : 'Añadir a favoritos'}
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        const added = toggleFavorite(productId)
        if (showToastOnChange) {
          showToast(added ? 'Añadido a favoritos' : 'Eliminado de favoritos', added ? 'success' : 'info')
        }
      }}
      className={cx(
        'flex items-center justify-center rounded-full backdrop-blur-md transition-all duration-300 active:scale-90',
        sizes[size],
        active
          ? 'bg-f1-500/20 text-f1-500 ring-1 ring-f1-500/40'
          : 'bg-carbon-950/60 text-white ring-1 ring-white/15 hover:ring-f1-500/60 hover:text-f1-400',
        className,
      )}
    >
      <Heart size={iconSizes[size]} className={cx(active && 'fill-current')} />
    </button>
  )
}