import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import Header from '../../components/Layout/HeaderProducts';
import Footer from '../../components/Layout/Footer';

const PurchasesPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState(null);
  const [purchasedProducts, setPurchasedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reviews, setReviews] = useState({});
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [reviewImage, setReviewImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('recent');
  const [viewMode, setViewMode] = useState('list');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchUserProfile();
    fetchPurchasedProducts();
  }, [user, navigate]);

  const fetchUserProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('Users')
        .select('id, nombre, email')
        .eq('email', user.email)
        .single();

      if (error) throw error;
      setUserProfile(data);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      setError('Error al cargar el perfil del usuario');
    }
  };

  const fetchPurchasedProducts = async () => {
    try {
      if (!userProfile?.id) return;

      const selectFields = `
        *,
        categories (id, name),
        Users!products_user_id_fkey (id, nombre, email, telefono)
      `;

      const { data: byUserId, error: err1 } = await supabase
        .from('products')
        .select(selectFields)
        .eq('status', 'sold')
        .eq('buyer_user_id', userProfile.id)
        .order('sold_date', { ascending: false });

      const { data: byEmail, error: err2 } = await supabase
        .from('products')
        .select(selectFields)
        .eq('status', 'sold')
        .ilike('buyer_email', user.email)
        .order('sold_date', { ascending: false });

      if (err1) throw err1;
      if (err2) throw err2;

      const combined = [...(byUserId || []), ...(byEmail || [])];
      const unique = Array.from(new Map(combined.map(p => [p.id, p])).values());
      setPurchasedProducts(unique);
    } catch (error) {
      console.error('Error fetching purchased products:', error);
      setError('Error al cargar los productos comprados');
    } finally {
      setLoading(false);
    }
  };

  // Ejecutar fetchPurchasedProducts cuando userProfile esté disponible
  useEffect(() => {
    if (userProfile) {
      fetchPurchasedProducts();
    }
  }, [userProfile]);

  // Verificar reseñas existentes cuando se cargan los productos
  useEffect(() => {
    if (purchasedProducts.length > 0 && userProfile) {
      checkExistingReviews();
    }
  }, [purchasedProducts, userProfile]);

  const checkExistingReviews = async () => {
    try {
      const reviewsData = {};
      
      for (const product of purchasedProducts) {
        const { data, error } = await supabase
          .from('reviews')
          .select('id, rating, comment, created_at, image_url')
          .eq('buyer_id', userProfile.id)
          .eq('seller_id', product.Users?.id)
          .eq('product_id', product.id)
          .single();
        
        if (!error && data) {
          reviewsData[product.id] = data;
        }
      }
      
      setReviews(reviewsData);
    } catch (error) {
      console.error('Error checking existing reviews:', error);
    }
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

  const handleReviewSubmit = async () => {
    try {
      if (!selectedProduct || !userProfile) return;
      if (!reviewForm.comment || !reviewForm.comment.trim()) {
        alert('Por favor, escribe un comentario para la reseña');
        return;
      }
      setIsUploading(true);
      
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
          buyer_id: userProfile.id,
          seller_id: selectedProduct.Users?.id,
          product_id: selectedProduct.id,
          rating: reviewForm.rating,
          comment: reviewForm.comment,
          image_url: imagePath
        });
      
      if (error) throw error;
      
      // Actualizar el estado local
      setReviews(prev => ({
        ...prev,
        [selectedProduct.id]: {
          rating: reviewForm.rating,
          comment: reviewForm.comment,
          created_at: new Date().toISOString(),
          image_url: imagePath
        }
      }));
      
      // Cerrar modal y resetear formulario
      setShowReviewModal(false);
      setSelectedProduct(null);
      setReviewForm({ rating: 5, comment: '' });
      setReviewImage(null);
      setImagePreview(null);
      
      alert('Reseña enviada exitosamente');
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Error al enviar la reseña');
    } finally {
      setIsUploading(false);
    }
  };

  const openReviewModal = (product) => {
    setSelectedProduct(product);
    setShowReviewModal(true);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Fecha no disponible';
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatPrice = (price) => {
    if (!price) return 'Precio no disponible';
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(price);
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath || imagePath === '/img/resmoke/noFoto.png') {
      return '/img/resmoke/noFoto.png';
    }
    
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    
    const { data } = supabase.storage
      .from('product-images')
      .getPublicUrl(imagePath);
    
    return data.publicUrl;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50/60">
        <Header />
        <div className="flex justify-center items-center h-64">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 rounded-full border-2 border-gray-200 border-t-gray-900 animate-spin" />
            <p className="text-sm text-gray-400 font-medium tracking-wide">Cargando compras...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50/60">
        <Header />
        <div className="flex justify-center items-center h-64">
          <div className="text-red-600 text-center">
            <p className="text-xl font-semibold mb-2 text-gray-900">Error</p>
            <p>{error}</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const filtered = purchasedProducts.filter((p) => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return true;
    return (
      (p.title || '').toLowerCase().includes(q) ||
      (p.description || '').toLowerCase().includes(q) ||
      (p.categories?.name || '').toLowerCase().includes(q) ||
      (p.Users?.nombre || '').toLowerCase().includes(q)
    );
  });

  const displayPurchases = [...filtered].sort((a, b) => {
    if (sortBy === 'price_asc') return (Number(a.sale_price || a.price) || 0) - (Number(b.sale_price || b.price) || 0);
    if (sortBy === 'price_desc') return (Number(b.sale_price || b.price) || 0) - (Number(a.sale_price || a.price) || 0);
    return new Date(b.sold_date || 0).getTime() - new Date(a.sold_date || 0).getTime();
  });

  const totalSpent = purchasedProducts.reduce((total, product) => total + (product.sale_price || product.price || 0), 0);
  const uniqueSellers = new Set(purchasedProducts.map(p => p.Users?.id)).size;

  return (
    <div className="min-h-screen bg-gray-50/60">
      <Header />

      {/* ── Hero Banner ── */}
      <div className="relative">
        <div className="h-40 sm:h-48 bg-gradient-to-br from-gray-100 via-gray-50 to-gray-200 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-white/40 to-transparent" />
          <div className="absolute top-0 right-0 w-80 h-80 bg-gray-200/30 rounded-full -translate-y-1/2 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-gray-200/30 rounded-full translate-y-1/3 -translate-x-1/4" />
        </div>
        <div className="absolute inset-0 flex items-end">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pb-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">Mis Compras</h1>
                <p className="text-sm text-gray-500 mt-1">{purchasedProducts.length} productos comprados</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Stats row ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-5 relative z-10">
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
            <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Comprados</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{purchasedProducts.length}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
            <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Gastado</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{formatPrice(totalSpent)}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
            <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Vendedores</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{uniqueSellers}</p>
          </div>
        </div>
      </div>

      {/* ── Search + Sort + View Toggle ── */}
      <div className="border-b border-gray-200 bg-white/80 backdrop-blur-sm mt-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por título, vendedor o categoría..."
                className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400 transition-all bg-white"
              />
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400 bg-white"
            >
              <option value="recent">Más recientes</option>
              <option value="price_asc">Menor precio</option>
              <option value="price_desc">Mayor precio</option>
            </select>
            <div className="flex rounded-xl border border-gray-200 overflow-hidden">
              <button
                onClick={() => setViewMode('list')}
                className={`px-3.5 py-2.5 text-sm transition ${viewMode === 'list' ? 'bg-gray-900 text-white' : 'bg-white text-gray-500 hover:bg-gray-50'}`}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3.5 py-2.5 text-sm transition ${viewMode === 'grid' ? 'bg-gray-900 text-white' : 'bg-white text-gray-500 hover:bg-gray-50'}`}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {displayPurchases.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 max-w-md mx-auto">
              <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No tienes compras</h3>
              <p className="text-sm text-gray-500 mb-8">Cuando compres productos, aparecerán aquí.</p>
              <Link
                to="/productos"
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-all shadow-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Explorar productos
              </Link>
            </div>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
            {displayPurchases.map((product) => (
              <div key={product.id} className="group bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-lg hover:border-gray-200 transition-all duration-300">
                <Link to={`/product/${product.id}`}>
                  <div className="relative overflow-hidden aspect-[4/3] bg-gray-50">
                    <img
                      alt={product.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      src={getImageUrl(product.main_image)}
                      onError={(e) => { e.target.src = '/img/resmoke/noFoto.png'; }}
                    />
                    <div className="absolute top-3 right-3">
                      <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-green-500 text-white shadow-sm">Comprado</span>
                    </div>
                  </div>
                </Link>
                <div className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <Link to={`/product/${product.id}`}>
                        <h2 className="text-sm font-semibold text-gray-900 leading-snug hover:text-gray-700 transition-colors line-clamp-2">{product.title}</h2>
                      </Link>
                      <div className="flex items-center gap-1.5 mt-1">
                        {product.categories && (
                          <span className="text-[11px] font-medium text-gray-400 bg-gray-50 border border-gray-100 px-2 py-0.5 rounded-full">{product.categories.name}</span>
                        )}
                        {product.Users?.nombre && (
                          <span className="text-[11px] text-gray-400">{product.Users.nombre}</span>
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-400 mt-1.5">
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {formatDate(product.sold_date)}
                      </div>
                    </div>
                    <span className="text-base font-bold text-gray-900 whitespace-nowrap">{formatPrice(product.sale_price || product.price)}</span>
                  </div>
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    {reviews[product.id] ? (
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-green-600">Reseña realizada</span>
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <svg key={i} className={`w-3.5 h-3.5 ${i < reviews[product.id].rating ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => openReviewModal(product)}
                        className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 bg-gray-900 hover:bg-gray-800 text-white text-xs font-medium rounded-xl transition-all"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                        </svg>
                        Poner reseña
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {displayPurchases.map((product) => (
              <div key={product.id} className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-gray-200 transition-all duration-200">
                <Link to={`/product/${product.id}`} className="flex items-center gap-4 p-3">
                  <div className="shrink-0 relative">
                    <img
                      src={getImageUrl(product.main_image)}
                      alt={product.title}
                      className="w-20 h-20 rounded-xl object-cover"
                      onError={(e) => { e.target.src = '/img/resmoke/noFoto.png'; }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h2 className="text-sm font-semibold text-gray-900 truncate group-hover:text-gray-700 transition-colors">{product.title}</h2>
                      <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-green-50 text-green-700 border border-green-200 shrink-0">Comprado</span>
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      {product.categories && (
                        <span className="text-[11px] font-medium text-gray-400 bg-gray-50 border border-gray-100 px-2 py-0.5 rounded-full">{product.categories.name}</span>
                      )}
                      {product.Users?.nombre && (
                        <span className="text-[11px] text-gray-400">· {product.Users.nombre}</span>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 line-clamp-1 mt-1">{product.description}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <span className="text-base font-bold text-gray-900">{formatPrice(product.sale_price || product.price)}</span>
                    {reviews[product.id] ? (
                      <span className="text-[11px] text-green-600">Reseña hecha</span>
                    ) : (
                      <button
                        onClick={(e) => { e.preventDefault(); openReviewModal(product); }}
                        className="text-xs font-medium px-3 py-1.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-all"
                      >
                        Reseñar
                      </button>
                    )}
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal de reseña */}
      {showReviewModal && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Escribir reseña</h3>
                <button
                  onClick={() => {
                    setShowReviewModal(false);
                    setSelectedProduct(null);
                    setReviewForm({ rating: 5, comment: '' });
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <img
                    src={getImageUrl(selectedProduct.main_image)}
                    alt={selectedProduct.title}
                    className="w-16 h-16 object-cover rounded-lg"
                    onError={(e) => { e.target.src = '/img/resmoke/noFoto.png'; }}
                  />
                  <div>
                    <h4 className="font-medium text-gray-900 line-clamp-2">{selectedProduct.title}</h4>
                    <p className="text-sm text-gray-600">Vendedor: {selectedProduct.Users?.nombre}</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Calificación</label>
                  <div className="flex items-center space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setReviewForm(prev => ({ ...prev, rating: star }))}
                        className={`w-8 h-8 ${
                          star <= reviewForm.rating ? 'text-yellow-400' : 'text-gray-300'
                        } hover:text-yellow-400 transition-colors`}
                      >
                        <svg fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      </button>
                    ))}
                    <span className="ml-2 text-sm text-gray-600">({reviewForm.rating} estrella{reviewForm.rating !== 1 ? 's' : ''})</span>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Comentario (opcional)</label>
                  <textarea
                    value={reviewForm.comment}
                    onChange={(e) => setReviewForm(prev => ({ ...prev, comment: e.target.value }))}
                    placeholder="Comparte tu experiencia con este vendedor..."
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                    maxLength={500}
                  />
                  <p className="text-xs text-gray-500 mt-1">{reviewForm.comment.length}/500 caracteres</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Foto (opcional)</label>
                  {!imagePreview ? (
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-gray-400 transition-colors cursor-pointer"
                         onClick={() => document.getElementById('review-image-upload').click()}>
                      <div className="space-y-1 text-center">
                        <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                          <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <div className="flex text-sm text-gray-600">
                          <span className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500">Subir un archivo</span>
                          <p className="pl-1">o arrastrar y soltar</p>
                        </div>
                        <p className="text-xs text-gray-500">PNG, JPG, GIF hasta 5MB</p>
                      </div>
                      <input id="review-image-upload" type="file" className="sr-only" accept="image/*" onChange={handleImageChange} />
                    </div>
                  ) : (
                    <div className="relative mt-2">
                      <img src={imagePreview} alt="Preview" className="h-48 w-full object-cover rounded-lg" />
                      <button onClick={removeImage} className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full hover:bg-red-700 transition-colors shadow-sm">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => {
                    setShowReviewModal(false);
                    setSelectedProduct(null);
                    setReviewForm({ rating: 5, comment: '' });
                    setReviewImage(null);
                    setImagePreview(null);
                  }}
                  disabled={isUploading}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleReviewSubmit}
                  disabled={isUploading}
                  className="flex-1 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 flex items-center justify-center"
                >
                  {isUploading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Enviando...
                    </>
                  ) : 'Enviar reseña'}
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



export default PurchasesPage;


// Estilos adicionales para line-clamp
const styles = `
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
`;

// Inyectar estilos
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}
