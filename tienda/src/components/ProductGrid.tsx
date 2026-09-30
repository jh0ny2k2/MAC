import type { Product } from '../types'
import ProductCard from './ProductCard'
import SkeletonCard from './ui/SkeletonCard'

interface ProductGridProps {
  products: Product[]
  loading?: boolean
  skeletonCount?: number
  className?: string
}

export default function ProductGrid({ products, loading = false, skeletonCount = 8, className }: ProductGridProps) {
  if (loading) {
    return (
      <div className={className}>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: skeletonCount }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className={className}>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}