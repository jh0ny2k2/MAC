import React from 'react';
import SEO from '../../components/SEO/SEO';

const CreateAccountPage = () => {
  return (
    <>
      <SEO title="Crear Cuenta" description="Guía completa para registrarte y verificar tu cuenta de forma segura en Resmoke." url="/crear-cuenta"/>
      <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6">
              <span className="inline-block px-4 py-1 mb-4 rounded-full bg-purple-50 ring-1 ring-purple-200 text-sm tracking-wide text-purple-700">Registro</span>
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900">Crear y Verificar tu Cuenta</h1>
              <p className="mt-4 text-lg text-gray-600 max-w-xl">Guía completa para registrarte y verificar tu cuenta de forma segura</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <a href="#pasos" className="inline-flex items-center px-5 py-3 rounded-xl bg-gray-900 text-white hover:bg-gray-800 transition">Comenzar registro</a>
                <a href="#verificacion" className="inline-flex items-center px-5 py-3 rounded-xl ring-1 ring-gray-300 text-gray-900 hover:bg-gray-50 transition">Ver verificación</a>
              </div>
              <div className="mt-8 grid grid-cols-3 gap-6 text-center">
                <div className="bg-white/70 backdrop-blur rounded-xl ring-1 ring-gray-200 p-4 shadow-sm">
                  <p className="text-2xl font-bold text-gray-900">Seguro</p>
                  <p className="text-xs text-gray-500">datos</p>
                </div>
                <div className="bg-white/70 backdrop-blur rounded-xl ring-1 ring-gray-200 p-4 shadow-sm">
                  <p className="text-2xl font-bold text-gray-900">Rápido</p>
                  <p className="text-xs text-gray-500">proceso</p>
                </div>
                <div className="bg-white/70 backdrop-blur rounded-xl ring-1 ring-gray-200 p-4 shadow-sm">
                  <p className="text-2xl font-bold text-gray-900">Verificado</p>
                  <p className="text-xs text-gray-500">identidad</p>
                </div>
              </div>
            </div>
            <div className="lg:col-span-6 relative">
              <div className="aspect-[4/3] rounded-2xl backdrop-blur overflow-hidden">
                <img src="https://cdn-icons-png.flaticon.com/512/747/747376.png" alt="Registro en Resmoke" className="w-full h-full object-contain" />
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
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Tu Puerta de Entrada a ReSmoke</h2>
            <p className="text-lg text-gray-600">
              Crear una cuenta verificada te permite acceder a todas las funcionalidades de la plataforma 
              y genera confianza entre los demás usuarios.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 mt-12">
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Proceso simple</h3>
              <p className="text-gray-600">Solo necesitas unos minutos para crear tu cuenta</p>
            </div>
            
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Totalmente seguro</h3>
              <p className="text-gray-600">Tus datos están protegidos con encriptación avanzada</p>
            </div>
            
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Verificación premium</h3>
              <p className="text-gray-600">Aumenta tu credibilidad con la verificación completa</p>
            </div>
          </div>
        </div>
      </section>

      {/* Step by Step Registration */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 id="pasos" className="text-3xl font-bold text-gray-900 text-center mb-12">Paso a Paso: Crear tu Cuenta</h2>
          
          <div className="space-y-8">
            {/* Step 1 */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <div className="flex items-start">
                <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mr-4">
                  <span className="text-purple-600 font-bold text-lg">1</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Accede al Formulario de Registro</h3>
                  <p className="text-gray-700 mb-4">
                    Haz clic en "Registrarse" en la página principal o ve directamente a la página de registro.
                  </p>
                  
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <h4 className="font-semibold text-purple-800 mb-2">💡 Consejo:</h4>
                    <p className="text-sm text-purple-700">
                      Asegúrate de tener una conexión estable a internet antes de comenzar el proceso.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <div className="flex items-start">
                <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mr-4">
                  <span className="text-purple-600 font-bold text-lg">2</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Completa la Información Básica</h3>
                  <p className="text-gray-700 mb-4">
                    Rellena todos los campos obligatorios con información real y actualizada.
                  </p>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Información requerida:</h4>
                      <ul className="text-sm text-gray-700 space-y-1">
                        <li>• <strong>Nombre completo:</strong> Tu nombre real</li>
                        <li>• <strong>Email:</strong> Dirección de correo válida</li>
                        <li>• <strong>Teléfono:</strong> Número de contacto</li>
                        <li>• <strong>Contraseña:</strong> Mínimo 8 caracteres</li>
                        <li>• <strong>Fecha de nacimiento:</strong> Debes ser mayor de edad</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Consejos de seguridad:</h4>
                      <ul className="text-sm text-gray-700 space-y-1">
                        <li>• Usa una contraseña única y fuerte</li>
                        <li>• Combina letras, números y símbolos</li>
                        <li>• No uses información personal obvia</li>
                        <li>• Considera usar un gestor de contraseñas</li>
                        <li>• Nunca compartas tus credenciales</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <div className="flex items-start">
                <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mr-4">
                  <span className="text-purple-600 font-bold text-lg">3</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Acepta los Términos y Condiciones</h3>
                  <p className="text-gray-700 mb-4">
                    Lee cuidadosamente y acepta nuestros términos de servicio y política de privacidad.
                  </p>
                  
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h4 className="font-semibold text-yellow-800 mb-2">⚠️ Importante:</h4>
                    <p className="text-sm text-yellow-700">
                      Te recomendamos leer los términos completos. Incluyen información importante sobre 
                      el uso de la plataforma, políticas de devolución y responsabilidades.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 4 */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <div className="flex items-start">
                <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mr-4">
                  <span className="text-purple-600 font-bold text-lg">4</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Verifica tu Email</h3>
                  <p className="text-gray-700 mb-4">
                    Recibirás un email de confirmación. Haz clic en el enlace para activar tu cuenta.
                  </p>
                  
                  <div className="space-y-4">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h4 className="font-semibold text-blue-800 mb-2">📧 ¿No recibes el email?</h4>
                      <ul className="text-sm text-blue-700 space-y-1">
                        <li>• Revisa tu carpeta de spam o correo no deseado</li>
                        <li>• Verifica que escribiste correctamente tu email</li>
                        <li>• Espera hasta 10 minutos (puede haber retraso)</li>
                        <li>• Solicita un nuevo email de verificación</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Account Verification */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 id="verificacion" className="text-3xl font-bold text-gray-900 text-center mb-12">Verificación de Cuenta</h2>
          
          <div className="mb-8">
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h3 className="text-xl font-bold text-green-900 mb-4">¿Por qué verificar tu cuenta?</h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-green-800 mb-3">Beneficios para ti:</h4>
                  <ul className="text-sm text-green-700 space-y-1">
                    <li>• Mayor confianza de otros usuarios</li>
                    <li>• Acceso a funciones premium</li>
                    <li>• Prioridad en búsquedas</li>
                    <li>• Límites de venta más altos</li>
                    <li>• Soporte prioritario</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold text-green-800 mb-3">Beneficios para la comunidad:</h4>
                  <ul className="text-sm text-green-700 space-y-1">
                    <li>• Reduce el fraude en la plataforma</li>
                    <li>• Aumenta la seguridad general</li>
                    <li>• Mejora la experiencia de compra</li>
                    <li>• Facilita la resolución de conflictos</li>
                    <li>• Crea un entorno más confiable</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Verification Levels */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Niveles de Verificación</h3>
            
            {/* Basic Verification */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <div className="bg-blue-100 w-10 h-10 rounded-full flex items-center justify-center mr-4">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h4 className="text-xl font-bold text-gray-900">Verificación Básica (Email)</h4>
                <span className="ml-auto bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded">AUTOMÁTICA</span>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h5 className="font-semibold text-blue-800 mb-2">Qué incluye:</h5>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Verificación de dirección de email</li>
                    <li>• Acceso básico a la plataforma</li>
                    <li>• Posibilidad de comprar y vender</li>
                    <li>• Badge de "Email verificado"</li>
                  </ul>
                </div>
                
                <div>
                  <h5 className="font-semibold text-blue-800 mb-2">Proceso:</h5>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Se completa automáticamente al registrarte</li>
                    <li>• Solo necesitas confirmar tu email</li>
                    <li>• Tiempo estimado: 2-5 minutos</li>
                    <li>• No requiere documentación adicional</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Phone Verification */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <div className="bg-green-100 w-10 h-10 rounded-full flex items-center justify-center mr-4">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <h4 className="text-xl font-bold text-gray-900">Verificación de Teléfono</h4>
                <span className="ml-auto bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded">RECOMENDADA</span>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h5 className="font-semibold text-green-800 mb-2">Qué incluye:</h5>
                  <ul className="text-sm text-green-700 space-y-1">
                    <li>• Verificación de número de teléfono</li>
                    <li>• Badge de "Teléfono verificado"</li>
                    <li>• Mayor confianza de otros usuarios</li>
                    <li>• Acceso a funciones adicionales</li>
                  </ul>
                </div>
                
                <div>
                  <h5 className="font-semibold text-green-800 mb-2">Proceso:</h5>
                  <ul className="text-sm text-green-700 space-y-1">
                    <li>• Introduce tu número de teléfono</li>
                    <li>• Recibes un SMS con código de verificación</li>
                    <li>• Introduce el código en la plataforma</li>
                    <li>• Tiempo estimado: 2-3 minutos</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* ID Verification */}
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <div className="bg-purple-100 w-10 h-10 rounded-full flex items-center justify-center mr-4">
                  <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                  </svg>
                </div>
                <h4 className="text-xl font-bold text-gray-900">Verificación de Identidad</h4>
                <span className="ml-auto bg-purple-100 text-purple-800 text-xs font-semibold px-2 py-1 rounded">PREMIUM</span>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h5 className="font-semibold text-purple-800 mb-2">Qué incluye:</h5>
                  <ul className="text-sm text-purple-700 space-y-1">
                    <li>• Verificación completa de identidad</li>
                    <li>• Badge de "Identidad verificada"</li>
                    <li>• Máxima confianza de la comunidad</li>
                    <li>• Acceso a todas las funciones premium</li>
                    <li>• Límites de transacción más altos</li>
                  </ul>
                </div>
                
                <div>
                  <h5 className="font-semibold text-purple-800 mb-2">Documentos requeridos:</h5>
                  <ul className="text-sm text-purple-700 space-y-1">
                    <li>• DNI, NIE o Pasaporte vigente</li>
                    <li>• Foto clara del documento (ambas caras)</li>
                    <li>• Selfie sosteniendo el documento</li>
                    <li>• Tiempo de revisión: 24-48 horas</li>
                  </ul>
                </div>
              </div>
              
              <div className="mt-4 p-4 bg-purple-100 rounded-lg">
                <h5 className="font-semibold text-purple-800 mb-2">🔒 Seguridad garantizada:</h5>
                <p className="text-sm text-purple-700">
                  Todos los documentos se procesan de forma segura y se eliminan después de la verificación. 
                  Solo se almacena la confirmación de que tu identidad ha sido verificada.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Verification Process */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Cómo Verificar tu Identidad</h2>
          
          <div className="space-y-6">
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Preparación de Documentos</h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">✅ Fotos aceptables:</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Imagen clara y nítida</li>
                    <li>• Buena iluminación natural</li>
                    <li>• Todos los datos legibles</li>
                    <li>• Sin reflejos ni sombras</li>
                    <li>• Formato JPG o PNG</li>
                    <li>• Tamaño máximo 5MB</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">❌ Fotos no válidas:</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Imágenes borrosas o pixeladas</li>
                    <li>• Documentos cortados o incompletos</li>
                    <li>• Fotos con flash directo</li>
                    <li>• Documentos dañados o ilegibles</li>
                    <li>• Capturas de pantalla</li>
                    <li>• Documentos caducados</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Proceso de Subida</h3>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="bg-blue-100 w-8 h-8 rounded-full flex items-center justify-center mr-4 mt-1">
                    <span className="text-blue-600 font-bold text-sm">1</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Accede a Verificación</h4>
                    <p className="text-sm text-gray-600">Ve a tu perfil → Configuración → Verificación de cuenta</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-blue-100 w-8 h-8 rounded-full flex items-center justify-center mr-4 mt-1">
                    <span className="text-blue-600 font-bold text-sm">2</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Sube el Anverso</h4>
                    <p className="text-sm text-gray-600">Foto clara de la parte frontal de tu documento</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-blue-100 w-8 h-8 rounded-full flex items-center justify-center mr-4 mt-1">
                    <span className="text-blue-600 font-bold text-sm">3</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Sube el Reverso</h4>
                    <p className="text-sm text-gray-600">Foto de la parte trasera (si aplica a tu documento)</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-blue-100 w-8 h-8 rounded-full flex items-center justify-center mr-4 mt-1">
                    <span className="text-blue-600 font-bold text-sm">4</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Selfie de Verificación</h4>
                    <p className="text-sm text-gray-600">Foto tuya sosteniendo el documento junto a tu cara</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-blue-100 w-8 h-8 rounded-full flex items-center justify-center mr-4 mt-1">
                    <span className="text-blue-600 font-bold text-sm">5</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Envía y Espera</h4>
                    <p className="text-sm text-gray-600">Nuestro equipo revisará tu solicitud en 24-48 horas</p>
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
              <h3 className="text-lg font-bold text-red-900 mb-4">❌ Verificación Rechazada</h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-red-800 mb-3">Motivos comunes:</h4>
                  <ul className="text-sm text-red-700 space-y-1">
                    <li>• Documento caducado o no válido</li>
                    <li>• Fotos de mala calidad</li>
                    <li>• Información no coincidente</li>
                    <li>• Documento dañado o alterado</li>
                    <li>• Selfie no clara o sin documento</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold text-red-800 mb-3">Qué hacer:</h4>
                  <ul className="text-sm text-red-700 space-y-1">
                    <li>• Revisa el motivo del rechazo en tu email</li>
                    <li>• Corrige los problemas identificados</li>
                    <li>• Vuelve a subir documentos mejorados</li>
                    <li>• Contacta soporte si necesitas ayuda</li>
                    <li>• Puedes intentarlo las veces que necesites</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <h3 className="text-lg font-bold text-yellow-900 mb-4">⏳ Verificación Pendiente</h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-yellow-800 mb-3">Tiempos normales:</h4>
                  <ul className="text-sm text-yellow-700 space-y-1">
                    <li>• Verificación de email: Inmediata</li>
                    <li>• Verificación de teléfono: 2-5 minutos</li>
                    <li>• Verificación de identidad: 24-48 horas</li>
                    <li>• Fines de semana: Puede tardar más</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold text-yellow-800 mb-3">Si tarda más de lo normal:</h4>
                  <ul className="text-sm text-yellow-700 space-y-1">
                    <li>• Verifica que subiste todos los documentos</li>
                    <li>• Revisa tu email (incluye spam)</li>
                    <li>• Contacta soporte después de 72 horas</li>
                    <li>• Proporciona tu número de solicitud</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-bold text-blue-900 mb-4">🔧 Problemas Técnicos</h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-blue-800 mb-3">Problemas de subida:</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Archivo demasiado grande (máx. 5MB)</li>
                    <li>• Formato no compatible (usa JPG/PNG)</li>
                    <li>• Conexión a internet inestable</li>
                    <li>• Navegador desactualizado</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold text-blue-800 mb-3">Soluciones:</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Comprime la imagen antes de subir</li>
                    <li>• Usa un navegador actualizado</li>
                    <li>• Intenta desde otro dispositivo</li>
                    <li>• Contacta soporte técnico</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Support Section */}
      <section className="py-16 bg-purple-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">
            ¿Necesitas Ayuda con tu Cuenta?
          </h2>
          <p className="text-lg text-purple-100 mb-8">
            Nuestro equipo de soporte está aquí para ayudarte en cada paso del proceso de registro y verificación.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-purple-600 px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors font-semibold">
              Contactar Soporte
            </button>
            <button className="bg-purple-700 text-white border border-purple-500 px-6 py-3 rounded-lg hover:bg-purple-800 transition-colors">
              Ver Preguntas Frecuentes
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
              <p className="text-sm text-purple-100">soporte@resmoke.com</p>
            </div>
            
            <div>
              <div className="bg-purple-500 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="font-semibold mb-1">Chat en vivo</h3>
              <p className="text-sm text-purple-100">Lun-Vie 9:00-18:00</p>
            </div>
            
            <div>
              <div className="bg-purple-500 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <h3 className="font-semibold mb-1">Teléfono</h3>
              <p className="text-sm text-purple-100">900 123 456</p>
            </div>
          </div>
        </div>
      </section>
    </div>
    </>
  );
};

export default CreateAccountPage;