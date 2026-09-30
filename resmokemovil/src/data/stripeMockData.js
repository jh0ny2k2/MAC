// Datos de prueba para Stripe Admin
// Estos datos simulan la estructura real de Stripe para desarrollo

export const mockStripeData = {
  overview: {
    totalRevenue: 15420.50,
    totalCustomers: 127,
    activeSubscriptions: 45,
    totalPayments: 234,
    totalProducts: 12,
    totalInvoices: 89,
    recentActivity: [
      {
        id: 'activity_1',
        type: 'payment',
        description: 'Pago recibido de €29.99',
        timestamp: Date.now() - 3600000, // 1 hora atrás
        amount: 2999,
        currency: 'eur'
      },
      {
        id: 'activity_2',
        type: 'subscription',
        description: 'Nueva suscripción creada',
        timestamp: Date.now() - 7200000, // 2 horas atrás
        amount: 1999,
        currency: 'eur'
      },
      {
        id: 'activity_3',
        type: 'customer',
        description: 'Nuevo cliente registrado',
        timestamp: Date.now() - 10800000, // 3 horas atrás
      },
      {
        id: 'activity_4',
        type: 'invoice',
        description: 'Factura pagada',
        timestamp: Date.now() - 14400000, // 4 horas atrás
        amount: 4999,
        currency: 'eur'
      }
    ]
  },

  customers: [
    {
      id: 'cus_mock_001',
      name: 'Juan Pérez',
      email: 'juan.perez@email.com',
      created: 1704067200, // 2024-01-01
      phone: '+34 600 123 456',
      address: {
        city: 'Madrid',
        country: 'ES'
      }
    },
    {
      id: 'cus_mock_002',
      name: 'María García',
      email: 'maria.garcia@email.com',
      created: 1704153600, // 2024-01-02
      phone: '+34 600 789 012',
      address: {
        city: 'Barcelona',
        country: 'ES'
      }
    },
    {
      id: 'cus_mock_003',
      name: 'Carlos López',
      email: 'carlos.lopez@email.com',
      created: 1704240000, // 2024-01-03
      phone: '+34 600 345 678',
      address: {
        city: 'Valencia',
        country: 'ES'
      }
    },
    {
      id: 'cus_mock_004',
      name: 'Ana Martínez',
      email: 'ana.martinez@email.com',
      created: 1704326400, // 2024-01-04
      phone: '+34 600 901 234',
      address: {
        city: 'Sevilla',
        country: 'ES'
      }
    }
  ],

  payments: [
    {
      id: 'pi_mock_001',
      amount: 2999,
      currency: 'eur',
      status: 'succeeded',
      created: 1704067200,
      description: 'Suscripción Premium - Enero 2024',
      customer: 'cus_mock_001'
    },
    {
      id: 'pi_mock_002',
      amount: 1999,
      currency: 'eur',
      status: 'succeeded',
      created: 1704153600,
      description: 'Suscripción Básica - Enero 2024',
      customer: 'cus_mock_002'
    },
    {
      id: 'pi_mock_003',
      amount: 4999,
      currency: 'eur',
      status: 'pending',
      created: 1704240000,
      description: 'Suscripción Empresarial - Enero 2024',
      customer: 'cus_mock_003'
    },
    {
      id: 'pi_mock_004',
      amount: 999,
      currency: 'eur',
      status: 'succeeded',
      created: 1704326400,
      description: 'Compra única - Producto especial',
      customer: 'cus_mock_004'
    }
  ],

  subscriptions: [
    {
      id: 'sub_mock_001',
      status: 'active',
      current_period_start: 1704067200,
      current_period_end: 1706745600,
      created: 1704067200,
      customer: 'cus_mock_001',
      currency: 'eur',
      items: {
        data: [{
          price: {
            unit_amount: 2999,
            nickname: 'Plan Premium'
          }
        }]
      }
    },
    {
      id: 'sub_mock_002',
      status: 'active',
      current_period_start: 1704153600,
      current_period_end: 1706832000,
      created: 1704153600,
      customer: 'cus_mock_002',
      currency: 'eur',
      items: {
        data: [{
          price: {
            unit_amount: 1999,
            nickname: 'Plan Básico'
          }
        }]
      }
    },
    {
      id: 'sub_mock_003',
      status: 'past_due',
      current_period_start: 1704240000,
      current_period_end: 1706918400,
      created: 1704240000,
      customer: 'cus_mock_003',
      currency: 'eur',
      items: {
        data: [{
          price: {
            unit_amount: 4999,
            nickname: 'Plan Empresarial'
          }
        }]
      }
    },
    {
      id: 'sub_mock_004',
      status: 'trialing',
      current_period_start: 1704326400,
      current_period_end: 1707004800,
      created: 1704326400,
      customer: 'cus_mock_004',
      currency: 'eur',
      items: {
        data: [{
          price: {
            unit_amount: 2999,
            nickname: 'Plan Premium (Prueba)'
          }
        }]
      }
    }
  ],

  products: [
    {
      id: 'prod_mock_001',
      name: 'Suscripción Premium',
      description: 'Acceso completo a todas las funcionalidades premium',
      active: true,
      created: 1704067200,
      images: [],
      metadata: {}
    },
    {
      id: 'prod_mock_002',
      name: 'Suscripción Básica',
      description: 'Acceso a funcionalidades básicas de la plataforma',
      active: true,
      created: 1704153600,
      images: [],
      metadata: {}
    },
    {
      id: 'prod_mock_003',
      name: 'Suscripción Empresarial',
      description: 'Solución completa para empresas con soporte prioritario',
      active: true,
      created: 1704240000,
      images: [],
      metadata: {}
    },
    {
      id: 'prod_mock_004',
      name: 'Producto Especial',
      description: 'Producto de edición limitada',
      active: false,
      created: 1704326400,
      images: [],
      metadata: {}
    }
  ],

  invoices: [
    {
      id: 'in_mock_001',
      number: 'INV-2024-001',
      amount_due: 2999,
      currency: 'eur',
      status: 'paid',
      created: 1704067200,
      customer_email: 'juan.perez@email.com',
      due_date: 1704672000
    },
    {
      id: 'in_mock_002',
      number: 'INV-2024-002',
      amount_due: 1999,
      currency: 'eur',
      status: 'paid',
      created: 1704153600,
      customer_email: 'maria.garcia@email.com',
      due_date: 1704758400
    },
    {
      id: 'in_mock_003',
      number: 'INV-2024-003',
      amount_due: 4999,
      currency: 'eur',
      status: 'open',
      created: 1704240000,
      customer_email: 'carlos.lopez@email.com',
      due_date: 1704844800
    },
    {
      id: 'in_mock_004',
      number: 'INV-2024-004',
      amount_due: 999,
      currency: 'eur',
      status: 'paid',
      created: 1704326400,
      customer_email: 'ana.martinez@email.com',
      due_date: 1704931200
    }
  ],

  balance: {
    available: [
      {
        amount: 12450,
        currency: 'eur'
      }
    ],
    pending: [
      {
        amount: 2970,
        currency: 'eur'
      }
    ]
  }
};

// Función para simular delay de red
export const simulateNetworkDelay = (ms = 500) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};