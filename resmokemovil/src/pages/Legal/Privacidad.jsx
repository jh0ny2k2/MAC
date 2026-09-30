import React from 'react';
import Header from '../../components/Layout/HeaderProducts';
import Footer from '../../components/Layout/Footer';
import SEO from '../../components/SEO/SEO';
import { Shield, Database, Lock, Scale, Clock, Mail, FileText, CheckCircle, User as UserIcon } from 'lucide-react';

const Privacidad = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
      <Header />
      <SEO 
        title="Política de Privacidad | Resmoke"
        description="Información sobre datos, finalidades, base legal y derechos."
        url="/privacidad"
      />

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="text-center mb-10">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-white shadow-sm ring-1 ring-gray-200">
            <Shield className="w-5 h-5 text-indigo-600 mr-2" />
            <span className="text-sm font-medium text-gray-700">Privacidad y datos</span>
          </div>
          <h1 className="mt-6 text-4xl sm:text-5xl font-bold text-gray-900">Política de Privacidad</h1>
          <p className="mt-3 text-lg text-gray-600 max-w-2xl mx-auto">Qué datos tratamos, por qué lo hacemos y cómo ejercitar tus derechos.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <aside className="lg:col-span-3">
            <div className="sticky top-24 bg-white rounded-2xl shadow-xl p-6 ring-1 ring-gray-200">
              <h2 className="text-sm font-semibold text-gray-900 mb-4">Índice</h2>
              <nav className="space-y-3 text-sm">
                <a href="#datos" className="flex items-center text-gray-700 hover:text-indigo-700">
                  <Database className="w-4 h-4 mr-2 text-gray-500" />
                  Datos que recopilamos
                </a>
                <a href="#finalidades" className="flex items-center text-gray-700 hover:text-indigo-700">
                  <FileText className="w-4 h-4 mr-2 text-gray-500" />
                  Finalidades
                </a>
                <a href="#base-legal" className="flex items-center text-gray-700 hover:text-indigo-700">
                  <Scale className="w-4 h-4 mr-2 text-gray-500" />
                  Base legal
                </a>
                <a href="#derechos" className="flex items-center text-gray-700 hover:text-indigo-700">
                  <CheckCircle className="w-4 h-4 mr-2 text-gray-500" />
                  Tus derechos
                </a>
                <a href="#conservacion" className="flex items-center text-gray-700 hover:text-indigo-700">
                  <Clock className="w-4 h-4 mr-2 text-gray-500" />
                  Conservación de datos
                </a>
                <a href="#seguridad" className="flex items-center text-gray-700 hover:text-indigo-700">
                  <Lock className="w-4 h-4 mr-2 text-gray-500" />
                  Seguridad
                </a>
                <a href="#contacto" className="flex items-center text-gray-700 hover:text-indigo-700">
                  <Mail className="w-4 h-4 mr-2 text-gray-500" />
                  Contacto
                </a>
              </nav>
            </div>
          </aside>

          <main className="lg:col-span-9 space-y-8">
            <section id="datos" className="scroll-mt-24 bg-white rounded-2xl shadow-xl p-8 ring-1 ring-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Datos que recopilamos</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Identificación</p>
                  <p className="font-medium text-gray-900">Nombre y correo</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Opcional</p>
                  <p className="font-medium text-gray-900">Teléfono</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Actividad</p>
                  <p className="font-medium text-gray-900">Publicaciones y uso</p>
                </div>
              </div>
            </section>

            <section id="finalidades" className="scroll-mt-24 bg-white rounded-2xl shadow-xl p-8 ring-1 ring-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Finalidades</h2>
              <p className="text-gray-700">Proveer el servicio, seguridad, mejora de experiencia y comunicaciones relevantes.</p>
              <div className="mt-4 grid sm:grid-cols-3 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Servicio</p>
                  <p className="font-medium text-gray-900">Operativa de la plataforma</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Seguridad</p>
                  <p className="font-medium text-gray-900">Prevención de fraude</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Comunicaciones</p>
                  <p className="font-medium text-gray-900">Alertas y soporte</p>
                </div>
              </div>
            </section>

            <section id="base-legal" className="scroll-mt-24 bg-white rounded-2xl shadow-xl p-8 ring-1 ring-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Base legal</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Contrato</p>
                  <p className="font-medium text-gray-900">Prestación del servicio</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Consentimiento</p>
                  <p className="font-medium text-gray-900">Preferencias y comunicaciones</p>
                </div>
              </div>
            </section>

            <section id="derechos" className="scroll-mt-24 bg-white rounded-2xl shadow-xl p-8 ring-1 ring-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Tus derechos</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Acceso</p>
                  <p className="font-medium text-gray-900">Solicitar tus datos</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Rectificación</p>
                  <p className="font-medium text-gray-900">Actualizar información</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Supresión</p>
                  <p className="font-medium text-gray-900">Eliminar datos</p>
                </div>
              </div>
            </section>

            <section id="conservacion" className="scroll-mt-24 bg-white rounded-2xl shadow-xl p-8 ring-1 ring-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Conservación de datos</h2>
              <p className="text-gray-700">Conservamos datos mientras mantengas tu cuenta activa y según requisitos legales.</p>
            </section>

            <section id="seguridad" className="scroll-mt-24 bg-white rounded-2xl shadow-xl p-8 ring-1 ring-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Seguridad</h2>
              <p className="text-gray-700">Aplicamos medidas técnicas y organizativas para proteger tu información.</p>
              <div className="mt-4 grid sm:grid-cols-3 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Cifrado</p>
                  <p className="font-medium text-gray-900">Comunicación segura</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Accesos</p>
                  <p className="font-medium text-gray-900">Control y auditoría</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Incidencias</p>
                  <p className="font-medium text-gray-900">Gestión y respuesta</p>
                </div>
              </div>
            </section>

            <section id="contacto" className="scroll-mt-24 bg-white rounded-2xl shadow-xl p-8 ring-1 ring-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Contacto</h2>
              <p className="text-gray-700">Para ejercer tus derechos o consultas de privacidad, escribe a privacidad@resmoke.com</p>
              <div className="mt-4">
                <a href="mailto:privacidad@resmoke.com" className="inline-flex items-center px-5 py-3 rounded-lg bg-gray-900 text-white font-medium hover:bg-gray-800">
                  <Mail className="w-4 h-4 mr-2" />
                  Enviar solicitud
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

export default Privacidad;