import React, { useState, useEffect } from 'react';
import SEO from '../../components/SEO/SEO';

const SystemStatusPage = () => {
  const [currentStatus, setCurrentStatus] = useState('operational');
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // Simular datos en tiempo real
  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdated(new Date());
    }, 30000); // Actualizar cada 30 segundos

    return () => clearInterval(interval);
  }, []);

  const services = [
    {
      name: 'Sitio Web Principal',
      status: 'operational',
      uptime: '99.98%',
      responseTime: '245ms',
      description: 'Plataforma web de Resmoke'
    },
    {
      name: 'API de Productos',
      status: 'operational',
      uptime: '99.95%',
      responseTime: '180ms',
      description: 'Servicios de gestión de productos'
    },
    {
      name: 'Sistema de Pagos',
      status: 'operational',
      uptime: '99.99%',
      responseTime: '320ms',
      description: 'Procesamiento de transacciones'
    },
    {
      name: 'Autenticación',
      status: 'operational',
      uptime: '99.97%',
      responseTime: '150ms',
      description: 'Login y registro de usuarios'
    },
    {
      name: 'Búsqueda',
      status: 'degraded',
      uptime: '98.85%',
      responseTime: '850ms',
      description: 'Motor de búsqueda de productos'
    },
    {
      name: 'Notificaciones',
      status: 'operational',
      uptime: '99.92%',
      responseTime: '200ms',
      description: 'Sistema de notificaciones push y email'
    },
    {
      name: 'Subida de Imágenes',
      status: 'operational',
      uptime: '99.89%',
      responseTime: '1.2s',
      description: 'Almacenamiento y procesamiento de imágenes'
    },
    {
      name: 'Chat en Vivo',
      status: 'maintenance',
      uptime: '95.20%',
      responseTime: 'N/A',
      description: 'Sistema de soporte en tiempo real'
    }
  ];

  const incidents = [
    {
      id: 1,
      title: 'Mantenimiento programado del sistema de chat',
      status: 'scheduled',
      severity: 'low',
      startTime: '2024-01-15 02:00 UTC',
      endTime: '2024-01-15 04:00 UTC',
      description: 'Actualizaremos el sistema de chat para mejorar el rendimiento.',
      updates: [
        {
          time: '2024-01-15 02:00 UTC',
          message: 'Mantenimiento iniciado según lo programado.'
        }
      ]
    },
    {
      id: 2,
      title: 'Degradación en el rendimiento de búsqueda',
      status: 'investigating',
      severity: 'medium',
      startTime: '2024-01-14 15:30 UTC',
      description: 'Algunos usuarios experimentan tiempos de respuesta lentos en las búsquedas.',
      updates: [
        {
          time: '2024-01-14 16:45 UTC',
          message: 'Hemos identificado la causa y estamos trabajando en una solución.'
        },
        {
          time: '2024-01-14 15:30 UTC',
          message: 'Investigando reportes de búsquedas lentas.'
        }
      ]
    }
  ];

  const metrics = [
    {
      name: 'Tiempo de Actividad Global',
      value: '99.94%',
      trend: 'up',
      period: 'Últimos 30 días'
    },
    {
      name: 'Tiempo de Respuesta Promedio',
      value: '285ms',
      trend: 'stable',
      period: 'Últimas 24 horas'
    },
    {
      name: 'Usuarios Activos',
      value: '12,847',
      trend: 'up',
      period: 'En este momento'
    },
    {
      name: 'Transacciones por Minuto',
      value: '1,234',
      trend: 'up',
      period: 'Promedio actual'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'operational':
        return 'text-green-600 bg-green-100';
      case 'degraded':
        return 'text-yellow-600 bg-yellow-100';
      case 'maintenance':
        return 'text-blue-600 bg-blue-100';
      case 'outage':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'operational':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        );
      case 'degraded':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        );
      case 'maintenance':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        );
      case 'outage':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        );
      default:
        return null;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'operational':
        return 'Operacional';
      case 'degraded':
        return 'Degradado';
      case 'maintenance':
        return 'Mantenimiento';
      case 'outage':
        return 'Fuera de Servicio';
      default:
        return 'Desconocido';
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'low':
        return 'bg-blue-100 text-blue-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'critical':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <>
      <SEO title="Estado del Sistema" description="Consulta el estado actual de los servicios de Resmoke y verifica si hay incidentes reportados." url="/estado-sistema"/>
      <div className="min-h-screen bg-gray-50">
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6">
              <span className="inline-block px-4 py-1 mb-4 rounded-full bg-green-50 ring-1 ring-green-200 text-sm tracking-wide text-green-700">Estado</span>
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900">Estado del Sistema</h1>
              <p className="mt-4 text-lg text-gray-600 max-w-xl">Monitoreo en tiempo real de todos nuestros servicios.</p>
              <div className="mt-6 inline-flex items-center rounded-xl ring-1 ring-gray-300 px-6 py-3">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-3 animate-pulse"></div>
                <span className="text-gray-900 font-semibold">Todos los sistemas operacionales</span>
              </div>
              <p className="text-gray-500 text-sm mt-3">Última actualización: {lastUpdated.toLocaleString('es-ES')}</p>
              <div className="mt-8 grid grid-cols-3 gap-6 text-center">
                <div className="bg-white/70 backdrop-blur rounded-xl ring-1 ring-gray-200 p-4 shadow-sm">
                  <p className="text-2xl font-bold text-gray-900">99.9%</p>
                  <p className="text-xs text-gray-500">uptime</p>
                </div>
                <div className="bg-white/70 backdrop-blur rounded-xl ring-1 ring-gray-200 p-4 shadow-sm">
                  <p className="text-2xl font-bold text-gray-900">285ms</p>
                  <p className="text-xs text-gray-500">respuesta</p>
                </div>
                <div className="bg-white/70 backdrop-blur rounded-xl ring-1 ring-gray-200 p-4 shadow-sm">
                  <p className="text-2xl font-bold text-gray-900">12.8k</p>
                  <p className="text-xs text-gray-500">usuarios</p>
                </div>
              </div>
            </div>
            <div className="lg:col-span-6 relative">
              <div className="aspect-[4/3] rounded-2xl backdrop-blur overflow-hidden">
                <img src="https://cdn-icons-png.flaticon.com/512/2910/2910076.png" alt="Estado del sistema" className="w-full h-full object-contain" />
              </div>
              <div className="absolute -bottom-6 -left-6 hidden lg:block w-32 h-32 bg-white/70 rounded-full blur-xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Metrics */}
      <section className="py-12 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">Métricas Clave</h2>
          
          <div className="grid md:grid-cols-4 gap-6">
            {metrics.map((metric, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-6 text-center">
                <div className="flex items-center justify-center mb-2">
                  <span className="text-3xl font-bold text-gray-900">{metric.value}</span>
                  {metric.trend === 'up' && (
                    <svg className="w-6 h-6 text-green-600 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                    </svg>
                  )}
                  {metric.trend === 'down' && (
                    <svg className="w-6 h-6 text-red-600 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 13l-5 5m0 0l-5-5m5 5V6" />
                    </svg>
                  )}
                  {metric.trend === 'stable' && (
                    <svg className="w-6 h-6 text-gray-600 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                    </svg>
                  )}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{metric.name}</h3>
                <p className="text-sm text-gray-600">{metric.period}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Status */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Estado de Servicios</h2>
          
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="divide-y divide-gray-200">
              {services.map((service, index) => (
                <div key={index} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 mr-4">{service.name}</h3>
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(service.status)}`}>
                          {getStatusIcon(service.status)}
                          <span className="ml-1">{getStatusText(service.status)}</span>
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm">{service.description}</p>
                    </div>
                    
                    <div className="flex items-center space-x-8 text-sm">
                      <div className="text-center">
                        <p className="text-gray-500">Tiempo de Actividad</p>
                        <p className="font-semibold text-gray-900">{service.uptime}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-gray-500">Tiempo de Respuesta</p>
                        <p className="font-semibold text-gray-900">{service.responseTime}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Current Incidents */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Incidentes Actuales</h2>
          
          <div className="space-y-6">
            {incidents.map((incident) => (
              <div key={incident.id} className="bg-gray-50 rounded-lg p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <h3 className="text-xl font-semibold text-gray-900 mr-4">{incident.title}</h3>
                      <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getSeverityColor(incident.severity)}`}>
                        {incident.severity === 'low' && 'Baja'}
                        {incident.severity === 'medium' && 'Media'}
                        {incident.severity === 'high' && 'Alta'}
                        {incident.severity === 'critical' && 'Crítica'}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-3">{incident.description}</p>
                    <div className="flex items-center text-sm text-gray-500">
                      <span>Inicio: {incident.startTime}</span>
                      {incident.endTime && (
                        <span className="ml-4">Fin estimado: {incident.endTime}</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="ml-6">
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                      incident.status === 'investigating' ? 'bg-yellow-100 text-yellow-800' :
                      incident.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                      incident.status === 'resolved' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {incident.status === 'investigating' && 'Investigando'}
                      {incident.status === 'scheduled' && 'Programado'}
                      {incident.status === 'resolved' && 'Resuelto'}
                    </span>
                  </div>
                </div>
                
                {incident.updates && incident.updates.length > 0 && (
                  <div className="border-t border-gray-200 pt-4">
                    <h4 className="font-semibold text-gray-900 mb-3">Actualizaciones:</h4>
                    <div className="space-y-3">
                      {incident.updates.map((update, updateIndex) => (
                        <div key={updateIndex} className="flex items-start">
                          <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3"></div>
                          <div className="flex-1">
                            <p className="text-gray-600">{update.message}</p>
                            <p className="text-sm text-gray-500 mt-1">{update.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Historical Data */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Historial de Tiempo de Actividad</h2>
          
          <div className="bg-white rounded-lg p-8">
            <div className="grid md:grid-cols-3 gap-8 mb-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">99.94%</div>
                <div className="text-gray-600">Últimos 30 días</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">99.89%</div>
                <div className="text-gray-600">Últimos 90 días</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">99.92%</div>
                <div className="text-gray-600">Último año</div>
              </div>
            </div>
            
            <div className="border-t border-gray-200 pt-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Últimos 30 días</h3>
              <div className="flex items-center space-x-1">
                {Array.from({ length: 30 }, (_, i) => {
                  const isDown = Math.random() < 0.02; // 2% probabilidad de estar caído
                  return (
                    <div
                      key={i}
                      className={`w-3 h-8 rounded-sm ${
                        isDown ? 'bg-red-400' : 'bg-green-400'
                      }`}
                      title={`Día ${30 - i}: ${isDown ? 'Problemas detectados' : 'Operacional'}`}
                    ></div>
                  );
                })}
              </div>
              <div className="flex justify-between text-sm text-gray-500 mt-2">
                <span>30 días atrás</span>
                <span>Hoy</span>
              </div>
              
              <div className="flex items-center mt-4 space-x-6">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-400 rounded-sm mr-2"></div>
                  <span className="text-sm text-gray-600">Operacional</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-yellow-400 rounded-sm mr-2"></div>
                  <span className="text-sm text-gray-600">Degradado</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-red-400 rounded-sm mr-2"></div>
                  <span className="text-sm text-gray-600">Fuera de servicio</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-blue-400 rounded-sm mr-2"></div>
                  <span className="text-sm text-gray-600">Mantenimiento</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Subscribe to Updates */}
      <section className="py-16 bg-green-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Mantente Informado</h2>
          <p className="text-xl text-green-100 mb-8">
            Suscríbete para recibir notificaciones sobre el estado del sistema
          </p>
          
          <div className="max-w-md mx-auto">
            <div className="flex">
              <input
                type="email"
                placeholder="tu@email.com"
                className="flex-1 px-4 py-3 rounded-l-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-300"
              />
              <button className="bg-green-700 hover:bg-green-800 px-6 py-3 rounded-r-lg font-semibold transition-colors">
                Suscribirse
              </button>
            </div>
            <p className="text-green-200 text-sm mt-3">
              Recibirás notificaciones solo sobre incidentes importantes
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 mt-12">
            <div className="bg-green-700 rounded-lg p-6">
              <h3 className="text-lg font-bold mb-2">RSS Feed</h3>
              <p className="text-green-100 text-sm mb-3">Sigue nuestro feed RSS para actualizaciones automáticas</p>
              <button className="text-green-200 hover:text-white text-sm underline">
                Suscribirse al RSS
              </button>
            </div>
            
            <div className="bg-green-700 rounded-lg p-6">
              <h3 className="text-lg font-bold mb-2">API de Estado</h3>
              <p className="text-green-100 text-sm mb-3">Integra nuestro estado en tu aplicación</p>
              <button className="text-green-200 hover:text-white text-sm underline">
                Ver Documentación
              </button>
            </div>
            
            <div className="bg-green-700 rounded-lg p-6">
              <h3 className="text-lg font-bold mb-2">Webhook</h3>
              <p className="text-green-100 text-sm mb-3">Recibe notificaciones en tiempo real</p>
              <button className="text-green-200 hover:text-white text-sm underline">
                Configurar Webhook
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
    </>
  );
};

export default SystemStatusPage;