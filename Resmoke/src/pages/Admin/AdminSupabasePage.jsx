import { useState, useEffect } from 'react';
import AdminNavbar from '../../components/Layout/AdminNavbar';
import supabaseAdminService from '../../services/supabaseAdminService';

const AdminSupabasePage = () => {
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
          result = await supabaseAdminService.getOverview();
          break;
        case 'tables':
          result = await supabaseAdminService.getTables();
          break;
        case 'performance':
          result = await supabaseAdminService.getPerformance();
          break;
        case 'auth':
          result = await supabaseAdminService.getAuth();
          break;
        default:
          result = await supabaseAdminService.getOverview();
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
    { id: 'tables', label: 'Tablas', icon: 'table_view' },
    { id: 'performance', label: 'Rendimiento', icon: 'speed' },
    { id: 'auth', label: 'Autenticación', icon: 'security' }
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
                <p className="text-sm font-medium text-gray-600">Total de Tablas</p>
                <p className="text-3xl font-bold text-blue-600">{data.totalTables}</p>
              </div>
              <span className="material-icons text-blue-500 text-3xl">table_chart</span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total de Filas</p>
                <p className="text-3xl font-bold text-green-600">{data.totalRows.toLocaleString()}</p>
              </div>
              <span className="material-icons text-green-500 text-3xl">storage</span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Usuarios Totales</p>
                <p className="text-3xl font-bold text-purple-600">{data.totalUsers.toLocaleString()}</p>
              </div>
              <span className="material-icons text-purple-500 text-3xl">people</span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Uptime</p>
                <p className="text-3xl font-bold text-emerald-600">{data.uptime}</p>
              </div>
              <span className="material-icons text-emerald-500 text-3xl">cloud_done</span>
            </div>
          </div>
        </div>

        {/* Información del sistema */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <span className="material-icons mr-2 text-blue-500">storage</span>
              Almacenamiento
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Usado</span>
                <span className="font-semibold">{data.storageUsed}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Límite</span>
                <span className="font-semibold">{data.storageLimit}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '15%' }}></div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <span className="material-icons mr-2 text-green-500">api</span>
              API Calls (24h)
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Realizadas</span>
                <span className="font-semibold">{data.apiCalls24h?.toLocaleString() || 'N/A'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Límite</span>
                <span className="font-semibold">{data.apiCallsLimit?.toLocaleString() || 'N/A'}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '2%' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Información adicional */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <span className="material-icons mr-2 text-purple-500">info</span>
            Información del Sistema
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">Conexiones Activas</p>
              <p className="text-2xl font-bold text-gray-800">{data.activeConnections || 'N/A'}</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">Límite de Conexiones</p>
              <p className="text-2xl font-bold text-gray-800">{data.connectionLimit || 'N/A'}</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">Último Backup</p>
              <p className="text-sm font-semibold text-gray-800">
                {data.lastBackup ? supabaseAdminService.formatDate(data.lastBackup) : 'N/A'}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderTables = () => {
    if (!data || !Array.isArray(data)) return null;

    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center">
            <span className="material-icons mr-2 text-blue-500">table_view</span>
            Tablas de la Base de Datos
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tabla
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Filas
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tamaño
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Última Modificación
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.map((table, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className="material-icons text-gray-400 mr-2">table_chart</span>
                      <span className="text-sm font-medium text-gray-900">{table.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {table.rows.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {table.size}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {supabaseAdminService.formatDate(table.lastModified)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderPerformance = () => {
    if (!data) return null;

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tiempo de Respuesta</p>
                <p className="text-2xl font-bold text-blue-600">{data.avgResponseTime}</p>
              </div>
              <span className="material-icons text-blue-500 text-3xl">speed</span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Consultas Lentas</p>
                <p className="text-2xl font-bold text-yellow-600">{data.slowQueries}</p>
              </div>
              <span className="material-icons text-yellow-500 text-3xl">warning</span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tasa de Error</p>
                <p className="text-2xl font-bold text-red-600">{data.errorRate}</p>
              </div>
              <span className="material-icons text-red-500 text-3xl">error</span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Cache Hit Rate</p>
                <p className="text-2xl font-bold text-green-600">{data.cacheHitRate}</p>
              </div>
              <span className="material-icons text-green-500 text-3xl">cached</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderAuth = () => {
    if (!data || typeof data !== 'object') return null;

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Usuarios Totales</p>
                <p className="text-3xl font-bold text-blue-600">{(data.totalUsers || 0).toLocaleString()}</p>
              </div>
              <span className="material-icons text-blue-500 text-3xl">people</span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Activos (24h)</p>
                <p className="text-3xl font-bold text-green-600">{(data.activeUsers24h || 0).toLocaleString()}</p>
              </div>
              <span className="material-icons text-green-500 text-3xl">online_prediction</span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Nuevos (7d)</p>
                <p className="text-3xl font-bold text-purple-600">{(data.newUsers7d || 0).toLocaleString()}</p>
              </div>
              <span className="material-icons text-purple-500 text-3xl">person_add</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <span className="material-icons mr-2 text-blue-500">login</span>
            Métodos de Autenticación
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <span className="material-icons text-gray-600 mr-3">email</span>
                <span className="font-medium">Email</span>
              </div>
              <span className="text-xl font-bold text-gray-800">{(data.authMethods?.email || 0).toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <span className="material-icons text-red-500 mr-3">account_circle</span>
                <span className="font-medium">Google</span>
              </div>
              <span className="text-xl font-bold text-gray-800">{(data.authMethods?.google || 0).toLocaleString()}</span>
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
                  <span className="material-icons mr-3 text-green-600">storage</span>
                  Administración de Supabase
                </h1>
                <p className="text-gray-600 mt-2">Gestiona tu base de datos y servicios de backend</p>
              </div>
              
              <a
                href="https://supabase.com/dashboard/project/vzvlyexpgcvdtzaekgeb"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
              >
                <span className="material-icons mr-2">open_in_new</span>
                Dashboard de Supabase
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
                      ? 'border-green-500 text-green-600'
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
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mb-4"></div>
                <div className="text-xl text-gray-600">Cargando datos de Supabase...</div>
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
              {activeTab === 'tables' && renderTables()}
              {activeTab === 'performance' && renderPerformance()}
              {activeTab === 'auth' && renderAuth()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminSupabasePage;