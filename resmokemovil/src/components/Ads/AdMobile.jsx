import React, { useEffect, useRef } from 'react';
import { adsenseConfig, loadAd, isAdSenseAvailable } from '../../config/googleAdsense';
import { useSubscription } from '../../hooks/useSubscription';

const AdMobile = ({ className = '', style = {} }) => {
  const adRef = useRef(null);
  const { isPremium } = useSubscription();

  // No mostrar anuncios a usuarios premium
  if (isPremium) {
    return null;
  }

  useEffect(() => {
    if (!adsenseConfig.enabled) return;

    let timerId;
    const start = Date.now();
    const maxWaitMs = 15000;

    const tick = () => {
      const el = adRef.current;
      if (!el) {
        if (Date.now() - start < maxWaitMs) timerId = window.setTimeout(tick, 250);
        return;
      }

      if (el.hasAttribute('data-adsbygoogle-status')) return;

      try {
        if (isAdSenseAvailable()) {
          loadAd(el);
        }
      } catch (error) {
        console.error('Error al cargar AdMobile:', error);
      }

      if (Date.now() - start < maxWaitMs) timerId = window.setTimeout(tick, 1000);
    };

    tick();

    return () => {
      if (timerId) window.clearTimeout(timerId);
    };
  }, []);

  // Mostrar placeholder en desarrollo
  if (adsenseConfig.development.testMode && adsenseConfig.development.showPlaceholders) {
    return (
      <div className={`ad-container ${className}`} style={style} role="region" aria-label="Publicidad">
        <div className="text-xs text-gray-500 mb-1 text-center">Publicidad</div>
        <div 
          className="bg-gray-200 border-2 border-dashed border-gray-400 flex items-center justify-center text-gray-600 font-medium"
          style={{ 
            width: '100%',
            height: '100px',
            minHeight: '100px',
            maxWidth: '320px',
            margin: '0 auto',
            ...style 
          }}
        >
          <div className="text-center">
            <div className="text-sm">📱 Anuncio Mobile</div>
            <div className="text-xs text-gray-500 mt-1">Google AdSense - Modo Desarrollo</div>
            <div className="text-xs text-gray-400 mt-2">320x100</div>
          </div>
        </div>
      </div>
    );
  }

  // Si AdSense no está habilitado (producción desactivada), no mostrar nada
  if (!adsenseConfig.enabled) {
    return null;
  }

  return (
    <div className={`ad-container ${className}`} style={style} role="region" aria-label="Publicidad">
      <div className="text-xs text-gray-500 mb-1 text-center">Publicidad</div>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={adsenseConfig.publisherId}
        data-ad-slot={adsenseConfig.adUnits.mobile.slot}
        data-ad-format={adsenseConfig.adUnits.mobile.format}
        data-full-width-responsive="true"
      />
    </div>
  );
};

export default AdMobile;
