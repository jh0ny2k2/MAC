import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import AdminNavbar from '../../../components/Layout/AdminNavbar';
import { supabase } from '../../../lib/supabase';

const EditUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    rol: 'user'
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchUser();
  }, [id]);

  const fetchUser = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('Users')
        .select('*')
        .eq('id', id)
        .single();
  
      if (error) throw error;
      
      setUser(data);
      setFormData({
        nombre: data.nombre || '',
        email: data.email || '',
        rol: data.rol || 'user'
      });
    } catch (error) {
      console.error('Error fetching user:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre completo es requerido';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'El formato del email no es válido';
    }
    
    if (!formData.rol) {
      newErrors.rol = 'El rol es requerido';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setSaving(true);
      
      const { error } = await supabase
        .from('Users')
        .update({
          nombre: formData.nombre.trim(),
          email: formData.email.trim(),
          rol: formData.rol
        })
        .eq('id', id);
      
      if (error) throw error;
      
      alert('Usuario actualizado exitosamente');
      navigate('/admin/usuarios');
      
    } catch (error) {
      console.error('Error updating user:', error);
      alert(`Error al actualizar el usuario: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <AdminNavbar />
        <div className="flex-1 p-6 md:ml-64">
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Cargando usuario...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <AdminNavbar />
        <div className="flex-1 p-6 md:ml-64">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
          <Link to="/admin/usuarios">
            <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-200">
              ← Volver a Usuarios
            </button>
          </Link>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <AdminNavbar />
        <div className="flex-1 p-6 md:ml-64">
          <div className="text-center py-8">
            <p className="text-gray-600 mb-4">Usuario no encontrado</p>
            <Link to="/admin/usuarios">
              <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-200">
                ← Volver a Usuarios
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <AdminNavbar />
      
      <div className="flex-1 p-6 md:ml-64">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <nav className="text-sm text-gray-600 mb-2">
                <Link to="/admin" className="hover:text-blue-600">Admin</Link>
                <span className="mx-2">›</span>
                <Link to="/admin/usuarios" className="hover:text-blue-600">Usuarios</Link>
                <span className="mx-2">›</span>
                <span className="text-gray-900">Editar Usuario</span>
              </nav>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Editar Usuario</h1>
              <p className="text-gray-600">Modifica la información del usuario</p>
            </div>
            
            
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <form onSubmit={handleSubmit} className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Información Personal */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-3">
                  Información Personal
                </h3>
                
                {/* Nombre Completo */}
                <div>
                  <label htmlFor="full_name" className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre Completo *
                  </label>
                  <input
                    type="text"
                    id="nombre"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                      errors.nombre ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="Ingresa el nombre completo"
                  />
                  {errors.nombre && <p className="text-red-500 text-sm mt-1">{errors.nombre}</p>}
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Correo Electrónico *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                      errors.email ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="usuario@ejemplo.com"
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>

                {/* Rol */}
                <div>
                  <label htmlFor="rol" className="block text-sm font-medium text-gray-700 mb-2">
                    Rol del Usuario *
                  </label>
                  <select
                    id="rol"
                    name="rol"
                    value={formData.rol}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                      errors.rol ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                  >
                    <option value="user">Usuario</option>
                    <option value="admin">Administrador</option>
                  </select>
                  {errors.rol && <p className="text-red-500 text-sm mt-1">{errors.rol}</p>}
                </div>
              </div>

              {/* Información del Sistema */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-3">
                  Información del Sistema
                </h3>
                
                {/* Avatar del Usuario */}
                <div className="flex items-center space-x-4">
                  <div className={`h-20 w-20 rounded-full flex items-center justify-center text-white font-bold text-2xl ${
                    formData.rol === 'admin' 
                      ? 'bg-blue-200' 
                      : 'bg-gradient-to-br from-blue-400 to-blue-600'
                  }`}>
                    {formData.nombre ? formData.nombre.charAt(0).toUpperCase() : formData.email.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Avatar del Usuario</p>
                    <p className="text-sm text-gray-500">Se genera automáticamente con la inicial del nombre</p>
                  </div>
                </div>

                {/* Información del Sistema */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <h4 className="font-medium text-gray-900 mb-3">Información del Sistema</h4>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex justify-between">
                      <span className="font-medium">ID del Usuario:</span>
                      <span className="font-mono">{user.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Fecha de Registro:</span>
                      <span>{user.creado_en ? new Date(user.creado_en).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      }) : 'Fecha desconocida'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Última Actualización:</span>
                      <span>{user.updated_at ? new Date(user.updated_at).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      }) : 'Nunca actualizado'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Estado:</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        formData.rol === 'admin' 
                          ? 'bg-red-100 text-red-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {formData.rol === 'admin' ? '👑 Administrador' : '👤 Usuario'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Advertencia para cambio de rol */}
                {formData.rol !== user.rol && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                    <div className="flex items-start">
                      <svg className="w-5 h-5 text-yellow-600 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 15.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                      <div>
                        <h4 className="text-sm font-medium text-yellow-800">Cambio de Rol Detectado</h4>
                        <p className="text-sm text-yellow-700 mt-1">
                          Estás cambiando el rol de <strong>{user.rol === 'admin' ? 'Administrador' : 'Usuario'}</strong> a <strong>{formData.rol === 'admin' ? 'Administrador' : 'Usuario'}</strong>. 
                          Este cambio afectará los permisos del usuario en la plataforma.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Botones de Acción */}
            <div className="flex flex-col sm:flex-row gap-4 mt-8 pt-6 border-t border-gray-200">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 sm:flex-none px-8 py-3 hover:bg-gray-200 text-black border-b-2 border-black font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2"
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Guardando...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Guardar Cambios
                  </>
                )}
              </button>
              
              <Link to="/admin/usuarios" className="flex-1 sm:flex-none">
                <button
                  type="button"
                  className="w-full px-8 py-3 hover:bg-gray-200 text-black border-b-2 border-black font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2"
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
      </div>
    </div>
  );
};

export default EditUser;