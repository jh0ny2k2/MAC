import { Star } from 'lucide-react'

export default function TestimonialCard({ name, role, text, rating, initials }) {
  const initialsText = initials || name.split(' ').map(n => n[0]).join('').slice(0, 2)

  return (
    <div className="group relative p-8 rounded-xl transition-all duration-500 active:scale-[0.98] bg-[#141414] border border-[#1e1e1e] shadow-card hover:shadow-card-hover hover:-translate-y-1">
      <div className="absolute top-6 right-6 text-5xl font-serif leading-none select-none text-[#f5b342]/5">&ldquo;</div>
      <div className="flex gap-1 mb-4 relative">
        {Array.from({ length: rating }, (_, i) => (
          <Star key={i} className="w-4 h-4 fill-current text-[#f5b342]" />
        ))}
      </div>
      <p className="leading-relaxed mb-6 relative text-sm text-[#8a8682]">
        &ldquo;{text}&rdquo;
      </p>
      <div className="flex items-center gap-3 pt-5 border-t border-[#1e1e1e]">
        <div className="w-10 h-10 rounded-full flex items-center justify-center text-[#0a0a0a] font-bold text-sm shadow-lg shrink-0 bg-gradient-accent shadow-[#f5b342]/20">
          {initialsText}
        </div>
        <div className="min-w-0">
          <p className="font-semibold text-sm truncate text-[#f0ede8]">{name}</p>
          <p className="text-xs truncate text-[#5a5652]">{role}</p>
        </div>
      </div>
    </div>
  )
}
