import React from 'react';
import SEO from '../../components/SEO/SEO';

const PaymentProcessingPage = () => {
  return (
    <>
      <SEO title="Procesamiento de Pago" description="Conoce los tiempos de procesamiento para cada método de pago en Resmoke." url="/procesamiento-pago"/>
      <div className="min-h-screen bg-gray-50">

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6">
              <span className="inline-block px-4 py-1 mb-4 rounded-full bg-cyan-50 ring-1 ring-cyan-200 text-sm tracking-wide text-cyan-700">Procesamiento</span>
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900">¿Cuándo se procesa el pago?</h1>
              <p className="mt-4 text-lg text-gray-600 max-w-xl">Conoce los tiempos de procesamiento para cada método de pago.</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <a href="#tiempos" className="inline-flex items-center px-5 py-3 rounded-xl bg-gray-900 text-white hover:bg-gray-800 transition">Ver tiempos</a>
                <a href="#proceso" className="inline-flex items-center px-5 py-3 rounded-xl ring-1 ring-gray-300 text-gray-900 hover:bg-gray-50 transition">Proceso detallado</a>
              </div>
              <div className="mt-8 grid grid-cols-3 gap-6 text-center">
                <div className="bg-white/70 backdrop-blur rounded-xl ring-1 ring-gray-200 p-4 shadow-sm">
                  <p className="text-2xl font-bold text-gray-900">99.9%</p>
                  <p className="text-xs text-gray-500">éxito</p>
                </div>
                <div className="bg-white/70 backdrop-blur rounded-xl ring-1 ring-gray-200 p-4 shadow-sm">
                  <p className="text-2xl font-bold text-gray-900">512ms</p>
                  <p className="text-xs text-gray-500">promedio</p>
                </div>
                <div className="bg-white/70 backdrop-blur rounded-xl ring-1 ring-gray-200 p-4 shadow-sm">
                  <p className="text-2xl font-bold text-gray-900">24/7</p>
                  <p className="text-xs text-gray-500">monitoreo</p>
                </div>
              </div>
            </div>
            <div className="lg:col-span-6 relative">
              <div className="aspect-[4/3] rounded-2xl backdrop-blur overflow-hidden">
                <img src="https://cdn-icons-png.flaticon.com/512/566/566016.png" alt="Procesamiento de pagos" className="w-full h-full object-contain" />
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
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Tiempos de Procesamiento</h2>
            <p className="text-lg text-gray-600">
              Los tiempos de procesamiento varían según el método de pago que elijas. Aquí te explicamos cuándo se procesa cada tipo de transacción.
            </p>
          </div>
        </div>
      </section>

      {/* Processing Times */}
      <section id="tiempos" className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Tiempos por Método de Pago</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Tarjetas de Crédito/Débito */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <div className="flex items-center mb-4">
                <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Tarjetas de Crédito/Débito</h3>
                  <span className="inline-block bg-green-100 text-green-800 text-sm px-2 py-1 rounded-full">Inmediato</span>
                </div>
              </div>
              <p className="text-gray-600 mb-4">
                Los pagos con tarjeta se procesan inmediatamente. Una vez autorizada la transacción, el pago queda confirmado.
              </p>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• <strong>Autorización:</strong> 1-3 segundos</li>
                <li>• <strong>Confirmación:</strong> Inmediata</li>
                <li>• <strong>Disponibilidad del producto:</strong> Inmediata</li>
              </ul>
            </div>

            {/* Transferencias Bancarias */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <div className="flex items-center mb-4">
                <div className="bg-yellow-100 w-12 h-12 rounded-full flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Transferencias Bancarias</h3>
                  <span className="inline-block bg-yellow-100 text-yellow-800 text-sm px-2 py-1 rounded-full">1-3 días hábiles</span>
                </div>
              </div>
              <p className="text-gray-600 mb-4">
                Las transferencias bancarias requieren verificación y pueden tomar entre 1 a 3 días hábiles en procesarse.
              </p>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• <strong>Transferencia nacional:</strong> 1-2 días hábiles</li>
                <li>• <strong>Transferencia internacional:</strong> 2-5 días hábiles</li>
                <li>• <strong>Verificación:</strong> Automática al recibir fondos</li>
              </ul>
            </div>

            {/* PSE y métodos locales */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <div className="flex items-center mb-4">
                <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">PSE / SPEI / PIX</h3>
                  <span className="inline-block bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded-full">Inmediato - 2 horas</span>
                </div>
              </div>
              <p className="text-gray-600 mb-4">
                Los métodos de pago locales como PSE, SPEI y PIX se procesan rápidamente.
              </p>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• <strong>PSE (Colombia):</strong> Inmediato</li>
                <li>• <strong>SPEI (México):</strong> Inmediato</li>
                <li>• <strong>PIX (Brasil):</strong> Inmediato</li>
                <li>• <strong>Verificación:</strong> Automática</li>
              </ul>
            </div>

            {/* Billeteras Digitales */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <div className="flex items-center mb-4">
                <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Billeteras Digitales</h3>
                  <span className="inline-block bg-purple-100 text-purple-800 text-sm px-2 py-1 rounded-full">Inmediato</span>
                </div>
              </div>
              <p className="text-gray-600 mb-4">
                PayPal, Apple Pay, Google Pay y otras billeteras digitales procesan pagos instantáneamente.
              </p>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• <strong>PayPal:</strong> Inmediato</li>
                <li>• <strong>Apple Pay:</strong> Inmediato</li>
                <li>• <strong>Google Pay:</strong> Inmediato</li>
                <li>• <strong>Confirmación:</strong> Inmediata</li>
              </ul>
            </div>

            {/* Efectivo */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <div className="flex items-center mb-4">
                <div className="bg-orange-100 w-12 h-12 rounded-full flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Pagos en Efectivo</h3>
                  <span className="inline-block bg-orange-100 text-orange-800 text-sm px-2 py-1 rounded-full">15 min - 2 horas</span>
                </div>
              </div>
              <p className="text-gray-600 mb-4">
                Los pagos en efectivo se procesan una vez que el establecimiento confirma el pago.
              </p>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• <strong>OXXO:</strong> 15 minutos - 2 horas</li>
                <li>• <strong>Efecty:</strong> 30 minutos - 2 horas</li>
                <li>• <strong>Pago Fácil:</strong> 1-4 horas</li>
                <li>• <strong>Verificación:</strong> Automática al confirmar</li>
              </ul>
            </div>

            {/* Criptomonedas */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <div className="flex items-center mb-4">
                <div className="bg-indigo-100 w-12 h-12 rounded-full flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Criptomonedas</h3>
                  <span className="inline-block bg-indigo-100 text-indigo-800 text-sm px-2 py-1 rounded-full">10 min - 1 hora</span>
                </div>
              </div>
              <p className="text-gray-600 mb-4">
                Los pagos con criptomonedas requieren confirmaciones en la blockchain.
              </p>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• <strong>Bitcoin:</strong> 10-60 minutos</li>
                <li>• <strong>Ethereum:</strong> 2-15 minutos</li>
                <li>• <strong>Litecoin:</strong> 5-30 minutos</li>
                <li>• <strong>USDT:</strong> 2-15 minutos</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Processing Flow */}
      <section id="proceso" className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Proceso de Pago</h2>
          
          <div className="space-y-8">
            <div className="flex items-start">
              <div className="bg-blue-100 w-10 h-10 rounded-full flex items-center justify-center mr-4 mt-1">
                <span className="text-blue-600 font-bold">1</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Selección del Método</h3>
                <p className="text-gray-600">
                  Eliges tu método de pago preferido durante el checkout. Se te mostrará el tiempo estimado de procesamiento.
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-blue-100 w-10 h-10 rounded-full flex items-center justify-center mr-4 mt-1">
                <span className="text-blue-600 font-bold">2</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Autorización</h3>
                <p className="text-gray-600">
                  Tu método de pago es verificado y autorizado. Recibes una confirmación inmediata de que la transacción está en proceso.
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-blue-100 w-10 h-10 rounded-full flex items-center justify-center mr-4 mt-1">
                <span className="text-blue-600 font-bold">3</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Procesamiento</h3>
                <p className="text-gray-600">
                  El pago se procesa según los tiempos establecidos para cada método. Recibes notificaciones del estado.
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
                  Una vez procesado el pago, recibes la confirmación final y el producto queda disponible para entrega o descarga.
                </p>
              </div>
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
              <h3 className="text-xl font-bold text-gray-900 mb-3">¿Qué pasa si mi pago no se procesa?</h3>
              <p className="text-gray-600">
                Si tu pago no se procesa en el tiempo estimado, recibirás una notificación automática. Nuestro equipo de soporte revisará la transacción y te contactará para resolver cualquier problema.
              </p>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 mb-3">¿Puedo acelerar el procesamiento de mi pago?</h3>
              <p className="text-gray-600">
                Los tiempos de procesamiento dependen del método de pago y las instituciones financieras involucradas. Para pagos más rápidos, recomendamos usar tarjetas de crédito/débito o billeteras digitales.
              </p>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 mb-3">¿Recibo notificaciones del estado de mi pago?</h3>
              <p className="text-gray-600">
                Sí, recibes notificaciones por email y en la aplicación en cada etapa del proceso: autorización, procesamiento y confirmación final.
              </p>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 mb-3">¿Los fines de semana afectan el procesamiento?</h3>
              <p className="text-gray-600">
                Los métodos digitales (tarjetas, billeteras digitales) funcionan 24/7. Las transferencias bancarias y pagos en efectivo pueden verse afectados por horarios bancarios y días no hábiles.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
    </>
  );
};

export default PaymentProcessingPage;