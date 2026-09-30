import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const AdminNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(() => localStorage.getItem('adminSidebarCollapsed') === 'true');

  useEffect(() => {
    localStorage.setItem('adminSidebarCollapsed', collapsed ? 'true' : 'false');
  }, [collapsed]);

  useEffect(() => {
    setCollapsed(false);
    localStorage.setItem('adminSidebarCollapsed', 'false');
    window.dispatchEvent(new CustomEvent('admin-sidebar-toggle', { detail: { collapsed: false } }));
  }, []);

  const toggleCollapsed = () => {
    const next = !collapsed;
    setCollapsed(next);
    window.dispatchEvent(new CustomEvent('admin-sidebar-toggle', { detail: { collapsed: next } }));
  };

  const menuSections = [
    {
      title: 'General',
      items: [
        { path: '/admin', icon: 'home', label: 'Dashboard' },
        { path: '/admin/usuarios', icon: 'people', label: 'Usuarios' },
        { path: '/admin/productos', icon: 'inventory_2', label: 'Productos' },
        { path: '/admin/categorias', icon: 'category', label: 'Categorías' },
        { path: '/admin/analytics', icon: 'analytics', label: 'Analytics' },
        { path: '/admin/opiniones', icon: 'rate_review', label: 'Opiniones' },
        { path: '/admin/reportes', icon: 'chat', label: 'Reportes' }
      ]
    }
  ];

  const isActive = (path) => {
    const p = location.pathname;
    if (path === '/admin') return p === '/admin';
    return p === path || p.startsWith(path + '/');
  };

  return (
    <>
      {/* Button to open the navbar */}
      <div className="fixed top-4 left-4 z-50 md:hidden">
        <button 
          onClick={() => setIsOpen(!isOpen)} 
          className="bg-white shadow-lg text-gray-700 p-3 rounded-xl hover:bg-gray-50 transition-all duration-200"
        >
          <span className="material-icons text-xl">menu</span>
        </button>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div 
          onClick={() => setIsOpen(false)} 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
        />
      )}

      {/* Navbar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 flex flex-col ${collapsed ? 'md:w-20 w-64' : 'md:w-64 w-64'} h-full bg-white shadow-2xl transition-transform transform md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header con logo */}
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <Link to="/welcome" className="block flex-1">
              <div className={`flex items-center ${collapsed ? 'justify-center' : 'space-x-3'}`}>
                <img 
                  src="/img/resmoke/logo.png" 
                  alt="Logo" 
                  className={`${collapsed ? 'h-12 w-12 rounded-xl object-contain' : 'h-12 w-auto'}`} 
                />
                <div className={`${collapsed ? 'hidden' : 'block'}`}>
                  <h2 className="text-xl font-bold text-gray-800">RESMOKE</h2>
                  <p className="text-xs text-gray-500">Panel Admin</p>
                </div>
              </div>
            </Link>
            <button
              onClick={toggleCollapsed}
              className="hidden md:inline-flex p-2 rounded-lg hover:bg-gray-100 text-gray-700"
            >
              <span className="material-icons text-xl">{collapsed ? 'chevron_right' : 'chevron_left'}</span>
            </button>
          </div>
        </div>
        
        {/* Navigation Menu */}
        <nav className={`flex-1 ${collapsed ? 'px-2' : 'px-4'} py-6 space-y-6 overflow-y-auto`}
        >
          {menuSections.map((section, sectionIndex) => (
            <div key={sectionIndex}>
              {/* Section Title */}
              <div className={`${collapsed ? 'hidden' : 'px-4 mb-3'}`}>
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  {section.title}
                </h3>
              </div>
              
              {/* Section Items */}
              <div className="space-y-1">
                {section.items.map((item) => {
                  const getColorClasses = (active) => {
                    const base = 'text-gray-700 hover:bg-gray-50 hover:text-gray-900';
                    const activeCls = 'bg-blue-50 text-blue-700 ring-1 ring-blue-100';
                    return active ? activeCls : base;
                  };

                  const getIconColorClasses = (active) => {
                    return active ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600';
                  };

                  const getDotColorClasses = () => 'bg-blue-500';

                  return (
                    <Link 
                      key={item.path}
                      to={item.path} 
                      title={item.label}
                      aria-current={isActive(item.path) ? 'page' : undefined}
                      className={`group flex items-center ${collapsed ? 'justify-center px-0' : 'px-4'} py-2.5 rounded-lg transition-all duration-200 ${
                        getColorClasses(isActive(item.path))
                      }`}
                    >
                      <span className={`material-icons ${collapsed ? 'mr-0' : 'mr-4'} text-xl p-2 rounded-lg ${
                        getIconColorClasses(isActive(item.path))
                      } ${isActive(item.path) ? 'bg-blue-100' : ''}`}>
                        {item.icon}
                      </span>
                      <span className={`${collapsed ? 'hidden' : 'font-medium'}`}>{item.label}</span>
                      {!collapsed && isActive(item.path) && (
                        <div className={`ml-auto w-2 h-2 rounded-full ${getDotColorClasses()}`}></div>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100">
          <div className={`flex items-center ${collapsed ? 'justify-center px-0 py-2' : 'space-x-3 px-4 py-3 bg-gray-50 rounded-xl'}`}>
            <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
              <span className="material-icons text-white text-base">admin_panel_settings</span>
            </div>
            <div className={`${collapsed ? 'hidden' : 'flex-1'}`}>
              <p className="text-sm font-medium text-gray-800">Administrador</p>
              <p className="text-xs text-gray-500">Panel de control</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminNavbar;
