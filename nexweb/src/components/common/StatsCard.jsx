export default function StatsCard({ number, label, icon: Icon }) {
  return (
    <div className="group relative bg-white/[0.04] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-8 text-center hover:bg-white/[0.08] transition-all duration-500 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-blue-500/10">
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="relative">
        {Icon && (
          <div className="w-14 h-14 mx-auto mb-5 rounded-2xl bg-gradient-primary/20 flex items-center justify-center shadow-lg shadow-blue-500/10 group-hover:scale-110 group-hover:shadow-blue-500/20 transition-all duration-500">
            <Icon className="w-7 h-7 text-blue-400" />
          </div>
        )}
        <div className="text-4xl lg:text-5xl font-extrabold text-white mb-2 tracking-tight">{number}</div>
        <div className="text-gray-400 text-sm font-medium">{label}</div>
      </div>
    </div>
  )
}
