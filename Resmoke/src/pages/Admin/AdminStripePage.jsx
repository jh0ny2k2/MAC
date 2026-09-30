import React, { useState, useEffect } from 'react';
import AdminNavbar from '../../components/Layout/AdminNavbar';
import stripeAdminService from '../../services/stripeAdminService';

const AdminStripePage = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [useMockData, setUseMockData] = useState(false);
  const [dataSource, setDataSource] = useState('real'); // 'real', 'mock', 'fallback'

  // Cargar datos según la pestaña activa
  useEffect(() => {
    loadData(activeTab);
  }, [activeTab]);

  // Recargar datos cuando cambia el modo de datos de prueba
  useEffect(() => {
    if (data) { // Solo recargar si ya hay datos cargados
      loadData(activeTab);
    }
  }, [useMockData]);

  const loadData = async (tab) => {
    setLoading(true);
    setError(null);

    try {
      // Configurar el modo de datos en el servicio
      stripeAdminService.setMockMode(useMockData);
      
      // Determinar el origen de los datos
      if (useMockData) {
        setDataSource('mock');
      } else {
        setDataSource('real');
      }
      
      let result;
      switch (tab) {
        case 'overview':
          result = await stripeAdminService.getOverview();
          break;
        case 'customers':
          result = await stripeAdminService.getCustomers({ limit: 20 });
          break;
        case 'payments':
          result = await stripeAdminService.getPayments({ limit: 20 });
          break;
        case 'subscriptions':
          result = await stripeAdminService.getSubscriptions({ limit: 20 });
          break;
        case 'products':
          result = await stripeAdminService.getProducts({ limit: 20 });
          break;
        case 'invoices':
          result = await stripeAdminService.getInvoices({ limit: 20 });
          break;
        case 'balance':
          result = await stripeAdminService.getBalance();
          break;
        default:
          result = {};
      }
      
      setData(result);
      
      // Si llegamos aquí sin error y no estamos en modo mock, los datos son reales
      if (!useMockData) {
        setDataSource('real');
      }
    } catch (err) {
        console.error('Error cargando datos:', err);
        
        // Si no estamos en modo mock y hay fallback habilitado, 
        // probablemente se usarán datos de prueba automáticamente
        if (!useMockData && stripeService.mockDataEnabled) {
          setDataSource('fallback');
          // Intentar obtener datos de prueba como fallback
          try {
            const fallbackResult = await stripeService.getMockData(type);
            setData(fallbackResult);
            return; // Salir sin mostrar error
          } catch (fallbackError) {
            console.error('Error con datos de prueba:', fallbackError);
          }
        }
        
        // Mensajes de error más específicos
        let errorMessage = 'Error al cargar los datos de Stripe';
        let errorDetails = '';
        
        if (err.message.includes('Failed to fetch') || err.message.includes('ERR_CONNECTION_REFUSED')) {
          errorMessage = 'No se puede conectar al servidor';
          errorDetails = 'El backend no está ejecutándose en el puerto 3001. Esto es normal en desarrollo local sin backend.';
        } else if (err.message.includes('404')) {
          errorMessage = 'Endpoint no encontrado';
          errorDetails = 'La función de Netlify o el endpoint del backend no existe.';
        } else if (err.message.includes('401') || err.message.includes('403')) {
          errorMessage = 'Error de autenticación';
          errorDetails = 'No tienes permisos para acceder a estos datos.';
        } else if (err.message.includes('500')) {
          errorMessage = 'Error del servidor';
          errorDetails = 'Hay un problema en el servidor. Intenta más tarde.';
        } else {
          errorDetails = err.message;
        }
        
        setError({
          message: errorMessage,
          details: errorDetails,
          originalError: err.message
        });
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'overview', label: 'Resumen', icon: '📊' },
    { id: 'customers', label: 'Clientes', icon: '👥' },
    { id: 'payments', label: 'Pagos', icon: '💳' },
    { id: 'subscriptions', label: 'Suscripciones', icon: '🔄' },
    { id: 'products', label: 'Productos', icon: '📦' },
    { id: 'invoices', label: 'Facturas', icon: '📄' },
    { id: 'balance', label: 'Balance', icon: '💰' },
  ];

  const renderOverview = () => {
    if (!data) {
      return (
        <div className="text-center py-12">
          <span className="material-icons text-gray-400 text-6xl mb-4">analytics</span>
          <p className="text-gray-500">No hay datos disponibles</p>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {/* Cards de estadísticas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gray-200 rounded-xl p-6 text-black shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold opacity-90">Balance Disponible</h3>
                <p className="text-3xl font-bold mt-2">
                  {data.balance ? stripeAdminService.formatAmount(data.balance.available[0]?.amount || 0, data.balance.available[0]?.currency) : '€0.00'}
                </p>
              </div>
              <span className="material-icons text-4xl opacity-80">account_balance_wallet</span>
            </div>
          </div>
        
        <div className="bg-gray-200 rounded-xl p-6 text-black shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold opacity-90">Clientes</h3>
              <p className="text-3xl font-bold mt-2">{data.customers?.length || 0}</p>
            </div>
            <span className="material-icons text-4xl opacity-80">people</span>
          </div>
        </div>
        
        <div className="bg-gray-200 rounded-xl p-6 text-black shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold opacity-90">Pagos Recientes</h3>
              <p className="text-3xl font-bold mt-2">{data.payments?.length || 0}</p>
            </div>
            <span className="material-icons text-4xl opacity-80">payment</span>
          </div>
        </div>
        
        <div className="bg-gray-200 rounded-xl p-6 text-black shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold opacity-90">Suscripciones</h3>
              <p className="text-3xl font-bold mt-2">{data.subscriptions?.length || 0}</p>
            </div>
            <span className="material-icons text-4xl opacity-80">autorenew</span>
          </div>
        </div>
      </div>

      {/* Actividad reciente */}
      <div className="bg-gray-50 rounded-xl p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
          <span className="material-icons mr-2">history</span>
          Actividad Reciente
        </h3>
        <div className="space-y-3">
          {data.payments?.slice(0, 5).map((payment) => (
            <div key={payment.id} className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="material-icons text-blue-600">payment</span>
                  <div>
                    <p className="font-medium text-gray-800">
                      Pago {stripeAdminService.getPaymentStatus(payment.status)}
                    </p>
                    <p className="text-sm text-gray-500">
                      {stripeAdminService.formatDate(payment.created)}
                    </p>
                  </div>
                </div>
                <p className="text-lg font-semibold text-green-600">
                  {stripeAdminService.formatAmount(payment.amount, payment.currency)}
                </p>
              </div>
            </div>
          ))}
          {(!data.payments || data.payments.length === 0) && (
            <div className="text-center py-8 text-gray-500">
              <span className="material-icons text-4xl mb-2">inbox</span>
              <p>No hay actividad reciente</p>
            </div>
          )}
        </div>
      </div>
    </div>
    );
  };

  const renderCustomers = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-gray-800 flex items-center">
          <span className="material-icons mr-2">people</span>
          Clientes de Stripe
        </h3>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
          <span className="material-icons">add</span>
          Nuevo Cliente
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.isArray(data) && data.length > 0 ? (
          data.map((customer) => (
            <div key={customer.id} className="bg-gray-50 rounded-lg p-4 hover:shadow-md transition-shadow border-l-4 border-blue-500">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-800 mb-2">
                    {customer.name || customer.email || 'Cliente sin nombre'}
                  </h4>
                  <p className="text-gray-600 text-sm mb-1">{customer.email}</p>
                  <p className="text-xs text-gray-500 font-mono bg-gray-200 px-2 py-1 rounded inline-block mb-2">
                    {customer.id}
                  </p>
                  <p className="text-xs text-gray-500">
                    Creado: {stripeAdminService.formatDate(customer.created)}
                  </p>
                </div>
                <div className="flex gap-1">
                  <button className="text-blue-600 hover:bg-blue-100 p-1 rounded">
                    <span className="material-icons text-sm">edit</span>
                  </button>
                  <button className="text-red-600 hover:bg-red-100 p-1 rounded">
                    <span className="material-icons text-sm">delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <span className="material-icons text-6xl text-gray-400 mb-4">people_outline</span>
            <p className="text-gray-500">No hay clientes disponibles</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderPayments = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-gray-800 flex items-center">
          <span className="material-icons mr-2">payment</span>
          Pagos de Stripe
        </h3>
        <button className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2">
          <span className="material-icons">add</span>
          Nuevo Pago
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.isArray(data) && data.length > 0 ? (
          data.map((payment) => (
            <div key={payment.id} className="bg-gray-50 rounded-lg p-4 hover:shadow-md transition-shadow border-l-4 border-emerald-500">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-semibold text-gray-800">
                      Pago #{payment.id.slice(-8)}
                    </h4>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      payment.status === 'succeeded' 
                        ? 'bg-green-100 text-green-800' 
                        : payment.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : payment.status === 'processing'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {stripeAdminService.getPaymentStatus(payment.status)}
                    </span>
                  </div>
                  <p className="text-lg font-semibold text-gray-800 mb-1">
                    {stripeAdminService.formatAmount(payment.amount, payment.currency)}
                  </p>
                  {payment.description && (
                    <p className="text-gray-600 text-sm mb-1">{payment.description}</p>
                  )}
                  <p className="text-xs text-gray-500 font-mono bg-gray-200 px-2 py-1 rounded inline-block mb-2">
                    {payment.id}
                  </p>
                  <p className="text-xs text-gray-500">
                    {stripeAdminService.formatDate(payment.created)}
                  </p>
                </div>
                <div className="flex gap-1">
                  <button className="text-blue-600 hover:bg-blue-100 p-1 rounded">
                    <span className="material-icons text-sm">visibility</span>
                  </button>
                  <button className="text-green-600 hover:bg-green-100 p-1 rounded">
                    <span className="material-icons text-sm">receipt</span>
                  </button>
                  <button className="text-red-600 hover:bg-red-100 p-1 rounded">
                    <span className="material-icons text-sm">cancel</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <span className="material-icons text-6xl text-gray-400 mb-4">payment</span>
            <p className="text-gray-500">No hay pagos disponibles</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderSubscriptions = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-gray-800 flex items-center">
          <span className="material-icons mr-2">subscriptions</span>
          Suscripciones de Stripe
        </h3>
        <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2">
          <span className="material-icons">add</span>
          Nueva Suscripción
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.isArray(data) && data.length > 0 ? (
          data.map((subscription) => (
            <div key={subscription.id} className="bg-gray-50 rounded-lg p-4 hover:shadow-md transition-shadow border-l-4 border-indigo-500">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-semibold text-gray-800">
                      {subscription.plan?.nickname || subscription.plan?.id || 'Suscripción'}
                    </h4>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      subscription.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : subscription.status === 'trialing'
                        ? 'bg-blue-100 text-blue-800'
                        : subscription.status === 'past_due'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {stripeAdminService.getSubscriptionStatus(subscription.status)}
                    </span>
                  </div>
                  <p className="text-lg font-semibold text-gray-800 mb-1">
                    {stripeAdminService.formatAmount(subscription.amount || 0, subscription.currency || 'eur')}
                  </p>
                  <p className="text-gray-600 text-sm mb-1">Cliente: {subscription.customer}</p>
                  <p className="text-xs text-gray-500 font-mono bg-gray-200 px-2 py-1 rounded inline-block mb-2">
                    {subscription.id}
                  </p>
                  <p className="text-xs text-gray-500">
                    Creada: {stripeAdminService.formatDate(subscription.current_period_start)}
                  </p>
                  {subscription.current_period_end && (
                    <p className="text-xs text-gray-500">
                      Próximo pago: {stripeAdminService.formatDate(subscription.current_period_end)}
                    </p>
                  )}
                </div>
                <div className="flex gap-1">
                  <button className="text-blue-600 hover:bg-blue-100 p-1 rounded">
                    <span className="material-icons text-sm">edit</span>
                  </button>
                  <button className="text-yellow-600 hover:bg-yellow-100 p-1 rounded">
                    <span className="material-icons text-sm">pause</span>
                  </button>
                  <button className="text-red-600 hover:bg-red-100 p-1 rounded">
                    <span className="material-icons text-sm">cancel</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <span className="material-icons text-6xl text-gray-400 mb-4">subscriptions</span>
            <p className="text-gray-500">No hay suscripciones disponibles</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderProducts = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-gray-800 flex items-center">
          <span className="material-icons mr-2">inventory_2</span>
          Productos de Stripe
        </h3>
        <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2">
          <span className="material-icons">add</span>
          Nuevo Producto
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.isArray(data) && data.length > 0 ? (
          data.map((product) => (
            <div key={product.id} className="bg-gray-50 rounded-lg p-4 hover:shadow-md transition-shadow border-l-4 border-green-500">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-semibold text-gray-800">{product.name}</h4>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      product.active 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {product.active ? 'Activo' : 'Inactivo'}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-2">{product.description}</p>
                  <p className="text-xs text-gray-500 font-mono bg-gray-200 px-2 py-1 rounded inline-block mb-2">
                    {product.id}
                  </p>
                  <p className="text-xs text-gray-500">
                    Creado: {stripeAdminService.formatDate(product.created)}
                  </p>
                </div>
                <div className="flex gap-1">
                  <button className="text-blue-600 hover:bg-blue-100 p-1 rounded">
                    <span className="material-icons text-sm">edit</span>
                  </button>
                  <button className="text-red-600 hover:bg-red-100 p-1 rounded">
                    <span className="material-icons text-sm">delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <span className="material-icons text-6xl text-gray-400 mb-4">inventory_2</span>
            <p className="text-gray-500">No hay productos disponibles</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderInvoices = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-gray-800 flex items-center">
          <span className="material-icons mr-2">receipt</span>
          Facturas de Stripe
        </h3>
        <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2">
          <span className="material-icons">add</span>
          Nueva Factura
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.isArray(data) && data.length > 0 ? (
          data.map((invoice) => (
            <div key={invoice.id} className="bg-gray-50 rounded-lg p-4 hover:shadow-md transition-shadow border-l-4 border-purple-500">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-semibold text-gray-800">
                      Factura #{invoice.number || invoice.id.slice(-8)}
                    </h4>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      invoice.status === 'paid' 
                        ? 'bg-green-100 text-green-800' 
                        : invoice.status === 'open'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {invoice.status}
                    </span>
                  </div>
                  <p className="text-lg font-semibold text-gray-800 mb-1">
                    {stripeAdminService.formatAmount(invoice.amount_due, invoice.currency)}
                  </p>
                  <p className="text-gray-600 text-sm mb-1">{invoice.customer_email}</p>
                  <p className="text-xs text-gray-500 font-mono bg-gray-200 px-2 py-1 rounded inline-block mb-2">
                    {invoice.id}
                  </p>
                  <p className="text-xs text-gray-500">
                    Creada: {stripeAdminService.formatDate(invoice.created)}
                  </p>
                </div>
                <div className="flex gap-1">
                  <button className="text-blue-600 hover:bg-blue-100 p-1 rounded">
                    <span className="material-icons text-sm">visibility</span>
                  </button>
                  <button className="text-green-600 hover:bg-green-100 p-1 rounded">
                    <span className="material-icons text-sm">download</span>
                  </button>
                  <button className="text-red-600 hover:bg-red-100 p-1 rounded">
                    <span className="material-icons text-sm">delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <span className="material-icons text-6xl text-gray-400 mb-4">receipt_long</span>
            <p className="text-gray-500">No hay facturas disponibles</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderBalance = () => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-6">Balance de la Cuenta</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-green-50 rounded-lg p-4 border border-green-200">
          <h4 className="text-lg font-medium text-green-800 mb-4 flex items-center">
            <span className="mr-2">💰</span>
            Fondos Disponibles
          </h4>
          <div className="space-y-3">
            {data.available?.map((balance, index) => (
              <div key={index} className="flex justify-between items-center bg-white rounded-md p-3 border border-green-100">
                <span className="text-2xl font-bold text-green-700">
                  {stripeAdminService.formatAmount(balance.amount, balance.currency)}
                </span>
                <span className="text-sm font-medium text-green-600 bg-green-100 px-2 py-1 rounded">
                  {balance.currency.toUpperCase()}
                </span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
          <h4 className="text-lg font-medium text-yellow-800 mb-4 flex items-center">
            <span className="mr-2">⏳</span>
            Fondos Pendientes
          </h4>
          <div className="space-y-3">
            {data.pending?.map((balance, index) => (
              <div key={index} className="flex justify-between items-center bg-white rounded-md p-3 border border-yellow-100">
                <span className="text-2xl font-bold text-yellow-700">
                  {stripeAdminService.formatAmount(balance.amount, balance.currency)}
                </span>
                <span className="text-sm font-medium text-yellow-600 bg-yellow-100 px-2 py-1 rounded">
                  {balance.currency.toUpperCase()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    if (loading) {
      return (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Cargando datos de Stripe...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="error-container">
          <h3>❌ Error al cargar datos</h3>
          <p>{error}</p>
          <button onClick={() => loadData(activeTab)} className="retry-button">
            Reintentar
          </button>
        </div>
      );
    }

    switch (activeTab) {
      case 'overview':
        return renderOverview();
      case 'customers':
        return renderCustomers();
      case 'payments':
        return renderPayments();
      case 'subscriptions':
        return renderSubscriptions();
      case 'products':
        return renderProducts();
      case 'invoices':
        return renderInvoices();
      case 'balance':
        return renderBalance();
      default:
        return <div>Selecciona una pestaña</div>;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AdminNavbar />
        <div className="flex-grow lg:ml-64">
          <div className="flex items-center justify-center h-64">
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
              <div className="text-xl text-gray-600">Cargando datos de Stripe...</div>
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
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                  <span className="material-icons text-blue-600 mr-3 text-4xl">payment</span>
                  Panel de Administración de Stripe
                </h1>
                <p className="text-gray-600 mt-2">Gestiona y visualiza todos los datos de Stripe</p>
              </div>
              
              {/* Controles superiores */}
              <div className="flex items-center space-x-4">
                {/* Botón Dashboard de Stripe */}
                <a
                  href="https://dashboard.stripe.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 bg-purple-700 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                >
                  <span className="material-icons text-lg">open_in_new</span>
                  <span className="font-medium">Dashboard Stripe</span>
                </a>

                {/* Indicador del origen de datos */}
                 <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg border ${
                   dataSource === 'real' ? 'bg-green-50 border-green-200 text-green-800' :
                   dataSource === 'mock' ? 'bg-blue-50 border-blue-200 text-blue-800' :
                   'bg-yellow-50 border-yellow-200 text-yellow-800'
                 }`}>
                   <span className="material-icons text-sm">
                     {dataSource === 'real' ? 'cloud_done' : 
                      dataSource === 'mock' ? 'science' : 'warning'}
                   </span>
                   <span className="text-xs font-medium">
                     {dataSource === 'real' ? 'Datos Reales de Stripe' :
                      dataSource === 'mock' ? 'Datos de Prueba' :
                      'Fallback - Datos de Prueba'}
                   </span>
                 </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="max-w-7xl mx-auto p-4 sm:p-6">
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <div className="flex flex-wrap gap-3 justify-center">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-blue-600 text-white shadow-lg transform scale-105'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105'
                  }`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <span className="text-xl">{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
              <div className="flex items-start">
                <span className="material-icons text-red-500 mr-3 mt-1">error_outline</span>
                <div className="flex-1">
                  <h3 className="text-red-800 font-semibold mb-2">
                    {typeof error === 'string' ? 'Error de Conexión' : error.message || 'Error al cargar datos'}
                  </h3>
                  <p className="text-red-700 mb-3">
                    {typeof error === 'string' ? error : error.details || 'Ha ocurrido un error inesperado.'}
                  </p>
                  <div className="bg-red-100 rounded-lg p-3 text-sm text-red-600">
                    <p className="font-medium mb-1">Posibles soluciones:</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Activa el modo "Datos de prueba" para ver datos de ejemplo</li>
                      <li>Verifica que el servidor backend esté ejecutándose</li>
                      <li>Comprueba la configuración de las variables de entorno</li>
                      <li>Revisa las credenciales de Stripe en el backend</li>
                    </ul>
                  </div>
                  <button 
                    onClick={() => loadData(activeTab)}
                    className="mt-3 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                  >
                    <span className="material-icons text-sm">refresh</span>
                    Reintentar
                  </button>
                  
                  {/* Detalles técnicos */}
                  {typeof error === 'object' && error.originalError && (
                    <details className="mt-4">
                      <summary className="text-sm text-red-600 cursor-pointer hover:text-red-800">
                        Ver detalles técnicos
                      </summary>
                      <pre className="mt-2 text-xs text-red-600 bg-red-100 p-2 rounded overflow-auto">
                        {error.originalError}
                      </pre>
                    </details>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Content */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            {!error && renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminStripePage;