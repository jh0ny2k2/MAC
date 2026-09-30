import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
import SEO from '../../components/SEO/SEO';

const ReportSuspiciousActivityPage = () => {
  const [selectedReportType, setSelectedReportType] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    reportType: '',
    description: '',
    urgency: 'medium',
    contactMethod: 'email',
    userEmail: '',
    userName: '',
    evidence: null
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const reportTypes = {
    emergency: {
      title: 'Emergencia',
      description: 'Cuenta comprometida o fraude activo',
      motivo: 'Emergencia de seguridad - Cuenta comprometida o fraude activo',
      color: 'red'
    },
    suspicious: {
      title: 'Usuario Sospechoso',
      description: 'Comportamiento extraño o estafa',
      motivo: 'Usuario con comportamiento sospechoso o actividad fraudulenta',
      color: 'yellow'
    },
    fake: {
      title: 'Producto Falso',
      description: 'Artículo falsificado o engañoso',
      motivo: 'Producto falsificado o información engañosa',
      color: 'blue'
    }
  };

  const contactMethods = [
    {
      id: 'email',
      name: 'Email',
      description: 'Respuesta por correo electrónico',
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
    },
    {
      id: 'chat',
      name: 'Chat en Vivo',
      description: 'Conversación inmediata',
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
    },
    {
      id: 'phone',
      name: 'Teléfono',
      description: 'Llamada telefónica',
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
    }
  ];

  const getColorClasses = (color) => {
    const colorMap = {
      red: 'bg-red-50 border-red-200',
      yellow: 'bg-yellow-50 border-yellow-200',
      blue: 'bg-blue-50 border-blue-200',
      gray: 'bg-gray-50 border-gray-200'
    };
    return colorMap[color] || colorMap.gray;
  };

  const getButtonClasses = (color) => {
    const colorMap = {
      red: 'bg-red-600 hover:bg-red-700',
      yellow: 'bg-yellow-600 hover:bg-yellow-700',
      blue: 'bg-blue-600 hover:bg-blue-700',
      gray: 'bg-gray-600 hover:bg-gray-700'
    };
    return colorMap[color] || colorMap.gray;
  };

  const handleReportTypeSelect = (type) => {
    setSelectedReportType(type);
    setFormData({
      ...formData,
      reportType: reportTypes[type].motivo
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedReportType('');
    setFormData({
      reportType: '',
      description: '',
      urgency: 'medium',
      contactMethod: 'email',
      userEmail: '',
      userName: '',
      evidence: null
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      evidence: e.target.files[0]
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Preparar los datos para enviar
      const reportData = {
        report_type: formData.reportType,
        description: formData.description,
        urgency: formData.urgency,
        contact_method: formData.contactMethod,
        user_email: formData.userEmail,
        user_name: formData.userName,
        evidence_filename: formData.evidence ? formData.evidence.name : null,
        status: 'pending',
        created_at: new Date().toISOString()
      };

      // Insertar el reporte en la base de datos
      const { data, error } = await supabase
        .from('suspicious_activity_reports')
        .insert([reportData])
        .select();

      if (error) {
        console.error('Error al enviar el reporte:', error);
        alert('Error al enviar el reporte. Por favor, inténtalo de nuevo.');
        return;
      }

      console.log('Reporte enviado exitosamente:', data);
      setIsSubmitted(true);
      setIsModalOpen(false);
      
      // Mostrar mensaje de éxito
      alert('¡Reporte enviado exitosamente! Nos pondremos en contacto contigo pronto.');
      
    } catch (error) {
      console.error('Error inesperado:', error);
      alert('Error inesperado. Por favor, inténtalo de nuevo.');
    }
  };

  return (
    <>
      <SEO title="Reportar Actividad Sospechosa" description="Reporta actividad sospechosa en Resmoke. Ayúdanos a mantener segura la comunidad." url="/reportar-actividad-sospechosa"/>
      <div className="min-h-screen bg-gray-50">
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6">
              <span className="inline-block px-4 py-1 mb-4 rounded-full bg-red-50 ring-1 ring-red-200 text-sm tracking-wide text-red-700">Seguridad</span>
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900">Reportar Actividad Sospechosa</h1>
              <p className="mt-4 text-lg text-gray-600 max-w-xl">Ayúdanos a mantener Resmoke seguro para todos.</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <a href="#acciones" className="inline-flex items-center px-5 py-3 rounded-xl bg-gray-900 text-white hover:bg-gray-800 transition">Acciones rápidas</a>
                <a href="#tipos" className="inline-flex items-center px-5 py-3 rounded-xl ring-1 ring-gray-300 text-gray-900 hover:bg-gray-50 transition">Tipos de reportes</a>
              </div>
              <div className="mt-8 grid grid-cols-3 gap-6 text-center">
                <div className="bg-white/70 backdrop-blur rounded-xl ring-1 ring-gray-200 p-4 shadow-sm">
                  <p className="text-2xl font-bold text-gray-900">Crítico</p>
                  <p className="text-xs text-gray-500">respuesta inmediata</p>
                </div>
                <div className="bg-white/70 backdrop-blur rounded-xl ring-1 ring-gray-200 p-4 shadow-sm">
                  <p className="text-2xl font-bold text-gray-900">24-48h</p>
                  <p className="text-xs text-gray-500">investigación</p>
                </div>
                <div className="bg-white/70 backdrop-blur rounded-xl ring-1 ring-gray-200 p-4 shadow-sm">
                  <p className="text-2xl font-bold text-gray-900">Seguimiento</p>
                  <p className="text-xs text-gray-500">notificación</p>
                </div>
              </div>
            </div>
            <div className="lg:col-span-6 relative">
              <div className="aspect-[4/3] rounded-2xl backdrop-blur overflow-hidden">
                <img src="https://cdn-icons-png.flaticon.com/512/3850/3850840.png" alt="Reportar actividad sospechosa" className="w-full h-full object-contain" />
              </div>
              <div className="absolute -bottom-6 -left-6 hidden lg:block w-32 h-32 bg-white/70 rounded-full blur-xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-12 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Acciones Rápidas</h2>
            <p className="text-lg text-gray-600">
              Si necesitas ayuda inmediata, usa estos enlaces rápidos.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {Object.entries(reportTypes).map(([key, type]) => (
               <div 
                 key={key}
                 className={`rounded-lg p-6 text-center border cursor-pointer transition-all hover:shadow-md ${getColorClasses(type.color)}`}
               >
                <div className={`bg-${type.color}-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4`}>
                  {key === 'emergency' && (
                    <svg className={`w-8 h-8 text-${type.color}-600`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                  )}
                  {key === 'suspicious' && (
                    <svg className={`w-8 h-8 text-${type.color}-600`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  )}
                  {key === 'fake' && (
                    <svg className={`w-8 h-8 text-${type.color}-600`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  )}
                </div>
                 <h3 className="text-lg font-bold text-gray-900 mb-2">{type.title}</h3>
                 <p className="text-gray-600 text-sm mb-4">{type.description}</p>
                 <button 
                   onClick={() => handleReportTypeSelect(key)}
                   className={`px-4 py-2 text-white font-semibold rounded-lg transition-colors w-full ${getButtonClasses(type.color)}`}
                 >
                   Reportar {type.title}
                 </button>
               </div>
            ))}
          </div>
        </div>
      </section>

      {/* Report Types */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Tipos de Reportes</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <div className="flex items-center mb-4">
                <div className="bg-red-100 w-12 h-12 rounded-full flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900">Problemas de Seguridad</h3>
              </div>
              
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-red-600 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  <span>Cuenta comprometida o hackeada</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-red-600 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  <span>Transacciones no autorizadas</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-red-600 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  <span>Intentos de phishing o estafa</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-red-600 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  <span>Uso no autorizado de información personal</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-red-600 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  <span>Vulnerabilidades de seguridad</span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <div className="flex items-center mb-4">
                <div className="bg-yellow-100 w-12 h-12 rounded-full flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900">Comportamiento Sospechoso</h3>
              </div>
              
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-yellow-600 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  <span>Usuarios con múltiples cuentas falsas</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-yellow-600 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  <span>Actividad de compra/venta inusual</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-yellow-600 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  <span>Comunicación sospechosa o amenazante</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-yellow-600 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  <span>Intentos de evadir políticas</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-yellow-600 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  <span>Manipulación de reseñas o calificaciones</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* What Happens Next */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">¿Qué Sucede Después?</h2>
          
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Recepción</h3>
              <p className="text-gray-600 text-sm">Recibimos tu reporte y lo asignamos a nuestro equipo especializado</p>
            </div>
            
            <div className="text-center">
              <div className="bg-yellow-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-yellow-600">2</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Investigación</h3>
              <p className="text-gray-600 text-sm">Nuestros expertos analizan la información y evidencia proporcionada</p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">3</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Acción</h3>
              <p className="text-gray-600 text-sm">Tomamos las medidas apropiadas según nuestras políticas</p>
            </div>
            
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-600">4</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Seguimiento</h3>
              <p className="text-gray-600 text-sm">Te notificamos sobre el resultado y las acciones tomadas</p>
            </div>
          </div>
          
          <div className="mt-12 bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Tiempos de Respuesta</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Reportes Críticos:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Cuentas comprometidas: <span className="font-semibold">Inmediato</span></li>
                  <li>• Fraude activo: <span className="font-semibold">1-2 horas</span></li>
                  <li>• Amenazas de seguridad: <span className="font-semibold">2-4 horas</span></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Reportes Estándar:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Usuarios sospechosos: <span className="font-semibold">24-48 horas</span></li>
                  <li>• Productos falsos: <span className="font-semibold">2-3 días</span></li>
                  <li>• Otros problemas: <span className="font-semibold">3-5 días</span></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modal */}
       {isModalOpen && (
         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
           <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
             {/* Modal Header */}
             <div className={`px-6 py-4 border-b ${getColorClasses(reportTypes[selectedReportType]?.color || 'gray')}`}>
               <div className="flex items-center justify-between">
                 <h2 className="text-2xl font-bold text-gray-900">
                   Reportar {reportTypes[selectedReportType]?.title}
                 </h2>
                 <button
                   onClick={closeModal}
                   className="text-gray-500 hover:text-gray-700 transition-colors"
                 >
                   <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                   </svg>
                 </button>
               </div>
             </div>

             {/* Modal Content */}
             <div className="p-6">
               {/* Contact Methods Table */}
               <div className="mb-8">
                 <h3 className="text-xl font-bold text-gray-900 mb-4">Métodos de Contacto Disponibles</h3>
                 <div className="bg-gray-50 rounded-lg overflow-hidden">
                   <table className="min-w-full divide-y divide-gray-200">
                     <thead className="bg-gray-100">
                       <tr>
                         <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                           Método
                         </th>
                         <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                           Descripción
                         </th>
                         <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                           Tiempo de Respuesta
                         </th>
                         <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                           Seleccionar
                         </th>
                       </tr>
                     </thead>
                     <tbody className="bg-white divide-y divide-gray-200">
                       {contactMethods.map((method) => (
                         <tr key={method.id} className={formData.contactMethod === method.id ? 'bg-blue-50' : 'hover:bg-gray-50'}>
                           <td className="px-4 py-3 whitespace-nowrap">
                             <div className="flex items-center">
                               <div className="text-blue-600 mr-3">
                                 {method.icon}
                               </div>
                               <div className="text-sm font-medium text-gray-900">
                                 {method.name}
                               </div>
                             </div>
                           </td>
                           <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                             {method.description}
                           </td>
                           <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                             {method.id === 'email' && '2-4 horas'}
                             {method.id === 'chat' && 'Inmediata'}
                             {method.id === 'phone' && '24/7'}
                           </td>
                           <td className="px-4 py-3 whitespace-nowrap">
                             <input
                               type="radio"
                               name="contactMethod"
                               value={method.id}
                               checked={formData.contactMethod === method.id}
                               onChange={handleInputChange}
                               className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                             />
                           </td>
                         </tr>
                       ))}
                     </tbody>
                   </table>
                 </div>
               </div>

               {/* Report Form */}
               <form onSubmit={handleSubmit}>
                 {/* Motivo (Auto-filled) */}
                 <div className="mb-6">
                   <label className="block text-sm font-medium text-gray-700 mb-2">
                     Motivo del Reporte
                   </label>
                   <input
                     type="text"
                     value={formData.reportType}
                     readOnly
                     className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-700"
                   />
                 </div>

                 {/* Description */}
                 <div className="mb-6">
                   <label className="block text-sm font-medium text-gray-700 mb-2">
                     Descripción Detallada *
                   </label>
                   <textarea
                     name="description"
                     value={formData.description}
                     onChange={handleInputChange}
                     required
                     rows={4}
                     placeholder="Describe la situación con el mayor detalle posible..."
                     className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                   />
                 </div>

                 {/* Urgency */}
                 <div className="mb-6">
                   <label className="block text-sm font-medium text-gray-700 mb-2">
                     Nivel de Urgencia
                   </label>
                   <select
                     name="urgency"
                     value={formData.urgency}
                     onChange={handleInputChange}
                     className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                   >
                     <option value="low">Baja - No es urgente</option>
                     <option value="medium">Media - Requiere atención</option>
                     <option value="high">Alta - Urgente</option>
                     <option value="critical">Crítica - Emergencia</option>
                   </select>
                 </div>

                 {/* Contact Info */}
                 <div className="grid md:grid-cols-2 gap-6 mb-6">
                   <div>
                     <label className="block text-sm font-medium text-gray-700 mb-2">
                       Tu Nombre *
                     </label>
                     <input
                       type="text"
                       name="userName"
                       value={formData.userName}
                       onChange={handleInputChange}
                       required
                       className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                     />
                   </div>
                   <div>
                     <label className="block text-sm font-medium text-gray-700 mb-2">
                       Tu Email *
                     </label>
                     <input
                       type="email"
                       name="userEmail"
                       value={formData.userEmail}
                       onChange={handleInputChange}
                       required
                       className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                     />
                   </div>
                 </div>

                 {/* Evidence Upload */}
                 <div className="mb-6">
                   <label className="block text-sm font-medium text-gray-700 mb-2">
                     Evidencia (Opcional)
                   </label>
                   <input
                     type="file"
                     onChange={handleFileChange}
                     accept="image/*,.pdf,.doc,.docx"
                     className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                   />
                   <p className="text-sm text-gray-500 mt-1">
                     Formatos aceptados: JPG, PNG, PDF, DOC, DOCX (máx. 10MB)
                   </p>
                 </div>

                 {/* Modal Footer */}
                 <div className="flex justify-end space-x-4 pt-4 border-t">
                   <button
                     type="button"
                     onClick={closeModal}
                     className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                   >
                     Cancelar
                   </button>
                   <button
                     type="submit"
                     className={`px-8 py-2 text-white font-semibold rounded-lg transition-colors ${
                       selectedReportType ? getButtonClasses(reportTypes[selectedReportType].color) : 'bg-gray-600 hover:bg-gray-700'
                     }`}
                   >
                     Enviar Reporte
                   </button>
                 </div>
               </form>
             </div>
           </div>
         </div>
       )}

      {/* Emergency Contact */}
      <section className="py-16 bg-red-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">¿Necesitas Ayuda Inmediata?</h2>
          <p className="text-xl text-red-100 mb-8">
            Para emergencias de seguridad, contáctanos directamente.
          </p>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-red-700 rounded-lg p-6">
              <div className="bg-red-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold mb-2">Línea de Emergencia</h3>
              <p className="text-red-100 text-sm">+1 (555) 911-HELP</p>
              <p className="text-red-200 text-xs">24/7 para emergencias</p>
            </div>
            
            <div className="bg-red-700 rounded-lg p-6">
              <div className="bg-red-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold mb-2">Email Urgente</h3>
              <p className="text-red-100 text-sm">urgent@resmoke.com</p>
              <p className="text-red-200 text-xs">Respuesta prioritaria</p>
            </div>
            
            <div className="bg-red-700 rounded-lg p-6">
              <div className="bg-red-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold mb-2">Chat de Emergencia</h3>
              <p className="text-red-100 text-sm">Desde tu cuenta</p>
              <p className="text-red-200 text-xs">Soporte inmediato</p>
            </div>
          </div>
        </div>
      </section>
    </div>
    </>
  );
};

export default ReportSuspiciousActivityPage;