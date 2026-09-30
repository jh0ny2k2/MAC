import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useSubscription } from '../../hooks/useSubscription';
import Header from '../../components/Layout/HeaderProducts';
import Footer from '../../components/Layout/Footer';
import { Crown, ArrowRight, Star, Zap, Shield, Check, X } from 'lucide-react';

const SubscriptionPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isPremium, subscription, loading } = useSubscription();

  // Si no está autenticado, redirigir al login
  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  const handleUpgradeToPremium = () => {
    navigate('/subscription/plans');
  };

  const handleManageSubscription = () => {
    // Aquí podrías redirigir a un portal de gestión de Stripe
    // Por ahora, redirigimos a los planes
    navigate('/subscription/plans');
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 text-white py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="flex justify-center mb-6">
              <Crown className="h-16 w-16 text-yellow-300" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              {isPremium ? '¡Eres Premium!' : 'Únete a Resmoke Premium'}
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-purple-100">
              {isPremium 
                ? 'Disfruta de todos los beneficios de tu suscripción premium'
                : 'Desbloquea todas las funciones y vende sin límites'
              }
            </p>
            
            {isPremium ? (
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 mb-8">
                <h3 className="text-xl font-semibold mb-4">Tu Suscripción Actual</h3>
                <div className="flex items-center justify-center space-x-4">
                  <Star className="h-6 w-6 text-yellow-300" />
                  <span className="text-lg">Plan Premium - €15/mes</span>
                  <Star className="h-6 w-6 text-yellow-300" />
                </div>
                {subscription?.current_period_end && (
                  <p className="text-purple-200 mt-2">
                    Próxima renovación: {new Date(subscription.current_period_end).toLocaleDateString()}
                  </p>
                )}
              </div>
            ) : null}

            <button
              onClick={isPremium ? handleManageSubscription : handleUpgradeToPremium}
              className="bg-white text-purple-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-purple-50 transition-colors duration-200 inline-flex items-center space-x-2"
            >
              <span>{isPremium ? 'Gestionar Suscripción' : 'Ver Planes Premium'}</span>
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-16 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              Beneficios Premium
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow">
                <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">10 Promociones Gratuitas</h3>
                <p className="text-gray-600">
                  Destaca tus productos cada mes con promociones automáticas sin costo adicional.
                </p>
              </div>

              <div className="text-center p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Sin Anuncios</h3>
                <p className="text-gray-600">
                  Navega y vende sin interrupciones publicitarias para una mejor experiencia.
                </p>
              </div>

              <div className="text-center p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow">
                <div className="bg-yellow-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Crown className="h-8 w-8 text-yellow-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Badge Premium</h3>
                <p className="text-gray-600">
                  Muestra tu estatus premium con un badge especial que genera más confianza.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Features Comparison */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              Comparación de Planes
            </h2>
            
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="grid grid-cols-3 gap-0">
                {/* Header */}
                <div className="p-6 bg-gray-50 border-r border-gray-200">
                  <h3 className="font-semibold text-gray-900">Características</h3>
                </div>
                <div className="p-6 bg-gray-50 border-r border-gray-200 text-center">
                  <h3 className="font-semibold text-gray-900">Gratuito</h3>
                </div>
                <div className="p-6 bg-purple-50 text-center">
                  <h3 className="font-semibold text-purple-900">Premium</h3>
                </div>

                {/* Features */}
                {[
                  { feature: 'Publicar productos', free: true, premium: true },
                  { feature: 'Chat con compradores', free: true, premium: true },
                  { feature: 'Promociones mensuales', free: false, premium: '10 gratuitas' },
                  { feature: 'Sin anuncios', free: false, premium: true },
                  { feature: 'Badge premium', free: false, premium: true },
                  { feature: 'Soporte prioritario', free: false, premium: true },
                ].map((item, index) => (
                  <React.Fragment key={index}>
                    <div className="p-4 border-r border-gray-200 border-t">
                      <span className="text-gray-700">{item.feature}</span>
                    </div>
                    <div className="p-4 border-r border-gray-200 border-t text-center">
                      {item.free === true ? (
                        <Check className="h-5 w-5 text-green-500 mx-auto" />
                      ) : item.free === false ? (
                        <X className="h-5 w-5 text-red-500 mx-auto" />
                      ) : (
                        <span className="text-sm text-gray-600">{item.free}</span>
                      )}
                    </div>
                    <div className="p-4 border-t text-center bg-purple-50">
                      {item.premium === true ? (
                        <Check className="h-5 w-5 text-green-500 mx-auto" />
                      ) : item.premium === false ? (
                        <X className="h-5 w-5 text-red-500 mx-auto" />
                      ) : (
                        <span className="text-sm text-purple-700 font-medium">{item.premium}</span>
                      )}
                    </div>
                  </React.Fragment>
                ))}
              </div>
            </div>

            <div className="text-center mt-8">
              <button
                onClick={handleUpgradeToPremium}
                className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold text-lg  hover:bg-blue-700 transition-all duration-200 inline-flex items-center space-x-2"
              >
                <span>{isPremium ? 'Gestionar Suscripción' : 'Comenzar con Premium'}</span>
                <ArrowRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
};

export default SubscriptionPage;