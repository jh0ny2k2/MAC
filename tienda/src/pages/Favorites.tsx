import { Link } from 'react-router-dom'
import { Heart, SlidersHorizontal } from 'lucide-react'
import { products } from '../data'
import { useFavorites } from '../context/FavoritesContext'
import PageHeader from '../components/PageHeader'
import ProductGrid from '../components/ProductGrid'
import EmptyState from '../components/ui/EmptyState'
import { buttonStyles } from '../components/ui/Button'

export default function Favorites() {
  const { ids, count } = useFavorites()
  const favorites = products.filter((p) => ids.includes(p.id))

  return (
    <div>
      <PageHeader
        eyebrow="Marcadores"
        title="Favoritos"
        description={`Tienes ${count} ${count === 1 ? 'modelo guardado' : 'modelos guardados'}. Tus favoritos se sincronizan automáticamente en este dispositivo.`}
      />

      <div className="mx-auto max-w-[1440px] px-4 py-12 sm:px-6 lg:px-8">
        {favorites.length === 0 ? (
          <EmptyState
            icon={<Heart size={28} />}
            title="Aún no tienes favoritos"
            message="Toca el corazón en cualquier producto para guardarlo aquí y no perderlo de vista."
            action={
              <Link to="/tienda" className={buttonStyles({ size: 'lg' })}>
                <SlidersHorizontal size={16} />
                Explorar la tienda
              </Link>
            }
          />
        ) : (
          <ProductGrid products={favorites} />
        )}
      </div>
    </div>
  )
}