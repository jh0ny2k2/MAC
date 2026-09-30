import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AdminNavbar from '../../../components/Layout/AdminNavbar';
import { supabase } from '../../../lib/supabase';

const AddCategory = () => {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: ''
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
    
    if (!formData.name.trim()) {
      newErrors.name = 'El nombre de la categoría es requerido';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'El nombre debe tener al menos 2 caracteres';
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
      
      // Insertar nueva categoría en la tabla categories
      const { error } = await supabase
        .from('categories')
        .insert({
          name: formData.name.trim(),
          description: formData.description.trim() || null
        });
      
      if (error) throw error;
      
      alert('Categoría creada exitosamente');
      navigate('/admin/categorias');
      
    } catch (error) {
      console.error('Error creating category:', error);
      alert(`Error al crear la categoría: ${error.message}`);
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
                <Link to="/admin/categorias" className="hover:text-blue-600">Categorías</Link>
                <span className="mx-2">›</span>
                <span className="text-gray-900">Agregar Categoría</span>
              </nav>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Agregar Categoría</h1>
              <p className="text-gray-600">Crea una nueva categoría para organizar los productos</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <form onSubmit={handleSubmit} className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Información de la Categoría */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-3">
                  Información de la Categoría
                </h3>
                
                {/* Nombre de la Categoría */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre de la Categoría *
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
                    placeholder="Ej: Electrónicos, Ropa, Hogar, etc."
                  />
                  {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                </div>

                {/* Descripción */}
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                    Descripción (Opcional)
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Describe brevemente qué tipo de productos incluye esta categoría..."
                  />
                </div>
              </div>

              {/* Vista Previa de la Categoría */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-3">
                  Vista Previa
                </h3>
                
                {/* Avatar de la Categoría */}
                <div className="flex items-center space-x-4">
                  <div className="h-20 w-20 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white font-bold text-2xl">
                    {formData.name ? formData.name.charAt(0).toUpperCase() : '?'}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Icono de la Categoría</p>
                    <p className="text-sm text-gray-500">Se genera automáticamente con la inicial del nombre</p>
                  </div>
                </div>

                {/* Información de la Categoría */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <h4 className="font-medium text-gray-900 mb-3">Información de la Nueva Categoría</h4>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex justify-between">
                      <span className="font-medium">Nombre:</span>
                      <span>{formData.name || 'Sin especificar'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Descripción:</span>
                      <span className="text-right max-w-48 truncate">
                        {formData.description || 'Sin descripción'}
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

                {/* Información adicional */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <div className="flex items-start">
                    <svg className="w-5 h-5 text-blue-600 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <h4 className="text-sm font-medium text-blue-800">Información</h4>
                      <p className="text-sm text-blue-700 mt-1">
                        Una vez creada, la categoría estará disponible inmediatamente para ser asignada a productos. 
                        Puedes editarla o eliminarla desde la lista de categorías.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Vista previa de cómo se verá en la lista */}
                {formData.name && (
                  <div className="bg-white border border-gray-200 rounded-xl p-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-3">Vista previa en la lista</h4>
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-12 w-12">
                        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                          {formData.name.charAt(0).toUpperCase()}
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {formData.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          Categoría de productos
                        </div>
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
                className="flex-1 sm:flex-none px-8 py-3 text-black border-b-2 border-black font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2"
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Creando Categoría...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Crear Categoría
                  </>
                )}
              </button>
              
              <Link to="/admin/categorias" className="flex-1 sm:flex-none">
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
      </div>
    </div>
  );
};

export default AddCategory;