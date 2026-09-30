import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import SEO from '../../components/SEO/SEO';

const ReportBugPage = () => {
  const [bugReport, setBugReport] = useState({
    title: '',
    category: '',
    severity: 'medium',
    productId: '',
    orderId: '',
    conversationId: '',
    pageUrl: '',
    browser: '',
    device: '',
    os: '',
    stepsToReproduce: '',
    expectedBehavior: '',
    actualBehavior: '',
    additionalInfo: '',
    screenshots: [],
    canReproduce: '',
    frequency: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const { user } = useAuth();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBugReport(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    setBugReport(prev => ({
      ...prev,
      screenshots: [...prev.screenshots, ...files].slice(0, 5)
    }));
  };

  const removeScreenshot = (index) => {
    setBugReport(prev => ({
      ...prev,
      screenshots: prev.screenshots.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const evidenceUrls = [];
      for (let i = 0; i < (bugReport.screenshots || []).length; i++) {
        const file = bugReport.screenshots[i];
        const allowed = ['jpg', 'jpeg', 'png', 'webp'];
        const ext = (file.name.split('.').pop() || '').toLowerCase();
        if (!allowed.includes(ext)) {
          throw new Error(`Formato de archivo no válido: ${ext}`);
        }
        const ts = Date.now() + i;
        const uid = user?.id || 'anon';
        const cleanName = `bug-reports/${ts}_${uid}_${i}.${ext}`;
        const { error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(cleanName, file, { cacheControl: '3600', upsert: false });
        if (uploadError) {
          throw new Error(uploadError.message);
        }
        const { data: urlData } = supabase.storage
          .from('product-images')
          .getPublicUrl(cleanName);
        evidenceUrls.push(urlData.publicUrl);
      }

      const description = [
        bugReport.title ? `Título: ${bugReport.title}` : '',
        bugReport.pageUrl ? `URL: ${bugReport.pageUrl}` : '',
        bugReport.productId ? `Producto: ${bugReport.productId}` : '',
        bugReport.orderId ? `Pedido: ${bugReport.orderId}` : '',
        bugReport.conversationId ? `Chat: ${bugReport.conversationId}` : '',
        bugReport.stepsToReproduce ? `Pasos: ${bugReport.stepsToReproduce}` : '',
        bugReport.expectedBehavior ? `Esperado: ${bugReport.expectedBehavior}` : '',
        bugReport.actualBehavior ? `Actual: ${bugReport.actualBehavior}` : '',
        bugReport.additionalInfo ? `Extra: ${bugReport.additionalInfo}` : ''
      ].filter(Boolean).join('\n');

      const payload = {
        report_type: bugReport.category || 'other',
        description,
        urgency: bugReport.severity || 'medium',
        contact_method: user?.email ? 'email' : 'none',
        user_email: user?.email || '',
        user_name: user?.nombre || '',
        evidence_files: evidenceUrls.length ? JSON.stringify(evidenceUrls) : null,
        status: 'pending'
      };

      const { error } = await supabase
        .from('suspicious_activity_reports')
        .insert([payload]);
      if (error) {
        throw new Error(error.message);
      }

      setShowSuccess(true);
      setBugReport({
        title: '',
        category: '',
        severity: 'medium',
        productId: '',
        orderId: '',
        conversationId: '',
        pageUrl: '',
        browser: '',
        device: '',
        os: '',
        stepsToReproduce: '',
        expectedBehavior: '',
        actualBehavior: '',
        additionalInfo: '',
        screenshots: [],
        canReproduce: '',
        frequency: ''
      });
    } catch (err) {
      alert(`Error al enviar el reporte: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <SEO title="Reportar Error" description="Reporta un error técnico en Resmoke. Ayúdanos a mejorar la plataforma." url="/reportar-error"/>
      <div className="min-h-screen bg-gray-50">
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6">
              <span className="inline-block px-4 py-1 mb-4 rounded-full bg-blue-50 ring-1 ring-blue-200 text-sm tracking-wide text-blue-700">Resmoke</span>
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900">Reportar un problema</h1>
              <p className="mt-4 text-lg text-gray-600 max-w-xl">Ayúdanos a mejorar el marketplace de cachimbas con reportes claros y contextualizados.</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <a href="#formulario" className="inline-flex items-center px-5 py-3 rounded-xl bg-gray-900 text-white hover:bg-gray-800 transition">Crear reporte</a>
                <a href="/help-center" className="inline-flex items-center px-5 py-3 rounded-xl ring-1 ring-gray-300 text-gray-900 hover:bg-gray-50 transition">Centro de ayuda</a>
                <a href="/estado-sistema" className="inline-flex items-center px-5 py-3 rounded-xl ring-1 ring-gray-300 text-gray-900 hover:bg-gray-50 transition">Estado del sistema</a>
              </div>
              <div className="mt-8 grid grid-cols-3 gap-6 text-center">
                <div className="bg-white/70 backdrop-blur rounded-xl ring-1 ring-gray-200 p-4 shadow-sm">
                  <p className="text-2xl font-bold text-gray-900"><span className="sr-only">Tiempo medio de respuesta</span>24h</p>
                  <p className="text-xs text-gray-500">tiempo de respuesta</p>
                </div>
                <div className="bg-white/70 backdrop-blur rounded-xl ring-1 ring-gray-200 p-4 shadow-sm">
                  <p className="text-2xl font-bold text-gray-900"><span className="sr-only">Bugs resueltos por sprint</span>30+</p>
                  <p className="text-xs text-gray-500">bugs/sprint</p>
                </div>
                <div className="bg-white/70 backdrop-blur rounded-xl ring-1 ring-gray-200 p-4 shadow-sm">
                  <p className="text-2xl font-bold text-gray-900"><span className="sr-only">Reportes confirmados</span>98%</p>
                  <p className="text-xs text-gray-500">reportes confirmados</p>
                </div>
              </div>
            </div>
            <div className="lg:col-span-6 relative">
              <div className="rounded-2xl overflow-hidden ring-1 ring-gray-200">
                <div className="grid grid-cols-2 gap-2">
                  <img src="https://img.freepik.com/foto-gratis/clasica-pipa-agua-hermosos-rayos-luz-humo-colores-concepto-fumar-pipa-agua_169016-5136.jpg?semt=ais_hybrid&w=740&q=80" alt="Cachimbas" className="w-full h-40 md:h-48 object-cover" />
                  <img src="https://img.freepik.com/foto-gratis/cachimba-primer-plano-lista-fumar_23-2149173607.jpg?semt=ais_hybrid&w=740&q=80" alt="Vapers" className="w-full h-40 md:h-48 object-cover" />
                  <img src="https://img.freepik.com/fotos-premium/shisha-cachimba-vidrio-recipiente-metal-sobre-mesa_118086-3034.jpg?semt=ais_hybrid&w=740&q=80" alt="Accesorios" className="w-full h-40 md:h-48 object-cover col-span-2" />
                </div>
              </div>
              <div className="absolute -bottom-6 -left-6 hidden lg:block w-32 h-32 bg-white/70 rounded-full blur-xl"></div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">Áreas de la plataforma</h2>
          <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-6">
            <div className="bg-white/80 backdrop-blur rounded-2xl p-6 text-center ring-1 ring-gray-200 shadow-sm hover:shadow-md transition">
              <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/></svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Publicaciones</h3>
              <p className="text-gray-600 text-sm">Crear y editar productos, fotos y precios</p>
            </div>
            <div className="bg-white/80 backdrop-blur rounded-2xl p-6 text-center ring-1 ring-gray-200 shadow-sm hover:shadow-md transition">
              <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Búsqueda y filtros</h3>
              <p className="text-gray-600 text-sm">Explorar, filtrar y ordenar resultados</p>
            </div>
            <div className="bg-white/80 backdrop-blur rounded-2xl p-6 text-center ring-1 ring-gray-200 shadow-sm hover:shadow-md transition">
              <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4l8 6-8 6-8-6 8-6z"/></svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Chat y ofertas</h3>
              <p className="text-gray-600 text-sm">Mensajería, contraofertas y negociación</p>
            </div>
            <div className="bg-white/80 backdrop-blur rounded-2xl p-6 text-center ring-1 ring-gray-200 shadow-sm hover:shadow-md transition">
              <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Pagos protegidos</h3>
              <p className="text-gray-600 text-sm">Transacciones seguras y soporte</p>
            </div>
            <div className="bg-white/80 backdrop-blur rounded-2xl p-6 text-center ring-1 ring-gray-200 shadow-sm hover:shadow-md transition">
              <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 3a3.75 3.75 0 110 7.5 3.75 3.75 0 010-7.5zM2.25 21a7.5 7.5 0 0115 0H2.25z"/></svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Perfil y reputación</h3>
              <p className="text-gray-600 text-sm">Reseñas, calificaciones y verificación</p>
            </div>
            <div className="bg-white/80 backdrop-blur rounded-2xl p-6 text-center ring-1 ring-gray-200 shadow-sm hover:shadow-md transition">
              <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V4a2 2 0 10-4 0v1.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5"/></svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Notificaciones</h3>
              <p className="text-gray-600 text-sm">Alertas de sistema y estado</p>
            </div>
          </div>
        </div>
      </section>

      {/* Bug Report Form */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white/80 backdrop-blur rounded-2xl ring-1 ring-gray-200 shadow-sm p-8">
            {showSuccess && (
              <div className="mb-6 flex items-center justify-between bg-green-50 ring-1 ring-green-200 text-green-800 rounded-2xl p-4">
                <span className="text-sm">Tu reporte ha sido enviado. Gracias por tu ayuda.</span>
                <button onClick={() => setShowSuccess(false)} className="text-sm text-green-900 hover:underline">Cerrar</button>
              </div>
            )}
              <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">Formulario de Reporte de Bug</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="border-b border-gray-200 pb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Información Básica</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Título del Bug *</label>
                    <input
                      type="text"
                      name="title"
                      value={bugReport.title}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900"
                      placeholder="Describe brevemente el problema"
                    />
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Categoría *</label>
                      <select
                        name="category"
                        value={bugReport.category}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900"
                      >
                        <option value="">Selecciona un área</option>
                        <option value="listings">Publicaciones</option>
                        <option value="search">Búsqueda y filtros</option>
                        <option value="chat">Chat y ofertas</option>
                        <option value="payments">Pagos protegidos</option>
                        <option value="profile">Perfil y reputación</option>
                        <option value="notifications">Notificaciones y estado</option>
                        <option value="other">Otros</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Severidad *</label>
                      <select
                        name="severity"
                        value={bugReport.severity}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900"
                      >
                        <option value="low">Baja - Problema menor</option>
                        <option value="medium">Media - Afecta la experiencia</option>
                        <option value="high">Alta - Funcionalidad principal</option>
                        <option value="critical">Crítica - Sistema no funciona</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-b border-gray-200 pb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Contexto del Marketplace</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">ID de Producto (opcional)</label>
                    <input
                      type="text"
                      name="productId"
                      value={bugReport.productId}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900"
                      placeholder="Ej: PROD-12345"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">URL relacionada (opcional)</label>
                    <input
                      type="url"
                      name="pageUrl"
                      value={bugReport.pageUrl}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900"
                      placeholder="https://resmoke/..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">ID de Pedido/Transacción (opcional)</label>
                    <input
                      type="text"
                      name="orderId"
                      value={bugReport.orderId}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900"
                      placeholder="Ej: ORDER-98765"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">ID de Conversación/Chat (opcional)</label>
                    <input
                      type="text"
                      name="conversationId"
                      value={bugReport.conversationId}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900"
                      placeholder="Ej: CHAT-24680"
                    />
                  </div>
                </div>
              </div>
              
              {/* Environment Information */}
              <div className="border-b border-gray-200 pb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Información del Entorno</h3>
                
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Navegador *</label>
                    <select
                      name="browser"
                      value={bugReport.browser}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900"
                    >
                      <option value="">Selecciona navegador</option>
                      <option value="chrome">Google Chrome</option>
                      <option value="firefox">Mozilla Firefox</option>
                      <option value="safari">Safari</option>
                      <option value="edge">Microsoft Edge</option>
                      <option value="opera">Opera</option>
                      <option value="other">Otro</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Dispositivo *</label>
                    <select
                      name="device"
                      value={bugReport.device}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900"
                    >
                      <option value="">Selecciona dispositivo</option>
                      <option value="desktop">Computadora de Escritorio</option>
                      <option value="laptop">Laptop</option>
                      <option value="tablet">Tablet</option>
                      <option value="mobile">Teléfono Móvil</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Sistema Operativo *</label>
                    <select
                      name="os"
                      value={bugReport.os}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900"
                    >
                      <option value="">Selecciona SO</option>
                      <option value="windows">Windows</option>
                      <option value="macos">macOS</option>
                      <option value="linux">Linux</option>
                      <option value="android">Android</option>
                      <option value="ios">iOS</option>
                    </select>
                  </div>
                </div>
              </div>
              
              {/* Bug Details */}
              <div className="border-b border-gray-200 pb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Detalles del Bug</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Pasos para Reproducir *</label>
                    <textarea
                      name="stepsToReproduce"
                      value={bugReport.stepsToReproduce}
                      onChange={handleInputChange}
                      required
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900"
                      placeholder="1. Ir a la página...&#10;2. Hacer clic en...&#10;3. Escribir...&#10;4. Observar el error"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Comportamiento Esperado *</label>
                    <textarea
                      name="expectedBehavior"
                      value={bugReport.expectedBehavior}
                      onChange={handleInputChange}
                      required
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900"
                      placeholder="Describe qué debería pasar normalmente"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Comportamiento Actual *</label>
                    <textarea
                      name="actualBehavior"
                      value={bugReport.actualBehavior}
                      onChange={handleInputChange}
                      required
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900"
                      placeholder="Describe qué está pasando realmente"
                    />
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">¿Puedes reproducir el bug? *</label>
                      <select
                        name="canReproduce"
                        value={bugReport.canReproduce}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900"
                      >
                        <option value="">Selecciona una opción</option>
                        <option value="always">Siempre</option>
                        <option value="sometimes">A veces</option>
                        <option value="once">Solo una vez</option>
                        <option value="no">No puedo reproducirlo</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Frecuencia</label>
                      <select
                        name="frequency"
                        value={bugReport.frequency}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900"
                      >
                        <option value="">Selecciona frecuencia</option>
                        <option value="every-time">Cada vez que lo intento</option>
                        <option value="often">Frecuentemente</option>
                        <option value="sometimes">Ocasionalmente</option>
                        <option value="rarely">Raramente</option>
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Información Adicional</label>
                    <textarea
                      name="additionalInfo"
                      value={bugReport.additionalInfo}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900"
                      placeholder="Cualquier información adicional que pueda ser útil (mensajes de error, logs, etc.)"
                    />
                  </div>
                </div>
              </div>
              
              {/* Screenshots */}
              <div className="pb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Capturas de Pantalla</h3>
                
                <div className="border-2 border-dashed border-gray-300 rounded-2xl p-6">
                  <div className="text-center">
                    <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <p className="text-gray-600 mb-2">Arrastra capturas de pantalla aquí o haz clic para seleccionar</p>
                    <p className="text-sm text-gray-500">PNG, JPG hasta 5MB cada una. Evita incluir datos personales o información sensible.</p>
                    <input
                      type="file"
                      multiple
                      accept=".png,.jpg,.jpeg"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="screenshot-upload"
                    />
                    <label
                      htmlFor="screenshot-upload"
                      className="mt-3 inline-block bg-gray-900 text-white px-4 py-2 rounded-xl cursor-pointer hover:bg-gray-800 transition"
                    >
                      Seleccionar Imágenes
                    </label>
                  </div>
                  
                  {bugReport.screenshots.length > 0 && (
                    <div className="mt-4">
                      <h4 className="font-semibold text-gray-900 mb-2">Capturas seleccionadas:</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {bugReport.screenshots.map((file, index) => (
                          <div key={index} className="relative">
                            <div className="bg-gray-50 rounded-xl p-2 text-center ring-1 ring-gray-200">
                              <svg className="w-8 h-8 text-gray-400 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              <p className="text-xs text-gray-600 truncate">{file.name}</p>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeScreenshot(index)}
                              className="absolute -top-2 -right-2 bg-white ring-1 ring-gray-300 text-gray-900 rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-gray-50"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="bg-gray-100 rounded-2xl p-4">
                <div className="flex items-start">
                  <svg className="w-6 h-6 text-gray-900 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Consejos para un buen reporte:</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Sé específico y detallado en la descripción</li>
                      <li>• Incluye pasos claros para reproducir el problema</li>
                      <li>• Adjunta capturas de pantalla si es posible</li>
                      <li>• Oculta datos personales y números de pedido si no son necesarios</li>
                      <li>• Menciona si el problema afecta a otros usuarios</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center">
                <input type="checkbox" required className="mr-3" />
                <label className="text-sm text-gray-600">
                  Confirmo que he verificado que este bug no ha sido reportado anteriormente y que la información proporcionada es precisa.
                </label>
              </div>
              
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-3 px-6 rounded-xl font-semibold transition-colors ${
                  isSubmitting
                    ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                    : 'bg-gray-900 text-white hover:bg-gray-800'
                }`}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Enviando Reporte...
                  </div>
                ) : (
                  'Enviar Reporte de Bug'
                )}
              </button>
            </form>
          </div>
        </div>
      </section>

      

      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Proceso de resolución</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="bg-white/80 backdrop-blur rounded-2xl p-6 text-center ring-1 ring-gray-200 shadow-sm">
              <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-gray-900">24h</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Confirmación</h3>
              <p className="text-gray-600 text-sm">Revisamos y confirmamos el bug reportado</p>
            </div>
            <div className="bg-white/80 backdrop-blur rounded-2xl p-6 text-center ring-1 ring-gray-200 shadow-sm">
              <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-gray-900">3-7d</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Investigación</h3>
              <p className="text-gray-600 text-sm">Analizamos la causa raíz del problema</p>
            </div>
            <div className="bg-white/80 backdrop-blur rounded-2xl p-6 text-center ring-1 ring-gray-200 shadow-sm">
              <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-gray-900">1-2w</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Desarrollo</h3>
              <p className="text-gray-600 text-sm">Implementamos y probamos la solución</p>
            </div>
            <div className="bg-white/80 backdrop-blur rounded-2xl p-6 text-center ring-1 ring-gray-200 shadow-sm">
              <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-gray-900">✓</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Despliegue</h3>
              <p className="text-gray-600 text-sm">Bug corregido y desplegado en producción</p>
            </div>
          </div>
        </div>
      </section>

      {/* Thank You */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">¡Gracias por Ayudarnos a Mejorar!</h2>
          <p className="text-lg text-gray-600 mb-8">
            Cada bug reportado nos ayuda a hacer de Resmoke una plataforma mejor para todos.
          </p>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white/80 backdrop-blur rounded-2xl p-6 ring-1 ring-gray-200 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Seguimiento</h3>
              <p className="text-gray-600 text-sm">
                Te mantendremos informado sobre el progreso de tu reporte
              </p>
            </div>
            
            <div className="bg-white/80 backdrop-blur rounded-2xl p-6 ring-1 ring-gray-200 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Reconocimiento</h3>
              <p className="text-gray-600 text-sm">
                Los reportes valiosos son reconocidos en nuestros créditos
              </p>
            </div>
            
            <div className="bg-white/80 backdrop-blur rounded-2xl p-6 ring-1 ring-gray-200 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Comunidad</h3>
              <p className="text-gray-600 text-sm">
                Únete a nuestra comunidad de beta testers
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
    </>
  );
};

export default ReportBugPage;