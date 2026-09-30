import React from 'react';
import SEO from '../../components/SEO/SEO';

const HowToSellPage = () => {
  return (
    <>
      <SEO title="Cómo Publicar un Producto" description="Guía completa para publicar y vender productos en Resmoke. Aprende a crear anuncios atractivos y vende con confianza." url="/como-publicar"/>
      <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6">
              <span className="inline-block px-4 py-1 mb-4 rounded-full bg-green-50 ring-1 ring-green-200 text-sm tracking-wide text-green-700">Vender</span>
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900">¿Cómo publicar un producto?</h1>
              <p className="mt-4 text-lg text-gray-600 max-w-xl">Guía rápida para crear un anuncio atractivo y vender con confianza.</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <a href="/add-product" className="inline-flex items-center px-5 py-3 rounded-xl bg-gray-900 text-white hover:bg-gray-800 transition">Empezar a vender</a>
                <a href="/consejos-fotos" className="inline-flex items-center px-5 py-3 rounded-xl ring-1 ring-gray-300 text-gray-900 hover:bg-gray-50 transition">Ver consejos</a>
              </div>
              <div className="mt-8 grid grid-cols-3 gap-6 text-center">
                <div className="bg-white/70 backdrop-blur rounded-xl ring-1 ring-gray-200 p-4 shadow-sm">
                  <p className="text-2xl font-bold text-gray-900">2 min</p>
                  <p className="text-xs text-gray-500">publicación</p>
                </div>
                <div className="bg-white/70 backdrop-blur rounded-xl ring-1 ring-gray-200 p-4 shadow-sm">
                  <p className="text-2xl font-bold text-gray-900">3-8</p>
                  <p className="text-xs text-gray-500">fotos recomendadas</p>
                </div>
                <div className="bg-white/70 backdrop-blur rounded-xl ring-1 ring-gray-200 p-4 shadow-sm">
                  <p className="text-2xl font-bold text-gray-900">Seguro</p>
                  <p className="text-xs text-gray-500">transacciones</p>
                </div>
              </div>
            </div>
            <div className="lg:col-span-6 relative">
              <div className="aspect-[4/3] rounded-2xl backdrop-blur overflow-hidden">
                <img src="https://cdn-icons-png.flaticon.com/512/891/891462.png" alt="Publicar producto" className="w-full h-full object-contain" />
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
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Vende con Éxito</h2>
            <p className="text-lg text-gray-600">
              Publicar un producto en Resmoke es fácil y rápido. Sigue nuestra guía paso a paso 
              para crear anuncios atractivos que generen ventas.
            </p>
          </div>
        </div>
      </section>

      {/* Requirements */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Antes de Empezar</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Account Requirements */}
            <div className="bg-white/80 backdrop-blur rounded-2xl p-6 ring-1 ring-gray-200 shadow-sm">
              <div className="flex items-center mb-4">
                <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900">Cuenta Verificada</h3>
              </div>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                  <span className="text-sm">Cuenta de usuario registrada</span>
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                  <span className="text-sm">Email verificado</span>
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                  <span className="text-sm">Perfil completo con foto</span>
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></span>
                  <span className="text-sm">Verificación de identidad (recomendado)</span>
                </li>
              </ul>
            </div>

            {/* Product Requirements */}
            <div className="bg-white/80 backdrop-blur rounded-2xl p-6 ring-1 ring-gray-200 shadow-sm">
              <div className="flex items-center mb-4">
                <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M9 1v6m6-6v6" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900">Producto Listo</h3>
              </div>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                  <span className="text-sm">Producto en buen estado</span>
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                  <span className="text-sm">Fotos de calidad preparadas</span>
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                  <span className="text-sm">Información técnica disponible</span>
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                  <span className="text-sm">Precio de mercado investigado</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Step by Step Guide */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Guía paso a paso</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="bg-white/80 backdrop-blur rounded-2xl p-6 ring-1 ring-gray-200 shadow-sm">
              <div className="flex items-center mb-4">
                <div className="bg-green-100 w-10 h-10 rounded-full flex items-center justify-center mr-3">
                  <span className="text-green-700 font-bold">1</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Accede a Vender</h3>
              </div>
              <p className="text-sm text-gray-600">Inicia sesión y entra a “Añadir Producto”.</p>
            </div>

            {/* Step 2 */}
            <div className="bg-white/80 backdrop-blur rounded-2xl p-6 ring-1 ring-gray-200 shadow-sm">
              <div className="flex items-center mb-4">
                <div className="bg-green-100 w-10 h-10 rounded-full flex items-center justify-center mr-3">
                  <span className="text-green-700 font-bold">2</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Elige categoría</h3>
              </div>
              <p className="text-sm text-gray-600">Selecciona la categoría y subcategoría más adecuada.</p>
            </div>

            {/* Step 3 */}
            <div className="bg-white/80 backdrop-blur rounded-2xl p-6 ring-1 ring-gray-200 shadow-sm">
              <div className="flex items-center mb-4">
                <div className="bg-green-100 w-10 h-10 rounded-full flex items-center justify-center mr-3">
                  <span className="text-green-700 font-bold">3</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Sube fotos</h3>
              </div>
              <p className="text-sm text-gray-600">Entre 3-8 fotos, bien iluminadas y nítidas.</p>
            </div>

            {/* Step 4 */}
            <div className="bg-white/80 backdrop-blur rounded-2xl p-6 ring-1 ring-gray-200 shadow-sm">
              <div className="flex items-center mb-4">
                <div className="bg-green-100 w-10 h-10 rounded-full flex items-center justify-center mr-3">
                  <span className="text-green-700 font-bold">4</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Completa la información</h3>
              </div>
              <p className="text-sm text-gray-600">Título, descripción, precio, estado y ubicación.</p>
            </div>

            {/* Step 5 */}
            <div className="bg-white/80 backdrop-blur rounded-2xl p-6 ring-1 ring-gray-200 shadow-sm">
              <div className="flex items-center mb-4">
                <div className="bg-green-100 w-10 h-10 rounded-full flex items-center justify-center mr-3">
                  <span className="text-green-700 font-bold">5</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Configura venta</h3>
              </div>
              <p className="text-sm text-gray-600">Método de entrega y pago preferido.</p>
            </div>

            {/* Step 6 */}
            <div className="bg-white/80 backdrop-blur rounded-2xl p-6 ring-1 ring-gray-200 shadow-sm">
              <div className="flex items-center mb-4">
                <div className="bg-green-100 w-10 h-10 rounded-full flex items-center justify-center mr-3">
                  <span className="text-green-700 font-bold">6</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Revisa y publica</h3>
              </div>
              <p className="text-sm text-gray-600">Verifica todo y publica tu anuncio.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Tips for Success */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Consejos para vender más rápido</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white/80 backdrop-blur rounded-2xl p-6 ring-1 ring-gray-200 shadow-sm">
              <div className="flex items-center mb-4">
                <div className="bg-green-100 w-10 h-10 rounded-full flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Qué sí hacer</h3>
              </div>
              <ul className="text-sm text-gray-700 space-y-2">
                <li>• Responde rápido</li>
                <li>• Sé honesto con el estado</li>
                <li>• Incluye accesorios</li>
                <li>• Ajusta el precio al mercado</li>
                <li>• Actualiza cambios relevantes</li>
              </ul>
            </div>
            <div className="bg-white/80 backdrop-blur rounded-2xl p-6 ring-1 ring-gray-200 shadow-sm">
              <div className="flex items-center mb-4">
                <div className="bg-red-100 w-10 h-10 rounded-full flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Qué no hacer</h3>
              </div>
              <ul className="text-sm text-gray-700 space-y-2">
                <li>• No uses fotos de internet</li>
                <li>• No ocultes defectos</li>
                <li>• No pongas precios exagerados</li>
                <li>• No ignores mensajes</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* After Publishing */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Después de Publicar</h2>
          
          <div className="space-y-8">
            <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
              <h3 className="text-xl font-bold text-blue-900 mb-4">Gestiona tu Anuncio</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-blue-800 mb-2">Monitoreo:</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Revisa las estadísticas de visualización</li>
                    <li>• Responde a preguntas y comentarios</li>
                    <li>• Actualiza si es necesario</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-blue-800 mb-2">Promoción:</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Comparte en redes sociales</li>
                    <li>• Considera destacar el anuncio</li>
                    <li>• Renueva si no hay interés</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
              <h3 className="text-xl font-bold text-yellow-900 mb-4">Proceso de Venta</h3>
              <div className="space-y-3">
                <div className="flex items-start">
                  <span className="bg-yellow-200 text-yellow-800 text-xs font-semibold px-2 py-1 rounded mr-3 mt-1">1</span>
                  <div>
                    <h4 className="font-semibold text-yellow-800">Recibe contactos</h4>
                    <p className="text-sm text-yellow-700">Los compradores interesados te contactarán a través del chat interno</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <span className="bg-yellow-200 text-yellow-800 text-xs font-semibold px-2 py-1 rounded mr-3 mt-1">2</span>
                  <div>
                    <h4 className="font-semibold text-yellow-800">Negocia términos</h4>
                    <p className="text-sm text-yellow-700">Acuerda precio final, método de pago y entrega</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <span className="bg-yellow-200 text-yellow-800 text-xs font-semibold px-2 py-1 rounded mr-3 mt-1">3</span>
                  <div>
                    <h4 className="font-semibold text-yellow-800">Completa la venta</h4>
                    <p className="text-sm text-yellow-700">Entrega el producto y recibe el pago acordado</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <span className="bg-yellow-200 text-yellow-800 text-xs font-semibold px-2 py-1 rounded mr-3 mt-1">4</span>
                  <div>
                    <h4 className="font-semibold text-yellow-800">Marca como vendido</h4>
                    <p className="text-sm text-yellow-700">Actualiza el estado del anuncio en tu panel</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Support */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            ¿Necesitas ayuda para publicar?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Nuestro equipo está aquí para ayudarte a crear el anuncio perfecto y maximizar tus ventas.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors">
              Crear Mi Primer Anuncio
            </button>
            <button className="bg-white text-green-600 border border-green-600 px-6 py-3 rounded-lg hover:bg-green-50 transition-colors">
              Contactar Soporte
            </button>
          </div>
        </div>
      </section>
    </div>
    </>
  );
};

export default HowToSellPage;