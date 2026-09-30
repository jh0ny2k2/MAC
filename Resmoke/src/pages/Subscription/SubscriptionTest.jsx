import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useSubscription } from '../../hooks/useSubscription';
import { SubscriptionService } from '../../services/subscriptionService';
import Header from '../../components/Layout/HeaderProducts';
import Footer from '../../components/Layout/Footer';

const SubscriptionTest = () => {
  const { user } = useAuth();
  const { isPremium, subscription, loading, stats } = useSubscription();
  const [manualCheck, setManualCheck] = useState(null);
  const [manualLoading, setManualLoading] = useState(false);
  const [subscriptionData, setSubscriptionData] = useState(null);

  const handleManualCheck = async () => {
    if (!user?.originalId) return;
    
    setManualLoading(true);
    try {
      const [premiumStatus, subscriptionInfo, subscriptionStats] = await Promise.all([
        SubscriptionService.isUserPremium(user.originalId),
        SubscriptionService.getUserSubscription(user.originalId),
        SubscriptionService.getSubscriptionStats(user.originalId)
      ]);
      
      setManualCheck({
        isPremium: premiumStatus,
        subscription: subscriptionInfo,
        stats: subscriptionStats
      });
      setSubscriptionData(subscriptionInfo);
    } catch (error) {
      console.error('Error en verificación manual:', error);
      setManualCheck({
        isPremium: false,
        subscription: null,
        stats: null,
        error: error.message
      });
    } finally {
      setManualLoading(false);
    }
  };

  const createTestSubscription = async () => {
    if (!user?.originalId) return;
    
    try {
      // Crear una suscripción de prueba directamente en la base de datos
      const testSubscription = {
        user_id: user.originalId,
        stripe_subscription_id: 'test_sub_' + Date.now(),
        stripe_customer_id: 'test_cus_' + Date.now(),
        plan_type: 'premium',
        status: 'active',
        current_period_start: new Date().toISOString(),
        current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 días
        created_at: new Date().toISOString()
      };
      
      const result = await SubscriptionService.createSubscription(testSubscription);
      console.log('Suscripción de prueba creada:', result);
      
      // Refrescar los datos
      await handleManualCheck();
    } catch (error) {
      console.error('Error creando suscripción de prueba:', error);
    }
  };

  const testWebhookSimulation = async () => {
    if (!user?.originalId) return;
    
    try {
      console.log('🧪 Probando webhook simulado...');
      
      const response = await fetch('/.netlify/functions/test-webhook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.originalId,
          subscriptionId: 'webhook_test_' + Date.now()
        })
      });
      
      const result = await response.json();
      console.log('Resultado del webhook simulado:', result);
      
      if (result.success) {
        alert('✅ Webhook simulado ejecutado correctamente! Revisa los logs del servidor.');
        // Refrescar los datos
        await handleManualCheck();
      } else {
        alert('❌ Error en webhook simulado: ' + result.error);
      }
    } catch (error) {
      console.error('Error probando webhook simulado:', error);
      alert('❌ Error probando webhook simulado: ' + error.message);
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            🧪 Prueba de Estado Premium
          </h1>

          {/* Estado del Usuario */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Estado del Usuario</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p><strong>Usuario autenticado:</strong> {user ? '✅ Sí' : '❌ No'}</p>
                <p><strong>ID del usuario:</strong> {user?.originalId || 'No disponible'}</p>
                <p><strong>Email:</strong> {user?.email || 'No disponible'}</p>
              </div>
              <div>
                <p><strong>Loading:</strong> {loading ? '⏳ Cargando...' : '✅ Completado'}</p>
                <p><strong>Es Premium (Hook):</strong> {isPremium ? '✅ SÍ' : '❌ NO'}</p>
              </div>
            </div>
          </div>

          {/* Estado de Suscripción desde Hook */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Estado desde useSubscription Hook</h2>
            <div className="bg-gray-50 p-4 rounded-lg">
              <pre className="text-sm overflow-auto">
                {JSON.stringify({
                  isPremium,
                  subscription,
                  stats,
                  loading
                }, null, 2)}
              </pre>
            </div>
          </div>

          {/* Verificación Manual */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Verificación Manual</h2>
            <button
              onClick={handleManualCheck}
              disabled={manualLoading || !user?.originalId}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 mb-4"
            >
              {manualLoading ? 'Verificando...' : 'Verificar Estado Premium'}
            </button>

            {manualCheck && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Resultado de Verificación Manual:</h3>
                <pre className="text-sm overflow-auto">
                  {JSON.stringify(manualCheck, null, 2)}
                </pre>
              </div>
            )}
          </div>

          {/* Crear Suscripción de Prueba */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Crear Suscripción de Prueba</h2>
            <p className="text-gray-600 mb-4">
              Esto creará una suscripción premium de prueba para verificar que el sistema funciona.
            </p>
            <div className="space-y-3">
              <button
                onClick={createTestSubscription}
                disabled={!user?.originalId}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:bg-gray-400 mr-3"
              >
                Crear Suscripción de Prueba
              </button>
              
              <button
                onClick={testWebhookSimulation}
                disabled={!user?.originalId}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 disabled:bg-gray-400"
              >
                🧪 Probar Webhook Simulado
              </button>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              El webhook simulado prueba la misma lógica que usa Stripe para crear suscripciones.
            </p>
          </div>

          {/* Indicadores Visuales */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Indicadores Visuales</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className={`p-4 rounded-lg text-center ${isPremium ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                <h3 className="font-semibold">Estado Premium</h3>
                <p className="text-2xl">{isPremium ? '✅' : '❌'}</p>
                <p>{isPremium ? 'PREMIUM' : 'GRATUITO'}</p>
              </div>
              
              <div className={`p-4 rounded-lg text-center ${subscription ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
                <h3 className="font-semibold">Suscripción</h3>
                <p className="text-2xl">{subscription ? '📋' : '📄'}</p>
                <p>{subscription ? subscription.status?.toUpperCase() : 'SIN SUSCRIPCIÓN'}</p>
              </div>
              
              <div className={`p-4 rounded-lg text-center ${stats?.availablePromotions > 0 ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'}`}>
                <h3 className="font-semibold">Promociones</h3>
                <p className="text-2xl">{stats?.availablePromotions || 0}</p>
                <p>DISPONIBLES</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default SubscriptionTest;