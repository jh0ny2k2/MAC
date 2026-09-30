import { Link } from 'react-router-dom'
import { BadgeCheck, Package, ShieldCheck, Truck, ChevronRight } from 'lucide-react'
import { products, teams, drivers, getFeaturedProducts, getBestsellers, getDiscountedProducts } from '../data'
import { buttonStyles } from '../components/ui/Button'
import SectionHeader from '../components/ui/SectionHeader'
import ProductGrid from '../components/ProductGrid'
import TeamCard from '../components/TeamCard'

const VALUES = [
  {
    icon: BadgeCheck,
    title: 'Réplicas 100% oficiales',
    text: 'Licencia oficial de las escuderías y fabricantes más prestigiosos del coleccionismo.',
  },
  {
    icon: ShieldCheck,
    title: 'Compra protegida',
    text: 'Pago seguro, embalaje blindado y garantía de autenticidad en todas las piezas.',
  },
  {
    icon: Truck,
    title: 'Envío express',
    text: 'Envío gratuito desde 99 €. Entrega en 24-48h en península con seguimiento.',
  },
  {
    icon: Package,
    title: 'Caja coleccionista',
    text: 'Cada modelo se envía en su estuche original, listo para tu vitrina.',
  },
]

export default function Home() {
  const featured = getFeaturedProducts().slice(0, 6)
  const bestsellers = getBestsellers().slice(0, 6)
  const offers = getDiscountedProducts().slice(0, 4)
  const maxDiscount = getDiscountedProducts()[0]?.discount ?? 0

  return (
    <div>
      <section className="relative overflow-hidden">
        <img
          src="/images/hero/hero-f1.svg"
          alt="Coche de Fórmula 1 a escala del catálogo APEX"
          className="absolute inset-0 size-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-carbon-950 via-carbon-950/75 to-carbon-950/10" />
        <div className="absolute inset-0 bg-gradient-to-t from-carbon-950 via-transparent to-carbon-950/50" />

        <div className="relative mx-auto flex min-h-[92vh] max-w-[1440px] flex-col justify-center px-4 py-24 sm:px-6 lg:px-8">
          <p className="mb-5 inline-flex w-fit animate-fade-up items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-carbon-200 backdrop-blur-md">
            <span className="size-1.5 animate-pulse rounded-full bg-f1-500" />
            Colección oficial de Fórmula 1
          </p>

          <h1
            className="max-w-3xl animate-fade-up font-display text-5xl font-bold uppercase leading-[1.05] tracking-wide text-white sm:text-7xl lg:text-8xl"
            style={{ animationDelay: '100ms' }}
          >
            La Fórmula 1,
            <br />
            <span className="text-f1-500">en tus manos.</span>
          </h1>

          <p
            className="mt-6 max-w-xl animate-fade-up text-base leading-relaxed text-carbon-300 sm:text-lg"
            style={{ animationDelay: '200ms' }}
          >
            Réplicas oficiales a escala de los monoplazas más legendarios. Cada modelo de
            APEX es una pieza de coleccionismo meticulosamente producida para los que sienten
            la velocidad en la sangre.
          </p>

          <div className="mt-9 flex animate-fade-up flex-wrap gap-3" style={{ animationDelay: '300ms' }}>
            <Link to="/tienda" className={buttonStyles({ size: 'lg' })}>
              Ver colección
            </Link>
            <Link
              to="/ofertas"
              className={buttonStyles({ size: 'lg', variant: 'outline', className: 'bg-carbon-950/30 backdrop-blur-md' })}
            >
              Ver ofertas
            </Link>
          </div>

          <dl
            className="mt-16 grid animate-fade-up grid-cols-2 gap-6 border-t border-white/10 pt-8 sm:grid-cols-4"
            style={{ animationDelay: '400ms' }}
          >
            {[
              { value: `${products.length}+`, label: 'Modelos a escala' },
              { value: `${teams.length}`, label: 'Escuderías oficiales' },
              { value: `${drivers.length}`, label: 'Pilotos de leyenda' },
              { value: '24/48h', label: 'Envío express' },
            ].map((stat) => (
              <div key={stat.label}>
                <dt className="font-display text-3xl font-bold text-white">{stat.value}</dt>
                <dd className="mt-1 text-xs uppercase tracking-[0.15em] text-carbon-400">{stat.label}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <SectionHeader
          eyebrow="Selección"
          title="Destacados"
          description="Las piezas que están marcando a la temporada. Réplicas de alta fidelidad en las escalas más codiciadas."
          action={
            <Link
              to="/tienda"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-f1-500 transition-all duration-300 hover:gap-3"
            >
              Ver todo <ChevronRight size={16} />
            </Link>
          }
        />

        <ProductGrid products={featured} className="mt-10" />
      </section>

      <section className="border-y border-carbon-800 bg-carbon-900/40">
        <div className="mx-auto max-w-[1440px] px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <SectionHeader
            eyebrow="Los equipos"
            title="Escuderías"
            description="Diez escuderías, diez historias. Busca por equipo y descubre los modelos disponibles de cada escudería."
            action={
              <Link
                to="/escuderias"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-f1-500 transition-all duration-300 hover:gap-3"
              >
                Todas las escuderías <ChevronRight size={16} />
              </Link>
            }
          />
          <div className="no-scrollbar mt-10 flex snap-x gap-5 overflow-x-auto pb-2">
            {teams.map((team) => (
              <div key={team.id} className="w-72 shrink-0 snap-start">
                <TeamCard team={team} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <SectionHeader
          eyebrow="Los favoritos"
          title="Más vendidos"
          description="Los modelos que más coleccionistas han elegido este año. Éxitos garantizados para tu vitrina."
          action={
            <Link
              to="/tienda?sortBy=bestsellers"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-f1-500 transition-all duration-300 hover:gap-3"
            >
              Ver más vendidos <ChevronRight size={16} />
            </Link>
          }
        />
        <ProductGrid products={bestsellers} className="mt-10" />
      </section>

      <section className="mx-auto max-w-[1440px] px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="relative overflow-hidden rounded-3xl border border-f1-500/30 bg-gradient-to-br from-carbon-850 via-carbon-900 to-carbon-950 px-6 py-14 sm:px-14">
          <div className="speed-lines absolute inset-0" />
          <div className="absolute -right-24 -top-24 size-96 rounded-full bg-f1-500/20 blur-3xl" />
          <div className="absolute -bottom-32 -left-16 size-80 rounded-full bg-racing-500/10 blur-3xl" />
          <div className="relative flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
            <div>
              <p className="mb-3 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-f1-400">
                <span className="h-px w-8 bg-f1-500" />
                Ofertas de la semana
              </p>
              <h2 className="max-w-xl font-display text-4xl font-bold uppercase leading-tight text-white sm:text-5xl">
                Hasta un -{maxDiscount}% en modelos seleccionados
              </h2>
              <p className="mt-4 max-w-lg text-sm text-carbon-300 sm:text-base">
                Piezas rebajadas por tiempo limitado. Cuando la bandera a cuadros ondea, el descuento se evapora.
              </p>
            </div>
            <Link to="/ofertas" className={buttonStyles({ size: 'lg' })}>
              Ver todas las ofertas
            </Link>
          </div>
        </div>
      </section>

      <section className="border-t border-carbon-800 bg-carbon-900/40 pb-24">
        <div className="mx-auto max-w-[1440px] px-4 py-16 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Oportunidades"
            title="Rebajas"
            description="Modelos de colección con descuento. Stock limitado y precios especiales durante esta semana."
            action={
              <Link
                to="/ofertas"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-f1-500 transition-all duration-300 hover:gap-3"
              >
                Más ofertas <ChevronRight size={16} />
              </Link>
            }
          />
          <ProductGrid products={offers} className="mt-10" />
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {VALUES.map(({ icon: Icon, title, text }) => (
            <div key={title} className="group rounded-2xl border border-carbon-800 bg-carbon-900 p-6 transition-all duration-500 hover:-translate-y-1 hover:border-carbon-600">
              <div className="mb-4 flex size-12 items-center justify-center rounded-xl bg-carbon-800 text-carbon-300 transition-colors duration-300 group-hover:bg-f1-500 group-hover:text-white">
                <Icon size={22} />
              </div>
              <h3 className="font-display text-base font-semibold uppercase tracking-wide text-white">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-carbon-400">{text}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}