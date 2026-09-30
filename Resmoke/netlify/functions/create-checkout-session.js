exports.handler = async (event, context) => {
  // Manejar preflight CORS primero
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: ''
    };
  }

  // Solo permitir POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };
  }

  try {
    const secretKey = process.env.STRIPE_SECRET_KEY;
    if (!secretKey) {
      return {
        statusCode: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          error: 'Falta STRIPE_SECRET_KEY en el entorno',
          details: 'Configura STRIPE_SECRET_KEY en el entorno (Netlify / local).',
        })
      };
    }

    const stripe = require('stripe')(secretKey);
    let payload;
    try {
      payload = JSON.parse(event.body || '{}');
    } catch (e) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ error: 'JSON inválido en el cuerpo de la solicitud' })
      };
    }

    const { userId, priceId, successUrl, cancelUrl, mode, productId, productName, amount, buyerEmail, buyerUserId } = payload;

    // Validaciones según modo
    if ((mode === 'subscription' || !mode) && (!userId || !priceId || !successUrl || !cancelUrl)) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          error: 'Parámetros requeridos faltantes',
          details: 'Se requieren userId, priceId, successUrl y cancelUrl para suscripción'
        })
      };
    }
    if (mode === 'payment' && (!productId || amount === undefined || !successUrl || !cancelUrl || !buyerEmail || !buyerUserId)) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          error: 'Parámetros requeridos faltantes',
          details: 'Se requieren productId, amount, buyerEmail, buyerUserId, successUrl y cancelUrl para pago de producto'
        })
      };
    }
    
    console.log('🛒 Creando sesión de checkout:');
    console.log('   - Usuario ID:', userId);
    console.log('   - Price ID:', priceId);
    console.log('   - Success URL:', successUrl);
    console.log('   - Cancel URL:', cancelUrl);

    // Si el priceId es el de prueba, crear un producto y precio dinámicamente
    let finalPriceId = priceId;
    
    if (priceId === 'price_1234567890abcdef') {
      console.log('🔧 Creando producto de prueba...');
      
      // Crear producto
      const product = await stripe.products.create({
        name: 'Resmoke Premium',
        description: 'Suscripción premium mensual para Resmoke',
      });

      // Crear precio
      const price = await stripe.prices.create({
        unit_amount: 1500, // €15.00 en centavos
        currency: 'eur',
        recurring: {
          interval: 'month',
        },
        product: product.id,
      });

      finalPriceId = price.id;
      console.log(`✅ Producto creado: ${product.id}`);
      console.log(`✅ Precio creado: ${price.id}`);
    }

    let session;
    if (mode === 'payment') {
      const amountCents = Math.round(Number(amount) * 100);
      if (amountCents <= 0) {
        return {
          statusCode: 200,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ free: true })
        };
      }
      session = await stripe.checkout.sessions.create({
        mode: 'payment',
        payment_method_types: ['card'],
        customer_email: buyerEmail,
        line_items: [
          {
            price_data: {
              currency: 'eur',
              product_data: { name: productName || `Producto ${productId}` },
              unit_amount: amountCents,
            },
            quantity: 1,
          },
        ],
        success_url: successUrl,
        cancel_url: cancelUrl,
        client_reference_id: String(buyerUserId),
        metadata: {
          type: 'product_purchase',
          productId: String(productId),
          buyerUserId: String(buyerUserId),
        },
      });
    } else {
      // Crear sesión de checkout para suscripción
      const sessionSub = await stripe.checkout.sessions.create({
        mode: 'subscription',
        line_items: [
          {
            price: finalPriceId,
            quantity: 1,
          },
        ],
        success_url: successUrl,
        cancel_url: cancelUrl,
        client_reference_id: userId.toString(),
        metadata: {
          userId: userId.toString(),
        },
      });
      session = sessionSub;
    }

    console.log('✅ Sesión de checkout creada:');
    console.log('   - Session ID:', session.id);
    console.log('   - Checkout URL:', session.url);
    console.log('   - Success URL configurada:', session.success_url);
    console.log('   - Cancel URL configurada:', session.cancel_url);

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ sessionId: session.id, url: session.url })
    };
  } catch (error) {
    console.error('❌ Error creando sesión de checkout:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        error: 'Error interno del servidor',
        details: error.message,
        code: error.code || null,
        type: error.type || null,
        statusCode: error.statusCode || 500
      })
    };
  }
};
