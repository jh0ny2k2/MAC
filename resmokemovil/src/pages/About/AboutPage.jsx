import React from 'react';
import { Link } from 'react-router-dom';
import SEO from '../../components/SEO/SEO';
import ProjectInfoBanner from '../../components/UI/ProjectInfoBanner';

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <SEO 
        title="Quiénes Somos | Resmoke"
        description="Resmoke es el marketplace líder en España para comprar y vender productos de cachimba de segunda mano, con foco en seguridad, sostenibilidad y comunidad."
        keywords="resmoke, about, quienes somos, cachimba, segunda mano, marketplace, sostenibilidad"
        url="/about"
      />
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Texto y CTAs */}
            <div>
              <span className="inline-block px-4 py-1 mb-4 rounded-full bg-blue-50 ring-1 ring-blue-200 text-sm tracking-wide text-blue-700">Resmoke</span>
              <h1 className="text-5xl font-bold mb-6 text-gray-900">Quiénes Somos</h1>
              <p className="text-lg sm:text-xl text-gray-600 max-w-xl leading-relaxed">
                Marketplace de confianza para comprar y vender cachimbas, vapers y accesorios de segunda mano.
                Impulsamos la sostenibilidad y una comunidad verdadera.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Link 
                  to="/register" 
                  className="bg-blue-600 text-white px-6 sm:px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-300"
                >
                  Crear Cuenta
                </Link>
                <Link 
                  to="/productos" 
                  className="bg-white text-gray-900 px-6 sm:px-8 py-3 rounded-lg font-semibold ring-1 ring-gray-300 hover:bg-gray-50 transition-colors duration-300"
                >
                  Explorar Productos
                </Link>
              </div>
              <div className="mt-10 flex items-center gap-8">
                <div>
                  <div className="text-3xl font-bold text-gray-900">10K+</div>
                  <div className="text-gray-600">Usuarios activos</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-gray-900">25K+</div>
                  <div className="text-gray-600">Productos vendidos</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-gray-900">98%</div>
                  <div className="text-gray-600">Satisfacción</div>
                </div>
              </div>
            </div>

            {/* Imagen / Collage */}
            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                <img src="https://img.freepik.com/foto-gratis/clasica-pipa-agua-hermosos-rayos-luz-humo-colores-concepto-fumar-pipa-agua_169016-5136.jpg?semt=ais_hybrid&w=740&q=80" alt="Cachimbas" className="w-full h-48 object-cover rounded-2xl ring-1 ring-gray-200 shadow-sm" />
                <img src="https://img.freepik.com/foto-gratis/cachimba-primer-plano-lista-fumar_23-2149173607.jpg?semt=ais_hybrid&w=740&q=80" alt="Vapers" className="w-full h-48 object-cover rounded-2xl ring-1 ring-gray-200 shadow-sm" />
                <img src="https://img.freepik.com/fotos-premium/shisha-cachimba-vidrio-recipiente-metal-sobre-mesa_118086-3034.jpg?semt=ais_hybrid&w=740&q=80" alt="Accesorios" className="w-full h-48 object-cover rounded-2xl ring-1 ring-gray-200 shadow-sm lg:col-span-2" />
              </div>
            </div>
          </div>
        </div>
      </div>


      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Mission Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-20">
          <div className="space-y-6">
            <h2 className="text-4xl font-bold text-gray-800 mb-8">Nuestra Misión</h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              En Resmoke, creemos que cada producto merece una segunda oportunidad. Nuestra misión es crear 
              un marketplace seguro y confiable donde los amantes de la cachimba puedan comprar y vender 
              productos de calidad a precios justos.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed">
              Facilitamos el intercambio responsable de productos, reduciendo el desperdicio y promoviendo 
              una economía circular que beneficia tanto a compradores como vendedores.
            </p>
          </div>
          <div className="bg-white/80 backdrop-blur rounded-2xl shadow-xl p-8 ring-1 ring-gray-200 transition-shadow hover:shadow-2xl">
            <div className="space-y-8">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">Seguridad Garantizada</h3>
                  <p className="text-gray-600">Sistema de verificación y protección para todas las transacciones.</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">Comunidad Activa</h3>
                  <p className="text-gray-600">Miles de usuarios que comparten la pasión por la cachimba.</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">Innovación Constante</h3>
                  <p className="text-gray-600">Mejoramos continuamente la experiencia de usuario.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Cómo Funciona Resmoke */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800">Cómo funciona</h2>
            <p className="text-lg text-gray-600 mt-3">Publica, descubre y compra con confianza</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="group bg-white/80 backdrop-blur rounded-2xl p-8 shadow-sm ring-1 ring-gray-200 transition-all hover:shadow-xl hover:-translate-y-0.5">
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/></svg>
                </div>
                <span className="text-2xl font-bold text-blue-600">01</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Publica tu producto</h3>
              <p className="text-gray-600">Sube fotos, describe el estado y fija un precio competitivo.</p>
            </div>
            <div className="group bg-white/80 backdrop-blur rounded-2xl p-8 shadow-sm ring-1 ring-gray-200 transition-all hover:shadow-xl hover:-translate-y-0.5">
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center">
                  <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                </div>
                <span className="text-2xl font-bold text-indigo-600">02</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Descubre y compara</h3>
              <p className="text-gray-600">Explora productos verificados y encuentra la mejor opción para ti.</p>
            </div>
            <div className="group bg-white/80 backdrop-blur rounded-2xl p-8 shadow-sm ring-1 ring-gray-200 transition-all hover:shadow-xl hover:-translate-y-0.5">
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/></svg>
                </div>
                <span className="text-2xl font-bold text-green-600">03</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Compra de forma segura</h3>
              <p className="text-gray-600">Transacciones protegidas y soporte si lo necesitas.</p>
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-20">
          <h2 className="text-4xl font-bold text-gray-800 text-center mb-16">Nuestros Valores</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center bg-white/80 backdrop-blur rounded-2xl p-8 shadow-sm ring-1 ring-gray-200 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Confianza</h3>
              <p className="text-gray-600 leading-relaxed">
                Construimos relaciones basadas en la transparencia y la honestidad, 
                garantizando transacciones seguras para todos.
              </p>
            </div>
            <div className="text-center bg-white/80 backdrop-blur rounded-2xl p-8 shadow-sm ring-1 ring-gray-200 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Sostenibilidad</h3>
              <p className="text-gray-600 leading-relaxed">
                Promovemos el consumo responsable y la reutilización de productos, 
                contribuyendo a un futuro más sostenible.
              </p>
            </div>
            <div className="text-center bg-white/80 backdrop-blur rounded-2xl p-8 shadow-sm ring-1 ring-gray-200 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Comunidad</h3>
              <p className="text-gray-600 leading-relaxed">
                Fomentamos una comunidad unida de entusiastas de la cachimba, 
                donde todos se sienten bienvenidos y valorados.
              </p>
            </div>
          </div>
        </div>

        {/* Confianza y Seguridad */}
        <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-8 mb-20 ring-1 ring-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              </div>
              <div>
                <div className="font-semibold text-gray-900">Usuarios verificados</div>
                <div className="text-sm text-gray-600">Procesos de verificación y reputación.</div>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/></svg>
              </div>
              <div>
                <div className="font-semibold text-gray-900">Pagos protegidos</div>
                <div className="text-sm text-gray-600">Métodos de pago seguros y soporte.</div>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              </div>
              <div>
                <div className="font-semibold text-gray-900">Soporte dedicado</div>
                <div className="text-sm text-gray-600">Centro de ayuda y asistencia técnica.</div>
              </div>
            </div>
          </div>
        </div>


        {/* CTA Section */}
        <div className="bg-blue-600 rounded-3xl p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-6">¿Listo para formar parte de Resmoke?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Únete a nuestra comunidad y descubre la forma más segura y sostenible 
            de comprar y vender productos de cachimba.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/register" 
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-300"
            >
              Crear Cuenta
            </Link>
            <Link 
              to="/productos" 
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors duration-300"
            >
              Explorar Productos
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;