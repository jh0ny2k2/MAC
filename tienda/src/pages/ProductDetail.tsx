import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  ChevronRight,
  Home,
  PackageCheck,
  Ruler,
  ShieldCheck,
  Truck,
  Weight,
  BadgeEuro,
} from 'lucide-react'
import { getProductById, getRelatedProducts, getTeamByName } from '../data'
import { cx, formatPrice, getDiscountPercent } from '../utils/format'
import { useCart } from '../context/CartContext'
import { useToast } from '../context/ToastContext'
import Chip from '../components/ui/Chip'
import RatingStars from '../components/ui/RatingStars'
import QuantitySelector from '../components/ui/QuantitySelector'
import FavoriteButton from '../components/ui/FavoriteButton'
import Button, { buttonStyles } from '../components/ui/Button'
import ProductGrid from '../components/ProductGrid'
import SectionHeader from '../components/ui/SectionHeader'

export default function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const product = getProductById(Number(id))
  const { addItem } = useCart()
  const { showToast } = useToast()

  const [imageIndex, setImageIndex] = useState(0)
  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
    setImageIndex(0)
    setQuantity(1)
  }, [id])

  if (!product) {
    return (
      <div className="mx-auto flex max-w-xl flex-col items-center px-4 py-32 text-center">
        <h1 className="font-display text-3xl font-bold uppercase text-white">Modelo no encontrado</h1>
        <p className="mt-3 text-sm text-carbon-400">
          El producto que buscas no existe o ya no está disponible en el catálogo.
        </p>
        <Link to="/tienda" className={buttonStyles({ size: 'lg', className: 'mt-8' })}>
          Volver a la tienda
        </Link>
      </div>
    )
  }

  const team = getTeamByName(product.team)
  const discount = getDiscountPercent(product.price, product.oldPrice)
  const outOfStock = product.stock <= 0
  const lowStock = product.stock > 0 && product.stock <= 3
  const related = getRelatedProducts(product)

  const handleAddToCart = () => {
    addItem(product, quantity)
    showToast(`${quantity} × ${product.name} añadido al carrito`)
  }

  const handleBuyNow = () => {
    addItem(product, quantity)
    navigate('/carrito')
  }

  return (
    <div className="mx-auto max-w-[1440px] px-4 py-10 sm:px-6 lg:px-8">
      <nav aria-label="Ruta de navegación" className="mb-8 flex flex-wrap items-center gap-1.5 text-xs text-carbon-500">
        <Link to="/" className="inline-flex items-center gap-1 transition-colors hover:text-white">
          <Home size={13} /> Inicio
        </Link>
        <ChevronRight size={12} />
        <Link to="/tienda" className="transition-colors hover:text-white">Tienda</Link>
        <ChevronRight size={12} />
        <Link to={`/tienda?scale=${encodeURIComponent(product.scale)}`} className="transition-colors hover:text-white">Escala {product.scale}</Link>
        <ChevronRight size={12} />
        <span className="max-w-[180px] truncate text-carbon-300">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-14">
        <div className="animate-fade-up">
          <div className="relative overflow-hidden rounded-2xl border border-carbon-800 bg-carbon-900">
            <img
              key={imageIndex}
              src={product.images[imageIndex] ?? product.images[0]}
              alt={product.name}
              className="aspect-[4/3] w-full animate-fade-in object-cover"
            />
            {discount > 0 && (
              <span className="absolute left-4 top-4 rounded-lg bg-f1-500 px-2.5 py-1.5 text-sm font-bold text-white shadow-lg shadow-f1-500/40">
                -{discount}%
              </span>
            )}
            <div className="absolute right-4 top-4">
              <FavoriteButton productId={product.id} size="lg" />
            </div>
          </div>

          {product.images.length > 1 && (
            <div className="mt-4 flex gap-3">
              {product.images.map((img, i) => (
                <button
                  key={img}
                  onClick={() => setImageIndex(i)}
                  aria-label={`Ver imagen ${i + 1}`}
                  className={cx(
                    'w-24 overflow-hidden rounded-xl border-2 bg-carbon-900 transition-all duration-300',
                    i === imageIndex ? 'border-f1-500 ring-1 ring-f1-500/40' : 'border-carbon-800 hover:border-carbon-600',
                  )}
                >
                  <img src={img} alt="" className="aspect-[4/3] w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="animate-fade-up" style={{ animationDelay: '120ms' }}>
          <div className="flex flex-wrap items-center gap-2">
            {team && (
              <Chip variant="team" className="border border-carbon-700 bg-carbon-800">
                <span className="size-2 rounded-full" style={{ backgroundColor: team.color }} />
                {team.name}
              </Chip>
            )}
            <Chip>{product.driver}</Chip>
            <Chip>{product.season}</Chip>
            <Chip>Escala {product.scale}</Chip>
          </div>

          <h1 className="mt-4 font-display text-3xl font-bold uppercase leading-tight tracking-wide text-white sm:text-4xl">
            {product.name}
          </h1>

          <div className="mt-3 flex items-center gap-3">
            <RatingStars rating={product.rating} reviews={product.reviews} showCount />
            {outOfStock ? (
              <span className="rounded-md bg-red-950/60 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-red-300">
                Agotado
              </span>
            ) : lowStock ? (
              <span className="rounded-md bg-amber-950/60 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-amber-300">
                Solo quedan {product.stock} unidades
              </span>
            ) : (
              <span className="rounded-md bg-emerald-950/60 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-emerald-300">
                En stock
              </span>
            )}
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-4">
            <span className="font-display text-4xl font-bold text-white">{formatPrice(product.price)}</span>
            {product.oldPrice && product.oldPrice > product.price && (
              <span className="font-display text-xl text-carbon-500 line-through">{formatPrice(product.oldPrice)}</span>
            )}
            {discount > 0 && (
              <span className="rounded-lg bg-f1-500/15 px-2.5 py-1 text-sm font-bold text-f1-400 ring-1 ring-f1-500/30">
                Ahorra {formatPrice((product.oldPrice ?? product.price) - product.price)}
              </span>
            )}
          </div>

          <p className="mt-6 leading-relaxed text-carbon-300">{product.description}</p>

          <div className="mt-8 grid grid-cols-2 gap-3">
            {[
              { icon: PackageCheck, label: 'Material', value: product.material },
              { icon: Ruler, label: 'Dimensiones', value: product.dimensions },
              { icon: Weight, label: 'Peso', value: product.weight },
              { icon: BadgeEuro, label: 'Fabricante', value: product.manufacturer },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="rounded-xl border border-carbon-800 bg-carbon-900 p-4">
                <p className="flex items-center gap-1.5 text-[11px] uppercase tracking-widest text-carbon-500">
                  <Icon size={12} className="text-f1-500" /> {label}
                </p>
                <p className="mt-1.5 text-sm font-medium text-carbon-200">{value}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 border-t border-carbon-800 pt-8">
            <div className="flex flex-wrap items-center gap-4">
              <QuantitySelector value={quantity} onChange={setQuantity} min={1} max={Math.max(1, product.stock)} />
              <Button onClick={handleAddToCart} disabled={outOfStock} size="lg" className="flex-1 sm:flex-none">
                Añadir al carrito
              </Button>
              <Button
                onClick={handleBuyNow}
                disabled={outOfStock}
                size="lg"
                variant="dark"
                className="flex-1 sm:flex-none"
              >
                Comprar ahora
              </Button>
            </div>
          </div>

          <ul className="mt-8 space-y-2.5 border-t border-carbon-800 pt-6 text-sm text-carbon-300">
            <li className="flex items-center gap-2.5">
              <Truck size={15} className="text-f1-500" /> Envío gratuito en pedidos superiores a 99 €
            </li>
            <li className="flex items-center gap-2.5">
              <ShieldCheck size={15} className="text-f1-500" /> Embalaje protegido y garantía de autenticidad
            </li>
            <li className="flex items-center gap-2.5">
              <PackageCheck size={15} className="text-f1-500" /> {product.stock > 0 ? `${product.stock} unidades disponibles` : 'Producto sin stock'}
            </li>
          </ul>
        </div>
      </div>

      <div className="mt-16">
        <SectionHeader eyebrow="Ficha" title="Especificaciones" className="mb-6" />
        <div className="rounded-2xl border border-carbon-800 bg-carbon-900 p-8">
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {product.specifications.map((spec) => (
              <li key={spec} className="flex items-start gap-2.5 text-sm text-carbon-300">
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-f1-500" />
                {spec}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-20">
        <SectionHeader
          eyebrow="Complementa"
          title="También te puede gustar"
          action={
            <Link to="/tienda" className="inline-flex items-center gap-1.5 text-sm font-semibold text-f1-500 transition-all duration-300 hover:gap-3">
              Ver más <ChevronRight size={16} />
            </Link>
          }
        />
        <ProductGrid products={related} className="mt-10" />
      </div>
    </div>
  )
}