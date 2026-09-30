import React from 'react';
import SEO from '../../components/SEO/SEO';

const OrderManagementPage = () => {
  return (
    <>
      <SEO title="Gestión de Pedidos" description="Aprende a gestionar tus ventas y compras de manera eficiente en Resmoke." url="/gestion-pedidos"/>
      <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6">
              <span className="inline-block px-4 py-1 mb-4 rounded-full bg-indigo-50 ring-1 ring-indigo-200 text-sm tracking-wide text-indigo-700">Órdenes</span>
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900">Gestión de pedidos</h1>
              <p className="mt-4 text-lg text-gray-600 max-w-xl">Aprende a gestionar tus ventas y compras de manera eficiente.</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <a href="#vendedor" className="inline-flex items-center px-5 py-3 rounded-xl bg-gray-900 text-white hover:bg-gray-800 transition">Ver gestión como vendedor</a>
                <a href="#comprador" className="inline-flex items-center px-5 py-3 rounded-xl ring-1 ring-gray-300 text-gray-900 hover:bg-gray-50 transition">Ver gestión como comprador</a>
              </div>
              <div className="mt-8 grid grid-cols-3 gap-6 text-center">
                <div className="bg-white/70 backdrop-blur rounded-xl ring-1 ring-gray-200 p-4 shadow-sm">
                  <p className="text-2xl font-bold text-gray-900">Estados</p>
                  <p className="text-xs text-gray-500">claros</p>
                </div>
                <div className="bg-white/70 backdrop-blur rounded-xl ring-1 ring-gray-200 p-4 shadow-sm">
                  <p className="text-2xl font-bold text-gray-900">Acciones</p>
                  <p className="text-xs text-gray-500">guiadas</p>
                </div>
                <div className="bg-white/70 backdrop-blur rounded-xl ring-1 ring-gray-200 p-4 shadow-sm">
                  <p className="text-2xl font-bold text-gray-900">Resolución</p>
                  <p className="text-xs text-gray-500">rápida</p>
                </div>
              </div>
            </div>
            <div className="lg:col-span-6 relative">
              <div className="aspect-[4/3] rounded-2xl backdrop-blur overflow-hidden">
                <img src="https://cdn-icons-png.flaticon.com/512/777/777954.png" alt="Gestión de pedidos" className="w-full h-full object-contain" />
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
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Control Total de tus Transacciones</h2>
            <p className="text-lg text-gray-600">
              Una buena gestión de pedidos es clave para mantener una reputación excelente y 
              asegurar transacciones exitosas tanto como comprador como vendedor.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 mt-12">
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900">Como Vendedor</h3>
              </div>
              <ul className="text-sm text-gray-700 space-y-2">
                <li>• Gestiona tus productos publicados</li>
                <li>• Responde consultas rápidamente</li>
                <li>• Coordina entregas y pagos</li>
                <li>• Mantén actualizado el estado</li>
                <li>• Resuelve incidencias</li>
              </ul>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900">Como Comprador</h3>
              </div>
              <ul className="text-sm text-gray-700 space-y-2">
                <li>• Realiza seguimiento de compras</li>
                <li>• Comunícate con vendedores</li>
                <li>• Confirma recepciones</li>
                <li>• Gestiona devoluciones</li>
                <li>• Deja valoraciones</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Seller Management */}
      <section id="vendedor" className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Gestión como Vendedor</h2>
          
          {/* Order States */}
          <div className="mb-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Estados del Pedido</h3>
            
            <div className="space-y-4">
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="bg-yellow-100 w-10 h-10 rounded-full flex items-center justify-center mr-4">
                      <span className="text-yellow-600 font-bold text-sm">1</span>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900">Consulta Recibida</h4>
                      <p className="text-sm text-gray-600">Un comprador ha mostrado interés en tu producto</p>
                    </div>
                  </div>
                  <span className="bg-yellow-100 text-yellow-800 text-xs font-semibold px-2 py-1 rounded">PENDIENTE</span>
                </div>
                
                <div className="mt-4 ml-14">
                  <h5 className="font-semibold text-gray-900 mb-2">Acciones recomendadas:</h5>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Responde en menos de 2 horas</li>
                    <li>• Proporciona información adicional si es necesaria</li>
                    <li>• Confirma disponibilidad del producto</li>
                    <li>• Negocia precio si es aplicable</li>
                  </ul>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="bg-blue-100 w-10 h-10 rounded-full flex items-center justify-center mr-4">
                      <span className="text-blue-600 font-bold text-sm">2</span>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900">Venta Acordada</h4>
                      <p className="text-sm text-gray-600">Precio y condiciones acordadas con el comprador</p>
                    </div>
                  </div>
                  <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded">ACORDADO</span>
                </div>
                
                <div className="mt-4 ml-14">
                  <h5 className="font-semibold text-gray-900 mb-2">Acciones recomendadas:</h5>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Coordina método de pago</li>
                    <li>• Acuerda lugar y hora de entrega</li>
                    <li>• Confirma estado del producto</li>
                    <li>• Proporciona datos de contacto</li>
                  </ul>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="bg-purple-100 w-10 h-10 rounded-full flex items-center justify-center mr-4">
                      <span className="text-purple-600 font-bold text-sm">3</span>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900">Pago Recibido</h4>
                      <p className="text-sm text-gray-600">El comprador ha realizado el pago acordado</p>
                    </div>
                  </div>
                  <span className="bg-purple-100 text-purple-800 text-xs font-semibold px-2 py-1 rounded">PAGADO</span>
                </div>
                
                <div className="mt-4 ml-14">
                  <h5 className="font-semibold text-gray-900 mb-2">Acciones recomendadas:</h5>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Confirma recepción del pago</li>
                    <li>• Prepara el producto para entrega</li>
                    <li>• Coordina los detalles finales</li>
                    <li>• Actualiza el estado en la plataforma</li>
                  </ul>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="bg-green-100 w-10 h-10 rounded-full flex items-center justify-center mr-4">
                      <span className="text-green-600 font-bold text-sm">4</span>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900">Entregado</h4>
                      <p className="text-sm text-gray-600">El producto ha sido entregado al comprador</p>
                    </div>
                  </div>
                  <span className="bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded">COMPLETADO</span>
                </div>
                
                <div className="mt-4 ml-14">
                  <h5 className="font-semibold text-gray-900 mb-2">Acciones recomendadas:</h5>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Confirma que el comprador recibió el producto</li>
                    <li>• Solicita valoración si está satisfecho</li>
                    <li>• Mantente disponible para consultas post-venta</li>
                    <li>• Cierra el pedido en la plataforma</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Best Practices for Sellers */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <h3 className="text-xl font-bold text-green-900 mb-4">Mejores Prácticas para Vendedores</h3>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-green-800 mb-3">Comunicación:</h4>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>• Responde rápidamente (máximo 4 horas)</li>
                  <li>• Sé claro y específico en tus respuestas</li>
                  <li>• Mantén un tono profesional y amigable</li>
                  <li>• Proporciona toda la información necesaria</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold text-green-800 mb-3">Gestión:</h4>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>• Actualiza el estado del pedido regularmente</li>
                  <li>• Cumple con los plazos acordados</li>
                  <li>• Documenta todos los acuerdos importantes</li>
                  <li>• Mantén el producto en las condiciones prometidas</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Buyer Management */}
      <section id="comprador" className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Gestión como Comprador</h2>
          
          {/* Purchase Process */}
          <div className="mb-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Proceso de Compra</h3>
            
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="flex items-start">
                  <div className="bg-blue-100 w-8 h-8 rounded-full flex items-center justify-center mr-4 mt-1">
                    <span className="text-blue-600 font-bold text-sm">1</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">Búsqueda y Selección</h4>
                    <p className="text-gray-700 mb-3">
                      Encuentra el producto que necesitas y revisa cuidadosamente la información.
                    </p>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Lee la descripción completa</li>
                      <li>• Revisa todas las fotos</li>
                      <li>• Verifica el estado del producto</li>
                      <li>• Comprueba la reputación del vendedor</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <div className="flex items-start">
                  <div className="bg-blue-100 w-8 h-8 rounded-full flex items-center justify-center mr-4 mt-1">
                    <span className="text-blue-600 font-bold text-sm">2</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">Contacto con el Vendedor</h4>
                    <p className="text-gray-700 mb-3">
                      Inicia la conversación para aclarar dudas y negociar condiciones.
                    </p>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Haz preguntas específicas sobre el producto</li>
                      <li>• Negocia el precio si es posible</li>
                      <li>• Acuerda método de pago y entrega</li>
                      <li>• Solicita información adicional si es necesaria</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <div className="flex items-start">
                  <div className="bg-blue-100 w-8 h-8 rounded-full flex items-center justify-center mr-4 mt-1">
                    <span className="text-blue-600 font-bold text-sm">3</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">Pago y Coordinación</h4>
                    <p className="text-gray-700 mb-3">
                      Realiza el pago según lo acordado y coordina la entrega.
                    </p>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Utiliza métodos de pago seguros</li>
                      <li>• Confirma los detalles de entrega</li>
                      <li>• Mantén comunicación con el vendedor</li>
                      <li>• Guarda comprobantes de pago</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <div className="flex items-start">
                  <div className="bg-blue-100 w-8 h-8 rounded-full flex items-center justify-center mr-4 mt-1">
                    <span className="text-blue-600 font-bold text-sm">4</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">Recepción y Verificación</h4>
                    <p className="text-gray-700 mb-3">
                      Recibe el producto y verifica que cumple con lo acordado.
                    </p>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Inspecciona el producto inmediatamente</li>
                      <li>• Verifica que coincide con la descripción</li>
                      <li>• Confirma la recepción al vendedor</li>
                      <li>• Reporta cualquier problema de inmediato</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Buyer Tips */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-xl font-bold text-blue-900 mb-4">Consejos para Compradores</h3>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-blue-800 mb-3">Antes de comprar:</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Investiga el precio de mercado</li>
                  <li>• Lee valoraciones del vendedor</li>
                  <li>• Compara con otros anuncios similares</li>
                  <li>• Verifica la autenticidad del producto</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold text-blue-800 mb-3">Durante la transacción:</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Mantén toda la comunicación en la plataforma</li>
                  <li>• No hagas pagos por adelantado sin garantías</li>
                  <li>• Documenta todos los acuerdos</li>
                  <li>• Confía en tu instinto si algo no parece correcto</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Resolution */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Resolución de Problemas</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Common Issues */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Problemas Comunes</h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-red-600 mb-2">🚫 Producto no como se describió</h4>
                  <p className="text-sm text-gray-700 mb-2">El artículo recibido no coincide con la descripción o fotos.</p>
                  <p className="text-xs text-gray-600"><strong>Solución:</strong> Contacta inmediatamente al vendedor con fotos del problema.</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-red-600 mb-2">⏰ Retraso en la entrega</h4>
                  <p className="text-sm text-gray-700 mb-2">El vendedor no cumple con los plazos acordados.</p>
                  <p className="text-xs text-gray-600"><strong>Solución:</strong> Comunícate para conocer el motivo y acordar nueva fecha.</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-red-600 mb-2">💸 Problemas de pago</h4>
                  <p className="text-sm text-gray-700 mb-2">Dificultades con el método de pago acordado.</p>
                  <p className="text-xs text-gray-600"><strong>Solución:</strong> Busca métodos alternativos seguros o cancela la transacción.</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-red-600 mb-2">📞 Falta de comunicación</h4>
                  <p className="text-sm text-gray-700 mb-2">El vendedor o comprador no responde mensajes.</p>
                  <p className="text-xs text-gray-600"><strong>Solución:</strong> Espera 24-48 horas antes de contactar soporte.</p>
                </div>
              </div>
            </div>

            {/* Resolution Steps */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Pasos para Resolver Conflictos</h3>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="bg-yellow-100 w-6 h-6 rounded-full flex items-center justify-center mr-3 mt-1">
                    <span className="text-yellow-600 font-bold text-xs">1</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Comunicación Directa</h4>
                    <p className="text-sm text-gray-600">Intenta resolver el problema hablando directamente con la otra parte.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-yellow-100 w-6 h-6 rounded-full flex items-center justify-center mr-3 mt-1">
                    <span className="text-yellow-600 font-bold text-xs">2</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Documentar el Problema</h4>
                    <p className="text-sm text-gray-600">Toma capturas de pantalla y fotos como evidencia del problema.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-yellow-100 w-6 h-6 rounded-full flex items-center justify-center mr-3 mt-1">
                    <span className="text-yellow-600 font-bold text-xs">3</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Buscar Compromiso</h4>
                    <p className="text-sm text-gray-600">Propón soluciones que beneficien a ambas partes.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-yellow-100 w-6 h-6 rounded-full flex items-center justify-center mr-3 mt-1">
                    <span className="text-yellow-600 font-bold text-xs">4</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Contactar Soporte</h4>
                    <p className="text-sm text-gray-600">Si no hay solución, contacta al equipo de soporte de la plataforma.</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-red-50 rounded-lg">
                <h4 className="font-semibold text-red-800 mb-2">⚠️ Señales de Alerta</h4>
                <ul className="text-sm text-red-700 space-y-1">
                  <li>• Solicitudes de pago por métodos no seguros</li>
                  <li>• Presión para cerrar la transacción rápidamente</li>
                  <li>• Negativa a proporcionar información adicional</li>
                  <li>• Precios significativamente por debajo del mercado</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Support */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            ¿Necesitas Ayuda Adicional?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Nuestro equipo de soporte está aquí para ayudarte a resolver cualquier problema 
            con tus pedidos y transacciones.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
              Contactar Soporte
            </button>
            <button className="bg-white text-blue-600 border border-blue-600 px-6 py-3 rounded-lg hover:bg-blue-50 transition-colors">
              Ver Preguntas Frecuentes
            </button>
          </div>
        </div>
      </section>
    </div>
    </>
  );
};

export default OrderManagementPage;