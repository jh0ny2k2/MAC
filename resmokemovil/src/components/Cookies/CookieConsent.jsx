import React, { useEffect, useState } from 'react';
import { Shield, Settings, Check, X } from 'lucide-react';
import googleAnalytics from '../../lib/googleAnalytics';

const setAdsPersonalization = (enabled) => {
  try {
    window.adsbygoogle = window.adsbygoogle || [];
    window.adsbygoogle.requestNonPersonalizedAds = enabled ? 0 : 1;
  } catch (e) {
  }
};

const CONSENT_KEY = 'resmoke_cookie_consent';
const CONSENT_VERSION = 1;

const getStoredConsent = () => {
  try {
    const raw = localStorage.getItem(CONSENT_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

const CookieConsent = () => {
  const [visible, setVisible] = useState(false);
  const [configOpen, setConfigOpen] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    const saved = getStoredConsent();
    if (!saved || saved.version !== CONSENT_VERSION) {
      setVisible(true);
    } else {
      if (saved.analytics) {
        googleAnalytics.init();
      }
      setAdsPersonalization(!!saved.marketing);
    }
  }, []);

  const persist = (prefs) => {
    const data = {
      version: CONSENT_VERSION,
      essential: true,
      analytics: prefs.analytics,
      marketing: prefs.marketing,
      date: new Date().toISOString()
    };
    localStorage.setItem(CONSENT_KEY, JSON.stringify(data));
  };

  const acceptAll = () => {
    persist({ analytics: true, marketing: true });
    googleAnalytics.init();
    setAdsPersonalization(true);
    setVisible(false);
  };

  const rejectAnalytics = () => {
    persist({ analytics: false, marketing: false });
    setVisible(false);
  };

  const savePrefs = () => {
    persist({ analytics, marketing });
    if (analytics) {
      googleAnalytics.init();
    }
    setAdsPersonalization(!!marketing);
    setVisible(false);
    setConfigOpen(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50">
      <div className="max-w-7xl mx-auto px-6 pb-6">
        <div className="bg-white rounded-2xl shadow-2xl ring-1 ring-gray-200 p-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center">
              <Shield className="w-6 h-6 text-indigo-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-900">Usamos cookies</h3>
              <p className="text-gray-700 mt-1">Utilizamos cookies esenciales para el funcionamiento y, con tu permiso, cookies analíticas y de marketing para mejorar la experiencia.</p>
              <div className="mt-4 flex flex-wrap gap-3">
                <button onClick={acceptAll} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-900 text-white font-medium hover:bg-gray-800">
                  <Check className="w-4 h-4" />
                  Aceptar todas
                </button>
                <button onClick={() => setConfigOpen(!configOpen)} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 font-medium hover:bg-gray-50">
                  <Settings className="w-4 h-4" />
                  Configurar
                </button>
                <button onClick={rejectAnalytics} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 font-medium hover:bg-gray-50">
                  <X className="w-4 h-4" />
                  Rechazar analíticas
                </button>
              </div>
              {configOpen && (
                <div className="mt-6 grid sm:grid-cols-3 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-900">Esenciales</span>
                      <span className="text-xs text-gray-500">Siempre activas</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">Necesarias para que el sitio funcione.</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-900">Analíticas</span>
                      <label className="inline-flex items-center">
                        <input type="checkbox" className="mr-2" checked={analytics} onChange={(e) => setAnalytics(e.target.checked)} />
                        <span className="text-sm text-gray-700">Permitir</span>
                      </label>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">Ayudan a medir y mejorar el rendimiento.</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-900">Marketing</span>
                      <label className="inline-flex items-center">
                        <input type="checkbox" className="mr-2" checked={marketing} onChange={(e) => setMarketing(e.target.checked)} />
                        <span className="text-sm text-gray-700">Permitir</span>
                      </label>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">Personalizan contenidos y anuncios.</p>
                  </div>
                  <div className="sm:col-span-3 flex justify-end gap-3">
                    <button onClick={savePrefs} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-900 text-white font-medium hover:bg-gray-800">
                      <Check className="w-4 h-4" />
                      Guardar preferencias
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;