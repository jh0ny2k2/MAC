import React, { useState, useEffect } from 'react';
import { X, AlertTriangle, Mail } from 'lucide-react';
import ContactSupportModal from './ContactSupportModal';

const PremiumActivationNotice = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  useEffect(() => {
    // Verificar si el popup ya se mostró en esta sesión
    const hasSeenNotice = sessionStorage.getItem('premiumActivationNoticeShown');
    
    if (!hasSeenNotice) {
      // Mostrar el popup después de 2 segundos
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    // Marcar como visto en esta sesión
    sessionStorage.setItem('premiumActivationNoticeShown', 'true');
  };

  const handleContactSupport = () => {
    setIsContactModalOpen(true);
  };

  const handleCloseContactModal = () => {
    setIsContactModalOpen(false);
    handleClose(); // También cerrar el popup principal
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 relative animate-fade-in">
        {/* Botón de cerrar */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={24} />
        </button>

        {/* Contenido del popup */}
        <div className="p-6">
          {/* Icono de advertencia */}
          <div className="flex items-center justify-center w-16 h-16 bg-yellow-100 rounded-full mx-auto mb-4">
            <AlertTriangle className="text-yellow-600" size={32} />
          </div>

          {/* Título */}
          <h2 className="text-xl font-bold text-gray-800 text-center mb-3">
            Problemas con Activación Premium
          </h2>

          {/* Mensaje */}
          <p className="text-gray-600 text-center mb-6 leading-relaxed">
            Estamos experimentando algunos problemas técnicos con la activación automática de cuentas Premium. 
            Si te has suscrito y no ves tu cuenta activada, no te preocupes.
          </p>

          {/* Información adicional */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-blue-800 text-sm">
              <strong>¿Qué hacer?</strong><br />
              Contacta con nuestro soporte y resolveremos tu caso de inmediato. 
              Tendrás acceso completo a todas las funciones Premium.
            </p>
          </div>

          {/* Botones */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleContactSupport}
              className="flex-1 bg-blue-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
            >
              <Mail size={18} />
              Contactar Soporte
            </button>
            <button
              onClick={handleClose}
              className="flex-1 bg-gray-200 text-gray-700 px-4 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
            >
              Entendido
            </button>
          </div>
        </div>
      </div>

      {/* Modal de contacto */}
      <ContactSupportModal 
        isOpen={isContactModalOpen} 
        onClose={handleCloseContactModal} 
      />

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default PremiumActivationNotice;