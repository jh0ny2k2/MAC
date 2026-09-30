import { Camera } from 'lucide-react'
import Ornament from './shared/Ornament'

const variants = {
  classic: GridGallery,
  masonry: MasonryGallery,
  polaroid: PolaroidGallery,
  strip: StripGallery,
}

const DEFAULT_PHOTOS = [
  'https://images.unsplash.com/photo-1519741497674-611481863552?w=400&q=80',
  'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=400&q=80',
  'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=400&q=80',
  'https://images.unsplash.com/photo-1529636798458-92182e662485?w=400&q=80',
  'https://images.unsplash.com/photo-1474552226712-ac0f0961a954?w=400&q=80',
  'https://images.unsplash.com/photo-1510076857177-7470076d4098?w=400&q=80',
]

export default function GallerySection({ data, style }) {
  const variantId = data.galleryStyle || 'classic'
  const VariantComponent = variants[variantId] || GridGallery
  const photos = data.galleryUrls?.length ? data.galleryUrls : DEFAULT_PHOTOS
  return <VariantComponent photos={photos} data={data} style={style} />
}

function GridGallery({ photos, style }) {
  return (
    <section className="px-6 py-10" style={{ backgroundColor: style.bg }}>
      <div className="text-center space-y-4 mb-6">
        <Ornament color={style.secondary} variant={style.ornament} />
        <p className="text-xs tracking-[0.2em] uppercase" style={{ color: style.secondary }}>Galería</p>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {photos.map((url, i) => (
          <div key={i} className="aspect-square rounded-lg overflow-hidden bg-gray-100">
            {url ? <img src={url} alt="" className="w-full h-full object-cover" loading="lazy" /> : <div className="w-full h-full" style={{ backgroundColor: `${style.secondary}15` }} />}
          </div>
        ))}
      </div>
      <Camera className="w-4 h-4 mx-auto mt-4" style={{ color: style.textMuted, opacity: 0.5 }} />
    </section>
  )
}

function MasonryGallery({ photos, style }) {
  const left = photos.filter((_, i) => i % 2 === 0)
  const right = photos.filter((_, i) => i % 2 === 1)
  return (
    <section className="px-6 py-10" style={{ backgroundColor: `${style.primary}04` }}>
      <div className="text-center space-y-4 mb-6">
        <Ornament color={style.secondary} variant={style.ornament} />
        <p className="text-xs tracking-[0.2em] uppercase" style={{ color: style.secondary }}>Galería</p>
      </div>
      <div className="flex gap-2">
        <div className="flex-1 space-y-2">
          {left.map((url, i) => (
            <div key={i} className={`rounded-lg overflow-hidden bg-gray-100`} style={{ aspectRatio: i % 3 === 0 ? '1' : '0.8' }}>
              {url ? <img src={url} alt="" className="w-full h-full object-cover" loading="lazy" /> : <div className="w-full h-full" style={{ backgroundColor: `${style.secondary}15` }} />}
            </div>
          ))}
        </div>
        <div className="flex-1 space-y-2">
          {right.map((url, i) => (
            <div key={i} className={`rounded-lg overflow-hidden bg-gray-100`} style={{ aspectRatio: i % 3 === 1 ? '0.7' : '1.2' }}>
              {url ? <img src={url} alt="" className="w-full h-full object-cover" loading="lazy" /> : <div className="w-full h-full" style={{ backgroundColor: `${style.secondary}15` }} />}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function PolaroidGallery({ photos, style }) {
  return (
    <section className="px-6 py-10" style={{ backgroundColor: style.bg }}>
      <div className="text-center space-y-4 mb-6">
        <Ornament color={style.secondary} variant={style.ornament} />
        <p className="text-xs tracking-[0.2em] uppercase" style={{ color: style.secondary }}>Galería</p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {photos.slice(0, 4).map((url, i) => (
          <div key={i} className="p-2 pb-4 rounded-lg" style={{ backgroundColor: '#fff', boxShadow: `0 4px 12px ${style.primary}15`, transform: i % 2 === 0 ? 'rotate(-1deg)' : 'rotate(1deg)' }}>
            <div className="aspect-square rounded overflow-hidden bg-gray-100">
              {url ? <img src={url} alt="" className="w-full h-full object-cover" loading="lazy" /> : <div className="w-full h-full" style={{ backgroundColor: `${style.secondary}15` }} />}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

function StripGallery({ photos, style }) {
  return (
    <section className="py-10" style={{ backgroundColor: `${style.primary}04` }}>
      <div className="text-center space-y-4 mb-6 px-6">
        <Ornament color={style.secondary} variant={style.ornament} />
        <p className="text-xs tracking-[0.2em] uppercase" style={{ color: style.secondary }}>Galería</p>
      </div>
      <div className="flex gap-2 overflow-x-auto px-6 pb-2 snap-x" style={{ scrollbarWidth: 'none' }}>
        {photos.map((url, i) => (
          <div key={i} className="snap-start shrink-0 w-48 aspect-[3/4] rounded-xl overflow-hidden bg-gray-100">
            {url ? <img src={url} alt="" className="w-full h-full object-cover" loading="lazy" /> : <div className="w-full h-full" style={{ backgroundColor: `${style.secondary}15` }} />}
          </div>
        ))}
      </div>
    </section>
  )
}
