import React from 'react';
import SEO from '../../components/SEO/SEO';

const CommunityRulesPage = () => {
  return (
    <>
      <SEO title="Normas de la Comunidad" description="Conoce las normas de la comunidad de Resmoke. Construyamos juntos un espacio seguro, respetuoso y próspero." url="/normas-comunidad"/>
      <div className="min-h-screen bg-gray-50">
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6">
              <span className="inline-block px-4 py-1 mb-4 rounded-full bg-blue-50 ring-1 ring-blue-200 text-sm tracking-wide text-blue-700">Comunidad</span>
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900">Normas de la Comunidad</h1>
              <p className="mt-4 text-lg text-gray-600 max-w-xl">Construyamos juntos una comunidad segura, respetuosa y próspera.</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <a href="#normas" className="inline-flex items-center px-5 py-3 rounded-xl bg-gray-900 text-white hover:bg-gray-800 transition">Ver normas</a>
                <a href="#contacto" className="inline-flex items-center px-5 py-3 rounded-xl ring-1 ring-gray-300 text-gray-900 hover:bg-gray-50 transition">Contactar soporte</a>
              </div>
              <div className="mt-8 grid grid-cols-3 gap-6 text-center">
                <div className="bg-white/70 backdrop-blur rounded-xl ring-1 ring-gray-200 p-4 shadow-sm">
                  <p className="text-2xl font-bold text-gray-900">Seguro</p>
                  <p className="text-xs text-gray-500">pagos</p>
                </div>
                <div className="bg-white/70 backdrop-blur rounded-xl ring-1 ring-gray-200 p-4 shadow-sm">
                  <p className="text-2xl font-bold text-gray-900">Respeto</p>
                  <p className="text-xs text-gray-500">normas</p>
                </div>
                <div className="bg-white/70 backdrop-blur rounded-xl ring-1 ring-gray-200 p-4 shadow-sm">
                  <p className="text-2xl font-bold text-gray-900">Transparente</p>
                  <p className="text-xs text-gray-500">comunidad</p>
                </div>
              </div>
            </div>
            <div className="lg:col-span-6 relative">
              <div className="aspect-[4/3] rounded-2xl backdrop-blur overflow-hidden">
                <img src="https://cdn-icons-png.flaticon.com/512/9420/9420381.png" alt="Normas de la comunidad" className="w-full h-full object-contain" />
              </div>
              <div className="absolute -bottom-6 -left-6 hidden lg:block w-32 h-32 bg-white/70 rounded-full blur-xl"></div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Bienvenido a Resmoke</h2>
            <p className="text-lg text-gray-600">
              Estas normas están diseñadas para crear un ambiente seguro y positivo para todos nuestros usuarios. 
              Al usar Resmoke, aceptas cumplir con estas directrices.
            </p>
          </div>
        </div>
      </section>

      <section id="normas" className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Respeto y Cortesía */}
          <div className="bg-white rounded-lg p-8 mb-8 shadow-sm border border-gray-200">
            <div className="flex items-center mb-6">
              <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">1. Respeto y Cortesía</h3>
            </div>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Trata a todos los usuarios con respeto y cortesía
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                No uses lenguaje ofensivo, discriminatorio o amenazante
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Respeta las diferencias de opinión y mantén conversaciones constructivas
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                No hagas comentarios despectivos sobre otros usuarios o sus productos
              </li>
            </ul>
          </div>

          {/* Publicaciones Honestas */}
          <div className="bg-white rounded-lg p-8 mb-8 shadow-sm border border-gray-200">
            <div className="flex items-center mb-6">
              <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">2. Publicaciones Honestas y Precisas</h3>
            </div>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Describe tus productos de manera honesta y precisa
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Usa fotos reales y actuales de los productos que vendes
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Menciona cualquier defecto, daño o problema del producto
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Establece precios justos y razonables
              </li>
            </ul>
          </div>

          {/* Transacciones Seguras */}
          <div className="bg-white rounded-lg p-8 mb-8 shadow-sm border border-gray-200">
            <div className="flex items-center mb-6">
              <div className="bg-orange-100 w-12 h-12 rounded-full flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">3. Transacciones Seguras</h3>
            </div>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <span className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Usa únicamente los métodos de pago aprobados por Resmoke
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                No compartas información personal sensible (números de cuenta, contraseñas)
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Realiza entregas en lugares públicos y seguros
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Confirma la recepción del producto antes de finalizar la transacción
              </li>
            </ul>
          </div>

          {/* Contenido Prohibido */}
          <div className="bg-white rounded-lg p-8 mb-8 shadow-sm border border-gray-200">
            <div className="flex items-center mb-6">
              <div className="bg-red-100 w-12 h-12 rounded-full flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">4. Contenido Prohibido</h3>
            </div>
            <div className="bg-red-50 p-4 rounded-lg mb-4">
              <p className="text-red-800 font-medium mb-2">Está estrictamente prohibido vender o promocionar:</p>
            </div>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <span className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Productos ilegales, robados o falsificados
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Armas, drogas o sustancias peligrosas
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Contenido para adultos o material explícito
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Productos que violen derechos de autor o marcas registradas
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Animales vivos o productos derivados de especies protegidas
              </li>
            </ul>
          </div>

          {/* Comunicación */}
          <div className="bg-white rounded-lg p-8 mb-8 shadow-sm border border-gray-200">
            <div className="flex items-center mb-6">
              <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">5. Comunicación Responsable</h3>
            </div>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <span className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Responde a los mensajes de manera oportuna y profesional
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                No envíes spam o mensajes no solicitados
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Mantén las conversaciones relacionadas con la transacción
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Reporta cualquier comportamiento sospechoso o inapropiado
              </li>
            </ul>
          </div>

          {/* Consecuencias */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-8">
            <div className="flex items-center mb-6">
              <div className="bg-yellow-100 w-12 h-12 rounded-full flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Consecuencias por Incumplimiento</h3>
            </div>
            <p className="text-gray-700 mb-4">
              El incumplimiento de estas normas puede resultar en:
            </p>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <span className="w-2 h-2 bg-yellow-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Advertencia formal
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-yellow-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Suspensión temporal de la cuenta
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-yellow-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Eliminación de publicaciones
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-yellow-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Suspensión permanente de la cuenta
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section id="contacto" className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            ¿Tienes Dudas sobre las Normas?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Si tienes preguntas sobre estas normas o necesitas reportar una violación, 
            no dudes en contactarnos.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-blue-600 text-white py-3 px-8 rounded-lg hover:bg-blue-700 transition-colors font-medium">
              Reportar Violación
            </button>
            <button className="border border-gray-300 text-gray-700 py-3 px-8 rounded-lg hover:bg-gray-50 transition-colors font-medium">
              Contactar Soporte
            </button>
          </div>
        </div>
      </section>
    </div>
    </>
  );
};

export default CommunityRulesPage;