import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useSubscription } from '../../hooks/useSubscription';
import { supabase } from '../../lib/supabase';
import Header from '../../components/Layout/HeaderProducts';
import Footer from '../../components/Layout/Footer';

const PromotionsPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isPremium, loading: subscriptionLoading } = useSubscription();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [promotingProduct, setPromotingProduct] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    if (!subscriptionLoading && !isPremium) {
      navigate('/subscription-plans');
      return;
    }

    if (isPremium) {
      fetchUserProducts();
    }
  }, [user, isPremium, subscriptionLoading, navigate]);

  const fetchUserProducts = async () => {
    try {
      setLoading(true);
      
      // Primero obtenemos el usuario de la tabla Users
      const { data: userData, error: userError } = await supabase
        .from('Users')
        .select('id')
        .eq('email', user.email)
        .single();

      if (userError) throw userError;

      // Luego obtenemos los productos del usuario que NO están promocionados
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          categories (id, name)
        `)
        .eq('user_id', userData.id)
        .eq('status', 'available')
        .eq('promoted', 'NO')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching user products:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const promoteProduct = async (productId) => {
    try {
      setPromotingProduct(productId);
      
      const { error } = await supabase
        .from('products')
        .update({ promoted: 'YES' })
        .eq('id', productId);

      if (error) throw error;

      // Actualizar la lista de productos
      setProducts(products.filter(product => product.id !== productId));
      
      alert('¡Producto promocionado exitosamente!');
    } catch (error) {
      console.error('Error promoting product:', error);
      alert('Error al promocionar el producto. Inténtalo de nuevo.');
    } finally {
      setPromotingProduct(null);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(price);
  };

  if (subscriptionLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen mt-13 sm:mt-1 bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 border border-purple-200 mb-4">
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732L14.146 12.8l-1.179 4.456a1 1 0 01-1.934 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732L9.854 7.2l1.179-4.456A1 1 0 0112 2z" clipRule="evenodd" />
              </svg>
              Promocionar Productos
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Promociona tus Productos
            </h1>
            <p className="text-xl text-gray-600">
              Selecciona los productos que quieres promocionar para aumentar su visibilidad
            </p>
          </div>

          {/* Products Grid */}
          {products.length === 0 ? (
            <div className="text-center py-12">
              <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No tienes productos sin promocionar</h3>
              <p className="text-gray-600 mb-6">Todos tus productos ya están promocionados o no tienes productos aún.</p>
              <button
                onClick={() => navigate('/add-product')}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              >
                Agregar Producto
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-w-16 aspect-h-9">
                    <img
                      src={product.images?.[0] || '/img/resmoke/default-product.jpg'}
                      alt={product.name}
                      className="w-full h-48 object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{product.name}</h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-2xl font-bold text-purple-600">
                        {formatPrice(product.price)}
                      </span>
                      <span className="text-sm text-gray-500">
                        Stock: {product.stock}
                      </span>
                    </div>
                    <button
                      onClick={() => promoteProduct(product.id)}
                      disabled={promotingProduct === product.id}
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-2 px-4 rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {promotingProduct === product.id ? (
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Promocionando...
                        </div>
                      ) : (
                        'Promocionar Producto'
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default PromotionsPage;