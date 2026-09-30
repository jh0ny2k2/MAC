import React from 'react';
import SEO from '../../components/SEO/SEO';

const PhotoTipsPage = () => {
  return (
    <>
      <SEO title="Consejos para Fotos" description="Aprende a tomar fotos profesionales que vendan tus productos más rápido en Resmoke." url="/consejos-fotos"/>
      <div className="min-h-screen bg-gray-50">
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6">
              <span className="inline-block px-4 py-1 mb-4 rounded-full bg-indigo-50 ring-1 ring-indigo-200 text-sm tracking-wide text-indigo-700">Vender</span>
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900">Consejos para Mejores Fotos</h1>
              <p className="mt-4 text-lg text-gray-600 max-w-xl">Aprende a tomar fotos profesionales que vendan tus productos más rápido.</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <a href="#equipo" className="inline-flex items-center px-5 py-3 rounded-xl bg-gray-900 text-white hover:bg-gray-800 transition">Ver equipo</a>
                <a href="#iluminacion" className="inline-flex items-center px-5 py-3 rounded-xl ring-1 ring-gray-300 text-gray-900 hover:bg-gray-50 transition">Guía de iluminación</a>
              </div>
              <div className="mt-8 grid grid-cols-3 gap-6 text-center">
                <div className="bg-white/70 backdrop-blur rounded-xl ring-1 ring-gray-200 p-4 shadow-sm">
                  <p className="text-2xl font-bold text-gray-900">+85%</p>
                  <p className="text-xs text-gray-500">más vistas</p>
                </div>
                <div className="bg-white/70 backdrop-blur rounded-xl ring-1 ring-gray-200 p-4 shadow-sm">
                  <p className="text-2xl font-bold text-gray-900">3x</p>
                  <p className="text-xs text-gray-500">más rápido</p>
                </div>
                <div className="bg-white/70 backdrop-blur rounded-xl ring-1 ring-gray-200 p-4 shadow-sm">
                  <p className="text-2xl font-bold text-gray-900">Mejor</p>
                  <p className="text-xs text-gray-500">precio</p>
                </div>
              </div>
            </div>
            <div className="lg:col-span-6 relative">
              <div className="aspect-[4/3] rounded-2xl backdrop-blur overflow-hidden">
                <img src="https://cdn-icons-png.flaticon.com/512/1077/1077012.png" alt="Consejos de fotografía" className="w-full h-full object-contain" />
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
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Las Fotos Venden</h2>
            <p className="text-lg text-gray-600">
              Las fotos son el factor más importante para el éxito de tu anuncio. Los compradores 
              toman decisiones basándose principalmente en lo que ven, no en lo que leen.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 mt-12">
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">+85% más vistas</h3>
              <p className="text-gray-600">Los anuncios con fotos de calidad reciben significativamente más visualizaciones</p>
            </div>
            
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">3x más rápido</h3>
              <p className="text-gray-600">Los productos con buenas fotos se venden hasta 3 veces más rápido</p>
            </div>
            
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Mejor precio</h3>
              <p className="text-gray-600">Las fotos profesionales permiten obtener mejores precios de venta</p>
            </div>
          </div>
        </div>
      </section>

      {/* Equipment Needed */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Equipo Necesario</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Basic Setup */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <div className="flex items-center mb-4">
                <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900">Configuración Básica</h3>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Smartphone moderno</h4>
                  <p className="text-sm text-gray-600">Cualquier teléfono de los últimos 3-4 años es suficiente</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Luz natural</h4>
                  <p className="text-sm text-gray-600">Una ventana grande con luz indirecta</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Fondo neutro</h4>
                  <p className="text-sm text-gray-600">Pared blanca, sábana o cartulina</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Superficie estable</h4>
                  <p className="text-sm text-gray-600">Mesa, trípode improvisado o apoyo firme</p>
                </div>
              </div>
              
              <div className="mt-4 p-3 bg-green-50 rounded-lg">
                <p className="text-sm text-green-700">
                  💰 <strong>Costo total:</strong> ¡Gratis! Solo necesitas lo que ya tienes en casa.
                </p>
              </div>
            </div>

            {/* Advanced Setup */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <div className="flex items-center mb-4">
                <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900">Configuración Avanzada</h3>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Cámara DSLR/Mirrorless</h4>
                  <p className="text-sm text-gray-600">Para máxima calidad de imagen</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Kit de iluminación</h4>
                  <p className="text-sm text-gray-600">Softboxes o luces LED difusas</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Lightbox/Caja de luz</h4>
                  <p className="text-sm text-gray-600">Para productos pequeños</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Trípode profesional</h4>
                  <p className="text-sm text-gray-600">Para estabilidad perfecta</p>
                </div>
              </div>
              
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-700">
                  💡 <strong>Recomendado para:</strong> Vendedores frecuentes o productos de alto valor.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Lighting Guide */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Guía de Iluminación</h2>
          
          <div className="space-y-8">
            {/* Natural Light */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <div className="bg-yellow-100 w-12 h-12 rounded-full flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Luz Natural (Recomendado)</h3>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-yellow-800 mb-3">✅ Mejores momentos:</h4>
                  <ul className="text-sm text-yellow-700 space-y-1">
                    <li>• 10:00 - 14:00 horas</li>
                    <li>• Días nublados (luz difusa)</li>
                    <li>• Cerca de ventanas grandes</li>
                    <li>• Luz indirecta, no sol directo</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold text-yellow-800 mb-3">❌ Evitar:</h4>
                  <ul className="text-sm text-yellow-700 space-y-1">
                    <li>• Sol directo (crea sombras duras)</li>
                    <li>• Atardecer/amanecer (luz naranja)</li>
                    <li>• Días muy oscuros</li>
                    <li>• Contraluz (producto a oscuras)</li>
                  </ul>
                </div>
              </div>
              
              <div className="mt-4 p-4 bg-yellow-100 rounded-lg">
                <h4 className="font-semibold text-yellow-800 mb-2">💡 Truco profesional:</h4>
                <p className="text-sm text-yellow-700">
                  Coloca una cortina blanca o papel vegetal en la ventana para difumir la luz y eliminar sombras duras.
                </p>
              </div>
            </div>

            {/* Artificial Light */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Luz Artificial</h3>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-blue-800 mb-3">✅ Buenas opciones:</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Luces LED blancas (5000K-6500K)</li>
                    <li>• Lámparas de escritorio con difusor</li>
                    <li>• Ring lights para productos pequeños</li>
                    <li>• Múltiples fuentes de luz suave</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold text-blue-800 mb-3">❌ Evitar:</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Bombillas amarillas/cálidas</li>
                    <li>• Flash directo de la cámara</li>
                    <li>• Una sola fuente de luz intensa</li>
                    <li>• Luces fluorescentes viejas</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Composition Tips */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Composición y Ángulos</h2>
          
          <div className="space-y-8">
            {/* Main Photo */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="bg-red-100 text-red-600 text-sm font-semibold px-2 py-1 rounded mr-3">PRINCIPAL</span>
                Foto Principal
              </h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Características:</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Producto centrado y completo</li>
                    <li>• Fondo limpio y neutro</li>
                    <li>• Buena iluminación uniforme</li>
                    <li>• Enfoque nítido en todo el producto</li>
                    <li>• Ángulo ligeramente superior</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Propósito:</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Primera impresión del comprador</li>
                    <li>• Aparece en resultados de búsqueda</li>
                    <li>• Define si hacen clic o no</li>
                    <li>• Debe mostrar el producto completo</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Detail Photos */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="bg-blue-100 text-blue-600 text-sm font-semibold px-2 py-1 rounded mr-3">DETALLE</span>
                Fotos de Detalle
              </h3>
              
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Ángulos importantes:</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Frente</li>
                    <li>• Atrás</li>
                    <li>• Laterales</li>
                    <li>• Superior</li>
                    <li>• Inferior (si relevante)</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Características específicas:</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Etiquetas y marcas</li>
                    <li>• Puertos y conexiones</li>
                    <li>• Botones y controles</li>
                    <li>• Pantallas encendidas</li>
                    <li>• Accesorios incluidos</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Estado del producto:</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Rayones o marcas</li>
                    <li>• Desgaste normal</li>
                    <li>• Defectos menores</li>
                    <li>• Zonas de uso</li>
                    <li>• Limpieza general</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Context Photos */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="bg-green-100 text-green-600 text-sm font-semibold px-2 py-1 rounded mr-3">CONTEXTO</span>
                Fotos de Contexto
              </h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Tamaño y escala:</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Junto a objetos conocidos (moneda, regla)</li>
                    <li>• En manos para mostrar tamaño</li>
                    <li>• Comparación con productos similares</li>
                    <li>• En su entorno de uso natural</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Funcionalidad:</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Producto en funcionamiento</li>
                    <li>• Pantallas encendidas</li>
                    <li>• Accesorios conectados</li>
                    <li>• Demostrando su uso</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technical Settings */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Configuración Técnica</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Smartphone Settings */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <div className="bg-blue-100 w-10 h-10 rounded-full flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Configuración Smartphone</h3>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-blue-800 mb-2">Resolución:</h4>
                  <p className="text-sm text-blue-700">Máxima calidad disponible (generalmente 12MP+)</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-blue-800 mb-2">Formato:</h4>
                  <p className="text-sm text-blue-700">JPEG para compatibilidad, HEIC si planeas editar</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-blue-800 mb-2">HDR:</h4>
                  <p className="text-sm text-blue-700">Activado para mejor rango dinámico</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-blue-800 mb-2">Flash:</h4>
                  <p className="text-sm text-blue-700">Siempre desactivado (usa luz natural)</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-blue-800 mb-2">Enfoque:</h4>
                  <p className="text-sm text-blue-700">Toca la pantalla en el producto para enfocar</p>
                </div>
              </div>
            </div>

            {/* Camera Settings */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <div className="bg-gray-100 w-10 h-10 rounded-full flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Configuración Cámara DSLR</h3>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Apertura (f/):</h4>
                  <p className="text-sm text-gray-700">f/8 - f/11 para máxima nitidez</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">ISO:</h4>
                  <p className="text-sm text-gray-700">100-400 para mínimo ruido</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Velocidad:</h4>
                  <p className="text-sm text-gray-700">1/60s o más rápida (usar trípode)</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Balance de blancos:</h4>
                  <p className="text-sm text-gray-700">Luz día o personalizado según iluminación</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Enfoque:</h4>
                  <p className="text-sm text-gray-700">Manual o AF-S en punto único</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Common Mistakes */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Errores Comunes a Evitar</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Technical Mistakes */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <div className="bg-red-100 w-10 h-10 rounded-full flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Errores Técnicos</h3>
              </div>
              
              <ul className="text-sm text-red-700 space-y-2">
                <li>• <strong>Fotos borrosas:</strong> Manos temblorosas o enfoque incorrecto</li>
                <li>• <strong>Muy oscuras:</strong> Iluminación insuficiente</li>
                <li>• <strong>Muy claras:</strong> Sobreexposición por exceso de luz</li>
                <li>• <strong>Colores incorrectos:</strong> Balance de blancos mal ajustado</li>
                <li>• <strong>Ruido/grano:</strong> ISO demasiado alto</li>
                <li>• <strong>Distorsión:</strong> Usar zoom digital en smartphone</li>
                <li>• <strong>Compresión excesiva:</strong> Archivos muy pequeños</li>
              </ul>
            </div>

            {/* Composition Mistakes */}
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <div className="bg-orange-100 w-10 h-10 rounded-full flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Errores de Composición</h3>
              </div>
              
              <ul className="text-sm text-orange-700 space-y-2">
                <li>• <strong>Fondo desordenado:</strong> Objetos que distraen</li>
                <li>• <strong>Producto cortado:</strong> No se ve completo</li>
                <li>• <strong>Muy lejos:</strong> Producto muy pequeño en la foto</li>
                <li>• <strong>Muy cerca:</strong> No se aprecia el contexto</li>
                <li>• <strong>Ángulo extraño:</strong> Perspectiva poco natural</li>
                <li>• <strong>Sombras duras:</strong> Luz directa muy intensa</li>
                <li>• <strong>Reflejos molestos:</strong> En superficies brillantes</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Checklist */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Lista de Verificación Rápida</h2>
          
          <div className="bg-green-50 border border-green-200 rounded-lg p-8">
            <h3 className="text-xl font-bold text-green-900 mb-6 text-center">Antes de Subir tus Fotos</h3>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-semibold text-green-800 mb-4">✅ Verificación técnica:</h4>
                <ul className="text-sm text-green-700 space-y-2">
                  <li>□ Fotos nítidas y bien enfocadas</li>
                  <li>□ Buena iluminación sin sombras duras</li>
                  <li>□ Colores naturales y realistas</li>
                  <li>□ Resolución mínima 800x600</li>
                  <li>□ Formato JPG o PNG</li>
                  <li>□ Tamaño menor a 5MB cada una</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold text-green-800 mb-4">✅ Verificación de contenido:</h4>
                <ul className="text-sm text-green-700 space-y-2">
                  <li>□ Producto limpio y presentable</li>
                  <li>□ Todos los ángulos importantes</li>
                  <li>□ Defectos visibles documentados</li>
                  <li>□ Accesorios incluidos mostrados</li>
                  <li>□ Fondo neutro y limpio</li>
                  <li>□ Mínimo 3 fotos, máximo 8</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tools and Apps */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Herramientas de Edición Recomendadas</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Free Apps */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-4 text-center">Apps Gratuitas</h3>
              
              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold text-gray-900">VSCO</h4>
                  <p className="text-sm text-gray-600">Filtros profesionales y ajustes básicos</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900">Snapseed</h4>
                  <p className="text-sm text-gray-600">Editor completo de Google</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900">Canva</h4>
                  <p className="text-sm text-gray-600">Para crear collages y marcos</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900">Adobe Lightroom</h4>
                  <p className="text-sm text-gray-600">Versión móvil gratuita</p>
                </div>
              </div>
            </div>

            {/* Paid Apps */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-4 text-center">Apps Premium</h3>
              
              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold text-gray-900">Adobe Photoshop</h4>
                  <p className="text-sm text-gray-600">Editor profesional completo</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900">Affinity Photo</h4>
                  <p className="text-sm text-gray-600">Alternativa profesional a Photoshop</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900">Capture One</h4>
                  <p className="text-sm text-gray-600">Para fotógrafos profesionales</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900">Luminar</h4>
                  <p className="text-sm text-gray-600">Editor con IA integrada</p>
                </div>
              </div>
            </div>

            {/* Online Tools */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-4 text-center">Herramientas Online</h3>
              
              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold text-gray-900">Photopea</h4>
                  <p className="text-sm text-gray-600">Photoshop gratuito en el navegador</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900">Remove.bg</h4>
                  <p className="text-sm text-gray-600">Eliminar fondos automáticamente</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900">Pixlr</h4>
                  <p className="text-sm text-gray-600">Editor online completo</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900">Fotor</h4>
                  <p className="text-sm text-gray-600">Retoque rápido y efectos</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final Tips */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            ¿Listo para tomar fotos profesionales?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Recuerda: las mejores fotos son las que muestran tu producto de manera honesta y atractiva. 
            La práctica hace al maestro, ¡así que no tengas miedo de experimentar!
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors">
              Crear Mi Primer Anuncio
            </button>
            <button className="bg-white text-indigo-600 border border-indigo-600 px-6 py-3 rounded-lg hover:bg-indigo-50 transition-colors">
              Ver Más Consejos
            </button>
          </div>
        </div>
      </section>
    </div>
    </>
  );
};

export default PhotoTipsPage;