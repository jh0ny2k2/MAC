import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import useAnalytics from '../../hooks/useAnalytics';
import SEO from '../../components/SEO/SEO';

const Register = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    fechaNacimiento: '',
    telefono: '',
    password: '',
    confirmPassword: '',
    fotoPerfil: null
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [previewImage, setPreviewImage] = useState(null);
  const { signIn, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const { trackSignUp, trackFormSubmit, trackError } = useAnalytics();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Limpiar error cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validar tipo de archivo
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
      if (!validTypes.includes(file.type)) {
        setErrors(prev => ({ ...prev, fotoPerfil: 'Solo se permiten archivos de imagen (JPG, PNG, GIF)' }));
        return;
      }
      
      // Validar tamaño (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, fotoPerfil: 'La imagen no puede ser mayor a 5MB' }));
        return;
      }
      
      setFormData(prev => ({ ...prev, fotoPerfil: file }));
      
      // Crear preview de la imagen
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target.result);
      };
      reader.readAsDataURL(file);
      
      // Limpiar errores
      if (errors.fotoPerfil) {
        setErrors(prev => ({ ...prev, fotoPerfil: '' }));
      }
    }
  };

  const removeImage = () => {
    setFormData(prev => ({ ...prev, fotoPerfil: null }));
    setPreviewImage(null);
    // Limpiar el input file
    const fileInput = document.getElementById('fotoPerfil');
    if (fileInput) fileInput.value = '';
  };

  const validateForm = () => {
    const newErrors = {};

    // Validar nombre
    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido';
    } else if (formData.nombre.trim().length < 2) {
      newErrors.nombre = 'El nombre debe tener al menos 2 caracteres';
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      newErrors.email = 'El correo electrónico es requerido';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Ingresa un correo electrónico válido';
    }

    // Validar fecha de nacimiento
    if (!formData.fechaNacimiento) {
      newErrors.fechaNacimiento = 'La fecha de nacimiento es requerida';
    } else {
      const today = new Date();
      const birthDate = new Date(formData.fechaNacimiento);
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      if (age < 18) {
        newErrors.fechaNacimiento = 'Debes ser mayor de 18 años';
      }
    }

    // Validar teléfono
    const phoneRegex = /^[0-9]{9,15}$/;
    if (!formData.telefono) {
      newErrors.telefono = 'El número de teléfono es requerido';
    } else if (!phoneRegex.test(formData.telefono.replace(/\s/g, ''))) {
      newErrors.telefono = 'Ingresa un número de teléfono válido';
    }

    // Validar contraseña
    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    // Validar confirmación de contraseña
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirma tu contraseña';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleGoogleRegister = async (credentialResponse) => {
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      const { data, error } = await signInWithGoogle(credentialResponse);
      
      if (error) {
        setError(error);
        trackError('google_register_failed', error, '/register');
        return;
      }
      
      // Tracking de registro exitoso con Google
      trackSignUp(data?.id || 'google_user', 'google');
      
      setSuccess('¡Registro exitoso con Google! Redirigiendo...');
      
      // Redirigir después de un breve delay
      setTimeout(() => {
        navigate('/');
      }, 1500);
      
    } catch (error) {
      setError('Error al registrarse con Google. Inténtalo de nuevo.');
      trackError('google_register_error', error.message, '/register');
    } finally {
      setLoading(false);
    }
  };

  const uploadProfileImage = async (userId, file) => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `profile_${userId}_${Date.now()}.${fileExt}`;
      const filePath = `profiles/${fileName}`;
  
      const { error: uploadError } = await supabase.storage
        .from('product-images') // Cambiar de 'profile-images' a 'product-images'
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });
  
      if (uploadError) throw uploadError;
  
      // Obtener URL pública
      const { data: { publicUrl } } = supabase.storage
        .from('product-images') // Cambiar de 'profile-images' a 'product-images'
        .getPublicUrl(filePath);
  
      return publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  };

  const getAuthEndpoint = () => {
    const isLocal = ['localhost', '127.0.0.1'].includes(window.location.hostname);
    return isLocal ? 'http://localhost:3001/api/auth' : '/.netlify/functions/auth';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      trackFormSubmit('register_form', false, 'validation_failed');
      return;
    }
    
    trackFormSubmit('register_form', true, 'validation_passed');

    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      const res = await fetch(`${getAuthEndpoint()}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: formData.nombre.trim(),
          email: formData.email.toLowerCase().trim(),
          password: formData.password,
          telefono: formData.telefono.trim(),
          fecha_nacimiento: formData.fechaNacimiento
        })
      });
      const data = await res.json();

      if (!data.success) {
        setError(data.error || 'Error al crear la cuenta');
        trackError('register_error', data.error, '/register');
        setLoading(false);
        return;
      }

      const newUser = data.user;

      try {
        const isLocal = ['localhost', '127.0.0.1'].includes(window.location.hostname);
        const startEndpoint = isLocal ? 'http://localhost:3001/api/verify-email-start' : '/.netlify/functions/start-verify-email';
        await fetch(startEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: newUser.email, nombre: newUser.nombre })
        });
      } catch (e) {}

      let profileImageUrl = null;
      if (formData.fotoPerfil) {
        try {
          profileImageUrl = await uploadProfileImage(newUser.id, formData.fotoPerfil);
          const { error: updateError } = await supabase
            .from('Users')
            .update({ profile_image: profileImageUrl })
            .eq('id', newUser.id);

          if (updateError) {
            console.warn('Error actualizando imagen de perfil:', updateError);
          }
        } catch (imageError) {
          console.warn('Error subiendo imagen de perfil:', imageError);
        }
      }

      setSuccess('¡Registro exitoso! Te enviamos un correo para verificar tu cuenta.');
      trackSignUp(newUser.id, 'email');
      
      const loginResult = await signIn(formData.email, formData.password);
      
      if (loginResult.error) {
        setSuccess('Registro exitoso. Por favor, inicia sesión manualmente.');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setTimeout(() => {
          navigate('/');
        }, 1500);
      }
      
    } catch (error) {
      console.error('Error en registro:', error);
      setError(`Error al crear la cuenta: ${error.message}`);
      trackError('register_general_error', error.message, '/register');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEO
        title="Crear Cuenta"
        description="Regístrate en Resmoke, el marketplace de confianza para comprar y vender productos. Crea tu cuenta gratis y empieza a vender hoy."
        url="/register"
      />
      <div className="min-h-screen flex flex-col lg:flex-row bg-gray-50">
        <div className="relative h-52 lg:h-auto lg:w-[45%] overflow-hidden">
          <img
            src="/img/resmoke/LoginRegister.png"
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent lg:bg-gradient-to-r lg:from-black/90 lg:via-black/50 lg:to-transparent" />
          <div className="absolute bottom-8 left-8 lg:bottom-14 lg:left-14 z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/20">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" /></svg>
              </div>
              <span className="text-white/70 text-[11px] font-semibold tracking-[0.2em]">RESMOKE</span>
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2 leading-tight">Únete a<br />la comunidad</h1>
            <p className="text-white/50 text-sm lg:text-base max-w-xs leading-relaxed">
              Crea tu cuenta gratis y empieza a vender en minutos.
            </p>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center px-6 py-10 lg:px-14 bg-white">
          <div className="w-full max-w-sm">
            <div className="mb-7">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-1 h-5 bg-gray-900 rounded-full" />
                <span className="text-[11px] font-semibold text-gray-400 tracking-[0.15em]">REGISTRO</span>
              </div>
              <h2 className="text-[22px] font-bold text-gray-900 tracking-tight">Crear cuenta</h2>
              <p className="text-gray-400 text-sm mt-1.5">Completa tus datos para registrarte</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              {error && (
                <div className="text-red-600 text-sm bg-red-50/80 border border-red-100/80 p-3.5 rounded-xl text-center backdrop-blur-sm">
                  {error}
                </div>
              )}

              {success && (
                <div className="text-green-600 text-sm bg-green-50/80 border border-green-100/80 p-3.5 rounded-xl text-center backdrop-blur-sm">
                  {success}
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-gray-500 tracking-wide uppercase">Nombre</label>
                <input type="text" name="nombre" value={formData.nombre} onChange={handleChange}
                  placeholder="Tu nombre"
                  className={`w-full px-4 py-3.5 rounded-xl border text-sm outline-none transition-all bg-white ${
                    errors.nombre ? 'border-red-300' : 'border-gray-200 hover:border-gray-300 focus:border-gray-900 focus:ring-2 focus:ring-gray-900/5'
                  }`} />
                {errors.nombre && <p className="text-red-500 text-xs mt-1">{errors.nombre}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-gray-500 tracking-wide uppercase">Correo electrónico</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange}
                  placeholder="tu@correo.com"
                  className={`w-full px-4 py-3.5 rounded-xl border text-sm outline-none transition-all bg-white ${
                    errors.email ? 'border-red-300' : 'border-gray-200 hover:border-gray-300 focus:border-gray-900 focus:ring-2 focus:ring-gray-900/5'
                  }`} />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-gray-500 tracking-wide uppercase">Fecha de nac.</label>
                  <input type="date" name="fechaNacimiento" value={formData.fechaNacimiento} onChange={handleChange}
                    className={`w-full px-4 py-3.5 rounded-xl border text-sm outline-none transition-all bg-white ${
                      errors.fechaNacimiento ? 'border-red-300' : 'border-gray-200 hover:border-gray-300 focus:border-gray-900 focus:ring-2 focus:ring-gray-900/5'
                    }`} />
                  {errors.fechaNacimiento && <p className="text-red-500 text-xs mt-1">{errors.fechaNacimiento}</p>}
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-gray-500 tracking-wide uppercase">Teléfono</label>
                  <input type="tel" name="telefono" value={formData.telefono} onChange={handleChange}
                    placeholder="+34 600 00 00 00"
                    className={`w-full px-4 py-3.5 rounded-xl border text-sm outline-none transition-all bg-white ${
                      errors.telefono ? 'border-red-300' : 'border-gray-200 hover:border-gray-300 focus:border-gray-900 focus:ring-2 focus:ring-gray-900/5'
                    }`} />
                  {errors.telefono && <p className="text-red-500 text-xs mt-1">{errors.telefono}</p>}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-gray-500 tracking-wide uppercase">Contraseña</label>
                <div className="relative">
                  <input type={showPassword ? "text" : "password"} name="password" value={formData.password}
                    onChange={handleChange} placeholder="••••••••"
                    className={`w-full px-4 pr-11 py-3.5 rounded-xl border text-sm outline-none transition-all bg-white ${
                      errors.password ? 'border-red-300' : 'border-gray-200 hover:border-gray-300 focus:border-gray-900 focus:ring-2 focus:ring-gray-900/5'
                    }`} />
                  <button type="button" onClick={() => setShowPassword(v => !v)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                    {showPassword ? (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" /></svg>
                    ) : (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    )}
                  </button>
                </div>
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-gray-500 tracking-wide uppercase">Confirmar contraseña</label>
                <div className="relative">
                  <input type={showConfirmPassword ? "text" : "password"} name="confirmPassword" value={formData.confirmPassword}
                    onChange={handleChange} placeholder="••••••••"
                    className={`w-full px-4 pr-11 py-3.5 rounded-xl border text-sm outline-none transition-all bg-white ${
                      errors.confirmPassword ? 'border-red-300' : 'border-gray-200 hover:border-gray-300 focus:border-gray-900 focus:ring-2 focus:ring-gray-900/5'
                    }`} />
                  <button type="button" onClick={() => setShowConfirmPassword(v => !v)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                    {showConfirmPassword ? (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" /></svg>
                    ) : (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    )}
                  </button>
                </div>
                {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-semibold text-gray-500 tracking-wide uppercase">Foto de perfil <span className="text-gray-300 font-normal">(opcional)</span></label>
                <div className="flex items-center gap-4">
                  {previewImage ? (
                    <div className="relative">
                      <img src={previewImage} alt="Preview" className="w-16 h-16 rounded-xl object-cover border border-gray-200" />
                      <button type="button" onClick={removeImage}
                        className="absolute -top-2 -right-2 bg-gray-900 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-gray-700 transition-colors">
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>
                    </div>
                  ) : null}
                  <label className="cursor-pointer flex-1">
                    <input type="file" id="fotoPerfil" accept="image/*" onChange={handleFileChange} className="hidden" />
                    <div className={`border-2 border-dashed rounded-xl py-3 px-4 text-center transition-colors hover:border-gray-400 hover:bg-gray-50/50 ${previewImage ? 'border-gray-200' : 'border-gray-300'}`}>
                      <span className="text-xs text-gray-400">{previewImage ? 'Cambiar foto' : 'Subir foto'}</span>
                    </div>
                  </label>
                </div>
                {errors.fotoPerfil && <p className="text-red-500 text-xs mt-1">{errors.fotoPerfil}</p>}
              </div>

              <button type="submit" disabled={loading}
                className={`w-full py-3.5 rounded-xl text-sm font-semibold tracking-wide transition-all ${
                  loading
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-900 hover:bg-gray-800 text-white shadow-sm hover:shadow-md active:scale-[0.98]'
                }`}>
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                    Registrando...
                  </span>
                ) : 'Crear Cuenta'}
              </button>

              <div className="relative py-2">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100" /></div>
                <div className="relative flex justify-center"><span className="bg-white px-3 text-[11px] text-gray-400 tracking-wide">O REGÍSTRATE CON</span></div>
              </div>

              <GoogleLogin
                onSuccess={handleGoogleRegister}
                onError={() => setError('Error al conectar con Google.')}
                useOneTap={false} theme="outline" size="large" width="100%" text="signup_with" shape="rectangular"
              />

              <p className="text-center text-sm text-gray-400 pt-1">
                ¿Ya tienes cuenta?{' '}
                <Link to="/login" className="font-semibold text-gray-900 hover:underline underline-offset-4 decoration-gray-300">Inicia sesión</Link>
              </p>
            </form>

            <p className="text-[10px] text-gray-300 text-center mt-8 leading-relaxed max-w-[280px] mx-auto">
              Al registrarte aceptas nuestros{' '}
              <Link to="/terminos" className="underline hover:text-gray-400">Términos</Link>
              {' '}y{' '}
              <Link to="/privacidad" className="underline hover:text-gray-400">Política de Privacidad</Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
