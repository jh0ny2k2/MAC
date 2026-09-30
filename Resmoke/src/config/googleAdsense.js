// Configuración de Google AdSense
export const adsenseConfig = {
  publisherId: import.meta.env.VITE_GOOGLE_ADSENSE_PUBLISHER_ID || import.meta.env.VITE_GOOGLE_ADSENSE_CLIENT || 'ca-pub-0000000000000000',
  // Deshabilitar en desarrollo para evitar errores con ad-slots de prueba
  enabled: import.meta.env.VITE_GOOGLE_ADSENSE_ENABLED === 'true' && !import.meta.env.DEV,
  
  // IMPORTANTE: Los ad-slots deben ser reales de tu cuenta de Google AdSense
  // Los valores actuales son de prueba y causan errores 400
  // Ve a https://www.google.com/adsense/ para crear ad-slots reales
  adUnits: {
    banner: {
      slot: import.meta.env.VITE_ADSENSE_SLOT_BANNER || '1234567890', // ⚠️ REEMPLAZAR con ad-slot real
      format: 'auto',
      responsive: true
    },
    rectangle: {
      slot: import.meta.env.VITE_ADSENSE_SLOT_RECTANGLE || '0987654321', // ⚠️ REEMPLAZAR con ad-slot real
      format: 'rectangle',
      responsive: true
    },
    sidebar: {
      slot: import.meta.env.VITE_ADSENSE_SLOT_SIDEBAR || '1122334455', // ⚠️ REEMPLAZAR con ad-slot real
      format: 'vertical',
      responsive: true
    },
    mobile: {
      slot: import.meta.env.VITE_ADSENSE_SLOT_MOBILE || '5544332211', // ⚠️ REEMPLAZAR con ad-slot real
      format: 'auto',
      responsive: true
    }
  },
  
  // Configuraciones de desarrollo
  development: {
    testMode: import.meta.env.DEV,
    showPlaceholders: true
  }
};

const ADSENSE_SRC_PREFIX = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js';

const ensureAdSenseScript = () => {
  if (typeof document === 'undefined') return Promise.resolve(false);

  const existing =
    document.querySelector('script[data-resmoke-adsense="true"]') ||
    Array.from(document.scripts).find((s) => typeof s.src === 'string' && s.src.startsWith(ADSENSE_SRC_PREFIX));

  if (existing) return Promise.resolve(true);

  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.async = true;
    script.src = `${ADSENSE_SRC_PREFIX}?client=${encodeURIComponent(adsenseConfig.publisherId)}`;
    script.crossOrigin = 'anonymous';
    script.dataset.resmokeAdsense = 'true';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.head.appendChild(script);
  });
};

// Función para inicializar AdSense
export const initializeAdSense = () => {
  if (!adsenseConfig.enabled) {
    if (import.meta.env.DEV) {
      console.log('Google AdSense está deshabilitado en desarrollo');
    }
    return;
  }

  if (typeof window !== 'undefined') {
    try {
      ensureAdSenseScript();
      window.adsbygoogle = window.adsbygoogle || [];
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (error) {
      console.error('Error al inicializar Google AdSense:', error);
    }
  }
};

// Función para cargar un anuncio
export const loadAd = (adElement) => {
  if (!adsenseConfig.enabled) {
    return;
  }

  if (typeof window !== 'undefined' && adElement) {
    try {
      ensureAdSenseScript();

      const start = Date.now();
      const maxWaitMs = 15000;

      const tryLoad = () => {
        if (!adElement || adElement.hasAttribute('data-adsbygoogle-status')) return;
        if (window.adsbygoogle) {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
          return;
        }
        if (Date.now() - start >= maxWaitMs) return;
        window.setTimeout(tryLoad, 250);
      };

      tryLoad();
    } catch (error) {
      console.error('Error al cargar anuncio:', error);
    }
  }
};

// Función para verificar si AdSense está disponible
export const isAdSenseAvailable = () => {
  return typeof window !== 'undefined' && 
         window.adsbygoogle && 
         adsenseConfig.enabled;
};
