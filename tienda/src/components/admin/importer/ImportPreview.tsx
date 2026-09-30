import type { Product } from '../../../types'
import ProductCard from '../../ProductCard'
import { formatPrice } from '../../../utils/format'

interface ImportPreviewProps {
  product: Product
}

const FALLBACK_IMAGE = '/images/products/placeholder.svg'

export default function ImportPreview({ product }: ImportPreviewProps) {
  const safeProduct: Product =
    product.images.length > 0
      ? product
      : { ...product, images: [FALLBACK_IMAGE] }

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-carbon-800 bg-carbon-900/40 p-5">
        <h3 className="mb-4 font-display text-sm font-semibold uppercase tracking-wider text-white">
          Vista previa del producto
        </h3>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="mx-auto w-full max-w-sm">
            <ProductCard product={safeProduct} />
          </div>
          <div className="space-y-4">
            <div className="rounded-xl border border-carbon-800 bg-carbon-950/40 p-4">
              <p className="text-[11px] uppercase tracking-wider text-carbon-500">Precio</p>
              {safeProduct.oldPrice && safeProduct.oldPrice > safeProduct.price && (
                <p className="text-sm text-carbon-500 line-through">
                  {formatPrice(safeProduct.oldPrice)}
                </p>
              )}
              <p className="font-display text-2xl font-bold text-white">
                {formatPrice(safeProduct.price)}
              </p>
              {safeProduct.price > 0 && safeProduct.cost ? (
                <p className="mt-1 text-xs text-carbon-500">
                  Margen bruto:{' '}
                  <span className="text-emerald-400">
                    {Math.round(((safeProduct.price - safeProduct.cost) / safeProduct.price) * 100)}%
                  </span>
                </p>
              ) : null}
            </div>
            <div className="rounded-xl border border-carbon-800 bg-carbon-950/40 p-4">
              <p className="mb-1.5 text-[11px] uppercase tracking-wider text-carbon-500">
                Esperado
              </p>
              <p className="text-sm text-carbon-200">
                {safeProduct.shortDescription || 'Sin descripción corta.'}
              </p>
            </div>
            <div className="rounded-xl border border-carbon-800 bg-carbon-950/40 p-4">
              <p className="mb-1.5 text-[11px] uppercase tracking-wider text-carbon-500">
                Descripción
              </p>
              <p className="text-sm leading-relaxed text-carbon-300">
                {safeProduct.description
                  ? truncate(safeProduct.description, 320)
                  : 'Sin descripción.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function truncate(text: string, limit: number): string {
  if (text.length <= limit) return text
  return `${text.slice(0, limit).trimEnd()}…`
}