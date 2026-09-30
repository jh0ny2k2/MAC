import { useEffect, useRef } from 'react';
import { adsenseConfig, loadAd, isAdSenseAvailable } from '../../config/googleAdsense';
import { useSubscription } from '../../hooks/useSubscription';

const AdBanner = ({ 
  adSlot, 
  adFormat = 'auto', 
  adLayout = '',
  adLayoutKey = '',
  style = {},
  className = '',
  responsive = true,
  showPlaceholder = true
}) => {
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
        console.error('Error al cargar AdBanner:', error);
      }

      if (Date.now() - start < maxWaitMs) timerId = window.setTimeout(tick, 1000);
    };

    tick();

    return () => {
      if (timerId) window.clearTimeout(timerId);
    };
  }, [adSlot]);
  // Mostrar placeholder en desarrollo o cuando AdSense no está disponible
  if (adsenseConfig.development.testMode && showPlaceholder && !isAdSenseAvailable()) {
    return (
      <div className={`ad-container ${className}`} style={style} role="region" aria-label="Publicidad">
        <div className="text-xs text-gray-500 mb-1">Publicidad</div>
        <div 
          className={`bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-500 text-sm`}
          style={{ minHeight: '250px', ...style }}
        >
          <div className="text-center">
            <div className="mb-2">📢</div>
            <div>Google AdSense</div>
            <div className="text-xs">Slot: {adSlot}</div>
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
      <div className="text-xs text-gray-500 mb-1">Publicidad</div>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: 'block', ...style }}
        data-ad-client={adsenseConfig.publisherId}
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-ad-layout={adLayout}
        data-ad-layout-key={adLayoutKey}
        data-full-width-responsive={responsive ? 'true' : 'false'}
      />
    </div>
  );
};

export default AdBanner;
