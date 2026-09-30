export default function SectionTitle({ title, subtitle, light = false, center = true, badge }) {
  return (
    <div className={`max-w-2xl ${center ? 'mx-auto text-center' : ''} mb-12 lg:mb-16`}>
      {badge && (
        <span className="inline-block text-xs font-semibold uppercase tracking-[0.2em] mb-4 px-4 py-1.5 rounded-full text-[#f5b342] bg-[#f5b342]/10 border border-[#f5b342]/20">
          {badge}
        </span>
      )}
      <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-display font-bold leading-tight tracking-tight ${
        light ? 'text-white' : 'text-[#f0ede8]'
      }`}>
        {title}
      </h2>
      {subtitle && (
        <p className={`mt-4 text-lg leading-relaxed font-body ${light ? 'text-[#5a5652]' : 'text-[#5a5652]'}`}>
          {subtitle}
        </p>
      )}
    </div>
  )
}
