import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAnalytics from '../../../../hooks/useAnalytics';
import LazyImage from '../../../../components/LazyImage/LazyImage';

const ProductCard = ({ producto, status, onReviewClick, sellerReviews }) => {
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { trackButtonClick } = useAnalytics();

  const normalizeNumber = (value) => {
    if (value === null || value === undefined) return null;
    if (typeof value === 'number') return Number.isFinite(value) ? value : null;
    if (typeof value === 'string') {
      const parsed = parseFloat(value.replace(',', '.'));
      return Number.isFinite(parsed) ? parsed : null;
    }
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  };

  const formatMoney = (value) => {
    const numberValue = normalizeNumber(value);
    if (numberValue === null) return value;
    return new Intl.NumberFormat('es-ES', { maximumFractionDigits: 2 }).format(numberValue);
  };

  const basePrice = normalizeNumber(producto?.price);
  const salePrice = normalizeNumber(producto?.sale_price);
  const hasDiscount = basePrice !== null && salePrice !== null && salePrice > 0 && salePrice < basePrice;

  const createdAtMs = producto?.created_at ? new Date(producto.created_at).getTime() : null;
  const ageMs = createdAtMs && Number.isFinite(createdAtMs) ? Date.now() - createdAtMs : null;
  const isNew = ageMs !== null && ageMs >= 0 && ageMs <= 7 * 24 * 60 * 60 * 1000;

  const viewCount = Number(producto?.view_count || 0);
  const favoriteCount = Number(producto?.favorite_count || 0);
  const isFastSelling = ageMs !== null && ageMs >= 0 && ageMs <= 14 * 24 * 60 * 60 * 1000 && (favoriteCount >= 5 || viewCount >= 100);

  const badges = [
    isNew ? { key: 'nuevo', label: 'Nuevo', className: 'bg-white/90 text-emerald-700 border border-emerald-200' } : null,
    hasDiscount ? { key: 'rebajado', label: `-${Math.round((1 - salePrice / basePrice) * 100)}%`, className: 'bg-red-500 text-white' } : null,
    isFastSelling ? { key: 'fast', label: 'Popular', className: 'bg-white/90 text-amber-700 border border-amber-200' } : null
  ].filter(Boolean);

  const handleProductClick = () => {
    trackButtonClick('product_card_click', {
      product_id: producto.id,
      product_name: producto.name,
      category: producto.categories?.name || 'Unknown',
      price: producto.price,
      location: producto.location
    });
    navigate(`/product/${producto.id}`);
  };

  const getProductImages = () => {
    const images = [];
    if (producto.main_image && producto.main_image !== '/img/resmoke/noFoto.png') {
      images.push(producto.main_image);
    }
    if (producto.images && Array.isArray(producto.images)) {
      producto.images.forEach(img => {
        if (img && img !== '/img/resmoke/noFoto.png' && !images.includes(img)) {
          images.push(img);
        }
      });
    }
    for (let i = 1; i <= 5; i++) {
      const imageKey = `image_${i}`;
      if (producto[imageKey] && producto[imageKey] !== '/img/resmoke/noFoto.png' && !images.includes(producto[imageKey])) {
        images.push(producto[imageKey]);
      }
    }
    if (images.length === 0) {
      images.push('/img/resmoke/noFoto.png');
    }
    return images;
  };

  const images = getProductImages();

  const nextImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const goToImage = (index, e) => {
    e.stopPropagation();
    setCurrentImageIndex(index);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const now = new Date();
    const date = new Date(dateString);
    const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return 'Hoy';
    if (diffDays === 1) return 'Ayer';
    if (diffDays < 7) return `Hace ${diffDays} días`;
    return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'available': return 'text-emerald-700 bg-emerald-50 border-emerald-200';
      case 'sold': return 'text-red-700 bg-red-50 border-red-200';
      case 'reserved': return 'text-amber-700 bg-amber-50 border-amber-200';
      default: return 'text-gray-700 bg-gray-100 border-gray-200';
    }
  };

  const getStatusText = (status) => {
    switch(status) {
      case 'available': return 'Disponible';
      case 'sold': return 'Vendido';
      case 'reserved': return 'Reservado';
      default: return status;
    }
  };

  return (
    <div
      className="group bg-white rounded-xl overflow-hidden cursor-pointer hover:shadow-xl hover:shadow-gray-200/50 hover:-translate-y-0.5 transition-all duration-300 h-full flex flex-col"
      onClick={(e) => {
        e.preventDefault();
        handleProductClick();
      }}
    >
      <div className="relative overflow-hidden bg-gray-100" style={{ paddingBottom: '75%' }}>
        <div
          className="absolute inset-0 flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}
        >
          {images.map((image, index) => (
            <div key={index} className="w-full h-full flex-shrink-0 relative">
              <LazyImage
                src={image}
                alt={`${producto.name} - Imagen ${index + 1}`}
                className="object-cover object-center w-full h-full transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                onError={(e) => {
                  e.target.src = '/img/resmoke/noFoto.png';
                }}
              />
            </div>
          ))}
        </div>

        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />

        <div className="absolute top-3 left-3 z-20 flex flex-col gap-1.5">
          {badges.map((badge) => (
            <span
              key={badge.key}
              className={`px-2.5 py-0.5 text-xs font-semibold rounded-md shadow-sm backdrop-blur-sm ${badge.className}`}
            >
              {badge.label}
            </span>
          ))}
        </div>

        <div className="absolute top-3 right-3 z-20">
          <span className={`px-2 py-0.5 text-[11px] font-medium rounded-md border backdrop-blur-sm ${getStatusColor(producto.status)}`}>
            {getStatusText(producto.status)}
          </span>
        </div>

        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/20 to-transparent" />

        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-700 rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-all duration-200 z-20"
              aria-label="Imagen anterior"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-700 rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-all duration-200 z-20"
              aria-label="Imagen siguiente"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </button>
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1 z-20">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={(e) => goToImage(index, e)}
                  className={`transition-all duration-200 ${
                    index === currentImageIndex
                      ? 'w-5 h-1.5 bg-white rounded-full'
                      : 'w-1.5 h-1.5 bg-white/50 rounded-full hover:bg-white/70'
                  }`}
                  aria-label={`Ir a la imagen ${index + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      <div className="p-4 flex-1 flex flex-col">
        <div className="flex items-start justify-between gap-2 mb-1">
          <span className="text-[11px] font-medium text-gray-400 uppercase tracking-wider">
            {producto.categories?.name || 'Sin categoría'}
          </span>
          <div className="text-right shrink-0">
            {hasDiscount ? (
              <>
                <p className="text-lg font-bold text-gray-900 leading-none">
                  {formatMoney(salePrice)} €
                </p>
                <p className="text-[11px] text-gray-400 line-through">
                  {formatMoney(basePrice)} €
                </p>
              </>
            ) : (
              <p className="text-lg font-bold text-gray-900 leading-none">
                {formatMoney(producto.price)} €
              </p>
            )}
          </div>
        </div>

        <h3 className="text-sm font-semibold text-gray-900 mt-1 mb-1.5 line-clamp-2 leading-snug">
          {producto.name}
        </h3>

        <p className="text-xs text-gray-400 line-clamp-2 mb-3 flex-1 leading-relaxed">
          {producto.description}
        </p>

        <div className="mt-auto flex items-center justify-between pt-2.5 border-t border-gray-100">
          <div className="flex items-center gap-1 text-[11px] text-gray-400">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {producto.location || 'Sin ubicación'}
          </div>
          <span className="text-[11px] text-gray-400">{formatDate(producto.created_at)}</span>
        </div>

        {status === 'sold' && producto.buyer_id && onReviewClick && (
          <div className="mt-2.5 pt-2.5 border-t border-gray-100">
            {sellerReviews && sellerReviews[producto.id] ? (
              <div className="flex items-center justify-center py-1.5 px-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                <svg className="w-3.5 h-3.5 text-emerald-600 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-emerald-700 text-xs font-medium">Reseña realizada</span>
              </div>
            ) : (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onReviewClick(producto);
                }}
                className="w-full flex items-center justify-center py-1.5 px-3 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg transition-all duration-200"
              >
                <svg className="w-3.5 h-3.5 text-gray-500 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="text-gray-600 text-xs font-medium">Reseñar comprador</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
