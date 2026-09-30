import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import analytics from '../lib/analytics';

const useAnalytics = () => {
  const location = useLocation();

  useEffect(() => {
    // Rastrear cambio de página
    analytics.trackPageView(location.pathname, document.title);
  }, [location]);

  return {
    // Eventos básicos
    trackEvent: analytics.trackEvent.bind(analytics),
    trackPageView: analytics.trackPageView.bind(analytics),
    
    // Eventos de usuario
    trackLogin: analytics.trackLogin.bind(analytics),
    trackLogout: analytics.trackLogout.bind(analytics),
    trackSignUp: analytics.trackSignUp.bind(analytics),
    
    // Eventos de productos
    trackProductView: analytics.trackProductView.bind(analytics),
    trackAddToFavorites: analytics.trackAddToFavorites.bind(analytics),
    trackShare: analytics.trackShare.bind(analytics),
    
    // Eventos de búsqueda y compra
    trackSearch: analytics.trackSearch.bind(analytics),
    trackPurchase: analytics.trackPurchase.bind(analytics),
    
    // Métodos de conveniencia para eventos comunes
    trackButtonClick: (buttonName, location) => {
      analytics.trackEvent('button_click', {
        button_name: buttonName,
        page_location: location || window.location.pathname,
        category: 'engagement'
      });
    },
    
    trackFormSubmit: (formName, success = true) => {
      analytics.trackEvent('form_submit', {
        form_name: formName,
        success: success,
        category: 'engagement'
      });
    },
    
    trackError: (errorType, errorMessage, location) => {
      analytics.trackEvent('error', {
        error_type: errorType,
        error_message: errorMessage,
        page_location: location || window.location.pathname,
        category: 'error'
      });
    },
    
    trackContactAttempt: (method) => {
      analytics.trackEvent('contact_attempt', {
        contact_method: method,
        category: 'engagement'
      });
    }
  };
};

export default useAnalytics;