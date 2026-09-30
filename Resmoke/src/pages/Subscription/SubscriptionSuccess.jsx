import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useSubscription } from '../../hooks/useSubscription';
import Header from '../../components/Layout/HeaderProducts';
import Footer from '../../components/Layout/Footer';

const SubscriptionSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const { isPremium, subscription, loading } = useSubscription();
  const [verifying, setVerifying] = useState(true);

  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    
    if (!sessionId) {
      navigate('/subscription');
      return;
    }

    // Procesar la suscripción directamente desde el frontend
    const processSubscription = async () => {
      try {
        console.log('🔄 Procesando suscripción con session_id:', sessionId);
        
        const response = await fetch('/.netlify/functions/process-subscription', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            sessionId,
            userId: user?.originalId
          }),
        });

        const result = await response.json();
        
        if (result.success) {
          console.log('✅ Suscripción procesada exitosamente:', result);
        } else {
          console.error('❌ Error procesando suscripción:', result.error);
        }
      } catch (error) {
        console.error('❌ Error en processSubscription:', error);
      } finally {
        // Esperar un poco más para que se actualice el hook useSubscription
        setTimeout(() => {
          setVerifying(false);
        }, 2000);
      }
    };

    if (user?.originalId) {
      processSubscription();
    } else {
      // Si no hay usuario, esperar un poco y verificar de nuevo
      const timer = setTimeout(() => {
        setVerifying(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [searchParams, navigate, user]);

  const handleGoToDashboard = () => {
    navigate('/profile');
  };

  const handleGoToHome = () => {
    navigate('/');
  };

  if (verifying || loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Verificando tu suscripción...
            </h2>
            <p className="text-gray-600">
              Por favor espera mientras confirmamos tu pago.
            </p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8 text-center">
          {isPremium ? (
            <>
              {/* Éxito */}
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              
              <h1 className="text-2xl font-bold text-gray-800 mb-2">
                ¡Bienvenido a Resmoke Premium! 🎉
              </h1>
              
              <p className="text-gray-600 mb-6">
                Tu suscripción se ha activado correctamente. Ahora puedes disfrutar de:
              </p>
              
              <div className="bg-purple-50 rounded-lg p-4 mb-6">
                <ul className="text-left space-y-2">
                  <li className="flex items-center text-purple-700">
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                    </svg>
                    10 promociones gratuitas al mes
                  </li>
                  <li className="flex items-center text-purple-700">
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                    </svg>
                    Experiencia sin anuncios
                  </li>
                  <li className="flex items-center text-purple-700">
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                    </svg>
                    Soporte prioritario
                  </li>
                </ul>
              </div>
              
              <div className="space-y-3">
                <button
                  onClick={handleGoToDashboard}
                  className="w-full bg-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
                >
                  Ir a Mi Perfil
                </button>
                
                <button
                  onClick={handleGoToHome}
                  className="w-full bg-gray-200 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                >
                  Explorar Productos
                </button>
              </div>
            </>
          ) : (
            <>
              {/* Pendiente de verificación */}
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                </svg>
              </div>
              
              <h1 className="text-2xl font-bold text-gray-800 mb-2">
                Pago Procesado
              </h1>
              
              <p className="text-gray-600 mb-6">
                Tu pago se ha procesado correctamente. Tu suscripción se activará en unos minutos.
              </p>
              
              <div className="space-y-3">
                <button
                  onClick={handleGoToHome}
                  className="w-full bg-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
                >
                  Volver al Inicio
                </button>
              </div>
            </>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SubscriptionSuccess;