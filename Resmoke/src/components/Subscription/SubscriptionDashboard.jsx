import React, { useState } from 'react';
import { useSubscription } from '../../hooks/useSubscription';
import StripeService from '../../services/stripeService';

const SubscriptionDashboard = () => {
  const { 
    isPremium, 
    subscription, 
    stats, 
    loading, 
    getUserPromotions,
    usePromotion 
  } = useSubscription();
  
  const [managingSubscription, setManagingSubscription] = useState(false);
  const [promotions, setPromotions] = useState([]);
  const [loadingPromotions, setLoadingPromotions] = useState(false);

  const handleManageSubscription = async () => {
    if (!subscription?.stripe_customer_id) {
      alert('No se encontró información de suscripción');
      return;
    }

    setManagingSubscription(true);
    
    try {
      const returnUrl = window.location.href;
      await StripeService.createCustomerPortal(subscription.stripe_customer_id, returnUrl);
    } catch (error) {
      console.error('Error al abrir portal de cliente:', error);
      alert('Error al abrir el portal de gestión. Inténtalo de nuevo.');
    } finally {
      setManagingSubscription(false);
    }
  };

  const loadPromotions = async () => {
    setLoadingPromotions(true);
    try {
      const userPromotions = await getUserPromotions();
      setPromotions(userPromotions);
    } catch (error) {
      console.error('Error loading promotions:', error);
    } finally {
      setLoadingPromotions(false);
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

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className={`px-6 py-4 ${isPremium ? 'bg-blue-600' : 'bg-gray-100'}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
              isPremium ? 'bg-white/20' : 'bg-gray-300'
            }`}>
              {isPremium ? (
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732L14.146 12.8l-1.179 4.456a1 1 0 01-1.934 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732L9.854 7.2l1.179-4.456A1 1 0 0112 2z" clipRule="evenodd"></path>
                </svg>
              ) : (
                <svg className="w-6 h-6 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path>
                </svg>
              )}
            </div>
            <div>
              <h3 className={`text-lg font-bold ${isPremium ? 'text-white' : 'text-gray-800'}`}>
                {isPremium ? 'Resmoke Premium' : 'Plan Gratuito'}
              </h3>
              <p className={`text-sm ${isPremium ? 'text-white/80' : 'text-gray-600'}`}>
                {isPremium ? 'Activo' : 'Actualiza para obtener más beneficios'}
              </p>
            </div>
          </div>
          
          {isPremium && (
            <div className="bg-white/20 px-3 py-1 rounded-full">
              <span className="text-white text-sm font-semibold">✨ Premium</span>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {isPremium ? (
          <div className="space-y-6">
            {/* Subscription Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-purple-50 rounded-lg p-4">
                <h4 className="font-semibold text-purple-800 mb-2">Estado de Suscripción</h4>
                <p className="text-purple-700 capitalize">{subscription?.status || 'Activo'}</p>
                {subscription?.current_period_end && (
                  <p className="text-sm text-purple-600 mt-1">
                    Renovación: {formatDate(subscription.current_period_end)}
                  </p>
                )}
              </div>
              
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-semibold text-blue-800 mb-2">Promociones Disponibles</h4>
                <div className="flex items-center">
                  <span className="text-2xl font-bold text-blue-700">
                    {stats?.availablePromotions || 0}
                  </span>
                  <span className="text-blue-600 ml-2">/ {stats?.totalPromotions || 10}</span>
                </div>
                <p className="text-sm text-blue-600 mt-1">
                  Usadas: {stats?.usedPromotions || 0}
                </p>
              </div>
            </div>

            {/* Promotion Stats */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-800 mb-3">Estadísticas del Mes</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-xl font-bold text-green-600">{stats?.availablePromotions || 0}</div>
                  <div className="text-xs text-gray-600">Disponibles</div>
                </div>
                <div>
                  <div className="text-xl font-bold text-blue-600">{stats?.usedPromotions || 0}</div>
                  <div className="text-xs text-gray-600">Usadas</div>
                </div>
                <div>
                  <div className="text-xl font-bold text-purple-600">{stats?.activePromotions || 0}</div>
                  <div className="text-xs text-gray-600">Activas</div>
                </div>
                <div>
                  <div className="text-xl font-bold text-orange-600">
                    {stats?.resetDate ? formatDate(stats.resetDate) : 'N/A'}
                  </div>
                  <div className="text-xs text-gray-600">Reset</div>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Uso de Promociones</span>
                <span className="text-sm text-gray-600">
                  {stats?.usedPromotions || 0} / {stats?.totalPromotions || 10}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ 
                    width: `${((stats?.usedPromotions || 0) / (stats?.totalPromotions || 10)) * 100}%` 
                  }}
                ></div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleManageSubscription}
                disabled={managingSubscription}
                className="flex-1 bg-purple-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-purple-700 transition-colors disabled:opacity-50"
              >
                {managingSubscription ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Cargando...
                  </div>
                ) : (
                  'Gestionar Suscripción'
                )}
              </button>
              
              <button
                onClick={loadPromotions}
                disabled={loadingPromotions}
                className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {loadingPromotions ? 'Cargando...' : 'Ver Promociones'}
              </button>
            </div>
          </div>
        ) : (
          /* Free Plan */
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732L14.146 12.8l-1.179 4.456a1 1 0 01-1.934 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732L9.854 7.2l1.179-4.456A1 1 0 0112 2z" clipRule="evenodd"></path>
              </svg>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">
              Actualiza a Premium
            </h4>
            
            <p className="text-gray-600 mb-6">
              Obtén 10 promociones gratuitas al mes y una experiencia sin anuncios
            </p>
            
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4 mb-6">
              <h5 className="font-semibold text-gray-800 mb-3">Beneficios Premium:</h5>
              <ul className="text-left space-y-2 text-sm text-gray-700">
                <li className="flex items-center">
                  <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                  </svg>
                  10 promociones gratuitas al mes
                </li>
                <li className="flex items-center">
                  <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                  </svg>
                  Experiencia sin anuncios
                </li>
                <li className="flex items-center">
                  <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                  </svg>
                  Soporte prioritario
                </li>
              </ul>
            </div>
            
            <a
              href="/subscription"
              className="inline-block bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-200"
            >
              Actualizar a Premium - €15/mes
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubscriptionDashboard;