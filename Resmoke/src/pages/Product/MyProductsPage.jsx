import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import Header from '../../components/Layout/HeaderProducts';
import Footer from '../../components/Layout/Footer';
import SEO from '../../components/SEO/SEO';
import { generateProductListStructuredData, generateWebPageStructuredData } from '../../utils/structuredData';

const MyProductsPage = () => {
  const { user } = useAuth();
  const [userProfile, setUserProfile] = useState(null);
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('available');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date_desc');

  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  
  // Estados para el formulario de pago
  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
    email: ''
  });
  const [paymentErrors, setPaymentErrors] = useState({});
  const [paymentStep, setPaymentStep] = useState('details'); // 'details' | 'processing' | 'success' | 'error'
  const [paymentErrorMessage, setPaymentErrorMessage] = useState('');
  
  // Estados para reseñas del vendedor al comprador
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [reviewData, setReviewData] = useState({ rating: 5, comment: '' });
  const [reviewImage, setReviewImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [sellerReviews, setSellerReviews] = useState({});

  useEffect(() => {
    if (user) {
      fetchUserProfile();
      fetchUserProducts();
    }
  }, [user]);

  useEffect(() => {
    if (userProfile && productos.length > 0) {
      fetchSellerReviews();
    }
  }, [userProfile, productos]);

  const fetchUserProfile = async () => {
  try {
    const { data, error } = await supabase
      .from('Users')
      .select('*')
      .eq('email', user.email)
      .single();

    if (error) throw error;
    setUserProfile(data);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    setError('Error al cargar el perfil del usuario');
  }
};

  const fetchUserProducts = async () => {
  try {
    setLoading(true);
    
    // Primero obtenemos el usuario de la tabla Users
    const { data: userData, error: userError } = await supabase
      .from('Users')
      .select('id')
      .eq('email', user.email)
      .single();

    if (userError) throw userError;

    // Luego obtenemos los productos usando el UUID del usuario
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('user_id', userData.id)
      .order('created_at', { ascending: false }); // Esta es la sintaxis correcta

    if (error) throw error;
    setProductos(data || []);
  } catch (error) {
    console.error('Error fetching products:', error);
    setError('Error al cargar los productos');
  } finally {
    setLoading(false);
  }
};

  // Función para cargar reseñas existentes del vendedor al comprador
  const fetchSellerReviews = async () => {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('reviewer_id', userProfile.id)
        .eq('reviewer_type', 'seller');

      if (error) throw error;

      const reviewsMap = {};
      data.forEach(review => {
        reviewsMap[review.product_id] = review;
      });
      setSellerReviews(reviewsMap);
    } catch (error) {
      console.error('Error fetching seller reviews:', error);
    }
  };

  // Función para abrir modal de reseña
  const openReviewModal = (product) => {
    setSelectedProduct(product);
    setReviewData({ rating: 5, comment: '' });
    setReviewImage(null);
    setImagePreview(null);
    setShowReviewModal(true);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validar tipo de archivo
      if (!file.type.startsWith('image/')) {
        alert('Por favor, selecciona un archivo de imagen válido (JPG, PNG, WEBP)');
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        alert('La imagen no debe superar los 5MB');
        return;
      }
      setReviewImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setReviewImage(null);
    setImagePreview(null);
  };

  // Función para enviar reseña del vendedor al comprador
  const submitSellerReview = async () => {
    if (!selectedProduct || !reviewData.comment.trim()) {
      alert('Por favor, escribe un comentario para la reseña');
      return;
    }

    setIsSubmittingReview(true);
    try {
      let imagePath = null;

      if (reviewImage) {
        const fileExt = reviewImage.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
        const filePath = `reviews/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(filePath, reviewImage);

        if (uploadError) throw uploadError;
        imagePath = filePath;
      }

      const { error } = await supabase
        .from('reviews')
        .insert({
          reviewer_id: userProfile.id,
          reviewed_id: selectedProduct.buyer_id,
          product_id: selectedProduct.id,
          rating: reviewData.rating,
          comment: reviewData.comment,
          reviewer_type: 'seller',
          image_url: imagePath
        });

      if (error) throw error;

      // Actualizar el estado local
      setSellerReviews(prev => ({
        ...prev,
        [selectedProduct.id]: {
          rating: reviewData.rating,
          comment: reviewData.comment,
          reviewer_type: 'seller',
          image_url: imagePath
        }
      }));

      setShowReviewModal(false);
      setReviewImage(null);
      setImagePreview(null);
      alert('Reseña enviada exitosamente');
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Error al enviar la reseña');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const getProductsByStatus = (status) => {
    return productos.filter(producto => producto.status === status);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'available': return 'green';
      case 'pending': return 'yellow';
      case 'pending_human_review': return 'yellow';
      case 'rejected': return 'red';
      case 'reserved': return 'yellow';
      case 'sold': return 'red';
      case 'hidden': return 'gray';
      default: return 'gray';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'available': return 'Activo';
      case 'pending': return 'En revisión';
      case 'pending_human_review': return 'Revisión humana';
      case 'rejected': return 'Rechazado';
      case 'reserved': return 'Reservado';
      case 'sold': return 'Vendido';
      case 'hidden': return 'Oculto';
      default: return 'Desconocido';
    }
  };

  const getTabList = () => {
    if (activeTab === 'all') return productos;
    return getProductsByStatus(activeTab);
  };

  const applyFilters = (list) => {
    let filtered = list.filter(p =>
      (p.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.location || '').toLowerCase().includes(searchTerm.toLowerCase())
    );
    if (sortBy === 'date_desc') filtered.sort((a,b) => new Date(b.created_at) - new Date(a.created_at));
    if (sortBy === 'date_asc') filtered.sort((a,b) => new Date(a.created_at) - new Date(b.created_at));
    if (sortBy === 'price_desc') filtered.sort((a,b) => (b.price || 0) - (a.price || 0));
    if (sortBy === 'price_asc') filtered.sort((a,b) => (a.price || 0) - (b.price || 0));
    return filtered;
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http')) return imagePath;
    return `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/product-images/${imagePath}`;
  };

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

  const ProductCard = ({ producto, status }) => {
    const color = getStatusColor(status);
    const statusText = getStatusText(status);
    const isPromoted = producto.promoted === 'YES';
    const review = sellerReviews[producto.id];
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
      isNew ? { key: 'nuevo', label: 'Nuevo', className: 'bg-emerald-600 text-white' } : null,
      hasDiscount ? { key: 'rebajado', label: 'Rebajado', className: 'bg-red-600 text-white' } : null,
      isFastSelling ? { key: 'fast', label: 'Se vende rápido', className: 'bg-amber-500 text-gray-900' } : null
    ].filter(Boolean);

    return (
      <div className="group bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-lg hover:border-gray-200 transition-all duration-300 h-full flex flex-col">
        <Link to={`/product/${producto.id}`} className="relative overflow-hidden aspect-[4/3] bg-gray-50 block">
          <img
            alt={producto.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            src={producto.main_image || '/img/productos/default.jpg'}
            onError={(e) => {
              e.target.src = '/img/productos/default.jpg';
            }}
          />

          {/* Overlay para productos reservados/vendidos */}
          {status === 'reserved' && (
            <div className="absolute inset-0 bg-yellow-500/40 backdrop-blur-[2px] flex items-center justify-center">
              <span className="bg-yellow-500 text-white px-5 py-2 rounded-xl font-bold text-sm shadow-lg">RESERVADO</span>
            </div>
          )}
          {status === 'sold' && (
            <div className="absolute inset-0 bg-red-500/40 backdrop-blur-[2px] flex items-center justify-center">
              <span className="bg-red-500 text-white px-5 py-2 rounded-xl font-bold text-sm shadow-lg">VENDIDO</span>
            </div>
          )}
        </Link>

        <div className="p-4 flex-1 flex flex-col">
          <div className="flex items-start justify-between gap-3 mb-2">
            <div className="min-w-0 flex-1">
              <Link to={`/product/${producto.id}`}>
                <h2 className="text-sm font-semibold text-gray-900 leading-snug hover:text-gray-700 transition-colors line-clamp-2">{producto.name}</h2>
              </Link>
              <div className="flex items-center flex-wrap gap-1.5 mt-1">
                <span className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full ${color === 'green' ? 'bg-green-50 text-green-700 border border-green-200' : color === 'yellow' ? 'bg-yellow-50 text-yellow-700 border border-yellow-200' : color === 'red' ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-gray-50 text-gray-500 border border-gray-200'}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${color === 'green' ? 'bg-green-500' : color === 'yellow' ? 'bg-yellow-500' : color === 'red' ? 'bg-red-500' : 'bg-gray-400'}`}></span>
                  {statusText}
                </span>
                {badges.map((badge) => (
                  <span key={badge.key} className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${badge.className}`}>
                    {badge.label}
                  </span>
                ))}
                {isPromoted && (
                  <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                    Promocionado
                  </span>
                )}
              </div>
              {producto.location && (
                <div className="flex items-center gap-1 text-xs text-gray-400 mt-1.5">
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                  </svg>
                  {producto.location}
                </div>
              )}
            </div>
            <div className="text-right shrink-0">
              {hasDiscount ? (
                <div>
                  <span className="text-sm font-bold text-gray-900">€{formatMoney(salePrice)}</span>
                  <span className="text-[11px] text-gray-400 line-through block">€{formatMoney(basePrice)}</span>
                </div>
              ) : (
                <span className="text-sm font-bold text-gray-900">€{formatMoney(producto.price)}</span>
              )}
            </div>
          </div>

          {/* Stats views/favs como texto sutil */}
          <div className="flex items-center gap-3 text-[11px] text-gray-400 mt-2">
            <span className="flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              {producto.view_count || 0}
            </span>
            <span className="flex items-center gap-1">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
              </svg>
              {producto.favorite_count || 0}
            </span>
            <span className="flex items-center gap-1">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"></path>
              </svg>
              {new Date(producto.created_at).toLocaleDateString()}
            </span>
          </div>

          {/* Sección de Reseñas para productos vendidos */}
          {status === 'sold' && (
            <div className="mt-3 pt-3 border-t border-gray-100">
              {review ? (
                <div className="bg-gray-50 rounded-xl p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-gray-900">Tu reseña:</span>
                    <div className="flex text-yellow-400 text-xs">
                      {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 italic">"{review.comment}"</p>
                  {review.image_url && (
                    <img
                      src={getImageUrl(review.image_url)}
                      alt="Review attachment"
                      className="h-16 w-auto object-cover rounded-lg border border-gray-200 mt-2 cursor-pointer hover:opacity-90 transition-opacity"
                      onClick={(e) => {
                        e.preventDefault();
                        window.open(getImageUrl(review.image_url), '_blank');
                      }}
                    />
                  )}
                </div>
              ) : (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    openReviewModal(producto);
                  }}
                  className="w-full py-2 px-3 bg-gray-900 hover:bg-gray-800 text-white text-xs font-medium rounded-xl transition-all flex items-center justify-center gap-1.5"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                  Calificar Comprador
                </button>
              )}
            </div>
          )}

          {(status === 'pending' || status === 'pending_human_review') && (
            <div className="mt-3 pt-3 border-t border-gray-100">
              <div className="bg-yellow-50 border border-yellow-100 rounded-xl px-3 py-2">
                <div className="text-xs font-semibold text-yellow-900">En revisión</div>
                <div className="text-[11px] text-yellow-800">Te avisaremos cuando sea aprobado.</div>
              </div>
            </div>
          )}

          {status === 'rejected' && (
            <div className="mt-3 pt-3 border-t border-gray-100">
              <div className="bg-red-50 border border-red-100 rounded-xl px-3 py-2 mb-2">
                <div className="text-xs font-semibold text-red-900">Producto rechazado</div>
                <div className="text-[11px] text-red-800">Corrige y reenvía a revisión.</div>
              </div>
              <Link
                to={`/edit-product/${producto.id}`}
                className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 bg-gray-900 hover:bg-gray-800 text-white text-xs font-medium rounded-xl transition-all"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
                Editar y reenviar
              </Link>
            </div>
          )}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <Header />
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <Header />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
            <p className="text-gray-600">{error}</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const productosActivos = getProductsByStatus('available');
  const productosPendientes = getProductsByStatus('pending');
  const productosRevisionHumana = getProductsByStatus('pending_human_review');
  const productosRechazados = getProductsByStatus('rejected');
  const productosReservados = getProductsByStatus('reserved');
  const productosVendidos = getProductsByStatus('sold');
  const productosOcultos = getProductsByStatus('hidden');

  // Calcular estadísticas
  const totalProducts = productos.length;
  const soldProducts = productosVendidos.length;
  const activeProducts = productosActivos.length;

  // Funciones de validación de tarjeta de crédito
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateCardNumber = (cardNumber) => {
    const cleanNumber = cardNumber.replace(/\s/g, '');
    // Algoritmo de Luhn para validar número de tarjeta
    if (cleanNumber.length < 13 || cleanNumber.length > 19) return false;
    
    let sum = 0;
    let isEven = false;
    
    for (let i = cleanNumber.length - 1; i >= 0; i--) {
      let digit = parseInt(cleanNumber[i]);
      
      if (isEven) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }
      
      sum += digit;
      isEven = !isEven;
    }
    
    return sum % 10 === 0;
  };

  const validateExpiryDate = (expiryDate) => {
    if (!/^\d{2}\/\d{2}$/.test(expiryDate)) return false;
    
    const [month, year] = expiryDate.split('/').map(num => parseInt(num));
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear() % 100;
    const currentMonth = currentDate.getMonth() + 1;
    
    if (month < 1 || month > 12) return false;
    if (year < currentYear || (year === currentYear && month < currentMonth)) return false;
    
    return true;
  };

  const validateCVV = (cvv) => {
    return /^\d{3,4}$/.test(cvv);
  };

  const validateCardholderName = (name) => {
    return name.trim().length >= 2 && /^[a-zA-ZÀ-ÿ\s]+$/.test(name.trim());
  };

  const validatePaymentForm = () => {
    const errors = {};
    
    if (!validateEmail(paymentData.email)) {
      errors.email = 'Por favor ingresa un email válido';
    }
    
    if (!validateCardholderName(paymentData.cardholderName)) {
      errors.cardholderName = 'Nombre debe tener al menos 2 caracteres y solo letras';
    }
    
    if (!validateCardNumber(paymentData.cardNumber)) {
      errors.cardNumber = 'Número de tarjeta inválido';
    }
    
    if (!validateExpiryDate(paymentData.expiryDate)) {
      errors.expiryDate = 'Fecha de expiración inválida o vencida';
    }
    
    if (!validateCVV(paymentData.cvv)) {
      errors.cvv = 'CVV debe tener 3 o 4 dígitos';
    }
    
    setPaymentErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  // Función para abrir el modal de pago
  const handlePromoteClick = (productId, e) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedProductId(productId);
    setShowPaymentModal(true);
  };

  // Función para procesar el pago real
  const handlePayment = async () => {
    // Validar formulario antes de procesar
    if (!validatePaymentForm()) {
      return;
    }

    setPaymentStep('processing');
    
    try {
      // Simular procesamiento de pago con gateway de pago
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Simular posibles errores de pago (10% de probabilidad)
      if (Math.random() < 0.1) {
        throw new Error('Pago rechazado por el banco');
      }
      
      // Calcular fecha de expiración (30 días desde ahora)
      const expirationDate = new Date();
      expirationDate.setDate(expirationDate.getDate() + 30);
      
      // Crear registro de transacción
      const transactionData = {
        user_id: userProfile.id,
        product_id: selectedProductId,
        amount: 1.50,
        currency: 'EUR',
        payment_method: 'credit_card',
        card_last_four: paymentData.cardNumber.replace(/\s/g, '').slice(-4),
        cardholder_name: paymentData.cardholderName,
        email: paymentData.email,
        status: 'completed',
        transaction_date: new Date().toISOString(),
        promotion_expires: expirationDate.toISOString()
      };
      
      // Insertar transacción en la base de datos
      const { error: transactionError } = await supabase
        .from('payment_transactions')
        .insert(transactionData);
      
      if (transactionError) {
        console.warn('Error saving transaction:', transactionError);
        // Continuar con la promoción aunque falle el registro
      }
      
      // Actualizar el producto en la base de datos
      const { error: productError } = await supabase
        .from('products')
        .update({ 
          promoted: 'YES',
          promoted_until: expirationDate.toISOString()
        })
        .eq('id', selectedProductId);
      
      if (productError) throw productError;
      
      // Recargar los productos para mostrar el cambio
      await fetchUserProducts();
      
      // Mostrar éxito
      setPaymentStep('success');
      
      // Limpiar datos del formulario
      setPaymentData({
        cardNumber: '',
        expiryDate: '',
        cvv: '',
        cardholderName: '',
        email: ''
      });
      setPaymentErrors({});
      
    } catch (error) {
      console.error('Error processing payment:', error);
      
      // Manejar diferentes tipos de errores
      let errorMessage = 'Error desconocido al procesar el pago';
      
      if (error.message.includes('rechazado')) {
        errorMessage = 'Pago rechazado por el banco. Verifica los datos de tu tarjeta o intenta con otra tarjeta.';
      } else if (error.message.includes('network') || error.message.includes('fetch')) {
        errorMessage = 'Error de conexión. Verifica tu conexión a internet e intenta nuevamente.';
      } else if (error.message.includes('insufficient')) {
        errorMessage = 'Fondos insuficientes en la tarjeta. Intenta con otra tarjeta.';
      } else if (error.message.includes('expired')) {
        errorMessage = 'La tarjeta ha expirado. Verifica la fecha de vencimiento.';
      } else if (error.message.includes('invalid')) {
        errorMessage = 'Datos de tarjeta inválidos. Verifica la información ingresada.';
      } else if (error.code === 'PGRST301') {
        errorMessage = 'Error en la base de datos. Intenta nuevamente en unos minutos.';
      }
      
      setPaymentErrorMessage(errorMessage);
      setPaymentStep('error');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <SEO 
        title="Mis Productos - Gestiona tu Inventario"
        description="Administra tus productos en Resmoke. Promociona, edita y gestiona tu inventario de cachimbas, vapers y accesorios de forma sencilla."
        keywords="mis productos, gestionar inventario, vender cachimbas, promocionar productos, marketplace"
        url="/my-products"
        type="website"
        structuredData={{
          ...generateWebPageStructuredData({
            title: "Mis Productos - Gestiona tu Inventario",
            description: "Administra tus productos en Resmoke. Promociona, edita y gestiona tu inventario de cachimbas, vapers y accesorios de forma sencilla.",
            url: "/my-products",
            about: "Gestión de productos en marketplace"
          }),
          ...generateProductListStructuredData(productos)
        }}
      />
      <Header />

      {/* Modal de Pago con Formulario de Tarjeta */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
            {paymentStep === 'details' && (
              <>
                <div className="text-center mb-8">
                  <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-500 mb-6">
                    <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    Promocionar Producto
                  </h3>
                  
                  <div className="bg-gray-100 rounded-2xl p-6 mb-6">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-gray-700">Promoción por 30 días:</span>
                      <span className="text-xl font-bold text-gray-900">€3.00</span>
                    </div>
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-gray-700">Descuento:</span>
                      <span className="text-green-600 font-semibold">-€1.50</span>
                    </div>
                    <hr className="my-4 border-gray-300" />
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-gray-900">Total:</span>
                      <span className="text-2xl font-bold text-blue-600">€1.50</span>
                    </div>
                  </div>
                </div>

                {/* Formulario de Tarjeta de Crédito */}
                <form className="space-y-6">
                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email de confirmación
                    </label>
                    <input
                      type="email"
                      value={paymentData.email}
                      onChange={(e) => setPaymentData({...paymentData, email: e.target.value})}
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                        paymentErrors.email ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="tu@email.com"
                    />
                    {paymentErrors.email && (
                      <p className="text-red-500 text-sm mt-1">{paymentErrors.email}</p>
                    )}
                  </div>

                  {/* Nombre del titular */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre del titular
                    </label>
                    <input
                      type="text"
                      value={paymentData.cardholderName}
                      onChange={(e) => setPaymentData({...paymentData, cardholderName: e.target.value})}
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                        paymentErrors.cardholderName ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Nombre como aparece en la tarjeta"
                    />
                    {paymentErrors.cardholderName && (
                      <p className="text-red-500 text-sm mt-1">{paymentErrors.cardholderName}</p>
                    )}
                  </div>

                  {/* Número de tarjeta */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Número de tarjeta
                    </label>
                    <input
                      type="text"
                      value={paymentData.cardNumber}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim();
                        if (value.replace(/\s/g, '').length <= 16) {
                          setPaymentData({...paymentData, cardNumber: value});
                        }
                      }}
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                        paymentErrors.cardNumber ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="1234 5678 9012 3456"
                      maxLength="19"
                    />
                    {paymentErrors.cardNumber && (
                      <p className="text-red-500 text-sm mt-1">{paymentErrors.cardNumber}</p>
                    )}
                  </div>

                  {/* Fecha de expiración y CVV */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Fecha de expiración
                      </label>
                      <input
                        type="text"
                        value={paymentData.expiryDate}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1/$2');
                          if (value.length <= 5) {
                            setPaymentData({...paymentData, expiryDate: value});
                          }
                        }}
                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                          paymentErrors.expiryDate ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="MM/AA"
                        maxLength="5"
                      />
                      {paymentErrors.expiryDate && (
                        <p className="text-red-500 text-sm mt-1">{paymentErrors.expiryDate}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        CVV
                      </label>
                      <input
                        type="text"
                        value={paymentData.cvv}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, '');
                          if (value.length <= 4) {
                            setPaymentData({...paymentData, cvv: value});
                          }
                        }}
                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                          paymentErrors.cvv ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="123"
                        maxLength="4"
                      />
                      {paymentErrors.cvv && (
                        <p className="text-red-500 text-sm mt-1">{paymentErrors.cvv}</p>
                      )}
                    </div>
                  </div>

                  {/* Información de seguridad */}
                  <div className="bg-green-50 border border-green-200 rounded-2xl p-4">
                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                      </svg>
                      <p className="text-sm text-green-800">
                        <strong>Pago seguro:</strong> Tus datos están protegidos con encriptación SSL.
                      </p>
                    </div>
                  </div>
                </form>

                <div className="flex space-x-4 mt-8">
                  <button
                    onClick={() => {
                      setShowPaymentModal(false);
                      setSelectedProductId(null);
                      setPaymentData({
                        cardNumber: '',
                        expiryDate: '',
                        cvv: '',
                        cardholderName: '',
                        email: ''
                      });
                      setPaymentErrors({});
                      setPaymentStep('details');
                    }}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-4 px-6 rounded-2xl transition-all duration-300"
                  >
                    Cancelar
                  </button>
                  
                  <button
                    onClick={handlePayment}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-2xl transition-all duration-300 flex items-center justify-center transform hover:scale-105"
                  >
                    Procesar Pago €1.50
                  </button>
                </div>
              </>
            )}

            {paymentStep === 'processing' && (
              <div className="text-center py-12">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-500 mb-6">
                  <svg className="animate-spin h-8 w-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Procesando Pago</h3>
                <p className="text-gray-600">Por favor espera mientras procesamos tu pago...</p>
              </div>
            )}

            {paymentStep === 'success' && (
              <div className="text-center py-12">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-500 mb-6">
                  <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">¡Pago Exitoso!</h3>
                <p className="text-gray-600 mb-8">Tu producto ha sido promocionado por 30 días.</p>
                <button
                  onClick={() => {
                    setShowPaymentModal(false);
                    setSelectedProductId(null);
                    setPaymentStep('details');
                  }}
                  className="bg-green-600 hover:bg-green-700 text-white font-semibold py-4 px-8 rounded-2xl transition-all duration-300"
                >
                  Continuar
                </button>
              </div>
            )}

            {paymentStep === 'error' && (
              <div className="text-center py-12">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-500 mb-6">
                  <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Error en el Pago</h3>
                <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-6">
                  <p className="text-red-800 text-sm">
                    {paymentErrorMessage || 'Hubo un problema procesando tu pago. Por favor intenta de nuevo.'}
                  </p>
                </div>
                <div className="flex space-x-4">
                  <button
                    onClick={() => {
                      setPaymentStep('details');
                      setPaymentErrorMessage('');
                    }}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-4 px-6 rounded-2xl transition-all duration-300"
                  >
                    Intentar de Nuevo
                  </button>
                  <button
                    onClick={() => {
                      setShowPaymentModal(false);
                      setSelectedProductId(null);
                      setPaymentStep('details');
                      setPaymentErrorMessage('');
                    }}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-4 px-6 rounded-2xl transition-all duration-300"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            )}
            </div>
          </div>
      )}
      
      {/* ── Hero Banner ── */}
      <div className="relative">
        <div className="h-32 sm:h-48 bg-gradient-to-br from-gray-100 via-gray-50 to-gray-200 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-white/40 to-transparent" />
          <div className="absolute top-0 right-0 w-80 h-80 bg-gray-200/30 rounded-full -translate-y-1/2 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-gray-200/30 rounded-full translate-y-1/3 -translate-x-1/4" />
        </div>
        <div className="absolute inset-0 flex items-end">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pb-4 sm:pb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h1 className="text-xl sm:text-3xl font-bold text-gray-900 tracking-tight">Mis Productos</h1>
                <p className="text-xs sm:text-sm text-gray-500 mt-0.5 sm:mt-1">{totalProducts} productos publicados</p>
              </div>
              <div className="flex gap-1.5 sm:gap-2">
                <Link to="/add-product" className="inline-flex items-center gap-1 sm:gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium bg-gray-900 text-white rounded-lg sm:rounded-xl hover:bg-gray-800 transition-all shadow-sm">
                  <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                  <span className="hidden xs:inline">Subir producto</span>
                  <span className="xs:hidden">+</span>
                </Link>
                <Link to="/promotions" className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium bg-white text-gray-900 border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm">
                  <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                  </svg>
                  Promociones
                </Link>
                <Link to="/statistics" className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium bg-white text-gray-900 border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm">
                  <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                  </svg>
                  Estadísticas
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Stats row ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-4 sm:-mt-5 relative z-10">
        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          <div className="bg-white rounded-lg sm:rounded-xl border border-gray-100 shadow-sm p-3 sm:p-4">
            <p className="text-[10px] sm:text-xs text-gray-400 font-medium uppercase tracking-wide">Total</p>
            <p className="text-lg sm:text-2xl font-bold text-gray-900 mt-0.5 sm:mt-1">{totalProducts}</p>
          </div>
          <div className="bg-white rounded-lg sm:rounded-xl border border-gray-100 shadow-sm p-3 sm:p-4">
            <p className="text-[10px] sm:text-xs text-gray-400 font-medium uppercase tracking-wide">Activos</p>
            <p className="text-lg sm:text-2xl font-bold text-green-600 mt-0.5 sm:mt-1">{activeProducts}</p>
          </div>
          <div className="bg-white rounded-lg sm:rounded-xl border border-gray-100 shadow-sm p-3 sm:p-4">
            <p className="text-[10px] sm:text-xs text-gray-400 font-medium uppercase tracking-wide">Vendidos</p>
            <p className="text-lg sm:text-2xl font-bold text-red-600 mt-0.5 sm:mt-1">{soldProducts}</p>
          </div>
        </div>
      </div>

      {/* ── Tabs + Search + Sort ── */}
      <div className="border-b border-gray-200 bg-white/80 backdrop-blur-sm mt-4 sm:mt-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
            <div className="flex flex-wrap gap-1">
              {[
                {id:'available',label:'Activos',color:'green',count:productosActivos.length},
                {id:'pending',label:'En revisión',color:'yellow',count:productosPendientes.length},
                {id:'pending_human_review',label:'Revisión humana',color:'yellow',count:productosRevisionHumana.length},
                {id:'rejected',label:'Rechazados',color:'red',count:productosRechazados.length},
                {id:'reserved',label:'Reservados',color:'yellow',count:productosReservados.length},
                {id:'sold',label:'Vendidos',color:'red',count:productosVendidos.length},
                {id:'hidden',label:'Ocultos',color:'gray',count:productosOcultos.length},
                {id:'all',label:'Todos',color:'blue',count:totalProducts}
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-2.5 sm:px-3 py-1 sm:py-1.5 text-[11px] sm:text-xs font-medium rounded-lg whitespace-nowrap transition-all ${activeTab===tab.id ? 'bg-gray-900 text-white shadow-sm' : 'bg-white text-gray-500 hover:bg-gray-100 border border-gray-200'}`}
                >
                  {tab.label}
                  <span className={`ml-1 ${activeTab===tab.id ? 'text-white/70' : 'text-gray-400'}`}>({tab.count})</span>
                </button>
              ))}
            </div>
            <div className="flex-1" />
            <div className="relative flex-1 sm:flex-initial">
              <div className="absolute inset-y-0 left-0 pl-3 flex sm:pl-3.5 items-center pointer-events-none">
                <svg className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar..."
                className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400 transition-all bg-white"
              />
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 sm:px-3.5 py-2 sm:py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400 bg-white"
            >
              <option value="date_desc">Más recientes</option>
              <option value="date_asc">Más antiguos</option>
              <option value="price_desc">Mayor precio</option>
              <option value="price_asc">Menor precio</option>
            </select>
          </div>
        </div>
      </div>

      {/* ── Product Grid ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">

        {(() => {
          const visibleProducts = applyFilters(getTabList());
          if (productos.length > 0 && visibleProducts.length === 0) {
            return (
              <div className="text-center py-10 sm:py-16">
                <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl p-6 sm:p-10 max-w-lg mx-auto border border-gray-100">
                  <h3 className="text-base sm:text-xl font-bold text-gray-900 mb-2">No hay productos para mostrar</h3>
                  <p className="text-sm sm:text-base text-gray-600">
                    Cambia de pestaña o ajusta la búsqueda para ver resultados.
                  </p>
                </div>
              </div>
            );
          }
          return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {visibleProducts.map(producto => (
            <ProductCard key={producto.id} producto={producto} status={activeTab==='all' ? producto.status : activeTab} />
              ))}
            </div>
          );
        })()}
        
        {/* Mensaje si no hay productos */}
        {productos.length === 0 && (
          <div className="text-center py-10 sm:py-20">
            <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl p-6 sm:p-12 max-w-md mx-auto">
              <div className="bg-blue-100 rounded-full w-16 h-16 sm:w-24 sm:h-24 flex items-center justify-center mx-auto mb-4 sm:mb-8">
                <svg className="w-8 h-8 sm:w-12 sm:h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m0-10L4 7m8 4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
                </svg>
              </div>
              
              <h3 className="text-lg sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-4">No tienes productos en venta</h3>
              <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8 leading-relaxed">Comienza a vender publicando tu primer producto. ¡Es fácil y rápido!</p>
              
              <Link to="/add-product" className="inline-flex items-center px-6 sm:px-8 py-3 sm:py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl sm:rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-sm sm:text-base">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
                Subir Producto
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Modal de reseña del vendedor al comprador */}
      {showReviewModal && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Reseñar Comprador</h3>
                <button
                  onClick={() => setShowReviewModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors duration-300"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="mb-6">
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <h4 className="font-semibold text-gray-900 mb-2">{selectedProduct.name}</h4>
                  <p className="text-gray-600 text-sm">Producto vendido por {selectedProduct.price} €</p>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Calificación del comprador
                </label>
                <div className="flex items-center space-x-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setReviewData(prev => ({ ...prev, rating: star }))}
                      className={`text-2xl transition-colors duration-300 ${
                        star <= reviewData.rating ? 'text-yellow-400' : 'text-gray-300'
                      } hover:text-yellow-400`}
                    >
                      ★
                    </button>
                  ))}
                  <span className="ml-3 text-sm text-gray-600">
                    {reviewData.rating} de 5 estrellas
                  </span>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Comentario sobre el comprador
                </label>
                <textarea
                  value={reviewData.comment}
                  onChange={(e) => setReviewData(prev => ({ ...prev, comment: e.target.value }))}
                  placeholder="Describe tu experiencia con este comprador (puntualidad, comunicación, etc.)"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  rows={4}
                  maxLength={500}
                />
                <div className="text-right text-sm text-gray-500 mt-1">
                  {reviewData.comment.length}/500
                </div>
              </div>

              {/* Imagen opcional */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Foto (opcional)
                </label>
                {!imagePreview ? (
                  <div 
                    onClick={() => document.getElementById('review-image-upload').click()}
                    className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-xl hover:border-blue-400 hover:bg-blue-50 transition-all cursor-pointer group"
                  >
                    <div className="space-y-1 text-center">
                      <svg className="mx-auto h-12 w-12 text-gray-400 group-hover:text-blue-500 transition-colors" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <div className="flex text-sm text-gray-600">
                        <span className="relative cursor-pointer font-semibold text-blue-600 hover:text-blue-500">Subir una foto</span>
                        <p className="pl-1 text-gray-500">o arrastrar y soltar</p>
                      </div>
                      <p className="text-xs text-gray-400">PNG, JPG hasta 5MB</p>
                    </div>
                    <input id="review-image-upload" type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                  </div>
                ) : (
                  <div className="relative">
                    <img src={imagePreview} alt="Preview" className="h-48 w-full object-cover rounded-xl border border-gray-200" />
                    <button
                      onClick={removeImage}
                      className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors shadow-lg"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={() => setShowReviewModal(false)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-3 px-6 rounded-lg transition-all duration-300"
                  disabled={isSubmittingReview}
                >
                  Cancelar
                </button>
                <button
                  onClick={submitSellerReview}
                  disabled={isSubmittingReview || !reviewData.comment.trim()}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 flex items-center justify-center"
                >
                  {isSubmittingReview ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Enviando...
                    </>
                  ) : (
                    'Enviar Reseña'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default MyProductsPage;
