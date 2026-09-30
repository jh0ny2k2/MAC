import React from 'react';
import Header from '../../components/Layout/HeaderProducts';
import Footer from '../../components/Layout/Footer';
import SEO from '../../components/SEO/SEO';
import { Shield, BarChart3, Settings, Info, Mail } from 'lucide-react';

const Cookies = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
      <Header />
      <SEO 
        title="Política de Cookies | Resmoke"
        description="Información sobre el uso de cookies, tipos y gestión en Resmoke."
        url="/cookies"
      />

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="text-center mb-10">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-white shadow-sm ring-1 ring-gray-200">
            <BarChart3 className="w-5 h-5 text-indigo-600 mr-2" />
            <span className="text-sm font-medium text-gray-700">Cookies y análisis</span>
          </div>
          <h1 className="mt-6 text-4xl sm:text-5xl font-bold text-gray-900">Política de Cookies</h1>
          <p className="mt-3 text-lg text-gray-600 max-w-2xl mx-auto">Explicamos qué cookies utilizamos, con qué finalidad y cómo puedes gestionarlas.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <aside className="lg:col-span-3">
            <div className="sticky top-24 bg-white rounded-2xl shadow-xl p-6 ring-1 ring-gray-200">
              <h2 className="text-sm font-semibold text-gray-900 mb-4">Índice</h2>
              <nav className="space-y-3 text-sm">
                <a href="#tipos" className="flex items-center text-gray-700 hover:text-indigo-700">
                  <Shield className="w-4 h-4 mr-2 text-gray-500" />
                  Tipos de cookies
                </a>
                <a href="#finalidad" className="flex items-center text-gray-700 hover:text-indigo-700">
                  <BarChart3 className="w-4 h-4 mr-2 text-gray-500" />
                  Finalidades
                </a>
                <a href="#gestion" className="flex items-center text-gray-700 hover:text-indigo-700">
                  <Settings className="w-4 h-4 mr-2 text-gray-500" />
                  Gestión de cookies
                </a>
                <a href="#consentimiento" className="flex items-center text-gray-700 hover:text-indigo-700">
                  <Info className="w-4 h-4 mr-2 text-gray-500" />
                  Consentimiento
                </a>
                <a href="#terceros" className="flex items-center text-gray-700 hover:text-indigo-700">
                  <BarChart3 className="w-4 h-4 mr-2 text-gray-500" />
                  Cookies de terceros
                </a>
                <a href="#contacto" className="flex items-center text-gray-700 hover:text-indigo-700">
                  <Mail className="w-4 h-4 mr-2 text-gray-500" />
                  Contacto
                </a>
              </nav>
            </div>
          </aside>

          <main className="lg:col-span-9 space-y-8">
            <section id="tipos" className="scroll-mt-24 bg-white rounded-2xl shadow-xl p-8 ring-1 ring-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Tipos de cookies</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Esenciales</p>
                  <p className="font-medium text-gray-900">Necesarias para el funcionamiento</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Analíticas</p>
                  <p className="font-medium text-gray-900">Medición y estadísticas</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Funcionales</p>
                  <p className="font-medium text-gray-900">Preferencias y experiencia</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Marketing</p>
                  <p className="font-medium text-gray-900">Publicidad y remarketing</p>
                </div>
              </div>
            </section>

            <section id="finalidad" className="scroll-mt-24 bg-white rounded-2xl shadow-xl p-8 ring-1 ring-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Finalidades</h2>
              <p className="text-gray-700">Recordar sesión, mejorar rendimiento, detectar incidencias y ofrecer contenido relevante.</p>
              <div className="mt-4 grid sm:grid-cols-3 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Rendimiento</p>
                  <p className="font-medium text-gray-900">Velocidad y estabilidad</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Experiencia</p>
                  <p className="font-medium text-gray-900">Personalización</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Medición</p>
                  <p className="font-medium text-gray-900">Analítica de uso</p>
                </div>
              </div>
            </section>

            <section id="gestion" className="scroll-mt-24 bg-white rounded-2xl shadow-xl p-8 ring-1 ring-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Gestión de cookies</h2>
              <p className="text-gray-700">Puedes configurar o deshabilitar cookies desde tu navegador o los ajustes de tu cuenta.</p>
              <div className="mt-4 grid sm:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Navegador</p>
                  <p className="font-medium text-gray-900">Preferencias y permisos</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Cuenta</p>
                  <p className="font-medium text-gray-900">Ajustes de privacidad</p>
                </div>
              </div>
            </section>

            <section id="consentimiento" className="scroll-mt-24 bg-white rounded-2xl shadow-xl p-8 ring-1 ring-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Consentimiento</h2>
              <p className="text-gray-700">Al navegar por Resmoke aceptas el uso de cookies según esta política. Puedes retirar tu consentimiento en cualquier momento.</p>
            </section>

            <section id="terceros" className="scroll-mt-24 bg-white rounded-2xl shadow-xl p-8 ring-1 ring-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Cookies de terceros</h2>
              <p className="text-gray-700">Podemos usar servicios externos para analítica o publicidad que establecen sus propias cookies.</p>
              <div className="mt-4 grid sm:grid-cols-3 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Analítica</p>
                  <p className="font-medium text-gray-900">Métricas de uso</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Publicidad</p>
                  <p className="font-medium text-gray-900">Campañas y alcance</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Integraciones</p>
                  <p className="font-medium text-gray-900">Servicios conectados</p>
                </div>
              </div>
            </section>

            <section id="contacto" className="scroll-mt-24 bg-white rounded-2xl shadow-xl p-8 ring-1 ring-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Contacto</h2>
              <p className="text-gray-700">Si tienes dudas sobre esta política, escribe a cookies@resmoke.com</p>
              <div className="mt-4">
                <a href="mailto:cookies@resmoke.com" className="inline-flex items-center px-5 py-3 rounded-lg bg-gray-900 text-white font-medium hover:bg-gray-800">
                  <Mail className="w-4 h-4 mr-2" />
                  Enviar correo
                </a>
              </div>
            </section>
          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Cookies;