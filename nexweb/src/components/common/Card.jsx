export default function Card({ children, className = '', hover = true, glow = false }) {
  return (
    <div className={`bg-[#141414] rounded-xl transition-all duration-300 ${
      hover ? 'hover:shadow-card-hover hover:-translate-y-1' : ''
    } ${
      glow ? 'shadow-lg shadow-[#f5b342]/5' : 'shadow-card'
    } border border-[#1e1e1e] ${className}`}>
      {children}
    </div>
  )
}
