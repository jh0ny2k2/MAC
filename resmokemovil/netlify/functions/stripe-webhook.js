const getRequiredEnv = (name) => {
  const value = process.env[name];
  if (!value) throw new Error(`${name} no configurada`);
  return value;
};

const stripe = require('stripe')(getRequiredEnv('STRIPE_SECRET_KEY'));
const { createClient } = require('@supabase/supabase-js');

// Configurar Supabase con valores del .env
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
      body: 'Method Not Allowed'
    };
  }

  const sig = event.headers['stripe-signature'];
  let stripeEvent;

  try {
    stripeEvent = stripe.webhooks.constructEvent(
      event.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.log(`Webhook signature verification failed.`, err.message);
    return {
      statusCode: 400,
      body: `Webhook Error: ${err.message}`
    };
  }

  // Manejar el evento
  switch (stripeEvent.type) {
    case 'checkout.session.completed':
      const session = stripeEvent.data.object;
      console.log('🎉 Checkout session completed:', session.id);
      console.log('📋 Session data:', JSON.stringify(session, null, 2));
      
      try {
        if (session.mode === 'subscription') {
          console.log('🔍 Retrieving subscription:', session.subscription);
          const subscription = await stripe.subscriptions.retrieve(session.subscription);
          const userId = session.metadata?.userId;
          console.log('👤 User ID from metadata:', userId);
          console.log('🏷️ Full metadata:', JSON.stringify(session.metadata, null, 2));
          if (userId && subscription) {
            const subscriptionData = {
              user_id: parseInt(userId),
              stripe_subscription_id: subscription.id,
              stripe_customer_id: subscription.customer,
              status: subscription.status,
              plan_type: 'premium',
              current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
              current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            };
            const { error } = await supabase
              .from('subscriptions')
              .insert(subscriptionData);
            if (error) {
              console.error('❌ Error creating subscription in database:', error);
            } else {
              console.log('✅ Subscription created in database successfully!');
            }
          } else {
            console.log('❌ Missing userId or subscription:', { userId, hasSubscription: !!subscription });
          }
        } else if (session.mode === 'payment') {
          const productId = session.metadata?.productId;
          const buyerUserId = session.metadata?.buyerUserId;
          const amountPaid = (session.amount_total || 0) / 100;
          console.log('🧾 Payment completed for product purchase', { productId, buyerUserId, amountPaid });
          if (productId && buyerUserId) {
            const { error } = await supabase
              .from('products')
              .update({
                status: 'sold',
                buyer_user_id: parseInt(buyerUserId),
                sold_date: new Date().toISOString(),
                sale_price: amountPaid
              })
              .eq('id', productId);
            if (error) {
              console.error('❌ Error updating product after payment:', error);
            } else {
              console.log('✅ Product marked as sold');
            }
          } else {
            console.log('❌ Missing productId or buyerUserId in metadata');
          }
        } else {
          console.log('ℹ️ Unrecognized session mode:', session.mode);
        }
      } catch (error) {
        console.error('❌ Error processing checkout session:', error);
        console.error('❌ Error stack:', error.stack);
      }
      break;
      
    case 'customer.subscription.created':
    case 'customer.subscription.updated':
    case 'customer.subscription.deleted':
      const subscription = stripeEvent.data.object;
      console.log(`📊 Subscription ${stripeEvent.type}:`, subscription.id);
      
      try {
        // Actualizar o crear suscripción en la base de datos
        const subscriptionData = {
          stripe_subscription_id: subscription.id,
          stripe_customer_id: subscription.customer,
          status: subscription.status,
          plan_type: 'premium',
          current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
          current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
          updated_at: new Date().toISOString()
        };

        if (stripeEvent.type === 'customer.subscription.deleted') {
          subscriptionData.status = 'canceled';
        }

        // Intentar actualizar primero, si no existe, crear
        const { data, error } = await supabase
          .from('subscriptions')
          .upsert(subscriptionData, { 
            onConflict: 'stripe_subscription_id',
            ignoreDuplicates: false 
          });

        if (error) {
          console.error('❌ Error updating subscription:', error);
        } else {
          console.log('✅ Subscription updated successfully');
        }
      } catch (error) {
        console.error('❌ Error processing subscription event:', error);
      }
      break;

    case 'invoice.payment_succeeded':
    case 'invoice.payment_failed':
      const invoice = stripeEvent.data.object;
      console.log(`💳 Invoice ${stripeEvent.type}:`, invoice.id);
      
      // Aquí puedes agregar lógica adicional para manejar pagos
      break;

    default:
      console.log(`🤷 Unhandled event type ${stripeEvent.type}`);
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ received: true })
  };
};
