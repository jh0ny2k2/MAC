const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl) throw new Error('SUPABASE_URL no configurada');
if (!supabaseServiceKey) throw new Error('SUPABASE_SERVICE_ROLE_KEY no configurada');

const supabase = createClient(supabaseUrl, supabaseServiceKey);

exports.handler = async (event, context) => {
  // Configurar CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  // Manejar preflight request
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  // Solo permitir POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };
  }

  try {
    const { userId, subscriptionId, customerId } = JSON.parse(event.body);
    
    console.log('🧪 Test webhook called with:', { userId, subscriptionId, customerId });
    
    // Simular datos de suscripción
    const subscriptionData = {
      user_id: parseInt(userId),
      stripe_subscription_id: subscriptionId || `sub_test_${Date.now()}`,
      stripe_customer_id: customerId || `cus_test_${Date.now()}`,
      status: 'active',
      plan_type: 'premium',
      current_period_start: new Date().toISOString(),
      current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 días
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    console.log('💾 Creating test subscription:', subscriptionData);
    
    // Crear registro de suscripción en Supabase
    const { data, error } = await supabase
      .from('subscriptions')
      .insert(subscriptionData);

    if (error) {
      console.error('❌ Error creating test subscription:', error);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ 
          error: 'Error creating test subscription',
          details: error.message 
        })
      };
    }

    console.log('✅ Test subscription created successfully!');
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        success: true, 
        message: 'Test webhook processed successfully',
        data: subscriptionData
      })
    };

  } catch (error) {
    console.error('❌ Error in test webhook:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Internal server error',
        details: error.message 
      })
    };
  }
};
