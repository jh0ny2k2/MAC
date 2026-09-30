import { useMemo, useState } from 'react'
import { ChevronDown, Plus, Trash2, X } from 'lucide-react'
import type { Product } from '../../types'
import { formatPrice } from '../../utils/format'
import { FormInput, FormSelect, FormTextarea } from '../common/FormControls'
import { cx } from '../../utils/format'
import Button from '../ui/Button'

export interface ProductFormValues {
  name: string
  sku: string
  team: string
  driver: string
  season: string
  scale: string
  price: string
  oldPrice: string
  cost: string
  stock: string
  minStock: string
  category: string
  manufacturer: string
  material: string
  dimensions: string
  weight: string
  description: string
  shortDescription: string
  images: string[]
  specifications: string[]
  featured: boolean
  bestseller: boolean
  isNew: boolean
  status: 'disponible' | 'poco-stock' | 'agotado' | 'borrador'
}

const EMPTY: ProductFormValues = {
  name: '',
  sku: '',
  team: '',
  driver: '',
  season: String(new Date().getFullYear()),
  scale: '1:43',
  price: '',
  oldPrice: '',
  cost: '',
  stock: '0',
  minStock: '5',
  category: '',
  manufacturer: '',
  material: 'Cuerpo de aleación, chasis de zamak',
  dimensions: '75 × 35 × 30 mm',
  weight: '120 g',
  description: '',
  shortDescription: '',
  images: ['/images/products/placeholder.svg'],
  specifications: [],
  featured: false,
  bestseller: false,
  isNew: true,
  status: 'borrador',
}

const scales = ['1:18', '1:24', '1:32', '1:43', '1:64']

interface ProductFormProps {
  initial?: Product | null
  teams: string[]
  drivers: string[]
  categories: string[]
  onSubmit: (values: Partial<Product>) => Promise<void> | void
  submitting?: boolean
}

