import React, { useState, useEffect, useRef } from 'react';
import { adsenseConfig, loadAd } from '../../config/googleAdsense';
import { useSubscription } from '../../hooks/useSubscription';

const LazyAdBanner = ({ 
  adSlot = adsenseConfig.adUnits.banner.slot,
  className = '', 
  style = {},
  threshold = 0.1 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const adRef = useRef(null);
  const insRef = useRef(null);
  const { isPremium } = useSubscription();

  // No mostrar anuncios a usuarios premium
  if (isPremium) {
    return null;
  }

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isLoaded) {
          setIsVisible(true);
          setIsLoaded(true);
        }
      },
      { threshold }
    );

    if (adRef.current) {
      observer.observe(adRef.current);
    }

    return () => {
      if (adRef.current) {
        observer.unobserve(adRef.current);
      }
    };
  }, [threshold, isLoaded]);

  useEffect(() => {
    if (isVisible && adsenseConfig.enabled && insRef.current) {
      let timerId;
      const start = Date.now();
      const maxWaitMs = 15000;

      const tick = () => {
        const el = insRef.current;
        if (!el) {
          if (Date.now() - start < maxWaitMs) timerId = window.setTimeout(tick, 250);
          return;
        }

        if (el.hasAttribute('data-adsbygoogle-status')) return;

        try {
          loadAd(el);
        } catch (error) {
          console.error('Error al cargar LazyAdBanner:', error);
        }

        if (Date.now() - start < maxWaitMs) timerId = window.setTimeout(tick, 1000);
      };

      tick();

      return () => {
        if (timerId) window.clearTimeout(timerId);
      };
    }
  }, [isVisible, adSlot]);

  if (!adsenseConfig.enabled) {
    return null;
  }

  // Mostrar placeholder en desarrollo
  if (adsenseConfig.development.testMode && adsenseConfig.development.showPlaceholders) {
    return (
      <div ref={adRef} className={`ad-container ${className}`} style={style} role="region" aria-label="Publicidad">
        <div className="text-xs text-gray-500 mb-1">Publicidad</div>
        {isVisible ? (
          <div 
            className="bg-gray-200 border-2 border-dashed border-gray-400 flex items-center justify-center text-gray-600 font-medium"
            style={{ 
              height: '90px', 
              minHeight: '90px',
              ...style 
            }}
          >
            <div className="text-center">
              <div className="text-sm">🔄 Anuncio Lazy Banner</div>
              <div className="text-xs text-gray-500 mt-1">Google AdSense - Modo Desarrollo</div>
              <div className="text-xs text-gray-400 mt-2">Cargado dinámicamente</div>
            </div>
          </div>
        ) : (
          <div 
            className="bg-gray-100 animate-pulse border border-gray-300 flex items-center justify-center text-gray-500"
            style={{ 
              height: '90px', 
              width: '100%',
              ...style 
            }}
          >
            <div className="text-xs">⏳ Cargando anuncio...</div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div ref={adRef} className={`ad-container ${className}`} style={style} role="region" aria-label="Publicidad">
      {isVisible ? (
        <>
          <div className="text-xs text-gray-500 mb-1">Publicidad</div>
          <ins
            ref={insRef}
            className="adsbygoogle"
            style={{ display: 'block' }}
            data-ad-client={adsenseConfig.publisherId}
            data-ad-slot={adSlot}
            data-ad-format="auto"
            data-full-width-responsive="true"
          />
        </>
      ) : (
        <div 
          className="bg-gray-100 animate-pulse"
          style={{ 
            height: '90px', 
            width: '100%',
            ...style 
          }}
        />
      )}
    </div>
  );
};

export default LazyAdBanner;
