const { createClient } = require('@supabase/supabase-js');

const getRequiredEnv = (name) => {
  const value = process.env[name];
  if (!value) throw new Error(`${name} no configurada`);
  return value;
};

const stripe = require('stripe')(getRequiredEnv('STRIPE_SECRET_KEY'));

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl) throw new Error('SUPABASE_URL no configurada');
if (!supabaseServiceKey) throw new Error('SUPABASE_SERVICE_ROLE_KEY no configurada');

const supabase = createClient(supabaseUrl, supabaseServiceKey);

exports.handler = async (event, context) => {
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

  // Manejar preflight CORS
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

  try {
    const { sessionId, userId } = JSON.parse(event.body);
    
    console.log('🔄 Processing subscription from frontend...');
    console.log('🎫 Session ID:', sessionId);
    console.log('👤 User ID:', userId);
    
    if (!sessionId || !userId) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          success: false, 
          error: 'Session ID and User ID are required' 
        })
      };
    }
    
    // Obtener información de la sesión de Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['subscription', 'customer']
    });
    
    console.log('📋 Stripe session retrieved:', {
      id: session.id,
      payment_status: session.payment_status,
      subscription_id: session.subscription?.id,
      customer_id: session.customer?.id
    });
    
    if (session.payment_status !== 'paid') {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          success: false, 
          error: 'Payment not completed' 
        })
      };
    }
    
    if (!session.subscription) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          success: false, 
          error: 'No subscription found in session' 
        })
      };
    }
    
    // Obtener detalles de la suscripción
    const subscription = session.subscription;
    
    // Verificar si la suscripción ya existe
    const { data: existingSubscription } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('stripe_subscription_id', subscription.id)
      .single();
    
    if (existingSubscription) {
      console.log('ℹ️ Subscription already exists:', existingSubscription.id);
      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          success: true, 
          message: 'Subscription already processed',
          subscription: existingSubscription 
        })
      };
    }
    
    // Crear nueva suscripción
    const subscriptionData = {
      user_id: userId,
      stripe_subscription_id: subscription.id,
      stripe_customer_id: subscription.customer,
      status: subscription.status,
      plan_type: 'premium',
      current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
      current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    console.log('💾 Subscription data to insert:', JSON.stringify(subscriptionData, null, 2));
    
    const { data, error } = await supabase
      .from('subscriptions')
      .insert(subscriptionData)
      .select();
    
    if (error) {
      console.error('❌ Subscription creation failed:', error);
      return {
        statusCode: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          success: false, 
          error: error.message 
        })
      };
    }
    
    console.log('✅ Subscription created successfully!');
    console.log('✅ Created data:', data);
    
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        success: true, 
        message: 'Subscription processed successfully',
        subscription: data[0] 
      })
    };
    
  } catch (error) {
    console.error('❌ Process subscription error:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        success: false, 
        error: error.message 
      })
    };
  }
};
