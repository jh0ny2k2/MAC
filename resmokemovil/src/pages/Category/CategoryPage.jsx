import React, { useState, useEffect } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import Header from '../../components/Layout/HeaderProducts';
import Footer from '../../components/Layout/Footer';

import { AdSidebar, AdMobile } from '../../components/Ads';
import LazyAdBanner from '../../components/Ads/LazyAdBanner';
import { adsenseConfig } from '../../config/googleAdsense';
import SEO from '../../components/SEO/SEO';
import { generateProductListStructuredData } from '../../utils/structuredData';
import ProductCard from '../Home/components/Products/ProductCard';

const CategoryPage = () => {
  const { categoryId } = useParams();
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Estados para filtros
  const [filters, setFilters] = useState({
    minPrice: '',
    maxPrice: '',
    sortBy: 'newest',
    location: '',
    radius: 50
  });
  const [userLocation, setUserLocation] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  
  // Encontrar la categoría actual
  const currentCategory = categories.find(cat => cat.id === parseInt(categoryId));
  
  // Función para aplicar todos los filtros
  const applyFilters = (productList) => {
    let filtered = [...productList];
    
    if (categoryId) {
      filtered = filtered.filter(producto => producto.category_id === parseInt(categoryId));
    }
    
    if (searchQuery) {
      filtered = filtered.filter(producto => 
        producto.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        producto.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    if (filters.minPrice) {
      filtered = filtered.filter(producto => producto.price >= parseFloat(filters.minPrice));
    }
    
    if (filters.maxPrice) {
      filtered = filtered.filter(producto => producto.price <= parseFloat(filters.maxPrice));
    }
    
    if (filters.location) {
      filtered = filtered.filter(producto => 
        producto.location?.toLowerCase().includes(filters.location.toLowerCase())
      );
    }
    
    if (userLocation && filters.radius && filters.sortBy === 'distance') {
      filtered = filtered.filter(producto => {
        if (producto.latitude && producto.longitude) {
          const distance = calculateDistance(
            userLocation.lat, userLocation.lng,
            producto.latitude, producto.longitude
          );
          return distance <= filters.radius;
        }
        return true;
      });
    }
    
    const sortBySelected = (list) => {
      const arr = [...list];
      switch (filters.sortBy) {
        case 'price-low':
          arr.sort((a, b) => a.price - b.price);
          break;
        case 'price-high':
          arr.sort((a, b) => b.price - a.price);
          break;
        case 'distance':
          if (userLocation) {
            arr.sort((a, b) => {
              const distanceA = (a.latitude && a.longitude) ? 
                calculateDistance(userLocation.lat, userLocation.lng, a.latitude, a.longitude) : Infinity;
              const distanceB = (b.latitude && b.longitude) ? 
                calculateDistance(userLocation.lat, userLocation.lng, b.latitude, b.longitude) : Infinity;
              return distanceA - distanceB;
            });
          }
          break;
        case 'oldest':
          arr.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
          break;
        case 'newest':
        default:
          arr.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
          break;
      }
      return arr;
    };

    const promoted = filtered.filter(p => p.promoted === 'YES');
    const regular = filtered.filter(p => p.promoted !== 'YES');

    const sortedPromoted = sortBySelected(promoted);
    const sortedRegular = sortBySelected(regular);

    return [...sortedPromoted, ...sortedRegular];
  };

  const filteredProducts = applyFilters(products);

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      minPrice: '',
      maxPrice: '',
      sortBy: 'newest',
      location: '',
      radius: 10
    });
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*');
      
      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }
      setCategories(data || []);
    } catch (error) {
      console.error('Error al obtener categorías:', error);
      setError('Error al cargar las categorías');
    }
  };

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          categories (id, name)
        `);
      
      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }
      
      const availableProducts = (data || []).filter(product => product.status === 'available');
      
      const promotedProducts = availableProducts.filter(product => {
        return product.promoted === 'YES';
      });
      const regularProducts = availableProducts.filter(product => product.promoted !== 'YES');
      
      const shuffleArray = (array) => {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
      };
      
      const shuffledPromoted = shuffleArray(promotedProducts);
      const shuffledRegular = shuffleArray(regularProducts);
      
      const allProducts = [
        ...shuffledPromoted,
        ...shuffledRegular
      ];
      
      setProducts(allProducts);
    } catch (error) {
      console.error('Error al obtener productos:', error);
      setError('Error al cargar los productos');
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchCategories(), fetchProducts()]);
      setLoading(false);
    };
    
    loadData();
    getUserLocation();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlFilters = {
      minPrice: params.get('minPrice') || '',
      maxPrice: params.get('maxPrice') || '',
      sortBy: params.get('sortBy') || 'newest',
      location: params.get('location') || '',
      radius: parseInt(params.get('radius')) || 10
    };
    
    const hasChanges = Object.keys(urlFilters).some(key => 
      urlFilters[key] !== filters[key]
    );
    
    if (hasChanges) {
      setFilters(urlFilters);
    }
  }, [searchParams]);

  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== '' && !(key === 'sortBy' && value === 'newest') && !(key === 'radius' && value === 10)) {
        params.set(key, value.toString());
      } else {
        params.delete(key);
      }
    });
    
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState({}, '', newUrl);
  }, [filters, searchParams]);

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error('Error obteniendo ubicación:', error);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000
        }
      );
    }
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
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

  const getPageTitle = () => {
    if (searchQuery && categoryId && currentCategory) {
      return `Resultados para "${searchQuery}" en ${currentCategory.name}`;
    } else if (searchQuery) {
      return `Resultados para "${searchQuery}"`;
    } else if (categoryId && currentCategory) {
      return currentCategory.name;
    } else {
      return 'Todos los productos';
    }
  };

  const getSEOData = () => {
    if (searchQuery) {
      return {
        title: `Resultados para "${searchQuery}" - Resmoke`,
        description: `Encuentra ${filteredProducts.length} productos relacionados con "${searchQuery}" en Resmoke. Compra y vende productos de segunda mano en Lima, Perú.`,
        keywords: `segunda mano, ${searchQuery}, productos usados, ${currentCategory?.name || 'productos'}, usadas, cachimba, shisha, hookah, narguile, pipa de agua, vapers, e-cig, accesorios shisha, comprar, vender, Lima, Perú`
      };
    } else if (categoryId && currentCategory) {
      return {
        title: `${currentCategory.name} de segunda mano en Lima | Resmoke`,
        description: `Encuentra ${filteredProducts.length} ${currentCategory.name.toLowerCase()} de segunda mano en Lima. Compra y vende ${currentCategory.name.toLowerCase()} usadas con confianza en Resmoke.`,
        keywords: `segunda mano, ${currentCategory.name}, ${currentCategory.name.toLowerCase()} usadas, productos usados, cachimba, shisha, hookah, narguile, pipa de agua, vapers, e-cig, accesorios shisha, comprar, vender, Lima, Perú`
      };
    } else {
      return {
        title: 'Todos los Productos - Resmoke',
        description: `Explora ${filteredProducts.length} productos de segunda mano en Resmoke. La mejor plataforma para comprar y vender en Lima, Perú.`,
        keywords: 'segunda mano, productos usados, resmoke, cachimba, shisha, hookah, narguile, pipa de agua, vapers, e-cig, accesorios shisha, comprar, vender, marketplace, Lima, Perú'
      };
    }
  };

  const seoData = getSEOData();

  const hasActiveFilters = filters.minPrice || filters.maxPrice || filters.location || filters.sortBy !== 'newest';

  const productCount = filteredProducts.length;

  return (
    <div className="min-h-screen bg-gray-50">
      <SEO 
        title={seoData.title}
        description={seoData.description}
        keywords={seoData.keywords}
        url={`${categoryId ? `/web/verCategoria/${categoryId}` : '/productos'}${searchQuery ? `?search=${encodeURIComponent(searchQuery)}` : ''}`}
        type="website"
        structuredData={generateProductListStructuredData(
          filteredProducts.map(product => ({
            id: product.id,
            title: product.title,
            description: product.description,
            image: product.images && product.images.length > 0 ? product.images[0] : '/default-product.jpg',
            price: product.price,
            category: currentCategory?.name || 'Sin categoría',
            disponible: product.status === 'available'
          }))
        )}
      />
      <Header />

      {/* Hero Banner */}
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
                <h1 className="text-xl sm:text-3xl font-bold text-gray-900 tracking-tight">{getPageTitle()}</h1>
                <p className="text-xs sm:text-sm text-gray-500 mt-0.5 sm:mt-1">{productCount} producto{productCount !== 1 ? 's' : ''} disponible{productCount !== 1 ? 's' : ''}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-4 sm:-mt-5 relative z-10">
        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          <div className="bg-white rounded-lg sm:rounded-xl border border-gray-100 shadow-sm p-3 sm:p-4">
            <p className="text-[10px] sm:text-xs text-gray-400 font-medium uppercase tracking-wide">Total</p>
            <p className="text-lg sm:text-2xl font-bold text-gray-900 mt-0.5 sm:mt-1">{productCount}</p>
          </div>
          <div className="bg-white rounded-lg sm:rounded-xl border border-gray-100 shadow-sm p-3 sm:p-4">
            <p className="text-[10px] sm:text-xs text-gray-400 font-medium uppercase tracking-wide">Categoría</p>
            <p className="text-sm sm:text-lg font-bold text-gray-900 mt-0.5 sm:mt-1 truncate">{currentCategory?.name || 'Todas'}</p>
          </div>
          <div className="bg-white rounded-lg sm:rounded-xl border border-gray-100 shadow-sm p-3 sm:p-4">
            <p className="text-[10px] sm:text-xs text-gray-400 font-medium uppercase tracking-wide">Filtros</p>
            <p className="text-lg sm:text-2xl font-bold text-gray-900 mt-0.5 sm:mt-1">{hasActiveFilters ? 'Activos' : '—'}</p>
          </div>
        </div>
      </div>

      {/* Filter bar */}
      <div className="border-b border-gray-200 bg-white/80 backdrop-blur-sm mt-4 sm:mt-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
            <button
              onClick={toggleFilters}
              className={`inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-medium rounded-xl transition-all whitespace-nowrap ${showFilters ? 'bg-gray-900 text-white shadow-sm' : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'}`}
            >
              <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 01-.659 1.591l-5.432 5.432a2.25 2.25 0 00-.659 1.591v2.927a2.25 2.25 0 01-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 00-.659-1.591L3.659 7.409A2.25 2.25 0 013 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0112 3z" />
              </svg>
              Filtros
            </button>

            <div className="flex-1" />

            <div className="relative flex-1 sm:flex-initial sm:min-w-[200px]">
              <div className="absolute inset-y-0 left-0 pl-3 flex sm:pl-3.5 items-center pointer-events-none">
                <svg className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                value={filters.location}
                onChange={(e) => handleFilterChange('location', e.target.value)}
                placeholder="Ubicación..."
                className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400 transition-all bg-white"
              />
            </div>

            <select
              value={filters.sortBy}
              onChange={(e) => handleFilterChange('sortBy', e.target.value)}
              className="px-3 sm:px-3.5 py-2 sm:py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400 bg-white"
            >
              <option value="newest">Más recientes</option>
              <option value="oldest">Más antiguos</option>
              <option value="price-low">Menor precio</option>
              <option value="price-high">Mayor precio</option>
              {userLocation && <option value="distance">Distancia</option>}
            </select>
          </div>

          {/* Filter panel */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <div>
                  <label className="block text-[11px] sm:text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wider">Precio mínimo</label>
                  <input
                    type="number"
                    value={filters.minPrice}
                    onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                    placeholder="0"
                    min="0"
                    className="w-full px-3 sm:px-3.5 py-2 sm:py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400 transition-all bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] sm:text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wider">Precio máximo</label>
                  <input
                    type="number"
                    value={filters.maxPrice}
                    onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                    placeholder="Sin límite"
                    min="0"
                    className="w-full px-3 sm:px-3.5 py-2 sm:py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400 transition-all bg-white"
                  />
                </div>

                {userLocation && (
                  <div>
                    <label className="block text-[11px] sm:text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wider">Radio (km)</label>
                    <select
                      value={filters.radius}
                      onChange={(e) => handleFilterChange('radius', parseInt(e.target.value))}
                      className="w-full px-3 sm:px-3.5 py-2 sm:py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400 bg-white"
                    >
                      <option value={5}>5 km</option>
                      <option value={10}>10 km</option>
                      <option value={25}>25 km</option>
                      <option value={50}>50 km</option>
                      <option value={100}>100 km</option>
                      <option value={500}>500 km</option>
                    </select>
                  </div>
                )}

                {!userLocation && (
                  <div>
                    <label className="block text-[11px] sm:text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wider">&nbsp;</label>
                    <button
                      onClick={getUserLocation}
                      className="w-full inline-flex items-center justify-center gap-1.5 px-3 sm:px-3.5 py-2 sm:py-2.5 text-sm font-medium border border-gray-200 rounded-xl hover:bg-gray-50 transition-all bg-white text-gray-700"
                    >
                      <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                      </svg>
                      Activar ubicación
                    </button>
                  </div>
                )}

                <div className="flex items-end">
                  <button
                    onClick={clearFilters}
                    className="w-full inline-flex items-center justify-center gap-1.5 px-3 sm:px-3.5 py-2 sm:py-2.5 text-sm font-medium border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all bg-white text-gray-600"
                  >
                    <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Limpiar
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Ad mobile top */}
      <div className="block lg:hidden my-4">
        <AdMobile className="mx-auto w-full max-w-[320px]" />
      </div>

      {/* Main content with sidebar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar ads (desktop) */}
          <aside className="hidden lg:block w-[300px] shrink-0">
            <div className="sticky top-24 space-y-6">
              <AdSidebar className="w-[300px]" />
            </div>
          </aside>

          {/* Main content */}
          <div className="flex-1 min-w-0">
            {productCount > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {filteredProducts.map((producto, index) => (
                  <React.Fragment key={producto.id}>
                    <ProductCard producto={producto} />
                    {(index + 1) % 6 === 0 && (
                      <div className="col-span-full flex justify-center py-2">
                        <LazyAdBanner
                          adSlot={adsenseConfig.adUnits.banner.slot}
                          adFormat="auto"
                          className="w-full max-w-2xl"
                          style={{ height: '90px' }}
                          threshold={0.4}
                        />
                      </div>
                    )}
                  </React.Fragment>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 sm:py-16">
                <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl p-6 sm:p-10 max-w-lg mx-auto border border-gray-100">
                  <div className="bg-gray-100 rounded-full w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center mx-auto mb-4 sm:mb-6">
                    <svg className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m6 4.125l2.25 2.25m0 0l2.25 2.25M12 11.625l2.25-2.25M12 11.625l-2.25 2.25M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                    </svg>
                  </div>
                  <h3 className="text-base sm:text-xl font-bold text-gray-900 mb-2">
                    {searchQuery ? 'No se encontraron productos' : 
                     (categoryId ? 'No hay productos en esta categoría' : 'No hay productos disponibles')}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-500 mb-6">
                    {searchQuery ? 'Intenta con otros términos de búsqueda o ajusta los filtros.' : 
                     'Vuelve más tarde para ver nuevos productos.'}
                  </p>
                  {searchQuery && (
                    <div className="flex flex-wrap items-center justify-center gap-3">
                      <Link 
                        to="/productos" 
                        className="inline-flex items-center px-4 sm:px-5 py-2.5 sm:py-3 bg-gray-900 hover:bg-gray-800 text-white text-sm font-semibold rounded-xl transition-all"
                      >
                        Ver todos los productos
                      </Link>
                      {categoryId && (
                        <Link 
                          to={`/web/verCategoria/${categoryId}`}
                          className="inline-flex items-center px-4 sm:px-5 py-2.5 sm:py-3 bg-white text-gray-700 border border-gray-200 hover:border-gray-300 text-sm font-semibold rounded-xl transition-all"
                        >
                          Ver categoría completa
                        </Link>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Ad mobile bottom */}
            <div className="block lg:hidden mt-6">
              <AdMobile className="mx-auto w-full max-w-[320px]" />
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CategoryPage;
