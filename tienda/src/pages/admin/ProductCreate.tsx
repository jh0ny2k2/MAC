import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import PageHeader from '../../components/common/PageHeader'
import ProductForm from '../../components/admin/ProductForm'
import LoadingSkeleton from '../../components/common/LoadingSkeleton'
import { useToast } from '../../context/ToastContext'
import { productService } from '../../services/productService'
import { teamService } from '../../services/teamService'
import { driverService } from '../../services/driverService'
import { categoryService } from '../../services/categoryService'
import type { Product } from '../../types'

export default function ProductCreate() {
  const navigate = useNavigate()
  const { showToast } = useToast()
  const [meta, setMeta] = useState<{
    teams: string[]
    drivers: string[]
    categories: string[]
  } | null>(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    let mounted = true
    Promise.all([
      teamService.getAll(),
      driverService.getAll(),
      categoryService.getAll(),
    ]).then(([teams, drivers, categories]) => {
      if (!mounted) return
      setMeta({
        teams: teams.map((t) => t.name),
        drivers: drivers.map((d) => d.name),
        categories: categories.map((c) => c.name),
      })
    })
    return () => {
      mounted = false
    }
  }, [])

  const handleSubmit = async (values: Partial<Product>) => {
    setSubmitting(true)
    try {
      const created = await productService.create(values)
      showToast('Producto creado correctamente')
      navigate(`/admin/productos/${created.id}/editar`, { replace: true })
    } catch {
      showToast('No se pudo crear el producto', 'error')
      setSubmitting(false)
    }
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
        title="Nuevo producto"
        subtitle="Añade un coche a escala al catálogo de la tienda"
      />
      {meta ? (
        <ProductForm
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