import React from 'react';
import SEO from '../../components/SEO/SEO';

const ReturnPolicyPage = () => {
  return (
    <>
      <SEO title="Política de Devoluciones" description="Conoce tus derechos y opciones para devoluciones en Resmoke. Proceso y tiempos para solicitar devoluciones." url="/politica-devoluciones"/>
      <div className="min-h-screen bg-gray-50">
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6">
              <span className="inline-block px-4 py-1 mb-4 rounded-full bg-orange-50 ring-1 ring-orange-200 text-sm tracking-wide text-orange-700">Compras</span>
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900">Política de Devoluciones</h1>
              <p className="mt-4 text-lg text-gray-600 max-w-xl">Conoce tus derechos y opciones para devoluciones en Resmoke.</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <a href="#tipos" className="inline-flex items-center px-5 py-3 rounded-xl bg-gray-900 text-white hover:bg-gray-800 transition">Tipos de devoluciones</a>
                <a href="#proceso" className="inline-flex items-center px-5 py-3 rounded-xl ring-1 ring-gray-300 text-gray-900 hover:bg-gray-50 transition">Proceso y tiempos</a>
              </div>
              <div className="mt-8 grid grid-cols-3 gap-6 text-center">
                <div className="bg-white/70 backdrop-blur rounded-xl ring-1 ring-gray-200 p-4 shadow-sm">
                  <p className="text-2xl font-bold text-gray-900">48h</p>
                  <p className="text-xs text-gray-500">reporte</p>
                </div>
                <div className="bg-white/70 backdrop-blur rounded-xl ring-1 ring-gray-200 p-4 shadow-sm">
                  <p className="text-2xl font-bold text-gray-900">Justo</p>
                  <p className="text-xs text-gray-500">y claro</p>
                </div>
                <div className="bg-white/70 backdrop-blur rounded-xl ring-1 ring-gray-200 p-4 shadow-sm">
                  <p className="text-2xl font-bold text-gray-900">Mediación</p>
                  <p className="text-xs text-gray-500">soporte</p>
                </div>
              </div>
            </div>
            <div className="lg:col-span-6 relative">
              <div className="aspect-[4/3] rounded-2xl backdrop-blur overflow-hidden">
                <img src="https://cdn-icons-png.flaticon.com/512/891/891462.png" alt="Política de devoluciones" className="w-full h-full object-contain" />
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
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Protección para Compradores</h2>
            <p className="text-lg text-gray-600">
              En Resmoke entendemos que comprar productos de segunda mano puede generar incertidumbre. 
              Por eso hemos establecido políticas claras para proteger tanto a compradores como vendedores.
            </p>
          </div>
        </div>
      </section>

      {/* Important Notice */}
      <section className="py-8 bg-yellow-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-yellow-100 border border-yellow-300 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <svg className="w-8 h-8 text-yellow-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <h3 className="text-xl font-bold text-yellow-800">Aviso Importante</h3>
            </div>
            <p className="text-yellow-800">
              <strong>Resmoke es una plataforma de intermediación.</strong> Las transacciones se realizan directamente entre usuarios. 
              Nuestra política de devoluciones se aplica según el tipo de transacción y las circunstancias específicas.
            </p>
          </div>
        </div>
      </section>

      {/* Return Types */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Tipos de Devoluciones</h2>
          
          <div className="space-y-8">
            {/* Product Not as Described */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <div className="bg-red-100 w-12 h-12 rounded-full flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900">Producto No Coincide con la Descripción</h3>
              </div>
              
              <div className="mb-4">
                <h4 className="font-semibold text-gray-900 mb-2">Cuándo aplica:</h4>
                <ul className="text-gray-700 space-y-1 ml-4">
                  <li>• El producto recibido es significativamente diferente a la descripción</li>
                  <li>• Faltan accesorios o componentes mencionados en el anuncio</li>
                  <li>• El estado del producto es peor al descrito</li>
                  <li>• Se detectan daños no mencionados en la publicación</li>
                </ul>
              </div>
              
              <div className="mb-4">
                <h4 className="font-semibold text-gray-900 mb-2">Proceso:</h4>
                <ol className="text-gray-700 space-y-1 ml-4">
                  <li>1. Contacta al vendedor dentro de las primeras 24 horas</li>
                  <li>2. Documenta las diferencias con fotos</li>
                  <li>3. Si no hay acuerdo, contacta a soporte de Resmoke</li>
                  <li>4. Nuestro equipo mediará entre ambas partes</li>
                </ol>
              </div>
              
              <div className="bg-red-100 p-4 rounded-lg">
                <p className="text-sm text-red-800">
                  <strong>Tiempo límite:</strong> 48 horas desde la recepción del producto para reportar discrepancias.
                </p>
              </div>
            </div>

            {/* Defective Product */}
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <div className="bg-orange-100 w-12 h-12 rounded-full flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900">Producto Defectuoso</h3>
              </div>
              
              <div className="mb-4">
                <h4 className="font-semibold text-gray-900 mb-2">Cuándo aplica:</h4>
                <ul className="text-gray-700 space-y-1 ml-4">
                  <li>• El producto no funciona correctamente</li>
                  <li>• Presenta fallas técnicas no mencionadas</li>
                  <li>• Componentes internos dañados</li>
                  <li>• Software corrupto o problemas de sistema</li>
                </ul>
              </div>
              
              <div className="mb-4">
                <h4 className="font-semibold text-gray-900 mb-2">Requisitos:</h4>
                <ul className="text-gray-700 space-y-1 ml-4">
                  <li>• Prueba del defecto (videos, capturas de pantalla)</li>
                  <li>• Intento de solución con el vendedor</li>
                  <li>• Reporte dentro de las primeras 72 horas</li>
                </ul>
              </div>
              
              <div className="bg-orange-100 p-4 rounded-lg">
                <p className="text-sm text-orange-800">
                  <strong>Nota:</strong> Los defectos por uso normal o desgaste no están cubiertos.
                </p>
              </div>
            </div>

            {/* Buyer's Remorse */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900">Cambio de Opinión</h3>
              </div>
              
              <div className="mb-4">
                <p className="text-gray-700 mb-3">
                  Si simplemente cambiaste de opinión sobre la compra, la devolución depende completamente 
                  de la buena voluntad del vendedor.
                </p>
                
                <h4 className="font-semibold text-gray-900 mb-2">Recomendaciones:</h4>
                <ul className="text-gray-700 space-y-1 ml-4">
                  <li>• Contacta al vendedor de manera educada</li>
                  <li>• Explica tu situación honestamente</li>
                  <li>• Ofrece cubrir los gastos de envío</li>
                  <li>• Acepta si el vendedor se niega</li>
                </ul>
              </div>
              
              <div className="bg-blue-100 p-4 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Importante:</strong> Resmoke no puede forzar devoluciones por cambio de opinión.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Return Process */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Proceso de Devolución</h2>
          
          <div className="space-y-8">
            {/* Step 1 */}
            <div className="flex items-start">
              <div className="bg-orange-100 w-12 h-12 rounded-full flex items-center justify-center mr-6 flex-shrink-0">
                <span className="text-orange-600 font-bold text-lg">1</span>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-3">Contacta al Vendedor</h3>
                <p className="text-gray-600 mb-4">
                  Antes de involucrar a Resmoke, intenta resolver el problema directamente con el vendedor. 
                  Muchos vendedores están dispuestos a colaborar para mantener su reputación.
                </p>
                <div className="bg-gray-100 p-4 rounded-lg">
                  <p className="text-sm text-gray-700">
                    💡 <strong>Tip:</strong> Mantén un tono respetuoso y proporciona evidencia clara del problema.
                  </p>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex items-start">
              <div className="bg-orange-100 w-12 h-12 rounded-full flex items-center justify-center mr-6 flex-shrink-0">
                <span className="text-orange-600 font-bold text-lg">2</span>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-3">Documenta el Problema</h3>
                <p className="text-gray-600 mb-4">
                  Recopila toda la evidencia necesaria para respaldar tu caso:
                </p>
                <ul className="text-gray-600 space-y-2 mb-4">
                  <li>• Fotos del producto recibido vs. anuncio original</li>
                  <li>• Capturas de pantalla de la conversación</li>
                  <li>• Videos mostrando defectos o problemas</li>
                  <li>• Recibos o comprobantes de pago</li>
                </ul>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex items-start">
              <div className="bg-orange-100 w-12 h-12 rounded-full flex items-center justify-center mr-6 flex-shrink-0">
                <span className="text-orange-600 font-bold text-lg">3</span>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-3">Contacta a Soporte Resmoke</h3>
                <p className="text-gray-600 mb-4">
                  Si no puedes resolver el problema con el vendedor, contacta a nuestro equipo de soporte:
                </p>
                <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                  <h4 className="font-semibold text-orange-800 mb-2">Información requerida:</h4>
                  <ul className="text-sm text-orange-700 space-y-1">
                    <li>• Número de transacción</li>
                    <li>• Descripción detallada del problema</li>
                    <li>• Evidencia fotográfica/video</li>
                    <li>• Historial de comunicación con el vendedor</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Step 4 */}
            <div className="flex items-start">
              <div className="bg-orange-100 w-12 h-12 rounded-full flex items-center justify-center mr-6 flex-shrink-0">
                <span className="text-orange-600 font-bold text-lg">4</span>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-3">Mediación y Resolución</h3>
                <p className="text-gray-600 mb-4">
                  Nuestro equipo revisará el caso y mediará entre ambas partes para encontrar una solución justa.
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <h4 className="font-semibold text-green-800 mb-2">Posibles resoluciones:</h4>
                    <ul className="text-sm text-green-700 space-y-1">
                      <li>• Devolución completa del dinero</li>
                      <li>• Devolución parcial</li>
                      <li>• Intercambio por otro producto</li>
                      <li>• Reparación del producto</li>
                    </ul>
                  </div>
                  
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <h4 className="font-semibold text-blue-800 mb-2">Tiempos de respuesta:</h4>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• Respuesta inicial: 24-48 horas</li>
                      <li>• Investigación: 3-5 días hábiles</li>
                      <li>• Resolución: 7-10 días hábiles</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Refund Methods */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Métodos de Reembolso</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Digital Payments */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <div className="bg-green-100 w-10 h-10 rounded-full flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Pagos Digitales</h3>
              </div>
              
              <div className="space-y-3">
                <div>
                  <h4 className="font-medium text-gray-900">PayPal / Bizum</h4>
                  <p className="text-sm text-gray-600">Reembolso automático en 1-3 días hábiles</p>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900">Transferencia Bancaria</h4>
                  <p className="text-sm text-gray-600">Reembolso manual en 3-5 días hábiles</p>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900">Tarjeta de Crédito/Débito</h4>
                  <p className="text-sm text-gray-600">Reembolso en 5-10 días hábiles</p>
                </div>
              </div>
            </div>

            {/* Cash Payments */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <div className="bg-yellow-100 w-10 h-10 rounded-full flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Pagos en Efectivo</h3>
              </div>
              
              <div className="space-y-3">
                <div>
                  <h4 className="font-medium text-gray-900">Encuentro Presencial</h4>
                  <p className="text-sm text-gray-600">Devolución directa del vendedor al comprador</p>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900">Transferencia Bancaria</h4>
                  <p className="text-sm text-gray-600">Si ambas partes están de acuerdo</p>
                </div>
              </div>
              
              <div className="mt-4 p-3 bg-yellow-100 rounded-lg">
                <p className="text-xs text-yellow-800">
                  <strong>Nota:</strong> Para pagos en efectivo, Resmoke no puede garantizar el reembolso. 
                  Recomendamos usar métodos de pago digitales.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Prevention Tips */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Consejos para Evitar Devoluciones</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* For Buyers */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <div className="flex items-center mb-4">
                <div className="bg-blue-100 w-10 h-10 rounded-full flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Para Compradores</h3>
              </div>
              
              <ul className="text-sm text-gray-700 space-y-2">
                <li>• Lee completamente la descripción del producto</li>
                <li>• Revisa todas las fotos cuidadosamente</li>
                <li>• Haz preguntas específicas antes de comprar</li>
                <li>• Verifica la reputación del vendedor</li>
                <li>• Inspecciona el producto al recibirlo</li>
                <li>• Usa métodos de pago seguros</li>
                <li>• Guarda toda la comunicación</li>
              </ul>
            </div>

            {/* For Sellers */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <div className="flex items-center mb-4">
                <div className="bg-green-100 w-10 h-10 rounded-full flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-2m-2 0H9m3 0V9" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Para Vendedores</h3>
              </div>
              
              <ul className="text-sm text-gray-700 space-y-2">
                <li>• Describe el producto honesta y detalladamente</li>
                <li>• Incluye fotos de todos los ángulos</li>
                <li>• Menciona cualquier defecto o desgaste</li>
                <li>• Responde rápidamente a las preguntas</li>
                <li>• Empaca el producto cuidadosamente</li>
                <li>• Mantén comunicación durante el envío</li>
                <li>• Sé flexible con problemas menores</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Support */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            ¿Necesitas ayuda con una devolución?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Nuestro equipo de soporte está disponible para ayudarte con cualquier problema 
            relacionado con devoluciones o disputas.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors">
              Iniciar Proceso de Devolución
            </button>
            <button className="bg-white text-orange-600 border border-orange-600 px-6 py-3 rounded-lg hover:bg-orange-50 transition-colors">
              Contactar Soporte
            </button>
          </div>
          
          <div className="mt-8 text-sm text-gray-500">
            <p>Horario de atención: Lunes a Viernes, 9:00 - 18:00</p>
            <p>Tiempo de respuesta promedio: 24 horas</p>
          </div>
        </div>
      </section>
    </div>
    </>
  );
};

export default ReturnPolicyPage;