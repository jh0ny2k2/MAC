import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Filler, ArcElement } from 'chart.js';
import AdminLayout from '../../components/Layout/AdminLayout';
import { supabase } from '../../lib/supabase';
import stripeAdminService from '../../services/stripeAdminService';
import supabaseAdminService from '../../services/supabaseAdminService';
import netlifyAdminService from '../../services/netlifyAdminService';
import { useAuth } from '../../contexts/AuthContext';
import { sendAnnouncementViaResend } from '../../utils/emailNotifications';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Filler, ArcElement);

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    usuarios: 0,
    productos: 0,
    categorias: 0,
    favoritos: 0,
    opiniones: 0,
    contactos: 0,
    reportes: 0
  });
  const [analyticsData, setAnalyticsData] = useState({
    usuariosUltimos15Dias: [],
    productosUltimos15Dias: [],
    verifiedUsersCount: null,
    recentReviews: [],
    topSellers: [],
    latestSales: [],
    topViewed: [],
    recentReports: []
  });
  const [platformStats, setPlatformStats] = useState({
    stripe: null,
    supabase: null,
    netlify: null
  });
  const [businessMetrics, setBusinessMetrics] = useState({
    comprasPorDia: [],
    conversionPorCategoria: [],
    revenuePorCategoria: [],
    tiempoMedioVentaMs: null
  });
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('15');
  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);
  const [announcementSubject, setAnnouncementSubject] = useState('');
  const [announcementMessage, setAnnouncementMessage] = useState('');
  const [manualEmailsInput, setManualEmailsInput] = useState('');
  const [selectedEmails, setSelectedEmails] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [sendingAnnouncement, setSendingAnnouncement] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [showModuleManager, setShowModuleManager] = useState(false);
  const [layoutLoaded, setLayoutLoaded] = useState(false);
  const [layoutItems, setLayoutItems] = useState([]);
  const [draggingId, setDraggingId] = useState(null);
  const [resizingId, setResizingId] = useState(null);
  const gridRef = useRef(null);
  const resizeSessionRef = useRef(null);
  const resizeRafRef = useRef(null);
  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false }, tooltip: { mode: 'index', intersect: false } },
    scales: { x: { grid: { display: false }, ticks: { maxRotation: 0, autoSkip: true } }, y: { grid: { color: 'rgba(0,0,0,0.06)' }, beginAtZero: true, precision: 0 } },
    elements: { line: { tension: 0.35 }, point: { radius: 0, hoverRadius: 4 } }
  };

  useEffect(() => {
    fetchStats();
    fetchPlatformStats();
  }, []);

  const openAnnouncementModal = async () => {
    setShowAnnouncementModal(true);
    if (usersList.length === 0) {
      setLoadingUsers(true);
      const { data, error } = await supabase
        .from('Users')
        .select('id,nombre,email')
        .order('creado_en', { ascending: false })
        .limit(2000);
      if (!error && Array.isArray(data)) setUsersList(data.filter(u => !!u.email));
      setLoadingUsers(false);
    }
  };

  const closeAnnouncementModal = () => {
    setShowAnnouncementModal(false);
    setAnnouncementSubject('');
    setAnnouncementMessage('');
    setManualEmailsInput('');
    setSelectedEmails([]);
  };

  const toggleEmailSelection = (email) => {
    setSelectedEmails(prev => prev.includes(email) ? prev.filter(e => e !== email) : [...prev, email]);
  };

  const parseManualEmails = () => {
    return manualEmailsInput
      .split(/[\n,;\s]+/)
      .map(e => e.trim())
      .filter(e => e && /@/.test(e));
  };

  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(email).toLowerCase());
  };

  const sendAnnouncement = async () => {
    const toRaw = Array.from(new Set([...selectedEmails, ...parseManualEmails()]));
    const invalids = toRaw.filter(e => !isValidEmail(e));
    const to = toRaw.filter(isValidEmail);
    if (to.length === 0 || !announcementSubject || !announcementMessage) {
      alert('Completa asunto, mensaje y al menos un destinatario.');
      return;
    }
    if (invalids.length > 0) {
      alert(`Correos inválidos:\n${invalids.join('\n')}`);
      return;
    }
    try {
      setSendingAnnouncement(true);
      const nameMap = Object.fromEntries(usersList.map(u => [u.email, u.nombre]));
      const ok = await sendAnnouncementViaResend(to, announcementSubject, announcementMessage, user?.nombre || 'Resmoke', nameMap);
      if (ok) {
        alert('Anuncio enviado correctamente');
        closeAnnouncementModal();
      } else {
        alert('No se pudo enviar el anuncio');
      }
    } catch (e) {
      alert(`Error enviando anuncio: ${e.message}`);
    } finally {
      setSendingAnnouncement(false);
    }
  };

  useEffect(() => {
    fetchAnalyticsData();
  }, [timeRange]);

  const fetchStats = async () => {
    try {
      // Obtener estadísticas de cada tabla
      const [usuarios, productos, categorias, reportes, opiniones] = await Promise.all([
        supabase.from('Users').select('*', { count: 'exact', head: true }),
        supabase.from('products').select('*', { count: 'exact', head: true }),
        supabase.from('categories').select('*', { count: 'exact', head: true }),
        supabase.from('suspicious_activity_reports').select('*', { count: 'exact', head: true }),
        supabase.from('reviews').select('*', { count: 'exact', head: true })
      ]);

      setStats({
        usuarios: usuarios.count || 0,
        productos: productos.count || 0,
        categorias: categorias.count || 0,
        favoritos: 0, // Implementar cuando tengas la tabla
        opiniones: opiniones.count || 0,
        contactos: 0, // Implementar cuando tengas la tabla
        reportes: reportes.count || 0
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAnalyticsData = async () => {
    try {
      const fechaInicio = new Date();
      fechaInicio.setDate(fechaInicio.getDate() - Number(timeRange));
      const fechaInicioISO = fechaInicio.toISOString().split('T')[0];

      // Obtener usuarios registrados en los últimos 15 días
      const { data: usuarios } = await supabase
        .from('Users')
        .select('creado_en')
        .gte('creado_en', fechaInicioISO);

      // Obtener productos publicados en los últimos 15 días
      const { data: productos } = await supabase
        .from('products')
        .select('created_at')
        .gte('created_at', fechaInicioISO);

      const [
        { data: ventas, error: ventasError },
        { data: productosParaConversion, error: productosParaConversionError },
        { data: latestSales, error: latestSalesError },
        { data: topViewed, error: topViewedError },
        { data: recentReports, error: recentReportsError },
        { count: verifiedUsersCount, error: verifiedUsersError },
        { data: recentReviews, error: recentReviewsError },
        { data: topSellersData, error: topSellersError }
      ] = await Promise.all([
        supabase
          .from('products')
          .select('created_at,sold_date,price,sale_price')
          .eq('status', 'sold')
          .gte('sold_date', fechaInicioISO),
        supabase
          .from('products')
          .select('status,sold_date,price,sale_price,categories (id,name)')
          .gte('created_at', fechaInicioISO),
        supabase
          .from('products')
          .select('id,name,price,sale_price,sold_date,buyer_name,categories (id,name)')
          .eq('status', 'sold')
          .gte('sold_date', fechaInicioISO)
          .order('sold_date', { ascending: false })
          .limit(8),
        supabase
          .from('products')
          .select('id,name,view_count,status,price,categories (id,name)')
          .order('view_count', { ascending: false })
          .limit(8),
        supabase
          .from('suspicious_activity_reports')
          .select('id,status,urgency,created_at')
          .order('created_at', { ascending: false })
          .limit(8),
        supabase
          .from('Users')
          .select('*', { count: 'exact', head: true })
          .eq('is_verified', true),
        supabase
          .from('reviews')
          .select('id,rating,comment,created_at,author_name,products(name)')
          .order('created_at', { ascending: false })
          .limit(5),
        supabase
          .from('products')
          .select('seller_id, price, sale_price')
          .eq('status', 'sold')
          .gte('sold_date', fechaInicioISO)
      ]);

      if (ventasError) throw ventasError;
      if (productosParaConversionError) throw productosParaConversionError;
      if (latestSalesError) throw latestSalesError;
      if (topViewedError) throw topViewedError;
      if (recentReportsError) throw recentReportsError;
      if (verifiedUsersError) throw verifiedUsersError;

      // Procesar Top Sellers
      let topSellers = [];
      if (topSellersData && topSellersData.length > 0) {
        const sellerMap = new Map();
        topSellersData.forEach(s => {
          if (!s.seller_id) return;
          const current = sellerMap.get(s.seller_id) || { id: s.seller_id, revenue: 0, sales: 0 };
          current.sales += 1;
          current.revenue += (s.sale_price || s.price || 0);
          sellerMap.set(s.seller_id, current);
        });
        
        const topSellerIds = Array.from(sellerMap.keys());
        if (topSellerIds.length > 0) {
            const { data: sellersInfo } = await supabase
                .from('Users')
                .select('id, nombre')
                .in('id', topSellerIds);
            
            const sellerNames = Object.fromEntries((sellersInfo || []).map(u => [u.id, u.nombre]));
            
            topSellers = Array.from(sellerMap.values())
                .map(s => ({ ...s, name: sellerNames[s.id] || 'Usuario' }))
                .sort((a, b) => b.revenue - a.revenue)
                .slice(0, 5);
        }
      }

      // Procesar datos para gráficos
      const usuariosPorDia = procesarDatosPorDia(usuarios || [], Number(timeRange), 'creado_en');
      const productosPorDia = procesarDatosPorDia(productos || [], Number(timeRange), 'created_at');
      const comprasPorDia = procesarDatosPorDia(ventas || [], Number(timeRange), 'sold_date');

      let tiempoMedioVentaMs = null;
      if (ventas && ventas.length > 0) {
        const totalMs = ventas.reduce((acc, v) => {
          const start = new Date(v.created_at);
          const end = new Date(v.sold_date);
          return acc + (end - start);
        }, 0);
        tiempoMedioVentaMs = totalMs / ventas.length;
      }

      const conversionMap = new Map();
      const revenueMap = new Map();
      
      (productosParaConversion || []).forEach(p => {
        const categoryName = p?.categories?.name || 'Sin categoría';
        
        // Conversión
        const currentConv = conversionMap.get(categoryName) || { category: categoryName, publicados: 0, vendidos: 0, conversion: 0 };
        currentConv.publicados += 1;
        if (p?.status === 'sold' || p?.sold_date) {
             currentConv.vendidos += 1;
             
             // Revenue
             const currentRev = revenueMap.get(categoryName) || { category: categoryName, revenue: 0 };
             currentRev.revenue += (p.sale_price || p.price || 0);
             revenueMap.set(categoryName, currentRev);
        }
        conversionMap.set(categoryName, currentConv);
      });

      const conversionPorCategoria = Array.from(conversionMap.values())
        .map(row => ({
          ...row,
          conversion: row.publicados > 0 ? (row.vendidos / row.publicados) * 100 : 0
        }))
        .sort((a, b) => (b.conversion - a.conversion) || (b.vendidos - a.vendidos))
        .slice(0, 6);
        
      const revenuePorCategoria = Array.from(revenueMap.values())
        .sort((a, b) => b.revenue - a.revenue);

      setAnalyticsData({
        usuariosUltimos15Dias: usuariosPorDia,
        productosUltimos15Dias: productosPorDia,
        verifiedUsersCount: typeof verifiedUsersCount === 'number' ? verifiedUsersCount : null,
        recentReviews: recentReviews || [],
        topSellers,
        latestSales: latestSales || [],
        topViewed: topViewed || [],
        recentReports: recentReports || []
      });
      setBusinessMetrics({
        comprasPorDia,
        conversionPorCategoria,
        revenuePorCategoria,
        tiempoMedioVentaMs
      });
    } catch (error) {
      console.error('Error fetching analytics data:', error);
    }
  };

  const fetchPlatformStats = async () => {
    try {
      // Cargar estadísticas de todas las plataformas en paralelo
      const [stripeData, supabaseData, netlifyData] = await Promise.allSettled([
        stripeAdminService.getOverview(),
        supabaseAdminService.getOverview(),
        netlifyAdminService.getOverview()
      ]);

      setPlatformStats({
        stripe: stripeData.status === 'fulfilled' ? stripeData.value : null,
        supabase: supabaseData.status === 'fulfilled' ? supabaseData.value : null,
        netlify: netlifyData.status === 'fulfilled' ? netlifyData.value : null
      });
    } catch (error) {
      console.error('Error fetching platform stats:', error);
    }
  };

  const procesarDatosPorDia = (data, dias, campoFecha = 'created_at') => {
    const resultado = [];
    const hoy = new Date();
    
    for (let i = dias - 1; i >= 0; i--) {
      const fecha = new Date(hoy);
      fecha.setDate(fecha.getDate() - i);
      const fechaStr = fecha.toISOString().split('T')[0];
      
      const count = data.filter(item => {
        const itemFecha = new Date(item[campoFecha]).toISOString().split('T')[0];
        return itemFecha === fechaStr;
      }).length;
      
      resultado.push({
        fecha: fechaStr,
        dia: fecha.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' }),
        count
      });
    }
    
    return resultado;
  };

  const usuariosChartData = {
    labels: analyticsData.usuariosUltimos15Dias.map(d => d.dia),
    datasets: [
      {
        label: 'Usuarios',
        data: analyticsData.usuariosUltimos15Dias.map(d => d.count),
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.15)',
        fill: 'origin'
      }
    ]
  };

  const productosChartData = {
    labels: analyticsData.productosUltimos15Dias.map(d => d.dia),
    datasets: [
      {
        label: 'Productos',
        data: analyticsData.productosUltimos15Dias.map(d => d.count),
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.15)',
        fill: 'origin'
      }
    ]
  };

  const comprasChartData = {
    labels: businessMetrics.comprasPorDia.map(d => d.dia),
    datasets: [
      {
        label: 'Compras',
        data: businessMetrics.comprasPorDia.map(d => d.count),
        borderColor: '#0ea5e9',
        backgroundColor: 'rgba(14, 165, 233, 0.15)',
        fill: 'origin'
      }
    ]
  };

  const dashboardItems = [
    {
      title: 'Usuarios',
      count: stats.usuarios,
      icon: 'people',
      link: '/admin/usuarios',
      tone: 'blue',
      description: 'Usuarios registrados'
    },
    {
      title: 'Productos',
      count: stats.productos,
      icon: 'inventory_2',
      link: '/admin/productos',
      tone: 'emerald',
      description: 'Productos en catálogo'
    },
    {
      title: 'Categorías',
      count: stats.categorias,
      icon: 'category',
      link: '/admin/categorias',
      tone: 'violet',
      description: 'Categorías activas'
    },
    {
      title: 'Analytics',
      count: 0,
      icon: 'analytics',
      link: '/admin/analytics',
      tone: 'sky',
      description: 'Métricas y reportes'
    },
    {
      title: 'Opiniones',
      count: stats.opiniones,
      icon: 'rate_review',
      link: '/admin/opiniones',
      tone: 'amber',
      description: 'Reseñas de usuarios'
    },
    {
      title: 'Reportes',
      count: stats.reportes || 0,
      icon: 'report',
      link: '/admin/reportes',
      tone: 'rose',
      description: 'Actividad sospechosa'
    }
  ];

  const pendingItems = [
    {
      title: 'Productos por Confirmar',
      count: 0,
      icon: 'pending_actions',
      link: '/admin/productos/confirmaciones',
      tone: 'amber',
      description: 'Productos pendientes de aprobación'
    },
    {
      title: 'Opiniones por Confirmar',
      count: 0,
      icon: 'pending_actions',
      link: '/admin/opiniones/pendientes',
      tone: 'amber',
      description: 'Opiniones pendientes de moderación'
    }
  ];

  const toneMeta = {
    slate: { icon: 'text-slate-700', ring: 'ring-slate-200', bg: 'bg-slate-50' },
    blue: { icon: 'text-blue-700', ring: 'ring-blue-200', bg: 'bg-blue-50' },
    emerald: { icon: 'text-emerald-700', ring: 'ring-emerald-200', bg: 'bg-emerald-50' },
    violet: { icon: 'text-violet-700', ring: 'ring-violet-200', bg: 'bg-violet-50' },
    sky: { icon: 'text-sky-700', ring: 'ring-sky-200', bg: 'bg-sky-50' },
    amber: { icon: 'text-amber-700', ring: 'ring-amber-200', bg: 'bg-amber-50' },
    rose: { icon: 'text-rose-700', ring: 'ring-rose-200', bg: 'bg-rose-50' }
  };

  const getTone = (tone) => toneMeta[tone] || toneMeta.slate;

  const formatEUR = (value) => {
    const numberValue = Number(value) || 0;
    return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(numberValue);
  };

  const formatDateShort = (value) => {
    if (!value) return '';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '';
    return date.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' });
  };

  const formatDuration = (ms) => {
    const value = Number(ms);
    if (!Number.isFinite(value) || value <= 0) return '—';
    const totalMinutes = Math.round(value / 60000);
    if (totalMinutes < 60) return `${totalMinutes} min`;
    const totalHours = Math.round(totalMinutes / 60);
    if (totalHours < 48) return `${totalHours} h`;
    const days = Math.round(totalHours / 24);
    return `${days} días`;
  };

  const StatCard = ({ item }) => {
    const tone = getTone(item.tone);
    return (
      <Link
        to={item.link}
        className="group relative overflow-hidden rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200"
      >
        <div className="p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="text-sm text-slate-500 truncate">{item.description}</p>
              <div className="mt-2 flex items-baseline gap-2">
                <p className="text-3xl font-semibold text-slate-900 tabular-nums">{(item.count || 0).toLocaleString()}</p>
              </div>
              <p className="mt-1 text-sm font-semibold text-slate-900">{item.title}</p>
            </div>
            <div className={`shrink-0 inline-flex items-center justify-center w-11 h-11 rounded-xl ring-1 ${tone.ring} ${tone.bg}`}>
              <span className={`material-icons text-xl ${tone.icon}`}>{item.icon}</span>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
            <span>Ver detalles</span>
            <span className="material-icons text-base group-hover:translate-x-0.5 transition-transform">chevron_right</span>
          </div>
        </div>
      </Link>
    );
  };

  const layoutVersion = 2;

  const defaultLayout = [
    { id: 'summary', span: 12, height: 260, visible: true },
    { id: 'usersChart', span: 6, height: 340, visible: true },
    { id: 'productsChart', span: 6, height: 340, visible: true },
    { id: 'purchasesChart', span: 12, height: 360, visible: true },
    { id: 'latestSales', span: 6, height: 360, visible: true },
    { id: 'topViewed', span: 6, height: 360, visible: true },
    { id: 'recentReviews', span: 6, height: 360, visible: true },
    { id: 'topSellers', span: 6, height: 360, visible: true },
    { id: 'revenueByCategory', span: 6, height: 340, visible: true },
    { id: 'categoryConversion', span: 6, height: 340, visible: true },
    { id: 'avgSaleTime', span: 4, height: 260, visible: true },
    { id: 'verifiedUsers', span: 4, height: 260, visible: true },
    { id: 'recentReports', span: 4, height: 260, visible: true },
    { id: 'integrations', span: 12, height: 360, visible: true },
    { id: 'pending', span: 12, height: 360, visible: true },
    { id: 'quickActions', span: 12, height: 300, visible: true }
  ];

  const getStorageKey = () => `adminDashboardLayout:v${layoutVersion}:${user?.id || 'anon'}`;

  const normalizeLayout = (rawItems, modulesById) => {
    const incoming = Array.isArray(rawItems) ? rawItems : [];
    const safe = incoming
      .filter(it => it && typeof it.id === 'string' && modulesById[it.id])
      .map(it => ({
        id: it.id,
        span: Math.max(3, Math.min(12, Number(it.span) || 12)),
        height: Math.max(220, Math.min(1200, Number(it.height) || modulesById[it.id]?.defaultHeight || 340)),
        visible: it.visible !== false
      }));

    const existingIds = new Set(safe.map(it => it.id));
    Object.keys(modulesById).forEach((id) => {
      if (!existingIds.has(id)) safe.push({ id, span: modulesById[id].defaultSpan || 12, height: modulesById[id].defaultHeight || 340, visible: false });
    });
    return safe;
  };

  const moveLayoutItem = (id, direction) => {
    setLayoutItems((prev) => {
      const items = [...prev];
      const visibleItems = items.filter(i => i.visible);
      const visibleIndex = visibleItems.findIndex(i => i.id === id);
      if (visibleIndex === -1) return prev;
      const targetIndex = visibleIndex + direction;
      if (targetIndex < 0 || targetIndex >= visibleItems.length) return prev;

      const reorderedVisible = [...visibleItems];
      const [moved] = reorderedVisible.splice(visibleIndex, 1);
      reorderedVisible.splice(targetIndex, 0, moved);

      const visibleMap = new Map(reorderedVisible.map((it, idx) => [it.id, idx]));
      return items
        .map((it) => (it.visible ? it : it))
        .sort((a, b) => {
          const aIndex = a.visible ? visibleMap.get(a.id) : Number.MAX_SAFE_INTEGER;
          const bIndex = b.visible ? visibleMap.get(b.id) : Number.MAX_SAFE_INTEGER;
          return aIndex - bIndex;
        });
    });
  };

  const setItemVisibility = (id, visible) => {
    setLayoutItems((prev) => prev.map(it => it.id === id ? { ...it, visible } : it));
  };

  const startResize = (e, id, axis, meta) => {
    if (!isEditMode) return;
    e.preventDefault();
    e.stopPropagation();

    const gridRect = gridRef.current?.getBoundingClientRect();
    const colWidth = gridRect?.width ? gridRect.width / 12 : 80;

    const pointerId = e.pointerId;
    const startX = e.clientX;
    const startY = e.clientY;
    const startSpan = Number(meta.span) || 12;
    const startHeight = Number(meta.height) || 340;
    const spanMin = Math.max(3, Math.min(12, meta.spanMin ?? 3));
    const spanMax = Math.max(spanMin, Math.min(12, meta.spanMax ?? 12));
    const heightMin = Math.max(220, meta.heightMin ?? 220);
    const heightMax = Math.max(heightMin, meta.heightMax ?? 1200);

    const priorUserSelect = document.body.style.userSelect;
    document.body.style.userSelect = 'none';
    setResizingId(id);

    resizeSessionRef.current = {
      id,
      axis,
      pointerId,
      startX,
      startY,
      startSpan,
      startHeight,
      spanMin,
      spanMax,
      heightMin,
      heightMax,
      colWidth
    };

    const onMove = (ev) => {
      const session = resizeSessionRef.current;
      if (!session || ev.pointerId !== session.pointerId) return;

      const dx = ev.clientX - session.startX;
      const dy = ev.clientY - session.startY;
      const next = {};

      if (session.axis === 'x' || session.axis === 'both') {
        const rawSpan = session.startSpan + dx / session.colWidth;
        const clamped = Math.max(session.spanMin, Math.min(session.spanMax, Math.round(rawSpan)));
        next.span = clamped;
      }

      if (session.axis === 'y' || session.axis === 'both') {
        const rawH = session.startHeight + dy;
        const stepped = Math.round(rawH / 20) * 20;
        const clamped = Math.max(session.heightMin, Math.min(session.heightMax, stepped));
        next.height = clamped;
      }

      if (resizeRafRef.current) return;
      resizeRafRef.current = requestAnimationFrame(() => {
        resizeRafRef.current = null;
        setLayoutItems((prev) => prev.map((it) => {
          if (it.id !== session.id) return it;
          return { ...it, ...next };
        }));
      });
    };

    const onUp = (ev) => {
      const session = resizeSessionRef.current;
      if (!session || ev.pointerId !== session.pointerId) return;
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      resizeSessionRef.current = null;
      if (resizeRafRef.current) {
        cancelAnimationFrame(resizeRafRef.current);
        resizeRafRef.current = null;
      }
      document.body.style.userSelect = priorUserSelect;
      setResizingId(null);
    };

    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
  };

  const reorderByDrag = (dragId, dropId) => {
    setLayoutItems((prev) => {
      const visible = prev.filter(i => i.visible);
      const fromIndex = visible.findIndex(i => i.id === dragId);
      const toIndex = visible.findIndex(i => i.id === dropId);
      if (fromIndex === -1 || toIndex === -1 || fromIndex === toIndex) return prev;
      const nextVisible = [...visible];
      const [moved] = nextVisible.splice(fromIndex, 1);
      nextVisible.splice(toIndex, 0, moved);
      const order = new Map(nextVisible.map((it, idx) => [it.id, idx]));
      return [...prev].sort((a, b) => {
        const aIndex = a.visible ? order.get(a.id) : Number.MAX_SAFE_INTEGER;
        const bIndex = b.visible ? order.get(b.id) : Number.MAX_SAFE_INTEGER;
        return aIndex - bIndex;
      });
    });
  };

  const ModuleFrame = ({ title, icon, onDragStart, onDragEnd, onDrop, children, headerRight, isDraggable }) => {
    return (
      <div
        className={`bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col h-full ${isEditMode ? 'ring-1 ring-slate-200' : ''}`}
        draggable={isDraggable}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onDragOver={(e) => { if (isEditMode) e.preventDefault(); }}
        onDrop={onDrop}
      >
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            {icon && <span className="material-icons text-slate-500 text-base">{icon}</span>}
            <p className="text-sm font-semibold text-slate-900 truncate">{title}</p>
            {isEditMode && (
              <span className="material-icons text-slate-400 text-base">drag_indicator</span>
            )}
          </div>
          <div className="flex items-center gap-2">{headerRight}</div>
        </div>
        <div className="p-5 flex-1 min-h-0">{children}</div>
      </div>
    );
  };

  const modulesById = {
    summary: {
      id: 'summary',
      title: 'Resumen',
      icon: 'dashboard',
      defaultSpan: 12,
      allowedSpans: [12],
      render: () => (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {dashboardItems.map((item) => (
            <StatCard key={item.link} item={item} />
          ))}
        </div>
      )
    },
    usersChart: {
      id: 'usersChart',
      title: 'Usuarios registrados',
      icon: 'person_add',
      defaultSpan: 6,
      allowedSpans: [4, 6, 8, 12],
      render: () => (
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-semibold text-slate-900 tabular-nums">
                {analyticsData.usuariosUltimos15Dias.reduce((sum, day) => sum + day.count, 0)}
              </p>
              <p className="mt-1 text-sm text-slate-500">Últimos {timeRange} días</p>
            </div>
            <span className="text-xs text-slate-400">Actualizado</span>
          </div>
          <div className="mt-4 flex-1 min-h-44 bg-slate-50 rounded-xl p-3">
            <Line data={usuariosChartData} options={lineOptions} />
          </div>
        </div>
      )
    },
    productsChart: {
      id: 'productsChart',
      title: 'Productos publicados',
      icon: 'add_box',
      defaultSpan: 6,
      allowedSpans: [4, 6, 8, 12],
      render: () => (
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-semibold text-slate-900 tabular-nums">
                {analyticsData.productosUltimos15Dias.reduce((sum, day) => sum + day.count, 0)}
              </p>
              <p className="mt-1 text-sm text-slate-500">Últimos {timeRange} días</p>
            </div>
            <span className="text-xs text-slate-400">Actualizado</span>
          </div>
          <div className="mt-4 flex-1 min-h-44 bg-slate-50 rounded-xl p-3">
            <Line data={productosChartData} options={lineOptions} />
          </div>
        </div>
      )
    },
    purchasesChart: {
      id: 'purchasesChart',
      title: 'Compras realizadas',
      icon: 'shopping_cart',
      defaultSpan: 12,
      allowedSpans: [6, 8, 12],
      render: () => (
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-semibold text-slate-900 tabular-nums">
                {businessMetrics.comprasPorDia.reduce((sum, day) => sum + day.count, 0)}
              </p>
              <p className="mt-1 text-sm text-slate-500">Últimos {timeRange} días</p>
            </div>
          </div>
          <div className="mt-4 flex-1 min-h-44 bg-slate-50 rounded-xl p-3">
            <Line data={comprasChartData} options={lineOptions} />
          </div>
        </div>
      )
    },
    latestSales: {
      id: 'latestSales',
      title: 'Ventas recientes',
      icon: 'receipt_long',
      defaultSpan: 6,
      allowedSpans: [4, 6, 8, 12],
      render: () => (
        <div className="space-y-3">
          {analyticsData.latestSales.length === 0 ? (
            <div className="text-sm text-slate-500">Sin ventas en el periodo</div>
          ) : (
            analyticsData.latestSales.map((s) => (
              <div key={s.id} className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3 last:border-b-0 last:pb-0">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-900 truncate">{s.name}</p>
                  <p className="mt-1 text-xs text-slate-500 truncate">
                    {s.categories?.name || 'Sin categoría'} · {s.buyer_name || 'Comprador'} · {formatDateShort(s.sold_date)}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-semibold text-slate-900">{formatEUR(s.sale_price || s.price)}</p>
                </div>
              </div>
            ))
          )}
          <div className="pt-2">
            <Link to="/admin/productos" className="text-sm font-semibold text-slate-900 hover:underline">Ver productos</Link>
          </div>
        </div>
      )
    },
    topViewed: {
      id: 'topViewed',
      title: 'Top vistos',
      icon: 'visibility',
      defaultSpan: 6,
      allowedSpans: [4, 6, 8, 12],
      render: () => (
        <div className="space-y-3">
          {analyticsData.topViewed.length === 0 ? (
            <div className="text-sm text-slate-500">Sin datos</div>
          ) : (
            analyticsData.topViewed.map((p) => (
              <div key={p.id} className="flex items-center justify-between gap-3 border-b border-slate-100 pb-3 last:border-b-0 last:pb-0">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-900 truncate">{p.name}</p>
                  <p className="mt-1 text-xs text-slate-500 truncate">{p.categories?.name || 'Sin categoría'}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-semibold text-slate-900 tabular-nums">{(p.view_count || 0).toLocaleString()}</p>
                  <p className="text-xs text-slate-500">vistas</p>
                </div>
              </div>
            ))
          )}
          <div className="pt-2">
            <Link to="/admin/productos" className="text-sm font-semibold text-slate-900 hover:underline">Ver catálogo</Link>
          </div>
        </div>
      )
    },
    verifiedUsers: {
      id: 'verifiedUsers',
      title: 'Usuarios verificados',
      icon: 'verified',
      defaultSpan: 4,
      allowedSpans: [4, 6, 8, 12],
      render: () => (
        <div>
          <p className="text-4xl font-semibold text-slate-900 tabular-nums">
            {(analyticsData.verifiedUsersCount ?? 0).toLocaleString()}
          </p>
          <p className="mt-2 text-sm text-slate-500">Cuentas con verificación activa</p>
          <div className="mt-4">
            <Link to="/admin/usuarios" className="text-sm font-semibold text-slate-900 hover:underline">Gestionar usuarios</Link>
          </div>
        </div>
      )
    },
    avgSaleTime: {
      id: 'avgSaleTime',
      title: 'Tiempo medio de venta',
      icon: 'schedule',
      defaultSpan: 4,
      allowedSpans: [4, 6, 8, 12],
      render: () => (
        <div>
          <p className="text-4xl font-semibold text-slate-900 tabular-nums">{formatDuration(businessMetrics.tiempoMedioVentaMs)}</p>
          <p className="mt-2 text-sm text-slate-500">Promedio entre publicación y venta</p>
        </div>
      )
    },
    revenueByCategory: {
      id: 'revenueByCategory',
      title: 'Ingresos por categoría',
      icon: 'payments',
      defaultSpan: 6,
      allowedSpans: [4, 6, 8, 12],
      render: () => (
        <div className="space-y-3">
          {businessMetrics.revenuePorCategoria.length === 0 ? (
            <div className="text-sm text-slate-500">Sin datos de ventas</div>
          ) : (
            businessMetrics.revenuePorCategoria.slice(0, 6).map((c) => (
              <div key={c.category} className="flex items-center justify-between gap-3">
                <p className="text-sm text-slate-700 truncate">{c.category}</p>
                <p className="text-sm font-semibold text-slate-900">{formatEUR(c.revenue)}</p>
              </div>
            ))
          )}
        </div>
      )
    },
    categoryConversion: {
      id: 'categoryConversion',
      title: 'Conversión por categoría',
      icon: 'trending_up',
      defaultSpan: 6,
      allowedSpans: [4, 6, 8, 12],
      render: () => (
        <div className="space-y-3">
          {businessMetrics.conversionPorCategoria.length === 0 ? (
            <div className="text-sm text-slate-500">Sin datos de conversión</div>
          ) : (
            businessMetrics.conversionPorCategoria.slice(0, 6).map((c) => (
              <div key={c.category} className="space-y-1">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm text-slate-700 truncate">{c.category}</p>
                  <p className="text-sm font-semibold text-slate-900 tabular-nums">{c.conversion.toFixed(1)}%</p>
                </div>
                <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full bg-slate-900" style={{ width: `${Math.max(0, Math.min(100, c.conversion))}%` }} />
                </div>
                <p className="text-xs text-slate-500 tabular-nums">{c.vendidos} vendidos · {c.publicados} publicados</p>
              </div>
            ))
          )}
        </div>
      )
    },
    recentReviews: {
      id: 'recentReviews',
      title: 'Reseñas recientes',
      icon: 'rate_review',
      defaultSpan: 6,
      allowedSpans: [4, 6, 8, 12],
      render: () => (
        <div className="space-y-3">
          {analyticsData.recentReviews.length === 0 ? (
            <div className="text-sm text-slate-500">Sin reseñas recientes</div>
          ) : (
            analyticsData.recentReviews.map((r) => (
              <div key={r.id} className="border-b border-slate-100 pb-3 last:border-b-0 last:pb-0">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-slate-900 truncate">{r.author_name || 'Anónimo'}</p>
                  <p className="text-xs text-amber-600 tabular-nums">{'★'.repeat(r.rating || 0)}{'☆'.repeat(5 - (r.rating || 0))}</p>
                </div>
                <p className="mt-1 text-xs text-slate-600 line-clamp-2">{r.comment}</p>
                <p className="mt-1 text-xs text-slate-400 truncate">{r.products?.name || 'Producto'} · {formatDateShort(r.created_at)}</p>
              </div>
            ))
          )}
          <div className="pt-2">
            <Link to="/admin/opiniones" className="text-sm font-semibold text-slate-900 hover:underline">Ver opiniones</Link>
          </div>
        </div>
      )
    },
    topSellers: {
      id: 'topSellers',
      title: 'Vendedores top',
      icon: 'emoji_events',
      defaultSpan: 6,
      allowedSpans: [4, 6, 8, 12],
      render: () => (
        <div className="space-y-3">
          {analyticsData.topSellers.length === 0 ? (
            <div className="text-sm text-slate-500">Sin datos</div>
          ) : (
            analyticsData.topSellers.map((s, idx) => (
              <div key={s.id} className="flex items-center justify-between gap-3 border-b border-slate-100 pb-3 last:border-b-0 last:pb-0">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="w-6 h-6 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center text-xs font-semibold tabular-nums">{idx + 1}</span>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-900 truncate">{s.name}</p>
                    <p className="text-xs text-slate-500 tabular-nums">{s.sales} ventas</p>
                  </div>
                </div>
                <p className="text-sm font-semibold text-slate-900">{formatEUR(s.revenue)}</p>
              </div>
            ))
          )}
        </div>
      )
    },
    recentReports: {
      id: 'recentReports',
      title: 'Reportes recientes',
      icon: 'report',
      defaultSpan: 4,
      allowedSpans: [4, 6, 8, 12],
      render: () => (
        <div className="space-y-3">
          {analyticsData.recentReports.length === 0 ? (
            <div className="text-sm text-slate-500">Sin reportes recientes</div>
          ) : (
            analyticsData.recentReports.map((r) => (
              <div key={r.id} className="flex items-center justify-between gap-3 border-b border-slate-100 pb-3 last:border-b-0 last:pb-0">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-900 truncate">{r.status || 'Reporte'}</p>
                  <p className="mt-1 text-xs text-slate-500 truncate">Urgencia: {r.urgency || '—'} · {formatDateShort(r.created_at)}</p>
                </div>
                <span className="material-icons text-slate-400">chevron_right</span>
              </div>
            ))
          )}
          <div className="pt-2">
            <Link to="/admin/reportes" className="text-sm font-semibold text-slate-900 hover:underline">Ver reportes</Link>
          </div>
        </div>
      )
    },
    integrations: {
      id: 'integrations',
      title: 'Integraciones',
      icon: 'extension',
      defaultSpan: 12,
      allowedSpans: [12],
      render: () => (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <Link to="/admin/stripe" className="group rounded-2xl border border-slate-200 bg-slate-50 hover:bg-white hover:shadow-sm transition-all p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm text-slate-500">Stripe</p>
                <p className="mt-1 text-sm font-semibold text-slate-900">Pagos</p>
              </div>
              <span className="material-icons text-violet-700">credit_card</span>
            </div>
            <div className="mt-3 flex items-center gap-2 text-sm text-slate-600">
              <span className={`inline-block w-2 h-2 rounded-full ${platformStats.stripe ? 'bg-emerald-500' : 'bg-slate-300'}`} />
              <span>{platformStats.stripe ? 'Activo' : 'Sin datos'}</span>
            </div>
          </Link>
          <Link to="/admin/supabase" className="group rounded-2xl border border-slate-200 bg-slate-50 hover:bg-white hover:shadow-sm transition-all p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm text-slate-500">Supabase</p>
                <p className="mt-1 text-sm font-semibold text-slate-900">Base de datos</p>
              </div>
              <span className="material-icons text-emerald-700">storage</span>
            </div>
            <div className="mt-3 flex items-center gap-2 text-sm text-slate-600">
              <span className={`inline-block w-2 h-2 rounded-full ${platformStats.supabase ? 'bg-emerald-500' : 'bg-slate-300'}`} />
              <span>{platformStats.supabase ? 'Activo' : 'Sin datos'}</span>
            </div>
          </Link>
          <Link to="/admin/netlify" className="group rounded-2xl border border-slate-200 bg-slate-50 hover:bg-white hover:shadow-sm transition-all p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm text-slate-500">Netlify</p>
                <p className="mt-1 text-sm font-semibold text-slate-900">Deploy</p>
              </div>
              <span className="material-icons text-sky-700">cloud</span>
            </div>
            <div className="mt-3 flex items-center gap-2 text-sm text-slate-600">
              <span className={`inline-block w-2 h-2 rounded-full ${platformStats.netlify ? 'bg-emerald-500' : 'bg-slate-300'}`} />
              <span>{platformStats.netlify ? 'Activo' : 'Sin datos'}</span>
            </div>
          </Link>
        </div>
      )
    },
    pending: {
      id: 'pending',
      title: 'Atención requerida',
      icon: 'pending_actions',
      defaultSpan: 12,
      allowedSpans: [12],
      render: () => (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {pendingItems.map((item) => (
            <Link key={item.link} to={item.link} className="group rounded-2xl border border-slate-200 bg-slate-50 hover:bg-white hover:shadow-sm transition-all p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm text-slate-500">{item.description}</p>
                  <p className="mt-2 text-2xl font-semibold text-slate-900 tabular-nums">{(item.count || 0).toLocaleString()}</p>
                  <p className="mt-1 text-sm font-semibold text-slate-900">{item.title}</p>
                </div>
                <span className="material-icons text-amber-700">priority_high</span>
              </div>
            </Link>
          ))}
        </div>
      )
    },
    quickActions: {
      id: 'quickActions',
      title: 'Acciones rápidas',
      icon: 'bolt',
      defaultSpan: 12,
      allowedSpans: [12],
      render: () => (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <Link to="/admin/productos/agregar" className="group rounded-2xl border border-slate-200 bg-slate-50 hover:bg-white hover:shadow-sm transition-all p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="material-icons text-blue-700">add_circle</span>
                <span className="text-sm font-semibold text-slate-900">Nuevo producto</span>
              </div>
              <span className="material-icons text-slate-400 group-hover:text-slate-600 transition-colors">arrow_forward</span>
            </div>
          </Link>
          <Link to="/admin/categorias/agregar" className="group rounded-2xl border border-slate-200 bg-slate-50 hover:bg-white hover:shadow-sm transition-all p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="material-icons text-emerald-700">add_circle</span>
                <span className="text-sm font-semibold text-slate-900">Nueva categoría</span>
              </div>
              <span className="material-icons text-slate-400 group-hover:text-slate-600 transition-colors">arrow_forward</span>
            </div>
          </Link>
          <Link to="/admin/usuarios" className="group rounded-2xl border border-slate-200 bg-slate-50 hover:bg-white hover:shadow-sm transition-all p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="material-icons text-violet-700">manage_accounts</span>
                <span className="text-sm font-semibold text-slate-900">Gestionar usuarios</span>
              </div>
              <span className="material-icons text-slate-400 group-hover:text-slate-600 transition-colors">arrow_forward</span>
            </div>
          </Link>
          <Link to="/admin/reportes" className="group rounded-2xl border border-slate-200 bg-slate-50 hover:bg-white hover:shadow-sm transition-all p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="material-icons text-rose-700">assessment</span>
                <span className="text-sm font-semibold text-slate-900">Ver reportes</span>
              </div>
              <span className="material-icons text-slate-400 group-hover:text-slate-600 transition-colors">arrow_forward</span>
            </div>
          </Link>
        </div>
      )
    }
  };

  const moduleMetaById = Object.fromEntries(Object.entries(modulesById).map(([id, m]) => {
    const fallback = defaultLayout.find(d => d.id === id);
    return [id, { defaultSpan: m.defaultSpan, defaultHeight: fallback?.height || 340 }];
  }));

  const effectiveLayoutItems = layoutLoaded ? layoutItems : defaultLayout;

  useEffect(() => {
    const key = getStorageKey();
    try {
      const raw = localStorage.getItem(key);
      if (raw) {
        const parsed = JSON.parse(raw);
        const normalized = normalizeLayout(parsed?.items, moduleMetaById);
        setLayoutItems(normalized);
      } else {
        setLayoutItems(normalizeLayout(defaultLayout, moduleMetaById));
      }
    } catch {
      setLayoutItems(normalizeLayout(defaultLayout, moduleMetaById));
    } finally {
      setLayoutLoaded(true);
    }
  }, [user?.id]);

  useEffect(() => {
    if (!layoutLoaded) return;
    const key = getStorageKey();
    localStorage.setItem(key, JSON.stringify({ version: layoutVersion, items: layoutItems }));
  }, [layoutItems, layoutLoaded, user?.id]);

  if (loading) {
    return (
      <AdminLayout 
        title="Panel de Administración" 
        subtitle="Gestiona tu plataforma desde aquí"
        headerActions={(
          <div className="flex items-center gap-3">
            <div className="relative">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="appearance-none w-44 px-4 py-2 pr-9 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 bg-white shadow-sm text-slate-900"
                aria-label="Seleccionar rango de tiempo"
              >
                <option value="7">Últimos 7 días</option>
                <option value="15">Últimos 15 días</option>
                <option value="30">Últimos 30 días</option>
                <option value="90">Últimos 90 días</option>
              </select>
              <span className="material-icons absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-base">expand_more</span>
            </div>
          </div>
        )}
      >
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
            <div className="text-xl text-gray-600">Cargando estadísticas...</div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout 
      title="Panel de Administración" 
      subtitle="Gestiona tu plataforma desde aquí"
      headerActions={(
        <div className="flex flex-col xl:flex-row xl:items-center gap-3">
          <div className="relative">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="appearance-none w-full xl:w-44 px-4 py-2 pr-9 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 bg-white shadow-sm text-slate-900"
              aria-label="Seleccionar rango de tiempo"
            >
              <option value="7">Últimos 7 días</option>
              <option value="15">Últimos 15 días</option>
              <option value="30">Últimos 30 días</option>
              <option value="90">Últimos 90 días</option>
            </select>
            <span className="material-icons absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-base">expand_more</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={openAnnouncementModal}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-slate-900 text-white hover:bg-slate-800 shadow-sm"
            >
              <span className="material-icons text-base">campaign</span>
              Enviar anuncio
            </button>

            <button
              type="button"
              onClick={() => setIsEditMode(v => !v)}
              className={`inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl border shadow-sm ${isEditMode ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-900 border-slate-300 hover:bg-slate-50'}`}
            >
              <span className="material-icons text-base">{isEditMode ? 'check_circle' : 'tune'}</span>
              {isEditMode ? 'Listo' : 'Personalizar'}
            </button>

            {isEditMode && (
              <>
                <button
                  type="button"
                  onClick={() => setShowModuleManager(true)}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-900 shadow-sm"
                >
                  <span className="material-icons text-base">view_quilt</span>
                  Módulos
                </button>
                <button
                  type="button"
                  onClick={() => setLayoutItems(normalizeLayout(defaultLayout, moduleMetaById))}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-900 shadow-sm"
                >
                  <span className="material-icons text-base">restart_alt</span>
                  Restablecer
                </button>
              </>
            )}
          </div>
        </div>
      )}
    >
      <div className="space-y-4">
        {isEditMode && (
          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-5">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-slate-900">Modo personalización</p>
                <p className="mt-1 text-sm text-slate-500">Arrastra módulos para reordenar, cambia el tamaño o escóndelos.</p>
              </div>
              <button
                type="button"
                onClick={() => setShowModuleManager(true)}
                className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-900 shadow-sm"
              >
                <span className="material-icons text-base">add</span>
                Añadir o quitar módulos
              </button>
            </div>
          </div>
        )}

        <div ref={gridRef} className="grid grid-cols-12 gap-4">
          {effectiveLayoutItems.filter(it => it.visible).map((it) => {
            const module = modulesById[it.id];
            if (!module) return null;
            const allowedSpans = module.allowedSpans || [4, 6, 8, 12];
            const currentSpan = allowedSpans.includes(it.span) ? it.span : (module.defaultSpan || 12);
            const currentHeight = Math.max(220, Math.min(1200, Number(it.height) || defaultLayout.find(d => d.id === it.id)?.height || 340));
            const spanMin = Math.max(3, Math.min(12, Math.min(...allowedSpans)));
            const spanMax = Math.max(spanMin, Math.min(12, Math.max(...allowedSpans)));
            const headerRight = isEditMode ? (
              <>
                <span className="hidden xl:inline-flex items-center h-9 px-3 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-600 tabular-nums">
                  {currentSpan}/12 · {currentHeight}px
                </span>
                <button type="button" onClick={() => moveLayoutItem(it.id, -1)} className="h-9 w-9 inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white hover:bg-slate-50" aria-label="Mover arriba">
                  <span className="material-icons text-base text-slate-700">arrow_upward</span>
                </button>
                <button type="button" onClick={() => moveLayoutItem(it.id, 1)} className="h-9 w-9 inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white hover:bg-slate-50" aria-label="Mover abajo">
                  <span className="material-icons text-base text-slate-700">arrow_downward</span>
                </button>
                <button type="button" onClick={() => setItemVisibility(it.id, false)} className="h-9 w-9 inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white hover:bg-slate-50" aria-label="Ocultar módulo">
                  <span className="material-icons text-base text-slate-700">close</span>
                </button>
              </>
            ) : null;

            return (
              <div
                key={it.id}
                className={`col-span-12 lg:[grid-column:span_var(--span)_/_span_var(--span)] relative ${draggingId === it.id ? 'opacity-70' : ''}`}
                style={{ '--span': currentSpan, height: currentHeight }}
              >
                <ModuleFrame
                  title={module.title}
                  icon={module.icon}
                  isDraggable={isEditMode && resizingId == null}
                  onDragStart={(e) => {
                    if (!isEditMode) return;
                    if (resizingId != null) return;
                    setDraggingId(it.id);
                    e.dataTransfer.setData('text/plain', it.id);
                    e.dataTransfer.effectAllowed = 'move';
                  }}
                  onDragEnd={() => setDraggingId(null)}
                  onDrop={(e) => {
                    if (!isEditMode) return;
                    e.preventDefault();
                    const dragId = e.dataTransfer.getData('text/plain');
                    if (!dragId) return;
                    reorderByDrag(dragId, it.id);
                  }}
                  headerRight={headerRight}
                >
                  {module.render()}
                </ModuleFrame>

                {isEditMode && spanMin !== spanMax && (
                  <div
                    role="presentation"
                    draggable={false}
                    onPointerDown={(e) => startResize(e, it.id, 'x', { span: currentSpan, height: currentHeight, spanMin, spanMax })}
                    className="absolute top-0 right-0 h-full w-2 cursor-ew-resize"
                  />
                )}
                {isEditMode && (
                  <div
                    role="presentation"
                    draggable={false}
                    onPointerDown={(e) => startResize(e, it.id, 'y', { span: currentSpan, height: currentHeight, spanMin, spanMax })}
                    className="absolute bottom-0 left-0 w-full h-2 cursor-ns-resize"
                  />
                )}
                {isEditMode && spanMin !== spanMax && (
                  <div
                    role="presentation"
                    draggable={false}
                    onPointerDown={(e) => startResize(e, it.id, 'both', { span: currentSpan, height: currentHeight, spanMin, spanMax })}
                    className="absolute bottom-0 right-0 w-4 h-4 cursor-nwse-resize"
                  />
                )}
              </div>
            );
          })}
        </div>

        {showModuleManager && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
            <div className="bg-white w-full max-w-3xl rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200">
                <h3 className="text-sm font-semibold text-slate-900">Módulos del dashboard</h3>
                <button type="button" onClick={() => setShowModuleManager(false)} className="p-2 rounded-xl hover:bg-slate-100" aria-label="Cerrar">
                  <span className="material-icons text-slate-600">close</span>
                </button>
              </div>

              <div className="px-5 py-5 space-y-3 max-h-[70vh] overflow-y-auto">
                {Object.values(modulesById).map((m) => {
                  const current = effectiveLayoutItems.find(i => i.id === m.id) || { visible: false };
                  return (
                    <label key={m.id} className="flex items-center justify-between gap-3 border border-slate-200 rounded-2xl p-4 hover:bg-slate-50">
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="material-icons text-slate-500 text-base">{m.icon}</span>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-slate-900 truncate">{m.title}</p>
                          <p className="text-xs text-slate-500 truncate">{m.id}</p>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={current.visible !== false}
                        onChange={(e) => setItemVisibility(m.id, e.target.checked)}
                      />
                    </label>
                  );
                })}
              </div>

              <div className="flex items-center justify-end gap-3 px-5 py-4 border-t border-slate-200 bg-slate-50">
                <button
                  type="button"
                  onClick={() => setLayoutItems(normalizeLayout(defaultLayout, moduleMetaById))}
                  className="px-4 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-900"
                >
                  Restablecer
                </button>
                <button
                  type="button"
                  onClick={() => setShowModuleManager(false)}
                  className="px-4 py-2 rounded-xl bg-slate-900 text-white hover:bg-slate-800"
                >
                  Listo
                </button>
              </div>
            </div>
          </div>
        )}

        {showAnnouncementModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
            <div className="bg-white w-full max-w-3xl rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200">
                <h3 className="text-sm font-semibold text-slate-900">Enviar anuncio por email</h3>
                <button type="button" onClick={closeAnnouncementModal} className="p-2 rounded-xl hover:bg-slate-100" aria-label="Cerrar">
                  <span className="material-icons text-slate-600">close</span>
                </button>
              </div>

              <div className="px-5 py-5 space-y-4 max-h-[70vh] overflow-y-auto">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Asunto</label>
                  <input
                    value={announcementSubject}
                    onChange={(e) => setAnnouncementSubject(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 bg-white"
                    placeholder="Ej. Promoción especial Resmoke"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Mensaje</label>
                  <textarea
                    value={announcementMessage}
                    onChange={(e) => setAnnouncementMessage(e.target.value)}
                    rows={6}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 bg-white"
                    placeholder="Contenido del anuncio"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Destinatarios (manual)</label>
                  <textarea
                    value={manualEmailsInput}
                    onChange={(e) => setManualEmailsInput(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 bg-white"
                    placeholder="Correos separados por coma o salto de línea"
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Seleccionar usuarios</label>
                    {loadingUsers && <span className="text-sm text-slate-500">Cargando usuarios...</span>}
                  </div>
                  <div className="max-h-64 overflow-y-auto border border-slate-200 rounded-xl">
                    {usersList.map((u) => (
                      <label key={u.id} className="flex items-center justify-between px-3 py-2 border-b border-slate-100 last:border-b-0">
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-slate-900 truncate">{u.nombre || 'Sin nombre'}</p>
                          <p className="text-xs text-slate-600 truncate">{u.email}</p>
                        </div>
                        <input type="checkbox" checked={selectedEmails.includes(u.email)} onChange={() => toggleEmailSelection(u.email)} />
                      </label>
                    ))}
                    {usersList.length === 0 && !loadingUsers && (
                      <div className="px-3 py-4 text-sm text-slate-500">No hay usuarios con email disponible</div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 px-5 py-4 border-t border-slate-200 bg-slate-50">
                <button type="button" onClick={closeAnnouncementModal} className="px-4 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-900">
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={sendAnnouncement}
                  disabled={sendingAnnouncement}
                  className="px-4 py-2 rounded-xl bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-50"
                >
                  {sendingAnnouncement ? 'Enviando...' : 'Enviar'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
