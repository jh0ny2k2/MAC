const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event, context) => {
  // Configurar CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  };

  // Manejar preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  // Solo permitir métodos GET
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Método no permitido' }),
    };
  }

  try {
    // Verificar que existe la clave de Stripe
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error('Clave de Stripe no configurada');
    }

    // Obtener parámetros de consulta
    const { type, limit = 10, starting_after } = event.queryStringParameters || {};

    let data = {};

    switch (type) {
      case 'customers':
        data = await stripe.customers.list({
          limit: parseInt(limit),
          starting_after,
        });
        break;

      case 'payments':
        data = await stripe.paymentIntents.list({
          limit: parseInt(limit),
          starting_after,
        });
        break;

      case 'subscriptions':
        data = await stripe.subscriptions.list({
          limit: parseInt(limit),
          starting_after,
        });
        break;

      case 'products':
        data = await stripe.products.list({
          limit: parseInt(limit),
          starting_after,
        });
        break;

      case 'prices':
        data = await stripe.prices.list({
          limit: parseInt(limit),
          starting_after,
        });
        break;

      case 'invoices':
        data = await stripe.invoices.list({
          limit: parseInt(limit),
          starting_after,
        });
        break;

      case 'charges':
        data = await stripe.charges.list({
          limit: parseInt(limit),
          starting_after,
        });
        break;

      case 'balance':
        data = await stripe.balance.retrieve();
        break;

      case 'overview':
        // Obtener datos de resumen
        const [customers, payments, subscriptions, balance] = await Promise.all([
          stripe.customers.list({ limit: 5 }),
          stripe.paymentIntents.list({ limit: 5 }),
          stripe.subscriptions.list({ limit: 5 }),
          stripe.balance.retrieve(),
        ]);

        data = {
          customers: customers.data,
          payments: payments.data,
          subscriptions: subscriptions.data,
          balance,
          totals: {
            customers: customers.data.length,
            payments: payments.data.length,
            subscriptions: subscriptions.data.length,
          },
        };
        break;

      default:
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ 
            error: 'Tipo de datos no válido',
            validTypes: ['customers', 'payments', 'subscriptions', 'products', 'prices', 'invoices', 'charges', 'balance', 'overview']
          }),
        };
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        data,
        timestamp: new Date().toISOString(),
      }),
    };

  } catch (error) {
    console.error('Error en stripe-admin-data:', error);

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: error.message,
        timestamp: new Date().toISOString(),
      }),
    };
  }
};