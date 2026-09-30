// Google Analytics 4 Configuration
// Configuración para Google Analytics 4

class GoogleAnalytics {
  constructor() {
    this.measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID;
    this.isInitialized = false;
    this.isProd = import.meta.env.MODE === 'production';
  }

  // Inicializar Google Analytics 4
  init() {
    if (this.isInitialized) return;
    if (!this.measurementId) {
      if (!this.isProd) console.warn('Google Analytics: VITE_GA_MEASUREMENT_ID no está configurado');
      return;
    }
    try {
      const consentRaw = localStorage.getItem('resmoke_cookie_consent');
      const consent = consentRaw ? JSON.parse(consentRaw) : null;
      if (!consent || consent.analytics !== true) {
        if (!this.isProd) console.warn('Google Analytics: no se inicializa sin consentimiento de analíticas');
        return;
      }

      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${this.measurementId}`;
      document.head.appendChild(script);

      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);} 
      window.gtag = gtag;
      
      gtag('js', new Date());
      gtag('config', this.measurementId, {
        page_title: document.title,
        page_location: window.location.href,
        send_page_view: true
      });

      this.isInitialized = true;
      if (!this.isProd) console.log('Google Analytics 4 inicializado con consentimiento');
    } catch (error) {
      if (!this.isProd) console.error('Error inicializando Google Analytics:', error);
    }
  }

  // Verificar si GA está disponible
  isAvailable() {
    return this.isInitialized && typeof window.gtag === 'function';
  }

  // Rastrear página vista
  trackPageView(pageTitle = document.title, pagePath = window.location.pathname) {
    if (!this.isAvailable()) return;

    try {
      window.gtag('config', this.measurementId, {
        page_title: pageTitle,
        page_location: window.location.href,
        page_path: pagePath
      });
    } catch (error) {
      if (!this.isProd) console.error('Error tracking page view:', error);
    }
  }

  // Rastrear evento personalizado
  trackEvent(eventName, parameters = {}) {
    if (!this.isAvailable()) return;

    try {
      window.gtag('event', eventName, {
        event_category: parameters.category || 'engagement',
        event_label: parameters.label,
        value: parameters.value,
        ...parameters
      });
    } catch (error) {
      if (!this.isProd) console.error('Error tracking event:', error);
    }
  }

  // Eventos específicos para e-commerce
  trackPurchase(transactionId, value, currency = 'EUR', items = []) {
    if (!this.isAvailable()) return;

    try {
      window.gtag('event', 'purchase', {
        transaction_id: transactionId,
        value: value,
        currency: currency,
        items: items
      });
    } catch (error) {
      if (!this.isProd) console.error('Error tracking purchase:', error);
    }
  }

  trackAddToCart(currency = 'EUR', value, items = []) {
    if (!this.isAvailable()) return;

    try {
      window.gtag('event', 'add_to_cart', {
        currency: currency,
        value: value,
        items: items
      });
    } catch (error) {
      if (!this.isProd) console.error('Error tracking add to cart:', error);
    }
  }

  trackViewItem(currency = 'EUR', value, items = []) {
    if (!this.isAvailable()) return;

    try {
      window.gtag('event', 'view_item', {
        currency: currency,
        value: value,
        items: items
      });
    } catch (error) {
      if (!this.isProd) console.error('Error tracking view item:', error);
    }
  }

  trackSearch(searchTerm) {
    if (!this.isAvailable()) return;

    try {
      window.gtag('event', 'search', {
        search_term: searchTerm
      });
    } catch (error) {
      if (!this.isProd) console.error('Error tracking search:', error);
    }
  }

  trackLogin(method = 'email') {
    if (!this.isAvailable()) return;

    try {
      window.gtag('event', 'login', {
        method: method
      });
    } catch (error) {
      if (!this.isProd) console.error('Error tracking login:', error);
    }
  }

  trackSignUp(method = 'email') {
    if (!this.isAvailable()) return;

    try {
      window.gtag('event', 'sign_up', {
        method: method
      });
    } catch (error) {
      if (!this.isProd) console.error('Error tracking sign up:', error);
    }
  }

  trackShare(contentType, itemId) {
    if (!this.isAvailable()) return;

    try {
      window.gtag('event', 'share', {
        content_type: contentType,
        item_id: itemId
      });
    } catch (error) {
      if (!this.isProd) console.error('Error tracking share:', error);
    }
  }

  // Configurar usuario
  setUserId(userId) {
    if (!this.isAvailable()) return;

    try {
      window.gtag('config', this.measurementId, {
        user_id: userId
      });
    } catch (error) {
      if (!this.isProd) console.error('Error setting user ID:', error);
    }
  }

  // Configurar propiedades personalizadas del usuario
  setUserProperties(properties) {
    if (!this.isAvailable()) return;

    try {
      window.gtag('set', 'user_properties', properties);
    } catch (error) {
      if (!this.isProd) console.error('Error setting user properties:', error);
    }
  }
}

// Crear instancia global
const googleAnalytics = new GoogleAnalytics();

export default googleAnalytics;