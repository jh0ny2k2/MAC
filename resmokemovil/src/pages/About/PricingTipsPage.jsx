import React from 'react';
import SEO from '../../components/SEO/SEO';

const PricingTipsPage = () => {
  return (
    <>
      <SEO title="Cómo Fijar Precios" description="Aprende a establecer precios competitivos que vendan rápido y maximicen tus ganancias en Resmoke." url="/fijar-precios"/>
      <div className="min-h-screen bg-gray-50">
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6">
              <span className="inline-block px-4 py-1 mb-4 rounded-full bg-green-50 ring-1 ring-green-200 text-sm tracking-wide text-green-700">Vender</span>
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900">Cómo Fijar Precios Competitivos</h1>
              <p className="mt-4 text-lg text-gray-600 max-w-xl">Aprende a establecer precios que vendan rápido y maximicen tus ganancias.</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <a href="#investigacion" className="inline-flex items-center px-5 py-3 rounded-xl bg-gray-900 text-white hover:bg-gray-800 transition">Fase de investigación</a>
                <a href="#estrategias" className="inline-flex items-center px-5 py-3 rounded-xl ring-1 ring-gray-300 text-gray-900 hover:bg-gray-50 transition">Estrategias de precio</a>
              </div>
              <div className="mt-8 grid grid-cols-3 gap-6 text-center">
                <div className="bg-white/70 backdrop-blur rounded-xl ring-1 ring-gray-200 p-4 shadow-sm">
                  <p className="text-2xl font-bold text-gray-900">Equilibrio</p>
                  <p className="text-xs text-gray-500">precio/velocidad</p>
                </div>
                <div className="bg-white/70 backdrop-blur rounded-xl ring-1 ring-gray-200 p-4 shadow-sm">
                  <p className="text-2xl font-bold text-gray-900">Datos</p>
                  <p className="text-xs text-gray-500">comparativos</p>
                </div>
                <div className="bg-white/70 backdrop-blur rounded-xl ring-1 ring-gray-200 p-4 shadow-sm">
                  <p className="text-2xl font-bold text-gray-900">Demanda</p>
                  <p className="text-xs text-gray-500">del mercado</p>
                </div>
              </div>
            </div>
            <div className="lg:col-span-6 relative">
              <div className="aspect-[4/3] rounded-2xl backdrop-blur overflow-hidden">
                <img src="https://cdn-icons-png.flaticon.com/512/747/747593.png" alt="Consejos de precios" className="w-full h-full object-contain" />
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
            <h2 className="text-3xl font-bold text-gray-900 mb-4">El Arte de Fijar Precios</h2>
            <p className="text-lg text-gray-600">
              Establecer el precio correcto es crucial para el éxito de tu venta. Un precio bien 
              calculado puede ser la diferencia entre vender rápido o que tu producto se quede sin venderse.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 mt-12">
            <div className="text-center">
              <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Precio muy alto</h3>
              <p className="text-gray-600">Pocos compradores interesados, producto sin venderse</p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Precio equilibrado</h3>
              <p className="text-gray-600">Atrae compradores y maximiza el valor de tu producto</p>
            </div>
            
            <div className="text-center">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Precio muy bajo</h3>
              <p className="text-gray-600">Pierdes dinero y generas desconfianza en los compradores</p>
            </div>
          </div>
        </div>
      </section>

      {/* Research Phase */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Fase 1: Investigación de Mercado</h2>
          
          <div className="space-y-8">
            {/* Market Research */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <div className="flex items-center mb-4">
                <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Investiga la Competencia</h3>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">¿Qué buscar?</h4>
                  <ul className="text-sm text-gray-700 space-y-2">
                    <li>• <strong>Productos idénticos:</strong> Misma marca, modelo y estado</li>
                    <li>• <strong>Productos similares:</strong> Características parecidas</li>
                    <li>• <strong>Rango de precios:</strong> Precio mínimo y máximo del mercado</li>
                    <li>• <strong>Tiempo en venta:</strong> Cuánto llevan publicados</li>
                    <li>• <strong>Estado de los productos:</strong> Nuevo, usado, con defectos</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">¿Dónde buscar?</h4>
                  <ul className="text-sm text-gray-700 space-y-2">
                    <li>• <strong>Plataformas de segunda mano:</strong> Wallapop, Milanuncios, Vinted</li>
                    <li>• <strong>Tiendas online:</strong> Amazon, eBay, AliExpress</li>
                    <li>• <strong>Tiendas físicas:</strong> Precios de referencia nuevos</li>
                    <li>• <strong>Foros especializados:</strong> Comunidades del producto</li>
                    <li>• <strong>Redes sociales:</strong> Grupos de compra-venta</li>
                  </ul>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">💡 Truco profesional:</h4>
                <p className="text-sm text-blue-700">
                  Crea una tabla comparativa con al menos 5-10 productos similares. Anota precio, 
                  estado, tiempo publicado y características especiales.
                </p>
              </div>
            </div>

            {/* Price Analysis */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <div className="flex items-center mb-4">
                <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2-2V7a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 002 2h2a2 2 0 012-2V7a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 00-2 2v6a2 2 0 01-2 2H9a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Analiza los Datos</h3>
              </div>
              
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Calcula el precio promedio:</h4>
                  <div className="text-sm text-gray-700">
                    <p className="mb-2"><strong>Ejemplo:</strong> iPhone 12 de 128GB usado en buen estado</p>
                    <ul className="space-y-1 ml-4">
                      <li>• Anuncio 1: 450€ (publicado hace 2 semanas)</li>
                      <li>• Anuncio 2: 420€ (publicado hace 1 semana)</li>
                      <li>• Anuncio 3: 480€ (publicado hace 3 días)</li>
                      <li>• Anuncio 4: 440€ (publicado hace 5 días)</li>
                      <li>• Anuncio 5: 460€ (publicado ayer)</li>
                    </ul>
                    <p className="mt-2 font-semibold text-purple-600">Precio promedio: 450€</p>
                  </div>
                </div>
                
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-red-50 rounded-lg">
                    <h5 className="font-semibold text-red-800">Precio Alto</h5>
                    <p className="text-2xl font-bold text-red-600">480€+</p>
                    <p className="text-sm text-red-700">Venta lenta pero mayor ganancia</p>
                  </div>
                  
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <h5 className="font-semibold text-green-800">Precio Competitivo</h5>
                    <p className="text-2xl font-bold text-green-600">440-460€</p>
                    <p className="text-sm text-green-700">Equilibrio entre precio y velocidad</p>
                  </div>
                  
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <h5 className="font-semibold text-blue-800">Precio Rápido</h5>
                    <p className="text-2xl font-bold text-blue-600">420-440€</p>
                    <p className="text-sm text-blue-700">Venta rápida, menor ganancia</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Factors to Consider */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Fase 2: Factores que Afectan el Precio</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Product Condition */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <div className="bg-yellow-100 w-8 h-8 rounded-full flex items-center justify-center mr-3">
                  <svg className="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                </div>
                Estado del Producto
              </h3>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-white rounded">
                  <span className="font-medium text-gray-900">Como nuevo</span>
                  <span className="text-green-600 font-semibold">90-95% precio nuevo</span>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-white rounded">
                  <span className="font-medium text-gray-900">Muy buen estado</span>
                  <span className="text-blue-600 font-semibold">75-85% precio nuevo</span>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-white rounded">
                  <span className="font-medium text-gray-900">Buen estado</span>
                  <span className="text-yellow-600 font-semibold">60-75% precio nuevo</span>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-white rounded">
                  <span className="font-medium text-gray-900">Estado regular</span>
                  <span className="text-orange-600 font-semibold">40-60% precio nuevo</span>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-white rounded">
                  <span className="font-medium text-gray-900">Para reparar</span>
                  <span className="text-red-600 font-semibold">20-40% precio nuevo</span>
                </div>
              </div>
            </div>

            {/* Other Factors */}
            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="text-lg font-bold text-blue-900 mb-3">Antigüedad del Producto</h3>
                <ul className="text-sm text-blue-800 space-y-2">
                  <li>• <strong>Menos de 6 meses:</strong> Precio alto</li>
                  <li>• <strong>6 meses - 1 año:</strong> Precio medio-alto</li>
                  <li>• <strong>1-2 años:</strong> Precio medio</li>
                  <li>• <strong>2-3 años:</strong> Precio medio-bajo</li>
                  <li>• <strong>Más de 3 años:</strong> Precio bajo</li>
                </ul>
              </div>
              
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <h3 className="text-lg font-bold text-green-900 mb-3">Demanda del Producto</h3>
                <ul className="text-sm text-green-800 space-y-2">
                  <li>• <strong>Alta demanda:</strong> Puedes pedir precio más alto</li>
                  <li>• <strong>Producto descontinuado:</strong> Valor de colección</li>
                  <li>• <strong>Temporada alta:</strong> Aumenta el precio</li>
                  <li>• <strong>Baja demanda:</strong> Reduce el precio</li>
                  <li>• <strong>Muchos en venta:</strong> Sé más competitivo</li>
                </ul>
              </div>
              
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                <h3 className="text-lg font-bold text-purple-900 mb-3">Accesorios Incluidos</h3>
                <ul className="text-sm text-purple-800 space-y-2">
                  <li>• <strong>Caja original:</strong> +5-10% del precio</li>
                  <li>• <strong>Cargador original:</strong> +3-5% del precio</li>
                  <li>• <strong>Manuales/garantía:</strong> +2-3% del precio</li>
                  <li>• <strong>Accesorios extra:</strong> Suma su valor</li>
                  <li>• <strong>Sin accesorios:</strong> -10-15% del precio</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Strategies */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Fase 3: Estrategias de Precio</h2>
          
          <div className="space-y-8">
            {/* Quick Sale Strategy */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <div className="flex items-center mb-4">
                <div className="bg-red-100 w-10 h-10 rounded-full flex items-center justify-center mr-4">
                  <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900">Estrategia de Venta Rápida</h3>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">¿Cuándo usarla?</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Necesitas dinero urgentemente</li>
                    <li>• Te mudas pronto</li>
                    <li>• El producto se deprecia rápidamente</li>
                    <li>• Hay mucha competencia</li>
                    <li>• Quieres liberar espacio</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Cómo aplicarla:</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Precio 10-15% por debajo del promedio</li>
                    <li>• Añade "VENTA RÁPIDA" al título</li>
                    <li>• Acepta negociaciones</li>
                    <li>• Ofrece entrega inmediata</li>
                    <li>• Sé flexible con el pago</li>
                  </ul>
                </div>
              </div>
              
              <div className="mt-4 p-3 bg-red-50 rounded-lg">
                <p className="text-sm text-red-700">
                  <strong>Ventaja:</strong> Venta garantizada en pocos días. 
                  <strong>Desventaja:</strong> Menor ganancia económica.
                </p>
              </div>
            </div>

            {/* Maximum Profit Strategy */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <div className="flex items-center mb-4">
                <div className="bg-green-100 w-10 h-10 rounded-full flex items-center justify-center mr-4">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900">Estrategia de Máxima Ganancia</h3>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">¿Cuándo usarla?</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• No tienes prisa por vender</li>
                    <li>• Producto único o raro</li>
                    <li>• Excelente estado del producto</li>
                    <li>• Poca competencia directa</li>
                    <li>• Alta demanda del producto</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Cómo aplicarla:</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Precio 5-10% por encima del promedio</li>
                    <li>• Destaca características únicas</li>
                    <li>• Fotos profesionales</li>
                    <li>• Descripción detallada</li>
                    <li>• Paciencia para esperar al comprador ideal</li>
                  </ul>
                </div>
              </div>
              
              <div className="mt-4 p-3 bg-green-50 rounded-lg">
                <p className="text-sm text-green-700">
                  <strong>Ventaja:</strong> Máxima ganancia económica. 
                  <strong>Desventaja:</strong> Puede tardar semanas o meses en venderse.
                </p>
              </div>
            </div>

            {/* Balanced Strategy */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <div className="flex items-center mb-4">
                <div className="bg-blue-100 w-10 h-10 rounded-full flex items-center justify-center mr-4">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900">Estrategia Equilibrada (Recomendada)</h3>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">¿Cuándo usarla?</h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• La mayoría de situaciones</li>
                  <li>• Quieres vender en 1-2 semanas</li>
                  <li>• Producto común en el mercado</li>
                  <li>• Competencia moderada</li>
                  <li>• Buscas un equilibrio precio-tiempo</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Cómo aplicarla:</h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Precio igual al promedio del mercado</li>
                  <li>• Acepta negociaciones menores (5-10%)</li>
                  <li>• Buena presentación del producto</li>
                  <li>• Respuesta rápida a consultas</li>
                  <li>• Flexibilidad en entrega y pago</li>
                </ul>
              </div>
            </div>
            
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-700">
                <strong>Ventaja:</strong> Buen equilibrio entre precio y velocidad de venta. 
                <strong>Desventaja:</strong> No maximiza ninguno de los dos aspectos.
              </p>
            </div>
            </div>
          </div>
        </div>
      </section>

      {/* Negotiation Tips */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Fase 4: Negociación Inteligente</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Negotiation Dos */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h3 className="text-xl font-bold text-green-900 mb-4 flex items-center">
                <svg className="w-6 h-6 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Qué SÍ hacer
              </h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-green-800 mb-2">Establece un margen de negociación:</h4>
                  <p className="text-sm text-green-700">Si quieres 400€, publica a 450€ para tener margen de negociación.</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-green-800 mb-2">Sé flexible pero firme:</h4>
                  <p className="text-sm text-green-700">Acepta ofertas razonables pero no te dejes presionar por precios muy bajos.</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-green-800 mb-2">Justifica tu precio:</h4>
                  <p className="text-sm text-green-700">Explica por qué vale ese precio: estado, accesorios, precio original, etc.</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-green-800 mb-2">Ofrece valor añadido:</h4>
                  <p className="text-sm text-green-700">En lugar de bajar precio, ofrece entrega gratis o accesorios extra.</p>
                </div>
              </div>
            </div>

            {/* Negotiation Don'ts */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <h3 className="text-xl font-bold text-red-900 mb-4 flex items-center">
                <svg className="w-6 h-6 text-red-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Qué NO hacer
              </h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-red-800 mb-2">No aceptes ofertas muy bajas:</h4>
                  <p className="text-sm text-red-700">Ofertas del 50% o menos del precio suelen ser de revendedores.</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-red-800 mb-2">No bajes el precio inmediatamente:</h4>
                  <p className="text-sm text-red-700">Espera a tener varias consultas antes de considerar reducir el precio.</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-red-800 mb-2">No te dejes presionar:</h4>
                  <p className="text-sm text-red-700">Frases como "es mi última oferta" suelen ser tácticas de presión.</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-red-800 mb-2">No ignores el mercado:</h4>
                  <p className="text-sm text-red-700">Si nadie muestra interés en 2 semanas, probablemente el precio es alto.</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Negotiation Examples */}
          <div className="mt-8 bg-gray-50 rounded-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Ejemplos de Respuestas a Ofertas</h3>
            
            <div className="space-y-4">
              <div className="bg-white rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <div className="bg-red-100 w-8 h-8 rounded-full flex items-center justify-center">
                    <span className="text-red-600 font-bold text-sm">❌</span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-700 mb-1"><strong>Oferta:</strong> "Te doy 200€ por el iPhone que pides 450€"</p>
                    <p className="text-sm text-red-600"><strong>Respuesta:</strong> "Gracias por tu interés, pero el precio está muy por debajo del valor de mercado. El precio mínimo sería 400€."</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <div className="bg-yellow-100 w-8 h-8 rounded-full flex items-center justify-center">
                    <span className="text-yellow-600 font-bold text-sm">⚠️</span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-700 mb-1"><strong>Oferta:</strong> "¿Aceptarías 380€?"</p>
                    <p className="text-sm text-yellow-600"><strong>Respuesta:</strong> "Podría considerar 420€. El producto está en excelente estado y incluye todos los accesorios originales."</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <div className="bg-green-100 w-8 h-8 rounded-full flex items-center justify-center">
                    <span className="text-green-600 font-bold text-sm">✅</span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-700 mb-1"><strong>Oferta:</strong> "¿Te parece bien 430€?"</p>
                    <p className="text-sm text-green-600"><strong>Respuesta:</strong> "Perfecto, me parece una oferta justa. ¿Cuándo te vendría bien quedar para la entrega?"</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Price Adjustment */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Cuándo y Cómo Ajustar el Precio</h2>
          
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Señales para Reducir el Precio</h3>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-semibold text-gray-900 mb-4">Indicadores de tiempo:</h4>
                <ul className="text-sm text-gray-700 space-y-2">
                  <li>• <strong>1 semana:</strong> Pocas visualizaciones → Revisa fotos y descripción</li>
                  <li>• <strong>2 semanas:</strong> Sin consultas → Reduce precio 5-10%</li>
                  <li>• <strong>3 semanas:</strong> Alguna consulta pero sin ofertas → Reduce 10-15%</li>
                  <li>• <strong>1 mes:</strong> Muy poco interés → Reduce 15-20% o cambia estrategia</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-900 mb-4">Indicadores de mercado:</h4>
                <ul className="text-sm text-gray-700 space-y-2">
                  <li>• Aparecen productos similares más baratos</li>
                  <li>• Tus competidores bajan sus precios</li>
                  <li>• Disminuye la demanda general del producto</li>
                  <li>• Sale una nueva versión del producto</li>
                </ul>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
              <h4 className="font-semibold text-yellow-800 mb-2">💡 Estrategia de reducción gradual:</h4>
              <p className="text-sm text-yellow-700">
                En lugar de hacer una gran reducción, baja el precio gradualmente cada semana. 
                Esto mantiene el interés y evita que los compradores esperen más reducciones.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final Tips */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Consejos Finales para el Éxito</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Timing es clave</h3>
              <p className="text-gray-600">Publica cuando hay más actividad: tardes y fines de semana</p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Sé honesto</h3>
              <p className="text-gray-600">La transparencia genera confianza y evita problemas posteriores</p>
            </div>
            
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Mantén flexibilidad</h3>
              <p className="text-gray-600">Adapta tu estrategia según la respuesta del mercado</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-green-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">
            ¿Listo para fijar el precio perfecto?
          </h2>
          <p className="text-lg text-green-100 mb-8">
            Aplica estos consejos y verás cómo tus productos se venden más rápido y a mejor precio.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-green-600 px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors font-semibold">
              Publicar Mi Producto
            </button>
            <button className="bg-green-700 text-white border border-green-500 px-6 py-3 rounded-lg hover:bg-green-800 transition-colors">
              Ver Más Consejos
            </button>
          </div>
        </div>
      </section>
    </div>
    </>
  );
};

export default PricingTipsPage;