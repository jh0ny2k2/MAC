import { Link } from 'react-router-dom'
import type { Team } from '../types'
import { getProductsByTeam } from '../data'

interface TeamCardProps {
  team: Team
}

export default function TeamCard({ team }: TeamCardProps) {
  const productCount = getProductsByTeam(team.name).length

  return (
    <Link
      to={`/tienda?team=${team.id}`}
      className="group relative overflow-hidden rounded-2xl border border-carbon-800 bg-carbon-900 transition-all duration-500 hover:-translate-y-1 hover:border-carbon-600 hover:shadow-2xl hover:shadow-black/50"
    >
      <div className="relative aspect-square overflow-hidden">
        <img
          src={team.logo}
          alt={`Logo de ${team.name}`}
          loading="lazy"
          className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-carbon-950 via-carbon-950/20 to-transparent" />
        <span
          className="absolute right-4 top-4 rounded-md px-2 py-1 text-[11px] font-bold text-white"
          style={{ backgroundColor: team.color }}
        >
          {team.code}
        </span>
      </div>

      <div className="relative -mt-16 p-5">
        <h3 className="font-display text-xl font-semibold uppercase tracking-wide text-white">
          {team.name}
        </h3>
        <p className="mt-1 flex items-center gap-2 text-xs text-carbon-400">
          <span>{team.country}</span>
          <span className="text-carbon-600">•</span>
          <span>Fundada en {team.founded}</span>
          <span className="text-carbon-600">•</span>
          <span>{team.titles} títulos</span>
        </p>
        <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-carbon-400">{team.description}</p>
        <div className="mt-4 flex items-center justify-between border-t border-carbon-800 pt-4">
          <span className="text-sm font-medium text-carbon-300">
            {productCount} {productCount === 1 ? 'modelo' : 'modelos'}
          </span>
          <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-f1-500 transition-all duration-300 group-hover:gap-3">
            Ver colección
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </div>
      </div>
    </Link>
  )
}