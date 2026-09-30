export default function Ornament({ color = '#C4956A', variant = 'filigree' }) {
  switch (variant) {
    case 'wreath':
      return (
        <svg viewBox="0 0 140 24" className="h-5 mx-auto" style={{ width: '130px' }}>
          <path d="M20,12 Q35,2 50,8 Q65,14 80,8 Q95,2 110,8 Q125,14 140,12" fill="none" stroke={color} strokeWidth="0.6" opacity="0.5" />
          <circle cx="20" cy="12" r="2" fill="none" stroke={color} strokeWidth="0.6" opacity="0.6" />
          <circle cx="140" cy="12" r="2" fill="none" stroke={color} strokeWidth="0.6" opacity="0.6" />
        </svg>
      )
    case 'geometric':
      return (
        <svg viewBox="0 0 120 16" className="h-4 mx-auto" style={{ width: '120px' }}>
          <polygon points="10,8 18,2 26,8 18,14" fill="none" stroke={color} strokeWidth="0.7" opacity="0.5" />
          <polygon points="47,8 55,2 63,8 55,14" fill="none" stroke={color} strokeWidth="0.7" opacity="0.5" />
          <polygon points="84,8 92,2 100,8 92,14" fill="none" stroke={color} strokeWidth="0.7" opacity="0.5" />
          <line x1="26" y1="8" x2="47" y2="8" stroke={color} strokeWidth="0.4" opacity="0.3" />
          <line x1="63" y1="8" x2="84" y2="8" stroke={color} strokeWidth="0.4" opacity="0.3" />
        </svg>
      )
    case 'floral':
      return (
        <svg viewBox="0 0 140 20" className="h-5 mx-auto" style={{ width: '130px' }}>
          <path d="M20,12 Q30,6 40,12 Q50,18 60,12 Q70,6 80,12 Q90,18 100,12 Q110,6 120,12" fill="none" stroke={color} strokeWidth="0.5" opacity="0.4" />
          {[20,60,100,140].map((x) => (
            <circle key={x} cx={x} cy="12" r="2.5" fill="none" stroke={color} strokeWidth="0.5" opacity="0.5" />
          ))}
          {[40,80,120].map((x) => (
            <circle key={x} cx={x} cy="12" r="1.5" fill={color} opacity="0.2" />
          ))}
        </svg>
      )
    case 'wave':
      return (
        <svg viewBox="0 0 140 14" className="h-4 mx-auto" style={{ width: '130px' }}>
          <path d="M0,7 C20,0 40,14 60,7 C80,0 100,14 120,7 C130,3.5 135,3.5 140,7" fill="none" stroke={color} strokeWidth="0.7" opacity="0.4" />
          <path d="M0,9 C20,2 40,16 60,9 C80,2 100,16 120,9 C130,5.5 135,5.5 140,9" fill="none" stroke={color} strokeWidth="0.4" opacity="0.2" />
        </svg>
      )
    case 'sun':
      return (
        <svg viewBox="0 0 100 20" className="h-5 mx-auto" style={{ width: '100px' }}>
          <circle cx="50" cy="8" r="5" fill="none" stroke={color} strokeWidth="0.7" opacity="0.5" />
          {[0,45,90,135,180,225,270,315].map((a) => {
            const rad = a * Math.PI / 180
            return <line key={a} x1={50 + Math.cos(rad)*6} y1={8 + Math.sin(rad)*6} x2={50 + Math.cos(rad)*12} y2={8 + Math.sin(rad)*12} stroke={color} strokeWidth="0.6" opacity="0.4" />
          })}
        </svg>
      )
    case 'constellation':
      return (
        <svg viewBox="0 0 140 14" className="h-4 mx-auto" style={{ width: '130px' }}>
          <line x1="10" y1="7" x2="35" y2="3" stroke={color} strokeWidth="0.4" opacity="0.4" />
          <line x1="35" y1="3" x2="65" y2="9" stroke={color} strokeWidth="0.4" opacity="0.4" />
          <line x1="65" y1="9" x2="95" y2="2" stroke={color} strokeWidth="0.4" opacity="0.4" />
          <line x1="95" y1="2" x2="130" y2="8" stroke={color} strokeWidth="0.4" opacity="0.4" />
          {[[10,7],[35,3],[65,9],[95,2],[130,8]].map(([cx,cy]) => (
            <circle key={`${cx}${cy}`} cx={cx} cy={cy} r="2" fill={color} opacity="0.6" />
          ))}
          <circle cx="15" cy="7" r="0.7" fill={color} opacity="0.3" />
          <circle cx="50" cy="5" r="0.7" fill={color} opacity="0.3" />
          <circle cx="80" cy="6" r="0.7" fill={color} opacity="0.3" />
          <circle cx="115" cy="4" r="0.7" fill={color} opacity="0.3" />
        </svg>
      )
    case 'line':
      return (
        <svg viewBox="0 0 80 8" className="h-3 mx-auto" style={{ width: '70px' }}>
          <line x1="0" y1="4" x2="32" y2="4" stroke={color} strokeWidth="0.5" opacity="0.4" />
          <circle cx="40" cy="4" r="1.5" fill={color} opacity="0.3" />
          <line x1="48" y1="4" x2="80" y2="4" stroke={color} strokeWidth="0.5" opacity="0.4" />
        </svg>
      )
    default:
      return (
        <svg viewBox="0 0 160 16" className="h-4 mx-auto" style={{ width: '140px' }}>
          <path d="M0,8 L55,8" stroke={color} strokeWidth="0.5" opacity="0.4" />
          <circle cx="60" cy="8" r="2.5" fill="none" stroke={color} strokeWidth="0.6" opacity="0.7" />
          <path d="M66,3 Q70,0 74,3 Q78,6 74,9 Q70,12 66,9 Q62,6 66,3" fill="none" stroke={color} strokeWidth="0.7" opacity="0.6" />
          <circle cx="80" cy="8" r="3" fill="none" stroke={color} strokeWidth="0.6" opacity="0.3" />
          <path d="M86,3 Q90,0 94,3 Q98,6 94,9 Q90,12 86,9 Q82,6 86,3" fill="none" stroke={color} strokeWidth="0.7" opacity="0.6" />
          <circle cx="100" cy="8" r="2.5" fill="none" stroke={color} strokeWidth="0.6" opacity="0.7" />
          <path d="M105,8 L160,8" stroke={color} strokeWidth="0.5" opacity="0.4" />
        </svg>
      )
  }
}
