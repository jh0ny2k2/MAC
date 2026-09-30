import React from 'react';
import SEO from '../../components/SEO/SEO';

const PrivacySettingsPage = () => {
  return (
    <>
      <SEO title="Configuración de Privacidad" description="Controla tu privacidad y protege tu información personal en Resmoke." url="/configuracion-privacidad"/>
      <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6">
              <span className="inline-block px-4 py-1 mb-4 rounded-full bg-purple-50 ring-1 ring-purple-200 text-sm tracking-wide text-purple-700">Privacidad</span>
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900">Configuración de Privacidad</h1>
              <p className="mt-4 text-lg text-gray-600 max-w-xl">Controla tu privacidad y protege tu información personal en ReSmoke</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <a href="#categorias" className="inline-flex items-center px-5 py-3 rounded-xl bg-gray-900 text-white hover:bg-gray-800 transition">Ver categorías</a>
                <a href="#visibilidad" className="inline-flex items-center px-5 py-3 rounded-xl ring-1 ring-gray-300 text-gray-900 hover:bg-gray-50 transition">Ajustes de visibilidad</a>
              </div>
              <div className="mt-8 grid grid-cols-3 gap-6 text-center">
                <div className="bg-white/70 backdrop-blur rounded-xl ring-1 ring-gray-200 p-4 shadow-sm">
                  <p className="text-2xl font-bold text-gray-900">Control</p>
                  <p className="text-xs text-gray-500">total</p>
                </div>
                <div className="bg-white/70 backdrop-blur rounded-xl ring-1 ring-gray-200 p-4 shadow-sm">
                  <p className="text-2xl font-bold text-gray-900">Protección</p>
                  <p className="text-xs text-gray-500">avanzada</p>
                </div>
                <div className="bg-white/70 backdrop-blur rounded-xl ring-1 ring-gray-200 p-4 shadow-sm">
                  <p className="text-2xl font-bold text-gray-900">Ajustes</p>
                  <p className="text-xs text-gray-500">rápidos</p>
                </div>
              </div>
            </div>
            <div className="lg:col-span-6 relative">
              <div className="aspect-[4/3] rounded-2xl backdrop-blur overflow-hidden">
                <img src="https://cdn-icons-png.flaticon.com/512/726/726476.png" alt="Privacidad y controles" className="w-full h-full object-contain" />
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
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Tu Privacidad es Nuestra Prioridad</h2>
            <p className="text-lg text-gray-600">
              En ReSmoke, tienes control total sobre qué información compartes y con quién. 
              Configura tu privacidad según tus preferencias y necesidades.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 mt-12">
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Control total</h3>
              <p className="text-gray-600">Decides qué información es visible</p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Protección avanzada</h3>
              <p className="text-gray-600">Múltiples capas de seguridad</p>
            </div>
            
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Configuración fácil</h3>
              <p className="text-gray-600">Ajustes simples e intuitivos</p>
            </div>
          </div>
        </div>
      </section>

      {/* Privacy Categories */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 id="categorias" className="text-3xl font-bold text-gray-900 text-center mb-12">Categorías de Privacidad</h2>
          
          <div className="space-y-8">
            {/* Profile Visibility */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <div className="flex items-start">
                <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 id="visibilidad" className="text-xl font-bold text-gray-900 mb-3">Visibilidad del Perfil</h3>
                  <p className="text-gray-700 mb-4">
                    Controla qué información de tu perfil pueden ver otros usuarios de la plataforma.
                  </p>
                  
                  <div className="space-y-4">
                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="font-semibold text-gray-900">Nombre completo</h4>
                        <select className="border border-gray-300 rounded px-3 py-1 text-sm">
                          <option value="public">Público</option>
                          <option value="initial" selected>Solo inicial</option>
                          <option value="private">Privado</option>
                        </select>
                      </div>
                      <p className="text-sm text-gray-600">
                        <strong>Público:</strong> Juan Pérez | <strong>Solo inicial:</strong> Juan P. | <strong>Privado:</strong> Oculto
                      </p>
                    </div>
                    
                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="font-semibold text-gray-900">Ubicación</h4>
                        <select className="border border-gray-300 rounded px-3 py-1 text-sm">
                          <option value="full" selected>Ciudad completa</option>
                          <option value="province">Solo provincia</option>
                          <option value="hidden">Oculta</option>
                        </select>
                      </div>
                      <p className="text-sm text-gray-600">
                        <strong>Ciudad completa:</strong> Madrid, España | <strong>Solo provincia:</strong> Madrid | <strong>Oculta:</strong> No visible
                      </p>
                    </div>
                    
                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="font-semibold text-gray-900">Fecha de registro</h4>
                        <select className="border border-gray-300 rounded px-3 py-1 text-sm">
                          <option value="exact" selected>Fecha exacta</option>
                          <option value="month">Solo mes y año</option>
                          <option value="year">Solo año</option>
                          <option value="hidden">Oculta</option>
                        </select>
                      </div>
                      <p className="text-sm text-gray-600">
                        Controla qué tan específica es la información sobre cuándo te uniste a ReSmoke.
                      </p>
                    </div>
                    
                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="font-semibold text-gray-900">Última conexión</h4>
                        <select className="border border-gray-300 rounded px-3 py-1 text-sm">
                          <option value="exact">Hora exacta</option>
                          <option value="approximate" selected>Aproximada</option>
                          <option value="hidden">Oculta</option>
                        </select>
                      </div>
                      <p className="text-sm text-gray-600">
                        <strong>Exacta:</strong> Hace 5 minutos | <strong>Aproximada:</strong> Activo hoy | <strong>Oculta:</strong> No visible
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <div className="flex items-start">
                <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Información de Contacto</h3>
                  <p className="text-gray-700 mb-4">
                    Decide quién puede ver y usar tu información de contacto para comunicarse contigo.
                  </p>
                  
                  <div className="space-y-4">
                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="font-semibold text-gray-900">Dirección de email</h4>
                        <select className="border border-gray-300 rounded px-3 py-1 text-sm">
                          <option value="public">Público</option>
                          <option value="buyers" selected>Solo compradores activos</option>
                          <option value="verified">Solo usuarios verificados</option>
                          <option value="private">Privado</option>
                        </select>
                      </div>
                      <p className="text-sm text-gray-600">
                        Recomendamos "Solo compradores activos" para equilibrar privacidad y funcionalidad.
                      </p>
                    </div>
                    
                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="font-semibold text-gray-900">Número de teléfono</h4>
                        <select className="border border-gray-300 rounded px-3 py-1 text-sm">
                          <option value="public">Público</option>
                          <option value="buyers">Solo compradores activos</option>
                          <option value="verified" selected>Solo usuarios verificados</option>
                          <option value="private">Privado</option>
                        </select>
                      </div>
                      <p className="text-sm text-gray-600">
                        Tu teléfono es información sensible. Recomendamos limitarlo a usuarios verificados.
                      </p>
                    </div>
                    
                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="font-semibold text-gray-900">Redes sociales</h4>
                        <select className="border border-gray-300 rounded px-3 py-1 text-sm">
                          <option value="public" selected>Público</option>
                          <option value="buyers">Solo compradores activos</option>
                          <option value="private">Privado</option>
                        </select>
                      </div>
                      <p className="text-sm text-gray-600">
                        Enlaces a tus perfiles de redes sociales pueden ayudar a generar confianza.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Activity and Statistics */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <div className="flex items-start">
                <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Actividad y Estadísticas</h3>
                  <p className="text-gray-700 mb-4">
                    Controla qué información sobre tu actividad en la plataforma es visible para otros.
                  </p>
                  
                  <div className="space-y-4">
                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="font-semibold text-gray-900">Productos vendidos</h4>
                        <select className="border border-gray-300 rounded px-3 py-1 text-sm">
                          <option value="exact" selected>Número exacto</option>
                          <option value="range">Rango aproximado</option>
                          <option value="hidden">Oculto</option>
                        </select>
                      </div>
                      <p className="text-sm text-gray-600">
                        <strong>Exacto:</strong> 47 productos | <strong>Rango:</strong> 40-50 productos | <strong>Oculto:</strong> No visible
                      </p>
                    </div>
                    
                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="font-semibold text-gray-900">Historial de compras</h4>
                        <select className="border border-gray-300 rounded px-3 py-1 text-sm">
                          <option value="public">Público</option>
                          <option value="summary" selected>Solo resumen</option>
                          <option value="private">Privado</option>
                        </select>
                      </div>
                      <p className="text-sm text-gray-600">
                        <strong>Público:</strong> Lista completa | <strong>Resumen:</strong> Solo categorías | <strong>Privado:</strong> Oculto
                      </p>
                    </div>
                    
                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="font-semibold text-gray-900">Valoraciones recibidas</h4>
                        <select className="border border-gray-300 rounded px-3 py-1 text-sm">
                          <option value="all" selected>Todas las valoraciones</option>
                          <option value="positive">Solo positivas</option>
                          <option value="summary">Solo promedio</option>
                          <option value="hidden">Ocultas</option>
                        </select>
                      </div>
                      <p className="text-sm text-gray-600">
                        Las valoraciones ayudan a generar confianza. Recomendamos mostrar todas.
                      </p>
                    </div>
                    
                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="font-semibold text-gray-900">Tiempo de respuesta</h4>
                        <select className="border border-gray-300 rounded px-3 py-1 text-sm">
                          <option value="exact" selected>Tiempo exacto</option>
                          <option value="range">Rango aproximado</option>
                          <option value="hidden">Oculto</option>
                        </select>
                      </div>
                      <p className="text-sm text-gray-600">
                        <strong>Exacto:</strong> 2 horas | <strong>Rango:</strong> Menos de 4 horas | <strong>Oculto:</strong> No visible
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Search and Discovery */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <div className="flex items-start">
                <div className="bg-yellow-100 w-12 h-12 rounded-full flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Búsqueda y Descubrimiento</h3>
                  <p className="text-gray-700 mb-4">
                    Configura cómo otros usuarios pueden encontrarte y descubrir tu perfil en la plataforma.
                  </p>
                  
                  <div className="space-y-4">
                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="font-semibold text-gray-900">Aparecer en búsquedas</h4>
                        <label className="flex items-center">
                          <input type="checkbox" className="mr-2" defaultChecked />
                          <span className="text-sm">Permitir que me encuentren</span>
                        </label>
                      </div>
                      <p className="text-sm text-gray-600">
                        Si desactivas esto, tu perfil no aparecerá en los resultados de búsqueda de usuarios.
                      </p>
                    </div>
                    
                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="font-semibold text-gray-900">Sugerencias de perfil</h4>
                        <label className="flex items-center">
                          <input type="checkbox" className="mr-2" defaultChecked />
                          <span className="text-sm">Aparecer en sugerencias</span>
                        </label>
                      </div>
                      <p className="text-sm text-gray-600">
                        Permite que tu perfil aparezca como sugerencia para otros usuarios con intereses similares.
                      </p>
                    </div>
                    
                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="font-semibold text-gray-900">Indexación en buscadores</h4>
                        <label className="flex items-center">
                          <input type="checkbox" className="mr-2" />
                          <span className="text-sm">Permitir indexación externa</span>
                        </label>
                      </div>
                      <p className="text-sm text-gray-600">
                        Si activas esto, tu perfil público podría aparecer en resultados de Google y otros buscadores.
                      </p>
                    </div>
                    
                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="font-semibold text-gray-900">Búsqueda por ubicación</h4>
                        <select className="border border-gray-300 rounded px-3 py-1 text-sm">
                          <option value="exact" selected>Ubicación exacta</option>
                          <option value="approximate">Ubicación aproximada</option>
                          <option value="disabled">Deshabilitada</option>
                        </select>
                      </div>
                      <p className="text-sm text-gray-600">
                        Controla si otros usuarios pueden encontrarte buscando por ubicación geográfica.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Communication Settings */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Configuración de Comunicación</h2>
          
          <div className="bg-gray-50 rounded-lg p-8">
            <div className="text-center mb-8">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Controla Quién Puede Contactarte</h3>
              <p className="text-lg text-gray-600">
                Establece reglas sobre quién puede enviarte mensajes y cómo pueden hacerlo.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="bg-white rounded-lg p-6 border border-gray-200">
                  <h4 className="text-lg font-bold text-gray-900 mb-4">Mensajes directos</h4>
                  
                  <div className="space-y-3">
                    <label className="flex items-center">
                      <input type="radio" name="messages" className="mr-3" defaultChecked />
                      <div>
                        <span className="font-medium text-gray-900">Cualquier usuario</span>
                        <p className="text-sm text-gray-600">Todos pueden enviarte mensajes</p>
                      </div>
                    </label>
                    
                    <label className="flex items-center">
                      <input type="radio" name="messages" className="mr-3" />
                      <div>
                        <span className="font-medium text-gray-900">Solo usuarios verificados</span>
                        <p className="text-sm text-gray-600">Requiere verificación de identidad</p>
                      </div>
                    </label>
                    
                    <label className="flex items-center">
                      <input type="radio" name="messages" className="mr-3" />
                      <div>
                        <span className="font-medium text-gray-900">Solo compradores activos</span>
                        <p className="text-sm text-gray-600">Usuarios interesados en tus productos</p>
                      </div>
                    </label>
                    
                    <label className="flex items-center">
                      <input type="radio" name="messages" className="mr-3" />
                      <div>
                        <span className="font-medium text-gray-900">Nadie</span>
                        <p className="text-sm text-gray-600">Desactivar mensajes directos</p>
                      </div>
                    </label>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg p-6 border border-gray-200">
                  <h4 className="text-lg font-bold text-gray-900 mb-4">Filtros automáticos</h4>
                  
                  <div className="space-y-3">
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-3" defaultChecked />
                      <span className="text-gray-900">Bloquear spam automáticamente</span>
                    </label>
                    
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-3" defaultChecked />
                      <span className="text-gray-900">Filtrar mensajes con enlaces externos</span>
                    </label>
                    
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-3" />
                      <span className="text-gray-900">Requerir mensaje personalizado</span>
                    </label>
                    
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-3" />
                      <span className="text-gray-900">Limitar mensajes por día (máx. 10)</span>
                    </label>
                  </div>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="bg-white rounded-lg p-6 border border-gray-200">
                  <h4 className="text-lg font-bold text-gray-900 mb-4">Notificaciones</h4>
                  
                  <div className="space-y-3">
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-3" defaultChecked />
                      <span className="text-gray-900">Notificar nuevos mensajes</span>
                    </label>
                    
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-3" defaultChecked />
                      <span className="text-gray-900">Notificar por email</span>
                    </label>
                    
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-3" />
                      <span className="text-gray-900">Notificar por SMS</span>
                    </label>
                    
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-3" defaultChecked />
                      <span className="text-gray-900">Mostrar vista previa del mensaje</span>
                    </label>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg p-6 border border-gray-200">
                  <h4 className="text-lg font-bold text-gray-900 mb-4">Horarios de contacto</h4>
                  
                  <div className="space-y-3">
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-3" />
                      <span className="text-gray-900">Establecer horarios preferidos</span>
                    </label>
                    
                    <div className="ml-6 space-y-2 text-sm text-gray-600">
                      <div className="flex items-center justify-between">
                        <span>Lunes a Viernes:</span>
                        <div className="flex space-x-2">
                          <select className="border border-gray-300 rounded px-2 py-1 text-xs">
                            <option>09:00</option>
                            <option>10:00</option>
                            <option>11:00</option>
                          </select>
                          <span>-</span>
                          <select className="border border-gray-300 rounded px-2 py-1 text-xs">
                            <option>18:00</option>
                            <option>19:00</option>
                            <option>20:00</option>
                          </select>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span>Fines de semana:</span>
                        <div className="flex space-x-2">
                          <select className="border border-gray-300 rounded px-2 py-1 text-xs">
                            <option>10:00</option>
                            <option>11:00</option>
                            <option>12:00</option>
                          </select>
                          <span>-</span>
                          <select className="border border-gray-300 rounded px-2 py-1 text-xs">
                            <option>16:00</option>
                            <option>17:00</option>
                            <option>18:00</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Data Management */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Gestión de Datos</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <div className="text-center mb-6">
                <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Exportar mis Datos</h3>
                <p className="text-gray-600 mb-4">
                  Descarga una copia completa de toda tu información personal y actividad en ReSmoke.
                </p>
              </div>
              
              <div className="space-y-4">
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Qué incluye la exportación:</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Información del perfil completa</li>
                    <li>• Historial de productos y transacciones</li>
                    <li>• Mensajes y conversaciones</li>
                    <li>• Valoraciones y comentarios</li>
                    <li>• Configuraciones de privacidad</li>
                    <li>• Registros de actividad</li>
                  </ul>
                </div>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-800 mb-2">📋 Proceso de exportación:</h4>
                  <ol className="text-sm text-blue-700 space-y-1">
                    <li>1. Solicita la exportación</li>
                    <li>2. Verificamos tu identidad</li>
                    <li>3. Preparamos tus datos (24-48h)</li>
                    <li>4. Te enviamos el enlace de descarga</li>
                    <li>5. Enlace válido por 7 días</li>
                  </ol>
                </div>
                
                <button className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors font-semibold">
                  Solicitar Exportación
                </button>
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <div className="text-center mb-6">
                <div className="bg-red-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Eliminar mi Cuenta</h3>
                <p className="text-gray-600 mb-4">
                  Elimina permanentemente tu cuenta y todos los datos asociados de ReSmoke.
                </p>
              </div>
              
              <div className="space-y-4">
                <div className="border border-red-200 rounded-lg p-4 bg-red-50">
                  <h4 className="font-semibold text-red-900 mb-2">⚠️ Antes de eliminar tu cuenta:</h4>
                  <ul className="text-sm text-red-700 space-y-1">
                    <li>• Completa todas las transacciones pendientes</li>
                    <li>• Retira cualquier saldo disponible</li>
                    <li>• Descarga tus datos si los necesitas</li>
                    <li>• Cancela productos activos en venta</li>
                    <li>• Notifica a compradores/vendedores activos</li>
                  </ul>
                </div>
                
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Qué sucede al eliminar:</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Se elimina toda tu información personal</li>
                    <li>• Tus productos se retiran de la venta</li>
                    <li>• Las conversaciones se anonimizan</li>
                    <li>• Las valoraciones permanecen anónimas</li>
                    <li>• No podrás recuperar la cuenta</li>
                  </ul>
                </div>
                
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h4 className="font-semibold text-yellow-800 mb-2">🔄 Alternativa: Desactivar temporalmente</h4>
                  <p className="text-sm text-yellow-700">
                    Puedes desactivar tu cuenta temporalmente si solo necesitas un descanso. 
                    Esto oculta tu perfil pero conserva tus datos para reactivación futura.
                  </p>
                </div>
                
                <div className="flex space-x-3">
                  <button className="flex-1 bg-yellow-600 text-white py-3 px-4 rounded-lg hover:bg-yellow-700 transition-colors font-semibold">
                    Desactivar Temporalmente
                  </button>
                  <button className="flex-1 bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 transition-colors font-semibold">
                    Eliminar Permanentemente
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Settings */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Configuración Rápida</h2>
          
          <div className="bg-gray-50 rounded-lg p-8">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Perfiles de Privacidad Predefinidos</h3>
              <p className="text-lg text-gray-600">
                Aplica configuraciones de privacidad predefinidas según tu nivel de comodidad.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg p-6 border border-gray-200 hover:border-green-300 transition-colors cursor-pointer">
                <div className="text-center mb-4">
                  <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h4 className="text-lg font-bold text-gray-900 mb-2">Público</h4>
                  <p className="text-sm text-gray-600 mb-4">
                    Máxima visibilidad para generar más oportunidades de negocio.
                  </p>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-700">Perfil completo:</span>
                    <span className="text-green-600 font-medium">Visible</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">Contacto:</span>
                    <span className="text-green-600 font-medium">Público</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">Actividad:</span>
                    <span className="text-green-600 font-medium">Completa</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">Búsquedas:</span>
                    <span className="text-green-600 font-medium">Habilitadas</span>
                  </div>
                </div>
                
                <button className="w-full mt-4 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors font-medium">
                  Aplicar Configuración
                </button>
              </div>
              
              <div className="bg-white rounded-lg p-6 border border-gray-200 hover:border-yellow-300 transition-colors cursor-pointer">
                <div className="text-center mb-4">
                  <div className="bg-yellow-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <h4 className="text-lg font-bold text-gray-900 mb-2">Equilibrado</h4>
                  <p className="text-sm text-gray-600 mb-4">
                    Balance perfecto entre privacidad y funcionalidad.
                  </p>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-700">Perfil completo:</span>
                    <span className="text-yellow-600 font-medium">Parcial</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">Contacto:</span>
                    <span className="text-yellow-600 font-medium">Limitado</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">Actividad:</span>
                    <span className="text-yellow-600 font-medium">Resumen</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">Búsquedas:</span>
                    <span className="text-yellow-600 font-medium">Selectivas</span>
                  </div>
                </div>
                
                <button className="w-full mt-4 bg-yellow-600 text-white py-2 px-4 rounded-lg hover:bg-yellow-700 transition-colors font-medium">
                  Aplicar Configuración
                </button>
              </div>
              
              <div className="bg-white rounded-lg p-6 border border-gray-200 hover:border-red-300 transition-colors cursor-pointer">
                <div className="text-center mb-4">
                  <div className="bg-red-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <h4 className="text-lg font-bold text-gray-900 mb-2">Privado</h4>
                  <p className="text-sm text-gray-600 mb-4">
                    Máxima privacidad con funcionalidad mínima esencial.
                  </p>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-700">Perfil completo:</span>
                    <span className="text-red-600 font-medium">Mínimo</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">Contacto:</span>
                    <span className="text-red-600 font-medium">Privado</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">Actividad:</span>
                    <span className="text-red-600 font-medium">Oculta</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">Búsquedas:</span>
                    <span className="text-red-600 font-medium">Deshabilitadas</span>
                  </div>
                </div>
                
                <button className="w-full mt-4 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors font-medium">
                  Aplicar Configuración
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Support Section */}
      <section className="py-16 bg-purple-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">
            ¿Necesitas Ayuda con tu Privacidad?
          </h2>
          <p className="text-lg text-purple-100 mb-8">
            Nuestro equipo de privacidad está aquí para ayudarte a configurar tu cuenta de manera segura y proteger tu información personal.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-purple-600 px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors font-semibold">
              Contactar Especialista en Privacidad
            </button>
            <button className="bg-purple-700 text-white border border-purple-500 px-6 py-3 rounded-lg hover:bg-purple-800 transition-colors">
              Ver Política de Privacidad
            </button>
          </div>
          
          <div className="mt-8 grid md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="bg-purple-500 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="font-semibold mb-1">Email</h3>
              <p className="text-sm text-purple-100">privacidad@resmoke.com</p>
            </div>
            
            <div>
              <div className="bg-purple-500 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="font-semibold mb-1">Chat especializado</h3>
              <p className="text-sm text-purple-100">Lun-Vie 9:00-18:00</p>
            </div>
            
            <div>
              <div className="bg-purple-500 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="font-semibold mb-1">Guías de privacidad</h3>
              <p className="text-sm text-purple-100">Centro de ayuda</p>
            </div>
          </div>
        </div>
      </section>
    </div>
    </>
  );
};

export default PrivacySettingsPage;