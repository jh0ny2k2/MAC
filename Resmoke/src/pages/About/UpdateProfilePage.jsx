import React from 'react';
import SEO from '../../components/SEO/SEO';

const UpdateProfilePage = () => {
  return (
    <>
      <SEO title="Actualizar Perfil" description="Mantén tu perfil actualizado para una mejor experiencia en Resmoke." url="/actualizar-perfil"/>
      <div className="min-h-screen bg-gray-50">
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6">
              <span className="inline-block px-4 py-1 mb-4 rounded-full bg-blue-50 ring-1 ring-blue-200 text-sm tracking-wide text-blue-700">Mi Cuenta</span>
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900">Actualizar Información Personal</h1>
              <p className="mt-4 text-lg text-gray-600 max-w-xl">Mantén tu perfil actualizado para una mejor experiencia en Resmoke.</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <a href="#secciones" className="inline-flex items-center px-5 py-3 rounded-xl bg-gray-900 text-white hover:bg-gray-800 transition">Ver secciones</a>
                <a href="#guia" className="inline-flex items-center px-5 py-3 rounded-xl ring-1 ring-gray-300 text-gray-900 hover:bg-gray-50 transition">Guía paso a paso</a>
              </div>
              <div className="mt-8 grid grid-cols-3 gap-6 text-center">
                <div className="bg-white/70 backdrop-blur rounded-xl ring-1 ring-gray-200 p-4 shadow-sm">
                  <p className="text-2xl font-bold text-gray-900">Completo</p>
                  <p className="text-xs text-gray-500">perfil</p>
                </div>
                <div className="bg-white/70 backdrop-blur rounded-xl ring-1 ring-gray-200 p-4 shadow-sm">
                  <p className="text-2xl font-bold text-gray-900">Verificado</p>
                  <p className="text-xs text-gray-500">email</p>
                </div>
                <div className="bg-white/70 backdrop-blur rounded-xl ring-1 ring-gray-200 p-4 shadow-sm">
                  <p className="text-2xl font-bold text-gray-900">Visible</p>
                  <p className="text-xs text-gray-500">búsquedas</p>
                </div>
              </div>
            </div>
            <div className="lg:col-span-6 relative">
              <div className="aspect-[4/3] rounded-2xl backdrop-blur overflow-hidden">
                <img src="https://cdn-icons-png.flaticon.com/512/7269/7269870.png" alt="Actualizar perfil" className="w-full h-full object-contain" />
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
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Tu Perfil, Tu Identidad</h2>
            <p className="text-lg text-gray-600">
              Un perfil completo y actualizado genera más confianza entre los usuarios 
              y mejora tus oportunidades de compra y venta.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 mt-12">
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Mayor confianza</h3>
              <p className="text-gray-600">Los perfiles completos generan más confianza</p>
            </div>
            
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Mejor visibilidad</h3>
              <p className="text-gray-600">Apareces más en los resultados de búsqueda</p>
            </div>
            
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Comunicación fluida</h3>
              <p className="text-gray-600">Facilita el contacto con otros usuarios</p>
            </div>
          </div>
        </div>
      </section>

      {/* Profile Sections */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Secciones de tu Perfil</h2>
          
          <div className="space-y-8">
            {/* Basic Information */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <div className="flex items-start">
                <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Información Básica</h3>
                  <p className="text-gray-700 mb-4">
                    Los datos fundamentales que identifican tu cuenta y facilitan la comunicación.
                  </p>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Campos editables:</h4>
                      <ul className="text-sm text-gray-700 space-y-1">
                        <li>• <strong>Nombre de usuario:</strong> Tu identificador único</li>
                        <li>• <strong>Nombre completo:</strong> Tu nombre real</li>
                        <li>• <strong>Email:</strong> Dirección de contacto principal</li>
                        <li>• <strong>Teléfono:</strong> Número de contacto (opcional)</li>
                        <li>• <strong>Fecha de nacimiento:</strong> Para verificación de edad</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Consideraciones importantes:</h4>
                      <ul className="text-sm text-gray-700 space-y-1">
                        <li>• El nombre de usuario debe ser único</li>
                        <li>• El email debe estar verificado</li>
                        <li>• Algunos cambios requieren verificación</li>
                        <li>• La fecha de nacimiento no se puede cambiar</li>
                        <li>• Usa información real y actualizada</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Photo */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <div className="flex items-start">
                <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Foto de Perfil</h3>
                  <p className="text-gray-700 mb-4">
                    Una buena foto de perfil es clave para generar confianza y hacer que tu perfil sea más atractivo.
                  </p>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-green-800 mb-3">✅ Características de una buena foto:</h4>
                      <ul className="text-sm text-green-700 space-y-1">
                        <li>• <strong>Cara claramente visible:</strong> Sin gafas de sol</li>
                        <li>• <strong>Buena iluminación:</strong> Luz natural preferible</li>
                        <li>• <strong>Fondo neutro:</strong> Sin distracciones</li>
                        <li>• <strong>Sonrisa natural:</strong> Transmite confianza</li>
                        <li>• <strong>Foto reciente:</strong> Máximo 2 años</li>
                        <li>• <strong>Alta resolución:</strong> Mínimo 400x400 píxeles</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-red-800 mb-3">❌ Evita estas fotos:</h4>
                      <ul className="text-sm text-red-700 space-y-1">
                        <li>• Fotos de grupo o con otras personas</li>
                        <li>• Imágenes borrosas o de baja calidad</li>
                        <li>• Fotos con filtros excesivos</li>
                        <li>• Logos, dibujos o imágenes no personales</li>
                        <li>• Fotos donde no se ve tu cara</li>
                        <li>• Contenido inapropiado o ofensivo</li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="font-semibold text-blue-800 mb-2">📸 Consejos para la foto perfecta:</h4>
                    <p className="text-sm text-blue-700">
                      Toma la foto durante el día cerca de una ventana, mira directamente a la cámara, 
                      mantén una expresión amigable y asegúrate de que tu cara ocupe al menos el 60% del encuadre.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Location Information */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <div className="flex items-start">
                <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Ubicación</h3>
                  <p className="text-gray-700 mb-4">
                    Tu ubicación ayuda a otros usuarios a encontrar productos cerca y facilita las transacciones locales.
                  </p>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Información de ubicación:</h4>
                      <ul className="text-sm text-gray-700 space-y-1">
                        <li>• <strong>País:</strong> Selecciona tu país de residencia</li>
                        <li>• <strong>Provincia/Estado:</strong> Tu región administrativa</li>
                        <li>• <strong>Ciudad:</strong> Tu ciudad principal</li>
                        <li>• <strong>Código postal:</strong> Para búsquedas locales</li>
                        <li>• <strong>Dirección:</strong> Solo para envíos (privada)</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Privacidad y seguridad:</h4>
                      <ul className="text-sm text-gray-700 space-y-1">
                        <li>• Solo se muestra ciudad y provincia públicamente</li>
                        <li>• La dirección exacta es privada</li>
                        <li>• Puedes ocultar tu ubicación si prefieres</li>
                        <li>• Útil para filtrar productos por proximidad</li>
                        <li>• Facilita encuentros seguros en persona</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bio and Description */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <div className="flex items-start">
                <div className="bg-yellow-100 w-12 h-12 rounded-full flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Biografía y Descripción</h3>
                  <p className="text-gray-700 mb-4">
                    Una biografía bien escrita te ayuda a conectar con otros usuarios y mostrar tu personalidad.
                  </p>
                  
                  <div className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">Qué incluir en tu biografía:</h4>
                        <ul className="text-sm text-gray-700 space-y-1">
                          <li>• <strong>Presentación personal:</strong> Quién eres</li>
                          <li>• <strong>Intereses:</strong> Qué te gusta comprar/vender</li>
                          <li>• <strong>Experiencia:</strong> Tiempo en la plataforma</li>
                          <li>• <strong>Especialidades:</strong> Categorías favoritas</li>
                          <li>• <strong>Valores:</strong> Honestidad, puntualidad, etc.</li>
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">Consejos de redacción:</h4>
                        <ul className="text-sm text-gray-700 space-y-1">
                          <li>• Mantén un tono amigable y profesional</li>
                          <li>• Sé auténtico y honesto</li>
                          <li>• Usa párrafos cortos y claros</li>
                          <li>• Evita información demasiado personal</li>
                          <li>• Actualiza regularmente</li>
                        </ul>
                      </div>
                    </div>
                    
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <h4 className="font-semibold text-green-800 mb-2">💡 Ejemplo de buena biografía:</h4>
                      <p className="text-sm text-green-700 italic">
                        "¡Hola! Soy María, apasionada de la moda vintage y los libros. Llevo 2 años en ReSmoke 
                        comprando y vendiendo ropa de segunda mano y artículos únicos. Me encanta dar nueva vida 
                        a objetos especiales. Siempre respondo rápido y cuido cada detalle en mis envíos. 
                        ¡Espero conocerte pronto!"
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Step by Step Guide */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Cómo Actualizar tu Perfil</h2>
          
          <div className="space-y-8">
            {/* Step 1 */}
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
              <div className="flex items-start">
                <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mr-4">
                  <span className="text-blue-600 font-bold text-lg">1</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Accede a tu Perfil</h3>
                  <p className="text-gray-700 mb-4">
                    Navega a la sección de perfil desde el menú principal de tu cuenta.
                  </p>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-800 mb-2">📍 Cómo llegar:</h4>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• Haz clic en tu avatar (esquina superior derecha)</li>
                      <li>• Selecciona "Mi Perfil" en el menú desplegable</li>
                      <li>• O ve directamente a "Configuración" → "Perfil"</li>
                      <li>• También puedes usar el atajo Ctrl+P</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
              <div className="flex items-start">
                <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mr-4">
                  <span className="text-blue-600 font-bold text-lg">2</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Selecciona la Sección a Editar</h3>
                  <p className="text-gray-700 mb-4">
                    Tu perfil está organizado en pestañas para facilitar la edición de diferentes secciones.
                  </p>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Pestañas disponibles:</h4>
                      <ul className="text-sm text-gray-700 space-y-1">
                        <li>• <strong>"Información básica":</strong> Datos personales</li>
                        <li>• <strong>"Foto de perfil":</strong> Imagen principal</li>
                        <li>• <strong>"Ubicación":</strong> Datos de localización</li>
                        <li>• <strong>"Biografía":</strong> Descripción personal</li>
                        <li>• <strong>"Preferencias":</strong> Configuraciones</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Indicadores visuales:</h4>
                      <ul className="text-sm text-gray-700 space-y-1">
                        <li>• <span className="text-green-600">●</span> Verde: Sección completa</li>
                        <li>• <span className="text-yellow-600">●</span> Amarillo: Información parcial</li>
                        <li>• <span className="text-red-600">●</span> Rojo: Información faltante</li>
                        <li>• <span className="text-blue-600">●</span> Azul: Verificación pendiente</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
              <div className="flex items-start">
                <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mr-4">
                  <span className="text-blue-600 font-bold text-lg">3</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Edita la Información</h3>
                  <p className="text-gray-700 mb-4">
                    Modifica los campos que desees actualizar, siguiendo las recomendaciones para cada sección.
                  </p>
                  
                  <div className="space-y-4">
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <h4 className="font-semibold text-yellow-800 mb-2">⚠️ Campos que requieren verificación:</h4>
                      <ul className="text-sm text-yellow-700 space-y-1">
                        <li>• <strong>Email:</strong> Recibirás un enlace de confirmación</li>
                        <li>• <strong>Teléfono:</strong> Código de verificación por SMS</li>
                        <li>• <strong>Nombre de usuario:</strong> Debe estar disponible</li>
                        <li>• <strong>Dirección:</strong> Puede requerir validación postal</li>
                      </ul>
                    </div>
                    
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <h4 className="font-semibold text-green-800 mb-2">✅ Campos de actualización inmediata:</h4>
                      <ul className="text-sm text-green-700 space-y-1">
                        <li>• <strong>Nombre completo:</strong> Se actualiza al guardar</li>
                        <li>• <strong>Biografía:</strong> Cambios instantáneos</li>
                        <li>• <strong>Foto de perfil:</strong> Visible inmediatamente</li>
                        <li>• <strong>Preferencias:</strong> Efecto inmediato</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 4 */}
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
              <div className="flex items-start">
                <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mr-4">
                  <span className="text-blue-600 font-bold text-lg">4</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Guarda los Cambios</h3>
                  <p className="text-gray-700 mb-4">
                    Revisa toda la información antes de guardar y confirma los cambios realizados.
                  </p>
                  
                  <div className="space-y-4">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h4 className="font-semibold text-blue-800 mb-2">🔍 Lista de verificación antes de guardar:</h4>
                      <ul className="text-sm text-blue-700 space-y-1">
                        <li>• Revisa que toda la información sea correcta</li>
                        <li>• Verifica que no hay errores ortográficos</li>
                        <li>• Confirma que la foto se ve bien</li>
                        <li>• Asegúrate de que la biografía sea apropiada</li>
                        <li>• Comprueba que los datos de contacto estén actualizados</li>
                      </ul>
                    </div>
                    
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <h4 className="font-semibold text-green-800 mb-2">✅ Confirmación exitosa:</h4>
                      <p className="text-sm text-green-700">
                        Verás una notificación de confirmación y los cambios se reflejarán inmediatamente 
                        en tu perfil público (excepto los que requieren verificación).
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Privacy Settings */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Configuración de Privacidad</h2>
          
          <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-200">
            <div className="text-center mb-8">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Controla qué Información es Visible</h3>
              <p className="text-lg text-gray-600">
                Tienes control total sobre qué información de tu perfil es visible para otros usuarios.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="text-xl font-bold text-gray-900 mb-4">Información siempre visible:</h4>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-green-600 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span><strong>Nombre de usuario:</strong> Tu identificador público</span>
                  </li>
                  
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-green-600 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span><strong>Foto de perfil:</strong> Tu imagen principal</span>
                  </li>
                  
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-green-600 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span><strong>Fecha de registro:</strong> Cuándo te uniste</span>
                  </li>
                  
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-green-600 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span><strong>Valoraciones:</strong> Puntuación y comentarios</span>
                  </li>
                  
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-green-600 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span><strong>Productos activos:</strong> Lo que tienes en venta</span>
                  </li>
                </ul>
              </div>
              
              <div>
                <h4 className="text-xl font-bold text-gray-900 mb-4">Información configurable:</h4>
                
                <div className="space-y-4">
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h5 className="font-semibold text-gray-900 mb-2">Nombre completo</h5>
                    <div className="flex items-center space-x-4 text-sm">
                      <label className="flex items-center">
                        <input type="radio" name="name" className="mr-2" />
                        <span className="text-green-600">Público</span>
                      </label>
                      <label className="flex items-center">
                        <input type="radio" name="name" className="mr-2" defaultChecked />
                        <span className="text-yellow-600">Solo inicial</span>
                      </label>
                      <label className="flex items-center">
                        <input type="radio" name="name" className="mr-2" />
                        <span className="text-red-600">Privado</span>
                      </label>
                    </div>
                  </div>
                  
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h5 className="font-semibold text-gray-900 mb-2">Ubicación</h5>
                    <div className="flex items-center space-x-4 text-sm">
                      <label className="flex items-center">
                        <input type="radio" name="location" className="mr-2" defaultChecked />
                        <span className="text-green-600">Ciudad</span>
                      </label>
                      <label className="flex items-center">
                        <input type="radio" name="location" className="mr-2" />
                        <span className="text-yellow-600">Provincia</span>
                      </label>
                      <label className="flex items-center">
                        <input type="radio" name="location" className="mr-2" />
                        <span className="text-red-600">Oculta</span>
                      </label>
                    </div>
                  </div>
                  
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h5 className="font-semibold text-gray-900 mb-2">Información de contacto</h5>
                    <div className="flex items-center space-x-4 text-sm">
                      <label className="flex items-center">
                        <input type="radio" name="contact" className="mr-2" />
                        <span className="text-green-600">Público</span>
                      </label>
                      <label className="flex items-center">
                        <input type="radio" name="contact" className="mr-2" defaultChecked />
                        <span className="text-yellow-600">Solo compradores</span>
                      </label>
                      <label className="flex items-center">
                        <input type="radio" name="contact" className="mr-2" />
                        <span className="text-red-600">Privado</span>
                      </label>
                    </div>
                  </div>
                  
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h5 className="font-semibold text-gray-900 mb-2">Última conexión</h5>
                    <div className="flex items-center space-x-4 text-sm">
                      <label className="flex items-center">
                        <input type="radio" name="activity" className="mr-2" defaultChecked />
                        <span className="text-green-600">Visible</span>
                      </label>
                      <label className="flex items-center">
                        <input type="radio" name="activity" className="mr-2" />
                        <span className="text-red-600">Oculta</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Common Issues */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Problemas Comunes y Soluciones</h2>
          
          <div className="space-y-6">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <h3 className="text-lg font-bold text-red-900 mb-4">❌ "No puedo cambiar mi nombre de usuario"</h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-red-800 mb-3">Posibles causas:</h4>
                  <ul className="text-sm text-red-700 space-y-1">
                    <li>• El nombre ya está en uso</li>
                    <li>• Contiene caracteres no permitidos</li>
                    <li>• Es demasiado corto o largo</li>
                    <li>• Cambiaste recientemente (límite 30 días)</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold text-red-800 mb-3">Soluciones:</h4>
                  <ul className="text-sm text-red-700 space-y-1">
                    <li>• Prueba variaciones del nombre deseado</li>
                    <li>• Usa solo letras, números y guiones</li>
                    <li>• Asegúrate de tener 3-20 caracteres</li>
                    <li>• Espera el período de enfriamiento</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <h3 className="text-lg font-bold text-yellow-900 mb-4">⚠️ "Mi foto de perfil no se sube"</h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-yellow-800 mb-3">Requisitos técnicos:</h4>
                  <ul className="text-sm text-yellow-700 space-y-1">
                    <li>• Formato: JPG, PNG o GIF</li>
                    <li>• Tamaño máximo: 5MB</li>
                    <li>• Resolución mínima: 200x200px</li>
                    <li>• Resolución recomendada: 400x400px</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold text-yellow-800 mb-3">Qué hacer:</h4>
                  <ul className="text-sm text-yellow-700 space-y-1">
                    <li>• Comprime la imagen si es muy grande</li>
                    <li>• Convierte a JPG si está en otro formato</li>
                    <li>• Verifica tu conexión a internet</li>
                    <li>• Intenta desde otro navegador</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-bold text-blue-900 mb-4">📧 "No recibo el email de verificación"</h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-blue-800 mb-3">Dónde buscar:</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Bandeja de entrada principal</li>
                    <li>• Carpeta de spam/correo no deseado</li>
                    <li>• Carpeta de promociones</li>
                    <li>• Filtros automáticos del email</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold text-blue-800 mb-3">Soluciones:</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Espera hasta 10 minutos</li>
                    <li>• Verifica que el email sea correcto</li>
                    <li>• Solicita reenvío del código</li>
                    <li>• Añade noreply@resmoke.com a contactos</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h3 className="text-lg font-bold text-green-900 mb-4">💾 "Los cambios no se guardan"</h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-green-800 mb-3">Posibles causas:</h4>
                  <ul className="text-sm text-green-700 space-y-1">
                    <li>• Conexión a internet inestable</li>
                    <li>• Sesión expirada</li>
                    <li>• Campos obligatorios vacíos</li>
                    <li>• Información inválida</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold text-green-800 mb-3">Qué hacer:</h4>
                  <ul className="text-sm text-green-700 space-y-1">
                    <li>• Verifica tu conexión a internet</li>
                    <li>• Actualiza la página e inicia sesión</li>
                    <li>• Completa todos los campos obligatorios</li>
                    <li>• Revisa los mensajes de error</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Support Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">
            ¿Necesitas Ayuda con tu Perfil?
          </h2>
          <p className="text-lg text-blue-100 mb-8">
            Nuestro equipo está aquí para ayudarte a crear el perfil perfecto y resolver cualquier problema técnico.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-blue-600 px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors font-semibold">
              Contactar Soporte
            </button>
            <button className="bg-blue-700 text-white border border-blue-500 px-6 py-3 rounded-lg hover:bg-blue-800 transition-colors">
              Ver Tutorial en Video
            </button>
          </div>
          
          <div className="mt-8 grid md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="bg-blue-500 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="font-semibold mb-1">Email</h3>
              <p className="text-sm text-blue-100">perfil@resmoke.com</p>
            </div>
            
            <div>
              <div className="bg-blue-500 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="font-semibold mb-1">Chat en vivo</h3>
              <p className="text-sm text-blue-100">Lun-Vie 9:00-18:00</p>
            </div>
            
            <div>
              <div className="bg-blue-500 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="font-semibold mb-1">Guías</h3>
              <p className="text-sm text-blue-100">Centro de ayuda</p>
            </div>
          </div>
        </div>
      </section>
    </div>
    </>
  );
};

export default UpdateProfilePage;