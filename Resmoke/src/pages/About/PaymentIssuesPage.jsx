import React from 'react';
import SEO from '../../components/SEO/SEO';

const PaymentIssuesPage = () => {
  return (
    <>
      <SEO title="Problemas con Pagos" description="Soluciona los problemas más comunes con tus pagos en Resmoke." url="/problemas-pago"/>
      <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6">
              <span className="inline-block px-4 py-1 mb-4 rounded-full bg-amber-50 ring-1 ring-amber-200 text-sm tracking-wide text-amber-700">Incidencias</span>
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900">Problemas con pagos</h1>
              <p className="mt-4 text-lg text-gray-600 max-w-xl">Soluciona los problemas más comunes con tus pagos en Resmoke.</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <a href="#soluciones" className="inline-flex items-center px-5 py-3 rounded-xl bg-gray-900 text-white hover:bg-gray-800 transition">Ver soluciones rápidas</a>
                <a href="#soporte" className="inline-flex items-center px-5 py-3 rounded-xl ring-1 ring-gray-300 text-gray-900 hover:bg-gray-50 transition">Contactar soporte</a>
              </div>
              <div className="mt-8 grid grid-cols-3 gap-6 text-center">
                <div className="bg-white/70 backdrop-blur rounded-xl ring-1 ring-gray-200 p-4 shadow-sm">
                  <p className="text-2xl font-bold text-gray-900">Guías</p>
                  <p className="text-xs text-gray-500">paso a paso</p>
                </div>
                <div className="bg-white/70 backdrop-blur rounded-xl ring-1 ring-gray-200 p-4 shadow-sm">
                  <p className="text-2xl font-bold text-gray-900">24/7</p>
                  <p className="text-xs text-gray-500">soporte</p>
                </div>
                <div className="bg-white/70 backdrop-blur rounded-xl ring-1 ring-gray-200 p-4 shadow-sm">
                  <p className="text-2xl font-bold text-gray-900">Seguro</p>
                  <p className="text-xs text-gray-500">protección</p>
                </div>
              </div>
            </div>
            <div className="lg:col-span-6 relative">
              <div className="aspect-[4/3] rounded-2xl backdrop-blur overflow-hidden">
                <img src="https://cdn-icons-png.flaticon.com/512/1150/1150626.png" alt="Problemas de pago" className="w-full h-full object-contain" />
              </div>
              <div className="absolute -bottom-6 -left-6 hidden lg:block w-32 h-32 bg-white/70 rounded-full blur-xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Solutions */}
      <section id="soluciones" className="py-12 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Soluciones Rápidas</h2>
            <p className="text-lg text-gray-600">
              Antes de contactar soporte, prueba estas soluciones para los problemas más comunes.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-blue-50 rounded-lg p-6 text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Reintentar Pago</h3>
              <p className="text-gray-600 text-sm">Vuelve a intentar el pago después de unos minutos</p>
            </div>
            
            <div className="bg-green-50 rounded-lg p-6 text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Verificar Datos</h3>
              <p className="text-gray-600 text-sm">Confirma que todos los datos sean correctos</p>
            </div>
            
            <div className="bg-purple-50 rounded-lg p-6 text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Cambiar Método</h3>
              <p className="text-gray-600 text-sm">Prueba con un método de pago diferente</p>
            </div>
          </div>
        </div>
      </section>

      {/* Common Issues */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Problemas Comunes</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Tarjeta Rechazada */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <div className="flex items-center mb-4">
                <div className="bg-red-100 w-12 h-12 rounded-full flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900">Tarjeta Rechazada</h3>
              </div>
              <p className="text-gray-600 mb-4">Tu tarjeta fue rechazada durante el procesamiento del pago.</p>
              
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900">Posibles causas:</h4>
                <ul className="text-sm text-gray-600 space-y-1 ml-4">
                  <li>• Fondos insuficientes</li>
                  <li>• Tarjeta vencida</li>
                  <li>• Datos incorrectos (número, CVV, fecha)</li>
                  <li>• Límite de compras excedido</li>
                  <li>• Tarjeta bloqueada por el banco</li>
                </ul>
                
                <h4 className="font-semibold text-gray-900 mt-4">Soluciones:</h4>
                <ul className="text-sm text-gray-600 space-y-1 ml-4">
                  <li>• Verifica el saldo disponible</li>
                  <li>• Confirma que la tarjeta esté vigente</li>
                  <li>• Revisa todos los datos ingresados</li>
                  <li>• Contacta a tu banco para verificar bloqueos</li>
                  <li>• Prueba con otra tarjeta</li>
                </ul>
              </div>
            </div>

            {/* Error de Conexión */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <div className="flex items-center mb-4">
                <div className="bg-orange-100 w-12 h-12 rounded-full flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900">Error de Conexión</h3>
              </div>
              <p className="text-gray-600 mb-4">Problemas de conectividad durante el proceso de pago.</p>
              
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900">Posibles causas:</h4>
                <ul className="text-sm text-gray-600 space-y-1 ml-4">
                  <li>• Conexión a internet inestable</li>
                  <li>• Timeout del servidor</li>
                  <li>• Problemas temporales del procesador</li>
                  <li>• Navegador desactualizado</li>
                </ul>
                
                <h4 className="font-semibold text-gray-900 mt-4">Soluciones:</h4>
                <ul className="text-sm text-gray-600 space-y-1 ml-4">
                  <li>• Verifica tu conexión a internet</li>
                  <li>• Actualiza tu navegador</li>
                  <li>• Limpia caché y cookies</li>
                  <li>• Intenta desde otro dispositivo</li>
                  <li>• Espera unos minutos y reintenta</li>
                </ul>
              </div>
            </div>

            {/* Pago Duplicado */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <div className="flex items-center mb-4">
                <div className="bg-yellow-100 w-12 h-12 rounded-full flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900">Pago Duplicado</h3>
              </div>
              <p className="text-gray-600 mb-4">Se procesaron múltiples pagos por la misma compra.</p>
              
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900">Posibles causas:</h4>
                <ul className="text-sm text-gray-600 space-y-1 ml-4">
                  <li>• Múltiples clics en el botón de pago</li>
                  <li>• Actualización de página durante el proceso</li>
                  <li>• Error temporal del sistema</li>
                </ul>
                
                <h4 className="font-semibold text-gray-900 mt-4">Soluciones:</h4>
                <ul className="text-sm text-gray-600 space-y-1 ml-4">
                  <li>• Revisa tu historial de transacciones</li>
                  <li>• Contacta soporte con los detalles</li>
                  <li>• El reembolso se procesa automáticamente</li>
                  <li>• Evita hacer clic múltiples veces</li>
                </ul>
              </div>
            </div>

            {/* Pago Pendiente */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <div className="flex items-center mb-4">
                <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900">Pago Pendiente</h3>
              </div>
              <p className="text-gray-600 mb-4">Tu pago está en proceso pero aún no se ha confirmado.</p>
              
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900">Posibles causas:</h4>
                <ul className="text-sm text-gray-600 space-y-1 ml-4">
                  <li>• Verificación adicional requerida</li>
                  <li>• Procesamiento bancario en curso</li>
                  <li>• Método de pago con tiempo de espera</li>
                </ul>
                
                <h4 className="font-semibold text-gray-900 mt-4">Qué hacer:</h4>
                <ul className="text-sm text-gray-600 space-y-1 ml-4">
                  <li>• Espera el tiempo estimado de procesamiento</li>
                  <li>• Revisa tu email para notificaciones</li>
                  <li>• Verifica el estado en tu cuenta</li>
                  <li>• Contacta soporte si excede el tiempo</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Troubleshooting Steps */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Pasos de Solución</h2>
          
          <div className="space-y-8">
            <div className="flex items-start">
              <div className="bg-blue-100 w-10 h-10 rounded-full flex items-center justify-center mr-4 mt-1">
                <span className="text-blue-600 font-bold">1</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Verifica los Datos</h3>
                <p className="text-gray-600">
                  Asegúrate de que todos los datos de pago sean correctos: número de tarjeta, fecha de vencimiento, CVV, y dirección de facturación.
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-blue-100 w-10 h-10 rounded-full flex items-center justify-center mr-4 mt-1">
                <span className="text-blue-600 font-bold">2</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Revisa tu Cuenta</h3>
                <p className="text-gray-600">
                  Confirma que tengas fondos suficientes y que tu tarjeta o cuenta esté activa y sin restricciones.
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-blue-100 w-10 h-10 rounded-full flex items-center justify-center mr-4 mt-1">
                <span className="text-blue-600 font-bold">3</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Prueba Otro Método</h3>
                <p className="text-gray-600">
                  Si el problema persiste, intenta con un método de pago diferente o una tarjeta alternativa.
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-blue-100 w-10 h-10 rounded-full flex items-center justify-center mr-4 mt-1">
                <span className="text-blue-600 font-bold">4</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Contacta Soporte</h3>
                <p className="text-gray-600">
                  Si ninguna solución funciona, contacta nuestro equipo de soporte con los detalles del error y el número de transacción.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Support */}
      <section id="soporte" className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg p-8 shadow-sm text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">¿Necesitas Ayuda Adicional?</h2>
            <p className="text-lg text-gray-600 mb-8">
              Si no puedes resolver el problema con las soluciones anteriores, nuestro equipo está aquí para ayudarte.
            </p>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Email</h3>
                <p className="text-gray-600 text-sm">soporte@resmoke.com</p>
                <p className="text-gray-500 text-xs">Respuesta en 24 horas</p>
              </div>
              
              <div className="text-center">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Chat en Vivo</h3>
                <p className="text-gray-600 text-sm">Disponible 24/7</p>
                <p className="text-gray-500 text-xs">Respuesta inmediata</p>
              </div>
              
              <div className="text-center">
                <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Teléfono</h3>
                <p className="text-gray-600 text-sm">+1 (555) 123-4567</p>
                <p className="text-gray-500 text-xs">Lun-Vie 9AM-6PM</p>
              </div>
            </div>
            
            <div className="mt-8">
              <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                Contactar Soporte
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
    </>
  );
};

export default PaymentIssuesPage;