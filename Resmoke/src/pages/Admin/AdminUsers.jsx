import { useState, useEffect } from 'react';

import { Link } from 'react-router-dom';
import AdminLayout from '../../components/Layout/AdminLayout';
import { supabase } from '../../lib/supabase';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all'); // all, admin, user
  const [sortConfig, setSortConfig] = useState({ key: 'creado_en', direction: 'desc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(25);
  const [lastUpdated, setLastUpdated] = useState(null);
  
  // Estados para el modal de eliminación
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, [filter]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filter, searchTerm]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      let query = supabase.from('Users').select('*');
      
      if (filter === 'admin') {
        query = query.eq('rol', 'admin');
      } else if (filter === 'user') {
        query = query.eq('rol', 'usuario');
      }

      const { data, error } = await query;
      if (error) throw error;
      
      setUsers(data || []);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // Implementar búsqueda
    setCurrentPage(1);
  };

  const requestSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  // Función para abrir el modal de confirmación
  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  // Función para cerrar el modal
  const handleCloseModal = () => {
    setShowDeleteModal(false);
    setUserToDelete(null);
  };

  // Función para eliminar usuario
  const handleDeleteUser = async () => {
    if (!userToDelete) return;
    
    setDeleting(true);
    try {
      const { error } = await supabase
        .from('Users')
        .delete()
        .eq('id', userToDelete.id);
      
      if (error) throw error;
      
      // Actualizar la lista de usuarios
      setUsers(users.filter(user => user.id !== userToDelete.id));
      
      // Cerrar modal
      handleCloseModal();
      
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      alert('Error al eliminar usuario: ' + error.message);
    } finally {
      setDeleting(false);
    }
  };

  const filteredUsers = users.filter(user => 
    user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    const getVal = (u) => {
      switch (sortConfig.key) {
        case 'name':
          return (u.full_name || u.nombre || u.email || '').toLowerCase();
        case 'email':
          return (u.email || '').toLowerCase();
        case 'rol':
          return (u.rol || '').toLowerCase();
        case 'creado_en':
          return new Date(u.creado_en).getTime();
        default:
          return 0;
      }
    };
    const va = getVal(a);
    const vb = getVal(b);
    if (va < vb) return sortConfig.direction === 'asc' ? -1 : 1;
    if (va > vb) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  const totalPages = Math.max(1, Math.ceil(sortedUsers.length / perPage));
  const startIndex = (currentPage - 1) * perPage;
  const endIndex = startIndex + perPage;
  const pagedUsers = sortedUsers.slice(startIndex, endIndex);

  return (
    <AdminLayout
      title="Gestión de Usuarios"
      subtitle="Administra y supervisa todos los usuarios de la plataforma"
      headerActions={(
        <div className="flex items-center gap-2 md:gap-3 flex-wrap w-full">
          <form onSubmit={handleSearch} className="relative flex-1 min-w-[220px] md:max-w-sm">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar usuarios..."
              aria-label="Buscar usuarios"
              className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm"
            />
            <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
              <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </form>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            aria-label="Filtrar por rol"
            className="px-2.5 py-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Todos</option>
            <option value="admin">Administradores</option>
            <option value="user">Usuarios</option>
          </select>
          <button onClick={fetchUsers} disabled={loading} className="inline-flex items-center px-3 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v6h6M20 20v-6h-6M5 19a9 9 0 0114-7" />
            </svg>
            {loading ? 'Actualizando...' : 'Actualizar'}
          </button>
          <Link 
            to="/admin/usuarios/agregar" 
            className="ml-auto inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <span className="material-icons text-base mr-2">person_add</span>
            Nuevo
          </Link>
        </div>
      )}
    >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-gray-100 text-gray-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Usuarios</p>
                <p className="text-3xl font-bold text-gray-900">{users.length.toLocaleString()}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-gray-100 text-gray-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Administradores</p>
                <p className="text-3xl font-bold text-gray-900">{users.filter(u => u.rol === 'admin').length.toLocaleString()}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-gray-100 text-gray-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Usuarios Regulares</p>
                <p className="text-3xl font-bold text-gray-900">{users.filter(u => u.rol !== 'admin').length.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>

        

        {/* Users Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-3 flex items-center justify-between bg-gray-50 border-b border-gray-200">
            <div className="text-sm text-gray-600">
              Mostrando {sortedUsers.length === 0 ? 0 : startIndex + 1}–{Math.min(endIndex, sortedUsers.length)} de {sortedUsers.length}
            </div>
            <div className="flex items-center gap-3">
              <label className="text-sm text-gray-600">Items por página</label>
              <select value={perPage} onChange={(e) => setPerPage(Number(e.target.value))} className="px-2 py-1 border border-gray-300 rounded-lg bg-white text-sm">
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
              <div className="text-xs text-gray-500">
                {lastUpdated ? `Actualizado: ${new Date(lastUpdated).toLocaleString('es-ES')}` : ''}
              </div>
            </div>
          </div>
          <div className="max-h-[480px] overflow-y-auto hidden md:block">
            <table className="min-w-full divide-y divide-gray-200" role="table">
              <thead className="bg-gray-50 sticky top-0 z-10">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                    aria-sort={sortConfig.key === 'name' ? (sortConfig.direction === 'asc' ? 'ascending' : 'descending') : 'none'}
                  >
                    <button type="button" onClick={() => requestSort('name')} className="inline-flex items-center group">
                      Usuario
                      <svg className={`ml-1 h-4 w-4 text-gray-400 group-hover:text-gray-600 transition-transform ${sortConfig.key === 'name' ? '' : 'opacity-0'} ${sortConfig.direction === 'asc' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                    aria-sort={sortConfig.key === 'email' ? (sortConfig.direction === 'asc' ? 'ascending' : 'descending') : 'none'}
                  >
                    <button type="button" onClick={() => requestSort('email')} className="inline-flex items-center group">
                      Email
                      <svg className={`ml-1 h-4 w-4 text-gray-400 group-hover:text-gray-600 transition-transform ${sortConfig.key === 'email' ? '' : 'opacity-0'} ${sortConfig.direction === 'asc' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                    aria-sort={sortConfig.key === 'rol' ? (sortConfig.direction === 'asc' ? 'ascending' : 'descending') : 'none'}
                  >
                    <button type="button" onClick={() => requestSort('rol')} className="inline-flex items-center group">
                      Rol
                      <svg className={`ml-1 h-4 w-4 text-gray-400 group-hover:text-gray-600 transition-transform ${sortConfig.key === 'rol' ? '' : 'opacity-0'} ${sortConfig.direction === 'asc' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                    aria-sort={sortConfig.key === 'creado_en' ? (sortConfig.direction === 'asc' ? 'ascending' : 'descending') : 'none'}
                  >
                    <button type="button" onClick={() => requestSort('creado_en')} className="inline-flex items-center group">
                      Fecha de Registro
                      <svg className={`ml-1 h-4 w-4 text-gray-400 group-hover:text-gray-600 transition-transform ${sortConfig.key === 'creado_en' ? '' : 'opacity-0'} ${sortConfig.direction === 'asc' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
                        <p className="text-gray-500">Cargando usuarios...</p>
                      </div>
                    </td>
                  </tr>
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center">
                        <svg className="w-12 h-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                        </svg>
                        <p className="text-gray-500 text-lg font-medium mb-1">
                          {users.length === 0 ? 'No hay usuarios registrados' : 'No se encontraron usuarios'}
                        </p>
                        <p className="text-gray-400 text-sm">
                          {users.length === 0 ? 'Los usuarios aparecerán aquí cuando se registren' : 'Intenta con otros términos de búsqueda'}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  pagedUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50 transition-colors duration-150">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-12 w-12">
                            <div className={`h-12 w-12 rounded-full flex items-center justify-center text-gray-700 font-bold text-sm bg-gray-200`}>
                              {user.full_name ? user.full_name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {user.nombre || 'Sin nombre'}
                            </div>
                            <div className="text-sm text-gray-500">
                              ID: {user.id}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-3 whitespace-nowrap">
                        <a href={`mailto:${user.email}`} className="text-sm text-blue-600 hover:underline">{user.email}</a>
                      </td>
                      <td className="px-6 py-3 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800`}>
                          {user.rol === 'admin' ? 'Administrador' : 'Usuario'}
                        </span>
                      </td>
                      <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">
                        {new Date(user.creado_en).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </td>
                      <td className="px-6 py-3 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-1">
                          
                          <Link to={`/admin/usuarios/editar/${user.id}`} aria-label="Editar usuario">
                            <button className="text-gray-600 hover:text-gray-900 transition-colors duration-150 p-1 rounded-md hover:bg-gray-100" aria-label="Editar usuario">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                          </Link>
                          <button 
                            onClick={() => handleDeleteClick(user)}
                            aria-label="Eliminar usuario"
                            className="text-red-600 hover:text-red-900 transition-colors duration-150 p-1 rounded-md hover:bg-red-50"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="md:hidden">
            <ul className="divide-y divide-gray-200">
              {loading ? (
                <li className="px-6 py-6">
                  <div className="flex flex-col items-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
                    <p className="text-gray-500">Cargando usuarios...</p>
                  </div>
                </li>
              ) : filteredUsers.length === 0 ? (
                <li className="px-6 py-6">
                  <div className="text-center">
                    <p className="text-gray-500 text-lg font-medium mb-1">
                      {users.length === 0 ? 'No hay usuarios registrados' : 'No se encontraron usuarios'}
                    </p>
                    <p className="text-gray-400 text-sm">
                      {users.length === 0 ? 'Los usuarios aparecerán aquí cuando se registren' : 'Intenta con otros términos de búsqueda'}
                    </p>
                  </div>
                </li>
              ) : (
                pagedUsers.map((user) => (
                  <li key={user.id} className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 font-bold text-sm flex-shrink-0">
                        {user.full_name ? user.full_name.charAt(0).toUpperCase() : (user.email || 'U').charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">
                          {user.nombre || 'Sin nombre'}
                        </p>
                        <a href={`mailto:${user.email}`} className="text-xs text-blue-600 hover:underline truncate">
                          {user.email}
                        </a>
                        <p className="text-xs text-gray-500">ID: {user.id}</p>
                      </div>
                      <div className="ml-auto flex items-center gap-2">
                        <Link to={`/admin/usuarios/editar/${user.id}`} aria-label="Editar usuario">
                          <button className="text-gray-600 hover:text-gray-900 transition-colors p-1 rounded-md hover:bg-gray-100">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                        </Link>
                        <button 
                          onClick={() => handleDeleteClick(user)}
                          aria-label="Eliminar usuario"
                          className="text-red-600 hover:text-red-900 transition-colors p-1 rounded-md hover:bg-red-50"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {user.rol === 'admin' ? 'Administrador' : 'Usuario'}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(user.creado_en).toLocaleDateString('es-ES', { year: 'numeric', month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                  </li>
                ))
              )}
            </ul>
          </div>
          <div className="px-6 py-3 flex items-center justify-between border-t border-gray-200 bg-white">
            <div className="text-sm text-gray-600">Página {currentPage} de {totalPages}</div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1.5 border border-gray-300 rounded-lg bg-white text-sm text-gray-700 disabled:opacity-50 hover:bg-gray-100"
              >
                Anterior
              </button>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 border border-gray-300 rounded-lg bg-white text-sm text-gray-700 disabled:opacity-50 hover:bg-gray-100"
              >
                Siguiente
              </button>
            </div>
          </div>
        </div>
      
      {/* Modal de confirmación para eliminar usuario */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Confirmar eliminación
                  </h3>
                  <p className="text-sm text-gray-500">
                    Esta acción no se puede deshacer
                  </p>
                </div>
              </div>
              
              <div className="mb-6">
                <p className="text-gray-700">
                  ¿Estás seguro de que quieres eliminar al usuario{' '}
                  <span className="font-semibold">{userToDelete?.nombre || userToDelete?.email}</span>?
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Se eliminarán todos los datos asociados a este usuario.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleCloseModal}
                  disabled={deleting}
                  className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors duration-200 disabled:opacity-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleDeleteUser}
                  disabled={deleting}
                  className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {deleting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Eliminando...
                    </>
                  ) : (
                    'Eliminar Usuario'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminUsers;