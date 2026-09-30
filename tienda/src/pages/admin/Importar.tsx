import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import {
  AlertTriangle,
  CheckCircle2,
  FileText,
  History,
  Link2,
  Loader2,
  PackagePlus,
  Send,
  XCircle,
} from 'lucide-react'
import type { Product } from '../../types'
import type {
  BatchResultItem,
  DuplicateResult,
  ImportPhase,
  ImportedProduct,
  PriceConfig,
} from '../../types/import'
import {
  analyzeBatch,
  analyzeProductUrl,
  getImportById,
  saveImport,
  toFriendlyError,
} from '../../services/importService'
import { buildDraft, buildPriceConfig } from '../../services/importer/ProductNormalizer'
import { productService } from '../../services/productService'
import { teamService } from '../../services/teamService'
import { driverService } from '../../services/driverService'
import { categoryService } from '../../services/categoryService'
import { formatPrice } from '../../utils/format'
import { useToast } from '../../context/ToastContext'
import PageHeader from '../../components/common/PageHeader'
import Button from '../../components/ui/Button'
import DetectionSummary from '../../components/admin/importer/DetectionSummary'
import ImageGallery from '../../components/admin/importer/ImageGallery'
import PriceConfigurator from '../../components/admin/importer/PriceConfigurator'
import ImportEditor from '../../components/admin/importer/ImportEditor'
import ImportPreview from '../../components/admin/importer/ImportPreview'
import DuplicateBanner from '../../components/admin/importer/DuplicateBanner'
import StatusBadge from '../../components/common/StatusBadge'

interface MetaData {
  teams: string[]
  drivers: string[]
  categories: string[]
}

const EXAMPLE_URL = 'https://es.aliexpress.com/item/1005013099421482.html'
const PARTIAL_URL = 'https://es.aliexpress.com/item/1005013099999997.html'

function defaultPriceConfig(cost: number): PriceConfig {
  return buildPriceConfig({
    cost,
    currency: 'EUR',
    defaultStrategy: 'margin',
    defaultMarginPercent: 40,
    defaultFixedIncrease: 5,
  })
}

const AVAILABILITY_LABELS: Record<ImportedProduct['availability'], string> = {
  'in-stock': 'Disponible',
  'out-of-stock': 'Sin stock',
  unknown: 'Desconocida',
}

function draftReadiness(draft: Product): string[] {
  const missing: string[] = []
  if (!draft.name.trim()) missing.push('Nombre')
  if (draft.price <= 0) missing.push('Precio')
  if (!draft.team.trim()) missing.push('Escudería')
  if (!draft.driver.trim()) missing.push('Piloto')
  if (!draft.scale.trim()) missing.push('Escala')
  if (!draft.category.trim()) missing.push('Categoría')
  if (draft.images.length === 0) missing.push('Imágenes')
  return missing
}

