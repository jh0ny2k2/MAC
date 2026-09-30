import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useSubscription } from '../../hooks/useSubscription';
import StripeService from '../../services/stripeService';

import Header from '../../components/Layout/HeaderProducts';
import Footer from '../../components/Layout/Footer';
import SupportModal from '../../components/Modals/SupportModal';

const SubscriptionManagementPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isPremium, stats, loading: subscriptionLoading } = useSubscription();
  const [loading, setLoading] = useState(false);
  const [subscriptionDetails, setSubscriptionDetails] = useState(null);
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    if (!subscriptionLoading && !isPremium) {
      navigate('/subscription-plans');
      return;
    }

    if (isPremium) {
      fetchSubscriptionDetails();
    }
  }, [user, isPremium, subscriptionLoading, navigate]);

  const fetchSubscriptionDetails = async () => {
    try {
      setLoading(true);
      const details = await SubscriptionService.getSubscriptionDetails();
      setSubscriptionDetails(details);
    } catch (error) {
      console.error('Error fetching subscription details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleManageSubscription = async () => {
    setLoading(true);
    try {
      if (!user) {
        throw new Error('Usuario no autenticado');
      }
      
      // Por ahora usaremos el email del usuario como customer ID
      // En una implementación real, deberías almacenar el stripe_customer_id en la base de datos
      const customerId = user.email;
      const returnUrl = window.location.origin + '/subscription-management';
      
      const result = await StripeService.createCustomerPortal(customerId, returnUrl);
      
      if (!result.success) {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Error opening customer portal:', error);
      
      // Mostrar mensaje específico según el tipo de error
      let errorMessage = 'Error al abrir el portal de gestión.';
      
      if (error.message.includes('portal del cliente no está configurado')) {
        errorMessage = 'El portal del cliente está en configuración. Por favor, contacta con soporte para gestionar tu suscripción.';
      } else if (error.message.includes('configuración incorrecta')) {
        errorMessage = 'Servicio temporalmente no disponible. Por favor, contacta con soporte.';
      }
      
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (subscriptionLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen mt-13 sm:mt-1 bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Gestión de Suscripción
            </h1>
            <p className="text-xl text-gray-600">
              Administra tu suscripción Premium
            </p>
          </div>

          {/* Premium Status Card */}
          <div className="bg-yellow-500 rounded-2xl p-8 text-black mb-8">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center mb-4">
                  <svg className="w-8 h-8 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732L14.146 12.8l-1.179 4.456a1 1 0 01-1.934 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732L9.854 7.2l1.179-4.456A1 1 0 0112 2z" clipRule="evenodd" />
                  </svg>
                  <h2 className="text-2xl font-bold">Estado Premium Activo</h2>
                </div>
                <p className="text-purple-100 mb-2">
                  Disfruta de todas las funciones premium de nuestra plataforma
                </p>
                {subscriptionDetails && (
                  <p className="text-purple-100">
                    Próxima renovación: {formatDate(subscriptionDetails.current_period_end)}
                  </p>
                )}
              </div>
              <div className="text-right">
                <div className="bg-white/20 rounded-lg p-4">
                  <div className="text-3xl font-bold">€15</div>
                  <div className="text-purple-100">por mes</div>
                </div>
              </div>
            </div>
          </div>

          {/* Statistics */}
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
                <div className="flex items-center">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Productos Vendidos</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalSales || 0}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
                <div className="flex items-center">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Ingresos Totales</p>
                    <p className="text-2xl font-bold text-gray-900">€{stats.totalRevenue || 0}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
                <div className="flex items-center">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Productos Activos</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.activeProducts || 0}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Management Actions */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Gestionar Suscripción</h3>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between p-6 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="text-lg font-semibold text-gray-900">Portal de Cliente</h4>
                  <p className="text-gray-600">
                    Actualiza tu método de pago, descarga facturas y gestiona tu suscripción
                  </p>
                </div>
                <button
                  onClick={handleManageSubscription}
                  disabled={loading}
                  className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Abriendo...' : 'Abrir Portal'}
                </button>
              </div>

              <div className="flex items-center justify-between p-6 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="text-lg font-semibold text-gray-900">Ver Promociones</h4>
                  <p className="text-gray-600">
                    Accede a promociones exclusivas para usuarios Premium
                  </p>
                </div>
                <button
                  onClick={() => navigate('/promotions')}
                  className="bg-pink-600 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-colors"
                >
                  Ver Promociones
                </button>
              </div>

              <div className="flex items-center justify-between p-6 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="text-lg font-semibold text-gray-900">Soporte Premium</h4>
                  <p className="text-gray-600">
                    Contacta con nuestro equipo de soporte prioritario
                  </p>
                </div>
                <button
                  onClick={() => setIsSupportModalOpen(true)}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Contactar Soporte
                </button>
              </div>
            </div>
          </div>

          {/* Benefits Reminder */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 mt-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Beneficios Premium</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start">
                <div className="p-2 bg-green-100 rounded-lg mr-4">
                  <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Promociones Exclusivas</h4>
                  <p className="text-gray-600">Acceso a ofertas especiales y descuentos</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="p-2 bg-green-100 rounded-lg mr-4">
                  <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Soporte Prioritario</h4>
                  <p className="text-gray-600">Atención al cliente con prioridad</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="p-2 bg-green-100 rounded-lg mr-4">
                  <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Badge Premium</h4>
                  <p className="text-gray-600">Distintivo especial en tu perfil</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="p-2 bg-green-100 rounded-lg mr-4">
                  <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Funciones Avanzadas</h4>
                  <p className="text-gray-600">Acceso a herramientas premium</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
      
      {/* Support Modal */}
      <SupportModal 
        isOpen={isSupportModalOpen} 
        onClose={() => setIsSupportModalOpen(false)} 
      />
    </div>
  );
};

export default SubscriptionManagementPage;