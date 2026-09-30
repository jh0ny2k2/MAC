import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AdminLayout from '../../../components/Layout/AdminLayout';
import { supabase } from '../../../lib/supabase';
import { categories } from '../../../data/mockData';
import { useAuth } from '../../../contexts/AuthContext';

const AddProduct = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    location: '',
    category_id: '',
    status: 'pending', // Cambiado a pending por defecto
    user_id: '' // Nuevo campo para seleccionar usuario
  });

  // Cargar usuarios al montar el componente
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoadingUsers(true);
      const { data, error } = await supabase
        .from('Users')
        .select('id, nombre, email')
        .order('nombre', { ascending: true });
      
      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error cargando usuarios:', error);
      alert('Error al cargar la lista de usuarios');
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es obligatorio';
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      newErrors.price = 'El precio debe ser mayor a 0';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'La descripción es obligatoria';
    }

    if (!formData.category_id) {
      newErrors.category_id = 'Selecciona una categoría';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'La ubicación es obligatoria';
    }

    if (!formData.user_id) {
      newErrors.user_id = 'Selecciona un usuario';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    if (!user) {
      alert('Debes iniciar sesión como administrador.');
      return;
    }

    try {
      setSaving(true);

      const insertData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        price: parseFloat(formData.price),
        location: formData.location.trim(),
        category_id: parseInt(formData.category_id),
        status: formData.status,
        user_id: parseInt(formData.user_id) // Usar el usuario seleccionado
      };

      const { error: insertError } = await supabase
        .from('products')
        .insert([insertData]);

      if (insertError) throw insertError;

      // Mostrar modal de confirmación en lugar de alert
      setShowModal(true);
    } catch (error) {
      console.error('Error creando producto:', error);
      alert(`Error al crear el producto: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout
      title="Añadir Producto"
      subtitle="Crea un nuevo producto y asígnalo a un usuario"
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
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <form onSubmit={handleSubmit} className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Información Básica */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-3">
                  Información Básica
                </h3>

                {/* Nombre */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre del Producto *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                      errors.name ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="Ingresa el nombre del producto"
                  />
                  {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                </div>

                {/* Precio */}
                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                    Precio (€) *
                  </label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    step="0.01"
                    min="0"
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                      errors.price ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="0.00"
                  />
                  {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
                </div>

                {/* Ubicación */}
                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                    Ubicación *
                  </label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                      errors.location ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="Ciudad, región"
                  />
                  {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
                </div>

                {/* Estado - Información fija */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Estado del Producto
                  </label>
                  <div className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-yellow-50 flex items-center">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      ⏳ Pendiente de Aprobación
                    </span>
                    <span className="ml-3 text-sm text-gray-600">
                      El producto será revisado antes de publicarse
                    </span>
                  </div>
                </div>
              </div>

              {/* Categoría y Descripción */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-3">
                  Detalles del Producto
                </h3>

                {/* Asignar Usuario */}
                <div>
                  <label htmlFor="user_id" className="block text-sm font-medium text-gray-700 mb-2">
                    Asignar a Usuario *
                  </label>
                  {loadingUsers ? (
                    <div className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                      <span className="text-gray-600">Cargando usuarios...</span>
                    </div>
                  ) : (
                    <select
                      id="user_id"
                      name="user_id"
                      value={formData.user_id}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                        errors.user_id ? 'border-red-500 bg-red-50' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Selecciona un usuario</option>
                      {users.map((userData) => (
                        <option key={userData.id} value={userData.id}>
                          {userData.nombre} ({userData.email})
                        </option>
                      ))}
                    </select>
                  )}
                  {errors.user_id && <p className="text-red-500 text-sm mt-1">{errors.user_id}</p>}
                </div>

                {/* Categoría */}
                <div>
                  <label htmlFor="category_id" className="block text-sm font-medium text-gray-700 mb-2">
                    Categoría *
                  </label>
                  <select
                    id="category_id"
                    name="category_id"
                    value={formData.category_id}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                      errors.category_id ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Selecciona una categoría</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.nombre}
                      </option>
                    ))}
                  </select>
                  {errors.category_id && <p className="text-red-500 text-sm mt-1">{errors.category_id}</p>}
                </div>

                {/* Descripción */}
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                    Descripción *
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={6}
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none ${
                      errors.description ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="Describe el producto en detalle..."
                  />
                  {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                </div>

                {/* Información del Usuario Seleccionado */}
                {formData.user_id && (
                  <div className="bg-blue-50 rounded-xl p-4">
                    <h4 className="font-medium text-gray-900 mb-2">Usuario Seleccionado</h4>
                    <div className="space-y-1 text-sm text-gray-600">
                      {(() => {
                        const selectedUser = users.find(u => u.id === parseInt(formData.user_id));
                        return selectedUser ? (
                          <>
                            <p><span className="font-medium">Nombre:</span> {selectedUser.nombre}</p>
                            <p><span className="font-medium">Email:</span> {selectedUser.email}</p>
                            <p><span className="font-medium">ID:</span> {selectedUser.id}</p>
                          </>
                        ) : null;
                      })()}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Botones de Acción */}
            <div className="flex flex-col sm:flex-row gap-4 mt-8 pt-6 border-t border-gray-200">
              <button
                type="submit"
                disabled={saving || loadingUsers}
                className="flex-1 sm:flex-none px-8 py-3 text-black border-b-2 border-black font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Creando...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Crear Producto
                  </>
                )}
              </button>

              <Link to="/admin/productos" className="flex-1 sm:flex-none">
                <button
                  type="button"
                  className="w-full px-8 py-3 text-black border-b-2 border-black font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Cancelar
                </button>
              </Link>
            </div>
          </form>
        </div>

        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 transform transition-all">
              <div className="p-6">
                <div className="text-center mb-6">
                  <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-yellow-100 mb-4">
                    <svg className="h-8 w-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">¡Producto Enviado para Revisión!</h3>
                  <div className="text-4xl mb-4">🎉</div>
                </div>
                <div className="space-y-4 text-center">
                  <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                    <p className="text-sm font-medium text-yellow-800 mb-2">Estado: Pendiente de Aprobación</p>
                    <p className="text-sm text-yellow-700">El producto ha sido creado exitosamente y está esperando revisión por parte del equipo de administración.</p>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <div className="flex items-center justify-center mb-2">
                      <svg className="h-5 w-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <span className="text-sm font-medium text-blue-800">Notificación por Email</span>
                    </div>
                    <p className="text-sm text-blue-700">El usuario recibirá una notificación por correo electrónico cuando el producto sea aprobado o rechazado.</p>
                  </div>
                  <p className="text-sm text-gray-600">Puedes revisar el estado del producto en la sección de "Productos Pendientes".</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 mt-6">
                  <button
                    onClick={() => {
                      setShowModal(false);
                      navigate('/admin/productos/confirmaciones');
                    }}
                    className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
                  >
                    Ver Productos Pendientes
                  </button>
                  <button
                    onClick={() => {
                      setShowModal(false);
                      setFormData({
                        name: '',
                        description: '',
                        price: '',
                        location: '',
                        category_id: '',
                        status: 'pending',
                        user_id: ''
                      });
                      setErrors({});
                    }}
                    className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors duration-200"
                  >
                    Crear Otro Producto
                  </button>
                </div>
                <div className="mt-4 text-center">
                  <button
                    onClick={() => {
                      setShowModal(false);
                      navigate('/admin/productos');
                    }}
                    className="text-sm text-gray-500 hover:text-gray-700 transition-colors duration-200"
                  >
                    Volver a Productos
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
    </AdminLayout>
  );
};

export default AddProduct;