import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import emailjs from '@emailjs/browser';
import SEO from '../../components/SEO/SEO';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Configuración de EmailJS
  const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
  const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
  const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;

  const generateResetToken = () => {
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15) + 
           Date.now().toString();
  };

  const sendResetEmail = async (userEmail, resetToken, userName) => {
    try {
      if (!EMAILJS_PUBLIC_KEY || !EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID) return false;
      // Inicializar EmailJS
      emailjs.init(EMAILJS_PUBLIC_KEY);
      
      const resetLink = `${window.location.origin}/reset-password?token=${resetToken}&email=${encodeURIComponent(userEmail)}`;
      
      const templateParams = {
        to_email: userEmail, // Este es el campo más importante
        to_name: userName || 'Usuario',
        reset_link: resetLink,
        from_name: 'Resmoke',
        reply_to: userEmail, // Campo adicional por compatibilidad
        user_email: userEmail // Campo de respaldo
      };

      const result = await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        templateParams
      );

      return true;
    } catch (error) {
      console.error('Error enviando email:', error);
      console.error('Detalles del error:', error.text || error.message);
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      // Validar email
      if (!email || !email.includes('@')) {
        setError('Por favor, ingresa un correo electrónico válido.');
        setLoading(false);
        return;
      }

      // Verificar si el usuario existe en la tabla Users
      const { data: user, error: userError } = await supabase
        .from('Users')
        .select('id, nombre, email')
        .eq('email', email.toLowerCase().trim())
        .single();

      if (userError || !user) {
        setError('No se encontró una cuenta con este correo electrónico.');
        setLoading(false);
        return;
      }

      // Generar token de recuperación
      const resetToken = generateResetToken();
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 3); // Agregar 2 horas de forma más explícita
      


      // Intentar guardar en la tabla password_reset_tokens
      try {
        const { error: tokenError } = await supabase
          .from('password_reset_tokens')
          .insert({
            user_id: user.id,
            email: user.email,
            token: resetToken,
            expires_at: expiresAt.toISOString(),
            used: false,
            created_at: new Date().toISOString()
          });

        if (tokenError) {
          console.warn('Error guardando en DB:', tokenError);
          throw tokenError;
        }
      } catch (dbError) {
        console.warn('No se pudo guardar en la base de datos, usando localStorage:', dbError);
        // Fallback a localStorage
        const resetData = {
          userId: user.id,
          email: user.email,
          token: resetToken,
          expiresAt: expiresAt.getTime(),
          used: false
        };
        localStorage.setItem(`reset_token_${resetToken}`, JSON.stringify(resetData));
      }

      // Enviar email con EmailJS
      const emailSent = await sendResetEmail(user.email, resetToken, user.nombre);
      
      if (emailSent) {
        setMessage('Se ha enviado un enlace de recuperación a tu correo electrónico. Revisa tu bandeja de entrada y la carpeta de spam.');
        setEmail(''); // Limpiar el campo
      } else {
        setError('Error al enviar el correo electrónico. Por favor, verifica tu configuración de EmailJS e inténtalo de nuevo.');
      }

    } catch (error) {
      console.error('Error general:', error);
      setError('Ocurrió un error inesperado. Por favor, inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEO
        title="Recuperar Contraseña"
        description="¿Olvidaste tu contraseña? Recupera el acceso a tu cuenta de Resmoke ingresando tu correo electrónico."
        url="/forgot-password"
      />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Recuperar Contraseña</h1>
            <p className="text-gray-600">Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña</p>
          </div>

          {/* Messages */}
          {message && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <p className="text-green-700 text-sm">{message}</p>
              </div>
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Correo Electrónico
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="tu@email.com"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gray-400 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {loading ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Enviando...
                </div>
              ) : (
                'Enviar Enlace de Recuperación'
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <Link 
              to="/login" 
              className="text-sm text-blue-600 hover:text-blue-500 transition-colors duration-200"
            >
              ← Volver al inicio de sesión
            </Link>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default ForgotPasswordPage;
