import React, { useState } from 'react';
import SEO from '../../components/SEO/SEO';

const SecurityTipsPage = () => {
  const [copied, setCopied] = useState(null);
  const handleCopy = async (text, label) => {
    try {
      await navigator.clipboard?.writeText(text);
      setCopied(label);
      setTimeout(() => setCopied(null), 2000);
    } catch (e) {}
  };
  return (
    <>
      <SEO title="Consejos de Seguridad Avanzados" description="Consejos avanzados de seguridad para proteger tu cuenta y transacciones en Resmoke." url="/consejos-seguridad-avanzados"/>
      <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7">
              <span className="inline-block px-4 py-1 mb-4 rounded-full bg-blue-50 ring-1 ring-blue-200 text-sm tracking-wide text-blue-700">Resmoke</span>
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900">Consejos de Seguridad</h1>
              <p className="mt-4 text-lg text-gray-600 max-w-xl">Mantén tu cuenta y transacciones seguras en Resmoke</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <a href="/contactar-soporte" className="inline-flex items-center px-5 py-3 rounded-xl bg-gray-900 text-white hover:bg-gray-800 transition">Contactar soporte</a>
                <a href="/proteccion-datos" className="inline-flex items-center px-5 py-3 rounded-xl ring-1 ring-gray-300 text-gray-900 hover:bg-gray-50 transition">Protección de datos</a>
              </div>
              <div className="mt-8 grid grid-cols-3 gap-6 text-center">
                <div className="bg-white/70 backdrop-blur rounded-xl ring-1 ring-gray-200 p-4 shadow-sm">
                  <p className="text-2xl font-bold text-gray-900">2FA</p>
                  <p className="text-xs text-gray-500">autenticación</p>
                </div>
                <div className="bg-white/70 backdrop-blur rounded-xl ring-1 ring-gray-200 p-4 shadow-sm">
                  <p className="text-2xl font-bold text-gray-900">Privacidad</p>
                  <p className="text-xs text-gray-500">controlada</p>
                </div>
                <div className="bg-white/70 backdrop-blur rounded-xl ring-1 ring-gray-200 p-4 shadow-sm">
                  <p className="text-2xl font-bold text-gray-900">Seguridad</p>
                  <p className="text-xs text-gray-500">actualizada</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Security Fundamentals */}
      <section className="py-12 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Fundamentos de Seguridad</h2>
            <p className="text-lg text-gray-600">
              Sigue estos consejos básicos para proteger tu cuenta y información personal.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white/80 backdrop-blur rounded-2xl p-6 text-center ring-1 ring-gray-200 shadow-sm hover:shadow-md transition">
              <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Contraseña Segura</h3>
              <p className="text-gray-600 text-sm">Usa contraseñas únicas y complejas</p>
            </div>
            
            <div className="bg-white/80 backdrop-blur rounded-2xl p-6 text-center ring-1 ring-gray-200 shadow-sm hover:shadow-md transition">
              <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Autenticación 2FA</h3>
              <p className="text-gray-600 text-sm">Activa la verificación en dos pasos</p>
            </div>
            
            <div className="bg-white/80 backdrop-blur rounded-2xl p-6 text-center ring-1 ring-gray-200 shadow-sm hover:shadow-md transition">
              <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Monitoreo Regular</h3>
              <p className="text-gray-600 text-sm">Revisa tu actividad frecuentemente</p>
            </div>
          </div>
        </div>
      </section>

      {/* Password Security */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Seguridad de Contraseñas</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white/80 backdrop-blur rounded-2xl p-6 shadow-sm ring-1 ring-gray-200">
              <div className="flex items-center mb-4">
                <div className="bg-gray-100 w-12 h-12 rounded-full flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900">Buenas Prácticas</h3>
              </div>
              
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-gray-900 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Usa al menos 12 caracteres</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-gray-900 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Combina letras, números y símbolos</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-gray-900 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Usa mayúsculas y minúsculas</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-gray-900 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Crea contraseñas únicas para cada cuenta</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-gray-900 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Usa un gestor de contraseñas</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-gray-900 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Cambia contraseñas comprometidas inmediatamente</span>
                </li>
              </ul>
            </div>

            <div className="bg-white/80 backdrop-blur rounded-2xl p-6 shadow-sm ring-1 ring-gray-200">
              <div className="flex items-center mb-4">
                <div className="bg-gray-100 w-12 h-12 rounded-full flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900">Evita Estos Errores</h3>
              </div>
              
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-gray-900 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <span>Usar información personal (nombres, fechas)</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-gray-900 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <span>Reutilizar la misma contraseña</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-gray-900 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <span>Compartir contraseñas con otros</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-gray-900 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <span>Guardar contraseñas en el navegador público</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-gray-900 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <span>Usar secuencias obvias (123456, qwerty)</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-gray-900 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <span>Escribir contraseñas en lugares visibles</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Account Security */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Seguridad de la Cuenta</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Two-Factor Authentication */}
            <div className="bg-white/80 backdrop-blur rounded-2xl p-6 shadow-sm ring-1 ring-gray-200">
              <div className="flex items-center mb-4">
                <div className="bg-gray-100 w-12 h-12 rounded-full flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900">Autenticación 2FA</h3>
              </div>
              <p className="text-gray-600 mb-4">Agrega una capa extra de seguridad a tu cuenta.</p>
              
              <div className="space-y-2">
                <h4 className="font-semibold text-gray-900">Opciones disponibles:</h4>
                <ul className="text-sm text-gray-600 space-y-1 ml-4">
                  <li>• SMS (mensaje de texto)</li>
                  <li>• Aplicación autenticadora</li>
                  <li>• Email de verificación</li>
                  <li>• Llaves de seguridad físicas</li>
                </ul>
              </div>
            </div>

            {/* Login Monitoring */}
            <div className="bg-white/80 backdrop-blur rounded-2xl p-6 shadow-sm ring-1 ring-gray-200">
              <div className="flex items-center mb-4">
                <div className="bg-gray-100 w-12 h-12 rounded-full flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900">Monitoreo de Acceso</h3>
              </div>
              <p className="text-gray-600 mb-4">Mantente al tanto de quién accede a tu cuenta.</p>
              
              <div className="space-y-2">
                <h4 className="font-semibold text-gray-900">Revisa regularmente:</h4>
                <ul className="text-sm text-gray-600 space-y-1 ml-4">
                  <li>• Historial de inicios de sesión</li>
                  <li>• Dispositivos conectados</li>
                  <li>• Ubicaciones de acceso</li>
                  <li>• Actividad sospechosa</li>
                </ul>
              </div>
            </div>

            {/* Privacy Settings */}
            <div className="bg-white/80 backdrop-blur rounded-2xl p-6 shadow-sm ring-1 ring-gray-200">
              <div className="flex items-center mb-4">
                <div className="bg-gray-100 w-12 h-12 rounded-full flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900">Configuración de Privacidad</h3>
              </div>
              <p className="text-gray-600 mb-4">Controla qué información compartes.</p>
              
              <div className="space-y-2">
                <h4 className="font-semibold text-gray-900">Ajusta la visibilidad de:</h4>
                <ul className="text-sm text-gray-600 space-y-1 ml-4">
                  <li>• Perfil público</li>
                  <li>• Historial de compras</li>
                  <li>• Lista de productos favoritos</li>
                  <li>• Información de contacto</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Safe Browsing */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Navegación Segura</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white/80 backdrop-blur rounded-2xl p-6 shadow-sm ring-1 ring-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Identifica Sitios Seguros</h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-gray-900 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Verifica que la URL comience con "https://"</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-gray-900 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Busca el ícono de candado en la barra de direcciones</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-gray-900 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Confirma que estás en el dominio oficial de Resmoke</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-gray-900 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Evita hacer clic en enlaces sospechosos</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-white/80 backdrop-blur rounded-2xl p-6 shadow-sm ring-1 ring-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Protégete del Phishing</h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-gray-900 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <span>Desconfía de emails urgentes pidiendo datos</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-gray-900 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <span>Nunca ingreses datos en enlaces de emails</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-gray-900 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <span>Verifica la autenticidad de comunicaciones</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-gray-900 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <span>Reporta intentos de phishing</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Device Security */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Seguridad del Dispositivo</h2>
          
          <div className="space-y-8">
            <div className="bg-white/80 backdrop-blur rounded-2xl p-6 ring-1 ring-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Mantén tus Dispositivos Seguros</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Computadoras:</h4>
                  <ul className="text-sm text-gray-600 space-y-1 ml-4">
                    <li>• Mantén el sistema operativo actualizado</li>
                    <li>• Usa antivirus confiable</li>
                    <li>• Activa el firewall</li>
                    <li>• No uses computadoras públicas para transacciones</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Móviles:</h4>
                  <ul className="text-sm text-gray-600 space-y-1 ml-4">
                    <li>• Configura bloqueo de pantalla</li>
                    <li>• Descarga apps solo de tiendas oficiales</li>
                    <li>• Mantén el sistema actualizado</li>
                    <li>• Usa redes WiFi seguras</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="bg-white/80 backdrop-blur rounded-2xl p-6 ring-1 ring-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4">WiFi y Conexiones</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Redes Seguras:</h4>
                  <ul className="text-sm text-gray-600 space-y-1 ml-4">
                    <li>• Usa tu red doméstica cuando sea posible</li>
                    <li>• Evita WiFi público para transacciones</li>
                    <li>• Verifica el nombre de la red antes de conectarte</li>
                    <li>• Usa VPN en redes públicas</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Señales de Alerta:</h4>
                  <ul className="text-sm text-gray-600 space-y-1 ml-4">
                    <li>• Redes sin contraseña en lugares públicos</li>
                    <li>• Nombres de red similares a lugares conocidos</li>
                    <li>• Solicitudes inesperadas de información</li>
                    <li>• Conexiones lentas o intermitentes</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Emergency Actions */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">¿Crees que tu Cuenta fue Comprometida?</h2>
          
          <div className="bg-white/80 backdrop-blur rounded-2xl p-8 shadow-sm ring-1 ring-gray-200">
            <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">Actúa Inmediatamente</h3>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-semibold text-gray-900 mb-4">Pasos Inmediatos:</h4>
                <ol className="space-y-3 text-gray-600">
                  <li className="flex items-start">
                    <span className="bg-gray-100 text-gray-900 w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-0.5">1</span>
                    <span>Cambia tu contraseña inmediatamente</span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-gray-100 text-gray-900 w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-0.5">2</span>
                    <span>Revisa tu actividad reciente</span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-gray-100 text-gray-900 w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-0.5">3</span>
                    <span>Cierra sesión en todos los dispositivos</span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-gray-100 text-gray-900 w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-0.5">4</span>
                    <span>Contacta soporte inmediatamente</span>
                  </li>
                </ol>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-900 mb-4">Información a Reportar:</h4>
                <ul className="space-y-2 text-gray-600">
                  <li>• Fecha y hora del incidente</li>
                  <li>• Actividad sospechosa observada</li>
                  <li>• Dispositivos y ubicaciones afectadas</li>
                  <li>• Cambios no autorizados en la cuenta</li>
                  <li>• Transacciones sospechosas</li>
                </ul>
                
                <div className="mt-6">
                  <button className="bg-gray-900 text-white px-6 py-3 rounded-xl font-semibold hover:bg-gray-800 transition-colors w-full">
                    Reportar Actividad Sospechosa
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Security Team */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Equipo de Seguridad</h2>
          <p className="text-lg text-gray-600 mb-8">
            Nuestro equipo de seguridad está disponible 24/7 para ayudarte con cualquier problema.
          </p>
          {copied && (
            <div className="mb-6 flex items-center justify-between bg-green-50 ring-1 ring-green-200 text-green-800 rounded-2xl p-4">
              <span className="text-sm">Copiado: {copied}</span>
              <button onClick={() => setCopied(null)} className="text-sm text-green-900 hover:underline">Cerrar</button>
            </div>
          )}
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white/80 backdrop-blur rounded-2xl p-6 shadow-sm ring-1 ring-gray-200">
              <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Línea de Emergencia</h3>
              <p className="text-gray-600 text-sm">+1 (555) 911-HELP</p>
              <div className="mt-2 flex items-center justify-center">
                <button onClick={() => handleCopy('+1 (555) 911-HELP', 'Teléfono emergencia')} className="ring-1 ring-gray-300 px-3 py-2 rounded-xl text-sm text-gray-900 hover:bg-gray-50">Copiar</button>
              </div>
              <p className="text-gray-500 text-xs">Disponible 24/7</p>
            </div>
            
            <div className="bg-white/80 backdrop-blur rounded-2xl p-6 shadow-sm ring-1 ring-gray-200">
              <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Email Seguridad</h3>
              <p className="text-gray-600 text-sm">security@resmoke.com</p>
              <div className="mt-2 flex items-center justify-center gap-3">
                <a href="mailto:security@resmoke.com" className="bg-gray-900 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-gray-800 transition">Enviar Email</a>
                <button onClick={() => handleCopy('security@resmoke.com', 'Email seguridad')} className="ring-1 ring-gray-300 px-3 py-2 rounded-xl text-sm text-gray-900 hover:bg-gray-50">Copiar</button>
              </div>
              <p className="text-gray-500 text-xs">Respuesta prioritaria</p>
            </div>
            
            <div className="bg-white/80 backdrop-blur rounded-2xl p-6 shadow-sm ring-1 ring-gray-200">
              <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Chat Seguro</h3>
              <p className="text-gray-600 text-sm">Desde tu cuenta</p>
              <p className="text-gray-500 text-xs">Encriptado end-to-end</p>
              <div className="mt-3">
                <a href="/chat" className="inline-block bg-gray-900 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-gray-800 transition">Abrir chat</a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
    </>
  );
};

export default SecurityTipsPage;