import Ornament from './shared/Ornament'

const variants = {
  classic: ClassicStory,
  letter: LetterStory,
  highlight: HighlightStory,
  minimal: MinimalStory,
}

export default function StorySection({ data, style }) {
  const variantId = data.storyStyle || 'classic'
  const VariantComponent = variants[variantId] || ClassicStory
  return <VariantComponent data={data} style={style} />
}

function ClassicStory({ data, style }) {
  return (
    <section className="px-6 py-10 text-center space-y-4" style={{ backgroundColor: style.bg }}>
      <Ornament color={style.secondary} variant={style.ornament} />
      <p className="text-xs tracking-[0.2em] uppercase" style={{ color: style.secondary }}>Nuestra Historia</p>
      <h2 className="text-xl sm:text-2xl font-bold" style={{ color: style.text }}>
        {data.novia || 'Ana'} & {data.novio || 'Carlos'}
      </h2>
      <p className="text-sm leading-relaxed italic max-w-xs mx-auto" style={{ color: style.textMuted }}>
        &ldquo;{data.historia || 'Nos conocimos y supimos que era para siempre.'}&rdquo;
      </p>
    </section>
  )
}

function LetterStory({ data, style }) {
  const isDark = style.id === 'gold-luxury' || style.id === 'celestial'
  return (
    <section className="px-6 py-10" style={{ backgroundColor: style.bg }}>
      <div
        className="max-w-xs mx-auto p-6 rounded-xl"
        style={{
          backgroundColor: isDark ? `${style.surface}88` : '#fff',
          border: `1px solid ${style.secondary}22`,
          boxShadow: `0 4px 20px ${style.primary}08`,
        }}
      >
        <div className="text-center space-y-3">
          <p className="text-[10px] tracking-[0.25em] uppercase font-semibold" style={{ color: style.secondary }}>
            Queridos familiares y amigos
          </p>
          <div className="w-8 h-px mx-auto" style={{ backgroundColor: `${style.secondary}33` }} />
          <p className="text-sm leading-relaxed" style={{ color: style.textMuted }}>
            {data.historia || 'Nos conocimos y supimos que era para siempre. Cada momento juntos ha sido un capítulo hermoso que queremos compartir con ustedes.'}
          </p>
          <div className="pt-2">
            <p className="text-xs font-semibold" style={{ color: style.text }}>
              {data.novia || 'Ana'} <span style={{ color: style.secondary }}>&</span> {data.novio || 'Carlos'}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

function HighlightStory({ data, style }) {
  return (
    <section className="px-6 py-12 text-center" style={{ backgroundColor: `${style.primary}06` }}>
      <div className="max-w-xs mx-auto space-y-4">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="mx-auto" style={{ color: style.secondary }} opacity="0.4">
          <path d="M10 11H6l2-7H3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M21 11h-4l2-7h-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <p className="text-xs tracking-[0.2em] uppercase font-semibold" style={{ color: style.secondary }}>Nuestra Historia</p>
        <blockquote className="text-lg sm:text-xl font-bold leading-relaxed" style={{ color: style.text }}>
          &ldquo;{data.historia || 'Nos conocimos y supimos que era para siempre.'}&rdquo;
        </blockquote>
        <div className="flex items-center justify-center gap-3 pt-2">
          <div className="h-px w-8" style={{ backgroundColor: `${style.secondary}33` }} />
          <p className="text-xs font-medium" style={{ color: style.textMuted }}>
            {data.novia || 'Ana'} & {data.novio || 'Carlos'}
          </p>
          <div className="h-px w-8" style={{ backgroundColor: `${style.secondary}33` }} />
        </div>
      </div>
    </section>
  )
}

function MinimalStory({ data, style }) {
  return (
    <section className="px-6 py-10 text-center" style={{ backgroundColor: style.bg }}>
      <div className="max-w-xs mx-auto space-y-3">
        <p className="text-[9px] tracking-[0.3em] uppercase font-semibold" style={{ color: style.secondary }}>
          Nuestra Historia
        </p>
        <p className="text-sm leading-relaxed" style={{ color: style.textMuted }}>
          {data.historia || 'Nos conocimos y supimos que era para siempre.'}
        </p>
        <p className="text-xs font-medium" style={{ color: style.text }}>
          {data.novia || 'Ana'} <span style={{ color: style.secondary }}>&#183;</span> {data.novio || 'Carlos'}
        </p>
      </div>
    </section>
  )
}
