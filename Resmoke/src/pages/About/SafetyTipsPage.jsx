import React from 'react';
import SEO from '../../components/SEO/SEO';

const SafetyTipsPage = () => {
  return (
    <>
      <SEO title="Consejos de Seguridad" description="Consejos de seguridad para comprar y vender en Resmoke. Protege tus transacciones y evita fraudes en nuestro marketplace." url="/consejos-seguridad"/>
      <div className="min-h-screen bg-gray-50">
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6">
              <span className="inline-block px-4 py-1 mb-4 rounded-full bg-blue-50 ring-1 ring-blue-200 text-sm tracking-wide text-blue-700">Seguridad</span>
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900">Consejos de Seguridad</h1>
              <p className="mt-4 text-lg text-gray-600 max-w-xl">Tu seguridad es nuestra prioridad. Aprende cómo comprar y vender de forma segura.</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <a href="#lugares" className="inline-flex items-center px-5 py-3 rounded-xl bg-gray-900 text-white hover:bg-gray-800 transition">Lugares seguros</a>
                <a href="#alertas" className="inline-flex items-center px-5 py-3 rounded-xl ring-1 ring-gray-300 text-gray-900 hover:bg-gray-50 transition">Señales de alerta</a>
              </div>
              <div className="mt-8 grid grid-cols-3 gap-6 text-center">
                <div className="bg-white/70 backdrop-blur rounded-xl ring-1 ring-gray-200 p-4 shadow-sm">
                  <p className="text-2xl font-bold text-gray-900">Seguro</p>
                  <p className="text-xs text-gray-500">comprar</p>
                </div>
                <div className="bg-white/70 backdrop-blur rounded-xl ring-1 ring-gray-200 p-4 shadow-sm">
                  <p className="text-2xl font-bold text-gray-900">Verificado</p>
                  <p className="text-xs text-gray-500">vender</p>
                </div>
                <div className="bg-white/70 backdrop-blur rounded-xl ring-1 ring-gray-200 p-4 shadow-sm">
                  <p className="text-2xl font-bold text-gray-900">Protegido</p>
                  <p className="text-xs text-gray-500">datos</p>
                </div>
              </div>
            </div>
            <div className="lg:col-span-6 relative">
              <div className="aspect-[4/3] rounded-2xl backdrop-blur overflow-hidden">
                <img src="https://cdn-icons-png.flaticon.com/512/1049/1049029.png" alt="Consejos de seguridad" className="w-full h-full object-contain" />
              </div>
              <div className="absolute -bottom-6 -left-6 hidden lg:block w-32 h-32 bg-white/70 rounded-full blur-xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-12 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Compra y Vende con Confianza</h2>
            <p className="text-lg text-gray-600">
              Sigue estos consejos esenciales para tener experiencias seguras y exitosas en Resmoke. 
              La prevención es la mejor protección.
            </p>
          </div>
        </div>
      </section>

      {/* Safety Tips Sections */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Para Compradores */}
          <div className="bg-white rounded-lg p-8 mb-8 shadow-sm border border-gray-200">
            <div className="flex items-center mb-6">
              <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Consejos para Compradores</h3>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  Antes de Comprar
                </h4>
                <ul className="space-y-2 text-gray-700 text-sm">
                  <li>• Revisa el perfil y reputación del vendedor</li>
                  <li>• Lee todas las reseñas y comentarios</li>
                  <li>• Examina las fotos del producto detalladamente</li>
                  <li>• Haz preguntas específicas sobre el estado del producto</li>
                  <li>• Verifica que el precio sea razonable</li>
                </ul>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  Durante la Transacción
                </h4>
                <ul className="space-y-2 text-gray-700 text-sm">
                  <li>• Usa solo los métodos de pago de Resmoke</li>
                  <li>• Nunca hagas transferencias directas</li>
                  <li>• Inspecciona el producto antes de pagar</li>
                  <li>• Reúnete en lugares públicos y seguros</li>
                  <li>• Lleva a un acompañante si es posible</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Para Vendedores */}
          <div className="bg-white rounded-lg p-8 mb-8 shadow-sm border border-gray-200">
            <div className="flex items-center mb-6">
              <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Consejos para Vendedores</h3>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                  Crear Anuncios Seguros
                </h4>
                <ul className="space-y-2 text-gray-700 text-sm">
                  <li>• Usa fotos reales y de buena calidad</li>
                  <li>• Describe honestamente el estado del producto</li>
                  <li>• No incluyas información personal en las fotos</li>
                  <li>• Establece precios justos y competitivos</li>
                  <li>• Especifica claramente las condiciones de venta</li>
                </ul>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                  Durante la Venta
                </h4>
                <ul className="space-y-2 text-gray-700 text-sm">
                  <li>• Verifica la identidad del comprador</li>
                  <li>• Confirma el pago antes de entregar</li>
                  <li>• Reúnete en lugares públicos y concurridos</li>
                  <li>• Mantén registro de todas las comunicaciones</li>
                  <li>• No aceptes pagos en efectivo para productos caros</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Lugares Seguros */}
          <div className="bg-white rounded-lg p-8 mb-8 shadow-sm border border-gray-200">
            <div className="flex items-center mb-6">
              <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Lugares Seguros para Intercambios</h3>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="text-lg font-semibold text-green-600 mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Lugares Recomendados
                </h4>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Centros comerciales concurridos
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Estaciones de policía
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Cafeterías y restaurantes populares
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Bibliotecas públicas
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Bancos con cámaras de seguridad
                  </li>
                </ul>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold text-red-600 mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Lugares a Evitar
                </h4>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Domicilios privados
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Lugares aislados o poco iluminados
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Estacionamientos vacíos
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Parques durante la noche
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Calles poco transitadas
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Señales de Alerta */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-8 mb-8">
            <div className="flex items-center mb-6">
              <div className="bg-red-100 w-12 h-12 rounded-full flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Señales de Alerta - ¡Ten Cuidado!</h3>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-lg font-semibold text-red-800 mb-3">Comportamientos Sospechosos</h4>
                <ul className="space-y-2 text-red-700 text-sm">
                  <li>• Presión para completar la transacción rápidamente</li>
                  <li>• Solicitudes de pago por adelantado</li>
                  <li>• Negativa a reunirse en persona</li>
                  <li>• Precios demasiado buenos para ser verdad</li>
                  <li>• Comunicación solo por email o SMS</li>
                  <li>• Historias inconsistentes sobre el producto</li>
                </ul>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold text-red-800 mb-3">Métodos de Pago Riesgosos</h4>
                <ul className="space-y-2 text-red-700 text-sm">
                  <li>• Transferencias bancarias inmediatas</li>
                  <li>• Pagos con cheques personales</li>
                  <li>• Solicitudes de información bancaria</li>
                  <li>• Pagos a través de servicios no verificados</li>
                  <li>• Efectivo para productos de alto valor</li>
                  <li>• Criptomonedas para transacciones locales</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Protección de Datos */}
          <div className="bg-white rounded-lg p-8 mb-8 shadow-sm border border-gray-200">
            <div className="flex items-center mb-6">
              <div className="bg-orange-100 w-12 h-12 rounded-full flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Protección de Datos Personales</h3>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
                  Información a Proteger
                </h4>
                <ul className="space-y-2 text-gray-700 text-sm">
                  <li>• Número de documento de identidad completo</li>
                  <li>• Dirección exacta de tu domicilio</li>
                  <li>• Números de tarjetas de crédito/débito</li>
                  <li>• Contraseñas y códigos de seguridad</li>
                  <li>• Información laboral detallada</li>
                </ul>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
                  Buenas Prácticas
                </h4>
                <ul className="space-y-2 text-gray-700 text-sm">
                  <li>• Usa solo tu nombre de usuario en Resmoke</li>
                  <li>• Comparte solo información necesaria</li>
                  <li>• Verifica la identidad antes de dar detalles</li>
                  <li>• Usa contraseñas únicas y seguras</li>
                  <li>• Activa la autenticación de dos factores</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Emergency Contact */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            ¿Necesitas Ayuda Inmediata?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Si te encuentras en una situación de riesgo o has sido víctima de fraude, 
            contacta inmediatamente a las autoridades y a nuestro equipo de seguridad.
          </p>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Emergencia</h3>
              <p className="text-gray-600">112</p>
              <p className="text-sm text-gray-500 mt-1">Policía, Bomberos, Ambulancia</p>
            </div>
            
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Reportar Fraude</h3>
              <p className="text-gray-600">seguridad@resmoke.com</p>
              <button className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
                Reportar Ahora
              </button>
            </div>
            
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Soporte 24/7</h3>
              <p className="text-gray-600">+34 900 123 456</p>
              <p className="text-sm text-gray-500 mt-1">Disponible siempre</p>
            </div>
          </div>
        </div>
      </section>
    </div>
    </>
  );
};

export default SafetyTipsPage;