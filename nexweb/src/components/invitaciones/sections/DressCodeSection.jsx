import Ornament from './shared/Ornament'

const variants = {
  classic: ClassicDressCode,
  icons: IconsDressCode,
  palette: PaletteDressCode,
  minimal: MinimalDressCode,
}

export default function DressCodeSection({ data, style }) {
  const variantId = data.dresscodeStyle || 'classic'
  const VariantComponent = variants[variantId] || ClassicDressCode
  return <VariantComponent data={data} style={style} />
}

function ClassicDressCode({ data, style }) {
  const isDark = style.id === 'gold-luxury'
  return (
    <section className="py-10 px-6" style={{ backgroundColor: isDark ? style.surface : `${style.primary}04` }}>
      <div className="text-center space-y-4 max-w-xs mx-auto">
        <Ornament color={style.secondary} variant={style.ornament} />
        <p className="text-xs tracking-[0.2em] uppercase" style={{ color: style.secondary }}>Código de Vestimenta</p>
        <p className="text-sm leading-relaxed" style={{ color: style.textMuted }}>
          {data.dress_code || 'Formal: Traje y corbata para ellos, vestido largo para ellas.'}
        </p>
        <div className="flex justify-center gap-3 pt-2">
          {[style.primary, style.secondary, '#8BA888', '#2C1810', '#D4A5B5'].map((c) => (
            <div key={c} className="w-5 h-5 rounded-full border-2 border-white shadow-sm" style={{ backgroundColor: c }} />
          ))}
        </div>
      </div>
    </section>
  )
}

function IconsDressCode({ data, style }) {
  const isDark = style.id === 'gold-luxury' || style.id === 'celestial'
  return (
    <section className="py-10 px-6" style={{ backgroundColor: style.bg }}>
      <div className="text-center space-y-5 max-w-xs mx-auto">
        <p className="text-xs tracking-[0.2em] uppercase" style={{ color: style.secondary }}>Código de Vestimenta</p>
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: 'M6 4h12v4H6zM8 12h8v8H8z', label: 'Traje' },
            { icon: 'M4 8h16v4H4zM12 4v4M8 16h8', label: 'Vestido' },
            { icon: 'M12 4a4 4 0 00-4 4v4h8V8a4 4 0 00-4-4zM6 16h12', label: 'Zapatos' },
          ].map((item) => (
            <div key={item.label} className="p-3 rounded-xl" style={{ backgroundColor: isDark ? `${style.surface}88` : `${style.primary}06`, border: `1px solid ${style.secondary}15` }}>
              <svg viewBox="0 0 24 24" fill="none" stroke={style.secondary} strokeWidth="1.5" className="w-6 h-6 mx-auto mb-1"><path d={item.icon} /></svg>
              <p className="text-[9px] font-medium" style={{ color: style.textMuted }}>{item.label}</p>
            </div>
          ))}
        </div>
        <p className="text-xs leading-relaxed" style={{ color: style.textMuted }}>
          {data.dress_code || 'Formal: Traje y corbata para ellos, vestido largo para ellas.'}
        </p>
      </div>
    </section>
  )
}

function PaletteDressCode({ data, style }) {
  return (
    <section className="py-10 px-6" style={{ backgroundColor: `${style.primary}04` }}>
      <div className="text-center space-y-5 max-w-xs mx-auto">
        <p className="text-xs tracking-[0.2em] uppercase" style={{ color: style.secondary }}>Código de Vestimenta</p>
        <p className="text-sm leading-relaxed" style={{ color: style.textMuted }}>
          {data.dress_code || 'Formal: Traje y corbata para ellos, vestido largo para ellas.'}
        </p>
        <div className="space-y-2">
          <p className="text-[9px] uppercase tracking-wider font-medium" style={{ color: style.textMuted }}>Colores sugeridos</p>
          <div className="flex flex-wrap justify-center gap-2">
            {[style.primary, style.secondary, '#8BA888', '#2C1810', '#D4A5B5', '#C4956A', '#5C3D2E', '#B0B0C0'].map((c) => (
              <div key={c} className="w-8 h-8 rounded-lg shadow-sm" style={{ backgroundColor: c }} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function MinimalDressCode({ data, style }) {
  return (
    <section className="py-10 px-6 text-center" style={{ backgroundColor: style.bg }}>
      <div className="max-w-xs mx-auto space-y-3">
        <p className="text-[9px] tracking-[0.3em] uppercase font-semibold" style={{ color: style.secondary }}>Vestimenta</p>
        <p className="text-sm italic leading-relaxed" style={{ color: style.textMuted }}>
          &ldquo;{data.dress_code || 'Formal: Traje y corbata para ellos, vestido largo para ellas.'}&rdquo;
        </p>
      </div>
    </section>
  )
}
