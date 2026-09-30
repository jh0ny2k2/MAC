import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AdminLayout from '../../../components/Layout/AdminLayout';
import { supabase } from '../../../lib/supabase';
import { createProductModerationInAppNotification, sendProductNotification } from '../../../utils/emailNotifications';
import { useAuth } from '../../../contexts/AuthContext';

const AdminProductsPending = () => {
  const { user } = useAuth();
  const [pendingProducts, setPendingProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [processing, setProcessing] = useState(null);
  const navigate = useNavigate();
  const [adminUserDb, setAdminUserDb] = useState(null);
  const [rejectModal, setRejectModal] = useState({ isOpen: false, productId: null });
  const [rejectReason, setRejectReason] = useState('El producto no cumple con nuestras políticas de publicación.');

  useEffect(() => {
    fetchPendingProducts();
  }, []);

  useEffect(() => {
    if (!user?.email) return;
    fetchAdminUserDb();
  }, [user?.email]);

  const fetchAdminUserDb = async () => {
    try {
      const { data, error } = await supabase
        .from('Users')
        .select('id, nombre, email')
        .eq('email', user.email)
        .single();

      if (error) throw error;
      setAdminUserDb(data);
    } catch (e) {
      setAdminUserDb(null);
    }
  };

  const createModerationAuditLog = async ({ productId, action, reason }) => {
    try {
      if (!productId || !action) return false;
      const payload = {
        product_id: productId,
        action,
        reason: reason || null,
        admin_user_id: adminUserDb?.id || null,
        admin_name: adminUserDb?.nombre || null,
        admin_email: adminUserDb?.email || user?.email || null,
      };
      const { error } = await supabase.from('product_moderation_audit').insert(payload);
      if (error) throw error;
      return true;
    } catch (e) {
      return false;
    }
  };

  const fetchPendingProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          categories (id, name),
          Users!products_user_id_fkey (id, nombre, email)
        `)
        .in('status', ['pending', 'pending_human_review']);
      
      if (error) {
        console.error('Error en la consulta:', error);
        throw error;
      }
      
      console.log('Productos pendientes obtenidos:', data);
      setPendingProducts(data || []);
    } catch (error) {
      console.error('Error fetching pending products:', error);
      alert(`Error al cargar productos pendientes: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (productId) => {
    try {
      setProcessing(productId);
      
      // Obtener datos del producto y usuario antes de actualizar
      const productToApprove = pendingProducts.find(p => p.id === productId);
      
      const { error } = await supabase
        .from('products')
        .update({ status: 'available' })
        .eq('id', productId);

      if (error) {
        console.error('Error aprobando producto:', error);
        throw error;
      }

      // Enviar email de notificación
      if (productToApprove && productToApprove.Users) {
        const emailSent = await sendProductNotification(
          'approved',
          productToApprove,
          productToApprove.Users
        );
        
        if (emailSent) {
          console.log('Email de aprobación enviado exitosamente');
        } else {
          console.warn('No se pudo enviar el email de aprobación');
        }

        await createProductModerationInAppNotification(
          'approved',
          productToApprove,
          productToApprove.Users
        );
      }

      await createModerationAuditLog({
        productId,
        action: 'approved',
        reason: ''
      });

      // Remover el producto de la lista
      setPendingProducts(prev => prev.filter(product => product.id !== productId));
      alert('Producto aprobado exitosamente y notificación enviada');
      
    } catch (error) {
      console.error('Error approving product:', error);
      alert(`Error al aprobar el producto: ${error.message}`);
    } finally {
      setProcessing(null);
    }
  };

  const handleReject = async (productId, reason) => {
    try {
      setProcessing(productId);
      
      // Obtener datos del producto y usuario antes de actualizar
      const productToReject = pendingProducts.find(p => p.id === productId);
      
      const { error } = await supabase
        .from('products')
        .update({ status: 'rejected' })
        .eq('id', productId);

      if (error) {
        console.error('Error rechazando producto:', error);
        throw error;
      }

      // Enviar email de notificación
      if (productToReject && productToReject.Users) {
        const emailSent = await sendProductNotification(
          'rejected',
          productToReject,
          productToReject.Users,
          reason || 'El producto no cumple con nuestras políticas de publicación.'
        );
        
        if (emailSent) {
          console.log('Email de rechazo enviado exitosamente');
        } else {
          console.warn('No se pudo enviar el email de rechazo');
        }

        await createProductModerationInAppNotification(
          'rejected',
          productToReject,
          productToReject.Users,
          reason || 'El producto no cumple con nuestras políticas de publicación.'
        );
      }

      await createModerationAuditLog({
        productId,
        action: 'rejected',
        reason: reason || ''
      });

      // Remover el producto de la lista
      setPendingProducts(prev => prev.filter(product => product.id !== productId));
      alert('Producto rechazado y notificación enviada');
      
    } catch (error) {
      console.error('Error rejecting product:', error);
      alert(`Error al rechazar el producto: ${error.message}`);
    } finally {
      setProcessing(null);
    }
  };

  const openRejectModal = (productId) => {
    setRejectReason('El producto no cumple con nuestras políticas de publicación.');
    setRejectModal({ isOpen: true, productId });
  };

  const closeRejectModal = () => {
    setRejectModal({ isOpen: false, productId: null });
  };

  const handleSearch = (e) => {
    e.preventDefault();
  };

  const filteredProducts = pendingProducts.filter(product => 
    product.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.Users?.nombre?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout
      title="Productos por Confirmar"
      subtitle={`Hay un total de ${pendingProducts.length} productos por confirmar`}
      headerActions={(
        <div className="flex items-center gap-2 md:gap-3 flex-wrap w-full">
          <form onSubmit={handleSearch} className="relative flex-1 min-w-[220px] md:max-w-sm">
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar productos pendientes..." 
              className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm" 
            />
            <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
              <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </form>
          <button onClick={fetchPendingProducts} disabled={loading} className="inline-flex items-center px-3 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v6h6M20 20v-6h-6M5 19a9 9 0 0114-7" />
            </svg>
            {loading ? 'Actualizando...' : 'Actualizar'}
          </button>
          <Link to="/admin/productos" className="ml-auto">
            <button className="inline-flex items-center px-3 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Volver
            </button>
          </Link>
        </div>
      )}
    >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-yellow-100 text-yellow-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pendientes</p>
                <p className="text-3xl font-bold text-gray-900">{pendingProducts.length.toLocaleString()}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-gray-100 text-gray-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Con imagen</p>
                <p className="text-3xl font-bold text-gray-900">{pendingProducts.filter(p=>p.main_image).length.toLocaleString()}</p>
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
                <p className="text-sm font-medium text-gray-600">Sin imagen</p>
                <p className="text-3xl font-bold text-gray-900">{pendingProducts.filter(p=>!p.main_image).length.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Producto</th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Vendedor</th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Categoría</th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Precio</th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Estado</th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Ubicación</th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
                        <p className="text-gray-500">Cargando productos pendientes...</p>
                      </div>
                    </td>
                  </tr>
                ) : filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center">
                        <svg className="w-12 h-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-gray-500 text-lg font-medium mb-1">
                          {pendingProducts.length === 0 ? '¡Excelente! No hay productos pendientes' : 'No se encontraron productos'}
                        </p>
                        <p className="text-gray-400 text-sm">
                          {pendingProducts.length === 0 ? 'Todos los productos han sido revisados' : 'Intenta con otros términos de búsqueda'}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50 transition-colors duration-150">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-12 w-12">
                            {product.main_image ? (
                              <img 
                                src={product.main_image} 
                                alt={product.name}
                                className="h-12 w-12 rounded-lg object-cover"
                              />
                            ) : (
                              <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center text-white font-bold text-sm">
                                {product.name ? product.name.charAt(0).toUpperCase() : 'P'}
                              </div>
                            )}
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
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {product.Users?.nombre || 'Usuario desconocido'}
                        </div>
                        <div className="text-sm text-gray-500">
                          {product.Users?.email}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          {product.categories?.name || 'Sin categoría'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-gray-900">{product.price}€</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          ⏳ Pendiente
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {product.location || 'Sin ubicación'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-3">
                          <button 
                            onClick={() => handleApprove(product.id)}
                            disabled={processing === product.id}
                            className={`transition-colors duration-150 p-2 rounded-md ${
                              processing === product.id 
                                ? 'text-gray-400 cursor-not-allowed' 
                                : 'text-green-600 hover:text-green-900 hover:bg-green-50'
                            }`}
                            title="Aprobar producto"
                          >
                            {processing === product.id ? (
                              <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                              </svg>
                            ) : (
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </button>
                          <button 
                            onClick={() => openRejectModal(product.id)}
                            disabled={processing === product.id}
                            className={`transition-colors duration-150 p-2 rounded-md ${
                              processing === product.id 
                                ? 'text-gray-400 cursor-not-allowed' 
                                : 'text-red-600 hover:text-red-900 hover:bg-red-50'
                            }`}
                            title="Rechazar producto"
                          >
                            {processing === product.id ? (
                              <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                              </svg>
                            ) : (
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            )}
                          </button>
                          <Link to={`/admin/productos/ver/${product.id}`}>
                            <button className="text-blue-600 hover:text-blue-900 transition-colors duration-150 p-2 rounded-md hover:bg-blue-50" title="Ver detalles">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                            </button>
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {rejectModal.isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50" onClick={closeRejectModal}></div>
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Motivo del rechazo</h3>
                  <button
                    type="button"
                    onClick={closeRejectModal}
                    className="text-gray-400 hover:text-gray-600"
                    aria-label="Cerrar"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  Este texto se guardará en la auditoría y se enviará al usuario.
                </p>
              </div>
              <div className="p-6">
                <textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  className="w-full min-h-[120px] resize-none rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Escribe el motivo del rechazo…"
                />
                <div className="flex items-center justify-end gap-3 mt-5">
                  <button
                    type="button"
                    onClick={closeRejectModal}
                    className="px-4 py-2 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={async () => {
                      const pid = rejectModal.productId;
                      closeRejectModal();
                      if (pid) await handleReject(pid, rejectReason);
                    }}
                    className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold"
                  >
                    Rechazar producto
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
    </AdminLayout>
  );
};

export default AdminProductsPending;
