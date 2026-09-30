import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import AdminNavbar from '../../components/Layout/AdminNavbar';

const AdminOpinions = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  // Variable filter removida - no hay estados para filtrar
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedReview, setSelectedReview] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    averageRating: 0
  });

  useEffect(() => {
    fetchReviews();
    fetchStats();
  }, []);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('reviews')
        .select(`
          id,
          buyer_id,
          seller_id,
          product_id,
          rating,
          comment,
          image_url,
          created_at,
          updated_at,
          buyer:Users!buyer_id(id, nombre, email),
          seller:Users!seller_id(id, nombre, email),
          products(id, name, main_image)
        `)
        .order('created_at', { ascending: false });

      // Filtro por status removido - columna no existe en la tabla actual

      const { data, error } = await query;
      if (error) throw error;

      setReviews(data || []);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const { data: allReviews, error } = await supabase
        .from('reviews')
        .select('rating');

      if (error) throw error;

      const total = allReviews?.length || 0;
      const averageRating = total > 0 
        ? (allReviews.reduce((sum, r) => sum + (r.rating || 0), 0) / total).toFixed(1)
        : 0;

      setStats({ 
        total, 
        pending: 0, 
        approved: total, 
        rejected: 0, 
        averageRating 
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  // Función de moderación removida - columnas status y admin_notes no existen

  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http')) return imagePath;
    return `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/product-images/${imagePath}`;
  };

  const deleteReview = async (reviewId, imageUrl) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta opinión?')) return;

    try {
      if (imageUrl && !imageUrl.startsWith('http')) {
        const { error: storageError } = await supabase.storage
          .from('product-images')
          .remove([imageUrl]);
        
        if (storageError) console.error('Error deleting image:', storageError);
      }

      const { error } = await supabase
        .from('reviews')
        .delete()
        .eq('id', reviewId);

      if (error) throw error;

      await fetchReviews();
      await fetchStats();
    } catch (error) {
      console.error('Error deleting review:', error);
      alert('Error al eliminar la opinión');
    }
  };

  const filteredReviews = reviews.filter(review => {
    const matchesSearch = 
      review.comment?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.buyer?.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.products?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });

  // Funciones de status removidas - columna status no existe

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span 
        key={i} 
        className={`text-lg ${
          i < rating ? 'text-yellow-400' : 'text-gray-300'
        }`}
      >
        ★
      </span>
    ));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AdminNavbar />
        <div className="flex-grow lg:ml-64">
          <div className="flex items-center justify-center h-64">
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
              <div className="text-xl text-gray-600">Cargando opiniones...</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar />
      
      <div className="flex-grow lg:ml-64">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-200 p-6">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900">Gestión de Opiniones</h1>
            <p className="text-gray-600 mt-2">Modera y gestiona las reseñas de usuarios</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="p-2 bg-gray-100 text-gray-600 rounded-lg">
                  <span className="material-icons">rate_review</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total de Opiniones</p>
                  <p className="text-2xl font-semibold text-gray-900">{stats.total}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="p-2 bg-gray-100 text-gray-600 rounded-lg">
                  <span className="material-icons">star</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Calificación Promedio</p>
                  <p className="text-2xl font-semibold text-gray-900">{stats.averageRating}★</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex justify-end">
              <div className="relative">
                <span className="material-icons absolute left-3 top-[33px] transform -translate-y-1/2 text-gray-400">search</span>
                <input
                  type="text"
                  placeholder="Buscar por comentario, usuario o producto..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full md:w-80"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {filteredReviews.length === 0 ? (
              <div className="text-center py-12">
                <span className="material-icons text-gray-400 text-6xl mb-4">rate_review</span>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No hay opiniones</h3>
                <p className="text-gray-500">
                  {searchTerm ? 'No se encontraron opiniones que coincidan con tu búsqueda.' : 'No hay opiniones para mostrar.'}
                </p>
              </div>
            ) : (
              <div className="max-h-[480px] overflow-y-auto">
                <table className="w-full table-fixed divide-y divide-gray-200" role="table">
                  <thead className="bg-gray-50 sticky top-0 z-10">
                      <tr>
                        <th className="w-[22%] px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Usuario
                        </th>
                        <th className="w-[22%] px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Producto
                        </th>
                        <th className="w-[14%] px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Calificación
                        </th>
                        <th className="w-[22%] px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider hidden md:table-cell">
                          Comentario
                        </th>
                        <th className="w-[12%] px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider hidden lg:table-cell">
                          Fecha
                        </th>
                        <th className="w-[8%] px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Acciones
                        </th>
                      </tr>
                    </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredReviews.map((review) => (
                      <tr key={review.id} className="hover:bg-gray-50">
                        <td className="px-6 py-3">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                                <span className="text-sm font-medium text-gray-700">
                                  {review.buyer?.nombre?.charAt(0) || 'U'}
                                </span>
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {review.buyer?.nombre || 'Usuario eliminado'}
                              </div>
                              <div className="text-sm text-gray-500">
                                {review.buyer?.email || 'Email no disponible'}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-3">
                          <div className="flex items-center">
                            {review.products?.main_image && (
                              <img 
                                src={review.products.main_image} 
                                alt={review.products.name}
                                className="h-10 w-10 rounded object-cover mr-3"
                              />
                            )}
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {review.products?.name || 'Producto eliminado'}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-3">
                          <div className="flex items-center">
                            {renderStars(review.rating)}
                            <span className="ml-2 text-sm text-gray-600">({review.rating}/5)</span>
                          </div>
                        </td>
                        <td className="px-6 py-3 hidden md:table-cell">
                          <div className="text-sm text-gray-900">
                            {review.comment || 'Sin comentario'}
                          </div>
                        </td>
                        <td className="px-6 py-3 text-sm text-gray-500 hidden lg:table-cell">
                          {new Date(review.created_at).toLocaleDateString('es-ES')}
                        </td>
                        <td className="px-6 py-3 text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => {
                                setSelectedReview(review);
                                setShowModal(true);
                              }}
                              className="text-blue-600 hover:text-blue-900"
                              title="Ver detalles"
                            >
                              <span className="material-icons text-sm">visibility</span>
                            </button>
                            <button
                              onClick={() => deleteReview(review.id, review.image_url)}
                              className="text-red-600 hover:text-red-900"
                              title="Eliminar"
                            >
                              <span className="material-icons text-sm">delete</span>
                            </button>
                          </div>
                         </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal de detalles mejorado */}
      {showModal && selectedReview && (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-gray-100 max-h-[90vh] overflow-y-auto">
            {/* Header del modal */}
            <div className="sticky top-0 bg-white border-b border-gray-100 px-8 py-6 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Detalles de la Opinión</h3>
                  <p className="text-sm text-gray-500 mt-1">Información completa de la reseña</p>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200 group"
                >
                  <span className="material-icons text-gray-400 group-hover:text-gray-600 text-xl">close</span>
                </button>
              </div>
            </div>

            {/* Contenido del modal */}
            <div className="px-8 py-6">
              <div className="space-y-6">
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <div className="flex items-center mb-4">
                    <div className="p-2 bg-gray-100 rounded-lg mr-3">
                      <span className="material-icons text-gray-600">person</span>
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900">Información del Usuario</h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Nombre</label>
                      <p className="text-base text-gray-900 font-medium">
                        {selectedReview.buyer?.nombre || 'Usuario eliminado'}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
                      <p className="text-base text-gray-900">
                        {selectedReview.buyer?.email || 'Email no disponible'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <div className="flex items-center mb-4">
                    <div className="p-2 bg-gray-100 rounded-lg mr-3">
                      <span className="material-icons text-gray-600">inventory_2</span>
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900">Producto Evaluado</h4>
                  </div>
                  <div className="flex items-center space-x-4">
                    {selectedReview.products?.main_image && (
                      <img 
                        src={selectedReview.products.main_image} 
                        alt={selectedReview.products.name}
                        className="h-16 w-16 rounded-lg object-cover border border-gray-200"
                      />
                    )}
                    <div>
                      <p className="text-base text-gray-900 font-medium">
                        {selectedReview.products?.name || 'Producto eliminado'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <div className="flex items-center mb-4">
                    <div className="p-2 bg-gray-100 rounded-lg mr-3">
                      <span className="material-icons text-gray-600">star</span>
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900">Calificación</h4>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center">
                      {renderStars(selectedReview.rating)}
                    </div>
                    <span className="text-lg font-semibold text-gray-700">
                      {selectedReview.rating}/5
                    </span>
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                      {selectedReview.rating >= 4 ? 'Excelente' : 
                       selectedReview.rating >= 3 ? 'Bueno' : 
                       selectedReview.rating >= 2 ? 'Regular' : 'Malo'}
                    </span>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <div className="flex items-center mb-4">
                    <div className="p-2 bg-gray-100 rounded-lg mr-3">
                      <span className="material-icons text-gray-600">chat_bubble</span>
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900">Comentario</h4>
                  </div>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <p className="text-base text-gray-900 leading-relaxed">
                      {selectedReview.comment || 'Sin comentario'}
                    </p>
                    {selectedReview.image_url && (
                      <div className="mt-4">
                        <img 
                          src={getImageUrl(selectedReview.image_url)} 
                          alt="Review attachment" 
                          className="h-48 w-auto object-cover rounded-lg border border-gray-200 cursor-pointer hover:opacity-90 transition-opacity"
                          onClick={() => window.open(getImageUrl(selectedReview.image_url), '_blank')}
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Información de fecha */}
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
                  <div className="flex items-center mb-4">
                    <div className="p-2 bg-gray-200 rounded-lg mr-3">
                      <span className="material-icons text-gray-600">schedule</span>
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900">Información Temporal</h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Fecha de creación</label>
                      <p className="text-base text-gray-900">
                        {new Date(selectedReview.created_at).toLocaleDateString('es-ES', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Hora</label>
                      <p className="text-base text-gray-900">
                        {new Date(selectedReview.created_at).toLocaleTimeString('es-ES')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer del modal */}
            <div className="sticky bottom-0 bg-white border-t border-gray-100 px-8 py-6 rounded-b-2xl">
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => deleteReview(selectedReview.id)}
                  className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 font-medium flex items-center space-x-2"
                >
                  <span className="material-icons text-sm">delete</span>
                  <span>Eliminar</span>
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className="px-6 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 hover:bg-gray-50 transition-colors duration-200 font-medium"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOpinions;