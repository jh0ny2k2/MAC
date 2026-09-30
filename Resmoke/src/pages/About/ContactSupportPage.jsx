import React, { useState } from 'react';
import SEO from '../../components/SEO/SEO';

const ContactSupportPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    category: '',
    priority: 'medium',
    message: '',
    attachments: []
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    setFormData(prev => {
      const next = [...prev.attachments, ...files];
      return {
        ...prev,
        attachments: next.slice(0, 5)
      };
    });
  };

  const removeAttachment = (index) => {
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simular envío
    setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccess(true);
      setFormData({
        name: '',
        email: '',
        subject: '',
        category: '',
        priority: 'medium',
        message: '',
        attachments: []
      });
    }, 2000);
  };

  return (
    <>
      <SEO title="Contactar Soporte" description="Contacta al equipo de soporte de Resmoke. Resuelve tus dudas y recibe ayuda personalizada." url="/contactar-soporte"/>
      <div className="min-h-screen bg-gray-50">
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-8">
              <span className="inline-block px-4 py-1 mb-4 rounded-full bg-blue-50 ring-1 ring-blue-200 text-sm tracking-wide text-blue-700">Resmoke</span>
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900">Contactar Soporte</h1>
              <p className="mt-4 text-lg text-gray-600 max-w-xl">Estamos aquí para ayudarte. Envíanos tu consulta y te responderemos lo antes posible.</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <a href="#formulario" className="inline-flex items-center px-5 py-3 rounded-xl bg-gray-900 text-white hover:bg-gray-800 transition">Enviar solicitud</a>
                <a href="/reportar-bug" className="inline-flex items-center px-5 py-3 rounded-xl ring-1 ring-gray-300 text-gray-900 hover:bg-gray-50 transition">Reportar un problema</a>
              </div>
              <div className="mt-8 grid grid-cols-3 gap-6 text-center">
                <div className="bg-white/70 backdrop-blur rounded-xl ring-1 ring-gray-200 p-4 shadow-sm">
                  <p className="text-2xl font-bold text-gray-900">24h</p>
                  <p className="text-xs text-gray-500">respuesta</p>
                </div>
                <div className="bg-white/70 backdrop-blur rounded-xl ring-1 ring-gray-200 p-4 shadow-sm">
                  <p className="text-2xl font-bold text-gray-900">+50</p>
                  <p className="text-xs text-gray-500">artículos</p>
                </div>
                <div className="bg-white/70 backdrop-blur rounded-xl ring-1 ring-gray-200 p-4 shadow-sm">
                  <p className="text-2xl font-bold text-gray-900">Comunidad</p>
                  <p className="text-xs text-gray-500">activa</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">Opciones de Contacto</h2>
          
          <div className="grid md:grid-cols-4 gap-6 mb-12">
            <div className="bg-white/80 backdrop-blur rounded-2xl ring-1 ring-gray-200 p-6 text-center shadow-sm hover:shadow-md transition">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Chat en Vivo</h3>
              <p className="text-gray-600 text-sm mb-3">Respuesta inmediata</p>
              <p className="text-xs text-gray-500">Lun-Vie 9AM-6PM</p>
              <button
                onClick={() => {
                  const storedUser = localStorage.getItem('user');
                  if (storedUser) {
                    window.location.href = '/chat/3';
                  } else {
                    alert('Debes iniciar sesión para acceder al chat');
                    window.location.href = '/login';
                  }
                }}
                className="mt-3 bg-gray-900 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-gray-800 transition"
                aria-label="Iniciar chat en vivo"
              >
                Iniciar Chat
              </button>
            </div>
            
            <div className="bg-white/80 backdrop-blur rounded-2xl ring-1 ring-gray-200 p-6 text-center shadow-sm hover:shadow-md transition">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Teléfono</h3>
              <p className="text-gray-600 text-sm mb-3">Soon</p>
              <p className="text-xs text-gray-500">Lun-Vie 8AM-8PM</p>
              <a href="tel:+34999999999" className="mt-3 inline-block bg-gray-900 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-gray-800 transition" aria-label="Llamar por teléfono">
                Llamar Ahora
              </a>
            </div>
            
            <div className="bg-white/80 backdrop-blur rounded-2xl ring-1 ring-gray-200 p-6 text-center shadow-sm hover:shadow-md transition">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Email</h3>
              <p className="text-gray-600 text-sm mb-3">info.resmoke@gmail.com</p>
              <p className="text-xs text-gray-500">Respuesta en 24h</p>
              <div className="mt-3 flex items-center justify-center gap-3">
                <a href="mailto:info.resmoke@gmail.com" className="bg-gray-900 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-gray-800 transition" aria-label="Enviar email">
                Enviar Email
                </a>
                <button onClick={() => navigator.clipboard?.writeText('info.resmoke@gmail.com')} className="ring-1 ring-gray-300 px-3 py-2 rounded-xl text-sm text-gray-900 hover:bg-gray-50" aria-label="Copiar email">
                  Copiar
                </button>
              </div>
            </div>
            
            <div className="bg-white/80 backdrop-blur rounded-2xl ring-1 ring-gray-200 p-6 text-center shadow-sm hover:shadow-md transition">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Ticket</h3>
              <p className="text-gray-600 text-sm mb-3">Sistema de tickets</p>
              <p className="text-xs text-gray-500">Seguimiento completo</p>
              <a href="#formulario" className="mt-3 inline-block bg-gray-900 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-gray-800 transition" aria-label="Crear ticket">
                Crear Ticket
              </a>
            </div>
          </div>
        </div>
      </section>

      <section id="formulario" className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white/80 backdrop-blur rounded-2xl ring-1 ring-gray-200 shadow-sm p-8">
            {showSuccess && (
              <div className="mb-6 flex items-center justify-between bg-green-50 ring-1 ring-green-200 text-green-800 rounded-2xl p-4">
                <div className="flex items-center">
                  <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <span className="text-sm">Tu solicitud ha sido enviada. Te contactaremos pronto.</span>
                </div>
                <button onClick={() => setShowSuccess(false)} className="text-sm text-green-900 hover:underline">Cerrar</button>
              </div>
            )}
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">Enviar Solicitud de Soporte</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nombre Completo *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900"
                    placeholder="Tu nombre completo"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900"
                    placeholder="tu@email.com"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Asunto *</label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900"
                  placeholder="Describe brevemente tu consulta"
                />
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Categoría *</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900"
                  >
                    <option value="">Selecciona una categoría</option>
                    <option value="account">Problemas de Cuenta</option>
                    <option value="payment">Pagos y Facturación</option>
                    <option value="technical">Problemas Técnicos</option>
                    <option value="security">Seguridad</option>
                    <option value="product">Gestión de Productos</option>
                    <option value="order">Pedidos y Envíos</option>
                    <option value="other">Otros</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Prioridad</label>
                  <select
                    name="priority"
                    value={formData.priority}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900"
                  >
                    <option value="low">Baja - Consulta general</option>
                    <option value="medium">Media - Problema que afecta el uso</option>
                    <option value="high">Alta - Problema crítico</option>
                    <option value="urgent">Urgente - Sistema no funciona</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Descripción del Problema *</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900"
                  placeholder="Describe detalladamente tu problema o consulta. Incluye pasos para reproducir el problema si es técnico."
                />
                <div className="mt-1 text-right text-xs text-gray-500">{formData.message.length}/1000</div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Archivos Adjuntos</label>
                <div className="border-2 border-dashed border-gray-300 rounded-2xl p-6">
                  <div className="text-center">
                    <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                    </svg>
                    <p className="text-gray-600 mb-2">Arrastra archivos aquí o haz clic para seleccionar</p>
                    <p className="text-sm text-gray-500">PNG, JPG, PDF hasta 10MB cada uno</p>
                    <input
                      type="file"
                      multiple
                      accept=".png,.jpg,.jpeg,.pdf,.txt,.doc,.docx"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="file-upload"
                    />
                    <label
                      htmlFor="file-upload"
                      className="mt-3 inline-block bg-gray-900 text-white px-4 py-2 rounded-xl cursor-pointer hover:bg-gray-800 transition"
                    >
                      Seleccionar Archivos
                    </label>
                  </div>
                  
                  {formData.attachments.length > 0 && (
                    <div className="mt-4">
                      <h4 className="font-semibold text-gray-900 mb-2">Archivos seleccionados:</h4>
                      <div className="space-y-2">
                        {formData.attachments.map((file, index) => (
                          <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded-xl">
                            <span className="text-sm text-gray-700">{file.name}</span>
                            <button
                              type="button"
                              onClick={() => removeAttachment(index)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
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
                    <h4 className="font-semibold text-gray-900 mb-1">Consejos para una respuesta más rápida:</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Sé específico sobre el problema</li>
                      <li>• Incluye capturas de pantalla si es relevante</li>
                      <li>• Menciona qué navegador y dispositivo usas</li>
                      <li>• Describe los pasos que llevaron al problema</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center">
                <input type="checkbox" required className="mr-3" />
                <label className="text-sm text-gray-600">
                  Acepto que Resmoke use la información proporcionada para resolver mi consulta y mejorar el servicio.
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
                    Enviando...
                  </div>
                ) : (
                  'Enviar Solicitud'
                )}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Response Times */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Tiempos de Respuesta</h2>
          
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">5min</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Chat en Vivo</h3>
              <p className="text-gray-600 text-sm">Respuesta inmediata durante horario de atención</p>
            </div>
            
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">2h</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Tickets Urgentes</h3>
              <p className="text-gray-600 text-sm">Problemas críticos que afectan el servicio</p>
            </div>
            
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-600">24h</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Consultas Generales</h3>
              <p className="text-gray-600 text-sm">Preguntas y problemas de prioridad media</p>
            </div>
            
            <div className="text-center">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-orange-600">72h</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Solicitudes Complejas</h3>
              <p className="text-gray-600 text-sm">Casos que requieren investigación detallada</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Preguntas Frecuentes sobre Soporte</h2>
          
          <div className="space-y-6">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-2">¿Cómo puedo hacer seguimiento a mi ticket?</h3>
              <p className="text-gray-600">
                Recibirás un número de ticket por email. Puedes usar este número para hacer seguimiento 
                en nuestra página de estado de tickets o contactarnos directamente.
              </p>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-2">¿Qué información debo incluir en mi solicitud?</h3>
              <p className="text-gray-600">
                Incluye una descripción detallada del problema, pasos para reproducirlo, 
                capturas de pantalla si es relevante, y información sobre tu navegador y dispositivo.
              </p>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-2">¿Ofrecen soporte en otros idiomas?</h3>
              <p className="text-gray-600">
                Actualmente ofrecemos soporte en español e inglés. Nuestro equipo está disponible 
                para ayudarte en ambos idiomas durante nuestro horario de atención.
              </p>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-2">¿Hay soporte 24/7?</h3>
              <p className="text-gray-600">
                El chat en vivo está disponible de lunes a viernes de 9AM a 6PM. 
                Para emergencias fuera de horario, puedes enviar un ticket urgente y lo atenderemos lo antes posible.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
    </>
  );
};

export default ContactSupportPage;