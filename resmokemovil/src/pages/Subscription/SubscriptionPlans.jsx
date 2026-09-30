import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useSubscription } from '../../hooks/useSubscription';
import StripeService from '../../services/stripeService';
import Header from '../../components/Layout/HeaderProducts';
import Footer from '../../components/Layout/Footer';
import { Crown, Check, X, Star, Zap, Shield } from 'lucide-react';

const SubscriptionPlans = () => {
  const { user } = useAuth();
  const { isPremium, subscription, loading } = useSubscription();
  const [processingPayment, setProcessingPayment] = useState(false);

  const plans = [
    {
      id: 'free',
      name: 'Gratuito',
      price: 0,
      period: 'Siempre',
      description: 'Perfecto para empezar a vender',
      features: [
        'Publicar productos ilimitados',
        'Chat con compradores',
        'Perfil básico',
        'Búsqueda de productos'
      ],
      limitations: [
        'Con anuncios publicitarios',
        'Sin promociones gratuitas',
        'Soporte básico'
      ],
      buttonText: 'Plan Actual',
      buttonStyle: 'bg-gray-500 text-white cursor-not-allowed',
      popular: false
    },
    {
      id: 'premium',
      name: 'Premium',
      price: 15,
      period: 'mes',
      description: 'Para vendedores serios que quieren destacar',
      features: [
        'Todo lo del plan gratuito',
        '10 promociones gratuitas al mes',
        'Sin anuncios publicitarios',
        'Perfil verificado con badge premium',
        'Soporte prioritario',
        'Estadísticas avanzadas',
        'Destacar productos en búsquedas',
        'Notificaciones push prioritarias'
      ],
      limitations: [],
      buttonText: 'Suscribirse Ahora',
      buttonStyle: 'bg-blue-600 text-white',
      popular: true
    }
  ];

  const handleSubscribe = async (planType) => {
    if (!user) {
      alert('Debes iniciar sesión para suscribirte');
      return;
    }

    setProcessingPayment(true);
    
    try {
      const successUrl = `${window.location.origin}/subscription/success`;
      const cancelUrl = `${window.location.origin}/subscription/cancel`;
      
      const result = await StripeService.createSubscriptionCheckout(
        user.originalId,
        StripeService.PRICE_IDS.PREMIUM_MONTHLY,
        successUrl,
        cancelUrl
      );

      if (!result.success) {
        throw new Error(result.error);
      }
      
      // El usuario será redirigido a Stripe Checkout
    } catch (error) {
      console.error('Error en la suscripción:', error);
      alert('Error al procesar el pago. Inténtalo de nuevo.');
      setProcessingPayment(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Planes de Suscripción
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Elige el plan perfecto para tu negocio. Vende más, gana más y destaca entre la competencia.
          </p>
        </div>

        {/* Plans Grid */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative bg-white rounded-2xl shadow-lg border-2 transition-all duration-300 hover:shadow-xl ${
                plan.popular 
                  ? 'border-purple-500 transform scale-105' 
                  : 'border-gray-200 hover:border-purple-300'
              }`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/4">
                  <div className="bg-purple-600 text-white px-6 py-2 rounded-full text-sm font-semibold flex items-center gap-2">
                    <Crown className="w-4 h-4" />
                    Más Popular
                  </div>
                </div>
              )}

              <div className="p-8">
                {/* Plan Header */}
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {plan.name}
                  </h3>
                  <p className="text-gray-600 mb-4">{plan.description}</p>
                  
                  <div className="flex items-baseline justify-center gap-2">
                    <span className="text-5xl font-bold text-gray-900">
                      €{plan.price}
                    </span>
                    {plan.price > 0 && (
                      <span className="text-gray-600">/{plan.period}</span>
                    )}
                  </div>
                  
                  {plan.price === 0 && (
                    <span className="text-gray-600">{plan.period}</span>
                  )}
                </div>

                {/* Features */}
                <div className="space-y-4 mb-8">
                  <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                    <Check className="w-5 h-5 text-green-500" />
                    Incluye:
                  </h4>
                  
                  <ul className="space-y-3">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {plan.limitations.length > 0 && (
                    <>
                      <h4 className="font-semibold text-gray-900 flex items-center gap-2 mt-6">
                        <X className="w-5 h-5 text-red-500" />
                        Limitaciones:
                      </h4>
                      
                      <ul className="space-y-3">
                        {plan.limitations.map((limitation, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <X className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700">{limitation}</span>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>

                {/* CTA Button */}
                <button
                  onClick={() => handleSubscribe(plan.id)}
                  disabled={processingPayment || (plan.id === 'free') || (isPremium && plan.id === 'premium')}
                  className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 ${
                    plan.id === 'premium' && !isPremium
                      ? 'bg-purple-600 text-white hover:bg-purple-700'
                      : isPremium && plan.id === 'premium'
                      ? 'bg-green-500 text-white cursor-default'
                      : 'bg-gray-500 text-white cursor-not-allowed'
                  }`}
                >
                  {processingPayment ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Procesando...
                    </div>
                  ) : isPremium && plan.id === 'premium' ? (
                    'Plan Actual'
                  ) : (
                    plan.buttonText
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Benefits Section */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            ¿Por qué elegir Premium?
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Promociones Gratuitas
              </h3>
              <p className="text-gray-600">
                10 promociones al mes para destacar tus productos y vender más rápido.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Sin Anuncios
              </h3>
              <p className="text-gray-600">
                Experiencia limpia y profesional sin distracciones publicitarias.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Perfil Verificado
              </h3>
              <p className="text-gray-600">
                Badge premium que genera más confianza en los compradores.
              </p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Preguntas Frecuentes
          </h2>
          
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-2">
                ¿Puedo cancelar mi suscripción en cualquier momento?
              </h3>
              <p className="text-gray-600">
                Sí, puedes cancelar tu suscripción en cualquier momento desde tu perfil. 
                Seguirás teniendo acceso a las funciones premium hasta el final del período pagado.
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-2">
                ¿Qué son las promociones gratuitas?
              </h3>
              <p className="text-gray-600">
                Las promociones destacan tus productos en los resultados de búsqueda y 
                en la página principal, aumentando significativamente su visibilidad y 
                posibilidades de venta.
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-2">
                ¿El pago es seguro?
              </h3>
              <p className="text-gray-600">
                Sí, utilizamos Stripe para procesar los pagos, una plataforma líder 
                en seguridad de pagos online utilizada por millones de empresas.
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default SubscriptionPlans;