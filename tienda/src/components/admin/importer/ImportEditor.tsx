import { Plus, Trash2 } from 'lucide-react'
import type { Product } from '../../../types'
import type { F1Detection } from '../../../types/import'
import { formatDate } from '../../../utils/format'
import { FormInput, FormSelect, FormTextarea } from '../../common/FormControls'
import { FIELD_LABELS } from './DetectionSummary'
import ConfidenceBadge from './ConfidenceBadge'

const STATUS_OPTIONS: Array<{ value: string; label: string }> = [
  { value: 'disponible', label: 'Disponible' },
  { value: 'poco-stock', label: 'Poco stock' },
  { value: 'agotado', label: 'Agotado' },
  { value: 'borrador', label: 'Borrador (oculto)' },
]

const SCALES = ['1:18', '1:24', '1:32', '1:43', '1:64']

interface ImportEditorProps {
  product: Product
  detection: F1Detection
  meta: {
    teams: string[]
    drivers: string[]
    categories: string[]
  }
  onChange: (product: Product) => void
}

function OptionsWithCurrent(options: string[], current: string): Array<{ value: string; label: string }> {
  const list = current && !options.includes(current) ? [current, ...options] : options
  return list.map((value) => ({ value, label: value }))
}

export default function ImportEditor({
  product,
  detection,
  meta,
  onChange,
}: ImportEditorProps) {
  const set = (patch: Partial<Product>) => onChange({ ...product, ...patch })

  const num = (raw: string, fallback: number): number => {
    const value = Number.parseFloat(raw.replace(',', '.'))
    return Number.isNaN(value) ? fallback : value
  }

  const badgeKey = (
    key: keyof F1Detection,
  ): { label: string; confidence?: F1Detection[keyof F1Detection] } => detection[key as keyof F1Detection]
    ? { label: FIELD_LABELS[key], confidence: detection[key as keyof F1Detection] }
    : { label: FIELD_LABELS[key] }

  const badge = (key: keyof F1Detection) => {
    const entry = badgeKey(key)
    if (!entry.confidence) return null
    return <ConfidenceBadge confidence={entry.confidence.confidence} />
  }

  const sectionTitle = (title: string) => (
    <h3 className="mb-4 font-display text-sm font-semibold uppercase tracking-wider text-white">
      {title}
    </h3>
  )

  return (
    <div className="space-y-6">
      {/* GENERAL */}
      <section className="rounded-2xl border border-carbon-800 bg-carbon-900/40 p-5">
        {sectionTitle('General')}
        <div className="space-y-4">
          <FormInput
            label="Nombre"
            value={product.name}
            onChange={(e) => set({ name: e.target.value })}
            placeholder="Nombre del producto"
          />
          <FormInput
            label="Descripción corta"
            value={product.shortDescription ?? ''}
            onChange={(e) => set({ shortDescription: e.target.value })}
            placeholder="Una línea para tarjetas y listados"
          />
          <FormTextarea
            label="Descripción larga"
            rows={6}
            value={product.description}
            onChange={(e) => set({ description: e.target.value })}
            placeholder="Descripción completa del producto"
          />
        </div>
      </section>

      {/* PRODUCTO */}
      <section className="rounded-2xl border border-carbon-800 bg-carbon-900/40 p-5">
        {sectionTitle('Producto')}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <FormSelect
              label="Categoría"
              value={product.category}
              onChange={(e) => set({ category: e.target.value })}
              options={OptionsWithCurrent(meta.categories, product.category)}
              placeholder="Selecciona una categoría"
            />
          </div>
          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wider text-carbon-400">
                Escudería
              </span>
              {badge('team')}
            </div>
            <select
              value={product.team}
              onChange={(e) => set({ team: e.target.value })}
              className="w-full rounded-lg border border-carbon-700 bg-carbon-900/60 px-3 py-2.5 text-sm text-carbon-100 focus:border-f1-500 focus:outline-none"
            >
              <option value="" disabled>
                Selecciona una escudería
              </option>
              {OptionsWithCurrent(meta.teams, product.team).map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wider text-carbon-400">
                Piloto
              </span>
              {badge('driver')}
            </div>
            <select
              value={product.driver}
              onChange={(e) => set({ driver: e.target.value })}
              className="w-full rounded-lg border border-carbon-700 bg-carbon-900/60 px-3 py-2.5 text-sm text-carbon-100 focus:border-f1-500 focus:outline-none"
            >
              <option value="" disabled>
                Selecciona un piloto
              </option>
              {OptionsWithCurrent(meta.drivers, product.driver).map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wider text-carbon-400">
                Temporada
              </span>
              {badge('season')}
            </div>
            <input
              type="number"
              value={product.season}
              onChange={(e) => set({ season: num(e.target.value, new Date().getFullYear()) })}
              className="w-full rounded-lg border border-carbon-700 bg-carbon-900/60 px-3.5 py-2.5 text-sm text-carbon-100 focus:border-f1-500 focus:outline-none"
            />
          </div>
          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wider text-carbon-400">
                Escala
              </span>
              {badge('scale')}
            </div>
            <select
              value={product.scale}
              onChange={(e) => set({ scale: e.target.value })}
              className="w-full rounded-lg border border-carbon-700 bg-carbon-900/60 px-3 py-2.5 text-sm text-carbon-100 focus:border-f1-500 focus:outline-none"
            >
              {OptionsWithCurrent(SCALES, product.scale).map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
          <div className="md:col-span-2">
            <div className="mb-1.5 flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wider text-carbon-400">
                Fabricante
              </span>
              {badge('manufacturer')}
            </div>
            <input
              value={product.manufacturer}
              onChange={(e) => set({ manufacturer: e.target.value })}
              placeholder="Ej. Spark, Bburago, Minichamps..."
              className="w-full rounded-lg border border-carbon-700 bg-carbon-900/60 px-3.5 py-2.5 text-sm text-carbon-100 placeholder:text-carbon-500 focus:border-f1-500 focus:outline-none"
            />
          </div>
        </div>
      </section>

      {/* PRECIO */}
      <section className="rounded-2xl border border-carbon-800 bg-carbon-900/40 p-5">
        {sectionTitle('Precio')}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <FormInput
            label="Coste (EUR)"
            type="number"
            step="0.01"
            value={product.cost ?? ''}
            onChange={(e) => set({ cost: num(e.target.value, 0) })}
          />
          <FormInput
            label="Precio de venta (EUR)"
            type="number"
            step="0.01"
            value={product.price}
            onChange={(e) => set({ price: num(e.target.value, 0) })}
          />
          <FormInput
            label="Precio anterior (EUR)"
            type="number"
            step="0.01"
            value={product.oldPrice ?? ''}
            onChange={(e) =>
              set({
                oldPrice: e.target.value === '' ? undefined : num(e.target.value, 0),
              })
            }
          />
          <FormInput
            label="Descuento (%)"
            type="number"
            step="1"
            min="0"
            max="100"
            value={product.discount ?? 0}
            onChange={(e) => set({ discount: num(e.target.value, 0) })}
          />
        </div>
        <p className="mt-3 text-xs text-carbon-500">
          El coste procede del proveedor (no se usa como precio final automáticamente).
        </p>
      </section>

      {/* INVENTARIO */}
      <section className="rounded-2xl border border-carbon-800 bg-carbon-900/40 p-5">
        {sectionTitle('Inventario')}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <FormInput
            label="SKU"
            value={product.sku ?? ''}
            onChange={(e) => set({ sku: e.target.value })}
            hint="Identificador único del producto"
          />
          <FormInput
            label="Stock"
            type="number"
            min="0"
            value={product.stock}
            onChange={(e) => set({ stock: Math.max(num(e.target.value, 0), 0) })}
          />
          <FormInput
            label="Stock mínimo"
            type="number"
            min="0"
            value={product.minStock ?? 5}
            onChange={(e) => set({ minStock: Math.max(num(e.target.value, 0), 0) })}
          />
        </div>
      </section>

      {/* CARACTERÍSTICAS */}
      <section className="rounded-2xl border border-carbon-800 bg-carbon-900/40 p-5">
        {sectionTitle('Características')}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <FormInput
            label="Material"
            value={product.material}
            onChange={(e) => set({ material: e.target.value })}
          />
          <FormInput
            label="Dimensiones"
            value={product.dimensions}
            onChange={(e) => set({ dimensions: e.target.value })}
          />
          <FormInput
            label="Peso"
            value={product.weight}
            onChange={(e) => set({ weight: e.target.value })}
          />
        </div>
        <div className="mt-4">
          <p className="mb-2 text-xs font-medium uppercase tracking-wider text-carbon-400">
            Características / especificaciones
          </p>
          <div className="space-y-2">
            {(product.specifications.length > 0 ? product.specifications : ['']).map(
              (spec, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    value={spec}
                    onChange={(e) => {
                      const specs = [...product.specifications]
                      specs[index] = e.target.value
                      set({ specifications: specs })
                    }}
                    placeholder="Ej. Detalles en fibra de carbono"
                    className="w-full rounded-lg border border-carbon-700 bg-carbon-900/60 px-3 py-2 text-sm text-carbon-100 placeholder:text-carbon-500 focus:border-f1-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      set({
                        specifications: product.specifications.filter((_, i) => i !== index),
                      })
                    }
                    className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-carbon-700 text-carbon-400 transition-colors hover:border-f1-500 hover:text-f1-400"
                    aria-label="Eliminar característica"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ),
            )}
          </div>
          <button
            type="button"
            onClick={() => set({ specifications: [...product.specifications, ''] })}
            className="mt-2 inline-flex items-center gap-1.5 text-sm text-f1-400 transition-colors hover:text-f1-300"
          >
            <Plus size={15} />
            Añadir característica
          </button>
        </div>
      </section>

      {/* IMÁGENES */}
      <section className="rounded-2xl border border-carbon-800 bg-carbon-900/40 p-5">
        {sectionTitle('Imágenes')}
        <div className="flex flex-wrap items-center gap-3">
          {product.images.length > 0 ? (
            product.images.slice(0, 6).map((url, index) => (
              <div
                key={`${url}-${index}`}
                className="relative size-16 overflow-hidden rounded-lg border border-carbon-700 bg-carbon-850"
              >
                <img src={url} alt="" className="size-full object-cover" />
                {index === 0 && (
                  <span className="absolute bottom-0 inset-x-0 bg-f1-500/90 py-0.5 text-center text-[8px] font-bold text-white">
                    PRINCIPAL
                  </span>
                )}
              </div>
            ))
          ) : (
            <p className="text-sm text-carbon-500">Sin imágenes seleccionadas.</p>
          )}
        </div>
        <p className="mt-3 text-xs text-carbon-500">
          Selecciona, ordena o elimina imágenes en la galería de la sección de
          resultados (imágenes detectadas).
        </p>
      </section>

      {/* CONFIGURACIÓN */}
      <section className="rounded-2xl border border-carbon-800 bg-carbon-900/40 p-5">
        {sectionTitle('Configuración')}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormSelect
            label="Estado"
            value={product.status ?? 'disponible'}
            onChange={(e) =>
              set({ status: (e.target.value || 'disponible') as Product['status'] })
            }
            options={STATUS_OPTIONS}
          />
          <div className="flex flex-wrap items-center gap-5 pb-1 md:col-span-2">
            {(
              [
                ['featured', 'Destacado'],
                ['bestseller', 'Bestseller'],
                ['isNew', 'Nuevo'],
                ['specialEdition', 'Edición especial / limitada'],
              ] as const
            ).map(([key, label]) => (
              <label
                key={key}
                className="flex cursor-pointer items-center gap-2 text-sm text-carbon-300"
              >
                <input
                  type="checkbox"
                  checked={Boolean(product[key])}
                  onChange={() => set({ [key]: !product[key] } as Partial<Product>)}
                  className="size-4 accent-f1-500"
                />
                {label}
              </label>
            ))}
          </div>
        </div>
      </section>

      {/* PROVEEDOR */}
      {product.source && (
        <section className="rounded-2xl border border-carbon-800 bg-carbon-900/40 p-5">
          {sectionTitle('Proveedor')}
          <div className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
            <div className="rounded-xl border border-carbon-800 bg-carbon-950/40 px-4 py-3">
              <p className="text-[11px] uppercase tracking-wider text-carbon-500">Proveedor</p>
              <p className="mt-0.5 font-medium text-carbon-100">{product.source.provider}</p>
            </div>
            <div className="rounded-xl border border-carbon-800 bg-carbon-950/40 px-4 py-3">
              <p className="text-[11px] uppercase tracking-wider text-carbon-500">ID producto</p>
              <p className="mt-0.5 font-medium text-carbon-100">{product.source.productId}</p>
            </div>
            <div className="rounded-xl border border-carbon-800 bg-carbon-950/40 px-4 py-3 sm:col-span-2">
              <p className="text-[11px] uppercase tracking-wider text-carbon-500">URL de origen</p>
              <a
                href={product.source.url}
                target="_blank"
                rel="noreferrer"
                className="mt-0.5 block truncate font-medium text-f1-400 hover:text-f1-300"
              >
                {product.source.url}
              </a>
            </div>
            <div className="rounded-xl border border-carbon-800 bg-carbon-950/40 px-4 py-3">
              <p className="text-[11px] uppercase tracking-wider text-carbon-500">
                Fecha de importación
              </p>
              <p className="mt-0.5 font-medium text-carbon-100">
                {formatDate(product.source.importedAt)}
              </p>
            </div>
            <div className="rounded-xl border border-carbon-800 bg-carbon-950/40 px-4 py-3">
              <p className="text-[11px] uppercase tracking-wider text-carbon-500">
                Última comprobación
              </p>
              <p className="mt-0.5 font-medium text-carbon-100">
                {product.source.lastCheckedAt ? formatDate(product.source.lastCheckedAt) : '—'}
              </p>
            </div>
          </div>
          <p className="mt-3 text-xs text-carbon-500">Información interna para gestión.</p>
        </section>
      )}
    </div>
  )
}