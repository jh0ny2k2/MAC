import React from 'react';
import SEO from '../../components/SEO/SEO';

const HowToBuyPage = () => {
  return (
    <>
      <SEO title="Cómo Comprar" description="Aprende a comprar en Resmoke de forma segura y sencilla. Guía paso a paso para realizar tus compras en nuestro marketplace." url="/como-comprar"/>
      <div className="min-h-screen bg-gray-50">
      {/* Hero Section (split layout) */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            {/* Texto */}
            <div className="lg:col-span-6">
              <span className="inline-block px-4 py-1 mb-4 rounded-full bg-blue-50 ring-1 ring-blue-200 text-sm tracking-wide text-blue-700">Resmoke</span>
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900">
                ¿Cómo realizar una compra?
              </h1>
              <p className="mt-4 text-lg text-gray-600 max-w-xl">
                Guía paso a paso para comprar de forma segura en Resmoke.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <a href="/productos" className="inline-flex items-center px-5 py-3 rounded-xl bg-gray-900 text-white hover:bg-gray-800 transition">
                  Explorar productos
                </a>
                <a href="/contactar-vendedor" className="inline-flex items-center px-5 py-3 rounded-xl ring-1 ring-gray-300 text-gray-900 hover:bg-gray-50 transition">
                  Contactar vendedor
                </a>
              </div>
              <div className="mt-8 grid grid-cols-3 gap-6 text-center">
                <div className="bg-white/70 backdrop-blur rounded-xl ring-1 ring-gray-200 p-4 shadow-sm">
                  <p className="text-2xl font-bold text-gray-900">Seguro</p>
                  <p className="text-xs text-gray-500">compras</p>
                </div>
                <div className="bg-white/70 backdrop-blur rounded-xl ring-1 ring-gray-200 p-4 shadow-sm">
                  <p className="text-2xl font-bold text-gray-900">Rápido</p>
                  <p className="text-xs text-gray-500">proceso</p>
                </div>
                <div className="bg-white/70 backdrop-blur rounded-xl ring-1 ring-gray-200 p-4 shadow-sm">
                  <p className="text-2xl font-bold text-gray-900">Comunidad</p>
                  <p className="text-xs text-gray-500">confiable</p>
                </div>
              </div>
            </div>
            {/* Imagen */}
            <div className="lg:col-span-6 relative">
              <div className="aspect-[4/3] rounded-2xl bg-white/60 backdrop-blur ring-1 ring-gray-200 shadow-sm overflow-hidden">
                <img src="/img/resmoke/Cachimbas.png" alt="Comprar en Resmoke" className="w-full h-full object-contain" />
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
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Proceso de Compra Simplificado</h2>
            <p className="text-lg text-gray-600">
              Comprar en Resmoke es fácil y seguro. Sigue estos pasos para realizar tu primera compra exitosa.
            </p>
          </div>
        </div>
      </section>

      {/* Step by Step Guide */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Pasos para Comprar</h2>
          
          <div className="space-y-8">
            {/* Step 1 */}
            <div className="bg-white/80 backdrop-blur rounded-2xl p-8 shadow-sm ring-1 ring-gray-200 transition hover:shadow-md">
              <div className="flex items-start">
                <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mr-6 flex-shrink-0">
                  <span className="text-blue-600 font-bold text-lg">1</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Busca el producto que necesitas</h3>
                  <p className="text-gray-600 mb-4">
                    Utiliza la barra de búsqueda o navega por las categorías para encontrar el producto que buscas.
                  </p>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">Consejos de búsqueda:</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Usa palabras clave específicas</li>
                      <li>• Filtra por precio, ubicación y estado</li>
                      <li>• Revisa las fotos y descripciones detalladamente</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-white/80 backdrop-blur rounded-2xl p-8 shadow-sm ring-1 ring-gray-200 transition hover:shadow-md">
              <div className="flex items-start">
                <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mr-6 flex-shrink-0">
                  <span className="text-green-600 font-bold text-lg">2</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Revisa el perfil del vendedor</h3>
                  <p className="text-gray-600 mb-4">
                    Antes de comprar, verifica la reputación y historial del vendedor para asegurar una transacción confiable.
                  </p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-2">Qué revisar:</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Calificación y reseñas</li>
                        <li>• Tiempo en la plataforma</li>
                        <li>• Número de ventas exitosas</li>
                        <li>• Tiempo de respuesta promedio</li>
                      </ul>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-2">Señales positivas:</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Calificación superior a 4.5 estrellas</li>
                        <li>• Respuestas rápidas a mensajes</li>
                        <li>• Fotos claras y detalladas</li>
                        <li>• Descripciones honestas</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-white/80 backdrop-blur rounded-2xl p-8 shadow-sm ring-1 ring-gray-200 transition hover:shadow-md">
              <div className="flex items-start">
                <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mr-6 flex-shrink-0">
                  <span className="text-purple-600 font-bold text-lg">3</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Contacta al vendedor</h3>
                  <p className="text-gray-600 mb-4">
                    Haz todas las preguntas necesarias sobre el producto antes de proceder con la compra.
                  </p>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">Preguntas importantes:</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• ¿Cuál es el estado real del producto?</li>
                      <li>• ¿Incluye accesorios originales?</li>
                      <li>• ¿Cuándo y dónde podemos encontrarnos?</li>
                      <li>• ¿Acepta el método de pago que prefieres?</li>
                      <li>• ¿Hay garantía o política de devolución?</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 4 */}
            <div className="bg-white/80 backdrop-blur rounded-2xl p-8 shadow-sm ring-1 ring-gray-200 transition hover:shadow-md">
              <div className="flex items-start">
                <div className="bg-orange-100 w-12 h-12 rounded-full flex items-center justify-center mr-6 flex-shrink-0">
                  <span className="text-orange-600 font-bold text-lg">4</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Acuerda los detalles</h3>
                  <p className="text-gray-600 mb-4">
                    Confirma el precio final, método de pago, lugar y hora de encuentro antes de proceder.
                  </p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-2">Detalles a confirmar:</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Precio final (incluyendo envío si aplica)</li>
                        <li>• Método de pago acordado</li>
                        <li>• Lugar de encuentro seguro</li>
                        <li>• Fecha y hora específica</li>
                      </ul>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-2">Lugares seguros:</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Centros comerciales</li>
                        <li>• Cafeterías concurridas</li>
                        <li>• Estaciones de policía</li>
                        <li>• Bancos con cámaras</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 5 */}
            <div className="bg-white/80 backdrop-blur rounded-2xl p-8 shadow-sm ring-1 ring-gray-200 transition hover:shadow-md">
              <div className="flex items-start">
                <div className="bg-red-100 w-12 h-12 rounded-full flex items-center justify-center mr-6 flex-shrink-0">
                  <span className="text-red-600 font-bold text-lg">5</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Inspecciona antes de pagar</h3>
                  <p className="text-gray-600 mb-4">
                    Siempre revisa el producto físicamente antes de realizar el pago final.
                  </p>
                  <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                    <h4 className="font-semibold text-red-800 mb-2">⚠️ Importante:</h4>
                    <ul className="text-sm text-red-700 space-y-1">
                      <li>• Nunca pagues sin ver el producto</li>
                      <li>• Verifica que funcione correctamente</li>
                      <li>• Comprueba que coincida con la descripción</li>
                      <li>• Si algo no está bien, no tengas miedo de cancelar</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 6 */}
            <div className="bg-white/80 backdrop-blur rounded-2xl p-8 shadow-sm ring-1 ring-gray-200 transition hover:shadow-md">
              <div className="flex items-start">
                <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mr-6 flex-shrink-0">
                  <span className="text-green-600 font-bold text-lg">6</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Completa la transacción</h3>
                  <p className="text-gray-600 mb-4">
                    Una vez satisfecho con el producto, procede con el pago usando métodos seguros.
                  </p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-2">Métodos seguros:</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Transferencia bancaria verificada</li>
                        <li>• Pago con tarjeta (para envíos)</li>
                        <li>• Efectivo (solo para encuentros presenciales)</li>
                        <li>• PayPal o similar (con protección)</li>
                      </ul>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-2">Después del pago:</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Guarda el comprobante de pago</li>
                        <li>• Toma fotos del producto recibido</li>
                        <li>• Deja una reseña honesta</li>
                        <li>• Contacta soporte si hay problemas</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tips Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Consejos Adicionales</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
              <div className="flex items-center mb-4">
                <div className="bg-blue-100 w-10 h-10 rounded-full flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Mejores Prácticas</h3>
              </div>
              <ul className="text-sm text-gray-700 space-y-2">
                <li>• Compara precios con otros vendedores</li>
                <li>• Lee todas las reseñas disponibles</li>
                <li>• Mantén comunicación por la plataforma</li>
                <li>• Lleva a un acompañante si es posible</li>
                <li>• Confía en tu instinto</li>
              </ul>
            </div>
            
            <div className="bg-red-50 p-6 rounded-lg border border-red-200">
              <div className="flex items-center mb-4">
                <div className="bg-red-100 w-10 h-10 rounded-full flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Señales de Alerta</h3>
              </div>
              <ul className="text-sm text-gray-700 space-y-2">
                <li>• Precios demasiado bajos</li>
                <li>• Presión para pagar rápidamente</li>
                <li>• Vendedor evita encuentros presenciales</li>
                <li>• Solicita pago por adelantado</li>
                <li>• Comunicación solo por email/SMS</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Support */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            ¿Necesitas más ayuda?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Nuestro equipo de soporte está disponible 24/7 para ayudarte con cualquier duda sobre el proceso de compra.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
              Contactar Soporte
            </button>
            <button className="bg-white text-blue-600 border border-blue-600 px-6 py-3 rounded-lg hover:bg-blue-50 transition-colors">
              Ver Más Guías
            </button>
          </div>
        </div>
      </section>
    </div>
    </>
  );
};

export default HowToBuyPage;