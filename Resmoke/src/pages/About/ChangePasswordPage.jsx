import React from 'react';
import SEO from '../../components/SEO/SEO';

const ChangePasswordPage = () => {
  return (
    <>
      <SEO title="Cambiar Contraseña" description="Mantén tu cuenta segura actualizando tu contraseña regularmente en Resmoke." url="/cambiar-password"/>
      <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6">
              <span className="inline-block px-4 py-1 mb-4 rounded-full bg-red-50 ring-1 ring-red-200 text-sm tracking-wide text-red-700">Seguridad</span>
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900">Cambiar tu Contraseña</h1>
              <p className="mt-4 text-lg text-gray-600 max-w-xl">Mantén tu cuenta segura actualizando tu contraseña regularmente</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <a href="#cuando" className="inline-flex items-center px-5 py-3 rounded-xl bg-gray-900 text-white hover:bg-gray-800 transition">Ver cuándo cambiarla</a>
                <a href="#como" className="inline-flex items-center px-5 py-3 rounded-xl ring-1 ring-gray-300 text-gray-900 hover:bg-gray-50 transition">Guía paso a paso</a>
              </div>
              <div className="mt-8 grid grid-cols-3 gap-6 text-center">
                <div className="bg-white/70 backdrop-blur rounded-xl ring-1 ring-gray-200 p-4 shadow-sm">
                  <p className="text-2xl font-bold text-gray-900">Fuerte</p>
                  <p className="text-xs text-gray-500">recomendada</p>
                </div>
                <div className="bg-white/70 backdrop-blur rounded-xl ring-1 ring-gray-200 p-4 shadow-sm">
                  <p className="text-2xl font-bold text-gray-900">Protegida</p>
                  <p className="text-xs text-gray-500">2FA</p>
                </div>
                <div className="bg-white/70 backdrop-blur rounded-xl ring-1 ring-gray-200 p-4 shadow-sm">
                  <p className="text-2xl font-bold text-gray-900">Alertas</p>
                  <p className="text-xs text-gray-500">email</p>
                </div>
              </div>
            </div>
            <div className="lg:col-span-6 relative">
              <div className="aspect-[4/3] rounded-2xl backdrop-blur overflow-hidden">
                <img src="https://cdn-icons-png.flaticon.com/512/3064/3064197.png" alt="Seguridad y contraseñas" className="w-full h-full object-contain" />
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
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Seguridad de tu Cuenta</h2>
            <p className="text-lg text-gray-600">
              Cambiar tu contraseña regularmente es una de las mejores prácticas para mantener 
              tu cuenta segura y proteger tu información personal.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 mt-12">
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.18-5.18a2.12 2.12 0 013 3L12 21l-9-9a2.12 2.12 0 013-3z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Proceso rápido</h3>
              <p className="text-gray-600">Cambia tu contraseña en menos de 2 minutos</p>
            </div>
            
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Máxima seguridad</h3>
              <p className="text-gray-600">Protección avanzada con encriptación de extremo a extremo</p>
            </div>
            
            <div className="text-center">
              <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Alertas inmediatas</h3>
              <p className="text-gray-600">Te notificamos cualquier cambio en tu cuenta</p>
            </div>
          </div>
        </div>
      </section>

      {/* When to Change Password */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 id="cuando" className="text-3xl font-bold text-gray-900 text-center mb-12">¿Cuándo Cambiar tu Contraseña?</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <h3 className="text-xl font-bold text-red-900 mb-4">🚨 Cambio Urgente Requerido</h3>
              
              <ul className="space-y-3 text-red-700">
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-red-600 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <span><strong>Actividad sospechosa:</strong> Intentos de acceso no autorizados</span>
                </li>
                
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-red-600 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <span><strong>Dispositivo comprometido:</strong> Tu dispositivo fue infectado</span>
                </li>
                
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-red-600 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <span><strong>Filtración de datos:</strong> Tu contraseña pudo haber sido expuesta</span>
                </li>
                
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-red-600 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <span><strong>Compartiste tu contraseña:</strong> Alguien más conoce tu contraseña</span>
                </li>
                
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-red-600 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <span><strong>Notificación de ReSmoke:</strong> Te avisamos de actividad inusual</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <h3 className="text-xl font-bold text-yellow-900 mb-4">⏰ Cambio Preventivo Recomendado</h3>
              
              <ul className="space-y-3 text-yellow-700">
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-yellow-600 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span><strong>Cada 3-6 meses:</strong> Cambio regular por seguridad</span>
                </li>
                
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-yellow-600 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span><strong>Contraseña débil:</strong> Si usas una contraseña simple</span>
                </li>
                
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-yellow-600 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span><strong>Reutilización:</strong> Si usas la misma contraseña en otros sitios</span>
                </li>
                
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-yellow-600 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span><strong>Acceso público:</strong> Después de usar WiFi público</span>
                </li>
                
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-yellow-600 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span><strong>Cambio de empleado:</strong> Si alguien de tu equipo se va</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Step by Step Guide */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 id="como" className="text-3xl font-bold text-gray-900 text-center mb-12">Cómo Cambiar tu Contraseña</h2>
          
          <div className="space-y-8">
            {/* Step 1 */}
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
              <div className="flex items-start">
                <div className="bg-red-100 w-12 h-12 rounded-full flex items-center justify-center mr-4">
                  <span className="text-red-600 font-bold text-lg">1</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Accede a tu Perfil</h3>
                  <p className="text-gray-700 mb-4">
                    Inicia sesión en tu cuenta y ve a la sección de configuración de tu perfil.
                  </p>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-800 mb-2">📍 Cómo llegar:</h4>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• Haz clic en tu avatar (esquina superior derecha)</li>
                      <li>• Selecciona "Mi Perfil" en el menú desplegable</li>
                      <li>• Ve a la pestaña "Configuración"</li>
                      <li>• Busca la sección "Seguridad"</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
              <div className="flex items-start">
                <div className="bg-red-100 w-12 h-12 rounded-full flex items-center justify-center mr-4">
                  <span className="text-red-600 font-bold text-lg">2</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Verifica tu Identidad</h3>
                  <p className="text-gray-700 mb-4">
                    Por seguridad, necesitarás confirmar tu contraseña actual antes de cambiarla.
                  </p>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Métodos de verificación:</h4>
                      <ul className="text-sm text-gray-700 space-y-1">
                        <li>• <strong>Contraseña actual:</strong> La más común</li>
                        <li>• <strong>Código por SMS:</strong> Si tienes 2FA activado</li>
                        <li>• <strong>Email de verificación:</strong> Enlace temporal</li>
                        <li>• <strong>Pregunta de seguridad:</strong> Si la configuraste</li>
                      </ul>
                    </div>
                    
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <h4 className="font-semibold text-yellow-800 mb-2">🔐 ¿Olvidaste tu contraseña?</h4>
                      <p className="text-sm text-yellow-700">
                        Si no recuerdas tu contraseña actual, usa la opción "Recuperar contraseña" 
                        en la página de inicio de sesión.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
              <div className="flex items-start">
                <div className="bg-red-100 w-12 h-12 rounded-full flex items-center justify-center mr-4">
                  <span className="text-red-600 font-bold text-lg">3</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Crea una Nueva Contraseña Segura</h3>
                  <p className="text-gray-700 mb-4">
                    Introduce tu nueva contraseña siguiendo nuestras recomendaciones de seguridad.
                  </p>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-green-800 mb-3">✅ Características de una buena contraseña:</h4>
                      <ul className="text-sm text-green-700 space-y-1">
                        <li>• <strong>Mínimo 12 caracteres</strong> (recomendado 16+)</li>
                        <li>• <strong>Letras mayúsculas y minúsculas</strong></li>
                        <li>• <strong>Números</strong> distribuidos por la contraseña</li>
                        <li>• <strong>Símbolos especiales</strong> (!@#$%^&*)</li>
                        <li>• <strong>Única</strong> para esta cuenta</li>
                        <li>• <strong>No contiene información personal</strong></li>
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-red-800 mb-3">❌ Evita estas contraseñas:</h4>
                      <ul className="text-sm text-red-700 space-y-1">
                        <li>• Secuencias: 123456, abcdef</li>
                        <li>• Palabras comunes: password, admin</li>
                        <li>• Información personal: nombre, fecha</li>
                        <li>• Patrones de teclado: qwerty, asdf</li>
                        <li>• Contraseñas anteriores</li>
                        <li>• Contraseñas de otros sitios</li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <h4 className="font-semibold text-green-800 mb-2">💡 Consejo profesional:</h4>
                    <p className="text-sm text-green-700">
                      Usa una frase memorable y modifícala: "MiGato3Come@Pescado!" es más segura 
                      y fácil de recordar que "Kj8#mP2$qR".
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 4 */}
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
              <div className="flex items-start">
                <div className="bg-red-100 w-12 h-12 rounded-full flex items-center justify-center mr-4">
                  <span className="text-red-600 font-bold text-lg">4</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Confirma y Guarda los Cambios</h3>
                  <p className="text-gray-700 mb-4">
                    Verifica que tu nueva contraseña esté correcta y confirma el cambio.
                  </p>
                  
                  <div className="space-y-4">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h4 className="font-semibold text-blue-800 mb-2">🔍 Verificación final:</h4>
                      <ul className="text-sm text-blue-700 space-y-1">
                        <li>• Escribe la nueva contraseña dos veces</li>
                        <li>• Verifica que ambas coincidan exactamente</li>
                        <li>• Revisa el indicador de fortaleza</li>
                        <li>• Haz clic en "Cambiar contraseña"</li>
                      </ul>
                    </div>
                    
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <h4 className="font-semibold text-green-800 mb-2">✅ Confirmación exitosa:</h4>
                      <p className="text-sm text-green-700">
                        Recibirás una confirmación por email y serás redirigido automáticamente. 
                        Tu sesión actual se mantendrá activa.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Two-Factor Authentication */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Autenticación de Dos Factores (2FA)</h2>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-8">
            <div className="text-center mb-8">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Protección Extra para tu Cuenta</h3>
              <p className="text-lg text-gray-600">
                La autenticación de dos factores añade una capa adicional de seguridad, 
                requiriendo un segundo método de verificación además de tu contraseña.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg p-6 border border-blue-200">
                <div className="text-center mb-4">
                  <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <h4 className="font-bold text-gray-900">SMS</h4>
                </div>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Código por mensaje de texto</li>
                  <li>• Fácil de configurar</li>
                  <li>• Funciona sin internet</li>
                  <li>• Menos seguro que apps</li>
                </ul>
              </div>
              
              <div className="bg-white rounded-lg p-6 border border-blue-200">
                <div className="text-center mb-4">
                  <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h4 className="font-bold text-gray-900">App Autenticadora</h4>
                </div>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Google Authenticator</li>
                  <li>• Microsoft Authenticator</li>
                  <li>• Authy (recomendado)</li>
                  <li>• Más seguro que SMS</li>
                </ul>
              </div>
              
              <div className="bg-white rounded-lg p-6 border border-blue-200">
                <div className="text-center mb-4">
                  <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                    </svg>
                  </div>
                  <h4 className="font-bold text-gray-900">Llaves de Seguridad</h4>
                </div>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• YubiKey, Titan Key</li>
                  <li>• Máxima seguridad</li>
                  <li>• Resistente a phishing</li>
                  <li>• Requiere dispositivo físico</li>
                </ul>
              </div>
            </div>
            
            <div className="mt-8 text-center">
              <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold">
                Activar 2FA en mi Cuenta
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Common Issues */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Problemas Comunes y Soluciones</h2>
          
          <div className="space-y-6">
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-4">🚫 "La contraseña actual es incorrecta"</h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Posibles causas:</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Escribiste mal la contraseña actual</li>
                    <li>• Tienes activado Caps Lock</li>
                    <li>• Estás usando una contraseña antigua</li>
                    <li>• Tu cuenta fue comprometida</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Soluciones:</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Verifica que Caps Lock esté desactivado</li>
                    <li>• Copia y pega desde tu gestor de contraseñas</li>
                    <li>• Usa "Recuperar contraseña" si no la recuerdas</li>
                    <li>• Contacta soporte si persiste el problema</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-4">⚠️ "La nueva contraseña no cumple los requisitos"</h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Requisitos mínimos:</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Mínimo 8 caracteres (recomendado 12+)</li>
                    <li>• Al menos una letra mayúscula</li>
                    <li>• Al menos una letra minúscula</li>
                    <li>• Al menos un número</li>
                    <li>• Al menos un símbolo especial</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Consejos para cumplir:</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Usa el generador de contraseñas</li>
                    <li>• Combina palabras con números y símbolos</li>
                    <li>• Evita secuencias obvias (123, abc)</li>
                    <li>• No uses información personal</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-4">📧 "No recibo el email de confirmación"</h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Dónde buscar:</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Bandeja de entrada principal</li>
                    <li>• Carpeta de spam/correo no deseado</li>
                    <li>• Carpeta de promociones (Gmail)</li>
                    <li>• Filtros de correo automáticos</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Qué hacer:</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Espera hasta 10 minutos</li>
                    <li>• Verifica tu dirección de email</li>
                    <li>• Solicita reenvío del email</li>
                    <li>• Añade noreply@resmoke.com a contactos</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-4">🔄 "Me desconecté de todos los dispositivos"</h3>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-800 mb-2">Esto es normal y esperado</h4>
                <p className="text-sm text-blue-700 mb-3">
                  Por seguridad, cambiar tu contraseña cierra todas las sesiones activas en otros dispositivos. 
                  Esto previene que alguien con acceso no autorizado siga usando tu cuenta.
                </p>
                
                <h4 className="font-semibold text-blue-800 mb-2">Qué hacer:</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Inicia sesión nuevamente en cada dispositivo</li>
                  <li>• Usa tu nueva contraseña</li>
                  <li>• Actualiza las contraseñas guardadas</li>
                  <li>• Verifica que no hay sesiones sospechosas</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Support Section */}
      <section className="py-16 bg-red-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">
            ¿Problemas para Cambiar tu Contraseña?
          </h2>
          <p className="text-lg text-red-100 mb-8">
            Si tienes dificultades o sospechas que tu cuenta ha sido comprometida, 
            contacta inmediatamente a nuestro equipo de seguridad.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-red-600 px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors font-semibold">
              Soporte de Emergencia
            </button>
            <button className="bg-red-700 text-white border border-red-500 px-6 py-3 rounded-lg hover:bg-red-800 transition-colors">
              Reportar Cuenta Comprometida
            </button>
          </div>
          
          <div className="mt-8 grid md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="bg-red-500 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="font-semibold mb-1">Email Urgente</h3>
              <p className="text-sm text-red-100">seguridad@resmoke.com</p>
            </div>
            
            <div>
              <div className="bg-red-500 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <h3 className="font-semibold mb-1">Línea de Seguridad</h3>
              <p className="text-sm text-red-100">900 SEGURO (24/7)</p>
            </div>
            
            <div>
              <div className="bg-red-500 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="font-semibold mb-1">Chat de Emergencia</h3>
              <p className="text-sm text-red-100">Disponible 24/7</p>
            </div>
          </div>
        </div>
      </section>
    </div>
    </>
  );
};

export default ChangePasswordPage;