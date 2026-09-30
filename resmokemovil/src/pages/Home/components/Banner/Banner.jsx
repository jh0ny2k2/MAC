import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAnalytics from '../../../../hooks/useAnalytics';

const Banner = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const { trackSearch } = useAnalytics();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      trackSearch(searchTerm.trim());
      navigate(`/productos?search=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  return (
    <section className="bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center py-24 sm:py-32 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 tracking-tight max-w-3xl">
            Encuentra lo que necesitas
          </h1>
          <p className="mt-4 text-base sm:text-lg text-gray-500 max-w-lg">
            Compra y vende productos de cachimba de segunda mano de forma segura y sencilla.
          </p>

          <form onSubmit={handleSearch} className="w-full max-w-xl mt-8">
            <div className="relative">
              <input
                type="text"
                id="buscador"
                name="buscador"
                placeholder="Buscar productos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                aria-label="Buscar productos"
                className="w-full h-12 pl-5 pr-36 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-200 transition-all duration-200 text-sm"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-2">
                <button
                  type="submit"
                  className="h-9 px-5 bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-lg text-sm transition-all duration-200"
                >
                  Buscar
                </button>
              </div>
            </div>
          </form>

          <div className="flex items-center gap-6 mt-10">
            <div className="text-center">
              <p className="text-xl font-bold text-gray-900">+500</p>
              <p className="text-xs text-gray-500">Productos</p>
            </div>
            <div className="w-px h-8 bg-gray-200" />
            <div className="text-center">
              <p className="text-xl font-bold text-gray-900">+200</p>
              <p className="text-xs text-gray-500">Usuarios</p>
            </div>
            <div className="w-px h-8 bg-gray-200" />
            <div className="text-center">
              <p className="text-xl font-bold text-gray-900">+50</p>
              <p className="text-xs text-gray-500">Ventas</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Banner;
