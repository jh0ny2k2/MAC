import Countdown from './shared/Countdown'

const variants = {
  classic: ClassicHero,
  photo: PhotoHero,
  elegant: ElegantHero,
  bold: BoldHero,
}

function HeroDecor({ decor }) {
  switch (decor) {
    case 'damask':
      return (
        <div className="absolute inset-0 opacity-[0.04]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px',
        }} />
      )
    case 'woven':
      return (
        <div className="absolute inset-0 opacity-[0.05]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 10 L40 10 M10 0 L10 40 M30 0 L30 40 M0 30 L40 30' stroke='%23ffffff' stroke-width='0.5' fill='none'/%3E%3C/svg%3E")`,
          backgroundSize: '40px 40px',
        }} />
      )
    case 'grid':
      return (
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='30' height='30' viewBox='0 0 30 30' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='15' cy='15' r='1' fill='white'/%3E%3C/svg%3E")`,
          backgroundSize: '30px 30px',
        }} />
      )
    case 'dots':
      return (
        <div className="absolute inset-0 opacity-[0.04]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='12' cy='12' r='1.5' fill='white'/%3E%3C/svg%3E")`,
          backgroundSize: '24px 24px',
        }} />
      )
    case 'chevron':
      return (
        <div className="absolute inset-0 opacity-[0.04]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='30' viewBox='0 0 60 30' xmlns='http://www.w3.org/2000/svg'%3E%3Cpolygon points='30,0 60,15 30,30 0,15' fill='white' opacity='0.5'/%3E%3C/svg%3E")`,
          backgroundSize: '60px 30px',
        }} />
      )
    case 'leaves':
      return (
        <svg viewBox="0 0 300 400" className="absolute inset-0 w-full h-full opacity-[0.04]">
          {[0,1,2,3,4].map(i => {
            const y = 50 + i * 75
            return <path key={i} d={`M0,${y} Q75,${y-15} 150,${y} Q225,${y+15} 300,${y}`} fill="none" stroke="#fff" strokeWidth="1.5" />
          })}
        </svg>
      )
    case 'mandala':
      return (
        <div className="absolute top-0 left-0 right-0 h-3/5 flex items-start justify-center opacity-[0.06] overflow-hidden">
          <svg viewBox="0 0 120 100" className="w-full">
            <circle cx="60" cy="40" r="20" fill="none" stroke="#fff" strokeWidth="0.8" />
            <circle cx="60" cy="40" r="25" fill="none" stroke="#fff" strokeWidth="0.4" opacity="0.5" />
            {[0,1,2,3,4,5,6,7].map(i => {
              const a = i * Math.PI / 4
              return <line key={i} x1={60 + Math.cos(a)*27} y1={40 + Math.sin(a)*27} x2={60 + Math.cos(a)*55} y2={40 + Math.sin(a)*55} stroke="#fff" strokeWidth="0.6" opacity="0.4" />
            })}
          </svg>
        </div>
      )
    case 'stars':
      return (
        <svg viewBox="0 0 300 400" className="absolute inset-0 w-full h-full opacity-[0.08]">
          {[[50,40],[120,60],[200,50],[80,130],[150,110],[230,140],[60,220],[140,200],[220,230],[90,300],[160,280],[240,310]].map(([cx,cy], i) => (
            <circle key={i} cx={cx} cy={cy} r="2" fill="#fff" opacity="0.8" />
          ))}
          {[[50,40,120,60],[120,60,200,50],[50,40,80,130],[200,50,230,140],[80,130,150,110],[150,110,230,140],[60,220,140,200],[140,200,220,230],[60,220,90,300],[220,230,240,310],[90,300,160,280],[160,280,240,310]].map(([x1,y1,x2,y2], i) => (
            <line key={`l${i}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#fff" strokeWidth="0.4" opacity="0.3" />
          ))}
        </svg>
      )
    default:
      return null
  }
}

export default function HeroSection({ data, style }) {
  const variantId = data.heroStyle || 'classic'
  const VariantComponent = variants[variantId] || ClassicHero
  return <VariantComponent data={data} style={style} />
}

function ClassicHero({ data, style }) {
  const heroGrad = (() => {
    switch (style.id) {
      case 'gold-luxury': return `linear-gradient(180deg, ${style.primary} 0%, #000 100%)`
      case 'celestial': return `linear-gradient(180deg, ${style.primary} 0%, #0A0A20 100%)`
      case 'tropical-bliss': return `linear-gradient(135deg, ${style.primary} 0%, #1B4B3B 50%, ${style.primary} 100%)`
      case 'boho-chic': return `linear-gradient(180deg, ${style.primary} 0%, #A8503A 100%)`
      case 'moderno-minimal': return `linear-gradient(180deg, ${style.primary} 0%, #2A2A4E 100%)`
      default: return `linear-gradient(180deg, ${style.primary} 0%, ${style.primary}DD 100%)`
    }
  })()

  return (
    <section className="relative min-h-[400px] flex flex-col items-center justify-center text-center px-8 py-16" style={{ background: heroGrad }}>
      <HeroDecor decor={style.heroDecor} />
      <div className="relative z-10 space-y-6">
        <p className="text-xs tracking-[0.25em] uppercase" style={{ color: style.secondary, opacity: 0.8 }}>Save the Date</p>
        <h1 className="text-3xl sm:text-4xl font-bold leading-tight" style={{ color: '#fff' }}>
          {data.novia || 'Ana'}
          {(data.novia || data.novio) && <><span className="block text-sm font-normal mt-2 tracking-[0.2em]" style={{ color: style.secondary }}>&#10022;</span></>}
          {data.novio || 'Carlos'}
        </h1>
        <div className="w-12 h-px mx-auto" style={{ backgroundColor: style.secondary, opacity: 0.4 }} />
        <p className="text-sm tracking-[0.15em]" style={{ color: 'rgba(255,255,255,0.7)' }}>
          {data.fecha || '15 de Junio de 2026'}
        </p>
        {data.fecha && <div className="pt-2"><Countdown targetDate={data.fecha} /></div>}
      </div>
      <div className="absolute bottom-6 left-0 right-0 flex justify-center" style={{ animation: 'bounce 3s infinite' }}>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M8 3v10M8 13l4-4M8 13l-4-4" stroke={style.secondary} strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" opacity="0.5" />
        </svg>
      </div>
    </section>
  )
}

function PhotoHero({ data, style }) {
  const imgUrl = data.heroImg || 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&q=80'
  return (
    <section className="relative min-h-[420px] flex flex-col items-center justify-center text-center px-8 py-16 overflow-hidden">
      <div className="absolute inset-0">
        <img src={imgUrl} alt="" className="w-full h-full object-cover" loading="lazy" />
        <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, ${style.primary}CC 0%, ${style.primary}99 50%, ${style.primary}DD 100%)` }} />
      </div>
      <HeroDecor decor={style.heroDecor} />
      <div className="relative z-10 space-y-5">
        <p className="text-xs tracking-[0.25em] uppercase" style={{ color: style.secondary, opacity: 0.9 }}>Save the Date</p>
        <h1 className="text-3xl sm:text-4xl font-bold leading-tight" style={{ color: '#fff' }}>
          {data.novia || 'Ana'} <span className="inline-block text-lg font-normal mx-2 align-middle" style={{ color: style.secondary }}>&#10022;</span> {data.novio || 'Carlos'}
        </h1>
        <div className="w-16 h-px mx-auto" style={{ backgroundColor: style.secondary, opacity: 0.5 }} />
        <p className="text-sm tracking-[0.15em]" style={{ color: 'rgba(255,255,255,0.85)' }}>
          {data.fecha || '15 de Junio de 2026'}
        </p>
        {data.fecha && <div className="pt-2"><Countdown targetDate={data.fecha} /></div>}
      </div>
    </section>
  )
}

function ElegantHero({ data, style }) {
  const isDark = style.id === 'gold-luxury' || style.id === 'celestial'
  return (
    <section
      className="relative min-h-[380px] flex flex-col items-center justify-center text-center px-8 py-16"
      style={{ backgroundColor: style.bg }}
    >
      <div className="absolute top-0 left-0 right-0 h-1" style={{ background: `linear-gradient(90deg, transparent, ${style.secondary}44, transparent)` }} />
      <div className="relative z-10 space-y-8">
        <div className="space-y-3">
          <p className="text-[10px] tracking-[0.3em] uppercase" style={{ color: style.secondary }}>Save the Date</p>
          <div className="flex items-center justify-center gap-4">
            <div className="flex-1 h-px max-w-[60px]" style={{ backgroundColor: `${style.secondary}33` }} />
            <svg width="8" height="8" viewBox="0 0 8 8" fill="none"><circle cx="4" cy="4" r="3" fill={style.secondary} opacity="0.3" /></svg>
            <div className="flex-1 h-px max-w-[60px]" style={{ backgroundColor: `${style.secondary}33` }} />
          </div>
        </div>
        <div className="space-y-2">
          <p className="text-2xl sm:text-3xl font-light tracking-[0.15em]" style={{ color: style.text }}>{data.novia || 'Ana'}</p>
          <p className="text-sm tracking-[0.3em] uppercase" style={{ color: style.secondary }}>&#38;</p>
          <p className="text-2xl sm:text-3xl font-light tracking-[0.15em]" style={{ color: style.text }}>{data.novio || 'Carlos'}</p>
        </div>
        <div className="w-12 h-px mx-auto" style={{ backgroundColor: style.secondary, opacity: 0.3 }} />
        <p className="text-sm tracking-[0.15em]" style={{ color: style.textMuted }}>
          {data.fecha || '15 de Junio de 2026'}
        </p>
        {data.fecha && <div className="pt-2"><Countdown targetDate={data.fecha} textColor={style.text} mutedColor={style.textMuted} /></div>}
      </div>
    </section>
  )
}

function BoldHero({ data, style }) {
  return (
    <section
      className="relative min-h-[420px] flex flex-col items-center justify-center text-center px-8 py-16 overflow-hidden"
      style={{ backgroundColor: style.primary }}
    >
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Crect x='10' y='10' width='80' height='80' fill='none' stroke='white' stroke-width='0.5'/%3E%3C/svg%3E")`,
        backgroundSize: '100px 100px',
      }} />
      <div className="relative z-10 space-y-8">
        <div className="relative inline-block px-8 py-4 border-2" style={{ borderColor: style.secondary }}>
          <p className="text-[9px] tracking-[0.35em] uppercase font-semibold" style={{ color: style.secondary }}>Save the Date</p>
          <h1 className="text-4xl sm:text-5xl font-black leading-none mt-3 tracking-tight" style={{ color: '#fff' }}>
            {data.novia || 'Ana'} <span className="inline-block text-2xl align-middle px-1" style={{ color: style.secondary }}>&</span> {data.novio || 'Carlos'}
          </h1>
        </div>
        <div className="space-y-2">
          <div className="w-8 h-0.5 mx-auto" style={{ backgroundColor: style.secondary }} />
          <p className="text-base tracking-[0.2em] font-semibold" style={{ color: style.secondary }}>
            {data.fecha || '15 DE JUNIO DE 2026'}
          </p>
        </div>
        {data.fecha && <div className="pt-2"><Countdown targetDate={data.fecha} /></div>}
      </div>
    </section>
  )
}
