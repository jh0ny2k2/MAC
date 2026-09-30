import React from 'react';
import SEO from '../../components/SEO/SEO';

const AcceptedPaymentMethodsPage = () => {
  return (
    <>
      <SEO title="Métodos de Pago Aceptados" description="Descubre todos los métodos de pago aceptados en Resmoke para comprar y vender de forma segura." url="/metodos-pago-aceptados"/>
      <div className="min-h-screen bg-gray-50">
      {/* Hero Section (split layout) */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            {/* Texto */}
            <div className="lg:col-span-6">
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900">
                Métodos de Pago Aceptados
              </h1>
              <p className="mt-4 text-lg text-gray-600 max-w-xl">
                Conoce todas las formas de pago que aceptamos en Resmoke, con seguridad, rapidez y transparencia.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <a href="/metodos-pago" className="inline-flex items-center px-5 py-3 rounded-xl bg-gray-900 text-white hover:bg-gray-800 transition">
                  Ver opciones de pago
                </a>
                <a href="/proteccion-datos" className="inline-flex items-center px-5 py-3 rounded-xl ring-1 ring-gray-300 text-gray-900 hover:bg-gray-50 transition">
                  Seguridad de pagos
                </a>
              </div>
              <div className="mt-8 grid grid-cols-3 gap-6 text-center">
                <div className="bg-white/70 backdrop-blur rounded-xl ring-1 ring-gray-200 p-4 shadow-sm">
                  <p className="text-2xl font-bold text-gray-900">+10</p>
                  <p className="text-xs text-gray-500">métodos</p>
                </div>
                <div className="bg-white/70 backdrop-blur rounded-xl ring-1 ring-gray-200 p-4 shadow-sm">
                  <p className="text-2xl font-bold text-gray-900">100%</p>
                  <p className="text-xs text-gray-500">protegido</p>
                </div>
                <div className="bg-white/70 backdrop-blur rounded-xl ring-1 ring-gray-200 p-4 shadow-sm">
                  <p className="text-2xl font-bold text-gray-900">LatAm</p>
                  <p className="text-xs text-gray-500">soporte local</p>
                </div>
              </div>
            </div>
            {/* Imagen */}
            <div className="lg:col-span-6 relative">
              <div className="aspect-[4/3] rounded-2xl bg-white/60 backdrop-blur ring-1 ring-gray-200 shadow-sm overflow-hidden">
                <img src="/img/resmoke/dinero.png" alt="Opciones de pago en Resmoke" className="w-full h-full object-contain" />
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
              Ofrecemos múltiples métodos de pago seguros y confiables para que puedas realizar tus transacciones con total tranquilidad.
            </p>
          </div>
        </div>
      </section>

      {/* Payment Methods */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Métodos Disponibles</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Tarjetas de Crédito/Débito */}
            <div className="bg-white/80 backdrop-blur rounded-2xl p-6 shadow-sm ring-1 ring-gray-200 transition hover:shadow-md">
              <div className="flex items-center mb-4">
                <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900">Tarjetas</h3>
              </div>
              <p className="text-gray-600 mb-4">Acepta tarjetas de crédito y débito de las principales marcas.</p>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Visa</li>
                <li>• Mastercard</li>
                <li>• American Express</li>
                <li>• Diners Club</li>
              </ul>
            </div>

            {/* Transferencias Bancarias */}
            <div className="bg-white/80 backdrop-blur rounded-2xl p-6 shadow-sm ring-1 ring-gray-200 transition hover:shadow-md">
              <div className="flex items-center mb-4">
                <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900">Transferencias</h3>
              </div>
              <p className="text-gray-600 mb-4">Realiza pagos directamente desde tu cuenta bancaria.</p>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Transferencia bancaria</li>
                <li>• PSE (Colombia)</li>
                <li>• SPEI (México)</li>
                <li>• PIX (Brasil)</li>
              </ul>
            </div>

            {/* Billeteras Digitales */}
            <div className="bg-white/80 backdrop-blur rounded-2xl p-6 shadow-sm ring-1 ring-gray-200 transition hover:shadow-md">
              <div className="flex items-center mb-4">
                <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900">Billeteras Digitales</h3>
              </div>
              <p className="text-gray-600 mb-4">Paga con tus billeteras digitales favoritas.</p>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• PayPal</li>
                <li>• Apple Pay</li>
                <li>• Google Pay</li>
                <li>• Samsung Pay</li>
              </ul>
            </div>

            {/* Efectivo */}
            <div className="bg-white/80 backdrop-blur rounded-2xl p-6 shadow-sm ring-1 ring-gray-200 transition hover:shadow-md">
              <div className="flex items-center mb-4">
                <div className="bg-yellow-100 w-12 h-12 rounded-full flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900">Efectivo</h3>
              </div>
              <p className="text-gray-600 mb-4">Paga en efectivo en puntos autorizados.</p>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• OXXO (México)</li>
                <li>• Efecty (Colombia)</li>
                <li>• Pago Fácil (Argentina)</li>
                <li>• Boleto Bancário (Brasil)</li>
              </ul>
            </div>

            {/* Criptomonedas */}
            <div className="bg-white/80 backdrop-blur rounded-2xl p-6 shadow-sm ring-1 ring-gray-200 transition hover:shadow-md">
              <div className="flex items-center mb-4">
                <div className="bg-orange-100 w-12 h-12 rounded-full flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900">Criptomonedas</h3>
              </div>
              <p className="text-gray-600 mb-4">Acepta pagos con las principales criptomonedas.</p>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Bitcoin (BTC)</li>
                <li>• Ethereum (ETH)</li>
                <li>• Litecoin (LTC)</li>
                <li>• USDT</li>
              </ul>
            </div>

            {/* Cuotas */}
            <div className="bg-white/80 backdrop-blur rounded-2xl p-6 shadow-sm ring-1 ring-gray-200 transition hover:shadow-md">
              <div className="flex items-center mb-4">
                <div className="bg-indigo-100 w-12 h-12 rounded-full flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900">Financiamiento</h3>
              </div>
              <p className="text-gray-600 mb-4">Paga en cuotas sin interés o con financiamiento.</p>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Hasta 12 cuotas sin interés</li>
                <li>• Financiamiento hasta 24 meses</li>
                <li>• Klarna</li>
                <li>• Afterpay</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Seguridad Garantizada</h2>
            <p className="text-lg text-gray-600">
              Todos nuestros métodos de pago están protegidos con los más altos estándares de seguridad.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">SSL 256-bit</h3>
              <p className="text-gray-600">Encriptación de nivel bancario para proteger tus datos.</p>
            </div>
            
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">PCI DSS</h3>
              <p className="text-gray-600">Cumplimos con los estándares de seguridad de la industria.</p>
            </div>
            
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Procesamiento Rápido</h3>
              <p className="text-gray-600">Transacciones procesadas en tiempo real.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Preguntas Frecuentes</h2>
          
          <div className="space-y-8">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 mb-3">¿Hay comisiones por usar ciertos métodos de pago?</h3>
              <p className="text-gray-600">
                La mayoría de métodos de pago no tienen comisiones adicionales. Algunas opciones como transferencias internacionales o criptomonedas pueden tener tarifas mínimas que se muestran antes de confirmar el pago.
              </p>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 mb-3">¿Puedo cambiar mi método de pago después de realizar una compra?</h3>
              <p className="text-gray-600">
                Una vez procesado el pago, no es posible cambiar el método. Sin embargo, para reembolsos, podemos procesar el dinero a un método diferente si es necesario.
              </p>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 mb-3">¿Mis datos de pago están seguros?</h3>
              <p className="text-gray-600">
                Sí, utilizamos encriptación SSL de 256 bits y cumplimos con los estándares PCI DSS. Nunca almacenamos información sensible de tarjetas en nuestros servidores.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
    </>
  );
};

export default AcceptedPaymentMethodsPage;