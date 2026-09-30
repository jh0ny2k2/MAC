import React, { useState } from 'react';
import SEO from '../../components/SEO/SEO';

const TutorialsPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const categories = [
    { id: 'all', name: 'Todos', icon: '📚' },
    { id: 'getting-started', name: 'Primeros Pasos', icon: '🚀' },
    { id: 'selling', name: 'Vender Productos', icon: '💰' },
    { id: 'buying', name: 'Comprar', icon: '🛒' },
    { id: 'account', name: 'Cuenta', icon: '👤' },
    { id: 'advanced', name: 'Avanzado', icon: '⚙️' }
  ];

  const tutorials = [
    {
      id: 1,
      title: 'Cómo crear tu primera cuenta',
      description: 'Guía paso a paso para registrarte en Resmoke y configurar tu perfil',
      category: 'getting-started',
      duration: '5 min',
      difficulty: 'Principiante',
      views: '12.5k',
      rating: 4.8,
      thumbnail: '🎯',
      steps: [
        'Visita la página de registro',
        'Completa el formulario con tus datos',
        'Verifica tu email',
        'Configura tu perfil',
        'Añade una foto de perfil'
      ]
    },
    {
      id: 2,
      title: 'Publicar tu primer producto',
      description: 'Aprende a crear una publicación atractiva que genere ventas',
      category: 'selling',
      duration: '8 min',
      difficulty: 'Principiante',
      views: '18.2k',
      rating: 4.9,
      thumbnail: '📸',
      steps: [
        'Accede a "Vender Producto"',
        'Completa la información básica',
        'Sube fotos de calidad',
        'Establece un precio competitivo',
        'Publica y promociona'
      ]
    },
    {
      id: 3,
      title: 'Técnicas de fotografía para productos',
      description: 'Consejos profesionales para tomar fotos que vendan',
      category: 'selling',
      duration: '12 min',
      difficulty: 'Intermedio',
      views: '9.8k',
      rating: 4.7,
      thumbnail: '📷',
      steps: [
        'Configura la iluminación adecuada',
        'Elige el fondo correcto',
        'Toma fotos desde múltiples ángulos',
        'Edita las imágenes básicamente',
        'Optimiza para web'
      ]
    },
    {
      id: 4,
      title: 'Cómo realizar una compra segura',
      description: 'Guía para comprar con confianza en nuestra plataforma',
      category: 'buying',
      duration: '6 min',
      difficulty: 'Principiante',
      views: '15.3k',
      rating: 4.6,
      thumbnail: '🛡️',
      steps: [
        'Busca el producto deseado',
        'Revisa el perfil del vendedor',
        'Lee las reseñas y comentarios',
        'Contacta al vendedor si tienes dudas',
        'Realiza el pago seguro'
      ]
    },
    {
      id: 5,
      title: 'Gestión avanzada de inventario',
      description: 'Herramientas para vendedores con múltiples productos',
      category: 'advanced',
      duration: '15 min',
      difficulty: 'Avanzado',
      views: '4.2k',
      rating: 4.5,
      thumbnail: '📊',
      steps: [
        'Configura categorías de productos',
        'Usa etiquetas y filtros',
        'Automatiza actualizaciones de stock',
        'Genera reportes de ventas',
        'Optimiza precios dinámicamente'
      ]
    },
    {
      id: 6,
      title: 'Configurar notificaciones',
      description: 'Personaliza las alertas para no perderte nada importante',
      category: 'account',
      duration: '4 min',
      difficulty: 'Principiante',
      views: '7.1k',
      rating: 4.4,
      thumbnail: '🔔',
      steps: [
        'Accede a configuración de cuenta',
        'Selecciona tipos de notificaciones',
        'Configura frecuencia de emails',
        'Activa notificaciones push',
        'Guarda los cambios'
      ]
    },
    {
      id: 7,
      title: 'Estrategias de precios competitivos',
      description: 'Cómo fijar precios que atraigan compradores y maximicen ganancias',
      category: 'selling',
      duration: '10 min',
      difficulty: 'Intermedio',
      views: '11.7k',
      rating: 4.8,
      thumbnail: '💲',
      steps: [
        'Investiga precios de la competencia',
        'Calcula tus costos reales',
        'Define tu margen de ganancia',
        'Considera ofertas y descuentos',
        'Monitorea y ajusta regularmente'
      ]
    },
    {
      id: 8,
      title: 'Resolver disputas y reclamos',
      description: 'Guía para manejar problemas con compradores o vendedores',
      category: 'advanced',
      duration: '8 min',
      difficulty: 'Intermedio',
      views: '6.4k',
      rating: 4.3,
      thumbnail: '⚖️',
      steps: [
        'Identifica el tipo de disputa',
        'Reúne evidencia relevante',
        'Contacta a la otra parte',
        'Usa el sistema de mediación',
        'Escala a soporte si es necesario'
      ]
    }
  ];

  const filteredTutorials = tutorials.filter(tutorial => {
    const matchesCategory = selectedCategory === 'all' || tutorial.category === selectedCategory;
    const matchesSearch = tutorial.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tutorial.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Principiante':
        return 'bg-green-100 text-green-800';
      case 'Intermedio':
        return 'bg-yellow-100 text-yellow-800';
      case 'Avanzado':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <svg
        key={i}
        className={`w-4 h-4 ${i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'}`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
  };

  return (
    <>
      <SEO title="Tutoriales" description="Aprende todo sobre Resmoke con nuestros tutoriales: comprar, vender, seguridad y más." url="/tutoriales"/>
      <div className="min-h-screen bg-gray-50">
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6">
              <span className="inline-block px-4 py-1 mb-4 rounded-full bg-blue-50 ring-1 ring-blue-200 text-sm tracking-wide text-blue-700">Aprende</span>
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900">Tutoriales y Guías</h1>
              <p className="mt-4 text-lg text-gray-600 max-w-xl">Aprende a usar Resmoke como un experto con nuestras guías paso a paso.</p>
              <div className="mt-6 max-w-md">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Buscar tutoriales..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-3 pl-12 rounded-xl ring-1 ring-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-300"
                  />
                  <svg className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
              <div className="mt-8 grid grid-cols-3 gap-6 text-center">
                <div className="bg-white/70 backdrop-blur rounded-xl ring-1 ring-gray-200 p-4 shadow-sm">
                  <p className="text-2xl font-bold text-gray-900">Guías</p>
                  <p className="text-xs text-gray-500">paso a paso</p>
                </div>
                <div className="bg-white/70 backdrop-blur rounded-xl ring-1 ring-gray-200 p-4 shadow-sm">
                  <p className="text-2xl font-bold text-gray-900">Videos</p>
                  <p className="text-xs text-gray-500">explicativos</p>
                </div>
                <div className="bg-white/70 backdrop-blur rounded-xl ring-1 ring-gray-200 p-4 shadow-sm">
                  <p className="text-2xl font-bold text-gray-900">Filtros</p>
                  <p className="text-xs text-gray-500">por categoría</p>
                </div>
              </div>
            </div>
            <div className="lg:col-span-6 relative">
              <div className="aspect-[4/3] rounded-2xl backdrop-blur overflow-hidden">
                <img src="https://cdn-icons-png.flaticon.com/512/3867/3867771.png" alt="Tutoriales y guías" className="w-full h-full object-contain" />
              </div>
              <div className="absolute -bottom-6 -left-6 hidden lg:block w-32 h-32 bg-white/70 rounded-full blur-xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-8 bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center px-6 py-3 rounded-lg font-medium transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <span className="mr-2 text-lg">{category.icon}</span>
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Tutorials Grid */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">
              {selectedCategory === 'all' ? 'Todos los Tutoriales' : 
               categories.find(c => c.id === selectedCategory)?.name}
            </h2>
            <p className="text-gray-600">
              {filteredTutorials.length} tutorial{filteredTutorials.length !== 1 ? 'es' : ''} encontrado{filteredTutorials.length !== 1 ? 's' : ''}
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTutorials.map((tutorial) => (
              <div key={tutorial.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-4xl">{tutorial.thumbnail}</div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(tutorial.difficulty)}`}>
                      {tutorial.difficulty}
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{tutorial.title}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">{tutorial.description}</p>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <span className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {tutorial.duration}
                    </span>
                    <span className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      {tutorial.views}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center">
                      {renderStars(tutorial.rating)}
                      <span className="ml-2 text-sm text-gray-600">{tutorial.rating}</span>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Pasos del tutorial:</h4>
                    <ol className="space-y-2">
                      {tutorial.steps.slice(0, 3).map((step, index) => (
                        <li key={index} className="flex items-start text-sm text-gray-600">
                          <span className="flex-shrink-0 w-5 h-5 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-semibold mr-3 mt-0.5">
                            {index + 1}
                          </span>
                          {step}
                        </li>
                      ))}
                      {tutorial.steps.length > 3 && (
                        <li className="text-sm text-gray-500 ml-8">
                          +{tutorial.steps.length - 3} pasos más...
                        </li>
                      )}
                    </ol>
                  </div>
                  
                  <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                    Ver Tutorial Completo
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          {filteredTutorials.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No se encontraron tutoriales</h3>
              <p className="text-gray-600 mb-6">Intenta con otros términos de búsqueda o selecciona una categoría diferente</p>
              <button 
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                }}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Ver Todos los Tutoriales
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Popular Topics */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Temas Populares</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 text-center">
              <div className="text-3xl mb-3">🚀</div>
              <h3 className="font-semibold text-gray-900 mb-2">Primeros Pasos</h3>
              <p className="text-sm text-gray-600 mb-4">Todo lo que necesitas para empezar</p>
              <span className="text-blue-600 text-sm font-medium">12 tutoriales</span>
            </div>
            
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 text-center">
              <div className="text-3xl mb-3">💰</div>
              <h3 className="font-semibold text-gray-900 mb-2">Maximizar Ventas</h3>
              <p className="text-sm text-gray-600 mb-4">Estrategias para vender más</p>
              <span className="text-green-600 text-sm font-medium">8 tutoriales</span>
            </div>
            
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6 text-center">
              <div className="text-3xl mb-3">📸</div>
              <h3 className="font-semibold text-gray-900 mb-2">Fotografía</h3>
              <p className="text-sm text-gray-600 mb-4">Fotos que venden productos</p>
              <span className="text-purple-600 text-sm font-medium">6 tutoriales</span>
            </div>
            
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-6 text-center">
              <div className="text-3xl mb-3">🛡️</div>
              <h3 className="font-semibold text-gray-900 mb-2">Seguridad</h3>
              <p className="text-sm text-gray-600 mb-4">Compra y vende con confianza</p>
              <span className="text-orange-600 text-sm font-medium">5 tutoriales</span>
            </div>
          </div>
        </div>
      </section>

      {/* Video Tutorials */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Tutoriales en Video</h2>
            <p className="text-xl text-gray-600">Aprende viendo nuestros videos paso a paso</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg overflow-hidden shadow-sm">
              <div className="aspect-video bg-gray-200 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="text-gray-600">Tutorial: Crear tu primera publicación</p>
                  <p className="text-sm text-gray-500">Duración: 8:32</p>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Cómo publicar tu primer producto</h3>
                <p className="text-gray-600 text-sm mb-4">Guía completa en video para crear una publicación exitosa desde cero</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">25.3k visualizaciones</span>
                  <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                    Ver Video →
                  </button>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg overflow-hidden shadow-sm">
              <div className="aspect-video bg-gray-200 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="text-gray-600">Tutorial: Fotografía de productos</p>
                  <p className="text-sm text-gray-500">Duración: 12:15</p>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Técnicas de fotografía profesional</h3>
                <p className="text-gray-600 text-sm mb-4">Aprende a tomar fotos que destaquen y vendan tus productos</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">18.7k visualizaciones</span>
                  <button className="text-green-600 hover:text-green-700 font-medium text-sm">
                    Ver Video →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Help Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">¿No encuentras lo que buscas?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Nuestro equipo de soporte está aquí para ayudarte
          </p>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-blue-700 rounded-lg p-6">
              <div className="text-3xl mb-3">💬</div>
              <h3 className="text-lg font-bold mb-2">Chat en Vivo</h3>
              <p className="text-blue-100 text-sm mb-4">Habla con nuestro equipo en tiempo real</p>
              <button className="bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                Iniciar Chat
              </button>
            </div>
            
            <div className="bg-blue-700 rounded-lg p-6">
              <div className="text-3xl mb-3">📧</div>
              <h3 className="text-lg font-bold mb-2">Email</h3>
              <p className="text-blue-100 text-sm mb-4">Envíanos tu consulta detallada</p>
              <button className="bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                Enviar Email
              </button>
            </div>
            
            <div className="bg-blue-700 rounded-lg p-6">
              <div className="text-3xl mb-3">📚</div>
              <h3 className="text-lg font-bold mb-2">Centro de Ayuda</h3>
              <p className="text-blue-100 text-sm mb-4">Explora todas nuestras guías</p>
              <button className="bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                Ver Ayuda
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
    </>
  );
};

export default TutorialsPage;