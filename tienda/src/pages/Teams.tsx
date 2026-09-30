import { getProductsByTeam, teams } from '../data'
import PageHeader from '../components/PageHeader'
import TeamCard from '../components/TeamCard'

export default function Teams() {
  return (
    <div>
      <PageHeader
        eyebrow="La parrilla"
        title="Escuderías"
        description="Las diez escuderías que dan vida a la Fórmula 1. Haz clic en cualquier equipo para ver todos sus modelos a escala disponibles."
      />

      <div className="mx-auto max-w-[1440px] px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {teams.map((team) => {
            const available = getProductsByTeam(team.name).filter((p) => p.stock > 0).length
            const total = getProductsByTeam(team.name).length
            return (
              <div key={team.id} className="group relative">
                <TeamCard team={team} />
                {available < total && (
                  <span className="absolute right-3 top-3 z-10 rounded-md bg-carbon-950/80 px-2 py-1 text-[10px] font-semibold text-amber-300 ring-1 ring-white/10 backdrop-blur-md">
                    {available}/{total} en stock
                  </span>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}