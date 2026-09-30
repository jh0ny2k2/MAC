import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AdminNavbar from '../../../components/Layout/AdminNavbar';
import { supabase } from '../../../lib/supabase';

const AddUser = () => {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    rol: 'user',
    password: ''
  });
  const [errors, setErrors] = useState({});

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
    
    if (!formData.password.trim()) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }
    
    if (!formData.rol) {
      newErrors.rol = 'El rol es requerido';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const getAuthEndpoint = () => {
    const isLocal = ['localhost', '127.0.0.1'].includes(window.location.hostname);
    return isLocal ? 'http://localhost:3001/api/auth' : '/.netlify/functions/auth';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setSaving(true);
      
      const res = await fetch(`${getAuthEndpoint()}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: formData.nombre.trim(),
          email: formData.email.trim(),
          password: formData.password,
          rol: formData.rol
        })
      });
      const data = await res.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Error al crear el usuario');
      }
      
      alert('Usuario creado exitosamente');
      navigate('/admin/usuarios');
      
    } catch (error) {
      console.error('Error creating user:', error);
      alert(`Error al crear el usuario: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

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
                <span className="text-gray-900">Agregar Usuario</span>
              </nav>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Agregar Usuario</h1>
              <p className="text-gray-600">Crea un nuevo usuario en la plataforma</p>
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
                  <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-2">
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

                {/* Contraseña */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    Contraseña *
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                      errors.password ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="Mínimo 6 caracteres"
                  />
                  {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
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

              {/* Vista Previa del Usuario */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-3">
                  Vista Previa
                </h3>
                
                {/* Avatar del Usuario */}
                <div className="flex items-center space-x-4">
                  <div className={`h-20 w-20 rounded-full flex items-center justify-center text-white font-bold text-2xl ${
                    formData.rol === 'admin' 
                      ? 'bg-gradient-to-br from-red-400 to-red-600' 
                      : 'bg-gradient-to-br from-blue-400 to-blue-600'
                  }`}>
                    {formData.nombre ? formData.nombre.charAt(0).toUpperCase() : formData.email.charAt(0).toUpperCase() || '?'}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Avatar del Usuario</p>
                    <p className="text-sm text-gray-500">Se genera automáticamente con la inicial del nombre</p>
                  </div>
                </div>

                {/* Información del Usuario */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <h4 className="font-medium text-gray-900 mb-3">Información del Nuevo Usuario</h4>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex justify-between">
                      <span className="font-medium">Nombre:</span>
                      <span>{formData.nombre || 'Sin especificar'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Email:</span>
                      <span>{formData.email || 'Sin especificar'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Rol:</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        formData.rol === 'admin' 
                          ? 'bg-red-100 text-red-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {formData.rol === 'admin' ? '👑 Administrador' : '👤 Usuario'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Fecha de Creación:</span>
                      <span>{new Date().toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}</span>
                    </div>
                  </div>
                </div>

                {/* Información de Seguridad */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <div className="flex items-start">
                    <svg className="w-5 h-5 text-blue-600 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <h4 className="text-sm font-medium text-blue-800">Información de Seguridad</h4>
                      <p className="text-sm text-blue-700 mt-1">
                        El usuario recibirá un email de confirmación para activar su cuenta. 
                        La contraseña será encriptada automáticamente por el sistema.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Advertencia para rol de administrador */}
                {formData.rol === 'admin' && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                    <div className="flex items-start">
                      <svg className="w-5 h-5 text-yellow-600 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 15.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                      <div>
                        <h4 className="text-sm font-medium text-yellow-800">Rol de Administrador</h4>
                        <p className="text-sm text-yellow-700 mt-1">
                          Estás creando un usuario con permisos de <strong>Administrador</strong>. 
                          Este usuario tendrá acceso completo a todas las funciones de administración.
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
                    Creando Usuario...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Crear Usuario
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

export default AddUser;