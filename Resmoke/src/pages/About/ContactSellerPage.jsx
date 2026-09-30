import React from 'react';
import SEO from '../../components/SEO/SEO';

const ContactSellerPage = () => {
  return (
    <>
      <SEO title="Contactar al Vendedor" description="Aprende las mejores formas de comunicarte con los vendedores en Resmoke." url="/contactar-vendedor"/>
      <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6">
              <span className="inline-block px-4 py-1 mb-4 rounded-full bg-purple-50 ring-1 ring-purple-200 text-sm tracking-wide text-purple-700">Contacto</span>
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900">¿Cómo contactar al vendedor?</h1>
              <p className="mt-4 text-lg text-gray-600 max-w-xl">Aprende las mejores formas de comunicarte con los vendedores en Resmoke.</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <a href="#formas" className="inline-flex items-center px-5 py-3 rounded-xl bg-gray-900 text-white hover:bg-gray-800 transition">Ver formas de contacto</a>
                <a href="#consejos" className="inline-flex items-center px-5 py-3 rounded-xl ring-1 ring-gray-300 text-gray-900 hover:bg-gray-50 transition">Consejos útiles</a>
              </div>
              <div className="mt-8 grid grid-cols-3 gap-6 text-center">
                <div className="bg-white/70 backdrop-blur rounded-xl ring-1 ring-gray-200 p-4 shadow-sm">
                  <p className="text-2xl font-bold text-gray-900">Seguro</p>
                  <p className="text-xs text-gray-500">mensajes</p>
                </div>
                <div className="bg-white/70 backdrop-blur rounded-xl ring-1 ring-gray-200 p-4 shadow-sm">
                  <p className="text-2xl font-bold text-gray-900">Historial</p>
                  <p className="text-xs text-gray-500">conversación</p>
                </div>
                <div className="bg-white/70 backdrop-blur rounded-xl ring-1 ring-gray-200 p-4 shadow-sm">
                  <p className="text-2xl font-bold text-gray-900">Notifica</p>
                  <p className="text-xs text-gray-500">tiempo real</p>
                </div>
              </div>
            </div>
            <div className="lg:col-span-6 relative">
              <div className="aspect-[4/3] rounded-2xl backdrop-blur overflow-hidden">
                <img src="https://cdn-icons-png.flaticon.com/512/1086/1086581.png" alt="Contactar vendedor" className="w-full h-full object-contain" />
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
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Comunicación Efectiva</h2>
            <p className="text-lg text-gray-600">
              Una buena comunicación es clave para una transacción exitosa. Te mostramos cómo contactar 
              y qué preguntar a los vendedores para obtener la mejor experiencia.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Methods */}
      <section id="formas" className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Formas de Contacto</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Chat Interno */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <div className="flex items-center mb-4">
                <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900">Chat Interno</h3>
              </div>
              <p className="text-gray-600 mb-4">El método principal y más seguro para comunicarte con vendedores.</p>
              
              <div className="space-y-3 mb-4">
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                  <span className="text-sm text-gray-700">Mensajes protegidos y monitoreados</span>
                </div>
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                  <span className="text-sm text-gray-700">Historial completo de conversaciones</span>
                </div>
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                  <span className="text-sm text-gray-700">Notificaciones en tiempo real</span>
                </div>
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                  <span className="text-sm text-gray-700">Soporte puede intervenir si es necesario</span>
                </div>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">Cómo acceder:</h4>
                <p className="text-sm text-blue-700">Haz clic en "Contactar vendedor" en cualquier producto o ve a tu sección de mensajes.</p>
              </div>
            </div>

            {/* Llamada Telefónica */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <div className="flex items-center mb-4">
                <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900">Llamada Telefónica</h3>
              </div>
              <p className="text-gray-600 mb-4">Para conversaciones más directas, especialmente antes de encuentros.</p>
              
              <div className="space-y-3 mb-4">
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                  <span className="text-sm text-gray-700">Comunicación inmediata</span>
                </div>
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                  <span className="text-sm text-gray-700">Ideal para coordinar encuentros</span>
                </div>
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></span>
                  <span className="text-sm text-gray-700">Solo después del primer contacto por chat</span>
                </div>
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></span>
                  <span className="text-sm text-gray-700">Vendedor debe compartir número voluntariamente</span>
                </div>
              </div>
              
              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <h4 className="font-semibold text-yellow-800 mb-2">⚠️ Importante:</h4>
                <p className="text-sm text-yellow-700">Nunca compartas tu número hasta estar seguro del vendedor. Usa siempre el chat primero.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How to Contact */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Cómo Iniciar el Contacto</h2>
          
          <div className="space-y-8">
            {/* Step 1 */}
            <div className="flex items-start">
              <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mr-6 flex-shrink-0">
                <span className="text-purple-600 font-bold text-lg">1</span>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-3">Encuentra el producto que te interesa</h3>
                <p className="text-gray-600 mb-4">
                  Navega por los productos y encuentra uno que te llame la atención. Lee la descripción completa antes de contactar.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex items-start">
              <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mr-6 flex-shrink-0">
                <span className="text-purple-600 font-bold text-lg">2</span>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-3">Haz clic en "Contactar vendedor"</h3>
                <p className="text-gray-600 mb-4">
                  Encontrarás este botón en la página del producto. Te llevará directamente al chat con el vendedor.
                </p>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">💡 <strong>Tip:</strong> Si no ves el botón, asegúrate de estar registrado e iniciado sesión.</p>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex items-start">
              <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mr-6 flex-shrink-0">
                <span className="text-purple-600 font-bold text-lg">3</span>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-3">Escribe tu primer mensaje</h3>
                <p className="text-gray-600 mb-4">
                  Sé claro, educado y específico en tu primer mensaje. Esto aumentará las posibilidades de una respuesta rápida.
                </p>
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <h4 className="font-semibold text-green-800 mb-2">Ejemplo de buen primer mensaje:</h4>
                  <p className="text-sm text-green-700 italic">
                    "Hola, me interesa tu iPhone 12. ¿Podrías contarme más sobre el estado de la batería y si incluye el cargador original? ¿Cuándo podríamos vernos para que lo pueda revisar? Gracias."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What to Ask */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Qué Preguntar al Vendedor</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Sobre el Producto */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <svg className="w-6 h-6 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M9 1v6m6-6v6" />
                </svg>
                Sobre el Producto
              </h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span className="text-sm">¿Cuál es el estado real del producto?</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span className="text-sm">¿Tiene algún defecto o daño?</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span className="text-sm">¿Incluye accesorios originales?</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span className="text-sm">¿Cuánto tiempo lo has usado?</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span className="text-sm">¿Por qué lo vendes?</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span className="text-sm">¿Tienes la factura o garantía?</span>
                </li>
              </ul>
            </div>

            {/* Sobre la Transacción */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <svg className="w-6 h-6 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
                Sobre la Transacción
              </h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span className="text-sm">¿El precio es negociable?</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span className="text-sm">¿Qué métodos de pago aceptas?</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span className="text-sm">¿Cuándo y dónde podemos encontrarnos?</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span className="text-sm">¿Haces envíos o solo entrega en persona?</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span className="text-sm">¿Hay alguna política de devolución?</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span className="text-sm">¿Puedo probarlo antes de comprarlo?</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Communication Tips */}
      <section id="consejos" className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Consejos de Comunicación</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Do's */}
            <div className="bg-green-50 p-6 rounded-lg border border-green-200">
              <div className="flex items-center mb-4">
                <div className="bg-green-100 w-10 h-10 rounded-full flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Qué SÍ hacer</h3>
              </div>
              <ul className="text-sm text-gray-700 space-y-2">
                <li>• Sé educado y respetuoso siempre</li>
                <li>• Haz preguntas específicas y claras</li>
                <li>• Responde rápidamente a los mensajes</li>
                <li>• Mantén toda la comunicación en la plataforma</li>
                <li>• Sé honesto sobre tus intenciones de compra</li>
                <li>• Agradece el tiempo del vendedor</li>
                <li>• Confirma detalles importantes por escrito</li>
              </ul>
            </div>

            {/* Don'ts */}
            <div className="bg-red-50 p-6 rounded-lg border border-red-200">
              <div className="flex items-center mb-4">
                <div className="bg-red-100 w-10 h-10 rounded-full flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Qué NO hacer</h3>
              </div>
              <ul className="text-sm text-gray-700 space-y-2">
                <li>• No seas agresivo o maleducado</li>
                <li>• No hagas ofertas irrisorias</li>
                <li>• No presiones para respuestas inmediatas</li>
                <li>• No compartas información personal de inmediato</li>
                <li>• No uses lenguaje inapropiado</li>
                <li>• No hagas múltiples cuentas para contactar</li>
                <li>• No ignores las respuestas del vendedor</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Response Times */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Tiempos de Respuesta</h2>
          
          <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-200">
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Respuesta Rápida</h3>
                <p className="text-sm text-gray-600">Menos de 2 horas</p>
                <p className="text-xs text-green-600 mt-1">Excelente vendedor</p>
              </div>
              
              <div>
                <div className="bg-yellow-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Respuesta Normal</h3>
                <p className="text-sm text-gray-600">2-24 horas</p>
                <p className="text-xs text-yellow-600 mt-1">Tiempo aceptable</p>
              </div>
              
              <div>
                <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Respuesta Lenta</h3>
                <p className="text-sm text-gray-600">Más de 24 horas</p>
                <p className="text-xs text-red-600 mt-1">Considera otras opciones</p>
              </div>
            </div>
            
            <div className="mt-8 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-700 text-center">
                💡 <strong>Tip:</strong> Si un vendedor no responde en 48 horas, es recomendable buscar otras opciones. 
                Los vendedores activos suelen responder dentro del primer día.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Red Flags */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Señales de Alerta</h2>
          
          <div className="bg-red-50 border border-red-200 rounded-lg p-8">
            <div className="flex items-center mb-6">
              <div className="bg-red-100 w-12 h-12 rounded-full flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">⚠️ Ten cuidado si el vendedor...</h3>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <ul className="space-y-3 text-red-700">
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span className="text-sm">Insiste en comunicarse solo por email o WhatsApp</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span className="text-sm">Presiona para pagar inmediatamente</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span className="text-sm">Se niega a encuentros presenciales</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span className="text-sm">Evita responder preguntas específicas</span>
                </li>
              </ul>
              
              <ul className="space-y-3 text-red-700">
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span className="text-sm">Pide pago por adelantado sin garantías</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span className="text-sm">Tiene muy pocas reseñas o son todas negativas</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span className="text-sm">Cambia constantemente los detalles del producto</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span className="text-sm">Usa un lenguaje agresivo o amenazante</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Support */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            ¿Problemas con un vendedor?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Si tienes problemas para contactar con un vendedor o sospechas de actividad fraudulenta, 
            nuestro equipo está aquí para ayudarte.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors">
              Reportar Vendedor
            </button>
            <button className="bg-white text-purple-600 border border-purple-600 px-6 py-3 rounded-lg hover:bg-purple-50 transition-colors">
              Contactar Soporte
            </button>
          </div>
        </div>
      </section>
    </div>
    </>
  );
};

export default ContactSellerPage;