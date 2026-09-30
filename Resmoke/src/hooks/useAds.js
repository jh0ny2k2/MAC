import { useState, useEffect, useRef } from 'react';
import { adsenseConfig, initializeAdSense, isAdSenseAvailable } from '../config/googleAdsense';

export const useAds = () => {
  const [isAdSenseReady, setIsAdSenseReady] = useState(false);
  const [adsLoaded, setAdsLoaded] = useState(false);

  useEffect(() => {
    // Inicializar AdSense cuando el componente se monta
    if (adsenseConfig.enabled) {
      initializeAdSense();
      
      // Verificar si AdSense está listo
      const checkAdSense = () => {
        if (isAdSenseAvailable()) {
          setIsAdSenseReady(true);
        }
      };

      // Verificar inmediatamente
      checkAdSense();

      // Verificar cada 100ms hasta que esté listo (máximo 5 segundos)
      const interval = setInterval(() => {
        checkAdSense();
        if (isAdSenseAvailable()) {
          clearInterval(interval);
        }
      }, 100);

      // Limpiar después de 5 segundos
      const timeout = setTimeout(() => {
        clearInterval(interval);
      }, 5000);

      return () => {
        clearInterval(interval);
        clearTimeout(timeout);
      };
    }
  }, []);

  return {
    isAdSenseReady,
    adsLoaded,
    setAdsLoaded,
    isEnabled: adsenseConfig.enabled
  };
};

// Hook para lazy loading de anuncios
export const useLazyAd = (threshold = 0.1) => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const elementRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasLoaded) {
          setIsVisible(true);
          setHasLoaded(true);
          // Desconectar el observer después de cargar
          observer.disconnect();
        }
      },
      {
        threshold,
        rootMargin: '50px'
      }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [threshold, hasLoaded]);

  return {
    elementRef,
    isVisible,
    hasLoaded
  };
};