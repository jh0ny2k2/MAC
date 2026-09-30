import { useEffect, useState } from 'react';
import AdminNavbar from './AdminNavbar';

const AdminLayout = ({ title, subtitle, headerActions, children }) => {
  const [collapsed, setCollapsed] = useState(() => localStorage.getItem('adminSidebarCollapsed') === 'true');

  useEffect(() => {
    const handler = (e) => setCollapsed(!!e.detail?.collapsed);
    window.addEventListener('admin-sidebar-toggle', handler);
    return () => window.removeEventListener('admin-sidebar-toggle', handler);
  }, []);

  const sideMargin = collapsed ? 'lg:ml-20' : 'lg:ml-64';

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar />
      <div className={`flex-grow ${sideMargin}`}>
        <div className="bg-white shadow-sm border-b border-gray-200 p-4 md:p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => window.dispatchEvent(new Event('admin-sidebar-open'))}
                  className="md:hidden inline-flex items-center p-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50"
                  aria-label="Abrir menú"
                >
                  <span className="material-icons text-xl">menu</span>
                </button>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{title}</h1>
                  {subtitle && <p className="text-gray-600 mt-2">{subtitle}</p>}
                </div>
              </div>
              <div className="w-full md:w-auto">{headerActions}</div>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
