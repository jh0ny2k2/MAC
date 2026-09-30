import { loadStripe } from '@stripe/stripe-js';

// Inicializar Stripe con la clave pública
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

class StripeService {
  constructor() {
    this.stripe = null;
    this.PRICE_IDS = {
      PREMIUM_MONTHLY: import.meta.env.VITE_STRIPE_PRICE_ID_PREMIUM || 'price_1SF9QYP0WKpBBvwUJuXzsUW3',
    };
    this.init();
  }

  async init() {
    this.stripe = await stripePromise;
  }

  // Crear sesión de checkout para suscripción
  async createSubscriptionCheckout(userId, priceId, successUrl, cancelUrl) {
    try {
      const response = await fetch('/.netlify/functions/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          priceId,
          successUrl,
          cancelUrl,
          mode: 'subscription'
        }),
      });

      // Manejo de errores con detalles del backend
      if (!response.ok) {
        let errorMessage = 'Error al crear la sesión de checkout';
        try {
          const errBody = await response.json();
          errorMessage = errBody?.details || errBody?.error || errorMessage;
        } catch (_) {
          // Si no es JSON, intentar leer texto
          try {
            const errText = await response.text();
            if (errText) errorMessage = errText;
          } catch (_) {}
        }
        throw new Error(errorMessage);
      }

      const { url } = await response.json();
      
      // Redirigir directamente usando la URL del checkout
      if (url) {
        window.location.href = url;
        return { success: true };
      } else {
        throw new Error('No se recibió URL de checkout');
      }
    } catch (error) {
      console.error('Error en createSubscriptionCheckout:', error);
      return { 
        success: false, 
        error: error.message || 'Error al procesar el pago'
      };
    }
  }

  // Crear sesión de checkout para compra de producto (pago único)
  async createProductCheckout({ productId, amount, productName, buyerUserId, buyerEmail, successUrl, cancelUrl }) {
    try {
      const isDev = typeof window !== 'undefined' && window.location && window.location.hostname.includes('localhost');
      const endpoint = isDev ? 'http://localhost:3001/api/escrow/create-checkout-session' : '/.netlify/functions/create-checkout-session';
      const payload = isDev
        ? { productId, buyerUserId, buyerEmail, successUrl, cancelUrl, amount }
        : { mode: 'payment', productId, amount, productName, buyerUserId, buyerEmail, successUrl, cancelUrl };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        let message = 'Error al crear el pago';
        try { const j = await response.json(); message = j?.details || j?.error || message; } catch {}
        throw new Error(message);
      }

      const json = await response.json();
      const { url, free, redirect } = json || {};
      if (free) {
        window.location.href = redirect || successUrl || '/purchases';
        return { success: true };
      }
      if (url) {
        window.location.href = url;
        return { success: true };
      }
      throw new Error('No se recibió URL de pago');
    } catch (error) {
      console.error('Error en createProductCheckout:', error);
      return { success: false, error: error.message || 'Error al procesar el pago' };
    }
  }

  // Crear portal del cliente para gestionar suscripción
  async createCustomerPortal(customerId, returnUrl) {
    try {
      const response = await fetch('/api/stripe/create-customer-portal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerId,
          returnUrl,
        }),
      });

      if (!response.ok) {
        throw new Error('Error al crear la sesión del portal');
      }

      const { url } = await response.json();
      
      // Redirigir al portal del cliente
      window.location.href = url;
      
      return { success: true };
    } catch (error) {
      console.error('Error en createCustomerPortal:', error);
      return { success: false, error: error.message };
    }
  }

  // Cancelar suscripción
  async cancelSubscription(subscriptionId) {
    try {
      const response = await fetch('/api/stripe/cancel-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subscriptionId,
        }),
      });

      if (!response.ok) {
        throw new Error('Error al cancelar la suscripción');
      }

      const result = await response.json();
      return { success: true, data: result };
    } catch (error) {
      console.error('Error en cancelSubscription:', error);
      return { success: false, error: error.message };
    }
  }

  // Reactivar suscripción cancelada
  async reactivateSubscription(subscriptionId) {
    try {
      const response = await fetch('/api/stripe/reactivate-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subscriptionId,
        }),
      });

      if (!response.ok) {
        throw new Error('Error al reactivar la suscripción');
      }

      const result = await response.json();
      return { success: true, data: result };
    } catch (error) {
      console.error('Error en reactivateSubscription:', error);
      return { success: false, error: error.message };
    }
  }

  // Obtener información de la suscripción desde Stripe
  async getSubscriptionInfo(subscriptionId) {
    try {
      const response = await fetch(`/api/stripe/subscription/${subscriptionId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Error al obtener información de la suscripción');
      }

      const subscription = await response.json();
      return { success: true, data: subscription };
    } catch (error) {
      console.error('Error en getSubscriptionInfo:', error);
      return { success: false, error: error.message };
    }
  }

  // Obtener precios disponibles
  async getPrices() {
    try {
      const response = await fetch('/api/stripe/prices', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Error al obtener los precios');
      }

      const prices = await response.json();
      return { success: true, data: prices };
    } catch (error) {
      console.error('Error en getPrices:', error);
      return { success: false, error: error.message };
    }
  }

  // Formatear precio para mostrar
  formatPrice(amount, currency = 'eur') {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(amount / 100);
  }


}

export default new StripeService();
