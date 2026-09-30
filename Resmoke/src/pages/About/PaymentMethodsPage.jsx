import React from 'react';
import SEO from '../../components/SEO/SEO';

const PaymentMethodsPage = () => {
  return (
    <>
      <SEO title="Métodos de Pago" description="Conoce todas las opciones seguras para realizar tus transacciones en Resmoke." url="/metodos-pago"/>
      <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6">
              <span className="inline-block px-4 py-1 mb-4 rounded-full bg-green-50 ring-1 ring-green-200 text-sm tracking-wide text-green-700">Pagos</span>
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900">Métodos de Pago Disponibles</h1>
              <p className="mt-4 text-lg text-gray-600 max-w-xl">Conoce todas las opciones seguras para realizar tus transacciones en Resmoke.</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <a href="#metodos" className="inline-flex items-center px-5 py-3 rounded-xl bg-gray-900 text-white hover:bg-gray-800 transition">Ver métodos</a>
                <a href="#seguridad" className="inline-flex items-center px-5 py-3 rounded-xl ring-1 ring-gray-300 text-gray-900 hover:bg-gray-50 transition">Seguridad de pagos</a>
              </div>
              <div className="mt-8 grid grid-cols-3 gap-6 text-center">
                <div className="bg-white/70 backdrop-blur rounded-xl ring-1 ring-gray-200 p-4 shadow-sm">
                  <p className="text-2xl font-bold text-gray-900">Seguro</p>
                  <p className="text-xs text-gray-500">protección</p>
                </div>
                <div className="bg-white/70 backdrop-blur rounded-xl ring-1 ring-gray-200 p-4 shadow-sm">
                  <p className="text-2xl font-bold text-gray-900">Variedad</p>
                  <p className="text-xs text-gray-500">opciones</p>
                </div>
                <div className="bg-white/70 backdrop-blur rounded-xl ring-1 ring-gray-200 p-4 shadow-sm">
                  <p className="text-2xl font-bold text-gray-900">Rápido</p>
                  <p className="text-xs text-gray-500">procesos</p>
                </div>
              </div>
            </div>
            <div className="lg:col-span-6 relative">
              <div className="aspect-[4/3] rounded-2xl backdrop-blur overflow-hidden">
                <img src="https://cdn-icons-png.flaticon.com/512/891/891462.png" alt="Métodos de pago" className="w-full h-full object-contain" />
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
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Paga de Forma Segura</h2>
            <p className="text-lg text-gray-600">
              Ofrecemos múltiples métodos de pago para que elijas el que mejor se adapte a tus necesidades. 
              Todos nuestros métodos están protegidos y verificados.
            </p>
          </div>
        </div>
      </section>

      {/* Payment Methods */}
      <section id="metodos" className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Métodos Disponibles</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Tarjetas de Crédito/Débito */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <div className="flex items-center mb-4">
                <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900">Tarjetas</h3>
              </div>
              <p className="text-gray-600 mb-4">Acepta tarjetas de crédito y débito de las principales marcas.</p>
              
              <div className="space-y-3">
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                  <span className="text-sm text-gray-700">Visa, Mastercard, American Express</span>
                </div>
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                  <span className="text-sm text-gray-700">Protección contra fraude</span>
                </div>
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                  <span className="text-sm text-gray-700">Procesamiento instantáneo</span>
                </div>
              </div>
              
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-xs text-blue-700">💳 Ideal para compras online y envíos</p>
              </div>
            </div>

            {/* Transferencia Bancaria */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <div className="flex items-center mb-4">
                <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900">Transferencia</h3>
              </div>
              <p className="text-gray-600 mb-4">Transfiere directamente desde tu cuenta bancaria.</p>
              
              <div className="space-y-3">
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                  <span className="text-sm text-gray-700">Todos los bancos españoles</span>
                </div>
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                  <span className="text-sm text-gray-700">Sin comisiones adicionales</span>
                </div>
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                  <span className="text-sm text-gray-700">Verificación automática</span>
                </div>
              </div>
              
              <div className="mt-4 p-3 bg-green-50 rounded-lg">
                <p className="text-xs text-green-700">🏦 Perfecto para transacciones grandes</p>
              </div>
            </div>

            {/* PayPal */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <div className="flex items-center mb-4">
                <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900">PayPal</h3>
              </div>
              <p className="text-gray-600 mb-4">Paga con tu cuenta PayPal de forma rápida y segura.</p>
              
              <div className="space-y-3">
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                  <span className="text-sm text-gray-700">Protección del comprador</span>
                </div>
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                  <span className="text-sm text-gray-700">No compartas datos bancarios</span>
                </div>
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                  <span className="text-sm text-gray-700">Pago en un clic</span>
                </div>
              </div>
              
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-xs text-blue-700">🛡️ Máxima protección y comodidad</p>
              </div>
            </div>

            {/* Bizum */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <div className="flex items-center mb-4">
                <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900">Bizum</h3>
              </div>
              <p className="text-gray-600 mb-4">Pago instantáneo desde tu móvil con Bizum.</p>
              
              <div className="space-y-3">
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                  <span className="text-sm text-gray-700">Pago inmediato</span>
                </div>
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                  <span className="text-sm text-gray-700">Solo necesitas el móvil</span>
                </div>
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                  <span className="text-sm text-gray-700">Límite hasta 1.000€</span>
                </div>
              </div>
              
              <div className="mt-4 p-3 bg-purple-50 rounded-lg">
                <p className="text-xs text-purple-700">📱 Ideal para encuentros presenciales</p>
              </div>
            </div>

            {/* Efectivo */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <div className="flex items-center mb-4">
                <div className="bg-yellow-100 w-12 h-12 rounded-full flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900">Efectivo</h3>
              </div>
              <p className="text-gray-600 mb-4">Pago en efectivo para encuentros presenciales.</p>
              
              <div className="space-y-3">
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                  <span className="text-sm text-gray-700">Solo en encuentros presenciales</span>
                </div>
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                  <span className="text-sm text-gray-700">Inspecciona antes de pagar</span>
                </div>
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></span>
                  <span className="text-sm text-gray-700">Recomendado hasta 200€</span>
                </div>
              </div>
              
              <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
                <p className="text-xs text-yellow-700">💰 Lleva cambio exacto si es posible</p>
              </div>
            </div>

            {/* Contrareembolso */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <div className="flex items-center mb-4">
                <div className="bg-orange-100 w-12 h-12 rounded-full flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M9 1v6m6-6v6" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900">Contrareembolso</h3>
              </div>
              <p className="text-gray-600 mb-4">Paga cuando recibas el producto en tu domicilio.</p>
              
              <div className="space-y-3">
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                  <span className="text-sm text-gray-700">Pago al recibir</span>
                </div>
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                  <span className="text-sm text-gray-700">Inspección antes del pago</span>
                </div>
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-orange-500 rounded-full mr-3"></span>
                  <span className="text-sm text-gray-700">Comisión adicional 3€</span>
                </div>
              </div>
              
              <div className="mt-4 p-3 bg-orange-50 rounded-lg">
                <p className="text-xs text-orange-700">📦 Solo para envíos a domicilio</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Security Features */}
      <section id="seguridad" className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Seguridad en los Pagos</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-green-50 p-6 rounded-lg border border-green-200">
              <div className="flex items-center mb-4">
                <div className="bg-green-100 w-10 h-10 rounded-full flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Protección Garantizada</h3>
              </div>
              <ul className="text-sm text-gray-700 space-y-2">
                <li>• Encriptación SSL de 256 bits</li>
                <li>• Verificación de identidad obligatoria</li>
                <li>• Monitoreo 24/7 contra fraude</li>
                <li>• Cumplimiento PCI DSS</li>
                <li>• Protección de datos bancarios</li>
              </ul>
            </div>
            
            <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
              <div className="flex items-center mb-4">
                <div className="bg-blue-100 w-10 h-10 rounded-full flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Garantía de Reembolso</h3>
              </div>
              <ul className="text-sm text-gray-700 space-y-2">
                <li>• Reembolso completo si no recibes el producto</li>
                <li>• Protección contra vendedores fraudulentos</li>
                <li>• Mediación en disputas</li>
                <li>• Proceso de reclamación simplificado</li>
                <li>• Soporte especializado en pagos</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Payment Process */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Proceso de Pago</h2>
          
          <div className="space-y-6">
            <div className="flex items-start">
              <div className="bg-blue-100 w-8 h-8 rounded-full flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                <span className="text-blue-600 font-bold text-sm">1</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Selecciona tu método de pago</h3>
                <p className="text-gray-600">Elige el método que prefieras durante el proceso de compra. Todos están igualmente protegidos.</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-blue-100 w-8 h-8 rounded-full flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                <span className="text-blue-600 font-bold text-sm">2</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Confirma los detalles</h3>
                <p className="text-gray-600">Revisa el precio, método de pago y detalles de entrega antes de proceder.</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-blue-100 w-8 h-8 rounded-full flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                <span className="text-blue-600 font-bold text-sm">3</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Realiza el pago seguro</h3>
                <p className="text-gray-600">Completa la transacción a través de nuestro sistema protegido. Nunca compartas datos fuera de la plataforma.</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-green-100 w-8 h-8 rounded-full flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                <span className="text-green-600 font-bold text-sm">4</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Recibe confirmación</h3>
                <p className="text-gray-600">Recibirás un email de confirmación con todos los detalles de tu compra y seguimiento.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Preguntas Frecuentes</h2>
          
          <div className="space-y-6">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">¿Es seguro pagar con tarjeta?</h3>
              <p className="text-gray-600">Sí, todos los pagos con tarjeta están protegidos con encriptación SSL y cumplimos con los estándares PCI DSS. Nunca almacenamos tus datos de tarjeta.</p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">¿Puedo cambiar el método de pago después de comprar?</h3>
              <p className="text-gray-600">Una vez confirmada la compra, no es posible cambiar el método de pago. Contacta con soporte si necesitas ayuda específica.</p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">¿Hay comisiones por usar ciertos métodos?</h3>
              <p className="text-gray-600">La mayoría de métodos no tienen comisión. Solo el contrareembolso tiene una comisión de 3€. Las comisiones siempre se muestran antes de confirmar.</p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">¿Qué hago si hay un problema con el pago?</h3>
              <p className="text-gray-600">Contacta inmediatamente con nuestro soporte. Tenemos un equipo especializado en pagos disponible 24/7 para resolver cualquier incidencia.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Support */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            ¿Problemas con los pagos?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Nuestro equipo especializado en pagos está disponible 24/7 para ayudarte con cualquier duda o problema.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors">
              Contactar Soporte de Pagos
            </button>
            <button className="bg-white text-green-600 border border-green-600 px-6 py-3 rounded-lg hover:bg-green-50 transition-colors">
              Ver Políticas de Pago
            </button>
          </div>
        </div>
      </section>
    </div>
    </>
  );
};

export default PaymentMethodsPage;