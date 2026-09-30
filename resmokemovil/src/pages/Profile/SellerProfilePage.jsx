import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { useSubscription } from '../../hooks/useSubscription';
import Header from '../../components/Layout/HeaderProducts';
import Footer from '../../components/Layout/Footer';

const SellerProfilePage = () => {
  const { sellerId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isPremium: isSellerPremium } = useSubscription(sellerId);
  
  const [sellerData, setSellerData] = useState(null);
  const [sellerProducts, setSellerProducts] = useState([]);
  const [sellerReviews, setSellerReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('products'); // 'products' o 'reviews'
  const [stats, setStats] = useState({
    totalProducts: 0,
    soldProducts: 0,
    averageRating: 0,
    totalReviews: 0
  });









  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('recent');
  const [viewMode, setViewMode] = useState('grid');

  useEffect(() => {
    if (sellerId) {
      fetchSellerData();
      fetchSellerProducts();
      fetchSellerReviews();
      fetchSellerStats();
    } else {
    }
  }, [sellerId]);

  // Función para formatear fechas
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Función para obtener URL de imagen
  const getImageUrl = (imagePath) => {
    if (!imagePath) return '/placeholder-image.jpg';
    if (imagePath.startsWith('http')) return imagePath;
    return `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/product-images/${imagePath}`;
  };

  // Función para renderizar estrellas
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      );
    }
    
    if (hasHalfStar) {
      stars.push(
        <svg key="half" className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
          <defs>
            <linearGradient id="half-fill">
              <stop offset="50%" stopColor="currentColor" />
              <stop offset="50%" stopColor="#e5e7eb" />
            </linearGradient>
          </defs>
          <path fill="url(#half-fill)" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      );
    }
    
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <svg key={`empty-${i}`} className="w-4 h-4 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      );
    }
    
    return stars;
  };

  const formatPrice = (value) => {
    const n = Number(value) || 0;
    return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n);
  };

  const fetchSellerData = async () => {
    try {
      const { data, error } = await supabase
        .from('Users')
        .select('id, nombre, email, telefono, creado_en, is_verified')
        .eq('id', sellerId)
        .single();

      if (error) throw error;
      setSellerData(data);
    } catch (error) {
      console.error('Error fetching seller data:', error);
      setError('Error al cargar los datos del vendedor');
    }
  };

  const fetchSellerProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          id,
          name,
          price,
          main_image,
          status,
          created_at,
          categories (id, name)
        `)
        .eq('user_id', sellerId)
        .eq('status', 'available')
        .order('created_at', { ascending: false })
        .limit(12);

      if (error) {
        console.error('Supabase error fetching products:', error);
        throw error;
      }
      setSellerProducts(data || []);
    } catch (error) {
      console.error('Error fetching seller products:', error);
    }
  };

  const fetchSellerReviews = async () => {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          id,
          rating,
          comment,
          image_url,
          created_at,
          buyer:buyer_id (
            id,
            nombre
          ),
          product:product_id (
            id,
            name
          )
        `)
        .eq('seller_id', sellerId)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) {
        console.error('Supabase error fetching reviews:', error);
        throw error;
      }
      setSellerReviews(data || []);
    } catch (error) {
      console.error('Error fetching seller reviews:', error);
    }
  };

  const fetchSellerStats = async () => {
    try {
      // Obtener estadísticas de productos
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('status')
        .eq('user_id', sellerId);

      if (productsError) throw productsError;

      // Obtener estadísticas de reseñas
      const { data: reviewsData, error: reviewsError } = await supabase
        .from('reviews')
        .select('rating')
        .eq('seller_id', sellerId);

      if (reviewsError) throw reviewsError;

      const totalProducts = productsData?.length || 0;
      const soldProducts = productsData?.filter(p => p.status === 'sold').length || 0;
      const totalReviews = reviewsData?.length || 0;
      const averageRating = totalReviews > 0 
        ? (reviewsData.reduce((sum, review) => sum + review.rating, 0) / totalReviews).toFixed(1)
        : 0;

      setStats({
        totalProducts,
        soldProducts,
        averageRating: parseFloat(averageRating),
        totalReviews
      });
    } catch (error) {
      console.error('Error fetching seller stats:', error);
    } finally {
      setLoading(false);
    }
  };


  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !sellerData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Vendedor no encontrado</h1>
            <p className="text-gray-600 mb-6">{error || 'El vendedor que buscas no existe.'}</p>
            <button
              onClick={() => navigate(-1)}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              Volver
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const filteredProducts = sellerProducts.filter((p) => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return true;
    return (
      (p.name || '').toLowerCase().includes(q) ||
      (p.categories?.name || '').toLowerCase().includes(q)
    );
  });

  const displayProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price_asc') return (Number(a.price) || 0) - (Number(b.price) || 0);
    if (sortBy === 'price_desc') return (Number(b.price) || 0) - (Number(a.price) || 0);
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  return (
    <div className="min-h-screen mt-13 sm:mt-1 bg-gray-50">
      <Header />
      
      <div className="bg-white/90 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-700 font-semibold">
                {(sellerData.nombre || 'U').charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-3xl font-bold text-gray-900">{sellerData.nombre}</h1>
                  {sellerData.is_verified ? (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
                      <span className="material-icons text-xs">verified</span>
                      Verificado
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold">
                      <span className="material-icons text-xs">schedule</span>
                      No verificado
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600">{stats.totalProducts} productos • {stats.averageRating}/5 rating</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar por nombre o categoría"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent shadow-sm"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent bg-white"
              >
                <option value="recent">Más recientes</option>
                <option value="price_asc">Precio: menor a mayor</option>
                <option value="price_desc">Precio: mayor a menor</option>
              </select>
              <div className="flex gap-2">
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-4 py-3 rounded-xl transition ${viewMode === 'list' ? 'bg-gray-900 text-white' : 'bg-white text-gray-700 border border-gray-300'}`}
                >
                  Lista
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-4 py-3 rounded-xl transition ${viewMode === 'grid' ? 'bg-gray-900 text-white' : 'bg-white text-gray-700 border border-gray-300'}`}
                >
                  Galería
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container  mx-auto px-4 py-8">

        {/* Content Tabs */}
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
            <div className="p-6">
              <div className="flex gap-2 mb-2">
                <button onClick={() => setActiveTab('products')} className={`px-4 py-2 rounded-xl ${activeTab === 'products' ? 'bg-gray-900 text-white' : 'bg-white text-gray-700 border border-gray-300'}`}>Productos ({sellerProducts.length})</button>
                <button onClick={() => setActiveTab('reviews')} className={`px-4 py-2 rounded-xl ${activeTab === 'reviews' ? 'bg-gray-900 text-white' : 'bg-white text-gray-700 border border-gray-300'}`}>Reseñas ({sellerReviews.length})</button>
              </div>
            </div>

            <div className="px-6 pb-6">
              {activeTab === 'products' && (
                <div>
                {displayProducts.length > 0 ? (
                  viewMode === 'grid' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                      {displayProducts.map((product) => (
                        <div key={product.id} className="group bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-500 hover:shadow-xl hover:-translate-y-2 cursor-pointer" onClick={() => navigate(`/product/${product.id}`)}>
                          <div className="relative overflow-hidden">
                            <img alt={product.name} className="w-full h-64 object-cover object-center transition-transform duration-700 group-hover:scale-110" src={getImageUrl(product.main_image)} />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            <div className="absolute bottom-4 right-4">
                              <span className="bg-white/90 backdrop-blur-sm text-gray-900 text-sm font-semibold px-3 py-1 rounded-full shadow-sm">{formatPrice(product.price)}</span>
                            </div>
                            {product.categories && (
                              <div className="absolute bottom-4 left-4">
                                <span className="bg-white/90 backdrop-blur-sm text-gray-800 text-xs font-medium px-3 py-1 rounded-full">{product.categories.name}</span>
                              </div>
                            )}
                          </div>
                          <div className="p-6">
                            <h2 className="text-xl font-bold text-gray-900 line-clamp-2 mb-2">{product.name}</h2>
                            <div className="flex items-center text-gray-500 text-sm"><svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"></path></svg><span className="text-xs">{formatDate(product.created_at)}</span></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-4">
                      {displayProducts.map((product) => (
                        <div key={product.id} className="bg-white rounded-2xl border border-gray-100 p-4 flex items-center gap-4 hover:shadow-md transition cursor-pointer" onClick={() => navigate(`/product/${product.id}`)}>
                          <img src={getImageUrl(product.main_image)} alt={product.name} className="w-28 h-28 rounded-xl object-cover" />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <h2 className="text-lg font-semibold text-gray-900 truncate">{product.name}</h2>
                              {product.categories && (<span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-1 rounded-full">{product.categories.name}</span>)}
                            </div>
                            <span className="text-xs text-gray-500">{formatDate(product.created_at)}</span>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <span className="text-lg font-bold text-gray-900">{formatPrice(product.price)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )
                ) : (
                  <div className="text-center py-20">
                    <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                      <svg className="w-12 h-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m13-8V4a1 1 0 00-1-1H7a1 1 0 00-1 1v1m8 0V4a1 1 0 00-1-1H9a1 1 0 00-1 1v1" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No hay productos disponibles</h3>
                    <p className="text-gray-600 max-w-md mx-auto">Este vendedor aún no ha publicado productos o todos están agotados.</p>
                  </div>
                )}
                </div>
              )}

              {activeTab === 'reviews' && (
                <div>
                  {sellerReviews.length > 0 ? (
                    <div className="space-y-8">
                      {sellerReviews.map((review) => (
                        <div key={review.id} className="bg-white rounded-2xl p-6 border-2 border-gray-300 hover:shadow-lg transition-all duration-300">
                          <div className="flex items-start space-x-6">
                            <div className="flex-shrink-0">
                              <div className="w-14 h-14 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-lg">
                                <span className="text-gray-600 text-lg font-semibold">
                                  {(review.buyer?.nombre || 'U').charAt(0).toUpperCase()}
                                </span>
                              </div>
                            </div>
                            <div className="flex-1">
                              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                                <div>
                                  <h4 className="text-lg font-semibold text-gray-900 mb-1">
                                    {review.buyer?.nombre || 'Usuario anónimo'}
                                  </h4>
                                  <p className="text-sm text-gray-600 font-medium">
                                    Producto: {review.product?.name || 'Producto'}
                                  </p>
                                </div>
                                <div className="flex flex-col items-start sm:items-end mt-2 sm:mt-0">
                                  <div className="flex items-center space-x-1 mb-1">
                                    {renderStars(review.rating)}
                                    <span className="text-sm font-semibold text-gray-700 ml-2">({review.rating}/5)</span>
                                  </div>
                                  <span className="text-xs text-gray-500">
                                    {formatDate(review.created_at)}
                                  </span>
                                </div>
                              </div>
                              {review.comment && (
                                <div className="bg-white rounded-xl p-4 border-2 border-gray-100">
                                  <p className="text-gray-700 leading-relaxed">
                                    "{review.comment}"
                                  </p>
                                </div>
                              )}
                              {review.image_url && (
                                <div className="mt-4">
                                  <img 
                                    src={getImageUrl(review.image_url)} 
                                    alt="Review attachment" 
                                    className="h-48 w-auto object-cover rounded-lg border border-gray-200 cursor-pointer hover:opacity-90 transition-opacity"
                                    onClick={() => window.open(getImageUrl(review.image_url), '_blank')}
                                  />
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-20">
                      <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                        <svg className="w-12 h-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">No hay reseñas aún</h3>
                      <p className="text-gray-600 max-w-md mx-auto">Este vendedor aún no ha recibido reseñas de sus compradores.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default SellerProfilePage;
