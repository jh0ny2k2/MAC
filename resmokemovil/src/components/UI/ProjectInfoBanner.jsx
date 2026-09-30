import React from 'react';
import { Link } from 'react-router-dom';

const ProjectInfoBanner = ({ className = '' }) => {
  return (
    <div className={`bg-gradient-to-r from-indigo-50 via-blue-50 to-cyan-50 border border-blue-100 rounded-2xl p-6 sm:p-8 shadow-sm ${className}`}>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="max-w-2xl">
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900">Resmoke: Marketplace sostenible de cachimba</h3>
          <p className="mt-2 text-sm sm:text-base text-gray-700">
            Compra y vende de forma segura, reduce el desperdicio y únete a una comunidad activa de aficionados.
          </p>
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0-1.657-1.343-3-3-3S6 9.343 6 11s1.343 3 3 3 3-1.343 3-3z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 7v-.5a4.5 4.5 0 119 0V7m-9 10v.5a4.5 4.5 0 10-9 0V17" />
                </svg>
              </div>
              <div>
                <div className="text-sm font-semibold text-gray-900">Seguridad</div>
                <div className="text-xs text-gray-600">Protección y verificación en las transacciones.</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-green-100 flex items-center justify-center">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <div className="text-sm font-semibold text-gray-900">Sostenibilidad</div>
                <div className="text-xs text-gray-600">Fomenta la reutilización y economía circular.</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-purple-100 flex items-center justify-center">
                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <div className="text-sm font-semibold text-gray-900">Comunidad</div>
                <div className="text-xs text-gray-600">Usuarios activos y soporte colaborativo.</div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link to="/como-comprar" className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
            Cómo comprar
          </Link>
          <Link to="/metodos-pago" className="border border-blue-600 text-blue-700 px-4 py-2 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
            Métodos de pago
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProjectInfoBanner;