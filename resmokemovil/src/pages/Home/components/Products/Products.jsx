import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../../../lib/supabase';
import ProductCard from './ProductCard';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      const { data: promotedProducts, error: promotedError } = await supabase
        .from('products')
        .select('*, categories (id, name)')
        .eq('status', 'available')
        .eq('promoted', 'YES')
        .order('created_at', { ascending: false });

      if (promotedError) {
        console.error('Error al obtener productos promocionados:', promotedError);
        return;
      }

      const promotedCount = promotedProducts?.length || 0;
      const remainingSlots = 6 - promotedCount;

      let regularProducts = [];

      if (remainingSlots > 0) {
        const { data: regularData, error: regularError } = await supabase
          .from('products')
          .select('*, categories (id, name)')
          .eq('status', 'available')
          .eq('promoted', 'NO')
          .limit(remainingSlots)
          .order('created_at', { ascending: false });

        if (regularError) {
          console.error('Error al obtener productos regulares:', regularError);
          return;
        }

        regularProducts = regularData || [];
      }

      const allProducts = [...(promotedProducts || []), ...regularProducts];
      setProducts(allProducts.slice(0, 6));
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  if (loading) {
    return (
      <section className="py-20 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <div className="h-8 w-48 bg-gray-200 rounded-full mx-auto animate-pulse" />
            <div className="h-4 w-72 bg-gray-100 rounded-full mx-auto mt-3 animate-pulse" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-2xl bg-white border border-gray-100 overflow-hidden">
                <div className="aspect-[4/3] bg-gray-100 animate-pulse" />
                <div className="p-5 space-y-3">
                  <div className="h-3 w-20 bg-gray-100 rounded-full animate-pulse" />
                  <div className="h-5 w-3/4 bg-gray-100 rounded animate-pulse" />
                  <div className="h-3 w-full bg-gray-50 rounded animate-pulse" />
                  <div className="flex justify-between items-center pt-2">
                    <div className="h-4 w-16 bg-gray-100 rounded animate-pulse" />
                    <div className="h-4 w-24 bg-gray-100 rounded animate-pulse" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-14">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
              Productos destacados
            </h2>
            <p className="text-gray-500 mt-2 text-lg">
              Los mejores productos de nuestra comunidad
            </p>
          </div>
          {products.length > 0 && (
            <Link
              to="/productos"
              className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 border border-gray-300 text-gray-700 hover:border-gray-900 hover:text-gray-900 rounded-xl text-sm font-medium transition-all duration-200"
            >
              Ver todos
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          )}
        </div>

        {products.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((producto) => (
              <ProductCard key={producto.id} producto={producto} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-gray-100 flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No hay productos disponibles</h3>
            <p className="text-gray-500 mb-6">Sé el primero en agregar un producto</p>
            <Link
              to="/add-product"
              className="inline-flex items-center px-5 py-2.5 bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium rounded-xl transition-all duration-200"
            >
              <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Agregar producto
            </Link>
          </div>
        )}

        {products.length > 0 && (
          <div className="text-center mt-12 sm:hidden">
            <Link
              to="/productos"
              className="inline-flex items-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 hover:border-gray-900 hover:text-gray-900 rounded-xl text-sm font-medium transition-all duration-200"
            >
              Ver todos los productos
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default Products;
