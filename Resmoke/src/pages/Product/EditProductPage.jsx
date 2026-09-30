import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { categories } from '../../data/mockData';
import Header from '../../components/Layout/HeaderProducts';
import Footer from '../../components/Layout/Footer';

const EditProductPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [formData, setFormData] = useState({
    categoria: '',
    nombreProducto: '',
    precioProducto: '',
    descripcionProducto: '',
    localizacion: '',
    fotoPrincipal: null,
    fotoExtra1: null,
    fotoExtra2: null,
    fotoExtra3: null,
    fotoExtra4: null
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [loadingProduct, setLoadingProduct] = useState(true);
  const [previewImages, setPreviewImages] = useState({
    fotoPrincipal: null,
    fotoExtra1: null,
    fotoExtra2: null,
    fotoExtra3: null,
    fotoExtra4: null
  });
  const [imagesToDelete, setImagesToDelete] = useState({
    fotoExtra1: false,
    fotoExtra2: false,
    fotoExtra3: false,
    fotoExtra4: false
  });
  
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      fetchProduct();
    }
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoadingProduct(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      if (data) {
        setProduct(data);
        setFormData({
          categoria: data.category_id?.toString() || '',
          nombreProducto: data.name || '',
          precioProducto: data.price?.toString() || '',
          descripcionProducto: data.description || '',
          localizacion: data.location || '',
          fotoPrincipal: null,
          fotoExtra1: null,
          fotoExtra2: null,
          fotoExtra3: null,
          fotoExtra4: null
        });
        setPreviewImages({
          fotoPrincipal: data.main_image || null,
          fotoExtra1: data.extra_image_1 || null,
          fotoExtra2: data.extra_image_2 || null,
          fotoExtra3: data.extra_image_3 || null,
          fotoExtra4: data.extra_image_4 || null
        });
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      alert('Error al cargar el producto');
      navigate(-1);
    } finally {
      setLoadingProduct(false);
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

  const handleFileChange = (e, fieldName) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        [fieldName]: file
      }));
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImages(prev => ({
          ...prev,
          [fieldName]: e.target.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = async (fieldName) => {
    try {
      if (!window.confirm('¿Estás seguro de que quieres eliminar esta imagen?')) {
        return;
      }
      setPreviewImages(prev => ({
        ...prev,
        [fieldName]: null
      }));
      setFormData(prev => ({
        ...prev,
        [fieldName]: null
      }));
      const fieldMapping = {
        fotoExtra1: 'extra_image_1',
        fotoExtra2: 'extra_image_2', 
        fotoExtra3: 'extra_image_3',
        fotoExtra4: 'extra_image_4'
      };
      const dbField = fieldMapping[fieldName];
      if (dbField) {
        const { error } = await supabase
          .from('products')
          .update({ [dbField]: null })
          .eq('id', id);
        if (error) {
          console.error('Error eliminando imagen:', error);
          alert('Error al eliminar la imagen');
        } else {
          alert('Imagen eliminada exitosamente');
        }
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al eliminar la imagen');
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.categoria) newErrors.categoria = 'Selecciona una categoría';
    if (!formData.nombreProducto.trim()) newErrors.nombreProducto = 'El nombre es obligatorio';
    if (!formData.precioProducto || formData.precioProducto <= 0) newErrors.precioProducto = 'El precio debe ser mayor a 0';
    if (!formData.descripcionProducto.trim()) newErrors.descripcionProducto = 'La descripción es obligatoria';
    if (!formData.localizacion.trim()) newErrors.localizacion = 'La localización es obligatoria';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const uploadImage = async (file, fileName) => {
    if (!file) return null;
    try {
      const allowedExtensions = ['jpg', 'jpeg', 'png', 'webp'];
      const fileExt = file.name.split('.').pop().toLowerCase();
      if (!allowedExtensions.includes(fileExt)) {
        throw new Error(`Formato de archivo no válido. Solo se permiten: ${allowedExtensions.join(', ')}`);
      }
      const timestamp = Date.now();
      const cleanFileName = `${timestamp}_${fileName}_${user?.id || 'unknown'}.${fileExt}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(cleanFileName, file, {
          cacheControl: '3600',
          upsert: false
        });
      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw new Error(`Error al subir imagen: ${uploadError.message}`);
      }
      const { data: urlData } = supabase.storage
        .from('product-images')
        .getPublicUrl(cleanFileName);
      return urlData.publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  };

  const handleMarkForDeletion = (fieldName) => {
    setImagesToDelete(prev => ({
      ...prev,
      [fieldName]: !prev[fieldName]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    try {
      const imageUploads = {};
      const newPreviewImages = { ...previewImages };
      
      if (formData.fotoPrincipal) {
        try {
          const uploadedUrl = await uploadImage(formData.fotoPrincipal, 'principal');
          imageUploads.main_image = uploadedUrl;
          newPreviewImages.fotoPrincipal = uploadedUrl;
        } catch (error) {
          console.error('Error subiendo foto principal:', error);
          throw new Error(`Error subiendo foto principal: ${error.message}`);
        }
      }
      
      const extraFields = ['fotoExtra1', 'fotoExtra2', 'fotoExtra3', 'fotoExtra4'];
      const extraDbFields = ['extra_image_1', 'extra_image_2', 'extra_image_3', 'extra_image_4'];
      
      for (let i = 0; i < extraFields.length; i++) {
        const field = extraFields[i];
        const dbField = extraDbFields[i];
        if (formData[field]) {
          try {
            const uploadedUrl = await uploadImage(formData[field], `extra${i + 1}`);
            imageUploads[dbField] = uploadedUrl;
            newPreviewImages[field] = uploadedUrl;
          } catch (error) {
            console.error(`Error subiendo ${field}:`, error);
            throw new Error(`Error subiendo ${field}: ${error.message}`);
          }
        }
      }
      
      if (imagesToDelete.fotoExtra1) imageUploads.extra_image_1 = null;
      if (imagesToDelete.fotoExtra2) imageUploads.extra_image_2 = null;
      if (imagesToDelete.fotoExtra3) imageUploads.extra_image_3 = null;
      if (imagesToDelete.fotoExtra4) imageUploads.extra_image_4 = null;
      
      const updateData = {
        name: formData.nombreProducto,
        price: parseFloat(formData.precioProducto),
        description: formData.descripcionProducto,
        location: formData.localizacion,
        category_id: parseInt(formData.categoria),
        ...(product?.status === 'rejected' ? { status: 'pending' } : {}),
        ...imageUploads
      };
      
      const { error } = await supabase
        .from('products')
        .update(updateData)
        .eq('id', id);
      
      if (error) throw error;
      
      setPreviewImages(newPreviewImages);
      setFormData(prev => ({
        ...prev,
        fotoPrincipal: null,
        fotoExtra1: null,
        fotoExtra2: null,
        fotoExtra3: null,
        fotoExtra4: null
      }));
      setImagesToDelete({
        fotoExtra1: false,
        fotoExtra2: false,
        fotoExtra3: false,
        fotoExtra4: false
      });
      
      alert('Producto actualizado exitosamente');
      navigate(`/product/${id}`);
    } catch (error) {
      console.error('Error updating product:', error);
      alert('Error al actualizar el producto. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  if (loadingProduct) {
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

  const isPromoted = product?.promoted === 'YES';
  const currentCat = categories.find(c => c.id.toString() === formData.categoria);

  const steps = [
    { id: 'categoria', label: 'Categoría', done: !!formData.categoria },
    { id: 'info', label: 'Información', done: !!(formData.nombreProducto && formData.precioProducto && formData.descripcionProducto && formData.localizacion) },
    { id: 'fotos', label: 'Fotografías', done: !!previewImages.fotoPrincipal }
  ];

  const completedSteps = steps.filter(s => s.done).length;

  return (
    <div className="min-h-screen bg-gray-50/60">
      <Header />

      {/* Hero Banner */}
      <div className="relative">
        <div className="h-28 sm:h-36 bg-gradient-to-br from-gray-100 via-gray-50 to-gray-200 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-white/40 to-transparent" />
          <div className="absolute top-0 right-0 w-72 h-72 bg-gray-200/30 rounded-full -translate-y-1/2 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-56 h-56 bg-gray-200/30 rounded-full translate-y-1/3 -translate-x-1/4" />
        </div>
        <div className="absolute inset-0 flex items-end">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 w-full pb-4 sm:pb-5">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <div className="flex items-center gap-2 text-xs text-gray-400 mb-1">
                  <button onClick={() => navigate(`/product/${id}`)} className="hover:text-gray-600 transition-colors">Producto</button>
                  <span>/</span>
                  <span className="text-gray-600 font-medium">Editar</span>
                </div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">Editar producto</h1>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-full border border-gray-200/80 shadow-sm">
                <div className="flex -space-x-1">
                  {[1, 2, 3].map((s) => (
                    <div key={s} className={`w-2 h-2 rounded-full border border-white ${s <= completedSteps ? 'bg-gray-900' : 'bg-gray-200'}`} />
                  ))}
                </div>
                <span className="text-[11px] font-medium text-gray-500">{completedSteps}/3 completado</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 -mt-3 sm:-mt-4 relative z-10 pb-12">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

            {/* LEFT: Preview (sticky) */}
            <div className="order-2 lg:order-1 lg:col-span-4">
              <div className="lg:sticky lg:top-24 space-y-6">
                <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-gray-100/80 p-5 shadow-lg shadow-gray-200/50">
                  <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-gray-100">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-gray-900 to-gray-600 flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                    </div>
                    <h3 className="text-xs font-semibold text-gray-900 tracking-wide uppercase">Vista previa</h3>
                  </div>
                  <div className="overflow-hidden rounded-xl border border-gray-100 shadow-sm">
                    <div className="relative h-48 sm:h-52 bg-gradient-to-br from-gray-50 to-gray-100">
                      {previewImages.fotoPrincipal ? (
                        <img src={previewImages.fotoPrincipal} alt="Preview" className="w-full h-full object-cover transition-all duration-300" />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <div className="text-center">
                            <svg className="w-10 h-10 text-gray-300 mx-auto mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.41a2.25 2.25 0 013.182 0l2.909 2.91m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                            </svg>
                            <span className="text-gray-400 text-[11px] font-medium">Sin imagen</span>
                          </div>
                        </div>
                      )}
                      {isPromoted && (
                        <span className="absolute top-3 right-3 bg-gradient-to-r from-purple-600 to-purple-500 text-white text-[11px] font-semibold px-2.5 py-1 rounded-full shadow-sm backdrop-blur-sm">
                          Promocionado
                        </span>
                      )}
                      {product?.status === 'rejected' && (
                        <div className="absolute inset-0 bg-red-500/10 backdrop-blur-[1px] flex items-center justify-center">
                          <span className="bg-red-500 text-white px-4 py-1.5 rounded-lg font-bold text-xs shadow-lg tracking-wide">RECHAZADO</span>
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <span className="text-[11px] font-medium text-gray-400 uppercase tracking-wider">
                        {currentCat?.nombre || 'Sin categoría'}
                      </span>
                      <p className="text-sm font-semibold text-gray-900 mt-1">
                        {formData.nombreProducto || 'Nombre del producto'}
                      </p>
                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-50">
                        <div className="flex items-center gap-1 text-xs text-gray-400">
                          <svg className="w-3 h-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                          </svg>
                          {formData.localizacion || 'Localización'}
                        </div>
                        <p className="text-base font-bold text-gray-900 tracking-tight">
                          {formData.precioProducto ? `€${formData.precioProducto}` : '€0.00'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT: Form fields */}
            <div className="order-1 lg:order-2 lg:col-span-8 space-y-5">

              {/* Category */}
              <div className="bg-white rounded-2xl border border-gray-100/80 p-6 sm:p-7 shadow-sm hover:shadow-md transition-shadow duration-300">
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center">
                      <svg className="w-3.5 h-3.5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-sm font-semibold text-gray-900">Categoría</h2>
                      <p className="text-[11px] text-gray-400">Selecciona la categoría de tu producto</p>
                    </div>
                  </div>
                  {formData.categoria && (
                    <span className="text-[11px] font-medium text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">Listo</span>
                  )}
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3">
                  {categories.map((categoria) => {
                    const isSelected = formData.categoria === categoria.id.toString();
                    return (
                      <label key={categoria.id} className="flex flex-col items-center cursor-pointer group relative">
                        <input
                          type="radio"
                          name="categoria"
                          value={categoria.id}
                          checked={isSelected}
                          onChange={handleInputChange}
                          className="sr-only peer"
                        />
                        <div className={`relative p-2.5 rounded-xl transition-all duration-200 w-full aspect-square flex items-center justify-center border-2 ${
                          isSelected
                            ? 'border-gray-900 bg-gray-50 shadow-sm ring-1 ring-gray-900/5'
                            : 'border-gray-100 group-hover:border-gray-200 bg-gray-50/50'
                        }`}>
                          <img src={categoria.imagen} alt={categoria.nombre} className={`h-12 w-12 sm:h-14 sm:w-14 object-contain transition-transform duration-200 ${isSelected ? 'scale-105' : 'group-hover:scale-105'}`} />
                          {isSelected && (
                            <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-gray-900 rounded-full flex items-center justify-center shadow-sm">
                              <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                              </svg>
                            </div>
                          )}
                        </div>
                        <span className={`mt-1.5 text-[11px] sm:text-xs font-medium text-center leading-tight transition-colors duration-200 ${
                          isSelected ? 'text-gray-900' : 'text-gray-500 group-hover:text-gray-700'
                        }`}>
                          {categoria.nombre}
                        </span>
                      </label>
                    );
                  })}
                </div>
                {errors.categoria && (
                  <div className="mt-3 flex items-center gap-2 px-3 py-2 bg-red-50 border border-red-100 rounded-lg">
                    <svg className="w-3.5 h-3.5 text-red-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                    </svg>
                    <p className="text-red-600 text-xs">{errors.categoria}</p>
                  </div>
                )}
              </div>

              {/* Basic Info */}
              <div className="bg-white rounded-2xl border border-gray-100/80 p-6 sm:p-7 shadow-sm hover:shadow-md transition-shadow duration-300">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center">
                    <svg className="w-3.5 h-3.5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15a2.25 2.25 0 012.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-sm font-semibold text-gray-900">Información básica</h2>
                    <p className="text-[11px] text-gray-400">Los detalles principales de tu producto</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="nombreProducto" className="block text-[11px] font-semibold text-gray-500 mb-1.5 tracking-wide uppercase">Nombre del producto</label>
                      <div className="relative">
                        <input
                          type="text"
                          id="nombreProducto"
                          name="nombreProducto"
                          value={formData.nombreProducto}
                          onChange={handleInputChange}
                          placeholder="p.ej. Cachimba Aladin"
                          className={`w-full px-4 py-2.5 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400 transition-all bg-white placeholder:text-gray-300 ${
                            errors.nombreProducto ? 'border-red-300 bg-red-50/30' : 'border-gray-200'
                          }`}
                        />
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                          <svg className="w-3.5 h-3.5 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
                          </svg>
                        </div>
                      </div>
                      {errors.nombreProducto && <p className="text-red-500 text-xs mt-1">{errors.nombreProducto}</p>}
                    </div>
                    <div>
                      <label htmlFor="precioProducto" className="block text-[11px] font-semibold text-gray-500 mb-1.5 tracking-wide uppercase">Precio</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                          <span className="text-gray-400 text-sm font-semibold">€</span>
                        </div>
                        <input
                          type="number"
                          id="precioProducto"
                          name="precioProducto"
                          value={formData.precioProducto}
                          onChange={handleInputChange}
                          placeholder="0.00"
                          min="0"
                          step="0.01"
                          className={`w-full pl-8 pr-4 py-2.5 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400 transition-all bg-white placeholder:text-gray-300 ${
                            errors.precioProducto ? 'border-red-300 bg-red-50/30' : 'border-gray-200'
                          }`}
                        />
                      </div>
                      {errors.precioProducto && <p className="text-red-500 text-xs mt-1">{errors.precioProducto}</p>}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="descripcionProducto" className="block text-[11px] font-semibold text-gray-500 mb-1.5 tracking-wide uppercase">Descripción</label>
                    <div className="relative">
                      <textarea
                        id="descripcionProducto"
                        name="descripcionProducto"
                        value={formData.descripcionProducto}
                        onChange={handleInputChange}
                        rows={4}
                        placeholder="Describe tu producto detalladamente: estado, medidas, materiales, etc."
                        className={`w-full px-4 py-2.5 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400 transition-all bg-white resize-none placeholder:text-gray-300 ${
                          errors.descripcionProducto ? 'border-red-300 bg-red-50/30' : 'border-gray-200'
                        }`}
                      />
                      <div className="absolute bottom-2 right-3 text-[11px] text-gray-300 pointer-events-none">
                        {formData.descripcionProducto.length}/500
                      </div>
                    </div>
                    {errors.descripcionProducto && <p className="text-red-500 text-xs mt-1">{errors.descripcionProducto}</p>}
                  </div>

                  <div>
                    <label htmlFor="localizacion" className="block text-[11px] font-semibold text-gray-500 mb-1.5 tracking-wide uppercase">Localización</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                        <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                        </svg>
                      </div>
                      <input
                        type="text"
                        id="localizacion"
                        name="localizacion"
                        value={formData.localizacion}
                        onChange={handleInputChange}
                        placeholder="p.ej. Madrid, España"
                        className={`w-full pl-10 pr-4 py-2.5 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400 transition-all bg-white placeholder:text-gray-300 ${
                          errors.localizacion ? 'border-red-300 bg-red-50/30' : 'border-gray-200'
                        }`}
                      />
                    </div>
                    {errors.localizacion && <p className="text-red-500 text-xs mt-1">{errors.localizacion}</p>}
                  </div>
                </div>
              </div>

              {/* Photos */}
              <div className="bg-white rounded-2xl border border-gray-100/80 p-6 sm:p-7 shadow-sm hover:shadow-md transition-shadow duration-300">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center">
                    <svg className="w-3.5 h-3.5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.41a2.25 2.25 0 013.182 0l2.909 2.91m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-sm font-semibold text-gray-900">Fotografías</h2>
                    <p className="text-[11px] text-gray-400">Sube imágenes de tu producto (máx. 5)</p>
                  </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-4">
                  <div className="w-full lg:flex-1">
                    <label className={`relative block w-full h-48 sm:h-56 lg:h-80 border-2 border-dashed rounded-2xl cursor-pointer transition-all duration-200 overflow-hidden group ${
                      errors.fotoPrincipal ? 'border-red-300 bg-red-50/20' : previewImages.fotoPrincipal ? 'border-gray-200 hover:border-gray-300 bg-gray-50/30' : 'border-gray-200 hover:border-gray-400 hover:bg-gray-50/50 bg-gray-50/20'
                    }`}>
                      <input
                        type="file"
                        name="fotoPrincipal"
                        onChange={(e) => handleFileChange(e, 'fotoPrincipal')}
                        className="sr-only"
                        accept="image/*"
                      />
                      {previewImages.fotoPrincipal ? (
                        <>
                          <img src={previewImages.fotoPrincipal} alt="Preview" className="w-full h-full object-cover rounded-2xl transition-transform duration-300 group-hover:scale-105" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-2xl" />
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            <div className="w-11 h-11 rounded-full bg-white/90 backdrop-blur-sm shadow-lg flex items-center justify-center transform group-hover:scale-110 transition-transform">
                              <svg className="w-5 h-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.16a15.53 15.53 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" />
                              </svg>
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center px-4">
                            <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                              <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.16a15.53 15.53 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" />
                              </svg>
                            </div>
                            <div className="text-gray-500 text-xs font-medium">Foto Principal</div>
                            <div className="text-gray-300 text-[11px] mt-0.5">Haz clic para subir o arrastra</div>
                          </div>
                        </div>
                      )}
                      {!previewImages.fotoPrincipal && (
                        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-gray-50/80 to-transparent rounded-b-2xl pointer-events-none" />
                      )}
                    </label>
                    {errors.fotoPrincipal && (
                      <div className="mt-2 flex items-center gap-1.5 px-3 py-2 bg-red-50 border border-red-100 rounded-lg">
                        <svg className="w-3.5 h-3.5 text-red-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                        </svg>
                        <p className="text-red-600 text-xs">{errors.fotoPrincipal}</p>
                      </div>
                    )}
                  </div>

                  <div className="w-full lg:flex-1">
                    <div className="grid grid-cols-2 gap-3">
                      {[1, 2, 3, 4].map((num) => {
                        const fieldName = `fotoExtra${num}`;
                        const isMarkedForDeletion = imagesToDelete[fieldName];
                        const hasImage = previewImages[fieldName];
                        return (
                          <div key={num} className={`relative rounded-xl border-2 border-dashed transition-all duration-200 h-24 sm:h-28 lg:h-[188px] ${
                            isMarkedForDeletion
                              ? 'border-red-200 bg-red-50/40 opacity-60'
                              : hasImage
                                ? 'border-gray-200 bg-gray-50/20'
                                : 'border-gray-200 hover:border-gray-300 bg-gray-50/10'
                          }`}>
                            <label className={`block w-full h-full rounded-xl cursor-pointer overflow-hidden ${isMarkedForDeletion ? 'pointer-events-none' : ''}`}>
                              <input
                                type="file"
                                name={fieldName}
                                onChange={(e) => handleFileChange(e, fieldName)}
                                className="sr-only"
                                accept="image/*"
                                disabled={isMarkedForDeletion}
                              />
                              {hasImage ? (
                                <>
                                  <img src={previewImages[fieldName]} alt={`Extra ${num}`} className={`w-full h-full object-cover rounded-xl transition-all duration-200 ${
                                    isMarkedForDeletion ? 'grayscale opacity-60' : 'group-hover:scale-105'
                                  }`} />
                                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-xl" />
                                </>
                              ) : (
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <div className="text-center">
                                    <svg className="w-5 h-5 text-gray-300 mx-auto mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                    </svg>
                                    <div className="text-gray-400 text-[11px] font-medium">Extra {num}</div>
                                  </div>
                                </div>
                              )}
                            </label>
                            {hasImage && (
                              <button
                                type="button"
                                onClick={() => handleMarkForDeletion(fieldName)}
                                className={`absolute -top-2 -right-2 rounded-full w-6 h-6 flex items-center justify-center transition-all duration-200 z-10 shadow-md hover:scale-110 ${
                                  isMarkedForDeletion
                                    ? 'bg-emerald-500 hover:bg-emerald-600 text-white'
                                    : 'bg-white hover:bg-red-500 text-gray-400 hover:text-white border border-gray-200 hover:border-red-500'
                                }`}
                                title={isMarkedForDeletion ? 'Restaurar imagen' : 'Marcar para eliminar'}
                              >
                                {isMarkedForDeletion ? (
                                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                  </svg>
                                ) : (
                                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                )}
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="mt-5 p-4 bg-gradient-to-r from-gray-50 to-gray-50/50 rounded-xl border border-gray-100/80">
                  <div className="flex items-start gap-3">
                    <div className="shrink-0 w-8 h-8 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center">
                      <svg className="w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
                      </svg>
                    </div>
                    <div className="text-[13px] text-gray-500 leading-relaxed">
                      <span className="font-medium text-gray-700">Consejos: </span>
                      Solo sube nuevas imágenes si quieres cambiar las actuales. La foto principal es la primera impresión: usa buena iluminación y muestra el producto desde varios ángulos.
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between gap-3 pt-2">
                <div className="text-xs text-gray-400">
                  <span className="font-medium text-gray-500">{completedSteps}/3</span> secciones completadas
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="px-5 py-2.5 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-semibold bg-gradient-to-r from-gray-900 to-gray-800 text-white rounded-xl hover:from-gray-800 hover:to-gray-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                        Guardando...
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                        Guardar cambios
                      </>
                    )}
                  </button>
                </div>
              </div>

            </div>

          </div>
        </form>
      </div>

      <Footer />
    </div>
  );
};

export default EditProductPage;