export default function Importar() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { showToast } = useToast()

  const [meta, setMeta] = useState<MetaData | null>(null)
  const [url, setUrl] = useState('')
  const [phase, setPhase] = useState<ImportPhase>('idle')
  const [imported, setImported] = useState<ImportedProduct | null>(null)
  const [draft, setDraft] = useState<Product | null>(null)
  const [price, setPrice] = useState<PriceConfig>(defaultPriceConfig(0))
  const [duplicate, setDuplicate] = useState<DuplicateResult>({ duplicated: false })
  const [updateExisting, setUpdateExisting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState<'draft' | 'edit' | 'publish' | null>(null)

  const [batchMode, setBatchMode] = useState(false)
  const [batchText, setBatchText] = useState('')
  const [batchRunning, setBatchRunning] = useState(false)
  const [batchProgress, setBatchProgress] = useState(0)
  const [batchTotal, setBatchTotal] = useState(0)
  const [batchResults, setBatchResults] = useState<BatchResultItem[]>([])

  const resultRef = useRef<HTMLDivElement>(null)
  const editorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let mounted = true
    Promise.all([teamService.getAll(), driverService.getAll(), categoryService.getAll()]).then(
      ([teams, drivers, categories]) => {
        if (!mounted) return
        setMeta({
          teams: teams.map((t) => t.name),
          drivers: drivers.map((d) => d.name),
          categories: categories.map((c) => c.name),
        })
      },
    )
    return () => {
      mounted = false
    }
  }, [])

  const runAnalysis = useCallback(async (targetUrl: string) => {
    setPhase('analyzing')
    setError(null)
    setImported(null)
    setDraft(null)
    setDuplicate({ duplicated: false })
    setUpdateExisting(false)
    try {
      const result = await analyzeProductUrl(targetUrl)
      const config = buildPriceConfig({
        cost: result.imported.price ?? 0,
        currency: result.imported.currencyCode || 'EUR',
        defaultStrategy: 'margin',
        defaultMarginPercent: 40,
        defaultFixedIncrease: 5,
      })
      const built = buildDraft(result.imported, config, null)
      setUrl(targetUrl)
      setImported(result.imported)
      setPrice(config)
      setDraft(built.product)
      setDuplicate(result.duplicate)
      setPhase(result.phase)
    } catch (err) {
      setError(toFriendlyError(err))
      setPhase('error')
      setImported(null)
      setDraft(null)
    }
    window.setTimeout(() => {
      resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 120)
  }, [])

  useEffect(() => {
    const importId = Number(searchParams.get('importId'))
    if (!importId) return
    const record = getImportById(importId)
    if (record) {
      setUrl(record.sourceUrl)
      void runAnalysis(record.sourceUrl)
    }
  }, [searchParams, runAnalysis])

  const handleAnalyze = () => {
    const target = url.trim()
    if (!target) {
      setError('Introduce el enlace del producto primero.')
      return
    }
    void runAnalysis(target)
  }

  const handlePriceChange = (next: PriceConfig) => {
    setPrice(next)
    setDraft((prev) =>
      prev
        ? {
            ...prev,
            cost: next.cost,
            price: next.salePrice,
            oldPrice: next.oldPrice > 0 ? next.oldPrice : undefined,
            discount: next.discountPercent,
          }
        : prev,
    )
  }

  const handleBatch = async () => {
    const items = batchText
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
    if (items.length === 0) {
      setError('Pega al menos una URL para importar.')
      return
    }
    setError(null)
    setBatchRunning(true)
    setBatchResults([])
    try {
      const results = await analyzeBatch(items, (done) => {
        setBatchProgress(done)
        setBatchTotal(items.length)
      })
      setBatchResults(results)
    } finally {
      setBatchRunning(false)
    }
  }

  const handleReview = (item: BatchResultItem) => {
    setBatchMode(false)
    setUrl(item.url)
    void runAnalysis(item.url)
  }

  const handleSave = async (action: 'draft' | 'edit' | 'publish') => {
    if (!draft || !imported) return
    const missing = draftReadiness(draft)
    const required =
      action === 'publish'
        ? missing
        : missing.filter((field) => field === 'Nombre' || field === 'Precio')

    if (required.length > 0) {
      const message =
        action === 'publish'
          ? `Revisa antes de publicar: faltan ${required.join(', ')}.`
          : `Faltan campos esenciales: ${required.join(' y ')}. Se puede guardar como borrador.`
      setError(message)
      editorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      return
    }

    setSaving(action)
    setError(null)
    const status = action === 'publish' ? 'disponible' : 'borrador'

    try {
      let saved: Product
      if (updateExisting && duplicate.product) {
        saved = await productService.update(duplicate.product.id, {
          ...draft,
          id: duplicate.product.id,
          status,
        })
      } else {
        saved = await productService.create({ ...draft, status })
      }

      const recordStatus = action === 'publish' ? 'published' : 'draft'
      await saveImport({ imported, product: saved, recordStatus, price })

      showToast(
        action === 'publish'
          ? 'Producto publicado correctamente'
          : 'Producto guardado como borrador',
      )
      if (action === 'edit' || action === 'publish') {
        navigate(`/admin/productos/${saved.id}/editar`)
      } else {
        navigate('/admin/productos')
      }
    } catch (err) {
      setError(toFriendlyError(err))
      setPhase('error')
    } finally {
      setSaving(null)
    }
  }

  const missingCount = draft ? draftReadiness(draft).length : 0
  const ready = draft
    ? draftReadiness(draft).filter(
        (field) => field === 'Nombre' || field === 'Precio',
      ).length === 0
    : false

  const infoRows = useMemo(() => {
    if (!imported) return []
    return [
      { label: 'Nombre original', value: imported.title || '—' },
      {
        label: 'Precio del proveedor',
        value:
          imported.price !== null
            ? `${formatPrice(imported.price)} (${imported.currencyCode})`
            : 'No disponible',
      },
      { label: 'Moneda', value: `${imported.currency} (${imported.currencyCode})` },
      {
        label: 'Disponibilidad',
        value: AVAILABILITY_LABELS[imported.availability],
      },
      { label: 'SKU', value: imported.sku ?? 'No disponible' },
      { label: 'Categoría', value: imported.detection.category?.value ?? 'Por detectar' },
      { label: 'Marca / fabricante', value: imported.brand ?? 'Por detectar' },
      {
        label: 'Variantes',
        value:
          imported.variants.length > 0
            ? imported.variants.map((v) => `${v.name}: ${v.value}`).join(' · ')
            : 'No disponibles',
      },
      {
        label: 'Valoración',
        value:
          imported.rating !== null
            ? `${imported.rating} / 5 · ${imported.ratingCount ?? 0} valoraciones`
            : 'No disponible',
      },
    ]
  }, [imported])

  return (
    <div className="space-y-6">
      <PageHeader
        title="Importar producto"
        subtitle="Introduce el enlace del proveedor y convierte la información disponible en un producto editable."
        actions={
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/admin/importaciones')}
            >
              <History size={14} />
              Historial
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setBatchMode((prev) => !prev)}>
              {batchMode ? 'Volver a un solo enlace' : 'Importación múltiple'}
            </Button>
          </div>
        }
      />

      {/* ENTRADA DE URL */}
      <section className="rounded-2xl border border-carbon-800 bg-carbon-900/40 p-6">
        <label className="mb-2 block text-sm font-semibold uppercase tracking-wider text-carbon-300">
          Pega aquí el enlace del producto
        </label>
        <div className="flex flex-col gap-3 lg:flex-row">
          <div className="relative flex-1">
            <Link2
              size={18}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-carbon-500"
            />
            <input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  handleAnalyze()
                }
              }}
              placeholder="https://es.aliexpress.com/item/1005013099421482.html"
              className="w-full rounded-xl border border-carbon-700 bg-carbon-900/80 py-4 pl-12 pr-4 text-base text-carbon-100 placeholder:text-carbon-600 focus:border-f1-500 focus:outline-none sm:text-lg"
            />
          </div>
          <Button size="lg" onClick={handleAnalyze} disabled={phase === 'analyzing'}>
            {phase === 'analyzing' ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
            {phase === 'analyzing' ? 'Analizando...' : 'Analizar producto'}
          </Button>
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-carbon-500">
          <span>Prueba:</span>
          <button
            type="button"
            className="text-f1-400 underline-offset-2 hover:underline"
            onClick={() => setUrl(EXAMPLE_URL)}
          >
            {EXAMPLE_URL}
          </button>
          <span className="text-carbon-600">·</span>
          <button
            type="button"
            className="text-f1-400 underline-offset-2 hover:underline"
            onClick={() => setUrl(PARTIAL_URL)}
          >
            Ejemplo parcial
          </button>
        </div>

        {batchMode && (
          <div className="mt-5 space-y-2 border-t border-carbon-800 pt-5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-carbon-400">
              Importar múltiples productos
            </label>
            <textarea
              value={batchText}
              onChange={(e) => setBatchText(e.target.value)}
              rows={4}
              placeholder={'https://.../item/1000000000001.html\nhttps://.../item/1000000000002.html\nhttps://.../item/1000000000003.html'}
              className="w-full resize-y rounded-lg border border-carbon-700 bg-carbon-900/60 px-3.5 py-3 text-sm text-carbon-100 placeholder:text-carbon-600 focus:border-f1-500 focus:outline-none"
            />
            <div className="flex flex-wrap items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={handleBatch}
                disabled={batchRunning}
              >
                {batchRunning ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <PackagePlus size={14} />
                )}
                {batchRunning ? 'Analizando...' : 'Analizar todas'}
              </Button>
              {batchRunning && (
                <span className="text-sm text-carbon-400">
                  Procesando {Math.min(batchProgress + 1, Math.max(batchTotal, 1))}/{Math.max(batchTotal, 1)}
                </span>
              )}
            </div>

            {batchResults.length > 0 && (
              <div className="overflow-x-auto rounded-xl border border-carbon-800">
                <table className="w-full min-w-[560px] text-left text-sm">
                  <thead>
                    <tr className="border-b border-carbon-800 bg-carbon-950/40 text-[11px] uppercase tracking-wider text-carbon-400">
                      <th className="px-4 py-2.5">Producto</th>
                      <th className="px-4 py-2.5">Estado</th>
                      <th className="px-4 py-2.5">Imágenes</th>
                      <th className="px-4 py-2.5">Precio</th>
                      <th className="px-4 py-2.5 text-right">Acción</th>
                    </tr>
                  </thead>
                  <tbody>
                    {batchResults.map((item) => (
                      <tr
                        key={item.url}
                        className="border-b border-carbon-800/60 hover:bg-carbon-800/30"
                      >
                        <td className="max-w-[260px] px-4 py-3">
                          <p className="truncate font-medium text-carbon-100">
                            {item.imported?.title ?? item.url}
                          </p>
                          {!item.ok && <p className="text-xs text-f1-400">{item.error}</p>}
                        </td>
                        <td className="px-4 py-3">
                          {item.ok ? (
                            <StatusBadge
                              status={item.phase === 'partial' ? 'Parcial' : 'Correcto'}
                              tone={item.phase === 'partial' ? 'warning' : 'success'}
                            />
                          ) : (
                            <StatusBadge status="Error" tone="danger" />
                          )}
                        </td>
                        <td className="px-4 py-3 text-carbon-300">
                          {item.imported?.images.length ?? 0}
                        </td>
                        <td className="px-4 py-3 text-carbon-300">
                          {item.imported?.price !== null && item.imported?.price !== undefined
                            ? formatPrice(item.imported.price)
                            : '—'}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button
                            type="button"
                            disabled={!item.ok}
                            onClick={() => handleReview(item)}
                            className="inline-flex items-center gap-1 rounded-lg bg-f1-500 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-f1-400 disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            Revisar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </section>

      {error && phase === 'idle' && (
        <div className="flex items-start gap-3 rounded-2xl border border-f1-500/30 bg-f1-500/10 px-5 py-4 text-sm text-f1-400">
          <XCircle size={18} className="mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* ANÁLISIS EN CURSO */}
      {phase === 'analyzing' && (
        <section className="rounded-2xl border border-carbon-800 bg-carbon-900/40 p-8">
          <div className="flex flex-col items-center justify-center gap-4 py-6 text-center">
            <Loader2 size={34} className="animate-spin text-f1-500" />
            <p className="font-display text-lg font-semibold text-white">Analizando producto...</p>
            <p className="max-w-md text-sm text-carbon-500">
              Consultando la fuente autorizada y preparando la información.
            </p>
            <div className="h-1.5 w-full max-w-sm overflow-hidden rounded-full bg-carbon-800">
              <div className="h-full w-1/2 animate-shimmer rounded-full bg-f1-500" />
            </div>
          </div>
        </section>
      )}

      {/* ERROR */}
      {phase === 'error' && (
        <section className="rounded-2xl border border-f1-500/30 bg-f1-500/10 p-6">
          <div className="flex items-start gap-3">
            <XCircle size={22} className="mt-0.5 shrink-0 text-f1-400" />
            <div>
              <p className="font-semibold text-f1-400">No se pudo analizar el producto.</p>
              <p className="mt-1 text-sm text-carbon-200">{error}</p>
              <p className="mt-2 text-xs text-carbon-400">
                Comprueba el enlace o prueba con uno de los ejemplos de arriba.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* RESULTADO */}
      {imported && draft && (
        <div ref={resultRef} className="space-y-6 animate-fade-up">
          {phase === 'success' && (
            <div className="flex items-start gap-3 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-5 py-4">
              <CheckCircle2 size={20} className="mt-0.5 shrink-0 text-emerald-400" />
              <div>
                <p className="font-semibold text-emerald-300">Producto analizado correctamente</p>
                <p className="mt-1 text-sm text-carbon-200">
                  Revisa la información antes de guardarla.
                </p>
              </div>
            </div>
          )}
          {phase === 'partial' && (
            <div className="flex items-start gap-3 rounded-2xl border border-amber-500/30 bg-amber-500/10 px-5 py-4">
              <AlertTriangle size={20} className="mt-0.5 shrink-0 text-amber-400" />
              <div>
                <p className="font-semibold text-amber-300">
                  Producto analizado parcialmente. Algunos datos requieren revisión.
                </p>
                <p className="mt-1 text-sm text-carbon-200">
                  La fuente no aporta todos los datos; completa los campos marcados.
                </p>
              </div>
            </div>
          )}

          {duplicate.duplicated && duplicate.product && !updateExisting && (
            <DuplicateBanner
              duplicate={duplicate}
              onUpdateExisting={() => {
                setUpdateExisting(true)
              }}
              onCreateNew={() => {
                setUpdateExisting(false)
              }}
            />
          )}
          {updateExisting && duplicate.product && (
            <div className="rounded-2xl border border-carbon-700 bg-carbon-900/60 px-5 py-3 text-sm text-carbon-200">
              Se guardará{' '}
              <span className="font-medium text-white">actualizando</span> el producto existente "{duplicate.product.name}".
              <button
                type="button"
                className="ml-3 text-f1-400 underline-offset-2 hover:underline"
                onClick={() => setUpdateExisting(false)}
              >
                Crear como nuevo en su lugar
              </button>
            </div>
          )}

          {/* DOS COLUMNAS */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
            <section className="rounded-2xl border border-carbon-800 bg-carbon-900/40 p-5">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-white">
                  Galería de imágenes detectadas
                </h3>
                <span className="rounded-md border border-carbon-700 bg-carbon-950/60 px-2 py-0.5 text-[10px] font-semibold text-carbon-300">
                  {imported.images.length} encontradas
                </span>
              </div>
              <ImageGallery
                images={draft.images}
                onChange={(images) => setDraft((prev) => (prev ? { ...prev, images } : prev))}
              />
            </section>

            <section className="rounded-2xl border border-carbon-800 bg-carbon-900/40 p-5">
              <h3 className="mb-4 font-display text-sm font-semibold uppercase tracking-wider text-white">
                Información detectada
              </h3>
              <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {infoRows.map((row) => (
                  <div
                    key={row.label}
                    className="rounded-xl border border-carbon-800 bg-carbon-950/40 px-3.5 py-3"
                  >
                    <dt className="text-[11px] uppercase tracking-wider text-carbon-500">
                      {row.label}
                    </dt>
                    <dd className="mt-0.5 text-sm font-medium text-carbon-100">{row.value}</dd>
                  </div>
                ))}
                <div className="rounded-xl border border-carbon-800 bg-carbon-950/40 px-3.5 py-3 sm:col-span-2">
                  <dt className="text-[11px] uppercase tracking-wider text-carbon-500">
                    URL original
                  </dt>
                  <dd className="mt-0.5 truncate">
                    <a
                      href={imported.sourceUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm font-medium text-f1-400 hover:text-f1-300"
                    >
                      {imported.sourceUrl}
                    </a>
                  </dd>
                </div>
              </dl>
              {imported.shortDescription && (
                <p className="mt-4 text-sm leading-relaxed text-carbon-300">
                  <FileText size={13} className="mr-1.5 inline text-carbon-500" />
                  {imported.shortDescription}
                </p>
              )}
            </section>
          </div>

          <DetectionSummary detection={imported.detection} />

          <PriceConfigurator
            config={price}
            currency={imported.currencyCode || '€'}
            onChange={handlePriceChange}
          />

          {/* EDITOR */}
          <div ref={editorRef} className="scroll-mt-24 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="font-display text-xl font-bold uppercase tracking-wide text-white">
                  Revisar y editar
                </h2>
                <p className="text-sm text-carbon-400">
                  Todos los datos son editables. La detección automática es solo una ayuda.
                </p>
              </div>
              {missingCount > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => editorRef.current?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Completar información ({missingCount})
                </Button>
              )}
            </div>
            {meta && (
              <ImportEditor
                product={draft}
                detection={imported.detection}
                meta={meta}
                onChange={setDraft}
              />
            )}
          </div>

          {/* PREVISUALIZACIÓN */}
          <ImportPreview product={draft} />

          {/* GUARDAR */}
          <section className="rounded-2xl border border-carbon-800 bg-carbon-900/60 p-6">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm">
                {ready ? (
                  <span className="inline-flex items-center gap-2 text-emerald-400">
                    <CheckCircle2 size={16} />
                    El producto está listo para guardar.
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-2 text-amber-400">
                    <AlertTriangle size={16} />
                    Faltan {missingCount} campo{missingCount === 1 ? '' : 's'} por revisar.
                  </span>
                )}
              </p>
              <div className="flex flex-wrap gap-4 text-xs text-carbon-500">
                <span>
                  Coste: <strong className="text-carbon-200">{formatPrice(price.cost)}</strong>
                </span>
                <span>
                  Precio de venta:{' '}
                  <strong className="text-carbon-200">{formatPrice(price.salePrice)}</strong>
                </span>
                <span>
                  Proveedor: <strong className="text-carbon-200">{imported.providerName}</strong>
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                variant="outline"
                block
                onClick={() => void handleSave('draft')}
                disabled={saving !== null}
              >
                {saving === 'draft' ? <Loader2 size={16} className="animate-spin" /> : <FileText size={16} />}
                Guardar como borrador
              </Button>
              <Button
                block
                onClick={() => void handleSave('edit')}
                disabled={saving !== null}
              >
                {saving === 'edit' ? <Loader2 size={16} className="animate-spin" /> : <PackagePlus size={16} />}
                Guardar y editar
              </Button>
              <Button
                variant="dark"
                block
                onClick={() => void handleSave('publish')}
                disabled={saving !== null}
              >
                {saving === 'publish' ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                Publicar producto
              </Button>
            </div>
            <p className="mt-4 text-xs text-carbon-500">
              Por defecto los productos importados se guardan como borrador para que revises
              la información antes de publicarlos manualmente.
            </p>
          </section>
        </div>
      )}
    </div>
  )
}