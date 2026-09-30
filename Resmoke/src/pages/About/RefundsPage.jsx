import React from 'react';
import SEO from '../../components/SEO/SEO';

const RefundsPage = () => {
  return (
    <>
      <SEO title="Reembolsos y Cancelaciones" description="Todo lo que necesitas saber sobre reembolsos y cancelaciones en Resmoke." url="/reembolsos"/>
      <div className="min-h-screen bg-gray-50">
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6">
              <span className="inline-block px-4 py-1 mb-4 rounded-full bg-green-50 ring-1 ring-green-200 text-sm tracking-wide text-green-700">Pagos</span>
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900">Reembolsos y Cancelaciones</h1>
              <p className="mt-4 text-lg text-gray-600 max-w-xl">Todo lo que necesitas saber sobre reembolsos y cancelaciones en Resmoke.</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <a href="#proceso" className="inline-flex items-center px-5 py-3 rounded-xl bg-gray-900 text-white hover:bg-gray-800 transition">Proceso de reembolso</a>
                <a href="#politica" className="inline-flex items-center px-5 py-3 rounded-xl ring-1 ring-gray-300 text-gray-900 hover:bg-gray-50 transition">Políticas</a>
              </div>
              <div className="mt-8 grid grid-cols-3 gap-6 text-center">
                <div className="bg-white/70 backdrop-blur rounded-xl ring-1 ring-gray-200 p-4 shadow-sm">
                  <p className="text-2xl font-bold text-gray-900">30d</p>
                  <p className="text-xs text-gray-500">límite</p>
                </div>
                <div className="bg-white/70 backdrop-blur rounded-xl ring-1 ring-gray-200 p-4 shadow-sm">
                  <p className="text-2xl font-bold text-gray-900">100%</p>
                  <p className="text-xs text-gray-500">reembolso</p>
                </div>
                <div className="bg-white/70 backdrop-blur rounded-xl ring-1 ring-gray-200 p-4 shadow-sm">
                  <p className="text-2xl font-bold text-gray-900">5-10d</p>
                  <p className="text-xs text-gray-500">procesamiento</p>
                </div>
              </div>
            </div>
            <div className="lg:col-span-6 relative">
              <div className="aspect-[4/3] rounded-2xl backdrop-blur overflow-hidden">
                <img src="https://cdn-icons-png.flaticon.com/512/891/891462.png" alt="Reembolsos y cancelaciones" className="w-full h-full object-contain" />
              </div>
              <div className="absolute -bottom-6 -left-6 hidden lg:block w-32 h-32 bg-white/70 rounded-full blur-xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Policy Overview */}
      <section className="py-12 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Política de Reembolsos</h2>
            <p className="text-lg text-gray-600">
              Ofrecemos reembolsos completos bajo ciertas condiciones para garantizar tu satisfacción.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-green-50 rounded-lg p-6 text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">30 Días</h3>
              <p className="text-gray-600 text-sm">Tiempo límite para solicitar reembolso</p>
            </div>
            
            <div className="bg-blue-50 rounded-lg p-6 text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">100% Reembolso</h3>
              <p className="text-gray-600 text-sm">Reembolso completo si cumples las condiciones</p>
            </div>
            
            <div className="bg-purple-50 rounded-lg p-6 text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">5-10 Días</h3>
              <p className="text-gray-600 text-sm">Tiempo de procesamiento del reembolso</p>
            </div>
          </div>
        </div>
      </section>

      {/* Refund Conditions */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Condiciones para Reembolso</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Productos Físicos */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <div className="flex items-center mb-4">
                <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900">Productos Físicos</h3>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Condiciones que SÍ califican:</h4>
                  <ul className="text-sm text-gray-600 space-y-1 ml-4">
                    <li>• Producto defectuoso o dañado</li>
                    <li>• No coincide con la descripción</li>
                    <li>• Llegó el producto incorrecto</li>
                    <li>• No llegó en el tiempo prometido</li>
                    <li>• Problemas de calidad evidentes</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Condiciones que NO califican:</h4>
                  <ul className="text-sm text-gray-600 space-y-1 ml-4">
                    <li>• Cambio de opinión</li>
                    <li>• Producto usado o dañado por el comprador</li>
                    <li>• Más de 30 días desde la compra</li>
                    <li>• Productos personalizados</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Productos Digitales */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <div className="flex items-center mb-4">
                <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900">Productos Digitales</h3>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Condiciones que SÍ califican:</h4>
                  <ul className="text-sm text-gray-600 space-y-1 ml-4">
                    <li>• Archivo corrupto o no funciona</li>
                    <li>• No coincide con la descripción</li>
                    <li>• Problemas técnicos del producto</li>
                    <li>• No se pudo descargar</li>
                    <li>• Calidad inferior a la prometida</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Condiciones que NO califican:</h4>
                  <ul className="text-sm text-gray-600 space-y-1 ml-4">
                    <li>• Ya descargaste el producto</li>
                    <li>• Cambio de opinión</li>
                    <li>• Incompatibilidad con tu dispositivo</li>
                    <li>• Más de 7 días desde la compra</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Servicios */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <div className="flex items-center mb-4">
                <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900">Servicios</h3>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Condiciones que SÍ califican:</h4>
                  <ul className="text-sm text-gray-600 space-y-1 ml-4">
                    <li>• Servicio no prestado</li>
                    <li>• Calidad inferior a la prometida</li>
                    <li>• No cumple especificaciones</li>
                    <li>• Cancelación antes del inicio</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Condiciones que NO califican:</h4>
                  <ul className="text-sm text-gray-600 space-y-1 ml-4">
                    <li>• Servicio ya completado</li>
                    <li>• Cambio de opinión después del inicio</li>
                    <li>• Servicios personalizados completados</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Suscripciones */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <div className="flex items-center mb-4">
                <div className="bg-orange-100 w-12 h-12 rounded-full flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900">Suscripciones</h3>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Política especial:</h4>
                  <ul className="text-sm text-gray-600 space-y-1 ml-4">
                    <li>• Reembolso prorrateado del período no usado</li>
                    <li>• Cancelación inmediata disponible</li>
                    <li>• Sin penalizaciones por cancelación</li>
                    <li>• Acceso hasta el final del período pagado</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Refund Process */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Proceso de Reembolso</h2>
          
          <div className="space-y-8">
            <div className="flex items-start">
              <div className="bg-blue-100 w-10 h-10 rounded-full flex items-center justify-center mr-4 mt-1">
                <span className="text-blue-600 font-bold">1</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Solicita el Reembolso</h3>
                <p className="text-gray-600">
                  Contacta nuestro soporte o usa el formulario de reembolso en tu cuenta. Incluye el número de orden y motivo del reembolso.
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-blue-100 w-10 h-10 rounded-full flex items-center justify-center mr-4 mt-1">
                <span className="text-blue-600 font-bold">2</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Revisión de la Solicitud</h3>
                <p className="text-gray-600">
                  Nuestro equipo revisa tu solicitud en 24-48 horas. Te contactaremos si necesitamos información adicional.
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-blue-100 w-10 h-10 rounded-full flex items-center justify-center mr-4 mt-1">
                <span className="text-blue-600 font-bold">3</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Aprobación y Procesamiento</h3>
                <p className="text-gray-600">
                  Si tu solicitud es aprobada, procesamos el reembolso al método de pago original en 5-10 días hábiles.
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-green-100 w-10 h-10 rounded-full flex items-center justify-center mr-4 mt-1">
                <span className="text-green-600 font-bold">4</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Confirmación</h3>
                <p className="text-gray-600">
                  Recibes una confirmación por email cuando el reembolso ha sido procesado. El tiempo de aparición en tu cuenta depende de tu banco.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cancellation Policy */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Política de Cancelaciones</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Cancelación de Pedidos</h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-600 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Cancelación gratuita antes del envío</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-600 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Reembolso completo si no ha sido procesado</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-yellow-600 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <span>Posibles costos de envío si ya fue enviado</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Cancelación de Servicios</h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-600 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Cancelación gratuita antes del inicio</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-600 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Reembolso prorrateado si se cancela durante</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-red-600 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <span>Sin reembolso si el servicio fue completado</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Preguntas Frecuentes</h2>
          
          <div className="space-y-8">
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">¿Cuánto tiempo toma recibir mi reembolso?</h3>
              <p className="text-gray-600">
                Los reembolsos se procesan en 5-10 días hábiles. El tiempo exacto depende de tu método de pago original y tu institución financiera.
              </p>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">¿Puedo recibir el reembolso en un método diferente?</h3>
              <p className="text-gray-600">
                Por seguridad, los reembolsos se procesan al método de pago original. En casos especiales, contacta soporte para explorar alternativas.
              </p>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">¿Qué pasa con los gastos de envío?</h3>
              <p className="text-gray-600">
                Los gastos de envío se reembolsan si el problema fue nuestro (producto defectuoso, error en el envío). Para devoluciones por cambio de opinión, los gastos de envío no son reembolsables.
              </p>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">¿Puedo cambiar un producto en lugar de pedir reembolso?</h3>
              <p className="text-gray-600">
                Sí, ofrecemos cambios por productos de igual o mayor valor. Contacta soporte para coordinar el cambio antes de devolver el producto.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">¿Necesitas Solicitar un Reembolso?</h2>
          <p className="text-lg text-gray-600 mb-8">
            Nuestro equipo está aquí para ayudarte con tu solicitud de reembolso.
          </p>
          
          <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
            <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors w-full sm:w-auto">
              Solicitar Reembolso
            </button>
            <button className="bg-gray-200 text-gray-800 px-8 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors w-full sm:w-auto">
              Contactar Soporte
            </button>
          </div>
        </div>
      </section>
    </div>
    </>
  );
};

export default RefundsPage;