import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../../contexts/AuthContext'; // Descomentar
import useAnalytics from '../../hooks/useAnalytics';
import SEO from '../../components/SEO/SEO';

const LoginPage = () => {
  return (
    <>
      <SEO
        title="Iniciar Sesión"
        description="Accede a tu cuenta de Resmoke para gestionar tus productos, favoritos y compras. Vende y compra en el marketplace de confianza."
        url="/login"
      />
      <LoginContent />
    </>
  );
};

const LoginContent = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { signIn, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { trackLogin, trackFormSubmit, trackError } = useAnalytics();

  useEffect(() => {
    const savedEmail = localStorage.getItem('rememberedEmail');
    const rememberUser = localStorage.getItem('rememberUser') === 'true';
    if (rememberUser && savedEmail) {
      setFormData(prev => ({ ...prev, email: savedEmail, rememberMe: true }));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      newErrors.email = 'El correo electrónico es requerido';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Ingresa un correo electrónico válido';
    }
    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleGoogleLogin = async (credentialResponse) => {
    setLoading(true);
    try {
      const { data, error } = await signInWithGoogle(credentialResponse);
      if (error) { setErrors({ general: error }); trackError('google_login_failed', error, '/login'); return; }
      trackLogin(data?.id || 'google_user', 'google');
      navigate(location.state?.from || '/');
    } catch (error) {
      setErrors({ general: 'Error al iniciar sesión con Google.' });
      trackError('google_login_error', error.message, '/login');
    } finally { setLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) { trackFormSubmit('login_form', false); return; }
    setLoading(true);
    try {
      const { data, error } = await signIn(formData.email, formData.password);
      if (error) { setErrors({ general: error }); trackFormSubmit('login_form', false); trackError('email_login_failed', error, '/login'); return; }
      trackLogin(data?.id || data?.email, 'email');
      trackFormSubmit('login_form', true);
      if (formData.rememberMe) {
        localStorage.setItem('rememberUser', 'true');
        localStorage.setItem('rememberedEmail', formData.email);
      } else {
        localStorage.removeItem('rememberUser');
        localStorage.removeItem('rememberedEmail');
      }
      navigate(location.state?.from || '/');
    } catch (error) {
      setErrors({ general: 'Error inesperado. Inténtalo de nuevo.' });
      trackFormSubmit('login_form', false);
      trackError('email_login_error', error.message, '/login');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-gray-50">
      <div className="relative h-52 lg:h-auto lg:w-[45%] overflow-hidden">
        <img
          src="/img/resmoke/LoginRegister.png"
          alt=""
          className="absolute inset-0 w-full h-full object-cover scale-105 transition-transform duration-[2s] ease-out group-hover:scale-100"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent lg:bg-gradient-to-r lg:from-black/90 lg:via-black/50 lg:to-transparent" />
        <div className="absolute bottom-8 left-8 lg:bottom-14 lg:left-14 z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/20">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" /></svg>
            </div>
            <span className="text-white/70 text-[11px] font-semibold tracking-[0.2em]">RESMOKE</span>
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2 leading-tight">Vende y compra<br />con confianza</h1>
          <p className="text-white/50 text-sm lg:text-base max-w-xs leading-relaxed">
            El marketplace donde compradores y vendedores se conectan de forma segura.
          </p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-6 py-10 lg:px-14 bg-white">
        <div className="w-full max-w-sm">
          <div className="mb-9">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-1 h-5 bg-gray-900 rounded-full" />
              <span className="text-[11px] font-semibold text-gray-400 tracking-[0.15em]">ACCESO</span>
            </div>
            <h2 className="text-[22px] font-bold text-gray-900 tracking-tight">Bienvenido</h2>
            <p className="text-gray-400 text-sm mt-1.5">Inicia sesión para continuar</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {errors.general && (
              <div className="text-red-600 text-sm bg-red-50/80 border border-red-100/80 p-3.5 rounded-xl text-center backdrop-blur-sm">
                {errors.general}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-gray-500 tracking-wide uppercase">Correo electrónico</label>
              <input
                type="email" name="email" value={formData.email} onChange={handleChange}
                placeholder="tu@correo.com"
                className={`w-full px-4 py-3.5 rounded-xl border text-sm outline-none transition-all bg-white ${
                  errors.email
                    ? 'border-red-300'
                    : 'border-gray-200 hover:border-gray-300 focus:border-gray-900 focus:ring-2 focus:ring-gray-900/5'
                }`}
                required autoFocus autoComplete="username"
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-gray-500 tracking-wide uppercase">Contraseña</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"} name="password" value={formData.password}
                  onChange={handleChange} placeholder="••••••••"
                  className={`w-full px-4 pr-11 py-3.5 rounded-xl border text-sm outline-none transition-all bg-white ${
                    errors.password
                      ? 'border-red-300'
                      : 'border-gray-200 hover:border-gray-300 focus:border-gray-900 focus:ring-2 focus:ring-gray-900/5'
                  }`}
                  required autoComplete="current-password"
                />
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

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2.5 cursor-pointer text-sm text-gray-500 hover:text-gray-700 transition-colors">
                <input type="checkbox" name="rememberMe" checked={formData.rememberMe} onChange={handleChange}
                  className="w-4 h-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900" />
                Recordarme
              </label>
              <Link to="/forgot-password" className="text-sm text-gray-900 font-medium hover:underline underline-offset-4 decoration-gray-300">
                ¿Olvidaste tu contraseña?
              </Link>
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
                  Iniciando sesión...
                </span>
              ) : 'Iniciar Sesión'}
            </button>

            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100" /></div>
              <div className="relative flex justify-center"><span className="bg-white px-3 text-[11px] text-gray-400 tracking-wide">O CONTINÚA CON</span></div>
            </div>

            <GoogleLogin
              onSuccess={handleGoogleLogin}
              onError={() => setErrors({ general: 'Error al conectar con Google.' })}
              useOneTap={false} theme="outline" size="large" width="100%" text="signin_with" shape="rectangular"
            />

            <p className="text-center text-sm text-gray-400 pt-2">
              ¿No tienes cuenta?{' '}
              <Link to="/register" className="font-semibold text-gray-900 hover:underline underline-offset-4 decoration-gray-300">
                Regístrate
              </Link>
            </p>
          </form>

          <p className="text-[10px] text-gray-300 text-center mt-8 leading-relaxed max-w-[280px] mx-auto">
            Al iniciar sesión aceptas nuestros{' '}
            <Link to="/terminos" className="underline hover:text-gray-400">Términos</Link>
            {' '}y{' '}
            <Link to="/privacidad" className="underline hover:text-gray-400">Política de Privacidad</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