export default function ProductForm({
  initial,
  teams,
  drivers,
  categories,
  onSubmit,
  submitting,
}: ProductFormProps) {
  const [values, setValues] = useState<ProductFormValues>(() =>
    initial
      ? {
          name: initial.name,
          sku: initial.sku ?? '',
          team: initial.team,
          driver: initial.driver,
          season: String(initial.season),
          scale: initial.scale,
          price: String(initial.price),
          oldPrice: initial.oldPrice ? String(initial.oldPrice) : '',
          cost: initial.cost !== undefined ? String(initial.cost) : '',
          stock: String(initial.stock),
          minStock: String(initial.minStock ?? 5),
          category: initial.category,
          manufacturer: initial.manufacturer,
          material: initial.material,
          dimensions: initial.dimensions,
          weight: initial.weight,
          description: initial.description,
          shortDescription: initial.shortDescription ?? '',
          images: initial.images.length > 0 ? initial.images : EMPTY.images,
          specifications:
            initial.specifications.length > 0 ? initial.specifications : [''],
          featured: initial.featured,
          bestseller: initial.bestseller,
          isNew: initial.isNew ?? true,
          status: initial.status ?? 'borrador',
        }
      : EMPTY,
  )
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [showSpecs, setShowSpecs] = useState(false)

  const set = <K extends keyof ProductFormValues>(
    key: K,
    value: ProductFormValues[K],
  ) => setValues((prev) => ({ ...prev, [key]: value }))

  const price = Number.parseFloat(values.price)
  const oldPrice = values.oldPrice ? Number.parseFloat(values.oldPrice) : undefined
  const discount =
    oldPrice && !Number.isNaN(oldPrice) && oldPrice > price && !Number.isNaN(price)
      ? Math.round(((oldPrice - price) / oldPrice) * 100)
      : 0

  const preview = useMemo(
    () =>
      formatPrice(
        Number.isNaN(price) || price < 0 ? 0 : price,
      ),
    [price],
  )

  const validate = (): boolean => {
    const nextErrors: Record<string, string> = {}
    if (!values.name.trim()) nextErrors.name = 'El nombre es obligatorio'
    if (!values.team) nextErrors.team = 'Selecciona una escudería'
    if (!values.driver) nextErrors.driver = 'Selecciona un piloto'
    if (!values.scale) nextErrors.scale = 'Selecciona una escala'
    if (Number.isNaN(price) || price <= 0)
      nextErrors.price = 'Precio inválido'
    const stock = Number.parseInt(values.stock, 10)
    if (Number.isNaN(stock) || stock < 0)
      nextErrors.stock = 'Stock inválido'
    if (values.description.trim().length < 10)
      nextErrors.description = 'Describe el producto (mín. 10 caracteres)'
    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }
    onSubmit({
      name: values.name,
      sku: values.sku,
      team: values.team,
      driver: values.driver,
      season: Number.parseInt(values.season, 10) || new Date().getFullYear(),
      scale: values.scale,
      price: Math.round(price * 100) / 100,
      oldPrice:
        oldPrice && !Number.isNaN(oldPrice) ? Math.round(oldPrice * 100) / 100 : undefined,
      cost:
        values.cost && !Number.isNaN(Number.parseFloat(values.cost))
          ? Math.round(Number.parseFloat(values.cost) * 100) / 100
          : undefined,
      stock: Math.max(Number.parseInt(values.stock, 10) || 0, 0),
      minStock: Math.max(Number.parseInt(values.minStock, 10) || 0, 0),
      category: values.category,
      manufacturer: values.manufacturer,
      material: values.material,
      dimensions: values.dimensions,
      weight: values.weight,
      description: values.description,
      shortDescription: values.shortDescription,
      images: values.images.filter((u) => u.trim() !== ''),
      specifications: values.specifications.filter((s) => s.trim() !== ''),
      featured: values.featured,
      bestseller: values.bestseller,
      isNew: values.isNew,
      status: values.status,
    })
  }

  const updateSpec = (index: number, value: string) => {
    setValues((prev) => {
      const specs = [...prev.specifications]
      specs[index] = value
      return { ...prev, specifications: specs }
    })
  }

  const addSpec = () => {
    setValues((prev) => ({
      ...prev,
      specifications: [...prev.specifications, ''],
    }))
  }

  const removeSpec = (index: number) => {
    setValues((prev) => ({
      ...prev,
      specifications: prev.specifications.filter((_, i) => i !== index),
    }))
  }

  const updateImage = (index: number, value: string) => {
    setValues((prev) => {
      const images = [...prev.images]
      images[index] = value
      return { ...prev, images }
    })
  }

  const addImage = () => {
    setValues((prev) => ({ ...prev, images: [...prev.images, ''] }))
  }

  const removeImage = (index: number) => {
    setValues((prev) => ({
      ...prev,
      images:
        prev.images.length > 1
          ? prev.images.filter((_, i) => i !== index)
          : prev.images,
    }))
  }

  const toggle = (key: 'featured' | 'bestseller' | 'isNew') => {
    setValues((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {Object.keys(errors).length > 0 && (
        <div className="rounded-xl border border-f1-500/30 bg-f1-500/10 px-4 py-3 text-sm text-f1-400">
          Revisa los campos marcados en rojo para continuar.
        </div>
      )}

      {/* Estado y destacados */}
      <section className="rounded-2xl border border-carbon-800 bg-carbon-900/40 p-5">
        <h3 className="mb-4 font-display text-sm font-semibold text-white">
          Estado del producto
        </h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormSelect
            label="Estado"
            value={values.status}
            onChange={(e) => set('status', e.target.value as ProductFormValues['status'])}
            options={[
              { value: 'disponible', label: 'Disponible' },
              { value: 'poco-stock', label: 'Poco stock' },
              { value: 'agotado', label: 'Agotado' },
              { value: 'borrador', label: 'Borrador (oculto)' },
            ]}
          />
          <div className="flex items-end gap-6 pb-1">
            {(['featured', 'bestseller', 'isNew'] as const).map((flag) => (
              <label
                key={flag}
                className="flex cursor-pointer items-center gap-2 text-sm text-carbon-300"
              >
                <input
                  type="checkbox"
                  checked={values[flag]}
                  onChange={() => toggle(flag)}
                  className="size-4 accent-f1-500"
                />
                {flag === 'featured'
                  ? 'Destacado'
                  : flag === 'bestseller'
                    ? 'Bestseller'
                    : 'Nuevo'}
              </label>
            ))}
          </div>
        </div>
      </section>

      {/* Información básica */}
      <section className="rounded-2xl border border-carbon-800 bg-carbon-900/40 p-5">
        <h3 className="mb-4 font-display text-sm font-semibold text-white">
          Información básica
        </h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <FormInput
              label="Nombre del producto"
              value={values.name}
              onChange={(e) => set('name', e.target.value)}
              placeholder="Ej. Ferrari F2004 Michael Schumacher"
              error={errors.name}
            />
          </div>
          <FormInput
            label="SKU"
            value={values.sku}
            onChange={(e) => set('sku', e.target.value)}
            placeholder="F1-001"
            hint="Se genera automáticamente si se deja vacío"
          />
          <FormSelect
            label="Categoría"
            value={values.category}
            onChange={(e) => set('category', e.target.value)}
            options={categories.map((c) => ({ value: c, label: c }))}
            placeholder="Selecciona una categoría"
          />
          <FormSelect
            label="Escudería"
            value={values.team}
            onChange={(e) => set('team', e.target.value)}
            options={teams.map((t) => ({ value: t, label: t }))}
            placeholder="Selecciona una escudería"
            error={errors.team}
          />
          <FormSelect
            label="Piloto"
            value={values.driver}
            onChange={(e) => set('driver', e.target.value)}
            options={drivers.map((d) => ({ value: d, label: d }))}
            placeholder="Selecciona un piloto"
            error={errors.driver}
          />
          <FormSelect
            label="Escala"
            value={values.scale}
            onChange={(e) => set('scale', e.target.value)}
            options={scales.map((s) => ({ value: s, label: s }))}
            error={errors.scale}
          />
          <FormInput
            label="Temporada"
            type="number"
            value={values.season}
            onChange={(e) => set('season', e.target.value)}
          />
          <FormInput
            label="Fabricante"
            value={values.manufacturer}
            onChange={(e) => set('manufacturer', e.target.value)}
            placeholder="Ej. Spark, Bburago, Minichamps..."
          />
        </div>
      </section>

      {/* Precios y stock */}
      <section className="rounded-2xl border border-carbon-800 bg-carbon-900/40 p-5">
        <h3 className="mb-4 font-display text-sm font-semibold text-white">
          Precios y stock
        </h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <FormInput
            label="Precio (EUR)"
            type="number"
            step="0.01"
            value={values.price}
            onChange={(e) => set('price', e.target.value)}
            placeholder="0.00"
            error={errors.price}
          />
          <FormInput
            label="Precio anterior (bajo demanda)"
            type="number"
            step="0.01"
            value={values.oldPrice}
            onChange={(e) => set('oldPrice', e.target.value)}
            placeholder="Opcional"
          />
          <FormInput
            label="Coste (EUR)"
            type="number"
            step="0.01"
            value={values.cost}
            onChange={(e) => set('cost', e.target.value)}
            placeholder="Opcional"
            hint="Para cálculo de márgenes"
          />
          <FormInput
            label="Stock"
            type="number"
            min="0"
            value={values.stock}
            onChange={(e) => set('stock', e.target.value)}
            error={errors.stock}
          />
          <FormInput
            label="Stock mínimo"
            type="number"
            min="0"
            value={values.minStock}
            onChange={(e) => set('minStock', e.target.value)}
            hint="Aviso de inventario por debajo de este valor"
          />
          <div className="rounded-xl border border-carbon-800 bg-carbon-950/60 p-4">
            <p className="text-[11px] uppercase tracking-wider text-carbon-500">
              Precio de venta
            </p>
            <p className="mt-1 font-display text-2xl font-bold text-white">
              {preview}
            </p>
            {discount > 0 && (
              <p className="mt-0.5 text-xs font-semibold text-emerald-400">
                {discount}% de descuento aplicado
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Descripción */}
      <section className="rounded-2xl border border-carbon-800 bg-carbon-900/40 p-5">
        <h3 className="mb-4 font-display text-sm font-semibold text-white">
          Descripción
        </h3>
        <div className="space-y-4">
          <FormInput
            label="Descripción corta"
            value={values.shortDescription}
            onChange={(e) => set('shortDescription', e.target.value)}
            placeholder="Una línea para tarjetas y listados"
          />
          <FormTextarea
            label="Descripción completa"
            rows={5}
            value={values.description}
            onChange={(e) => set('description', e.target.value)}
            placeholder="Detalla materiales, acabados, edición limitada..."
            error={errors.description}
          />
        </div>
      </section>

      {/* Especificaciones */}
      <section className="rounded-2xl border border-carbon-800 bg-carbon-900/40 p-5">
        <button
          type="button"
          onClick={() => setShowSpecs((prev) => !prev)}
          className="flex w-full items-center justify-between"
        >
          <h3 className="font-display text-sm font-semibold text-white">
            Especificaciones
          </h3>
          <ChevronDown
            size={16}
            className={cx('text-carbon-400 transition-transform', showSpecs && 'rotate-180')}
          />
        </button>
        {showSpecs && (
          <div className="mt-4 space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <FormInput
                label="Material"
                value={values.material}
                onChange={(e) => set('material', e.target.value)}
              />
              <FormInput
                label="Dimensiones"
                value={values.dimensions}
                onChange={(e) => set('dimensions', e.target.value)}
              />
              <FormInput
                label="Peso"
                value={values.weight}
                onChange={(e) => set('weight', e.target.value)}
              />
            </div>
            <div>
              <p className="mb-2 text-xs font-medium uppercase tracking-wider text-carbon-400">
                Características
              </p>
              <div className="space-y-2">
                {values.specifications.map((spec, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <input
                      value={spec}
                      onChange={(e) => updateSpec(index, e.target.value)}
                      placeholder="Ej. Detalles en fibra de carbono"
                      className="w-full rounded-lg border border-carbon-700 bg-carbon-900/60 px-3 py-2 text-sm text-carbon-100 placeholder:text-carbon-500 focus:border-f1-500 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => removeSpec(index)}
                      className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-carbon-700 text-carbon-400 transition-colors hover:border-f1-500 hover:text-f1-400"
                      aria-label="Eliminar característica"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={addSpec}
                className="mt-2 inline-flex items-center gap-1.5 text-sm text-f1-400 transition-colors hover:text-f1-300"
              >
                <Plus size={15} />
                Añadir característica
              </button>
            </div>
          </div>
        )}
      </section>

      {/* Imágenes */}
      <section className="rounded-2xl border border-carbon-800 bg-carbon-900/40 p-5">
        <h3 className="mb-4 font-display text-sm font-semibold text-white">
          Imágenes
        </h3>
        <div className="space-y-2.5">
          {values.images.map((url, index) => (
            <div key={index} className="flex items-center gap-2.5">
              <div className="flex size-10 shrink-0 items-center overflow-hidden rounded-lg border border-carbon-700 bg-carbon-950">
                {url ? (
                  <img
                    src={url}
                    alt={`Imagen ${index + 1}`}
                    className="size-full object-cover"
                  />
                ) : (
                  <span className="flex size-full items-center justify-center text-[10px] text-carbon-600">
                    N/A
                  </span>
                )}
              </div>
              <input
                value={url}
                onChange={(e) => updateImage(index, e.target.value)}
                placeholder="/images/products/...svg"
                className="w-full rounded-lg border border-carbon-700 bg-carbon-900/60 px-3 py-2 text-sm text-carbon-100 placeholder:text-carbon-500 focus:border-f1-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-carbon-700 text-carbon-400 transition-colors hover:border-f1-500 hover:text-f1-400"
                aria-label="Eliminar imagen"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addImage}
          className="mt-3 inline-flex items-center gap-1.5 text-sm text-f1-400 transition-colors hover:text-f1-300"
        >
          <Plus size={15} />
          Añadir imagen
        </button>
        <p className="mt-2 text-xs text-carbon-500">
          Deja la ruta por defecto para usar la imagen generada automáticamente.
        </p>
      </section>

      <div className="flex flex-col-reverse items-stretch justify-end gap-3 sm:flex-row">
        <Button
          type="submit"
          variant="primary"
          size="lg"
          disabled={submitting}
        >
          {submitting ? 'Guardando...' : initial ? 'Guardar cambios' : 'Crear producto'}
        </Button>
      </div>
    </form>
  )
}