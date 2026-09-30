import { useState, useEffect } from 'react';
import AdminNavbar from '../../components/Layout/AdminNavbar';
import { supabase } from '../../lib/supabase';

const AdminReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, pending, in_progress, resolved, dismissed
  const [urgencyFilter, setUrgencyFilter] = useState('all'); // all, low, medium, high, critical
  const [selectedReport, setSelectedReport] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    in_progress: 0,
    resolved: 0,
    dismissed: 0
  });

  useEffect(() => {
    fetchReports();
    fetchStats();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('suspicious_activity_reports')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching reports:', error);
        return;
      }

      setReports(data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const { data, error } = await supabase
        .from('suspicious_activity_reports')
        .select('status');

      if (error) {
        console.error('Error fetching stats:', error);
        return;
      }

      const statusCounts = data.reduce((acc, report) => {
        acc[report.status] = (acc[report.status] || 0) + 1;
        return acc;
      }, {});

      setStats({
        total: data.length,
        pending: statusCounts.pending || 0,
        in_progress: statusCounts.in_progress || 0,
        resolved: statusCounts.resolved || 0,
        dismissed: statusCounts.dismissed || 0
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const updateReportStatus = async (reportId, newStatus) => {
    try {
      const { error } = await supabase
        .from('suspicious_activity_reports')
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', reportId);

      if (error) {
        console.error('Error updating report:', error);
        alert('Error al actualizar el reporte');
        return;
      }

      // Actualizar el estado local
      setReports(reports.map(report => 
        report.id === reportId 
          ? { ...report, status: newStatus, updated_at: new Date().toISOString() }
          : report
      ));
      
      fetchStats(); // Actualizar estadísticas
      alert('Estado del reporte actualizado exitosamente');
    } catch (error) {
      console.error('Error:', error);
      alert('Error inesperado');
    }
  };

  const filteredReports = reports.filter(report => {
    const statusMatch = filter === 'all' || report.status === filter;
    const urgencyMatch = urgencyFilter === 'all' || report.urgency === urgencyFilter;
    return statusMatch && urgencyMatch;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'dismissed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const openReportModal = (report) => {
    setSelectedReport(report);
    setShowModal(true);
  };

  const closeModal = () => {
    setSelectedReport(null);
    setShowModal(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AdminNavbar />
        <div className="flex-grow lg:ml-64">
          <div className="flex items-center justify-center h-64">
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
              <div className="text-xl text-gray-600">Cargando reportes...</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar />
      
      {/* Main Content */}
      <div className="flex-grow lg:ml-64">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-200 p-6">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900">Gestión de Reportes</h1>
            <p className="text-gray-600 mt-2">Administra los reportes de actividad sospechosa</p>
          </div>
        </div>

        {/* Estadísticas */}
        <div className="max-w-7xl mx-auto p-4 sm:p-6">

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                </div>
                <span className="material-icons text-gray-500 text-2xl">report</span>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pendientes</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
                </div>
                <span className="material-icons text-gray-500 text-2xl">pending</span>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">En Progreso</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.in_progress}</p>
                </div>
                <span className="material-icons text-gray-500 text-2xl">hourglass_empty</span>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Resueltos</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.resolved}</p>
                </div>
                <span className="material-icons text-gray-500 text-2xl">check_circle</span>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Descartados</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.dismissed}</p>
                </div>
                <span className="material-icons text-gray-500 text-2xl">cancel</span>
              </div>
            </div>
          </div>

          {/* Filtros */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">Estado</label>
                <select 
                  value={filter} 
                  onChange={(e) => setFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">Todos los estados</option>
                  <option value="pending">Pendientes</option>
                  <option value="in_progress">En Progreso</option>
                  <option value="resolved">Resueltos</option>
                  <option value="dismissed">Descartados</option>
                </select>
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">Urgencia</label>
                <select 
                  value={urgencyFilter} 
                  onChange={(e) => setUrgencyFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">Todas las urgencias</option>
                  <option value="low">Baja</option>
                  <option value="medium">Media</option>
                  <option value="high">Alta</option>
                  <option value="critical">Crítica</option>
                </select>
              </div>
            </div>
          </div>

          {/* Lista de Reportes */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                Reportes ({filteredReports.length})
              </h2>
            </div>
            
            {filteredReports.length === 0 ? (
              <div className="p-8 text-center">
                <span className="material-icons text-gray-400 text-4xl mb-4">inbox</span>
                <p className="text-gray-500">No hay reportes que coincidan con los filtros seleccionados</p>
              </div>
            ) : (
              <div className="max-h-[480px] overflow-y-auto">
                <table className="w-full table-fixed divide-y divide-gray-200" role="table">
                  <thead className="bg-gray-50 sticky top-0 z-10">
                    <tr>
                      <th className="w-[24%] px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Tipo de Reporte
                      </th>
                      <th className="w-[24%] px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Usuario
                      </th>
                      <th className="w-[14%] px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider hidden md:table-cell">
                        Urgencia
                      </th>
                      <th className="w-[14%] px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Estado
                      </th>
                      <th className="w-[14%] px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider hidden lg:table-cell">
                        Fecha
                      </th>
                      <th className="w-[10%] px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredReports.map((report) => (
                      <tr key={report.id} className="hover:bg-gray-50">
                        <td className="px-6 py-3">
                          <div className="text-sm font-medium text-gray-900">
                            {report.report_type}
                          </div>
                        </td>
                        <td className="px-6 py-3">
                          <div className="text-sm text-gray-900">{report.user_name}</div>
                          <div className="text-sm text-gray-500">{report.user_email}</div>
                        </td>
                        <td className="px-6 py-3 hidden md:table-cell">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800`}>
                            {report.urgency}
                          </span>
                        </td>
                        <td className="px-6 py-3">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800`}>
                            {report.status}
                          </span>
                        </td>
                        <td className="px-6 py-3 text-sm text-gray-500 hidden lg:table-cell">
                          {formatDate(report.created_at)}
                        </td>
                        <td className="px-6 py-3 text-sm font-medium">
                          <button
                            onClick={() => openReportModal(report)}
                            className="text-gray-700 hover:text-gray-900 mr-3"
                          >
                            Ver Detalles
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal de Detalles */}
      {showModal && selectedReport && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[95vh] overflow-hidden shadow-2xl">
            <div className="bg-white px-6 py-4 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <span className="material-icons text-gray-600 text-2xl">report_problem</span>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Detalles del Reporte</h2>
                    <p className="text-gray-500 text-sm">ID: #{selectedReport.id}</p>
                  </div>
                </div>
                <button
                  onClick={closeModal}
                  className="text-gray-600 hover:text-gray-800 transition-colors p-1 rounded-full hover:bg-gray-100"
                >
                  <span className="material-icons text-2xl">close</span>
                </button>
              </div>
            </div>

            {/* Contenido del Modal */}
            <div className="overflow-y-auto max-h-[calc(95vh-120px)]">
              <div className="p-6">
                {/* Información Principal */}
                <div className="bg-gray-50 rounded-xl p-4 mb-6">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="material-icons text-blue-500">category</span>
                        <span className="text-sm font-medium text-gray-600">Tipo de Reporte</span>
                      </div>
                      <p className="text-lg font-semibold text-gray-900">{selectedReport.report_type}</p>
                    </div>
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="material-icons text-orange-500">priority_high</span>
                        <span className="text-sm font-medium text-gray-600">Nivel de Urgencia</span>
                      </div>
                      <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getUrgencyColor(selectedReport.urgency)}`}>
                        {selectedReport.urgency.toUpperCase()}
                      </span>
                    </div>
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="material-icons text-green-500">info</span>
                        <span className="text-sm font-medium text-gray-600">Estado Actual</span>
                      </div>
                      <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(selectedReport.status)}`}>
                        {selectedReport.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Información del Usuario */}
                <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <span className="material-icons text-gray-600 mr-2">person</span>
                    Información del Usuario
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Nombre Completo</label>
                      <p className="text-gray-900 font-medium">{selectedReport.user_name}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Correo Electrónico</label>
                      <p className="text-gray-900">{selectedReport.user_email}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Método de Contacto Preferido</label>
                      <p className="text-gray-900">{selectedReport.contact_method}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Fecha del Reporte</label>
                      <p className="text-gray-900">{formatDate(selectedReport.created_at)}</p>
                    </div>
                  </div>
                </div>

                {/* Descripción del Problema */}
                <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <span className="material-icons text-gray-600 mr-2">description</span>
                    Descripción del Problema
                  </h3>
                    <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-gray-300">
                    <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                      {selectedReport.description}
                    </p>
                  </div>
                </div>

                {/* Evidencia */}
                {selectedReport.evidence_filename && (
                  <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <span className="material-icons text-gray-600 mr-2">attach_file</span>
                      Evidencia Adjunta
                    </h3>
                    <div className="bg-gray-50 rounded-lg p-4 flex items-center space-x-3">
                      <span className="material-icons text-gray-600">file_present</span>
                      <div>
                        <p className="font-medium text-gray-900">{selectedReport.evidence_filename}</p>
                        <p className="text-sm text-gray-500">Archivo adjunto por el usuario</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Acciones de Estado */}
                <div className="bg-white border border-gray-200 rounded-xl p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <span className="material-icons text-gray-600 mr-2">settings</span>
                    Gestionar Estado del Reporte
                  </h3>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                    <button
                      onClick={() => {
                        updateReportStatus(selectedReport.id, 'pending');
                        closeModal();
                      }}
                      className="flex items-center justify-center space-x-2 px-4 py-3 border border-gray-300 bg-white text-gray-900 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium"
                    >
                      <span className="material-icons text-sm">pending</span>
                      <span>Pendiente</span>
                    </button>
                    <button
                      onClick={() => {
                        updateReportStatus(selectedReport.id, 'in_progress');
                        closeModal();
                      }}
                      className="flex items-center justify-center space-x-2 px-4 py-3 border border-gray-300 bg-white text-gray-900 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium"
                    >
                      <span className="material-icons text-sm">hourglass_empty</span>
                      <span>En Progreso</span>
                    </button>
                    <button
                      onClick={() => {
                        updateReportStatus(selectedReport.id, 'resolved');
                        closeModal();
                      }}
                      className="flex items-center justify-center space-x-2 px-4 py-3 border border-gray-300 bg-white text-gray-900 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium"
                    >
                      <span className="material-icons text-sm">check_circle</span>
                      <span>Resuelto</span>
                    </button>
                    <button
                      onClick={() => {
                        updateReportStatus(selectedReport.id, 'dismissed');
                        closeModal();
                      }}
                      className="flex items-center justify-center space-x-2 px-4 py-3 bg-gray-50 border-2 border-gray-200 text-gray-800 rounded-lg hover:bg-gray-100 hover:border-gray-300 transition-all duration-200 font-medium"
                    >
                      <span className="material-icons text-sm">cancel</span>
                      <span>Descartar</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer del Modal */}
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
              <div className="flex justify-end">
                <button
                  onClick={closeModal}
                  className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200 font-medium flex items-center space-x-2"
                >
                  <span className="material-icons text-sm">close</span>
                  <span>Cerrar</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminReports;