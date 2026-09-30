import { useState, useEffect } from 'react';
import AdminNavbar from '../../components/Layout/AdminNavbar';
import netlifyAdminService from '../../services/netlifyAdminService';

const AdminNetlifyPage = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadData(activeTab);
  }, [activeTab]);

  const loadData = async (tab) => {
    setLoading(true);
    setError(null);
    
    try {
      let result;
      switch (tab) {
        case 'overview':
          result = await netlifyAdminService.getOverview();
          break;
        case 'deployments':
          result = await netlifyAdminService.getDeployments();
          break;
        case 'functions':
          result = await netlifyAdminService.getFunctions();
          break;
        case 'analytics':
          result = await netlifyAdminService.getAnalytics();
          break;
        default:
          result = await netlifyAdminService.getOverview();
      }
      setData(result);
    } catch (err) {
      setError(err.message);
      console.error(`Error cargando ${tab}:`, err);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'overview', label: 'Resumen', icon: 'dashboard' },
    { id: 'deployments', label: 'Deployments', icon: 'rocket_launch' },
    { id: 'functions', label: 'Funciones', icon: 'functions' },
    { id: 'analytics', label: 'Analytics', icon: 'analytics' }
  ];

  const renderOverview = () => {
    if (!data) return null;

    return (
      <div className="space-y-6">
        {/* Métricas principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Deployments</p>
                <p className="text-3xl font-bold text-blue-600">{data.totalDeployments}</p>
              </div>
              <span className="material-icons text-blue-500 text-3xl">rocket_launch</span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Exitosos (30d)</p>
                <p className="text-3xl font-bold text-green-600">{data.successfulDeployments}</p>
              </div>
              <span className="material-icons text-green-500 text-3xl">check_circle</span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Funciones Activas</p>
                <p className="text-3xl font-bold text-purple-600">{data.activeFunctions}</p>
              </div>
              <span className="material-icons text-purple-500 text-3xl">functions</span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Visitas (30d)</p>
                <p className="text-3xl font-bold text-orange-600">{data.monthlyVisits.toLocaleString()}</p>
              </div>
              <span className="material-icons text-orange-500 text-3xl">visibility</span>
            </div>
          </div>
        </div>

        {/* Estado del sitio */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <span className="material-icons mr-2 text-green-500">cloud_done</span>
              Estado del Sitio
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Estado</span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  data.siteStatus === 'online' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {data.siteStatus === 'online' ? 'En línea' : 'Fuera de línea'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Último Deploy</span>
                <span className="font-semibold">{netlifyAdminService.formatDate(data.lastDeploy)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Tiempo de Build</span>
                <span className="font-semibold">{data.lastBuildTime}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Uptime (30d)</span>
                <span className="font-semibold text-green-600">{data.uptime}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <span className="material-icons mr-2 text-blue-500">speed</span>
              Rendimiento
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Tiempo de Carga</span>
                <span className="font-semibold">{data.avgLoadTime}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">CDN Hit Rate</span>
                <span className="font-semibold text-green-600">{data.cdnHitRate}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Bandwidth (30d)</span>
                <span className="font-semibold">{data.bandwidth}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Información adicional */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <span className="material-icons mr-2 text-purple-500">settings</span>
            Configuración
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">Dominio Principal</p>
              <p className="text-lg font-bold text-gray-800">{data.primaryDomain}</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">SSL</p>
              <p className="text-lg font-bold text-green-600">Activo</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">Branch de Deploy</p>
              <p className="text-lg font-bold text-gray-800">{data.deployBranch}</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderDeployments = () => {
    if (!data || !Array.isArray(data)) return null;

    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center">
            <span className="material-icons mr-2 text-blue-500">rocket_launch</span>
            Historial de Deployments
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Commit
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Branch
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Duración
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.map((deployment, index) => (
                <tr key={deployment.id || index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      deployment.state === 'ready' 
                        ? 'bg-green-100 text-green-800' 
                        : deployment.state === 'error'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      <span className="material-icons text-xs mr-1">
                        {deployment.state === 'ready' ? 'check_circle' : 
                         deployment.state === 'error' ? 'error' : 'schedule'}
                      </span>
                      {deployment.state === 'ready' ? 'Exitoso' : 
                       deployment.state === 'error' ? 'Fallido' : 'En progreso'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{deployment.commitSha || 'N/A'}</div>
                    <div className="text-sm text-gray-500">{deployment.commitMessage || 'Sin mensaje'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {deployment.branch || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {deployment.deployTime || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {netlifyAdminService.formatDate(deployment.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderFunctions = () => {
    if (!data || !Array.isArray(data)) return null;

    // Calcular estadísticas agregadas
    const totalFunctions = data.length;
    const totalInvocations = data.reduce((sum, func) => sum + (func.invocations30d || 0), 0);
    const totalErrors = data.reduce((sum, func) => sum + (func.errors30d || 0), 0);

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Funciones Activas</p>
                <p className="text-3xl font-bold text-blue-600">{totalFunctions}</p>
              </div>
              <span className="material-icons text-blue-500 text-3xl">functions</span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Invocaciones (30d)</p>
                <p className="text-3xl font-bold text-green-600">{totalInvocations.toLocaleString()}</p>
              </div>
              <span className="material-icons text-green-500 text-3xl">play_arrow</span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Errores (30d)</p>
                <p className="text-3xl font-bold text-red-600">{totalErrors}</p>
              </div>
              <span className="material-icons text-red-500 text-3xl">error</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center">
              <span className="material-icons mr-2 text-purple-500">code</span>
              Lista de Funciones
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Función
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Invocaciones (30d)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tiempo Promedio
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Errores (30d)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Runtime (30d)
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.map((func, index) => (
                  <tr key={func.name || index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="material-icons text-purple-400 mr-2">code</span>
                        <span className="text-sm font-medium text-gray-900">{func.name || 'N/A'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {(func.invocations30d || 0).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {func.avgDuration || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        (func.errors30d || 0) === 0 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {func.errors30d || 0}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {func.runtime30d || 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const renderAnalytics = () => {
    if (!data || typeof data !== 'object') return null;

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Páginas Vistas (30d)</p>
                <p className="text-3xl font-bold text-blue-600">{(data.pageViews30d || 0).toLocaleString()}</p>
              </div>
              <span className="material-icons text-blue-500 text-3xl">visibility</span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Visitantes Únicos (30d)</p>
                <p className="text-3xl font-bold text-green-600">{(data.uniqueVisitors30d || 0).toLocaleString()}</p>
              </div>
              <span className="material-icons text-green-500 text-3xl">people</span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Páginas Principales</p>
                <p className="text-3xl font-bold text-purple-600">{(data.topPages?.length || 0)}</p>
              </div>
              <span className="material-icons text-purple-500 text-3xl">article</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <span className="material-icons mr-2 text-blue-500">public</span>
              Países Top
            </h3>
            <div className="space-y-3">
              {(data.countries || []).map((country, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-gray-700">{country.country || 'N/A'}</span>
                  <span className="font-semibold">{(country.visitors || 0).toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <span className="material-icons mr-2 text-green-500">article</span>
              Páginas Populares
            </h3>
            <div className="space-y-3">
              {(data.topPages || []).map((page, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-gray-700 truncate">{page.path || 'N/A'}</span>
                  <span className="font-semibold">{(page.views || 0).toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar />
      
      <div className="flex-grow lg:ml-64">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-200 p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                  <span className="material-icons mr-3 text-teal-600">cloud</span>
                  Administración de Netlify
                </h1>
                <p className="text-gray-600 mt-2">Gestiona tus deployments y servicios de hosting</p>
              </div>
              
              <a
                href="https://app.netlify.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors duration-200"
              >
                <span className="material-icons mr-2">open_in_new</span>
                Dashboard de Netlify
              </a>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="max-w-7xl mx-auto p-6">
          <div className="border-b border-gray-200 mb-6">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center ${
                    activeTab === tab.id
                      ? 'border-teal-500 text-teal-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span className="material-icons mr-2 text-sm">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500 mb-4"></div>
                <div className="text-xl text-gray-600">Cargando datos de Netlify...</div>
              </div>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <div className="flex items-center">
                <span className="material-icons text-red-500 mr-3">error</span>
                <div>
                  <h3 className="text-lg font-medium text-red-800">Error al cargar datos</h3>
                  <p className="text-red-600 mt-1">{error}</p>
                </div>
              </div>
            </div>
          ) : (
            <div>
              {activeTab === 'overview' && renderOverview()}
              {activeTab === 'deployments' && renderDeployments()}
              {activeTab === 'functions' && renderFunctions()}
              {activeTab === 'analytics' && renderAnalytics()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminNetlifyPage;