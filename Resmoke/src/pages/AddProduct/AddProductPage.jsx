import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { categories } from '../../data/mockData';
import Header from '../../components/Layout/HeaderProducts';
import useAnalytics from '../../hooks/useAnalytics';

const STEPS = [
  { id: 1, label: 'Categoría' },
  { id: 2, label: 'Detalles' },
  { id: 3, label: 'Ubicación' },
  { id: 4, label: 'Fotos' },
  { id: 5, label: 'Revisar' },
];

const AddProductPage = () => {
  const [step, setStep] = useState(1);
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
    fotoExtra4: null,
    promocionar: false
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [previewImages, setPreviewImages] = useState({
    fotoPrincipal: null,
    fotoExtra1: null,
    fotoExtra2: null,
    fotoExtra3: null,
    fotoExtra4: null
  });
  const [suggesting, setSuggesting] = useState(false);
  const [direction, setDirection] = useState('forward');
  const containerRef = useRef(null);
  const keywordCategoryMap = {
    cachimba: 1, hookah: 1, cazoleta: 2, manguera: 3, base: 4,
    accesorios: 5, accesorio: 5, vaper: 6, vape: 6
  };

  const { user } = useAuth();
  const navigate = useNavigate();
  const { trackFormSubmit, trackError, trackEvent } = useAnalytics();

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [step]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    if (name === 'nombreProducto') {
      const lower = (value || '').toLowerCase();
      let detected = null;
      Object.keys(keywordCategoryMap).forEach(k => {
        if (!detected && lower.includes(k)) detected = keywordCategoryMap[k];
      });
      if (detected) {
        setFormData(prev => ({ ...prev, categoria: String(detected) }));
      }
    }
  };

  const handleFileChange = (e, fieldName) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, [fieldName]: file }));
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImages(prev => ({ ...prev, [fieldName]: e.target.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const generateSuggestions = () => {
    const catId = parseInt(formData.categoria);
    const catName = categories.find(c => c.id === catId)?.nombre || '';
    const baseTitle = formData.nombreProducto?.trim() || '';
    const basePrice = formData.precioProducto ? Number(formData.precioProducto) : null;
    const title = baseTitle || (catName ? `${catName} en buen estado` : 'Producto en buen estado');
    const priceNote = basePrice && basePrice > 0 ? `Precio ${basePrice}€.` : '';
    const desc = formData.descripcionProducto?.trim() ||
      `${catName ? `${catName} ` : 'Producto '}usado, funcionando correctamente, cuidado y limpio. Incluye accesorios básicos si aplica. ${priceNote} Entrega en mano o envío a acordar.`;
    return { title, desc };
  };

  const applySuggestions = () => {
    setSuggesting(true);
    const s = generateSuggestions();
    setFormData(prev => ({ ...prev, nombreProducto: s.title, descripcionProducto: s.desc }));
    setTimeout(() => setSuggesting(false), 300);
  };

  const photoCount =
    (previewImages.fotoPrincipal ? 1 : 0) +
    (previewImages.fotoExtra1 ? 1 : 0) +
    (previewImages.fotoExtra2 ? 1 : 0) +
    (previewImages.fotoExtra3 ? 1 : 0) +
    (previewImages.fotoExtra4 ? 1 : 0);

  const isDescriptionOk = (formData.descripcionProducto || '').trim().length >= 40;

  const canGoNext = () => {
    switch (step) {
      case 1: return !!formData.categoria;
      case 2: return !!formData.nombreProducto.trim() && !!formData.precioProducto && Number(formData.precioProducto) > 0;
      case 3: return !!formData.localizacion.trim();
      case 4: return !!formData.fotoPrincipal;
      default: return true;
    }
  };

  const stepErrors = () => {
    switch (step) {
      case 1: return !formData.categoria ? 'Selecciona una categoría para continuar' : '';
      case 2: {
        if (!formData.nombreProducto.trim()) return 'Escribe el nombre del producto';
        if (!formData.precioProducto || Number(formData.precioProducto) <= 0) return 'Indica un precio válido';
        return '';
      }
      case 3: return !formData.localizacion.trim() ? 'Indica tu ubicación para continuar' : '';
      case 4: return !formData.fotoPrincipal ? 'Añade al menos la foto principal' : '';
      default: return '';
    }
  };

  const nextStep = () => {
    const err = stepErrors();
    if (err) {
      setErrors({ [Object.keys(errors)[0] || 'step']: err });
      return;
    }
    setErrors({});
    setDirection('forward');
    setStep(s => Math.min(s + 1, STEPS.length));
  };

  const prevStep = () => {
    setErrors({});
    setDirection('backward');
    setStep(s => Math.max(s - 1, 1));
  };

  const handleSubmit = async () => {
    const newErrors = {};
    if (!formData.categoria) newErrors.categoria = 'Selecciona una categoría';
    if (!formData.nombreProducto.trim()) newErrors.nombreProducto = 'El nombre es requerido';
    if (!formData.precioProducto || formData.precioProducto <= 0) newErrors.precioProducto = 'El precio debe ser mayor a 0';
    if (!formData.descripcionProducto.trim()) newErrors.descripcionProducto = 'La descripción es requerida';
    if (!formData.localizacion.trim()) newErrors.localizacion = 'La localización es requerida';
    if (!formData.fotoPrincipal) newErrors.fotoPrincipal = 'La foto principal es requerida';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      trackFormSubmit('add_product_form', false, 'validation_failed');
      return;
    }

    trackFormSubmit('add_product_form', true, 'validation_passed');
    setLoading(true);

    try {
      if (!user) {
        alert('Debes iniciar sesión para subir productos');
        setLoading(false);
        return;
      }

      const { data: userData, error: userError } = await supabase
        .from('Users').select('id').eq('email', user.email).single();

      if (userError) throw new Error('Usuario no encontrado en la base de datos');

      const imageUrls = {};

      if (formData.fotoPrincipal) {
        const allowed = ['jpg', 'jpeg', 'png', 'webp'];
        const ext = formData.fotoPrincipal.name.split('.').pop().toLowerCase();
        if (!allowed.includes(ext)) throw new Error(`Formato no válido. Solo: ${allowed.join(', ')}`);
        const fileName = `${Date.now()}_principal_${user.id}.${ext}`;
        const { error: uploadError } = await supabase.storage
          .from('product-images').upload(fileName, formData.fotoPrincipal);
        if (uploadError) throw new Error(`Error subiendo foto: ${uploadError.message}`);
        const { data: urlData } = supabase.storage.from('product-images').getPublicUrl(fileName);
        imageUrls.fotoPrincipal = urlData.publicUrl;
      }

      for (let i = 0; i < 4; i++) {
        const field = `fotoExtra${i + 1}`;
        if (formData[field]) {
          const allowed = ['jpg', 'jpeg', 'png', 'webp'];
          const ext = formData[field].name.split('.').pop().toLowerCase();
          if (!allowed.includes(ext)) throw new Error(`Formato no válido para ${field}`);
          const fileName = `${Date.now() + i}_${field}_${user.id}.${ext}`;
          const { error: uploadError } = await supabase.storage
            .from('product-images').upload(fileName, formData[field]);
          if (uploadError) throw new Error(`Error subiendo ${field}: ${uploadError.message}`);
          const { data: urlData } = supabase.storage.from('product-images').getPublicUrl(fileName);
          imageUrls[field] = urlData.publicUrl;
        }
      }

      const { data, error } = await supabase.from('products').insert([{
        user_id: userData.id,
        category_id: parseInt(formData.categoria),
        name: formData.nombreProducto,
        price: parseFloat(formData.precioProducto),
        description: formData.descripcionProducto,
        location: formData.localizacion,
        main_image: imageUrls.fotoPrincipal,
        extra_image_1: imageUrls.fotoExtra1 || null,
        extra_image_2: imageUrls.fotoExtra2 || null,
        extra_image_3: imageUrls.fotoExtra3 || null,
        extra_image_4: imageUrls.fotoExtra4 || null,
        status: 'pending',
        view_count: 0,
        favorite_count: 0,
        promoted: formData.promocionar ? 'YES' : 'NO'
      }]).select();

      if (error) throw new Error(`Error insertando producto: ${error.message}`);

      const categoryName = categories.find(cat => cat.id === parseInt(formData.categoria))?.nombre || 'Unknown';
      trackEvent('product_created', {
        product_id: data[0]?.id, product_name: formData.nombreProducto,
        category: categoryName, price: parseFloat(formData.precioProducto),
        location: formData.localizacion,
        has_extra_images: !!(formData.fotoExtra1 || formData.fotoExtra2 || formData.fotoExtra3 || formData.fotoExtra4)
      });

      try {
        const isLocal = ['localhost', '127.0.0.1'].includes(window.location.hostname);
        const emailEndpoint = isLocal ? 'http://localhost:3001/api/email/send' : '/.netlify/functions/email-send';
        const productId = data[0]?.id;
        const origin = window.location.origin;
        const productUrl = productId ? `${origin}/product/${productId}` : origin;
        await fetch(emailEndpoint, {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to: 'info.resmoke@gmail.com', template: 'product_added',
            subject: `Nuevo producto añadido · ${formData.nombreProducto}`,
            props: {
              productName: formData.nombreProducto,
              price: parseFloat(formData.precioProducto).toLocaleString('es-ES'),
              categoryName, location: formData.localizacion,
              uploaderName: user?.nombre || '', uploaderEmail: user?.email || '', productUrl
            }
          })
        });
      } catch (e) {
        console.error('Error enviando email:', e);
      }

      alert('¡Publicado!');
      navigate('/');

    } catch (error) {
      console.error('Error al subir producto:', error);
      trackError('add_product_error', error.message, '/add-product');
      alert(`Error al subir el producto: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const catName = categories.find(c => c.id === parseInt(formData.categoria))?.nombre || '';
  const progress = Math.round(((step - 1) / (STEPS.length - 1)) * 100);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div ref={containerRef} className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 mt-16">

        <div className="text-center mb-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-50 rounded-full border border-gray-200/60 text-[11px] text-gray-500 font-semibold tracking-wide mb-4">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Nuevo anuncio
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight leading-tight">Publica tu producto</h1>
          <p className="text-gray-400 mt-2 text-sm">Completa los pasos para aparecer en la tienda</p>
        </div>

        <div className="mb-10">
          <div className="flex items-center gap-0 mb-4">
            {STEPS.map((s, i) => (
              <React.Fragment key={s.id}>
                <div className="flex flex-col items-center relative">
                  <div className={`relative w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold transition-all duration-500 ease-out ${
                    step === s.id
                      ? 'bg-gray-900 text-white shadow-lg shadow-gray-900/20 scale-110'
                      : step > s.id
                        ? 'bg-emerald-500 text-white shadow-md'
                        : 'bg-gray-100 text-gray-400'
                  }`}>
                    {step > s.id ? (
                      <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <span>{s.id}</span>
                    )}
                    {step === s.id && (
                      <span className="absolute -inset-1.5 rounded-full animate-ping bg-gray-900/8 z-[-1]" />
                    )}
                  </div>
                  <span className={`text-[10px] sm:text-[11px] mt-2 font-semibold tracking-tight transition-colors hidden xs:block ${
                    step === s.id ? 'text-gray-900' : step > s.id ? 'text-emerald-600' : 'text-gray-400'
                  }`}>{s.label}</span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className="flex-1 mx-1 sm:mx-2">
                    <div className="h-[3px] bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gray-900 rounded-full transition-all duration-700 ease-out"
                        style={{ width: step > s.id ? '100%' : step === s.id ? '50%' : '0%' }}
                      />
                    </div>
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[11px] text-gray-400 font-medium">
              Paso {step} de {STEPS.length}
            </span>
            <span className="text-[11px] text-gray-400 font-medium">{progress}%</span>
          </div>
        </div>

        <div className="relative min-h-[340px]">
          {[1, 2, 3, 4, 5].map((s) => (
            <div
              key={s}
              className={`transition-all duration-500 ease-out ${
                step === s
                  ? 'opacity-100 scale-100 translate-y-0'
                  : `opacity-0 scale-[0.96] ${direction === 'forward' ? 'translate-y-3' : '-translate-y-3'} absolute inset-0 pointer-events-none`
              }`}
            >
              {s === 1 && (
                <div>
                  <div className="flex items-center gap-3 mb-7">
                    <div className="w-9 h-9 bg-gray-900/5 rounded-xl flex items-center justify-center shrink-0">
                      <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-gray-900">Elige una categoría</h2>
                      <p className="text-sm text-gray-400">Selecciona la que mejor describa tu producto</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                    {categories.map((categoria) => {
                      const isSelected = formData.categoria === categoria.id.toString();
                      return (
                        <label key={categoria.id} className="flex flex-col items-center cursor-pointer group">
                          <input type="radio" name="categoria" value={categoria.id}
                            checked={isSelected} onChange={handleInputChange} className="sr-only peer"
                          />
                          <div className={`w-full aspect-square rounded-2xl flex items-center justify-center border transition-all duration-300 ${
                            isSelected
                              ? 'border-gray-900 bg-white shadow-lg shadow-gray-900/10 scale-105 ring-1 ring-gray-900/20'
                              : 'border-gray-200 bg-gray-50/50 group-hover:bg-gray-100 group-hover:border-gray-300 group-hover:shadow-sm'
                          }`}>
                            <img src={categoria.imagen} alt={categoria.nombre}
                              className={`h-10 w-10 object-contain transition-all duration-300 ${isSelected ? 'scale-110' : 'scale-100'}`}
                            />
                          </div>
                          <span className={`mt-2.5 text-[11px] font-semibold text-center leading-tight transition-colors ${
                            isSelected ? 'text-gray-900' : 'text-gray-500 group-hover:text-gray-700'
                          }`}>
                            {categoria.nombre}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}

              {s === 2 && (
                <div>
                  <div className="flex items-center gap-3 mb-7">
                    <div className="w-9 h-9 bg-gray-900/5 rounded-xl flex items-center justify-center shrink-0">
                      <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-gray-900">Información del producto</h2>
                      <p className="text-sm text-gray-400">Cuanto más detallado, mejor</p>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-100 p-4 mb-6 shadow-sm">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 bg-white rounded-xl border border-gray-200 flex items-center justify-center shrink-0 shadow-sm">
                          <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                          </svg>
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-gray-900 truncate">Asistente de IA</p>
                          <p className="text-xs text-gray-400 truncate">Genera título y descripción automáticamente</p>
                        </div>
                      </div>
                      <button type="button" onClick={applySuggestions}
                        disabled={loading || suggesting}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 shrink-0 ${
                          loading || suggesting
                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            : 'bg-gray-900 text-white hover:bg-gray-800 hover:shadow-md active:scale-[0.97]'
                        }`}
                      >
                        {suggesting ? (
                          <span className="flex items-center gap-1.5">
                            <svg className="animate-spin w-3.5 h-3.5" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            Generando...
                          </span>
                        ) : 'Sugerir'}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="nombreProducto" className="block mb-1.5 text-xs font-semibold text-gray-500 tracking-wider uppercase">Nombre</label>
                        <input type="text" id="nombreProducto" name="nombreProducto"
                          value={formData.nombreProducto} onChange={handleInputChange}
                          placeholder="p.ej. Cachimba Aladin" autoFocus
                          className="block w-full px-4 py-3 text-sm rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400 transition-all placeholder:text-gray-300"
                        />
                        {errors.nombreProducto && <p className="text-red-500 text-xs mt-1.5">{errors.nombreProducto}</p>}
                      </div>
                      <div>
                        <label htmlFor="precioProducto" className="block mb-1.5 text-xs font-semibold text-gray-500 tracking-wider uppercase">Precio</label>
                        <div className="relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-semibold text-sm">€</span>
                          <input type="number" id="precioProducto" name="precioProducto"
                            value={formData.precioProducto} onChange={handleInputChange}
                            placeholder="0" step="0.01" min="0"
                            className="block w-full pl-8 pr-4 py-3 text-sm rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400 transition-all placeholder:text-gray-300"
                          />
                        </div>
                        {errors.precioProducto && <p className="text-red-500 text-xs mt-1.5">{errors.precioProducto}</p>}
                      </div>
                    </div>
                    <div>
                      <label htmlFor="descripcionProducto" className="block mb-1.5 text-xs font-semibold text-gray-500 tracking-wider uppercase">Descripción</label>
                      <textarea id="descripcionProducto" name="descripcionProducto"
                        value={formData.descripcionProducto} onChange={handleInputChange}
                        placeholder="Describe tu producto con detalle. Estado, accesorios incluidos, motivos de venta..." rows="4"
                        className="block w-full px-4 py-3 text-sm rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400 transition-all resize-none placeholder:text-gray-300"
                      />
                      {errors.descripcionProducto && <p className="text-red-500 text-xs mt-1.5">{errors.descripcionProducto}</p>}
                      <div className="flex items-center gap-2.5 mt-2">
                        <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full rounded-full transition-all duration-500 ease-out bg-gray-900"
                            style={{ width: `${Math.min(100, (formData.descripcionProducto.length / 40) * 100)}%` }}
                          />
                        </div>
                        <span className={`text-[11px] font-semibold ${isDescriptionOk ? 'text-emerald-600' : 'text-gray-400'}`}>
                          {formData.descripcionProducto.length}/40
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {s === 3 && (
                <div>
                  <div className="flex items-center gap-3 mb-7">
                    <div className="w-9 h-9 bg-gray-900/5 rounded-xl flex items-center justify-center shrink-0">
                      <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-gray-900">¿Dónde estás?</h2>
                      <p className="text-sm text-gray-400">Para que los compradores sepan dónde recoger</p>
                    </div>
                  </div>
                  <div className="max-w-md">
                    <div className="relative group">
                      <div className="absolute inset-0 bg-gradient-to-r from-gray-900/5 to-transparent rounded-xl opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none" />
                      <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-focus-within:text-gray-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <input type="text" id="localizacion" name="localizacion"
                        value={formData.localizacion} onChange={handleInputChange}
                        placeholder="Madrid, Barcelona, Valencia..." autoFocus
                        className="block w-full pl-12 pr-4 py-3.5 text-sm rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400 transition-all placeholder:text-gray-300 relative"
                      />
                    </div>
                    {errors.localizacion && <p className="text-red-500 text-xs mt-1.5">{errors.localizacion}</p>}
                    <p className="text-xs text-gray-400 mt-2 flex items-center gap-1.5">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Indica la ciudad o zona de recogida
                    </p>
                  </div>
                </div>
              )}

              {s === 4 && (
                <div>
                  <div className="flex items-center gap-3 mb-7">
                    <div className="w-9 h-9 bg-gray-900/5 rounded-xl flex items-center justify-center shrink-0">
                      <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-gray-900">Fotografías</h2>
                      <p className="text-sm text-gray-400">Las imágenes ayudan a vender más</p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="w-full sm:flex-1">
                      <div className={`relative h-48 sm:h-64 rounded-2xl border-2 border-dashed transition-all duration-300 overflow-hidden group ${
                        previewImages.fotoPrincipal
                          ? 'border-gray-300'
                          : 'border-gray-200 hover:border-gray-400 hover:bg-gray-50/50'
                      }`}>
                        <input type="file" name="fotoPrincipal"
                          onChange={(e) => handleFileChange(e, 'fotoPrincipal')}
                          className="absolute inset-0 opacity-0 cursor-pointer z-10" accept="image/*"
                        />
                        {previewImages.fotoPrincipal ? (
                          <>
                            <img src={previewImages.fotoPrincipal} alt="" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors z-20" />
                          </>
                        ) : (
                          <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center mb-3 group-hover:bg-gray-200 transition-all group-hover:scale-110">
                              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                            <p className="text-xs font-semibold text-gray-400">Foto principal</p>
                            <p className="text-[10px] text-gray-300 mt-1">Toca para subir</p>
                          </div>
                        )}
                        <div className={`absolute top-3 left-3 px-2 py-0.5 rounded-lg text-[10px] font-bold z-20 transition-all ${
                          previewImages.fotoPrincipal
                            ? 'bg-gray-900/80 text-white backdrop-blur-sm'
                            : 'bg-white/90 text-gray-500 border border-gray-200/50 backdrop-blur-sm'
                        }`}>
                          Principal
                        </div>
                      </div>
                      {errors.fotoPrincipal && <p className="text-red-500 text-xs mt-1.5">{errors.fotoPrincipal}</p>}
                    </div>
                    <div className="w-full sm:flex-1">
                      <div className="grid grid-cols-2 gap-2 h-48 sm:h-64">
                        {[1, 2, 3, 4].map((num) => {
                          const hasImage = !!previewImages[`fotoExtra${num}`];
                          return (
                            <label key={num} className={`relative rounded-xl border-2 border-dashed transition-all duration-300 overflow-hidden cursor-pointer group ${
                              hasImage
                                ? 'border-gray-300'
                                : 'border-gray-200 hover:border-gray-400 hover:bg-gray-50/50'
                            }`}>
                              <input type="file" name={`fotoExtra${num}`}
                                onChange={(e) => handleFileChange(e, `fotoExtra${num}`)}
                                className="absolute inset-0 opacity-0 z-10" accept="image/*"
                              />
                              {hasImage ? (
                                <>
                                  <img src={previewImages[`fotoExtra${num}`]} alt="" className="w-full h-full object-cover" />
                                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors z-20" />
                                </>
                              ) : (
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                  <svg className="w-5 h-5 text-gray-300 group-hover:text-gray-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                                  </svg>
                                  <span className="text-[10px] text-gray-300 mt-1 font-medium">{num}</span>
                                </div>
                              )}
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center gap-2 text-xs text-gray-400">
                    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Foto principal obligatoria. Añade hasta 4 fotos extra.</span>
                  </div>
                </div>
              )}

              {s === 5 && (
                <div>
                  <div className="flex items-center gap-3 mb-7">
                    <div className="w-9 h-9 bg-gray-900/5 rounded-xl flex items-center justify-center shrink-0">
                      <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-gray-900">Revisa tu anuncio</h2>
                      <p className="text-sm text-gray-400">Todo correcto antes de publicar</p>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                    <div className="p-5 space-y-4">
                      <div className="flex items-start gap-4 pb-4 border-b border-gray-100">
                        <div className="w-14 h-14 rounded-xl overflow-hidden bg-gray-50 ring-1 ring-gray-200 shrink-0">
                          {previewImages.fotoPrincipal ? (
                            <img src={previewImages.fotoPrincipal} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-gray-900 truncate">{formData.nombreProducto || 'Sin título'}</p>
                          <p className="text-xs text-gray-400 mt-0.5">
                            {catName && <span className="text-gray-500 font-medium">{catName}</span>}
                            {catName && formData.localizacion && <span className="text-gray-300 mx-1">·</span>}
                            {formData.localizacion && <span>{formData.localizacion}</span>}
                          </p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-xl font-bold text-gray-900">
                            {formData.precioProducto ? `${formData.precioProducto}€` : '—'}
                          </p>
                        </div>
                      </div>

                      <div>
                        <p className="text-[11px] text-gray-400 font-semibold uppercase tracking-wider mb-1">Descripción</p>
                        <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                          {formData.descripcionProducto || 'Sin descripción'}
                        </p>
                      </div>

                      {photoCount > 0 && (
                        <div className="pt-2">
                          <p className="text-[11px] text-gray-400 font-semibold uppercase tracking-wider mb-2.5">
                            {photoCount} foto{photoCount !== 1 ? 's' : ''}
                          </p>
                          <div className="flex gap-2 flex-wrap">
                            {[0, 1, 2, 3, 4].map(n => {
                              const key = n === 0 ? 'fotoPrincipal' : `fotoExtra${n}`;
                              return previewImages[key] ? (
                                <div key={key} className="relative">
                                  <img src={previewImages[key]} alt="" className="w-14 h-14 rounded-xl object-cover ring-1 ring-gray-200" />
                                  {n === 0 && (
                                    <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-gray-900 text-white text-[9px] font-bold rounded-full flex items-center justify-center ring-2 ring-white">
                                      P
                                    </span>
                                  )}
                                </div>
                              ) : null;
                            })}
                          </div>
                        </div>
                      )}

                      {formData.promocionar && (
                        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-center gap-2">
                          <svg className="w-4 h-4 text-amber-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                          </svg>
                          <p className="text-xs text-amber-800 font-medium">Anuncio promocionado</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-10 flex items-center justify-between">
          <button type="button" onClick={prevStep}
            disabled={step === 1 || loading}
            className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center gap-1.5 ${
              step === 1
                ? 'text-gray-300 cursor-not-allowed'
                : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100 active:scale-[0.98]'
            }`}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Atrás
          </button>

          <div className="flex items-center gap-3">
            {step < STEPS.length ? (
              <button type="button" onClick={nextStep}
                disabled={!canGoNext() || loading}
                className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 flex items-center gap-1.5 ${
                  !canGoNext()
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-900 text-white hover:bg-gray-800 hover:shadow-lg hover:shadow-gray-900/20 active:scale-[0.97]'
                }`}
              >
                Continuar
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            ) : (
              <button type="button" onClick={handleSubmit}
                disabled={loading}
                className={`px-8 py-3 rounded-xl text-sm font-bold transition-all duration-200 ${
                  loading
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-900 text-white hover:bg-gray-800 hover:shadow-lg hover:shadow-gray-900/20 active:scale-[0.97]'
                }`}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Publicando...
                  </span>
                ) : 'Publicar anuncio'}
              </button>
            )}
          </div>
        </div>

        {errors.step && (
          <div className="mt-4 text-center">
            <span className="text-red-500 text-xs font-medium bg-red-50 border border-red-100 rounded-xl py-2 px-4 inline-flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {errors.step}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddProductPage;
