import { Music } from 'lucide-react'
import Ornament from './shared/Ornament'

const variants = {
  classic: ClassicMusic,
  vinyl: VinylMusic,
  minimal: MinimalMusic,
  notes: NotesMusic,
}

export default function MusicSection({ data, style }) {
  const variantId = data.musicStyle || 'classic'
  const VariantComponent = variants[variantId] || ClassicMusic
  return <VariantComponent data={data} style={style} />
}

function ClassicMusic({ data, style }) {
  const isDark = style.id === 'gold-luxury'
  return (
    <section className="py-10 px-6 text-center space-y-3" style={{ backgroundColor: isDark ? style.surface : `${style.primary}08` }}>
      <Music className="w-4 h-4 mx-auto" style={{ color: style.secondary }} />
      <p className="text-xs tracking-[0.2em] uppercase" style={{ color: style.secondary }}>Nuestra Canción</p>
      <p className="text-sm italic" style={{ color: style.text }}>&ldquo;{data.musica || 'Perfect — Ed Sheeran'}&rdquo;</p>
      <button className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-xs font-medium mt-2" style={{ backgroundColor: `${style.secondary}20`, color: style.secondary }}>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><polygon points="5,3 19,12 5,21" /></svg>
        Escuchar
      </button>
    </section>
  )
}

function VinylMusic({ data, style }) {
  const isDark = style.id === 'gold-luxury' || style.id === 'celestial'
  return (
    <section className="py-10 px-6 text-center" style={{ backgroundColor: isDark ? style.surface : style.bg }}>
      <div className="max-w-xs mx-auto space-y-4">
        <div className="w-24 h-24 rounded-full mx-auto relative flex items-center justify-center" style={{ backgroundColor: '#111', boxShadow: `0 0 0 4px ${style.secondary}22` }}>
          <div className="w-20 h-20 rounded-full" style={{ background: `linear-gradient(135deg, ${style.primary}, ${style.secondary})`, opacity: 0.8 }} />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-5 h-5 rounded-full" style={{ backgroundColor: style.secondary }} />
          </div>
        </div>
        <div>
          <p className="text-[9px] tracking-[0.3em] uppercase font-semibold" style={{ color: style.secondary }}>Nuestra Canción</p>
          <p className="text-sm font-semibold mt-1" style={{ color: style.text }}>{data.musica || 'Perfect — Ed Sheeran'}</p>
        </div>
      </div>
    </section>
  )
}

function MinimalMusic({ data, style }) {
  return (
    <section className="py-10 px-6 text-center" style={{ backgroundColor: `${style.primary}04` }}>
      <div className="max-w-xs mx-auto space-y-2">
        <p className="text-[9px] tracking-[0.3em] uppercase font-semibold" style={{ color: style.secondary }}>Nuestra Canción</p>
        <p className="text-sm italic" style={{ color: style.textMuted }}>
          &ldquo;{data.musica || 'Perfect — Ed Sheeran'}&rdquo;
        </p>
      </div>
    </section>
  )
}

function NotesMusic({ data, style }) {
  const isDark = style.id === 'gold-luxury' || style.id === 'celestial'
  return (
    <section className="py-10 px-6 text-center" style={{ backgroundColor: isDark ? style.surface : style.bg }}>
      <div className="max-w-xs mx-auto space-y-3">
        <svg viewBox="0 0 24 24" fill="none" stroke={style.secondary} strokeWidth="1.5" className="w-8 h-8 mx-auto" opacity="0.6">
          <path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" />
        </svg>
        <p className="text-xs tracking-[0.2em] uppercase" style={{ color: style.secondary }}>Nuestra Canción</p>
        <p className="text-lg font-bold" style={{ color: style.text }}>{data.musica || 'Perfect — Ed Sheeran'}</p>
        <div className="flex justify-center gap-1">
          {[1,2,3,4,5].map(i => (
            <div key={i} className="w-1 h-4 rounded-full" style={{ backgroundColor: style.secondary, opacity: 0.3 + i * 0.15, height: `${8 + i * 4}px` }} />
          ))}
        </div>
      </div>
    </section>
  )
}
