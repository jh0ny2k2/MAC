import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import Header from '../../components/Layout/HeaderProducts';
import Footer from '../../components/Layout/Footer';
import { AdMobile } from '../../components/Ads';

const FavoritesPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState(null);
  const [favoriteProducts, setFavoriteProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('recent');
  const [viewMode, setViewMode] = useState('grid');
  const [savedSearches, setSavedSearches] = useState([]);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchUserProfile();
    fetchFavoriteProducts();
  }, [user, navigate]);

  const getSavedSearchStorageKey = () => {
    if (!user?.email) return null;
    return `resmoke:savedSearches:${user.email.toLowerCase().trim()}`;
  };

  const loadSavedSearches = () => {
    const storageKey = getSavedSearchStorageKey();
    if (!storageKey) return [];
    try {
      const raw = localStorage.getItem(storageKey);
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  };

  const persistSavedSearches = (items) => {
    const storageKey = getSavedSearchStorageKey();
    if (!storageKey) return;
    localStorage.setItem(storageKey, JSON.stringify(items));
  };

  useEffect(() => {
    if (!user?.email) return;
    setSavedSearches(loadSavedSearches());
  }, [user?.email]);

  const updateSavedSearch = (searchId, patch) => {
    const next = savedSearches.map((s) => (s?.id === searchId ? { ...s, ...patch } : s));
    setSavedSearches(next);
    persistSavedSearches(next);
  };

  const deleteSavedSearch = (searchId) => {
    const next = savedSearches.filter((s) => s?.id !== searchId);
    setSavedSearches(next);
    persistSavedSearches(next);
  };

  const formatSavedSearchSubtitle = (s) => {
    const categoryName = s?.display?.categoryName || null;
    const query = s?.display?.searchQuery || s?.criteria?.searchQuery || '';
    const bits = [];
    if (categoryName) bits.push(categoryName);
    if (query) bits.push(`"${query}"`);
    const location = s?.criteria?.filters?.location || '';
    if (location) bits.push(location);
    const minPrice = s?.criteria?.filters?.minPrice || '';
    const maxPrice = s?.criteria?.filters?.maxPrice || '';
    if (minPrice || maxPrice) {
      const min = minPrice ? formatPrice(minPrice) : '—';
      const max = maxPrice ? formatPrice(maxPrice) : '—';
      bits.push(`${min} – ${max}`);
    }
    return bits.length ? bits.join(' · ') : 'Sin filtros';
  };

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

  const fetchFavoriteProducts = async () => {
    try {
      const { data: userData, error: userError } = await supabase
        .from('Users')
        .select('id')
        .eq('email', user.email)
        .single();

      if (userError) throw userError;

      const { data, error } = await supabase
        .from('favorites')
        .select(`
          id,
          product_id,
          created_at,
          products (
            id,
            name,
            description,
            price,
            main_image,
            location,
            status,
            categories (
              id,
              name
            )
          )
        `)
        .eq('user_id', userData.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setFavoriteProducts(data || []);
    } catch (error) {
      console.error('Error fetching favorite products:', error);
      setError('Error al cargar los productos favoritos');
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (value) => {
    const n = Number(value) || 0;
    return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n);
  };

  const statusBadge = (status) => {
    const s = (status || '').toLowerCase();
    const map = {
      available: { text: 'Disponible', bg: 'bg-emerald-50', color: 'text-emerald-600' },
      reserved: { text: 'Reservado', bg: 'bg-amber-50', color: 'text-amber-600' },
      sold: { text: 'Vendido', bg: 'bg-red-50', color: 'text-red-600' }
    };
    const m = map[s] || { text: '—', bg: 'bg-gray-50', color: 'text-gray-600' };
    return <span className={`${m.bg} ${m.color} text-xs font-medium px-2.5 py-1 rounded-full border ${s === 'available' ? 'border-emerald-200/50' : s === 'reserved' ? 'border-amber-200/50' : s === 'sold' ? 'border-red-200/50' : 'border-gray-200/50'}`}>{m.text}</span>;
  };

  const removeFavorite = async (productId) => {
    try {
      const { data: userData, error: userError } = await supabase
        .from('Users')
        .select('id')
        .eq('email', user.email)
        .single();

      if (userError) throw userError;

      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('user_id', userData.id)
        .eq('product_id', productId);

      if (error) throw error;

      setFavoriteProducts(prev =>
        prev.filter(fav => fav.product_id !== productId)
    );

    } catch (error) {
      console.error('Error removing favorite:', error);
      alert('Error al eliminar de favoritos');
    }
  };

  const getProductImage = (product) => {
    if (product.main_image && product.main_image !== '/img/resmoke/noFoto.png') {
      return product.main_image;
    }
    return '/img/resmoke/noFoto.png';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50/60">
        <Header />
        <div className="flex justify-center items-center h-64">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 rounded-full border-2 border-gray-200 border-t-gray-900 animate-spin" />
            <p className="text-sm text-gray-400 font-medium tracking-wide">Cargando favoritos...</p>
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

  const filtered = favoriteProducts.filter((fav) => {
    const p = fav.products || {};
    const q = searchTerm.trim().toLowerCase();
    if (!q) return true;
    return (
      (p.name || '').toLowerCase().includes(q) ||
      (p.description || '').toLowerCase().includes(q) ||
      (p.categories?.name || '').toLowerCase().includes(q) ||
      (p.location || '').toLowerCase().includes(q)
    );
  });

  const displayFavorites = [...filtered].sort((a, b) => {
    if (sortBy === 'price_asc') return (Number(a.products?.price) || 0) - (Number(b.products?.price) || 0);
    if (sortBy === 'price_desc') return (Number(b.products?.price) || 0) - (Number(a.products?.price) || 0);
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

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
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">Favoritos</h1>
                <p className="text-sm text-gray-500 mt-1">{favoriteProducts.length} productos guardados</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Search + Filters Bar ── */}
      <div className="border-b border-gray-200 bg-white/80 backdrop-blur-sm">
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
                placeholder="Buscar en favoritos..."
                className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400 transition-all bg-white"
              />
            </div>
            <div className="flex items-center gap-2">
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
                  onClick={() => setViewMode('grid')}
                  className={`px-3.5 py-2.5 text-sm transition ${viewMode === 'grid' ? 'bg-gray-900 text-white' : 'bg-white text-gray-500 hover:bg-gray-50'}`}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-3.5 py-2.5 text-sm transition ${viewMode === 'list' ? 'bg-gray-900 text-white' : 'bg-white text-gray-500 hover:bg-gray-50'}`}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        <AdMobile className="mb-6" />

        {/* Saved Searches */}
        {savedSearches.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                  <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-gray-900">Alertas de búsqueda</h2>
                  <p className="text-xs text-gray-400">{savedSearches.length} guardadas</p>
                </div>
              </div>
              <Link to="/productos" className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-all shadow-sm">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                Nueva alerta
              </Link>
            </div>
            <div className="space-y-3">
              {savedSearches.map((s) => (
                <div key={s.id} className="border border-gray-100 rounded-xl p-4 hover:border-gray-200 transition-all">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">{s.name || 'Búsqueda guardada'}</p>
                      <p className="text-xs text-gray-400 truncate mt-0.5">{formatSavedSearchSubtitle(s)}</p>
                    </div>
                    <button onClick={() => deleteSavedSearch(s.id)} className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors shrink-0">
                      <svg className="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                      </svg>
                    </button>
                  </div>
                  <div className="mt-3 flex items-center gap-4">
                    <label className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer">
                      <input type="checkbox" checked={Boolean(s.notifyNewProducts)} onChange={(e) => updateSavedSearch(s.id, { notifyNewProducts: e.target.checked })} className="w-3.5 h-3.5 rounded border-gray-300 text-gray-900 focus:ring-gray-900" />
                      Nuevos productos
                    </label>
                    <label className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer">
                      <input type="checkbox" checked={Boolean(s.notifyPriceDrops)} onChange={(e) => updateSavedSearch(s.id, { notifyPriceDrops: e.target.checked })} className="w-3.5 h-3.5 rounded border-gray-300 text-gray-900 focus:ring-gray-900" />
                      Bajadas de precio
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Products */}
        {displayFavorites.length > 0 ? (
          viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {displayFavorites.map((favorite) => {
                const product = favorite.products;
                return (
                  <div key={favorite.id} className="group bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-lg hover:border-gray-200 transition-all duration-300">
                    <Link to={`/product/${product.id}`}>
                      <div className="relative overflow-hidden aspect-[4/3] bg-gray-50">
                        <img
                          alt={product.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          src={getProductImage(product)}
                        />
                        <button
                          onClick={(e) => { e.preventDefault(); removeFavorite(product.id); }}
                          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-white hover:scale-110 shadow-sm"
                          title="Eliminar de favoritos"
                        >
                          <svg className="w-3.5 h-3.5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
                          </svg>
                        </button>
                      </div>
                    </Link>
                    <div className="p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <Link to={`/product/${product.id}`}>
                            <h2 className="text-sm font-semibold text-gray-900 leading-snug hover:text-gray-700 transition-colors line-clamp-2">{product.name}</h2>
                          </Link>
                          <div className="flex items-center gap-1.5 mt-1">
                            {product.categories && (
                              <span className="text-[11px] font-medium text-gray-400 bg-gray-50 border border-gray-100 px-2 py-0.5 rounded-full">{product.categories.name}</span>
                            )}
                            {statusBadge(product.status)}
                          </div>
                          {product.location && (
                            <div className="flex items-center gap-1 text-xs text-gray-400 mt-1.5">
                              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                              </svg>
                              {product.location}
                            </div>
                          )}
                        </div>
                        <span className="text-base font-bold text-gray-900 whitespace-nowrap">{formatPrice(product.price)}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="space-y-2">
              {displayFavorites.map((favorite) => {
                const product = favorite.products;
                return (
                  <div key={favorite.id} className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-gray-200 transition-all duration-200">
                    <Link to={`/product/${product.id}`} className="flex items-center gap-4 p-3">
                      <div className="shrink-0 relative">
                        <img
                          src={getProductImage(product)}
                          alt={product.name}
                          className="w-20 h-20 rounded-xl object-cover"
                        />
                        <button
                          onClick={(e) => { e.preventDefault(); removeFavorite(product.id); }}
                          className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-white shadow-sm border border-gray-100 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-red-50 hover:border-red-200"
                          title="Eliminar de favoritos"
                        >
                          <svg className="w-3 h-3 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
                          </svg>
                        </button>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h2 className="text-sm font-semibold text-gray-900 truncate group-hover:text-gray-700 transition-colors">{product.name}</h2>
                        <div className="flex items-center gap-2 mt-0.5">
                          {product.categories && (
                            <span className="text-[11px] font-medium text-gray-400 bg-gray-50 border border-gray-100 px-2 py-0.5 rounded-full">{product.categories.name}</span>
                          )}
                          {statusBadge(product.status)}
                        </div>
                        {product.location && (
                          <div className="flex items-center gap-1 text-xs text-gray-400 mt-1">
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                            </svg>
                            {product.location}
                          </div>
                        )}
                      </div>
                      <span className="text-base font-bold text-gray-900 whitespace-nowrap shrink-0">{formatPrice(product.price)}</span>
                    </Link>
                  </div>
                );
              })}
            </div>
          )
        ) : (
          /* Empty State */
          <div className="text-center py-16">
            <div className="max-w-sm mx-auto">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                {searchTerm ? 'Sin resultados' : 'No tienes favoritos'}
              </h3>
              <p className="text-sm text-gray-400 mb-6">
                {searchTerm
                  ? `No encontramos "${searchTerm}" en tus favoritos.`
                  : 'Explora productos y guarda los que más te gusten.'}
              </p>
              <Link
                to="/productos"
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-all font-medium text-sm shadow-sm"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Explorar productos
              </Link>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default FavoritesPage;
