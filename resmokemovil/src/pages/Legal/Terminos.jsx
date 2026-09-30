import React from 'react';
import Header from '../../components/Layout/HeaderProducts';
import Footer from '../../components/Layout/Footer';
import SEO from '../../components/SEO/SEO';
import { User as UserIcon, Gavel, Scale, ShoppingCart, CreditCard, Shield, Ban, Mail } from 'lucide-react';

const Terminos = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
      <Header />
      <SEO 
        title="Términos y Condiciones | Resmoke"
        description="Normas de uso, responsabilidades y jurisdicción aplicable."
        url="/terminos"
      />

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="text-center mb-10">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-white shadow-sm ring-1 ring-gray-200">
            <Gavel className="w-5 h-5 text-indigo-600 mr-2" />
            <span className="text-sm font-medium text-gray-700">Condiciones de uso</span>
          </div>
          <h1 className="mt-6 text-4xl sm:text-5xl font-bold text-gray-900">Términos y Condiciones</h1>
          <p className="mt-3 text-lg text-gray-600 max-w-2xl mx-auto">Reglas básicas de funcionamiento, responsabilidades y buenas prácticas en Resmoke.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <aside className="lg:col-span-3">
            <div className="sticky top-24 bg-white rounded-2xl shadow-xl p-6 ring-1 ring-gray-200">
              <h2 className="text-sm font-semibold text-gray-900 mb-4">Índice</h2>
              <nav className="space-y-3 text-sm">
                <a href="#cuenta" className="flex items-center text-gray-700 hover:text-indigo-700">
                  <UserIcon className="w-4 h-4 mr-2 text-gray-500" />
                  Cuenta de usuario
                </a>
                <a href="#publicaciones" className="flex items-center text-gray-700 hover:text-indigo-700">
                  <Gavel className="w-4 h-4 mr-2 text-gray-500" />
                  Publicaciones
                </a>
                <a href="#compras" className="flex items-center text-gray-700 hover:text-indigo-700">
                  <ShoppingCart className="w-4 h-4 mr-2 text-gray-500" />
                  Compras
                </a>
                <a href="#pagos" className="flex items-center text-gray-700 hover:text-indigo-700">
                  <CreditCard className="w-4 h-4 mr-2 text-gray-500" />
                  Pagos
                </a>
                <a href="#responsabilidades" className="flex items-center text-gray-700 hover:text-indigo-700">
                  <Shield className="w-4 h-4 mr-2 text-gray-500" />
                  Responsabilidades
                </a>
                <a href="#prohibiciones" className="flex items-center text-gray-700 hover:text-indigo-700">
                  <Ban className="w-4 h-4 mr-2 text-gray-500" />
                  Prohibiciones
                </a>
                <a href="#jurisdiccion" className="flex items-center text-gray-700 hover:text-indigo-700">
                  <Scale className="w-4 h-4 mr-2 text-gray-500" />
                  Jurisdicción
                </a>
                <a href="#contacto" className="flex items-center text-gray-700 hover:text-indigo-700">
                  <Mail className="w-4 h-4 mr-2 text-gray-500" />
                  Contacto
                </a>
              </nav>
            </div>
          </aside>

          <main className="lg:col-span-9 space-y-8">
            <section id="cuenta" className="scroll-mt-24 bg-white rounded-2xl shadow-xl p-8 ring-1 ring-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Cuenta de usuario</h2>
              <div className="grid sm:grid-cols-3 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Credenciales</p>
                  <p className="font-medium text-gray-900">Confidencialidad y uso</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Datos</p>
                  <p className="font-medium text-gray-900">Veracidad y actualización</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Seguridad</p>
                  <p className="font-medium text-gray-900">Prevención de fraude</p>
                </div>
              </div>
            </section>

            <section id="publicaciones" className="scroll-mt-24 bg-white rounded-2xl shadow-xl p-8 ring-1 ring-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Publicaciones</h2>
              <p className="text-gray-700">Los usuarios son responsables del contenido que publican y deben cumplir la normativa aplicable.</p>
            </section>

            <section id="compras" className="scroll-mt-24 bg-white rounded-2xl shadow-xl p-8 ring-1 ring-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Compras</h2>
              <p className="text-gray-700">Las transacciones se realizan entre usuarios siguiendo las condiciones de la plataforma.</p>
            </section>

            <section id="pagos" className="scroll-mt-24 bg-white rounded-2xl shadow-xl p-8 ring-1 ring-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Pagos</h2>
              <p className="text-gray-700">Los métodos de pago disponibles y sus condiciones se detallan en la sección correspondiente.</p>
            </section>

            <section id="responsabilidades" className="scroll-mt-24 bg-white rounded-2xl shadow-xl p-8 ring-1 ring-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Responsabilidades</h2>
              <p className="text-gray-700">Resmoke no garantiza la calidad de productos de terceros ni se responsabiliza por transacciones externas a la plataforma.</p>
            </section>

            <section id="prohibiciones" className="scroll-mt-24 bg-white rounded-2xl shadow-xl p-8 ring-1 ring-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Prohibiciones</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Contenido ilícito</p>
                  <p className="font-medium text-gray-900">Prohibido</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Suplantación</p>
                  <p className="font-medium text-gray-900">No permitido</p>
                </div>
              </div>
            </section>

            <section id="jurisdiccion" className="scroll-mt-24 bg-white rounded-2xl shadow-xl p-8 ring-1 ring-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Jurisdicción</h2>
              <p className="text-gray-700">Las presentes condiciones se rigen por la legislación española y, salvo acuerdo, los tribunales de Madrid.</p>
            </section>

            <section id="contacto" className="scroll-mt-24 bg-white rounded-2xl shadow-xl p-8 ring-1 ring-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Contacto</h2>
              <p className="text-gray-700">Para consultas sobre estos términos, escribe a soporte@resmoke.com</p>
              <div className="mt-4">
                <a href="mailto:soporte@resmoke.com" className="inline-flex items-center px-5 py-3 rounded-lg bg-gray-900 text-white font-medium hover:bg-gray-800">
                  <Mail className="w-4 h-4 mr-2" />
                  Contactar
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

export default Terminos;