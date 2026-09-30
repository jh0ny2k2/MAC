import { useCallback, useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, RefreshCcw } from 'lucide-react'
import PageHeader from '../../components/common/PageHeader'
import ProductForm from '../../components/admin/ProductForm'
import LoadingSkeleton from '../../components/common/LoadingSkeleton'
import { useToast } from '../../context/ToastContext'
import { productService } from '../../services/productService'
import { teamService } from '../../services/teamService'
import { driverService } from '../../services/driverService'
import { categoryService } from '../../services/categoryService'
import { buttonStyles } from '../../components/ui/Button'
import { formatDate } from '../../utils/format'
import type { Product } from '../../types'

export default function ProductEdit() {
  const { id } = useParams<{ id: string }>()
  const productId = Number(id)
  const navigate = useNavigate()
  const { showToast } = useToast()
  const [product, setProduct] = useState<Product | null>(null)
  const [meta, setMeta] = useState<{
    teams: string[]
    drivers: string[]
    categories: string[]
  } | null>(null)
  const [notFound, setNotFound] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const load = useCallback(async () => {
    const [existing, teams, drivers, categories] = await Promise.all([
      productService.getById(productId),
      teamService.getAll(),
      driverService.getAll(),
      categoryService.getAll(),
    ])
    if (!existing) {
      setNotFound(true)
      return
    }
    setProduct(existing)
    setMeta({
      teams: teams.map((t) => t.name),
      drivers: drivers.map((d) => d.name),
      categories: categories.map((c) => c.name),
    })
  }, [productId])

  useEffect(() => {
    load()
  }, [load])

  const handleSubmit = async (values: Partial<Product>) => {
    setSubmitting(true)
    try {
      await productService.update(productId, values)
      showToast('Cambios guardados correctamente')
      const refreshed = await productService.getById(productId)
      if (refreshed) setProduct(refreshed)
    } catch {
      showToast('No se pudieron guardar los cambios', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  if (notFound) {
    return (
      <div className="rounded-2xl border border-carbon-800 bg-carbon-900/40 px-6 py-16 text-center">
        <h2 className="font-display text-xl font-bold text-white">Producto no encontrado</h2>
        <p className="mt-2 text-sm text-carbon-400">
          El producto al que intentas acceder no existe o fue eliminado.
        </p>
        <Link
          to="/admin/productos"
          className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-f1-400 hover:text-f1-300"
        >
          <ArrowLeft size={15} />
          Volver a productos
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <button
        type="button"
        onClick={() => navigate('/admin/productos')}
        className="inline-flex items-center gap-2 text-sm text-carbon-400 transition-colors hover:text-white"
      >
        <ArrowLeft size={15} />
        Volver a productos
      </button>
      <PageHeader
        title="Editar producto"
        subtitle={product?.name ?? 'Cargando...'}
      />
      {product?.source && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-carbon-700 bg-carbon-900/60 px-5 py-4">
          <div className="min-w-0">
            <p className="text-sm text-carbon-200">
              Producto importado desde{' '}
              <span className="font-semibold text-white">{product.source.provider}</span>
              {' · '}
              <span className="text-carbon-500">ID {product.source.productId}</span>
            </p>
            <p className="mt-0.5 text-xs text-carbon-500">
              Importado el {formatDate(product.source.importedAt)}. El precio de venta es
              independiente del coste del proveedor.
            </p>
          </div>
          <Link
            to="/admin/importaciones"
            className={buttonStyles({
              variant: 'outline',
              size: 'sm',
              className: 'shrink-0',
            })}
          >
            <RefreshCcw size={14} />
            Comprobar cambios
          </Link>
        </div>
      )}
      {product && meta ? (
        <ProductForm
          initial={product}
          teams={meta.teams}
          drivers={meta.drivers}
          categories={meta.categories}
          onSubmit={handleSubmit}
          submitting={submitting}
        />
      ) : (
        <LoadingSkeleton variant="lines" count={8} />
      )}
    </div>
  )
}