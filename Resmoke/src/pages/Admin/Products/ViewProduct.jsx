import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import AdminLayout from '../../../components/Layout/AdminLayout';
import { supabase } from '../../../lib/supabase';
import { createProductModerationInAppNotification, sendProductNotification } from '../../../utils/emailNotifications';
import { useAuth } from '../../../contexts/AuthContext';

const ViewProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [adminUserDb, setAdminUserDb] = useState(null);
  const [auditLogs, setAuditLogs] = useState([]);
  const [denyModal, setDenyModal] = useState(false);
  const [denyReason, setDenyReason] = useState('El producto no cumple con nuestras políticas de publicación.');

  const getProductIdValue = (rawId) => {
    if (rawId === undefined || rawId === null) return rawId;
    const asString = String(rawId);
    return /^\d+$/.test(asString) ? Number(asString) : asString;
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  useEffect(() => {
    if (!user?.email) return;
    fetchAdminUserDb();
  }, [user?.email]);

  useEffect(() => {
    if (!id) return;
    fetchAuditLogs();
  }, [id]);

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

  const fetchAuditLogs = async () => {
    try {
      const { data, error } = await supabase
        .from('product_moderation_audit')
        .select('*')
        .eq('product_id', getProductIdValue(id))
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAuditLogs(data || []);
    } catch (e) {
      setAuditLogs([]);
    }
  };

  const createModerationAuditLog = async ({ productId, action, reason }) => {
    try {
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
      await fetchAuditLogs();
      return true;
    } catch (e) {
      return false;
    }
  };

  const fetchProduct = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          categories (id, name),
          Users!products_user_id_fkey (id, nombre, email)
        `)
        .eq('id', id)
        .single();
      
      if (error) throw error;
      setProduct(data);
      setSelectedImage(data.main_image);
    } catch (error) {
      console.error('Error fetching product:', error);
      setError('Error al cargar el producto');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async () => {
    setActionLoading(true);
    try {
      const { error } = await supabase
        .from('products')
        .update({ status: 'available' })
        .eq('id', id);
      
      if (error) throw error;
      
      // Enviar email de notificación
      if (product && product.Users) {
        const emailSent = await sendProductNotification(
          'approved',
          product,
          product.Users
        );
        
        if (emailSent) {
          console.log('Email de confirmación enviado exitosamente');
        } else {
          console.warn('No se pudo enviar el email de confirmación');
        }

        await createProductModerationInAppNotification(
          'approved',
          product,
          product.Users
        );
      }

      await createModerationAuditLog({
        productId: getProductIdValue(id),
        action: 'approved',
        reason: ''
      });
      
      // Mostrar notificación de éxito
      const notification = document.createElement('div');
      notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transform transition-all duration-300';
      notification.textContent = '✅ Producto confirmado exitosamente y notificación enviada';
      document.body.appendChild(notification);
      
      setTimeout(() => {
        notification.remove();
        navigate('/admin/productos');
      }, 2000);
    } catch (error) {
      console.error('Error confirming product:', error);
      alert('Error al confirmar el producto');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeny = () => {
    setDenyReason('El producto no cumple con nuestras políticas de publicación.');
    setDenyModal(true);
  };

  const submitDeny = async () => {
    setActionLoading(true);
    try {
      const { error } = await supabase
        .from('products')
        .update({ status: 'rejected' })
        .eq('id', id);

      if (error) throw error;

      if (product && product.Users) {
        const emailSent = await sendProductNotification(
          'rejected',
          product,
          product.Users,
          denyReason || 'El producto no cumple con nuestras políticas de publicación.'
        );

        if (emailSent) {
          console.log('Email de denegación enviado exitosamente');
        } else {
          console.warn('No se pudo enviar el email de denegación');
        }

        await createProductModerationInAppNotification(
          'rejected',
          product,
          product.Users,
          denyReason || 'El producto no cumple con nuestras políticas de publicación.'
        );
      }

      await createModerationAuditLog({
        productId: getProductIdValue(id),
        action: 'rejected',
        reason: denyReason || ''
      });

      const notification = document.createElement('div');
      notification.className = 'fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transform transition-all duration-300';
      notification.textContent = '❌ Producto rechazado y notificación enviada';
      document.body.appendChild(notification);

      setTimeout(() => {
        notification.remove();
        navigate('/admin/productos');
      }, 2000);
    } catch (error) {
      console.error('Error denying product:', error);
      alert('Error al rechazar el producto');
    } finally {
      setActionLoading(false);
      setDenyModal(false);
    }
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return '/img/resmoke/noFoto.png';
    
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    
    const { data } = supabase.storage
      .from('product-images')
      .getPublicUrl(imagePath);
    
    return data.publicUrl;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'sold':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'pending_human_review':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'available':
        return 'Disponible';
      case 'sold':
        return 'Vendido';
      case 'pending':
        return 'Pendiente';
      case 'pending_human_review':
        return 'Revisión humana';
      case 'rejected':
        return 'Rechazado';
      default:
        return 'Sin estado';
    }
  };

  if (loading) {
    return (
      <AdminLayout
        title="Ver Producto"
        subtitle="Cargando producto..."
        headerActions={(
          <div className="flex items-center gap-2 w-full">
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
        <div className="flex justify-center items-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-xl text-gray-600">Cargando producto...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (error || !product) {
    return (
      <AdminLayout
        title="Ver Producto"
        subtitle="Ocurrió un error al cargar el producto"
        headerActions={(
          <div className="flex items-center gap-2 w-full">
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
        <div className="text-center py-12">
          <div className="text-6xl mb-4">😞</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Producto no encontrado</h2>
          <p className="text-gray-600 mb-6">{error || 'El producto que buscas no existe'}</p>
        </div>
      </AdminLayout>
    );
  }

  const allImages = [product.main_image, product.extra_image_1, product.extra_image_2, product.extra_image_3, product.extra_image_4].filter(Boolean);

  const formatAuditAction = (action) => {
    if (action === 'approved') return { text: 'Aprobado', className: 'bg-green-100 text-green-800 border-green-200' };
    if (action === 'rejected') return { text: 'Rechazado', className: 'bg-red-100 text-red-800 border-red-200' };
    return { text: action || 'Acción', className: 'bg-gray-100 text-gray-800 border-gray-200' };
  };

  return (
    <AdminLayout
      title={product.name}
      subtitle={`ID: #${product.id}`}
      headerActions={(
        <div className="flex items-center gap-2 w-full">
          <Link to="/admin/productos" className="ml-auto">
            <button className="inline-flex items-center px-3 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Volver
            </button>
          </Link>
          {['pending', 'pending_human_review'].includes(product.status) && (
            <>
              <button
                onClick={handleConfirm}
                disabled={actionLoading}
                className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white rounded-lg transition-colors shadow-lg hover:shadow-xl"
              >
                {actionLoading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                ) : (
                  <span className="mr-2">✅</span>
                )}
                Confirmar
              </button>
              <button
                onClick={handleDeny}
                disabled={actionLoading}
                className="inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white rounded-lg transition-colors shadow-lg hover:shadow-xl"
              >
                {actionLoading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                ) : (
                  <span className="mr-2">❌</span>
                )}
                Denegar
              </button>
            </>
          )}
        </div>
      )}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Galería de imágenes */}
          <div className="space-y-4">
            {/* Imagen principal */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="aspect-square bg-gray-100 flex items-center justify-center">
                <img 
                  src={getImageUrl(selectedImage)} 
                  alt="Imagen del producto" 
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105" 
                  onError={(e) => {
                    e.target.src = '/img/resmoke/noFoto.png';
                  }}
                />
              </div>
            </div>
            
            {/* Miniaturas */}
            {allImages.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {allImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(image)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                      selectedImage === image 
                        ? 'border-blue-500 ring-2 ring-blue-200' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <img 
                      src={getImageUrl(image)} 
                      alt={`Imagen ${index + 1}`} 
                      className="w-full h-full object-cover" 
                      onError={(e) => {
                        e.target.src = '/img/resmoke/noFoto.png';
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Información del producto */}
          <div className="space-y-6">
            {/* Estado del producto */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Estado del Producto</h3>
              <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium border ${getStatusColor(product.status)}`}>
                {getStatusText(product.status)}
              </span>
            </div>

            {/* Información básica */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Información Básica</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <span className="text-gray-600 font-medium">Precio:</span>
                  <span className="text-2xl font-bold text-green-600">{product.price}€</span>
                </div>
                
                <div className="flex justify-between items-start">
                  <span className="text-gray-600 font-medium">Categoría:</span>
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                    {product.categories?.name || 'Sin categoría'}
                  </span>
                </div>
                
                <div className="flex justify-between items-start">
                  <span className="text-gray-600 font-medium">Ubicación:</span>
                  <span className="text-gray-900 text-right">{product.location || 'No especificada'}</span>
                </div>
                
                <div className="flex justify-between items-start">
                  <span className="text-gray-600 font-medium">Fecha de creación:</span>
                  <span className="text-gray-900 text-right">
                    {new Date(product.created_at).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>
              </div>
            </div>

            {/* Descripción */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Descripción</h3>
              <p className="text-gray-700 leading-relaxed">
                {product.description || 'Sin descripción disponible'}
              </p>
            </div>

            {/* Información adicional */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Información Adicional</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <span className="text-gray-600 block">Vistas</span>
                  <span className="font-semibold text-lg">{product.views || 0}</span>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <span className="text-gray-600 block">Favoritos</span>
                  <span className="font-semibold text-lg">{product.favorites_count || 0}</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Historial de moderación</h3>
              {auditLogs.length === 0 ? (
                <div className="text-sm text-gray-600">Sin registros todavía.</div>
              ) : (
                <div className="space-y-3">
                  {auditLogs.map((log) => {
                    const badge = formatAuditAction(log.action);
                    const when = log.created_at ? new Date(log.created_at) : null;
                    return (
                      <div key={log.id} className="border border-gray-200 rounded-xl p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <div className="text-sm text-gray-900 font-medium truncate">
                              {log.admin_name || log.admin_email || 'Admin'}
                            </div>
                            <div className="text-xs text-gray-500">
                              {when ? when.toLocaleString('es-ES') : ''}
                            </div>
                          </div>
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${badge.className}`}>
                            {badge.text}
                          </span>
                        </div>
                        {log.reason ? (
                          <div className="mt-3 text-sm text-gray-700 whitespace-pre-wrap">
                            {log.reason}
                          </div>
                        ) : null}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

      {denyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setDenyModal(false)}></div>
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Motivo del rechazo</h3>
                <button
                  type="button"
                  onClick={() => setDenyModal(false)}
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
                value={denyReason}
                onChange={(e) => setDenyReason(e.target.value)}
                className="w-full min-h-[120px] resize-none rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="Escribe el motivo del rechazo…"
              />
              <div className="flex items-center justify-end gap-3 mt-5">
                <button
                  type="button"
                  onClick={() => setDenyModal(false)}
                  disabled={actionLoading}
                  className="px-4 py-2 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={submitDeny}
                  disabled={actionLoading}
                  className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold disabled:opacity-50"
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

export default ViewProduct;
