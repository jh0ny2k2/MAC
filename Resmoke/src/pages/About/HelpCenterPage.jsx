import React, { useMemo, useState } from 'react';
import SEO from '../../components/SEO/SEO';

const HelpCenterPage = () => {
  const [query, setQuery] = useState('');
  const faqItems = useMemo(() => [
    { title: '¿Cómo realizar una compra?', href: '/como-comprar', category: 'Comprar' },
    { title: 'Métodos de pago disponibles', href: '/metodos-pago', category: 'Comprar' },
    { title: '¿Cómo contactar al vendedor?', href: '/contactar-vendedor', category: 'Comprar' },
    { title: 'Política de devoluciones', href: '/politica-devoluciones', category: 'Comprar' },
    { title: '¿Cómo publicar un producto?', href: '/como-publicar', category: 'Vender' },
    { title: 'Consejos para mejores fotos', href: '/consejos-fotos', category: 'Vender' },
    { title: 'Cómo fijar precios competitivos', href: '/fijar-precios', category: 'Vender' },
    { title: 'Gestión de pedidos', href: '/gestion-pedidos', category: 'Vender' },
    { title: 'Crear y verificar cuenta', href: '/crear-cuenta', category: 'Mi Cuenta' },
    { title: 'Cambiar contraseña', href: '/cambiar-password', category: 'Mi Cuenta' },
    { title: 'Actualizar información personal', href: '/actualizar-perfil', category: 'Mi Cuenta' },
    { title: 'Configuración de privacidad', href: '/configuracion-privacidad', category: 'Mi Cuenta' },
    { title: 'Métodos de pago aceptados', href: '/metodos-pago-aceptados', category: 'Pagos y Facturación' },
    { title: '¿Cuándo se procesa el pago?', href: '/cuando-procesa-pago', category: 'Pagos y Facturación' },
    { title: 'Problemas con pagos', href: '/problemas-pagos', category: 'Pagos y Facturación' },
    { title: 'Reembolsos y cancelaciones', href: '/reembolsos-cancelaciones', category: 'Pagos y Facturación' },
    { title: 'Consejos de seguridad', href: '/consejos-seguridad', category: 'Seguridad' },
    { title: 'Reportar actividad sospechosa', href: '/reportar-actividad', category: 'Seguridad' },
    { title: 'Verificación de identidad', href: '/verificacion-identidad', category: 'Seguridad' },
    { title: 'Protección de datos', href: '/proteccion-datos', category: 'Seguridad' },
    { title: 'Contactar soporte', href: '/contactar-soporte', category: 'Soporte Técnico' },
    { title: 'Reportar un problema', href: '/reportar-bug', category: 'Soporte Técnico' },
    { title: 'Estado del sistema', href: '/estado-sistema', category: 'Soporte Técnico' },
    { title: 'Tutoriales y guías', href: '/tutoriales', category: 'Soporte Técnico' }
  ], []);
  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return faqItems.filter(i => i.title.toLowerCase().includes(q) || i.category.toLowerCase().includes(q)).slice(0, 8);
  }, [query, faqItems]);
  const handleSearch = () => {
    if (results.length > 0) window.location.href = results[0].href;
  };
  return (
    <>
      <SEO title="Centro de Ayuda" description="Encuentra respuestas a tus preguntas sobre Resmoke. Guías, tutoriales y soporte para compradores y vendedores." url="/ayuda"/>
      <div className="min-h-screen bg-gray-50">
      {/* Hero Section (split layout) */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            {/* Texto */}
            <div className="lg:col-span-6">
              <span className="inline-block px-4 py-1 mb-4 rounded-full bg-blue-50 ring-1 ring-blue-200 text-sm tracking-wide text-blue-700">Resmoke</span>
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900">
                Centro de Ayuda
              </h1>
              <p className="mt-4 text-lg text-gray-600 max-w-xl">
                Encuentra respuestas a tus preguntas y obtén el soporte que necesitas.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <a href="/contactar-soporte" className="inline-flex items-center px-5 py-3 rounded-xl bg-gray-900 text-white hover:bg-gray-800 transition">
                  Contactar soporte
                </a>
                <a href="/reportar-bug" className="inline-flex items-center px-5 py-3 rounded-xl ring-1 ring-gray-300 text-gray-900 hover:bg-gray-50 transition">
                  Reportar un problema
                </a>
              </div>
              <div className="mt-8 grid grid-cols-3 gap-6 text-center">
                <div className="bg-white/70 backdrop-blur rounded-xl ring-1 ring-gray-200 p-4 shadow-sm">
                  <p className="text-2xl font-bold text-gray-900">24h</p>
                  <p className="text-xs text-gray-500">respuesta</p>
                </div>
                <div className="bg-white/70 backdrop-blur rounded-xl ring-1 ring-gray-200 p-4 shadow-sm">
                  <p className="text-2xl font-bold text-gray-900">+50</p>
                  <p className="text-xs text-gray-500">artículos</p>
                </div>
                <div className="bg-white/70 backdrop-blur rounded-xl ring-1 ring-gray-200 p-4 shadow-sm">
                  <p className="text-2xl font-bold text-gray-900">Comunidad</p>
                  <p className="text-xs text-gray-500">activa</p>
                </div>
              </div>
            </div>
            {/* Imagen */}
            <div className="lg:col-span-6 relative">
              <div className="aspect-[4/3] rounded-2xl  backdrop-blur overflow-hidden">
                <img src="https://cdn-icons-png.flaticon.com/512/4753/4753383.png" alt="Centro de ayuda Resmoke" className="w-full h-full object-contain" />
              </div>
              <div className="absolute -bottom-6 -left-6 hidden lg:block w-32 h-32 bg-white/70 rounded-full blur-xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-12 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">¿En qué podemos ayudarte?</h2>
            <div className="max-w-2xl mx-auto bg-white/80 backdrop-blur ring-1 ring-gray-200 rounded-2xl p-3 flex items-center gap-3 shadow-sm">
              <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M15.5 10.5a5 5 0 11-10 0 5 5 0 0110 0z" />
              </svg>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleSearch(); }}
                placeholder="Busca tu pregunta aquí..."
                className="flex-1 px-2 py-2 text-lg outline-none border border-transparent"
              />
              <button onClick={handleSearch} className="bg-gray-900 text-white px-5 py-2 rounded-xl hover:bg-gray-800 transition">
                Buscar
              </button>
            </div>
            {query && (
              <div className="mt-4 max-w-2xl mx-auto text-left">
                <ul className="divide-y divide-gray-200 bg-white/80 backdrop-blur ring-1 ring-gray-200 rounded-2xl shadow-sm">
                  {results.length === 0 ? (
                    <li className="p-3 text-sm text-gray-500">Sin resultados</li>
                  ) : (
                    results.map((r) => (
                      <li key={r.href} className="p-3 hover:bg-gray-50 transition">
                        <a href={r.href} className="flex justify-between items-center text-blue-600 hover:text-blue-800">
                          <span className="text-sm">{r.title}</span>
                          <span className="text-xs text-gray-500">{r.category}</span>
                        </a>
                      </li>
                    ))
                  )}
                </ul>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* FAQ Categories */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Categorías de Ayuda
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Comprar */}
            <div className="bg-white/80 backdrop-blur rounded-2xl p-6 ring-1 ring-gray-200 shadow-sm hover:shadow-md transition">
              <div className="flex items-center mb-4">
                <svg className="w-8 h-8 text-gray-900 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                <h3 className="text-xl font-semibold text-gray-900">Comprar</h3>
              </div>
              <p className="text-gray-600 mb-4">Todo sobre cómo comprar productos en Resmoke</p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• <a href="/como-comprar" className="text-blue-600 hover:text-blue-800 hover:underline">¿Cómo realizar una compra?</a></li>
                <li>• <a href="/metodos-pago" className="text-blue-600 hover:text-blue-800 hover:underline">Métodos de pago disponibles</a></li>
                <li>• <a href="/contactar-vendedor" className="text-blue-600 hover:text-blue-800 hover:underline">¿Cómo contactar al vendedor?</a></li>
                <li>• <a href="/politica-devoluciones" className="text-blue-600 hover:text-blue-800 hover:underline">Política de devoluciones</a></li>
              </ul>
            </div>

            {/* Vender */}
            <div className="bg-white/80 backdrop-blur rounded-2xl p-6 ring-1 ring-gray-200 shadow-sm hover:shadow-md transition">
              <div className="flex items-center mb-4">
                <svg className="w-8 h-8 text-gray-900 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
                <h3 className="text-xl font-semibold text-gray-900">Vender</h3>
              </div>
              <p className="text-gray-600 mb-4">Guías para vender tus productos exitosamente</p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="/como-publicar" className="text-blue-600 hover:text-blue-800 hover:underline">• ¿Cómo publicar un producto?</a></li>
                <li><a href="/consejos-fotos" className="text-blue-600 hover:text-blue-800 hover:underline">• Consejos para mejores fotos</a></li>
                <li><a href="/fijar-precios" className="text-blue-600 hover:text-blue-800 hover:underline">• Cómo fijar precios competitivos</a></li>
                <li><a href="/gestion-pedidos" className="text-blue-600 hover:text-blue-800 hover:underline">• Gestión de pedidos</a></li>
              </ul>
            </div>

            {/* Cuenta */}
            <div className="bg-white/80 backdrop-blur rounded-2xl p-6 ring-1 ring-gray-200 shadow-sm hover:shadow-md transition">
              <div className="flex items-center mb-4">
                <svg className="w-8 h-8 text-gray-900 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <h3 className="text-xl font-semibold text-gray-900">Mi Cuenta</h3>
              </div>
              <p className="text-gray-600 mb-4">Gestiona tu perfil y configuración</p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="/crear-cuenta" className="text-blue-600 hover:text-blue-800 hover:underline">• Crear y verificar cuenta</a></li>
                <li><a href="/cambiar-password" className="text-blue-600 hover:text-blue-800 hover:underline">• Cambiar contraseña</a></li>
                <li><a href="/actualizar-perfil" className="text-blue-600 hover:text-blue-800 hover:underline">• Actualizar información personal</a></li>
                <li><a href="/configuracion-privacidad" className="text-blue-600 hover:text-blue-800 hover:underline">• Configuración de privacidad</a></li>
              </ul>
            </div>

            {/* Pagos */}
            <div className="bg-white/80 backdrop-blur rounded-2xl p-6 ring-1 ring-gray-200 shadow-sm hover:shadow-md transition">
              <div className="flex items-center mb-4">
                <svg className="w-8 h-8 text-gray-900 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                <h3 className="text-xl font-semibold text-gray-900">Pagos y Facturación</h3>
              </div>
              <p className="text-gray-600 mb-4">Información sobre pagos y transacciones</p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="/metodos-pago-aceptados" className="text-blue-600 hover:text-blue-800 hover:underline">• Métodos de pago aceptados</a></li>
                <li><a href="/cuando-procesa-pago" className="text-blue-600 hover:text-blue-800 hover:underline">• ¿Cuándo se procesa el pago?</a></li>
                <li><a href="/problemas-pagos" className="text-blue-600 hover:text-blue-800 hover:underline">• Problemas con pagos</a></li>
                <li><a href="/reembolsos-cancelaciones" className="text-blue-600 hover:text-blue-800 hover:underline">• Reembolsos y cancelaciones</a></li>
              </ul>
            </div>

            {/* Seguridad */}
            <div className="bg-white/80 backdrop-blur rounded-2xl p-6 ring-1 ring-gray-200 shadow-sm hover:shadow-md transition">
              <div className="flex items-center mb-4">
                <svg className="w-8 h-8 text-gray-900 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <h3 className="text-xl font-semibold text-gray-900">Seguridad</h3>
              </div>
              <p className="text-gray-600 mb-4">Mantén tu cuenta y transacciones seguras</p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="/consejos-seguridad" className="text-blue-600 hover:text-blue-800 hover:underline">• Consejos de seguridad</a></li>
                <li><a href="/reportar-actividad" className="text-blue-600 hover:text-blue-800 hover:underline">• Reportar actividad sospechosa</a></li>
                <li><a href="/verificacion-identidad" className="text-blue-600 hover:text-blue-800 hover:underline">• Verificación de identidad</a></li>
                <li><a href="/proteccion-datos" className="text-blue-600 hover:text-blue-800 hover:underline">• Protección de datos</a></li>
              </ul>
            </div>

            {/* Técnico */}
            <div className="bg-white/80 backdrop-blur rounded-2xl p-6 ring-1 ring-gray-200 shadow-sm hover:shadow-md transition">
              <div className="flex items-center mb-4">
                <svg className="w-8 h-8 text-gray-900 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <h3 className="text-xl font-semibold text-gray-900">Soporte Técnico</h3>
              </div>
              <p className="text-gray-600 mb-4">Soluciona problemas técnicos de la plataforma</p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="/contactar-soporte" className="text-blue-600 hover:text-blue-800 hover:underline">• Contactar soporte</a></li>
                <li><a href="/reportar-bug" className="text-blue-600 hover:text-blue-800 hover:underline">• Reportar un problema</a></li>
                <li><a href="/estado-sistema" className="text-blue-600 hover:text-blue-800 hover:underline">• Estado del sistema</a></li>
                <li><a href="/tutoriales" className="text-blue-600 hover:text-blue-800 hover:underline">• Tutoriales y guías</a></li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            ¿No encuentras lo que buscas?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Nuestro equipo de soporte está aquí para ayudarte. Contáctanos y te responderemos lo antes posible.
          </p>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Email</h3>
              <p className="text-gray-600">info.resmoke@gmail.com</p>
              <p className="text-sm text-gray-500 mt-1">Respuesta en 24h</p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Chat en Vivo</h3>
              <p className="text-gray-600">Lun-Vie 9:00-18:00</p>
              <button 
                onClick={() => {
                  // Verificar si hay usuario logueado antes de navegar
                  const storedUser = localStorage.getItem('user');
                  if (storedUser) {
                    window.location.href = '/chat/3';
                  } else {
                    alert('Debes iniciar sesión para acceder al chat');
                    window.location.href = '/login';
                  }
                }}
                className="mt-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
              >
                Iniciar Chat
              </button>
            </div>
            
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Teléfono</h3>
              <p className="text-gray-600">Soon</p>
              <p className="text-sm text-gray-500 mt-1">Lun-Vie 9:00-18:00</p>
            </div>
          </div>
        </div>
      </section>
    </div>
    </>
  );
};

export default HelpCenterPage;