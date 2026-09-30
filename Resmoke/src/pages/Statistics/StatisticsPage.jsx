import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, LineElement, PointElement } from 'chart.js';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import Header from '../../components/Layout/HeaderProducts';
import Footer from '../../components/Layout/Footer';

// Registrar componentes de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  LineElement,
  PointElement
);

const StatisticsPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState(null);
  const [statistics, setStatistics] = useState({
    totalProducts: 0,
    totalViews: 0,
    totalSales: 0,
    totalRevenue: 0,
    averageRating: 0,
    totalReviews: 0,
    totalFavorites: 0,
    productsAvailable: 0,
    productsSold: 0,
    productsReserved: 0,
    averagePrice: 0,
    averageSalePrice: 0
  });

  const [dailyProducts, setDailyProducts] = useState([]);
  const [dailySales, setDailySales] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [topProducts, setTopProducts] = useState([]);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchUserProfile();
  }, [user, navigate]);

  useEffect(() => {
    if (userProfile) {
      fetchStatistics();
    }
  }, [userProfile]);

  const fetchUserProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('Users')
        .select('*')
        .eq('email', user.email)
        .single();

      if (error) throw error;
      setUserProfile(data);
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const fetchStatistics = async () => {
    try {
      setLoading(true);
      
      // Obtener productos del usuario
      const { data: products, error: productsError } = await supabase
        .from('products')
        .select(`
          *,
          categories (id, name)
        `)
        .eq('user_id', userProfile.id);

      if (productsError) throw productsError;

      // Calcular estadísticas básicas usando los campos reales
      const totalProducts = products?.length || 0;
      const totalViews = products?.reduce((sum, product) => sum + (product.view_count || 0), 0) || 0;
      const totalFavorites = products?.reduce((sum, product) => sum + (product.favorite_count || 0), 0) || 0;
      
      // Productos por estado
      const availableProducts = products?.filter(product => product.status === 'available') || [];
      const soldProducts = products?.filter(product => product.status === 'sold' || product.sold_date) || [];
      const reservedProducts = products?.filter(product => product.reserved_by) || [];
      
      const totalSales = soldProducts.length;
      const productsAvailable = availableProducts.length;
      const productsReserved = reservedProducts.length;
      
      // Calcular ingresos usando sale_price cuando esté disponible, sino price
      const totalRevenue = soldProducts.reduce((sum, product) => {
        const salePrice = product.sale_price || product.price || 0;
        return sum + salePrice;
      }, 0);
      
      // Calcular precios promedio
      const averagePrice = totalProducts > 0 
        ? products.reduce((sum, product) => sum + (product.price || 0), 0) / totalProducts 
        : 0;
      
      const averageSalePrice = soldProducts.length > 0 
        ? soldProducts.reduce((sum, product) => sum + (product.sale_price || product.price || 0), 0) / soldProducts.length 
        : 0;

      // Obtener reseñas del usuario como vendedor
      const { data: reviews, error: reviewsError } = await supabase
        .from('reviews')
        .select('rating, created_at')
        .eq('seller_id', userProfile.id);

      if (reviewsError) throw reviewsError;

      const totalReviews = reviews?.length || 0;
      const averageRating = totalReviews > 0 
        ? reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews 
        : 0;

      // Generar datos para gráficas de los últimos 30 días
      const dailyProductsData = generateMonthlyData(products);
      const dailySalesData = generateMonthlySalesData(products);
      const categoryDistribution = generateCategoryData(products);
      const topProductsData = products
        ?.sort((a, b) => (b.view_count || 0) - (a.view_count || 0))
        .slice(0, 5)
        .map(product => ({
          id: product.id,
          name: product.name,
          views: product.view_count || 0,
          favorites: product.favorite_count || 0,
          sales: product.status === 'sold' || product.sold_date ? 1 : 0,
          revenue: product.status === 'sold' || product.sold_date ? (product.sale_price || product.price || 0) : 0
        })) || [];

      setStatistics({
        totalProducts,
        totalViews,
        totalSales,
        totalRevenue,
        averageRating: Math.round(averageRating * 10) / 10,
        totalReviews,
        totalFavorites,
        productsAvailable,
        productsSold: totalSales,
        productsReserved,
        averagePrice: Math.round(averagePrice * 100) / 100,
        averageSalePrice: Math.round(averageSalePrice * 100) / 100
      });
      
      setDailyProducts(dailyProductsData);
      setDailySales(dailySalesData);
      setCategoryData(categoryDistribution);
      setTopProducts(topProductsData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching statistics:', error);
      setLoading(false);
    }
  };

  const generateMonthlyData = (products) => {
    const currentDate = new Date();
    const dailyData = [];
    
    // Generar datos para los últimos 30 días
    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(currentDate.getDate() - i);
      
      const dayLabel = `${date.getDate()}/${date.getMonth() + 1}`;
      
      // Contar productos subidos en este día
      const productsCount = products?.filter(product => {
        const productDate = new Date(product.created_at);
        return productDate.toDateString() === date.toDateString();
      }).length || 0;

      dailyData.push({ 
        day: dayLabel, 
        products: productsCount,
        fullDate: date.toISOString().split('T')[0] // Para tooltip
      });
    }

    return dailyData;
  };

  const generateMonthlySalesData = (products) => {
    const currentDate = new Date();
    const dailyData = [];
    
    // Generar datos para los últimos 30 días
    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(currentDate.getDate() - i);
      
      const dayLabel = `${date.getDate()}/${date.getMonth() + 1}`;
      
      // Contar productos vendidos en este día (usando sold_date)
      const salesCount = products?.filter(product => {
        if (!product.sold_date) return false;
        const soldDate = new Date(product.sold_date);
        return soldDate.toDateString() === date.toDateString();
      }).length || 0;

      dailyData.push({ 
        day: dayLabel, 
        sales: salesCount,
        fullDate: date.toISOString().split('T')[0] // Para tooltip
      });
    }

    return dailyData;
  };

  const generateCategoryData = (products) => {
    if (!products || products.length === 0) return [];

    const categoryCount = {};
    products.forEach(product => {
      const categoryName = product.categories?.name || 'Sin categoría';
      categoryCount[categoryName] = (categoryCount[categoryName] || 0) + 1;
    });

    const totalProducts = products.length;
    return Object.entries(categoryCount)
      .map(([category, count]) => ({
        category,
        count,
        percentage: Math.round((count / totalProducts) * 100 * 10) / 10
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  };

  // Configuración de gráficas
  const lineChartData = {
    labels: dailyProducts.map(item => item.day),
    datasets: [
      {
        label: 'Productos subidos por día',
        data: dailyProducts.map(item => item.products),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true,
      },
      {
        label: 'Productos vendidos por día',
        data: dailySales.map(item => item.sales),
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const barChartData = {
    labels: categoryData.map(item => item.category),
    datasets: [
      {
        label: 'Productos por categoría',
        data: categoryData.map(item => item.count),
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(139, 92, 246, 0.8)',
        ],
        borderColor: [
          'rgb(59, 130, 246)',
          'rgb(16, 185, 129)',
          'rgb(245, 158, 11)',
          'rgb(239, 68, 68)',
          'rgb(139, 92, 246)',
        ],
        borderWidth: 2,
      },
    ],
  };

  const doughnutData = {
    labels: ['Disponibles', 'Vendidos', 'Reservados'],
    datasets: [
      {
        data: [
          statistics.productsAvailable,
          statistics.productsSold,
          statistics.productsReserved
        ],
        backgroundColor: [
          'rgba(16, 185, 129, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(251, 146, 60, 0.8)',
        ],
        borderColor: [
          'rgb(16, 185, 129)',
          'rgb(59, 130, 246)',
          'rgb(251, 146, 60)',
        ],
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: false,
      },
      tooltip: {
        callbacks: {
          title: function(context) {
            const index = context[0].dataIndex;
            return dailyProducts[index]?.fullDate || '';
          },
          label: function(context) {
            return `Productos subidos: ${context.parsed.y}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
      x: {
        ticks: {
          maxTicksLimit: 10,
        },
      },
    },
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50/60">
        <Header />
        <div className="flex justify-center items-center h-64">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 rounded-full border-2 border-gray-200 border-t-gray-900 animate-spin" />
            <p className="text-sm text-gray-400 font-medium tracking-wide">Cargando estadísticas...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/60">
      <Header />

      {/* ── Hero Banner ── */}
      <div className="relative">
        <div className="h-40 sm:h-48 bg-gradient-to-br from-gray-100 via-gray-50 to-gray-200 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-white/40 to-transparent" />
          <div className="absolute top-0 right-0 w-80 h-80 bg-gray-200/30 rounded-full -translate-y-1/2 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-gray-200/30 rounded-full translate-y-1/3 -translate-x-1/4" />
        </div>
        <div className="absolute inset-0 flex items-end">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pb-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">Estadísticas</h1>
                <p className="text-sm text-gray-500 mt-1">Analiza el rendimiento de tus productos y ventas</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ── Metric cards ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
            <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Total Productos</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{statistics.totalProducts}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
            <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Total Visitas</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{statistics.totalViews.toLocaleString()}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
            <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Vendidos</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{statistics.totalSales}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
            <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Ingresos</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">${statistics.totalRevenue.toLocaleString()}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
            <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Rating</p>
            <div className="flex items-center gap-1.5 mt-1">
              <p className="text-2xl font-bold text-gray-900">{statistics.averageRating}</p>
              <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
            <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Favoritos</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{statistics.totalFavorites}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
            <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Disponibles</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{statistics.productsAvailable}</p>
            {statistics.productsReserved > 0 && (
              <p className="text-xs text-amber-600 mt-0.5">+{statistics.productsReserved} reservados</p>
            )}
          </div>
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
            <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Precio Promedio</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">${statistics.averagePrice}</p>
            {statistics.averageSalePrice > 0 && (
              <p className="text-xs text-green-600 mt-0.5">Venta: ${statistics.averageSalePrice}</p>
            )}
          </div>
        </div>

        {/* ── Charts ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-8">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-6">Productos Subidos y Vendidos por Día (Últimos 30 días)</h3>
            <div className="h-80">
              <Line data={lineChartData} options={chartOptions} />
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-6">Productos por Categoría</h3>
            <div className="h-80">
              <Bar data={barChartData} options={chartOptions} />
            </div>
          </div>
        </div>

        {/* ── Bottom row ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-6">Estado de Productos</h3>
            <div className="h-64">
              <Doughnut data={doughnutData} options={{ responsive: true, maintainAspectRatio: false }} />
            </div>
          </div>
          <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-6">Productos Más Visitados</h3>
            <div className="space-y-3">
              {topProducts.length > 0 ? (
                topProducts.map((product, index) => (
                  <div key={product.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 bg-gray-900 rounded-full flex items-center justify-center">
                        <span className="text-xs font-bold text-white">#{index + 1}</span>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{product.name}</p>
                        <p className="text-xs text-gray-400">${product.revenue > 0 ? `Vendido por $${product.revenue}` : `Precio: $${product.price || 0}`}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <p className="text-sm font-bold text-gray-900">{product.views}</p>
                        <p className="text-[10px] text-gray-400">visitas</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-bold text-red-500">{product.favorites}</p>
                        <p className="text-[10px] text-gray-400">favs</p>
                      </div>
                      {product.sales > 0 && (
                        <div className="text-center">
                          <p className="text-sm font-bold text-green-600">✓</p>
                          <p className="text-[10px] text-gray-400">vendido</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-sm text-gray-400">No hay productos para mostrar</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default StatisticsPage;