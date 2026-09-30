import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import SEO from '../../components/SEO/SEO';

const ResetPasswordPage = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [validToken, setValidToken] = useState(null);
  const [tokenData, setTokenData] = useState(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    validateToken();
  }, []);

  const validateToken = async () => {
    const token = searchParams.get('token');
    const email = searchParams.get('email');

    if (!token || !email) {
      setError('Enlace de recuperación inválido');
      setValidToken(false);
      return;
    }

    try {
      // Verificar token en la base de datos
      const { data, error } = await supabase
        .from('password_reset_tokens')
        .select('*')
        .eq('token', token)
        .eq('email', email)
        .eq('used', false)
        .single();

      if (error || !data) {
        // Verificar en localStorage como alternativa - CLAVE CORREGIDA
        const localData = localStorage.getItem(`reset_token_${token}`);
        if (localData) {
          const resetData = JSON.parse(localData);
          
          // PROPIEDADES CORREGIDAS
          if (resetData.email === email && resetData.expiresAt > Date.now()) {
            setValidToken(true);
            setTokenData(resetData);
            return;
          }
        }
        setError('El enlace de recuperación ha expirado o es inválido');
        setValidToken(false);
        return;
      }

      // Verificar si el token no ha expirado
      const expiresAt = new Date(data.expires_at);
      const now = new Date();
      

      
      if (expiresAt < now) {
        setError('El enlace de recuperación ha expirado');
        setValidToken(false);
        return;
      }

      setValidToken(true);
      setTokenData(data);
    } catch (error) {
      console.error('Error validating token:', error);
      setError('Error al validar el enlace de recuperación');
      setValidToken(false);
    }
  };

  const validateForm = () => {
    if (!password) {
      setError('La contraseña es requerida');
      return false;
    }
    
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return false;
    }
    
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return false;
    }
    
    return true;
  };

  const getAuthEndpoint = () => {
    const isLocal = ['localhost', '127.0.0.1'].includes(window.location.hostname);
    return isLocal ? 'http://localhost:3001/api/auth' : '/.netlify/functions/auth';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm() || !validToken) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      const email = searchParams.get('email');
      const token = searchParams.get('token');

      const res = await fetch(`${getAuthEndpoint()}/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, email, newPassword: password })
      });
      const data = await res.json();

      if (!data.success) {
        setError(data.error || 'Error al actualizar la contraseña');
        return;
      }

      if (tokenData && !tokenData.id) {
        localStorage.removeItem(`reset_token_${token}`);
      }

      alert('Contraseña actualizada exitosamente');
      navigate('/login');

    } catch (error) {
      console.error('Error:', error);
      setError('Error inesperado. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  // Mostrar loading mientras se valida el token
  if (validToken === null) {
    return (
      <div className="flex h-screen">
        <div className="w-1/2">
          <img
            src="/img/resmoke/LoginRegister.png"
            alt="hookah"
            className="h-full w-full object-cover"
          />
        </div>
        <div className="w-1/2 flex items-center justify-center">
          <div className="w-full max-w-md px-6 text-center space-y-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto animate-spin">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Validando enlace...</h2>
            <p className="text-gray-600">Por favor espera mientras verificamos tu enlace de recuperación.</p>
          </div>
        </div>
      </div>
    );
  }

  // Mostrar error si el token es inválido
  if (validToken === false && error) {
    return (
      <div className="flex h-screen">
        <div className="w-1/2">
          <img
            src="/img/resmoke/LoginRegister.png"
            alt="hookah"
            className="h-full w-full object-cover"
          />
        </div>
        <div className="w-1/2 flex items-center justify-center">
          <div className="w-full max-w-md px-6 text-center space-y-6">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Enlace Inválido</h2>
            <p className="text-gray-600">{error}</p>
            <Link 
              to="/forgot-password" 
              className="block w-full py-2 px-4 bg-black text-white rounded hover:bg-gray-800 transition"
            >
              Solicitar Nuevo Enlace
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO
        title="Restablecer Contraseña"
        description="Establece una nueva contraseña para tu cuenta de Resmoke."
        url="/reset-password"
      />
      <div className="flex h-screen">
      <div className="w-1/2">
        <img
          src="/img/resmoke/LoginRegister.png"
          alt="hookah"
          className="h-full w-full object-cover"
        />
      </div>
      <div className="w-1/2 flex items-center justify-center">
        <form onSubmit={handleSubmit} className="w-full max-w-md px-6 space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-gray-900">Restablecer Contraseña</h2>
            <p className="text-gray-600 text-sm">
              Ingresa tu nueva contraseña
            </p>
          </div>

          {error && (
            <div className="text-red-500 text-sm text-center bg-red-50 p-3 rounded">
              {error}
            </div>
          )}

          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError('');
              }}
              placeholder="Nueva Contraseña"
              className="w-full border border-gray-300 px-4 py-3 rounded outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              required
              autoFocus
            />
          </div>

          <div>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                setError('');
              }}
              placeholder="Confirmar Nueva Contraseña"
              className="w-full border border-gray-300 px-4 py-3 rounded outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading || !validToken}
            className={`w-full py-3 rounded transition font-medium ${
              loading || !validToken
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-black hover:bg-gray-800'
            } text-white`}
          >
            {loading ? 'Actualizando...' : 'Actualizar Contraseña'}
          </button>
        </form>
      </div>
    </div>
    </>
  );
};

export default ResetPasswordPage;