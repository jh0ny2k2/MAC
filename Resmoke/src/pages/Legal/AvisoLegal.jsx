import React from 'react';
import Header from '../../components/Layout/HeaderProducts';
import Footer from '../../components/Layout/Footer';
import SEO from '../../components/SEO/SEO';
import { Shield, FileText, Gavel, Scale, Mail } from 'lucide-react';

const AvisoLegal = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
      <Header />
      <SEO 
        title="Aviso Legal | Resmoke"
        description="Información legal y datos del titular del sitio Resmoke."
        url="/aviso-legal"
      />

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="text-center mb-10">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-white shadow-sm ring-1 ring-gray-200">
            <Shield className="w-5 h-5 text-indigo-600 mr-2" />
            <span className="text-sm font-medium text-gray-700">Legal y cumplimiento</span>
          </div>
          <h1 className="mt-6 text-4xl sm:text-5xl font-bold text-gray-900">Aviso Legal</h1>
          <p className="mt-3 text-lg text-gray-600 max-w-2xl mx-auto">Transparencia sobre titularidad, responsabilidades y condiciones de uso de Resmoke.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <aside className="lg:col-span-3">
            <div className="sticky top-24 bg-white rounded-2xl shadow-xl p-6 ring-1 ring-gray-200">
              <h2 className="text-sm font-semibold text-gray-900 mb-4">Índice</h2>
              <nav className="space-y-3 text-sm">
                <a href="#titular" className="flex items-center text-gray-700 hover:text-indigo-700">
                  <FileText className="w-4 h-4 mr-2 text-gray-500" />
                  Titular del sitio
                </a>
                <a href="#responsabilidad" className="flex items-center text-gray-700 hover:text-indigo-700">
                  <Shield className="w-4 h-4 mr-2 text-gray-500" />
                  Responsabilidad
                </a>
                <a href="#propiedad" className="flex items-center text-gray-700 hover:text-indigo-700">
                  <Gavel className="w-4 h-4 mr-2 text-gray-500" />
                  Propiedad intelectual
                </a>
                <a href="#condiciones" className="flex items-center text-gray-700 hover:text-indigo-700">
                  <Scale className="w-4 h-4 mr-2 text-gray-500" />
                  Condiciones de uso
                </a>
                <a href="#contacto" className="flex items-center text-gray-700 hover:text-indigo-700">
                  <Mail className="w-4 h-4 mr-2 text-gray-500" />
                  Contacto legal
                </a>
              </nav>
            </div>
          </aside>

          <main className="lg:col-span-9 space-y-8">
            <section id="titular" className="scroll-mt-24 bg-white rounded-2xl shadow-xl p-8 ring-1 ring-gray-200">
              <div className="flex items-start">
                <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center mr-4">
                  <FileText className="w-6 h-6 text-indigo-600" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Titular del sitio</h2>
                  <p className="text-gray-700">Resmoke, España. Contacto: soporte@resmoke.com</p>
                  <div className="mt-4 grid sm:grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">Domicilio social</p>
                      <p className="font-medium text-gray-900">Granada, España</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">Contacto</p>
                      <p className="font-medium text-gray-900">info.resmoke@gmail.com</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section id="responsabilidad" className="scroll-mt-24 bg-white rounded-2xl shadow-xl p-8 ring-1 ring-gray-200">
              <div className="flex items-start">
                <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center mr-4">
                  <Shield className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Responsabilidad</h2>
                  <p className="text-gray-700">Resmoke no se hace responsable de contenidos introducidos por usuarios ni del uso indebido de los productos publicados.</p>
                  <div className="mt-4 grid sm:grid-cols-3 gap-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">Publicaciones</p>
                      <p className="font-medium text-gray-900">Responsabilidad del usuario</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">Transacciones</p>
                      <p className="font-medium text-gray-900">Sujetos a condiciones</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">Incidencias</p>
                      <p className="font-medium text-gray-900">Canales de soporte</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section id="propiedad" className="scroll-mt-24 bg-white rounded-2xl shadow-xl p-8 ring-1 ring-gray-200">
              <div className="flex items-start">
                <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center mr-4">
                  <Gavel className="w-6 h-6 text-purple-600" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Propiedad intelectual</h2>
                  <p className="text-gray-700">Las marcas, textos e imágenes del sitio pertenecen a sus respectivos titulares. Queda prohibido su uso no autorizado.</p>
                  <div className="mt-4 grid sm:grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">Contenidos</p>
                      <p className="font-medium text-gray-900">Derechos reservados</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">Uso</p>
                      <p className="font-medium text-gray-900">Requiere autorización</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section id="condiciones" className="scroll-mt-24 bg-white rounded-2xl shadow-xl p-8 ring-1 ring-gray-200">
              <div className="flex items-start">
                <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center mr-4">
                  <Scale className="w-6 h-6 text-green-600" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Condiciones de uso</h2>
                  <p className="text-gray-700">El uso de Resmoke implica la aceptación de estas condiciones y el respeto a la normativa vigente.</p>
                  <div className="mt-4 grid sm:grid-cols-3 gap-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">Cuenta</p>
                      <p className="font-medium text-gray-900">Datos veraces</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">Publicaciones</p>
                      <p className="font-medium text-gray-900">Contenido permitido</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">Seguridad</p>
                      <p className="font-medium text-gray-900">Buenas prácticas</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section id="contacto" className="scroll-mt-24 bg-white rounded-2xl shadow-xl p-8 ring-1 ring-gray-200">
              <div className="flex items-start">
                <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center mr-4">
                  <Mail className="w-6 h-6 text-orange-600" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Contacto legal</h2>
                  <p className="text-gray-700">Para consultas o requerimientos legales, escribe a soporte@resmoke.com</p>
                  <div className="mt-4">
                    <a href="mailto:soporte@resmoke.com" className="inline-flex items-center px-5 py-3 rounded-lg bg-gray-900 text-white font-medium hover:bg-gray-800">
                      <Mail className="w-4 h-4 mr-2" />
                      Contactar
                    </a>
                  </div>
                </div>
              </div>
            </section>
          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AvisoLegal;