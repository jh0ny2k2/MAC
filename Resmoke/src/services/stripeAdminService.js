// Servicio para obtener datos de Stripe para el panel de administración
import { mockStripeData, simulateNetworkDelay } from '../data/stripeMockData.js';

const API_BASE_URL = '/.netlify/functions';

class StripeAdminService {
  constructor() {
    // Detectar si estamos en desarrollo local o en producción
    this.isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    this.baseURL = this.isLocal ? 'http://localhost:3001/api/stripe' : API_BASE_URL;
    
    // Configuración para datos de prueba
    this.useMockData = false; // Por defecto usar datos reales de Stripe
    this.mockDataEnabled = true; // Permitir fallback a datos de prueba solo si falla la conexión
    
    console.log('🔧 StripeAdminService inicializado:', {
      isLocal: this.isLocal,
      baseURL: this.baseURL,
      hostname: window.location.hostname,
      mockDataEnabled: this.mockDataEnabled
    });
  }

  /**
   * Alternar entre datos reales y datos de prueba
   * @param {boolean} useMock - Si usar datos de prueba
   */
  setMockMode(useMock) {
    this.useMockData = useMock;
    console.log(`🔄 Modo de datos cambiado a: ${useMock ? 'Prueba' : 'Real'}`);
  }

  /**
   * Obtener datos de prueba con simulación de delay
   * @param {string} type - Tipo de datos a obtener
   * @returns {Promise<Object>} - Datos de prueba
   */
  async getMockData(type) {
    console.log(`🎭 Obteniendo datos de prueba: ${type}`);
    
    // Simular delay de red
    await simulateNetworkDelay(300 + Math.random() * 500);
    
    if (mockStripeData[type]) {
      return mockStripeData[type];
    } else {
      throw new Error(`Tipo de datos de prueba no encontrado: ${type}`);
    }
  }

  /**
   * Método genérico para hacer peticiones a la API de Stripe
   * @param {string} type - Tipo de datos a obtener
   * @param {Object} params - Parámetros adicionales
   * @returns {Promise<Object>} - Datos de Stripe
   */
  async fetchStripeData(type, params = {}) {
    // Si está configurado para usar datos de prueba, usarlos directamente
    if (this.useMockData) {
      return this.getMockData(type);
    }

    try {
      console.log(`📊 Obteniendo datos de Stripe: ${type}`);
      
      const queryParams = new URLSearchParams({
        type,
        ...params
      });

      // Construir la URL según el entorno
      const endpoint = this.isLocal 
        ? `${this.baseURL}/admin-data?${queryParams}`
        : `${this.baseURL}/stripe-admin-data?${queryParams}`;
      
      console.log(`🔗 Endpoint: ${endpoint}`);

      const response = await fetch(endpoint, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }

      const result = await response.json();
      console.log(`✅ Datos obtenidos para ${type}:`, result);

      // Manejar diferentes formatos de respuesta
      if (this.isLocal) {
        // En desarrollo local, el servidor devuelve los datos directamente
        return result;
      } else {
        // En producción (Netlify), se espera el formato { success, data }
        if (!result.success) {
          throw new Error(result.error || 'Error desconocido');
        }
        return result.data;
      }
    } catch (error) {
      console.error(`❌ Error obteniendo datos de ${type}:`, error);
      
      // Si está habilitado el fallback a datos de prueba, usarlos
      if (this.mockDataEnabled && !this.useMockData) {
        console.log(`🎭 No se pudo conectar a Stripe. Usando datos de prueba para ${type}`);
        return this.getMockData(type);
      }
      
      throw error;
    }
  }

  /**
   * Obtener resumen general de datos de Stripe
   * @returns {Promise<Object>} - Resumen de datos
   */
  async getOverview() {
    return this.fetchStripeData('overview');
  }

  /**
   * Obtener lista de clientes
   * @param {Object} params - Parámetros de paginación
   * @returns {Promise<Object>} - Lista de clientes
   */
  async getCustomers(params = {}) {
    return this.fetchStripeData('customers', params);
  }

  /**
   * Obtener lista de pagos
   * @param {Object} params - Parámetros de paginación
   * @returns {Promise<Object>} - Lista de pagos
   */
  async getPayments(params = {}) {
    return this.fetchStripeData('payments', params);
  }

  /**
   * Obtener lista de suscripciones
   * @param {Object} params - Parámetros de paginación
   * @returns {Promise<Object>} - Lista de suscripciones
   */
  async getSubscriptions(params = {}) {
    return this.fetchStripeData('subscriptions', params);
  }

  /**
   * Obtener lista de productos
   * @param {Object} params - Parámetros de paginación
   * @returns {Promise<Object>} - Lista de productos
   */
  async getProducts(params = {}) {
    return this.fetchStripeData('products', params);
  }

  /**
   * Obtener lista de precios
   * @param {Object} params - Parámetros de paginación
   * @returns {Promise<Object>} - Lista de precios
   */
  async getPrices(params = {}) {
    return this.fetchStripeData('prices', params);
  }

  /**
   * Obtener lista de facturas
   * @param {Object} params - Parámetros de paginación
   * @returns {Promise<Object>} - Lista de facturas
   */
  async getInvoices(params = {}) {
    return this.fetchStripeData('invoices', params);
  }

  /**
   * Obtener lista de cargos
   * @param {Object} params - Parámetros de paginación
   * @returns {Promise<Object>} - Lista de cargos
   */
  async getCharges(params = {}) {
    return this.fetchStripeData('charges', params);
  }

  /**
   * Obtener balance de la cuenta
   * @returns {Promise<Object>} - Balance de la cuenta
   */
  async getBalance() {
    return this.fetchStripeData('balance');
  }

  /**
   * Formatear cantidad de dinero
   * @param {number} amount - Cantidad en centavos
   * @param {string} currency - Moneda
   * @returns {string} - Cantidad formateada
   */
  formatAmount(amount, currency = 'eur') {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(amount / 100);
  }

  /**
   * Formatear fecha
   * @param {number} timestamp - Timestamp de Unix
   * @returns {string} - Fecha formateada
   */
  formatDate(timestamp) {
    return new Date(timestamp * 1000).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  /**
   * Obtener estado de suscripción en español
   * @param {string} status - Estado en inglés
   * @returns {string} - Estado en español
   */
  getSubscriptionStatus(status) {
    const statusMap = {
      active: 'Activa',
      canceled: 'Cancelada',
      incomplete: 'Incompleta',
      incomplete_expired: 'Incompleta (Expirada)',
      past_due: 'Vencida',
      trialing: 'En prueba',
      unpaid: 'Sin pagar',
    };

    return statusMap[status] || status;
  }

  /**
   * Obtener estado de pago en español
   * @param {string} status - Estado en inglés
   * @returns {string} - Estado en español
   */
  getPaymentStatus(status) {
    const statusMap = {
      succeeded: 'Exitoso',
      pending: 'Pendiente',
      failed: 'Fallido',
      canceled: 'Cancelado',
      requires_action: 'Requiere acción',
      requires_confirmation: 'Requiere confirmación',
      requires_payment_method: 'Requiere método de pago',
    };

    return statusMap[status] || status;
  }
}

// Crear instancia única del servicio
const stripeAdminService = new StripeAdminService();

export default stripeAdminService;