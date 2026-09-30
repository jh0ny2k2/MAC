import { BadgeCheck, Flag, Headset, Package, Compass, Sparkles } from 'lucide-react'
import { products, teams, drivers } from '../data'
import PageHeader from '../components/PageHeader'

const SECTIONS = [
  {
    icon: Flag,
    title: 'Nuestra historia',
    text: 'APEX F1 Collection nació en 2019 en un pequeño taller de Madrid, entre los humos de una mesa de trabajo cubierta de modelos desmontados. Lo que comenzó como la pasión de tres coleccionistas por conseguir la réplica perfecta del MP4/4 de Senna, se convirtió en una de las tiendas europeas de referencia en coleccionismo de Fórmula 1 a escala.',
  },
  {
    icon: Compass,
    title: 'Nuestra filosofía',
    text: 'Creemos que un modelo a escala no es un juguete: es una cápsula del tiempo que captura una vuelta mágica, un duelo épico o un título legendario. Por eso elegimos cada pieza con el mismo criterio que usaría un comisario de museo. Nada pasa a nuestro catálogo si no despierta una emoción real.',
  },
  {
    icon: BadgeCheck,
    title: 'Calidad sin concesiones',
    text: 'Trabajamos únicamente con fabricantes licenciados como MINICHAMPS, Spark, Bburago o Amalgam. Cada modelo pasa un control de calidad fotográfico antes de enviarse: verificamos alerones, deco, pintura y funcionalidad de ruedas. La pieza que recibes es la misma que tú aprobarías.',
  },
  {
    icon: Sparkles,
    title: 'Una comunidad de coleccionistas',
    text: 'Más de 12.000 coleccionistas confían en nosotros, desde expertos que persiguen ediciones numeradas hasta familias que regalan su primer 1:43. Publicamos guías de coleccionismo, aconsejamos escalas y ayudamos a elegir el siguiente coche de tu vitrina.',
  },
  {
    icon: Package,
    title: 'Envíos protegidos como trofeos',
    text: 'Cada pedido viaja en doble embalaje: la caja de coleccionista original protegida por un cartón reforzado y film de burbujas. Enviamos a toda la península en 24-48h y al resto del mundo con seguimiento. Si algo llegara dañado, te lo cambiamos sin preguntas.',
  },
  {
    icon: Headset,
    title: 'Atención al cliente de boxes',
    text: 'Nuestro equipo responde en menos de 24 horas laborables, como una parada en boxes impecable. Dudas de stock, piezas sueltas, devoluciones o asesoramiento para empezar tu colección: estamos a una llamada de distancia.',
  },
]

const MILESTONES = [
  { value: '2019', label: 'Año de fundación' },
  { value: `${products.length}+`, label: 'Modelos en catálogo' },
  { value: `${teams.length}`, label: 'Escuderías oficiales' },
  { value: `${drivers.length}`, label: 'Pilotos representados' },
  { value: '12k+', label: 'Coleccionistas felices' },
]

export default function About() {
  return (
    <div>
      <PageHeader
        eyebrow="Quiénes somos"
        title="Sobre nosotros"
        description="Somos una tienda de coleccionismo especializada en coches de Fórmula 1 a escala. Esto no es un catálogo: es una historia de pasión por el motorsport."
      />

      <section className="relative overflow-hidden">
        <img
          src="/images/hero/hero-f1.svg"
          alt="Réplica de Fórmula 1 a escala"
          className="h-[320px] w-full object-cover opacity-60 sm:h-[400px]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-carbon-950 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-carbon-950/80 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 mx-auto max-w-[1440px] px-4 pb-10 sm:px-6 lg:px-8">
          <p className="max-w-xl font-display text-2xl font-medium uppercase leading-snug tracking-wide text-white sm:text-3xl">
            «La Fórmula 1, en tus manos» no es nuestro eslogan. Es nuestra forma de entender la colección.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {SECTIONS.map(({ icon: Icon, title, text }) => (
            <article
              key={title}
              className="group rounded-2xl border border-carbon-800 bg-carbon-900 p-7 transition-all duration-500 hover:-translate-y-1 hover:border-carbon-600 hover:shadow-2xl hover:shadow-black/40"
            >
              <div className="mb-5 flex size-12 items-center justify-center rounded-xl bg-carbon-800 text-carbon-300 transition-colors duration-300 group-hover:bg-f1-500 group-hover:text-white">
                <Icon size={22} />
              </div>
              <h3 className="font-display text-lg font-semibold uppercase tracking-wide text-white">{title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-carbon-400">{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="speed-lines border-y border-carbon-800 bg-carbon-900/40">
        <div className="mx-auto max-w-[1440px] px-4 py-14 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:grid-cols-5">
            {MILESTONES.map((item) => (
              <div key={item.label} className="text-center">
                <p className="font-display text-4xl font-bold text-white">{item.value}</p>
                <p className="mt-2 text-xs uppercase tracking-[0.15em] text-carbon-400">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}