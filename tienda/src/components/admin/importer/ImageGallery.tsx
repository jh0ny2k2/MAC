import { useState } from 'react'
import {
  ChevronLeft,
  ChevronRight,
  ImageOff,
  Maximize2,
  Plus,
  Star,
  Trash2,
  X,
} from 'lucide-react'
import { cx } from '../../../utils/format'
import Button from '../../ui/Button'

interface ImageGalleryProps {
  images: string[]
  onChange: (images: string[]) => void
}

export default function ImageGallery({ images, onChange }: ImageGalleryProps) {
  const [previewIndex, setPreviewIndex] = useState(0)
  const [lightbox, setLightbox] = useState(false)
  const [newUrl, setNewUrl] = useState('')

  const safeIndex = Math.min(previewIndex, Math.max(images.length - 1, 0))
  const current = images[safeIndex]

  const update = (next: string[]) => onChange(next)

  const setMain = (index: number) => {
    if (index === 0) return
    const next = [images[index], ...images.filter((_, i) => i !== index)]
    update(next)
    setPreviewIndex(0)
  }

  const move = (index: number, dir: -1 | 1) => {
    const target = index + dir
    if (target < 0 || target >= images.length) return
    const next = [...images]
    ;[next[index], next[target]] = [next[target], next[index]]
    update(next)
    setPreviewIndex(target)
  }

  const remove = (index: number) => {
    const next = images.filter((_, i) => i !== index)
    update(next)
    setPreviewIndex(Math.min(previewIndex, Math.max(next.length - 1, 0)))
  }

  const addUrl = () => {
    const url = newUrl.trim()
    if (!url || images.includes(url)) return
    update([...images, url])
    setNewUrl('')
  }

  return (
    <div className="space-y-4">
      {/* Vista principal */}
      <div
        className="relative flex aspect-[4/3] cursor-zoom-in items-center justify-center overflow-hidden rounded-2xl border border-carbon-800 bg-carbon-850"
        onClick={() => setLightbox(true)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && setLightbox(true)}
      >
        {current ? (
          <img src={current} alt="" className="size-full object-cover" />
        ) : (
          <div className="flex flex-col items-center gap-2 text-carbon-500">
            <ImageOff size={28} />
            <span className="text-xs">Sin imagen. Añade una imagen con su URL.</span>
          </div>
        )}
        <div className="absolute right-3 top-3 flex items-center gap-1.5">
          <span className="flex size-7 items-center justify-center rounded-lg bg-carbon-950/70 text-[10px] font-semibold text-carbon-200 backdrop-blur">
            {images.length} imgs
          </span>
          <span className="flex size-7 items-center justify-center rounded-lg bg-carbon-950/70 text-carbon-200 backdrop-blur">
            <Maximize2 size={14} />
          </span>
        </div>
        <div className="absolute bottom-3 left-3">
          <span className="rounded-md bg-carbon-950/70 px-2 py-1 text-[10px] font-semibold text-carbon-200 backdrop-blur">
            Imagen principal · {safeIndex + 1}/{Math.max(images.length, 1)}
          </span>
        </div>
      </div>

      {/* Miniaturas */}
      {images.length > 0 && (
        <div className="grid grid-cols-4 gap-2 sm:grid-cols-5">
          {images.map((url, index) => (
            <div
              key={`${url}-${index}`}
              className={cx(
                'group relative aspect-square overflow-hidden rounded-lg border bg-carbon-850 transition-colors',
                index === safeIndex
                  ? 'border-f1-500 ring-2 ring-f1-500/30'
                  : 'border-carbon-800 hover:border-carbon-600',
              )}
            >
              <img
                src={url}
                alt=""
                className="size-full cursor-pointer object-cover"
                onClick={() => setPreviewIndex(index)}
              />
              {index === 0 && (
                <span className="absolute left-1 top-1 flex items-center gap-0.5 rounded bg-f1-500/90 px-1 py-0.5 text-[8px] font-bold text-white">
                  <Star size={8} fill="currentColor" />
                  PRIN
                </span>
              )}
              <span className="absolute right-1 top-1 rounded bg-carbon-950/70 px-1 text-[9px] font-semibold text-carbon-200">
                {index + 1}
              </span>
              <div className="absolute inset-x-0 bottom-0 hidden justify-center gap-0.5 bg-carbon-950/80 p-1 backdrop-blur group-hover:flex">
                <button
                  type="button"
                  onClick={() => move(index, -1)}
                  disabled={index === 0}
                  className="rounded p-0.5 text-carbon-300 hover:text-white disabled:opacity-30"
                  aria-label="Mover a la izquierda"
                >
                  <ChevronLeft size={12} />
                </button>
                {index !== 0 && (
                  <button
                    type="button"
                    onClick={() => setMain(index)}
                    className="rounded p-0.5 text-f1-400 hover:text-f1-300"
                    title="Establecer como imagen principal"
                    aria-label="Establecer como principal"
                  >
                    <Star size={12} />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => move(index, 1)}
                  disabled={index === images.length - 1}
                  className="rounded p-0.5 text-carbon-300 hover:text-white disabled:opacity-30"
                  aria-label="Mover a la derecha"
                >
                  <ChevronRight size={12} />
                </button>
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="rounded p-0.5 text-carbon-300 hover:text-f1-400"
                  aria-label="Eliminar imagen"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Añadir URL */}
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          value={newUrl}
          onChange={(e) => setNewUrl(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              addUrl()
            }
          }}
          placeholder="https://... o /images/...(URL de imagen)"
          className="w-full rounded-lg border border-carbon-700 bg-carbon-900/60 px-3.5 py-2.5 text-sm text-carbon-100 placeholder:text-carbon-500 focus:border-f1-500 focus:outline-none"
        />
        <Button type="button" variant="outline" size="md" onClick={addUrl}>
          <Plus size={15} />
          Añadir
        </Button>
      </div>

      {/* Lightbox */}
      {lightbox && current && (
        <div
          className="fixed inset-0 z-[110] flex items-center justify-center bg-black/85 p-6 backdrop-blur-sm"
          onClick={() => setLightbox(false)}
        >
          <button
            type="button"
            className="absolute right-4 top-4 flex size-9 items-center justify-center rounded-lg border border-carbon-700 bg-carbon-900/70 text-carbon-200 hover:text-white"
            aria-label="Cerrar"
          >
            <X size={18} />
          </button>
          <img
            src={current}
            alt="Vista previa"
            className="max-h-[85vh] max-w-full rounded-xl object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      <p className="text-xs text-carbon-500">
        No eliminamos marcas de agua ni modificamos imágenes de terceros. Las
        imágenes solo se conservan si la fuente autorizada permite su uso.
      </p>
    </div>
  )
}