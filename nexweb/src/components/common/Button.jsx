import { Link } from 'react-router-dom'

export default function Button({ children, to, variant = 'primary', size = 'md', icon: Icon, className = '', ...props }) {
  const base = 'inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-200 active:scale-[0.97] group relative overflow-hidden'

  const variants = {
    primary: 'text-[#0a0a0a] bg-gradient-accent shadow-lg shadow-[#f5b342]/20 hover:shadow-xl hover:shadow-[#f5b342]/30 hover:-translate-y-0.5',
    outline: 'border border-[#2a2a2a] text-[#8a8682] hover:bg-white/5 hover:text-white hover:border-[#f5b342]/40 hover:-translate-y-0.5',
    ghost: 'text-[#5a5652] hover:bg-white/5 hover:text-white',
    subtle: 'text-[#f5b342] bg-[#f5b342]/10 hover:bg-[#f5b342]/20 hover:-translate-y-0.5',
  }

  const sizes = {
    sm: 'px-4 py-2 text-sm gap-1.5',
    md: 'px-6 py-3 text-sm gap-2',
    lg: 'px-7 py-3.5 text-sm gap-2.5',
    xl: 'px-8 py-4 text-base gap-2.5',
  }

  const classes = `${base} ${variants[variant]} ${sizes[size]} ${className}`

  const content = (
    <>
      {variant === 'primary' && (
        <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
      )}
      <span className="relative z-[1]">{children}</span>
      {Icon && <Icon className="w-4 h-4 relative z-[1] transition-transform duration-200 group-hover:translate-x-0.5" />}
    </>
  )

  if (to) {
    return (
      <Link to={to} className={classes} {...props}>
        {content}
      </Link>
    )
  }

  return (
    <button className={classes} {...props}>
      {content}
    </button>
  )
}
