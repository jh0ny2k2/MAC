import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../components/Layout/AdminLayout';
import { supabase } from '../../lib/supabase';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [deleting, setDeleting] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [sortKey, setSortKey] = useState('created_at');
  const [sortDir, setSortDir] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(25);
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          categories (id, name)
        `);
      
      if (error) {
        console.error('Error en la consulta:', error);
        throw error;
      }
      
      setProducts(data || []);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error fetching products:', error);
      alert(`Error al cargar productos: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Función para abrir el modal de confirmación
  const openDeleteModal = (product) => {
    setProductToDelete(product);
    setShowDeleteModal(true);
  };

  // Función para cerrar el modal
  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setProductToDelete(null);
  };

  // Función para confirmar eliminación
  const confirmDelete = async () => {
    if (!productToDelete) return;

    try {
      setDeleting(productToDelete.id);
      
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productToDelete.id);

      if (error) {
        console.error('Error eliminando producto:', error);
        throw error;
      }

      setProducts(prevProducts => 
        prevProducts.filter(product => product.id !== productToDelete.id)
      );

      alert(`Producto "${productToDelete.name}" eliminado exitosamente`);
      
    } catch (error) {
      console.error('Error deleting product:', error);
      alert(`Error al eliminar el producto: ${error.message}`);
    } finally {
      setDeleting(null);
      closeDeleteModal();
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  const filteredProducts = products
    .filter(product => 
      product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(product => {
      if (statusFilter === 'all') return true;
      if (statusFilter === 'available') return product.status === 'available';
      if (statusFilter === 'sold') return product.status === 'sold';
      if (statusFilter === 'pending') return product.status !== 'available' && product.status !== 'sold';
      return true;
    });

  const setSort = (key) => {
    if (sortKey === key) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const getVal = (obj, path) => {
    return path.split('.').reduce((o, k) => (o && o[k] != null ? o[k] : null), obj);
  };

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (!sortKey) return 0;
    const va = getVal(a, sortKey);
    const vb = getVal(b, sortKey);
    const na = typeof va === 'string' ? va.toLowerCase() : va;
    const nb = typeof vb === 'string' ? vb.toLowerCase() : vb;
    if (na == null && nb == null) return 0;
    if (na == null) return sortDir === 'asc' ? 1 : -1;
    if (nb == null) return sortDir === 'asc' ? -1 : 1;
    if (na < nb) return sortDir === 'asc' ? -1 : 1;
    if (na > nb) return sortDir === 'asc' ? 1 : -1;
    return 0;
  });

  const totalPages = Math.max(1, Math.ceil(sortedProducts.length / perPage));
  const startIndex = (currentPage - 1) * perPage;
  const endIndex = startIndex + perPage;
  const pagedProducts = sortedProducts.slice(startIndex, endIndex);

  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, searchTerm]);

  // Modal de confirmación de eliminación
  const DeleteConfirmationModal = () => {
    if (!showDeleteModal || !productToDelete) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
          <div className="text-center">
            {/* Icono de advertencia */}
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-6">
              <svg className="h-8 w-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 15.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            
            {/* Título */}
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Confirmar Eliminación
            </h3>
            
            {/* Mensaje */}
            <p className="text-gray-600 mb-2">
              ¿Estás seguro de que quieres eliminar el producto:
            </p>
            <p className="text-lg font-semibold text-gray-900 mb-6">
              "{productToDelete.name}"?
            </p>
            <p className="text-sm text-red-600 mb-8">
              Esta acción no se puede deshacer.
            </p>
            
            {/* Botones */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={closeDeleteModal}
                disabled={deleting === productToDelete.id}
                className="px-6 py-3 bg-gray-200 text-gray-800 rounded-xl hover:bg-gray-300 transition-colors duration-200 font-medium disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                onClick={confirmDelete}
                disabled={deleting === productToDelete.id}
                className="px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors duration-200 font-medium disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {deleting === productToDelete.id ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Eliminando...
                  </>
                ) : (
                  'Eliminar Producto'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <AdminLayout
      title="Gestión de Productos"
      subtitle="Administra y supervisa todos los productos de la plataforma"
      headerActions={(
        <div className="w-full">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 md:gap-3">
            <form onSubmit={handleSearch} className="relative w-full sm:flex-1 min-w-[220px] sm:min-w-[280px] md:max-w-sm">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar productos..."
                className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm"
              />
              <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
                <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </form>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                aria-label="Filtrar por estado"
                className="w-full sm:w-[160px] px-2.5 py-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Todos</option>
                <option value="available">Disponibles</option>
                <option value="pending">Pendientes</option>
                <option value="sold">Vendidos</option>
              </select>
              <button onClick={fetchProducts} disabled={loading} className="inline-flex items-center px-3 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v6h6M20 20v-6h-6M5 19a9 9 0 0114-7" />
                </svg>
                {loading ? 'Actualizando...' : 'Actualizar'}
              </button>
            </div>
            <Link 
              to="/admin/productos/agregar"
              className="sm:ml-auto w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <span className="material-icons text-base mr-2">add</span>
              Nuevo
            </Link>
          </div>
        </div>
      )}
    >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-gray-100 text-gray-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Productos</p>
                <p className="text-3xl font-bold text-gray-900">{products.length.toLocaleString()}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-gray-100 text-gray-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Disponibles</p>
                <p className="text-3xl font-bold text-gray-900">{products.filter(p => p.status === 'available').length.toLocaleString()}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-gray-100 text-gray-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pendientes</p>
                <p className="text-3xl font-bold text-gray-900">{products.filter(p => p.status !== 'available' && p.status !== 'sold').length.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <Link to="/admin/productos/confirmaciones" className="inline-flex items-center px-3 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2" />
            </svg>
            Ver confirmaciones
          </Link>
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-3 flex items-center justify-between bg-gray-50 border-b border-gray-200">
            <div className="text-sm text-gray-600">Mostrando {sortedProducts.length === 0 ? 0 : startIndex + 1}–{Math.min(endIndex, sortedProducts.length)} de {sortedProducts.length}</div>
            <div className="flex items-center gap-3">
              <label className="text-sm text-gray-600">Items por página</label>
              <select value={perPage} onChange={(e) => setPerPage(Number(e.target.value))} className="px-2 py-1 border border-gray-300 rounded-lg bg-white text-sm">
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
              <div className="text-xs text-gray-500">{lastUpdated ? `Actualizado: ${new Date(lastUpdated).toLocaleString('es-ES')}` : ''}</div>
            </div>
          </div>
          {/* Desktop/Tablet Table */}
          <div className="max-h-[480px] overflow-y-auto hidden md:block">
            <table className="w-full table-fixed divide-y divide-gray-200" role="table">
              <thead className="bg-gray-50 sticky top-0 z-10">
                <tr>
                  <th scope="col" className="w-[24%] px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider" aria-sort={sortKey==='name' ? (sortDir==='asc'?'ascending':'descending') : 'none'}>
                    <button type="button" onClick={() => setSort('name')} className="inline-flex items-center group">Producto
                      <svg className={`ml-1 h-4 w-4 text-gray-400 group-hover:text-gray-600 transition-transform ${sortKey==='name' ? '' : 'opacity-0'} ${sortDir==='asc' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                    </button>
                  </th>
                  <th scope="col" className="w-[14%] px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider" aria-sort={sortKey==='categories.name' ? (sortDir==='asc'?'ascending':'descending') : 'none'}>
                    <button type="button" onClick={() => setSort('categories.name')} className="inline-flex items-center group">Categoría
                      <svg className={`ml-1 h-4 w-4 text-gray-400 group-hover:text-gray-600 transition-transform ${sortKey==='categories.name' ? '' : 'opacity-0'} ${sortDir==='asc' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                    </button>
                  </th>
                  <th scope="col" className="w-[10%] px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider" aria-sort={sortKey==='price' ? (sortDir==='asc'?'ascending':'descending') : 'none'}>
                    <button type="button" onClick={() => setSort('price')} className="inline-flex items-center group">Precio
                      <svg className={`ml-1 h-4 w-4 text-gray-400 group-hover:text-gray-600 transition-transform ${sortKey==='price' ? '' : 'opacity-0'} ${sortDir==='asc' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                    </button>
                  </th>
                  <th scope="col" className="w-[12%] px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider" aria-sort={sortKey==='status' ? (sortDir==='asc'?'ascending':'descending') : 'none'}>
                    <button type="button" onClick={() => setSort('status')} className="inline-flex items-center group">Estado
                      <svg className={`ml-1 h-4 w-4 text-gray-400 group-hover:text-gray-600 transition-transform ${sortKey==='status' ? '' : 'opacity-0'} ${sortDir==='asc' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                    </button>
                  </th>
                  <th scope="col" className="w-[14%] px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider hidden md:table-cell" aria-sort={sortKey==='location' ? (sortDir==='asc'?'ascending':'descending') : 'none'}>
                    <button type="button" onClick={() => setSort('location')} className="inline-flex items-center group">Ubicación
                      <svg className={`ml-1 h-4 w-4 text-gray-400 group-hover:text-gray-600 transition-transform ${sortKey==='location' ? '' : 'opacity-0'} ${sortDir==='asc' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                    </button>
                  </th>
                  <th scope="col" className="w-[8%] px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider hidden lg:table-cell" aria-sort={sortKey==='view_count' ? (sortDir==='asc'?'ascending':'descending') : 'none'}>
                    <button type="button" onClick={() => setSort('view_count')} className="inline-flex items-center group">Vistas
                      <svg className={`ml-1 h-4 w-4 text-gray-400 group-hover:text-gray-600 transition-transform ${sortKey==='view_count' ? '' : 'opacity-0'} ${sortDir==='asc' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                    </button>
                  </th>
                  <th scope="col" className="w-[8%] px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider hidden lg:table-cell" aria-sort={sortKey==='favorite_count' ? (sortDir==='asc'?'ascending':'descending') : 'none'}>
                    <button type="button" onClick={() => setSort('favorite_count')} className="inline-flex items-center group">Favoritos
                      <svg className={`ml-1 h-4 w-4 text-gray-400 group-hover:text-gray-600 transition-transform ${sortKey==='favorite_count' ? '' : 'opacity-0'} ${sortDir==='asc' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                    </button>
                  </th>
                  <th scope="col" className="w-[10%] px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider hidden md:table-cell" aria-sort={sortKey==='created_at' ? (sortDir==='asc'?'ascending':'descending') : 'none'}>
                    <button type="button" onClick={() => setSort('created_at')} className="inline-flex items-center group">Publicado
                      <svg className={`ml-1 h-4 w-4 text-gray-400 group-hover:text-gray-600 transition-transform ${sortKey==='created_at' ? '' : 'opacity-0'} ${sortDir==='asc' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                    </button>
                  </th>
                  <th scope="col" className="w-[10%] px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan="8" className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
                        <p className="text-gray-500">Cargando productos...</p>
                      </div>
                    </td>
                  </tr>
                ) : filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center">
                        <svg className="w-12 h-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                        </svg>
                        <p className="text-gray-500 text-lg font-medium mb-1">
                          {products.length === 0 ? 'No hay productos registrados' : 'No se encontraron productos'}
                        </p>
                        <p className="text-gray-400 text-sm">
                          {products.length === 0 ? 'Comienza agregando tu primer producto' : 'Intenta con otros términos de búsqueda'}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  pagedProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50 transition-colors duration-150">
                      <td className="px-6 py-3">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-12 w-12">
                            <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 font-bold text-sm">
                              {product.name ? product.name.charAt(0).toUpperCase() : 'P'}
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {product.name || 'Sin nombre'}
                            </div>
                            <div className="text-sm text-gray-500">
                              ID: {product.id}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-3">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          {product.categories?.name || 'Sin categoría'}
                        </span>
                      </td>
                      <td className="px-6 py-3 whitespace-nowrap">
                        <div className="text-sm font-semibold text-gray-900">{product.price}€</div>
                      </td>
                      <td className="px-6 py-3 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800`}>
                          {product.status === 'available' ? 'Disponible' : product.status === 'sold' ? 'Vendido' : 'Pendiente'}
                        </span>
                      </td>
                      <td className="px-6 py-3 text-sm text-gray-500 hidden md:table-cell">
                        {product.location || 'Sin ubicación'}
                      </td>
                      <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-900 hidden lg:table-cell">
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          {product.view_count || 0}
                        </div>
                      </td>
                      <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-900 hidden lg:table-cell">
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                          </svg>
                          {product.favorite_count || 0}
                        </div>
                      </td>
                      <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500 hidden md:table-cell">
                        {product.created_at ? new Date(product.created_at).toLocaleDateString('es-ES', { year: 'numeric', month: 'short', day: 'numeric' }) : '-'}
                      </td>
                      <td className="px-6 py-3 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-3">
                          <Link to={`/admin/productos/ver/${product.id}`}>
                            <button className="text-gray-600 hover:text-gray-900 transition-colors duration-150 p-1 rounded-md hover:bg-gray-100">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                            </button>
                          </Link>
                          <Link to={`/admin/productos/editar/${product.id}`}>
                            <button className="text-green-600 hover:text-green-900 transition-colors duration-150 p-1 rounded-md hover:bg-green-50">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                          </Link>
                          <button 
                            onClick={() => openDeleteModal(product)}
                            disabled={deleting === product.id}
                            className={`transition-colors duration-150 p-1 rounded-md ${
                              deleting === product.id 
                                ? 'text-gray-400 cursor-not-allowed' 
                                : 'text-red-600 hover:text-red-900 hover:bg-red-50'
                            }`}
                          >
                            {deleting === product.id ? (
                              <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                              </svg>
                            ) : (
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {/* Mobile Cards */}
          <div className="md:hidden">
            <ul className="divide-y divide-gray-200">
              {loading ? (
                <li className="px-6 py-6">
                  <div className="flex flex-col items-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
                    <p className="text-gray-500">Cargando productos...</p>
                  </div>
                </li>
              ) : filteredProducts.length === 0 ? (
                <li className="px-6 py-6">
                  <div className="text-center">
                    <p className="text-gray-500 text-lg font-medium mb-1">
                      {products.length === 0 ? 'No hay productos registrados' : 'No se encontraron productos'}
                    </p>
                    <p className="text-gray-400 text-sm">
                      {products.length === 0 ? 'Comienza agregando tu primer producto' : 'Intenta con otros términos de búsqueda'}
                    </p>
                  </div>
                </li>
              ) : (
                pagedProducts.map((product) => (
                  <li key={product.id} className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 font-bold text-sm flex-shrink-0">
                        {product.name ? product.name.charAt(0).toUpperCase() : 'P'}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">
                          {product.name || 'Sin nombre'}
                        </p>
                        <p className="text-xs text-gray-500">ID: {product.id}</p>
                      </div>
                      <div className="ml-auto flex items-center gap-2">
                        <Link to={`/admin/productos/ver/${product.id}`}>
                          <button className="text-gray-600 hover:text-gray-900 transition-colors p-1 rounded-md hover:bg-gray-100" aria-label="Ver producto">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </button>
                        </Link>
                        <Link to={`/admin/productos/editar/${product.id}`}>
                          <button className="text-green-600 hover:text-green-900 transition-colors p-1 rounded-md hover:bg-green-50" aria-label="Editar producto">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                        </Link>
                        <button 
                          onClick={() => openDeleteModal(product)}
                          disabled={deleting === product.id}
                          className={`transition-colors p-1 rounded-md ${
                            deleting === product.id ? 'text-gray-400 cursor-not-allowed' : 'text-red-600 hover:text-red-900 hover:bg-red-50'
                          }`}
                          aria-label="Eliminar producto"
                        >
                          {deleting === product.id ? (
                            <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                          ) : (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          )}
                        </button>
                      </div>
                    </div>
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {product.categories?.name || 'Sin categoría'}
                      </span>
                      <span className="text-sm font-semibold text-gray-900">{product.price}€</span>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {product.status === 'available' ? 'Disponible' : product.status === 'sold' ? 'Vendido' : 'Pendiente'}
                      </span>
                    </div>
                    <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-gray-500">
                      <span>{product.location || 'Sin ubicación'}</span>
                      <span>{product.created_at ? new Date(product.created_at).toLocaleDateString('es-ES', { year: 'numeric', month: 'short', day: 'numeric' }) : '-'}</span>
                    </div>
                  </li>
                ))
              )}
            </ul>
          </div>
          <div className="px-6 py-3 flex items-center justify-between border-t border-gray-200 bg-white">
            <div className="text-sm text-gray-600">Página {currentPage} de {totalPages}</div>
            <div className="flex items-center gap-2">
              <button onClick={() => setCurrentPage(Math.max(1, currentPage - 1))} disabled={currentPage === 1} className="px-3 py-1.5 border border-gray-300 rounded-lg bg-white text-sm text-gray-700 disabled:opacity-50 hover:bg-gray-100">Anterior</button>
              <button onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages} className="px-3 py-1.5 border border-gray-300 rounded-lg bg-white text-sm text-gray-700 disabled:opacity-50 hover:bg-gray-100">Siguiente</button>
            </div>
          </div>
        </div>
      
      {/* Modal de confirmación - AGREGAR ESTA LÍNEA */}
      <DeleteConfirmationModal />
    </AdminLayout>
  );
};

export default AdminProducts;
                    