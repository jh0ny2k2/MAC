import { Heart, Star, Leaf } from 'lucide-react'

function getFont(font) {
  return font === 'script' ? "'Georgia', 'Times New Roman', serif"
    : font === 'sans' ? "'Inter', system-ui, sans-serif"
    : "'Georgia', 'Times New Roman', serif"
}

const isDark = (id) => id === 'gold-luxury' || id === 'celestial'

function Badge({ d, secondary, primary }) {
  if (!d.badge) return null
  return (
    <div className="absolute top-4 right-4 z-10">
      <span
        className="text-[9px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-sm"
        style={{
          backgroundColor: isDark(d.id) ? secondary : primary,
          color: isDark(d.id) ? primary : '#fff',
        }}
      >
        {d.badge}
      </span>
    </div>
  )
}

export default function DesignCardPreview({ design, size = 'sm' }) {
  const d = design
  const { primary, secondary, text } = d.colors
  const isSmall = size === 'sm'
  const textSm = isSmall ? 'text-[10px]' : 'text-xs'
  const titleSm = isSmall ? 'text-xl sm:text-2xl' : 'text-2xl sm:text-3xl'
  const heartSm = isSmall ? 'w-4 h-4' : 'w-5 h-5'

  const base = "relative w-full overflow-hidden bg-white shadow-lg"
  const rounded = isSmall ? 'rounded-[2rem]' : 'rounded-3xl'
  const aspect = 'aspect-[3/4]'

  switch (d.layout) {
    case 'ornate-frame':
      return (
        <div className={`${base} ${rounded} ${aspect}`}>
          <div className="absolute inset-3 rounded-[1.5rem] border-2" style={{ borderColor: secondary, opacity: 0.5 }} />
          <div className="absolute inset-4 rounded-[1.4rem] border" style={{ borderColor: secondary, opacity: 0.2 }} />
          <div style={{ background: `linear-gradient(135deg, ${d.colors.bg}, ${d.colors.bg}DD)` }} className="absolute inset-0" />
          <div className="absolute top-5 left-5 right-5 flex justify-center opacity-30">
            <svg viewBox="0 0 120 12" className="h-3" style={{ width: isSmall ? '100px' : '140px' }}>
              <path d="M0,6 L35,6" stroke={secondary} strokeWidth="0.5" opacity="0.6" />
              <circle cx="40" cy="6" r="2" fill="none" stroke={secondary} strokeWidth="0.6" opacity="0.8" />
              <path d="M45,2 Q50,0 55,2 Q60,4 55,6 Q50,8 45,6 Q40,4 45,2" fill="none" stroke={secondary} strokeWidth="0.6" opacity="0.6" />
              <circle cx="60" cy="6" r="2" fill="none" stroke={secondary} strokeWidth="0.6" opacity="0.8" />
              <path d="M65,6 L120,6" stroke={secondary} strokeWidth="0.5" opacity="0.6" />
            </svg>
          </div>
          <div className="absolute inset-0 flex flex-col items-center justify-center px-10">
            <p className={`${textSm} tracking-[0.3em] uppercase mb-3`} style={{ color: secondary }}>Save the Date</p>
            <h3 className={`${titleSm} font-bold text-center leading-tight mb-2`} style={{ color: text, fontFamily: getFont(d.font) }}>Nuestra Boda</h3>
            <div className="w-10 h-px my-3" style={{ backgroundColor: secondary, opacity: 0.4 }} />
            <p className={`${textSm} tracking-[0.15em]`} style={{ color: text, opacity: 0.7 }}>15 · Junio · 2026</p>
          </div>
          <div className="absolute bottom-5 left-5 right-5 flex justify-center opacity-20">
            <Heart className={heartSm} style={{ color: secondary }} />
          </div>
          <Badge d={d} secondary={secondary} primary={primary} />
        </div>
      )

    case 'botanical-wreath':
      return (
        <div className={`${base} ${rounded} ${aspect}`}>
          <div style={{ background: `linear-gradient(180deg, ${d.colors.bg}, #EDE8DF)` }} className="absolute inset-0" />
          <div className="absolute inset-4 flex items-center justify-center">
            <svg viewBox="0 0 200 260" className="w-full h-full opacity-25">
              <path d="M100,10 C60,10 20,40 20,80 C20,130 60,160 100,250 C140,160 180,130 180,80 C180,40 140,10 100,10Z" fill="none" stroke={secondary} strokeWidth="1.5" opacity="0.7" />
              <path d="M100,20 C65,20 30,45 30,80 C30,125 65,150 100,230 C135,150 170,125 170,80 C170,45 135,20 100,20Z" fill="none" stroke={secondary} strokeWidth="0.8" opacity="0.4" />
            </svg>
          </div>
          <div className="absolute inset-0 flex flex-col items-center justify-center px-8">
            <p className={`${textSm} tracking-[0.3em] uppercase mb-2`} style={{ color: secondary }}>Save the Date</p>
            <h3 className={`${titleSm} font-bold text-center leading-tight`} style={{ color: text, fontFamily: getFont(d.font) }}>Nuestra Boda</h3>
            <div className="w-8 h-px my-3" style={{ backgroundColor: secondary, opacity: 0.5 }} />
            <p className={`${textSm} tracking-[0.15em]`} style={{ color: text, opacity: 0.7 }}>15 · Junio · 2026</p>
          </div>
          <Badge d={d} secondary={secondary} primary={primary} />
        </div>
      )

    case 'asymmetric-geo':
      return (
        <div className={`${base} ${rounded} ${aspect}`}>
          <div style={{ background: `linear-gradient(135deg, ${d.colors.bg}, #F0F0F5)` }} className="absolute inset-0" />
          <div className="absolute -top-16 -left-16 w-40 h-40 rounded-full opacity-[0.06]" style={{ backgroundColor: primary }} />
          <div className="absolute -bottom-12 -right-12 w-32 h-32 rounded-full opacity-[0.04]" style={{ backgroundColor: primary }} />
          <div className="absolute inset-0 flex flex-col items-end justify-center px-8 pr-12">
            <p className={`${textSm} tracking-[0.35em] uppercase mb-2`} style={{ color: secondary, opacity: 0.7 }}>Save the Date</p>
            <h3 className={`${isSmall ? 'text-2xl' : 'text-3xl'} font-bold text-right leading-tight`} style={{ color: text, fontFamily: getFont(d.font) }}>Nuestra<br />Boda</h3>
            <div className="w-8 h-px my-2 ml-auto" style={{ backgroundColor: primary, opacity: 0.2 }} />
            <p className={`${textSm} tracking-[0.15em] text-right`} style={{ color: text, opacity: 0.6 }}>15 · Junio · 2026</p>
          </div>
          <Badge d={d} secondary={secondary} primary={primary} />
        </div>
      )

    case 'floral-corners':
      return (
        <div className={`${base} ${rounded} ${aspect}`}>
          <div style={{ background: `linear-gradient(135deg, ${d.colors.bg}, #F5E8EC)` }} className="absolute inset-0" />
          <svg viewBox="0 0 300 400" className="absolute inset-0 w-full h-full opacity-25">
            <path d="M20,20 Q50,0 80,20 Q100,50 80,80 Q50,100 20,80 Q0,50 20,20Z" fill={secondary} />
            <path d="M280,20 Q250,0 220,20 Q200,50 220,80 Q250,100 280,80 Q300,50 280,20Z" fill={secondary} />
            <path d="M20,380 Q50,400 80,380 Q100,350 80,320 Q50,300 20,320 Q0,350 20,380Z" fill={secondary} />
            <path d="M280,380 Q250,400 220,380 Q200,350 220,320 Q250,300 280,320 Q300,350 280,380Z" fill={secondary} />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center px-8">
            <p className={`${textSm} tracking-[0.3em] uppercase mb-2`} style={{ color: secondary, opacity: 0.8 }}>Save the Date</p>
            <h3 className={`${titleSm} text-center leading-tight italic`} style={{ color: text, fontFamily: getFont(d.font) }}>Nuestra Boda</h3>
            <div className="w-12 h-px my-3" style={{ backgroundColor: secondary, opacity: 0.3 }} />
            <p className={`${textSm} tracking-[0.15em]`} style={{ color: text, opacity: 0.6 }}>15 · Junio · 2026</p>
          </div>
          <Badge d={d} secondary={secondary} primary={primary} />
        </div>
      )

    case 'art-deco-dark':
      return (
        <div className={`${base} ${rounded} ${aspect}`}>
          <div style={{ background: `linear-gradient(180deg, ${primary}, #000)` }} className="absolute inset-0" />
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M50 0 L100 50 L50 100 L0 50Z' fill='none' stroke='${encodeURIComponent(secondary)}' stroke-width='0.5'/%3E%3C/svg%3E")`,
            backgroundSize: '50px 50px',
          }} />
          <svg viewBox="0 0 300 400" className="absolute inset-0 w-full h-full opacity-15">
            <path d="M0,0 L80,0 L150,40 L220,0 L300,0 L300,60 L230,100 L300,140 L300,200 L220,180 L150,220 L80,180 L0,200 L0,140 L70,100 L0,60Z" fill={secondary} opacity="0.3" />
            <path d="M0,400 L80,400 L150,360 L220,400 L300,400 L300,340 L230,300 L300,260 L300,200 L220,220 L150,180 L80,220 L0,200 L0,260 L70,300 L0,340Z" fill={secondary} opacity="0.3" />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center px-10">
            <div className="w-16 h-px mb-4" style={{ backgroundColor: secondary, opacity: 0.5 }} />
            <p className={`${textSm} tracking-[0.4em] uppercase mb-3`} style={{ color: secondary, opacity: 0.8 }}>Save the Date</p>
            <h3 className={`${titleSm} font-bold text-center leading-tight text-white`} style={{ fontFamily: getFont(d.font) }}>Nuestra<br />Boda</h3>
            <div className="w-10 h-px my-3" style={{ backgroundColor: secondary, opacity: 0.4 }} />
            <p className={`${textSm} tracking-[0.15em]`} style={{ color: secondary, opacity: 0.7 }}>15 · Junio · 2026</p>
            <div className="w-16 h-px mt-4" style={{ backgroundColor: secondary, opacity: 0.5 }} />
          </div>
          <Badge d={d} secondary={secondary} primary={primary} />
        </div>
      )

    case 'split-diagonal':
      return (
        <div className={`${base} ${rounded} ${aspect}`}>
          <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${primary} 0%, ${primary} 50%, ${secondary} 50%, ${secondary} 100%)` }} />
          <svg viewBox="0 0 300 400" className="absolute inset-0 w-full h-full opacity-10">
            {[0,1,2,3,4].map(i => {
              const y = 50 + i * 75
              return <path key={i} d={`M0,${y} Q75,${y-15} 150,${y} Q225,${y+15} 300,${y}`} fill="none" stroke="#fff" strokeWidth="1.5" />
            })}
          </svg>
          <div className="absolute top-6 left-6"><Leaf className="w-5 h-5 text-white/30" /></div>
          <div className="absolute bottom-6 right-6"><Leaf className="w-5 h-5 text-white/30" /></div>
          <div className="absolute inset-0 flex flex-col items-center justify-center px-8">
            <p className={`${textSm} tracking-[0.3em] uppercase mb-2 text-white/70`}>Save the Date</p>
            <h3 className={`${titleSm} font-bold text-center leading-tight text-white`} style={{ fontFamily: getFont(d.font), textShadow: '0 1px 3px rgba(0,0,0,0.2)' }}>Nuestra Boda</h3>
            <div className="w-8 h-px my-3 bg-white/30" />
            <p className={`${textSm} tracking-[0.15em] text-white/70`}>15 · Junio · 2026</p>
          </div>
          <Badge d={d} secondary={secondary} primary={primary} />
        </div>
      )

    case 'mandala-sun':
      return (
        <div className={`${base} ${rounded} ${aspect}`}>
          <div style={{ background: `linear-gradient(180deg, ${d.colors.bg}, #F0E8DA)` }} className="absolute inset-0" />
          <div className="absolute top-0 left-0 right-0 h-2/5 flex items-start justify-center pt-4">
            <svg viewBox="0 0 120 80" className="w-full opacity-20" preserveAspectRatio="xMidYMin meet">
              <circle cx="60" cy="30" r="15" fill="none" stroke={secondary} strokeWidth="1" />
              <circle cx="60" cy="30" r="20" fill="none" stroke={secondary} strokeWidth="0.5" opacity="0.5" />
              {[0,1,2,3,4,5,6,7].map(i => {
                const a = i * Math.PI / 4
                return <line key={i} x1={60 + Math.cos(a)*22} y1={30 + Math.sin(a)*22} x2={60 + Math.cos(a)*50} y2={30 + Math.sin(a)*50} stroke={secondary} strokeWidth="0.8" opacity="0.4" />
              })}
            </svg>
          </div>
          <div className="absolute inset-0 flex flex-col items-center justify-center px-8 pt-6">
            <p className={`${textSm} tracking-[0.3em] uppercase mb-2`} style={{ color: secondary, opacity: 0.8 }}>Save the Date</p>
            <h3 className={`${titleSm} text-center leading-tight italic`} style={{ color: text, fontFamily: getFont(d.font) }}>Nuestra Boda</h3>
            <div className="w-10 h-px my-3" style={{ backgroundColor: secondary, opacity: 0.4 }} />
            <p className={`${textSm} tracking-[0.15em]`} style={{ color: text, opacity: 0.7 }}>15 · Junio · 2026</p>
          </div>
          <Badge d={d} secondary={secondary} primary={primary} />
        </div>
      )

    case 'constellation':
      return (
        <div className={`${base} ${rounded} ${aspect}`}>
          <div style={{ background: `linear-gradient(180deg, ${primary}, #0A0A20)` }} className="absolute inset-0" />
          <svg viewBox="0 0 300 400" className="absolute inset-0 w-full h-full opacity-25">
            {[[50,40,80,70],[120,60,150,90],[200,50,170,80],[50,150,90,130],[120,140,160,160],[200,150,180,120],
              [60,220,100,200],[140,210,120,240],[220,220,250,200],[80,280,110,300],[150,290,180,270],[230,300,200,280]].map(([x1,y1,x2,y2], i) => (
              <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={secondary} strokeWidth="0.5" opacity="0.5" />
            ))}
            {[[50,40],[80,70],[120,60],[150,90],[200,50],[170,80],[50,150],[90,130],[120,140],[160,160],[200,150],[180,120],
              [60,220],[100,200],[140,210],[120,240],[220,220],[250,200],[80,280],[110,300],[150,290],[180,270],[230,300],[200,280]].map(([cx,cy], i) => (
              <circle key={i} cx={cx} cy={cy} r="2.5" fill={secondary} opacity="0.8" />
            ))}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center px-10">
            <div className="mb-2 flex gap-1 opacity-50">
              {[1,2,3].map(i => <Star key={i} className="w-2.5 h-2.5" style={{ color: secondary }} />)}
            </div>
            <p className={`${textSm} tracking-[0.4em] uppercase mb-2`} style={{ color: secondary, opacity: 0.7 }}>Save the Date</p>
            <h3 className={`${titleSm} font-bold text-center leading-tight text-white`} style={{ fontFamily: getFont(d.font), textShadow: '0 0 20px rgba(168,181,224,0.3)' }}>Nuestra Boda</h3>
            <div className="w-8 h-px my-3" style={{ backgroundColor: secondary, opacity: 0.3 }} />
            <p className={`${textSm} tracking-[0.15em]`} style={{ color: secondary, opacity: 0.6 }}>15 · Junio · 2026</p>
          </div>
          <Badge d={d} secondary={secondary} primary={primary} />
        </div>
      )

    default:
      return null
  }
}
