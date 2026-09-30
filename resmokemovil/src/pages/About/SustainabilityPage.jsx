import React from 'react';
import { Link } from 'react-router-dom';
import SEO from '../../components/SEO/SEO';

const SustainabilityPage = () => {
  return (
    <>
      <SEO title="Sostenibilidad" description="Comprometidos con un futuro más verde a través de la economía circular y el consumo responsable en Resmoke." url="/sostenibilidad"/>
      <div className="min-h-screen bg-gray-50">
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6">
              <span className="inline-block px-4 py-1 mb-4 rounded-full bg-green-50 ring-1 ring-green-200 text-sm tracking-wide text-green-700">Resmoke</span>
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900">Sostenibilidad</h1>
              <p className="mt-4 text-lg text-gray-600 max-w-xl">Comprometidos con un futuro más verde a través de la economía circular y el consumo responsable.</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <a href="#iniciativas" className="inline-flex items-center px-5 py-3 rounded-xl bg-gray-900 text-white hover:bg-gray-800 transition">Ver iniciativas</a>
                <a href="#impacto" className="inline-flex items-center px-5 py-3 rounded-xl ring-1 ring-gray-300 text-gray-900 hover:bg-gray-50 transition">Nuestro impacto</a>
              </div>
              <div className="mt-8 grid grid-cols-3 gap-6 text-center">
                <div className="bg-white/70 backdrop-blur rounded-xl ring-1 ring-gray-200 p-4 shadow-sm">
                  <p className="text-2xl font-bold text-gray-900">5k+</p>
                  <p className="text-xs text-gray-500">productos</p>
                </div>
                <div className="bg-white/70 backdrop-blur rounded-xl ring-1 ring-gray-200 p-4 shadow-sm">
                  <p className="text-2xl font-bold text-gray-900">2.5t</p>
                  <p className="text-xs text-gray-500">CO₂</p>
                </div>
                <div className="bg-white/70 backdrop-blur rounded-xl ring-1 ring-gray-200 p-4 shadow-sm">
                  <p className="text-2xl font-bold text-gray-900">Comunidad</p>
                  <p className="text-xs text-gray-500">activa</p>
                </div>
              </div>
            </div>
            <div className="lg:col-span-6 relative">
              <div className="aspect-[4/3] rounded-2xl backdrop-blur overflow-hidden">
                <img src="https://cdn-icons-png.flaticon.com/512/4299/4299188.png" alt="Compromiso ambiental Resmoke" className="w-full h-full object-contain" />
              </div>
              <div className="absolute -bottom-6 -left-6 hidden lg:block w-32 h-32 bg-white/70 rounded-full blur-xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-8">
                Nuestra Misión Ambiental
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                En Resmoke creemos que cada producto merece una segunda oportunidad. Nuestra plataforma no solo conecta compradores y vendedores, sino que contribuye activamente a reducir el desperdicio y promover un consumo más consciente.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                Al dar nueva vida a productos de cachimba usados, estamos construyendo un ecosistema donde la sostenibilidad y la pasión por la cachimba van de la mano.
              </p>
            </div>
            <div className="bg-white/80 backdrop-blur rounded-2xl ring-1 ring-gray-200 p-8 shadow-sm">
              <div className="text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Economía Circular</h3>
                <p className="text-gray-600">
                  Promovemos la reutilización y el intercambio responsable de productos, reduciendo la necesidad de fabricación nueva.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Stats */}
      <section id="impacto" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Nuestro Impacto Ambiental
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Cada transacción en Resmoke contribuye a un futuro más sostenible
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-8 bg-white/80 backdrop-blur rounded-2xl ring-1 ring-gray-200 shadow-sm">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                </svg>
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">5,000+</h3>
              <p className="text-gray-700 font-medium">Productos reutilizados</p>
              <p className="text-sm text-gray-600 mt-2">Evitando que terminen en vertederos</p>
            </div>
            
            <div className="text-center p-8 bg-white/80 backdrop-blur rounded-2xl ring-1 ring-gray-200 shadow-sm">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">2.5 Ton</h3>
              <p className="text-gray-700 font-medium">CO₂ ahorrado</p>
              <p className="text-sm text-gray-600 mt-2">Equivalente a plantar 30 árboles</p>
            </div>
            
            <div className="text-center p-8 bg-white/80 backdrop-blur rounded-2xl ring-1 ring-gray-200 shadow-sm">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">1,200+</h3>
              <p className="text-gray-700 font-medium">Usuarios conscientes</p>
              <p className="text-sm text-gray-600 mt-2">Comprometidos con la sostenibilidad</p>
            </div>
          </div>
        </div>
      </section>

      {/* Initiatives */}
      <section id="iniciativas" className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Nuestras Iniciativas
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Acciones concretas para un impacto positivo en el medio ambiente
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white/80 backdrop-blur rounded-2xl ring-1 ring-gray-200 p-8 shadow-sm hover:shadow-md transition">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Programa de Reciclaje</h3>
              <p className="text-gray-600">
                Facilitamos el reciclaje responsable de productos que ya no pueden ser reutilizados, colaborando con centros especializados.
              </p>
            </div>
            
            <div className="bg-white/80 backdrop-blur rounded-2xl ring-1 ring-gray-200 p-8 shadow-sm hover:shadow-md transition">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Certificación Verde</h3>
              <p className="text-gray-600">
                Reconocemos a vendedores comprometidos con prácticas sostenibles mediante nuestro sistema de certificación ambiental.
              </p>
            </div>
            
            <div className="bg-white/80 backdrop-blur rounded-2xl ring-1 ring-gray-200 p-8 shadow-sm hover:shadow-md transition">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Educación Ambiental</h3>
              <p className="text-gray-600">
                Promovemos la conciencia ambiental a través de contenido educativo sobre consumo responsable y sostenibilidad.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Future Goals */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Objetivos 2025
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Nuestro compromiso con un futuro más sostenible
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Neutralidad de Carbono</h3>
                  <p className="text-gray-600">Alcanzar la neutralidad de carbono en todas nuestras operaciones para 2025.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">10,000 Productos Salvados</h3>
                  <p className="text-gray-600">Evitar que 10,000 productos terminen en vertederos a través de nuestra plataforma.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Alianzas Verdes</h3>
                  <p className="text-gray-600">Establecer partnerships con organizaciones ambientales y centros de reciclaje.</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white/80 backdrop-blur rounded-2xl ring-1 ring-gray-200 p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Únete al Cambio</h3>
              <p className="text-gray-600 text-center mb-8">
                Cada compra y venta en Resmoke es un paso hacia un futuro más sostenible. Sé parte del cambio.
              </p>
              <div className="text-center">
                <Link 
                  to="/register" 
                  className="inline-block bg-gray-900 hover:bg-gray-800 text-white font-bold py-3 px-8 rounded-xl transition"
                >
                  Comenzar Ahora
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
    </>
  );
};

export default SustainabilityPage;