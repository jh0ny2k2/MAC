import { supabase } from './supabase';
import googleAnalytics from './googleAnalytics';

class AnalyticsService {
  constructor() {
    this.sessionId = this.getOrCreateSessionId();
    this.startTime = Date.now();
    this.pageViews = 0;
    this.lastActivity = Date.now();
    
    // Inicializar sesión
    this.initSession();
    
    // Rastrear tiempo en página
    this.setupActivityTracking();
    
    // Rastrear cuando el usuario sale
    this.setupExitTracking();
  }

  getOrCreateSessionId() {
    let sessionId = sessionStorage.getItem('analytics_session_id');
    if (!sessionId) {
      sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      sessionStorage.setItem('analytics_session_id', sessionId);
    }
    return sessionId;
  }

  async initSession() {
    try {
      if (import.meta.env.MODE !== 'production') {
        console.log('Analytics session initialized (disabled)');
      }
    } catch (error) {
      if (import.meta.env.MODE !== 'production') {
        console.error('Error initializing session:', error);
      }
    }
  }

  async trackPageView(pageUrl = window.location.pathname, pageTitle = document.title) {
    try {
      this.pageViews++;
      this.lastActivity = Date.now();

      // Enviar a Google Analytics 4
      googleAnalytics.trackPageView(pageTitle, pageUrl);

      const eventData = {
        session_id: this.sessionId,
        user_id: this.getCurrentUserId(),
        event_type: 'page_view',
        page_url: pageUrl,
        page_title: pageTitle,
        referrer: document.referrer || null,
        user_agent: navigator.userAgent,
        ...this.getDeviceInfo()
      };

      // await supabase.from('web_analytics').insert(eventData); // Temporalmente deshabilitado

      // Actualizar sesión
      await this.updateSession();

    } catch (error) {
      if (import.meta.env.MODE !== 'production') {
        console.error('Error tracking page view:', error);
      }
    }
  }

  async trackEvent(eventType, data = {}) {
    try {
      // Enviar a Google Analytics 4
      googleAnalytics.trackEvent(eventType, {
        category: data.category || 'engagement',
        label: data.label,
        value: data.value,
        ...data
      });

      const eventData = {
        session_id: this.sessionId,
        user_id: this.getCurrentUserId(),
        event_type: eventType,
        page_url: window.location.pathname,
        page_title: document.title,
        ...data
      };

      // await supabase.from('web_analytics').insert(eventData); // Temporalmente deshabilitado
      this.lastActivity = Date.now();

    } catch (error) {
      if (import.meta.env.MODE !== 'production') {
        console.error('Error tracking event:', error);
      }
    }
  }

  async updateSession() {
    try {
      // Analytics temporalmente deshabilitado para evitar errores 400
      
    } catch (error) {
      if (import.meta.env.MODE !== 'production') {
        console.error('Error updating session:', error);
      }
    }
  }

  setupActivityTracking() {
    // Actualizar actividad cada 30 segundos
    setInterval(() => {
      if (Date.now() - this.lastActivity < 60000) { // Si hubo actividad en el último minuto
        this.updateSession();
      }
    }, 30000);

    // Rastrear interacciones del usuario
    ['click', 'scroll', 'keypress', 'mousemove'].forEach(event => {
      document.addEventListener(event, () => {
        this.lastActivity = Date.now();
      }, { passive: true });
    });
  }

  setupExitTracking() {
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        this.updateSession();
      }
    }, { passive: true });
  }

  getCurrentUserId() {
    // Obtener el ID del usuario actual si está logueado
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    return user?.id || null;
  }

  getDeviceInfo() {
    const ua = navigator.userAgent;
    let deviceType = 'desktop';
    let browser = 'unknown';
    let os = 'unknown';

    // Detectar tipo de dispositivo
    if (/tablet|ipad|playbook|silk/i.test(ua)) {
      deviceType = 'tablet';
    } else if (/mobile|iphone|ipod|android|blackberry|opera|mini|windows\sce|palm|smartphone|iemobile/i.test(ua)) {
      deviceType = 'mobile';
    }

    // Detectar navegador
    if (ua.includes('Chrome')) browser = 'Chrome';
    else if (ua.includes('Firefox')) browser = 'Firefox';
    else if (ua.includes('Safari')) browser = 'Safari';
    else if (ua.includes('Edge')) browser = 'Edge';
    else if (ua.includes('Opera')) browser = 'Opera';

    // Detectar OS
    if (ua.includes('Windows')) os = 'Windows';
    else if (ua.includes('Mac')) os = 'macOS';
    else if (ua.includes('Linux')) os = 'Linux';
    else if (ua.includes('Android')) os = 'Android';
    else if (ua.includes('iOS')) os = 'iOS';

    return {
      device_type: deviceType,
      browser: browser,
      os: os
    };
  }

  // Métodos para eventos específicos
  async trackLogin(userId, method = 'email') {
    // Google Analytics 4
    googleAnalytics.trackLogin(method);
    googleAnalytics.setUserId(userId);
    
    // Analytics personalizado
    await this.trackEvent('user_login', { user_id: userId, method: method });
  }

  async trackLogout() {
    // Google Analytics 4
    googleAnalytics.trackEvent('logout');
    
    // Analytics personalizado
    await this.trackEvent('user_logout');
  }

  async trackProductView(productId, productData = {}) {
    // Google Analytics 4 - Enhanced E-commerce
    googleAnalytics.trackViewItem('EUR', productData.price || 0, [{
      item_id: productId,
      item_name: productData.name || 'Producto',
      item_category: productData.category || 'General',
      price: productData.price || 0,
      quantity: 1
    }]);
    
    // Analytics personalizado
    await this.trackEvent('product_view', { 
      product_id: productId,
      ...productData
    });
  }

  async trackSearch(query) {
    // Google Analytics 4
    googleAnalytics.trackSearch(query);
    
    // Analytics personalizado
    await this.trackEvent('search', { search_query: query });
  }

  async trackPurchase(transactionId, productData = {}) {
    // Google Analytics 4 - Enhanced E-commerce
    googleAnalytics.trackPurchase(
      transactionId,
      productData.price || 0,
      'EUR',
      [{
        item_id: productData.product_id,
        item_name: productData.name || 'Producto',
        item_category: productData.category || 'General',
        price: productData.price || 0,
        quantity: productData.quantity || 1
      }]
    );
    
    // Analytics personalizado
    await this.trackEvent('purchase', { 
      transaction_id: transactionId,
      ...productData
    });
  }

  async trackAddToFavorites(productId, productData = {}) {
    // Google Analytics 4
    googleAnalytics.trackEvent('add_to_wishlist', {
      currency: 'EUR',
      value: productData.price || 0,
      items: [{
        item_id: productId,
        item_name: productData.name || 'Producto',
        item_category: productData.category || 'General',
        price: productData.price || 0,
        quantity: 1
      }]
    });
    
    // Analytics personalizado
    await this.trackEvent('add_to_favorites', { 
      product_id: productId,
      ...productData
    });
  }

  async trackShare(contentType, itemId) {
    // Google Analytics 4
    googleAnalytics.trackShare(contentType, itemId);
    
    // Analytics personalizado
    await this.trackEvent('share', { 
      content_type: contentType,
      item_id: itemId
    });
  }

  async trackSignUp(userId, method = 'email') {
    // Google Analytics 4
    googleAnalytics.trackSignUp(method);
    googleAnalytics.setUserId(userId);
    
    // Analytics personalizado
    await this.trackEvent('sign_up', { 
      user_id: userId,
      method: method
    });
  }
}

// Crear instancia global
const analytics = new AnalyticsService();

export default analytics;