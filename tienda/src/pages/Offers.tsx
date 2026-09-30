import { Link } from 'react-router-dom'
import { BadgePercent } from 'lucide-react'
import { getDiscountedProducts } from '../data'
import PageHeader from '../components/PageHeader'
import ProductGrid from '../components/ProductGrid'
import EmptyState from '../components/ui/EmptyState'
import { buttonStyles } from '../components/ui/Button'

export default function Offers() {
  const offers = getDiscountedProducts()

  return (
    <div>
      <PageHeader
        eyebrow="Descuentos activos"
        title="Ofertas"
        description="Modelos de colección rebajados, ordenados de mayor a menor descuento. Stock limitado: cuando acaba, no vuelve."
      >
        {offers.length > 0 && (
          <div className="flex items-center gap-3 rounded-xl border border-f1-500/30 bg-f1-500/10 px-5 py-3">
            <BadgePercent size={22} className="text-f1-400" />
            <div>
              <p className="font-display text-lg font-bold text-white">{offers.length} ofertas activas</p>
              <p className="text-xs text-carbon-400">Actualizado hoy</p>
            </div>
          </div>
        )}
      </PageHeader>

      <div className="mx-auto max-w-[1440px] px-4 py-12 sm:px-6 lg:px-8">
        {offers.length === 0 ? (
          <EmptyState
            icon={<BadgePercent size={28} />}
            title="No hay ofertas ahora mismo"
            message="Vuelve pronto: periódicamente lanzamos descuentos en modelos seleccionados."
            action={
              <Link to="/tienda" className={buttonStyles({ size: 'lg' })}>
                Ver catálogo completo
              </Link>
            }
          />
        ) : (
          <>
            <p className="mb-6 text-sm text-carbon-500">
              {offers.length} productos rebajados · Precio anterior tachado · Descuento aplicado automáticamente
            </p>
            <ProductGrid products={offers} />
          </>
        )}
      </div>
    </div>
  )
}