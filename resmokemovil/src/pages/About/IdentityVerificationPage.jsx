import React, { useState } from 'react';
import SEO from '../../components/SEO/SEO';

const IdentityVerificationPage = () => {
  const [verificationStep, setVerificationStep] = useState(1);
  const [documentType, setDocumentType] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [code, setCode] = useState('');
  const [submittingCode, setSubmittingCode] = useState(false);
  const [codeError, setCodeError] = useState('');
  const [codeSuccess, setCodeSuccess] = useState('');
  const tokenParam = typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('token') : null;

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    setUploadedFiles(prev => [...prev, ...files]);
  };

  const removeFile = (index) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <>
      <SEO title="Verificación de Identidad" description="Verifica tu identidad en Resmoke para mayor seguridad y confianza en tus transacciones." url="/verificacion-identidad"/>
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6">
              <span className="inline-block px-4 py-1 mb-4 rounded-full bg-purple-50 ring-1 ring-purple-200 text-sm tracking-wide text-purple-700">Seguridad</span>
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900">Verificación de Identidad</h1>
              <p className="mt-4 text-lg text-gray-600 max-w-xl">Refuerza la seguridad de tu cuenta y aumenta la confianza dentro de la comunidad.</p>
              <div className="mt-6 p-4 bg-white rounded-xl ring-1 ring-gray-200">
                <p className="font-semibold text-gray-900 mb-2">Verificación en dos pasos por e-mail</p>
                <p className="text-sm text-gray-600 mb-3">Introduce el código que te enviamos por correo para completar la verificación.</p>
                <div className="flex items-center gap-3">
                  <input value={code} onChange={(e)=>setCode(e.target.value)} placeholder="Código de 6 caracteres" className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500" />
                  <button onClick={async ()=>{ setSubmittingCode(true); setCodeError(''); setCodeSuccess(''); try { const isLocal = ['localhost','127.0.0.1'].includes(window.location.hostname); const endpoint = isLocal ? 'http://localhost:3001/api/verify-email-complete' : '/.netlify/functions/verify-email-complete'; const res = await fetch(endpoint,{ method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ token: tokenParam || '', code })}); const data = await res.json(); if (!data.success) { setCodeError(data.error || 'Error verificando el código'); } else { setCodeSuccess('Tu correo ha sido verificado.'); } } catch(e){ setCodeError('Error verificando el código'); } finally { setSubmittingCode(false); } }} disabled={submittingCode || !code} className="px-5 py-2 rounded-xl bg-green-600 text-white hover:bg-green-700 disabled:opacity-60">Confirmar</button>
                </div>
                {codeError && <p className="mt-2 text-red-600 text-sm">{codeError}</p>}
                {codeSuccess && <p className="mt-2 text-green-600 text-sm">{codeSuccess}</p>}
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                <a href="#niveles" className="inline-flex items-center px-5 py-3 rounded-xl bg-gray-900 text-white hover:bg-gray-800 transition">Ver niveles</a>
                <a href="#proceso" className="inline-flex items-center px-5 py-3 rounded-xl ring-1 ring-gray-300 text-gray-900 hover:bg-gray-50 transition">Cómo verificar</a>
              </div>
              <div className="mt-8 grid grid-cols-3 gap-6 text-center">
                <div className="bg-white/70 backdrop-blur rounded-xl ring-1 ring-gray-200 p-4 shadow-sm">
                  <p className="text-2xl font-bold text-gray-900">Protección</p>
                  <p className="text-xs text-gray-500">de cuenta</p>
                </div>
                <div className="bg-white/70 backdrop-blur rounded-xl ring-1 ring-gray-200 p-4 shadow-sm">
                  <p className="text-2xl font-bold text-gray-900">Confianza</p>
                  <p className="text-xs text-gray-500">comunidad</p>
                </div>
                <div className="bg-white/70 backdrop-blur rounded-xl ring-1 ring-gray-200 p-4 shadow-sm">
                  <p className="text-2xl font-bold text-gray-900">Beneficios</p>
                  <p className="text-xs text-gray-500">premium</p>
                </div>
              </div>
            </div>
            <div className="lg:col-span-6 relative">
              <div className="aspect-[4/3] rounded-2xl backdrop-blur overflow-hidden">
                <img src="/img/resmoke/LoginRegister.png" alt="Verificación de identidad" className="w-full h-full object-contain" />
              </div>
              <div className="absolute -bottom-6 -left-6 hidden lg:block w-32 h-32 bg-white/70 rounded-full blur-xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Verify */}
      <section className="py-12 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">¿Por Qué Verificar tu Identidad?</h2>
            <p className="text-lg text-gray-600">
              La verificación de identidad protege a toda la comunidad de Resmoke.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="group bg-white/80 backdrop-blur rounded-2xl p-8 ring-1 ring-gray-200 text-center transition hover:shadow-xl hover:-translate-y-0.5">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Mayor Seguridad</h3>
              <p className="text-gray-600 text-sm">Protege tu cuenta contra accesos no autorizados</p>
            </div>
            
            <div className="group bg-white/80 backdrop-blur rounded-2xl p-8 ring-1 ring-gray-200 text-center transition hover:shadow-xl hover:-translate-y-0.5">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Mayor Confianza</h3>
              <p className="text-gray-600 text-sm">Los usuarios confían más en perfiles verificados</p>
            </div>
            
            <div className="group bg-white/80 backdrop-blur rounded-2xl p-8 ring-1 ring-gray-200 text-center transition hover:shadow-xl hover:-translate-y-0.5">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Mejores Beneficios</h3>
              <p className="text-gray-600 text-sm">Acceso a funciones premium y límites más altos</p>
            </div>
          </div>
        </div>
      </section>

      {/* Verification Levels */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Niveles de Verificación</h2>
          
          <div id="niveles" className="grid md:grid-cols-3 gap-8">
            {/* Basic Verification */}
            <div className="group bg-white/80 backdrop-blur rounded-2xl p-8 ring-1 ring-gray-200 transition hover:shadow-xl hover:-translate-y-0.5">
              <div className="flex items-center mb-4">
                <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Verificación Básica</h3>
                  <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">Requerido</span>
                </div>
              </div>
              
              <p className="text-gray-600 mb-4">Verificación mínima para usar Resmoke.</p>
              
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900">Requisitos:</h4>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li className="flex items-start">
                    <svg className="w-4 h-4 text-green-600 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Email verificado</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-4 h-4 text-green-600 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Número de teléfono verificado</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-4 h-4 text-green-600 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Información personal básica</span>
                  </li>
                </ul>
                
                <div className="mt-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Beneficios:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Comprar y vender productos</li>
                    <li>• Límite de transacción: $500/día</li>
                    <li>• Soporte básico</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Standard Verification */}
            <div className="group bg-white/80 backdrop-blur rounded-2xl p-8 ring-2 ring-green-200 transition hover:shadow-xl hover:-translate-y-0.5">
              <div className="flex items-center mb-4">
                <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Verificación Estándar</h3>
                <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Recomendado</span>
              </div>
              </div>
              
              <p className="text-gray-600 mb-4">Verificación completa con documento de identidad.</p>
              
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900">Requisitos:</h4>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li className="flex items-start">
                    <svg className="w-4 h-4 text-green-600 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Verificación básica completa</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-4 h-4 text-green-600 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Documento de identidad oficial</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-4 h-4 text-green-600 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Selfie con documento</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-4 h-4 text-green-600 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Comprobante de domicilio</span>
                  </li>
                </ul>
                
                <div className="mt-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Beneficios:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Límite de transacción: $5,000/día</li>
                    <li>• Badge de verificación</li>
                    <li>• Soporte prioritario</li>
                    <li>• Acceso a funciones premium</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Premium Verification */}
            <div className="group bg-white/80 backdrop-blur rounded-2xl p-8 ring-1 ring-gray-200 transition hover:shadow-xl hover:-translate-y-0.5">
              <div className="flex items-center mb-4">
                <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Verificación Premium</h3>
                  <span className="inline-block bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">Empresas</span>
                </div>
              </div>
              
              <p className="text-gray-600 mb-4">Verificación empresarial para vendedores profesionales.</p>
              
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900">Requisitos:</h4>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li className="flex items-start">
                    <svg className="w-4 h-4 text-green-600 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Verificación estándar completa</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-4 h-4 text-green-600 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Registro mercantil</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-4 h-4 text-green-600 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Documentos fiscales</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-4 h-4 text-green-600 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Referencias bancarias</span>
                  </li>
                </ul>
                
                <div className="mt-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Beneficios:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Límites ilimitados</li>
                    <li>• Badge empresarial</li>
                    <li>• Gerente de cuenta dedicado</li>
                    <li>• API y herramientas avanzadas</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Verification Process */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Proceso de Verificación</h2>
          
          <div className="bg-gray-50 rounded-lg p-8">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                  verificationStep >= 1 ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600'
                }`}>
                  {verificationStep > 1 ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <span className="text-sm font-bold">1</span>
                  )}
                </div>
                <span className={`font-semibold ${
                  verificationStep >= 1 ? 'text-gray-900' : 'text-gray-500'
                }`}>Información Personal</span>
              </div>
              
              <div className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                  verificationStep >= 2 ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600'
                }`}>
                  {verificationStep > 2 ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <span className="text-sm font-bold">2</span>
                  )}
                </div>
                <span className={`font-semibold ${
                  verificationStep >= 2 ? 'text-gray-900' : 'text-gray-500'
                }`}>Documentos</span>
              </div>
              
              <div className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                  verificationStep >= 3 ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600'
                }`}>
                  {verificationStep > 3 ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <span className="text-sm font-bold">3</span>
                  )}
                </div>
                <span className={`font-semibold ${
                  verificationStep >= 3 ? 'text-gray-900' : 'text-gray-500'
                }`}>Revisión</span>
              </div>
            </div>
            
            {/* Step Content */}
            {verificationStep === 1 && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-gray-900">Información Personal</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nombre Completo *</label>
                    <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Fecha de Nacimiento *</label>
                    <input type="date" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nacionalidad *</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500">
                      <option value="">Selecciona tu nacionalidad</option>
                      <option value="mx">México</option>
                      <option value="us">Estados Unidos</option>
                      <option value="es">España</option>
                      <option value="co">Colombia</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Ocupación</label>
                    <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500" />
                  </div>
                </div>
                <button 
                  onClick={() => setVerificationStep(2)}
                  className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                >
                  Continuar
                </button>
              </div>
            )}
            
            {verificationStep === 2 && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-gray-900">Subir Documentos</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Documento *</label>
                  <select 
                    value={documentType}
                    onChange={(e) => setDocumentType(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="">Selecciona un documento</option>
                    <option value="passport">Pasaporte</option>
                    <option value="id">Cédula de Identidad</option>
                    <option value="license">Licencia de Conducir</option>
                  </select>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Frente del Documento</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <p className="text-gray-600 mb-2">Arrastra o haz clic para subir</p>
                      <p className="text-sm text-gray-500">PNG, JPG hasta 5MB</p>
                      <input type="file" className="hidden" accept=".png,.jpg,.jpeg" onChange={handleFileUpload} />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Reverso del Documento</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <p className="text-gray-600 mb-2">Arrastra o haz clic para subir</p>
                      <p className="text-sm text-gray-500">PNG, JPG hasta 5MB</p>
                      <input type="file" className="hidden" accept=".png,.jpg,.jpeg" onChange={handleFileUpload} />
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Selfie con Documento</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <p className="text-gray-600 mb-2">Toma una selfie sosteniendo tu documento</p>
                    <p className="text-sm text-gray-500">Asegúrate de que tu rostro y el documento sean claramente visibles</p>
                    <input type="file" className="hidden" accept=".png,.jpg,.jpeg" onChange={handleFileUpload} />
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <button 
                    onClick={() => setVerificationStep(1)}
                    className="bg-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-400 transition-colors"
                  >
                    Atrás
                  </button>
                  <button 
                    onClick={() => setVerificationStep(3)}
                    className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                  >
                    Continuar
                  </button>
                </div>
              </div>
            )}
            
            {verificationStep === 3 && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-gray-900">Revisión y Envío</h3>
                
                <div className="bg-white rounded-lg p-6 border border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-4">Resumen de tu Solicitud</h4>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Nivel de verificación:</span>
                      <span className="font-semibold">Estándar</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Documentos subidos:</span>
                      <span className="font-semibold">{uploadedFiles.length} archivos</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tiempo estimado de revisión:</span>
                      <span className="font-semibold">1-3 días hábiles</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-yellow-50 rounded-lg p-4">
                  <div className="flex items-start">
                    <svg className="w-6 h-6 text-yellow-600 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Importante</h4>
                      <p className="text-sm text-gray-600">
                        Una vez enviada tu solicitud, no podrás modificar la información. 
                        Asegúrate de que todos los datos y documentos sean correctos.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <input type="checkbox" className="mt-1 mr-3" required />
                  <label className="text-sm text-gray-600">
                    Confirmo que toda la información proporcionada es veraz y que los documentos son auténticos. 
                    Entiendo que proporcionar información falsa puede resultar en la suspensión de mi cuenta.
                  </label>
                </div>
                
                <div className="flex gap-4">
                  <button 
                    onClick={() => setVerificationStep(2)}
                    className="bg-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-400 transition-colors"
                  >
                    Atrás
                  </button>
                  <button className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors">
                    Enviar Solicitud
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Document Requirements */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Requisitos de Documentos</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Documentos Aceptados</h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-600 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Pasaporte vigente</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-600 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Cédula de identidad nacional</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-600 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Licencia de conducir</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-600 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Tarjeta de residencia</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Calidad de Imagen</h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-blue-600 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  <span>Imagen clara y nítida</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-blue-600 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  <span>Buena iluminación</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-blue-600 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  <span>Todos los bordes visibles</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-blue-600 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  <span>Texto completamente legible</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-blue-600 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  <span>Sin reflejos o sombras</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Preguntas Frecuentes</h2>
          
          <div className="space-y-6">
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-2">¿Cuánto tiempo tarda la verificación?</h3>
              <p className="text-gray-600">
                La verificación básica es instantánea. La verificación estándar toma entre 1-3 días hábiles, 
                y la verificación premium puede tomar hasta 5-7 días hábiles.
              </p>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-2">¿Es seguro subir mis documentos?</h3>
              <p className="text-gray-600">
                Sí, utilizamos encriptación de grado militar para proteger tus documentos. 
                Solo personal autorizado puede acceder a esta información y se elimina después de la verificación.
              </p>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-2">¿Qué pasa si mi verificación es rechazada?</h3>
              <p className="text-gray-600">
                Te notificaremos por email con las razones específicas del rechazo y podrás 
                volver a enviar tu solicitud con la información corregida.
              </p>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-2">¿Puedo usar Resmoke sin verificación?</h3>
              <p className="text-gray-600">
                La verificación básica (email y teléfono) es obligatoria. Sin embargo, 
                puedes usar funciones limitadas de la plataforma mientras completas tu verificación.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Support */}
      <section className="py-16 bg-green-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">¿Necesitas Ayuda con la Verificación?</h2>
          <p className="text-xl text-green-100 mb-8">
            Nuestro equipo de soporte está aquí para ayudarte en cada paso.
          </p>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-green-700 rounded-lg p-6">
              <div className="bg-green-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold mb-2">Chat en Vivo</h3>
              <p className="text-green-100 text-sm">Soporte inmediato</p>
              <p className="text-green-200 text-xs">Lun-Vie 9AM-6PM</p>
            </div>
            
            <div className="bg-green-700 rounded-lg p-6">
              <div className="bg-green-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold mb-2">Email</h3>
              <p className="text-green-100 text-sm">verification@resmoke.com</p>
              <p className="text-green-200 text-xs">Respuesta en 24 horas</p>
            </div>
            
            <div className="bg-green-700 rounded-lg p-6">
              <div className="bg-green-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-lg font-bold mb-2">Centro de Ayuda</h3>
              <p className="text-green-100 text-sm">Guías detalladas</p>
              <p className="text-green-200 text-xs">Disponible 24/7</p>
            </div>
          </div>
        </div>
      </section>
    </div>
    </>
  );
};

export default IdentityVerificationPage;
