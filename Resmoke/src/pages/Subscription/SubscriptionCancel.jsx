import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Layout/HeaderProducts';
import Footer from '../../components/Layout/Footer';

const SubscriptionCancel = () => {
  const navigate = useNavigate();

  const handleRetryPayment = () => {
    navigate('/subscription');
  };

  const handleGoToHome = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8 text-center">
          {/* Icono de cancelación */}
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </div>
          
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Pago Cancelado
          </h1>
          
          <p className="text-gray-600 mb-6">
            No se ha procesado ningún cargo. Tu suscripción no se ha activado.
          </p>
          
          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <p className="text-blue-800 text-sm">
              💡 <strong>¿Sabías que con Resmoke Premium puedes:</strong>
            </p>
            <ul className="text-left text-blue-700 text-sm mt-2 space-y-1">
              <li>• Promocionar 10 productos gratis al mes</li>
              <li>• Navegar sin anuncios</li>
              <li>• Recibir soporte prioritario</li>
            </ul>
          </div>
          
          <div className="space-y-3">
            <button
              onClick={handleRetryPayment}
              className="w-full bg-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
            >
              Intentar de Nuevo
            </button>
            
            <button
              onClick={handleGoToHome}
              className="w-full bg-gray-200 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
            >
              Volver al Inicio
            </button>
          </div>
          
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              ¿Tienes problemas con el pago? 
              <a href="mailto:soporte@resmoke.com" className="text-purple-600 hover:underline ml-1">
                Contáctanos
              </a>
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SubscriptionCancel;