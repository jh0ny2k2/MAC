import { drivers } from '../data'
import PageHeader from '../components/PageHeader'
import DriverCard from '../components/DriverCard'

export default function Drivers() {
  return (
    <div>
      <PageHeader
        eyebrow="Leyendas del paddock"
        title="Pilotos"
        description="Los nombres que han escrito la historia de la Fórmula 1. Haz clic en cualquier piloto para descubrir sus modelos a escala."
      />

      <div className="mx-auto max-w-[1440px] px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {drivers.map((driver) => (
            <DriverCard key={driver.id} driver={driver} />
          ))}
        </div>
      </div>
    </div>
  )
}