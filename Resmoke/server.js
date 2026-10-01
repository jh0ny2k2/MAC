import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';
import CounterOfferAccepted from './src/emails/CounterOfferAccepted.js';
import CounterOfferReceived from './src/emails/CounterOfferReceived.js';
import ProductAdded from './src/emails/ProductAdded.js';
import UnreadMessageNotification from './src/emails/UnreadMessageNotification.js';
import { BetaAnalyticsDataClient } from '@google-analytics/data';

// Cargar variables de entorno
dotenv.config();

// Configurar Supabase con la clave de servicio
const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl) {
  console.error('SUPABASE_URL no configurada');
  process.exit(1);
}

if (!supabaseServiceKey) {
  console.error('SUPABASE_SERVICE_ROLE_KEY no configurada');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const getEmailVerificationSecret = () => {
  const secret = process.env.EMAIL_VERIFICATION_SECRET;
  if (!secret) throw new Error('EMAIL_VERIFICATION_SECRET no configurada');
  return secret;
};

const app = express();
const port = process.env.PORT || 3001;

// Inicializar Stripe con la clave secreta
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Middleware
app.use(cors());
app.use(express.json());

// ─── Auth endpoints (bcrypt) ────────────────────────────────────────────────

app.post('/api/auth/register', async (req, res) => {
  try {
    const { nombre, email, password, telefono, fecha_nacimiento } = req.body;
    if (!nombre || !email || !password) {
      return res.status(400).json({ success: false, error: 'nombre, email y password son requeridos' });
    }
    const normalizedEmail = email.toLowerCase().trim();
    const { data: existing } = await supabase.from('Users').select('id').eq('email', normalizedEmail).maybeSingle();
    if (existing) {
      return res.status(409).json({ success: false, error: 'Ya existe una cuenta con este correo electrónico' });
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const { data: newUser, error: insertError } = await supabase
      .from('Users')
      .insert({
        nombre: nombre.trim(),
        email: normalizedEmail,
        telefono: (telefono || '').trim(),
        fecha_nacimiento: fecha_nacimiento || null,
        password: hashedPassword,
        rol: 'usuario',
        creado_en: new Date().toISOString()
      })
      .select()
      .single();
    if (insertError) {
      return res.status(500).json({ success: false, error: insertError.message });
    }
    const { password: _, ...userWithoutPassword } = newUser;
    return res.status(201).json({ success: true, user: userWithoutPassword });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'email y password son requeridos' });
    }
    const normalizedEmail = email.toLowerCase().trim();
    const { data: user, error } = await supabase
      .from('Users')
      .select('*')
      .eq('email', normalizedEmail)
      .maybeSingle();
    if (error) return res.status(500).json({ success: false, error: error.message });
    if (!user) return res.status(401).json({ success: false, error: 'Credenciales incorrectas' });
    if (!user.password) {
      return res.status(401).json({ success: false, error: 'Esta cuenta usa Google. Inicia sesión con Google.' });
    }
    let passwordMatch = false;
    try { passwordMatch = await bcrypt.compare(password, user.password); } catch (_) {}
    if (!passwordMatch) {
      try {
        const hash = await import('hash.js');
        const sha256 = hash.default.sha256().update(password).digest('hex');
        if (sha256 === user.password) {
          passwordMatch = true;
          const newHash = await bcrypt.hash(password, 12);
          await supabase.from('Users').update({ password: newHash }).eq('id', user.id);
        }
      } catch (_) {}
    }
    if (!passwordMatch) {
      return res.status(401).json({ success: false, error: 'Credenciales incorrectas' });
    }
    await supabase.from('Users').update({ ultimo_acceso: new Date().toISOString() }).eq('id', user.id);
    const { password: _, ...userWithoutPassword } = user;
    return res.json({ success: true, user: userWithoutPassword });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/auth/change-password', async (req, res) => {
  try {
    const { userId, currentPassword, newPassword } = req.body;
    if (!userId || !currentPassword || !newPassword) {
      return res.status(400).json({ success: false, error: 'userId, currentPassword y newPassword son requeridos' });
    }
    const { data: user, error } = await supabase
      .from('Users')
      .select('password')
      .eq('id', userId)
      .maybeSingle();
    if (error) return res.status(500).json({ success: false, error: error.message });
    if (!user) return res.status(404).json({ success: false, error: 'Usuario no encontrado' });
    if (!user.password) {
      return res.status(400).json({ success: false, error: 'Esta cuenta usa Google. No puedes cambiar la contraseña.' });
    }
    let passwordMatch = false;
    try { passwordMatch = await bcrypt.compare(currentPassword, user.password); } catch (_) {}
    if (!passwordMatch) {
      try {
        const hash = await import('hash.js');
        const sha256 = hash.default.sha256().update(currentPassword).digest('hex');
        if (sha256 === user.password) passwordMatch = true;
      } catch (_) {}
    }
    if (!passwordMatch) {
      return res.status(401).json({ success: false, error: 'La contraseña actual es incorrecta' });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    const { error: updateError } = await supabase
      .from('Users')
      .update({ password: hashedPassword })
      .eq('id', userId);
    if (updateError) return res.status(500).json({ success: false, error: updateError.message });
    return res.json({ success: true, message: 'Contraseña actualizada exitosamente' });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/auth/reset-password', async (req, res) => {
  try {
    const { token, email, newPassword } = req.body;
    if (!token || !email || !newPassword) {
      return res.status(400).json({ success: false, error: 'token, email y newPassword son requeridos' });
    }
    const { data: tokenRecord, error: tokenError } = await supabase
      .from('password_reset_tokens')
      .select('*')
      .eq('token', token)
      .eq('email', email.toLowerCase().trim())
      .eq('used', false)
      .single();
    if (tokenError || !tokenRecord) {
      return res.status(400).json({ success: false, error: 'Token inválido o expirado' });
    }
    if (new Date(tokenRecord.expires_at) < new Date()) {
      return res.status(400).json({ success: false, error: 'Token expirado' });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    const { error: updateError } = await supabase
      .from('Users')
      .update({ password: hashedPassword })
      .eq('email', email.toLowerCase().trim());
    if (updateError) return res.status(500).json({ success: false, error: updateError.message });
    await supabase.from('password_reset_tokens').update({ used: true }).eq('id', tokenRecord.id);
    return res.json({ success: true, message: 'Contraseña actualizada exitosamente' });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// Verificación de correo (modo local)
app.get('/api/verify-email', async (req, res) => {
  try {
    const email = String(req.query.email || '').toLowerCase().trim();
    const token = String(req.query.token || '');
    if (!email && !token) return res.status(400).json({ success: false, error: 'token o email requerido' });
    if (email) {
      const { error } = await supabase.from('Users').update({ is_verified: true }).eq('email', email);
      if (error) return res.status(500).json({ success: false, error: error.message });
      return res.redirect('/verificacion-identidad');
    }
    const crypto = await import('crypto');
    const secret = getEmailVerificationSecret();
    const parts = token.split('.');
    if (parts.length !== 4) return res.status(400).json({ success: false, error: 'token inválido' });
    const base64urlToStr = (b) => Buffer.from(b, 'base64url').toString();
    const emailDecoded = base64urlToStr(parts[0]);
    const iat = parseInt(base64urlToStr(parts[1]));
    const exp = parseInt(base64urlToStr(parts[2]));
    const sig = parts[3];
    const expected = crypto.createHmac('sha256', secret).update(`${emailDecoded}:${iat}:${exp}:1`).digest('base64url');
    if (expected !== sig) return res.status(400).json({ success: false, error: 'firma inválida' });
    if (Math.floor(Date.now() / 1000) > exp) return res.status(400).json({ success: false, error: 'token expirado' });
    const appBaseUrl = process.env.APP_BASE_URL || 'http://localhost:5173';
    return res.redirect(`${appBaseUrl}/verificacion-identidad?token=${encodeURIComponent(token)}`);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/verify-email-start', async (req, res) => {
  try {
    const email = String(req.body.email || '').toLowerCase().trim();
    const nombre = String(req.body.nombre || '').trim();
    if (!email) return res.status(400).json({ success: false, error: 'email requerido' });
    const { data: user } = await supabase.from('Users').select('id,email').eq('email', email).maybeSingle();
    if (!user) return res.status(404).json({ success: false, error: 'usuario no encontrado' });
    const secret = getEmailVerificationSecret();
    const crypto = await import('crypto');
    const iat = Math.floor(Date.now() / 1000);
    const exp = iat + 60 * 60;
    const base64url = (s) => Buffer.from(s).toString('base64url');
    const sig = crypto.createHmac('sha256', secret).update(`${email}:${iat}:${exp}:1`).digest('base64url');
    const token = `${base64url(email)}.${base64url(String(iat))}.${base64url(String(exp))}.${sig}`;

    const code = String(crypto.randomInt(0, 1000000)).padStart(6, '0');
    const codeHash = crypto.createHmac('sha256', secret).update(code).digest('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString();

    const { error: saveError } = await supabase
      .from('Users')
      .update({
        email_verification_code_hash: codeHash,
        email_verification_code_expires_at: expiresAt
      })
      .eq('id', user.id);
    if (saveError) return res.status(500).json({ success: false, error: saveError.message });

    return res.status(501).json({ success: false, error: 'Verificacion por email no disponible: canal de correo eliminado' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/verify-email-complete', async (req, res) => {
  try {
    const token = String(req.body.token || '');
    const codeInput = String(req.body.code || '').toUpperCase().trim();
    if (!token || !codeInput) return res.status(400).json({ success: false, error: 'token y code requeridos' });
    const crypto = await import('crypto');
    const secret = getEmailVerificationSecret();
    const parts = token.split('.');
    if (parts.length !== 4) return res.status(400).json({ success: false, error: 'token inválido' });
    const base64urlToStr = (b) => Buffer.from(b, 'base64url').toString();
    const email = base64urlToStr(parts[0]);
    const iat = parseInt(base64urlToStr(parts[1]));
    const exp = parseInt(base64urlToStr(parts[2]));
    const sig = parts[3];
    const expected = crypto.createHmac('sha256', secret).update(`${email}:${iat}:${exp}:1`).digest('base64url');
    if (expected !== sig) return res.status(400).json({ success: false, error: 'firma inválida' });
    if (Math.floor(Date.now() / 1000) > exp) return res.status(400).json({ success: false, error: 'token expirado' });
    const normalizedEmail = email.toLowerCase().trim();
    const { data: user, error: fetchError } = await supabase
      .from('Users')
      .select('id,is_verified,email_verification_code_hash,email_verification_code_expires_at')
      .eq('email', normalizedEmail)
      .maybeSingle();
    if (fetchError) return res.status(500).json({ success: false, error: fetchError.message });
    if (!user) return res.status(404).json({ success: false, error: 'usuario no encontrado' });
    if (user.is_verified) return res.json({ success: true });
    if (!user.email_verification_code_hash || !user.email_verification_code_expires_at) {
      return res.status(400).json({ success: false, error: 'no hay verificación pendiente' });
    }
    const expiresAtMs = Date.parse(user.email_verification_code_expires_at);
    if (!expiresAtMs || Date.now() > expiresAtMs) {
      return res.status(400).json({ success: false, error: 'código expirado' });
    }
    const codeHash = crypto.createHmac('sha256', secret).update(codeInput).digest('hex');
    if (codeHash !== user.email_verification_code_hash) {
      return res.status(400).json({ success: false, error: 'código incorrecto' });
    }
    const { error: updateError } = await supabase
      .from('Users')
      .update({
        is_verified: true,
        email_verification_code_hash: null,
        email_verification_code_expires_at: null
      })
      .eq('id', user.id);
    if (updateError) return res.status(500).json({ success: false, error: updateError.message });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Endpoint para crear sesión de checkout
app.post('/api/stripe/create-checkout-session', async (req, res) => {
  try {
    const { userId, priceId, successUrl, cancelUrl } = req.body;
    
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

    // Crear sesión de checkout
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
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

    console.log('✅ Sesión de checkout creada:');
    console.log('   - Session ID:', session.id);
    console.log('   - Checkout URL:', session.url);
    console.log('   - Success URL configurada:', session.success_url);
    console.log('   - Cancel URL configurada:', session.cancel_url);

    res.json({
      sessionId: session.id,
      url: session.url,
    });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ error: error.message });
  }
});

// ESCROW: Crear sesión de pago para compra de producto (modo payment)
app.post('/api/escrow/create-checkout-session', async (req, res) => {
  try {
    const { productId, buyerUserId, buyerEmail, successUrl, cancelUrl, amount } = req.body;
    if (!productId || !buyerUserId || !buyerEmail) {
      return res.status(400).json({ error: 'productId, buyerUserId y buyerEmail son requeridos' });
    }

    const { data: product, error: productError } = await supabase
      .from('products')
      .select('id, name, price, user_id')
      .eq('id', productId)
      .single();
    if (productError || !product) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    const amountCents = Math.round(Number((amount ?? product.price) || 0) * 100);
    if (amountCents <= 0) {
      const { error: updateError } = await supabase
        .from('products')
        .update({
          status: 'sold',
          buyer_user_id: buyerUserId,
          sold_date: new Date().toISOString(),
          sale_price: 0
        })
        .eq('id', productId);
      if (updateError) {
        return res.status(500).json({ error: updateError.message || 'No se pudo marcar como vendido' });
      }
      return res.json({ free: true, redirect: successUrl || `${process.env.APP_BASE_URL || 'http://localhost:5173'}/purchases` });
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      customer_email: buyerEmail,
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: { name: product.name || `Producto ${product.id}` },
            unit_amount: amountCents,
          },
          quantity: 1,
        },
      ],
      success_url: successUrl || `${process.env.APP_BASE_URL || 'http://localhost:5173'}/purchases?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl || `${process.env.APP_BASE_URL || 'http://localhost:5173'}/product/${productId}`,
      metadata: {
        type: 'product_purchase',
        productId: String(productId),
        buyerUserId: String(buyerUserId),
        sellerUserId: String(product.user_id),
      },
    });

    return res.json({ url: session.url, sessionId: session.id });
  } catch (err) {
    console.error('❌ Error creando sesión de escrow:', err);
    return res.status(500).json({ error: err.message });
  }
});

// Endpoint para crear portal del cliente
app.post('/api/stripe/create-customer-portal', async (req, res) => {
  try {
    const { customerId, returnUrl } = req.body;
    
    console.log('📋 Datos recibidos:', { customerId, returnUrl });
    
    let stripeCustomerId = customerId;
    
    // Si el customerId parece ser un email, buscar o crear el cliente
    if (customerId.includes('@')) {
      console.log('🔍 Buscando cliente por email:', customerId);
      
      // Buscar cliente existente por email
      const customers = await stripe.customers.list({
        email: customerId,
        limit: 1,
      });
      
      if (customers.data.length > 0) {
        stripeCustomerId = customers.data[0].id;
        console.log('✅ Cliente encontrado:', stripeCustomerId);
      } else {
        // Crear nuevo cliente si no existe
        console.log('🆕 Creando nuevo cliente...');
        const customer = await stripe.customers.create({
          email: customerId,
        });
        stripeCustomerId = customer.id;
        console.log('✅ Cliente creado:', stripeCustomerId);
      }
    }

    console.log('🚀 Creando sesión del portal para cliente:', stripeCustomerId);

    // Verificar si el cliente tiene suscripciones activas
    const subscriptions = await stripe.subscriptions.list({
      customer: stripeCustomerId,
      status: 'active',
      limit: 1,
    });

    console.log('📊 Suscripciones encontradas:', subscriptions.data.length);

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: stripeCustomerId,
      return_url: returnUrl,
    });

    console.log('✅ Portal creado exitosamente:', portalSession.url);

    res.json({
      url: portalSession.url,
    });
  } catch (error) {
    console.error('❌ Error creating customer portal:', error);
    console.error('Error details:', {
      message: error.message,
      type: error.type,
      code: error.code,
      statusCode: error.statusCode
    });
    
    // Proporcionar un mensaje más específico según el tipo de error
    let errorMessage = 'Error al crear el portal del cliente';
    
    if (error.code === 'billing_portal_configuration_inactive') {
      errorMessage = 'El portal del cliente no está configurado en Stripe. Por favor, configúralo en tu dashboard de Stripe.';
    } else if (error.code === 'customer_not_found') {
      errorMessage = 'Cliente no encontrado en Stripe.';
    } else if (error.statusCode === 400) {
      errorMessage = 'Configuración incorrecta del portal del cliente. Verifica tu configuración en Stripe.';
    }
    
    res.status(500).json({ 
      error: errorMessage,
      details: error.message 
    });
  }
});

// Webhook para manejar eventos de Stripe
app.post('/api/stripe/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.log(`Webhook signature verification failed.`, err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Manejar el evento
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      console.log('🎉 Checkout session completed:', session.id);
      console.log('📋 Session data:', JSON.stringify(session, null, 2));
      
      try {
        // Obtener la suscripción de Stripe
        console.log('🔍 Retrieving subscription:', session.subscription);
        const subscription = await stripe.subscriptions.retrieve(session.subscription);
        console.log('📊 Subscription data:', JSON.stringify(subscription, null, 2));
        
        // Extraer el userId del metadata de la sesión
        const userId = session.metadata?.userId;
        console.log('👤 User ID from metadata:', userId);
        console.log('🏷️ Full metadata:', JSON.stringify(session.metadata, null, 2));
        
        if (userId && subscription) {
          console.log('✅ Both userId and subscription found, creating database record...');
          
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
          
          console.log('💾 Data to insert:', JSON.stringify(subscriptionData, null, 2));
          
          // Crear registro de suscripción en Supabase
          const { data, error } = await supabase
            .from('subscriptions')
            .insert(subscriptionData);

          if (error) {
            console.error('❌ Error creating subscription in database:', error);
            console.error('❌ Error details:', JSON.stringify(error, null, 2));
          } else {
            console.log('✅ Subscription created in database successfully!');
            console.log('✅ Created data:', JSON.stringify(data, null, 2));
          }
        } else {
          console.log('❌ Missing userId or subscription:');
          console.log('   - userId:', userId);
          console.log('   - subscription:', subscription ? 'Found' : 'Not found');
        }
      } catch (error) {
        console.error('❌ Error processing checkout session:', error);
        console.error('❌ Error stack:', error.stack);
      }
      break;
      
    case 'customer.subscription.created':
      const subscription = event.data.object;
      console.log('Subscription created:', subscription.id);
      break;
      
    case 'customer.subscription.updated':
      const updatedSubscription = event.data.object;
      console.log('Subscription updated:', updatedSubscription.id);
      
      try {
        // Actualizar suscripción en la base de datos
        const { data, error } = await supabase
          .from('subscriptions')
          .update({
            status: updatedSubscription.status,
            current_period_start: new Date(updatedSubscription.current_period_start * 1000).toISOString(),
            current_period_end: new Date(updatedSubscription.current_period_end * 1000).toISOString(),
            updated_at: new Date().toISOString()
          })
          .eq('stripe_subscription_id', updatedSubscription.id);

        if (error) {
          console.error('Error updating subscription in database:', error);
        } else {
          console.log('✅ Subscription updated in database');
        }
      } catch (error) {
        console.error('Error processing subscription update:', error);
      }
      break;
      
    case 'customer.subscription.deleted':
      const deletedSubscription = event.data.object;
      console.log('Subscription deleted:', deletedSubscription.id);
      
      try {
        // Marcar suscripción como cancelada en la base de datos
        const { data, error } = await supabase
          .from('subscriptions')
          .update({
            status: 'canceled',
            updated_at: new Date().toISOString()
          })
          .eq('stripe_subscription_id', deletedSubscription.id);

        if (error) {
          console.error('Error canceling subscription in database:', error);
        } else {
          console.log('✅ Subscription canceled in database');
        }
      } catch (error) {
        console.error('Error processing subscription deletion:', error);
      }
      break;
      
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
});

// Endpoint para procesar suscripción usando session_id
app.post('/api/stripe/process-subscription', async (req, res) => {
  try {
    const { sessionId, userId } = req.body;
    
    console.log('🔄 Processing subscription from frontend...');
    console.log('🎫 Session ID:', sessionId);
    console.log('👤 User ID:', userId);
    
    if (!sessionId || !userId) {
      return res.status(400).json({ 
        success: false, 
        error: 'Session ID and User ID are required' 
      });
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
      return res.status(400).json({ 
        success: false, 
        error: 'Payment not completed' 
      });
    }
    
    if (!session.subscription) {
      return res.status(400).json({ 
        success: false, 
        error: 'No subscription found in session' 
      });
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
      return res.json({ 
        success: true, 
        message: 'Subscription already processed',
        subscription: existingSubscription 
      });
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
      return res.status(500).json({ 
        success: false, 
        error: error.message 
      });
    }
    
    console.log('✅ Subscription created successfully!');
    console.log('✅ Created data:', data);
    
    res.json({ 
      success: true, 
      message: 'Subscription processed successfully',
      subscription: data[0] 
    });
    
  } catch (error) {
    console.error('❌ Process subscription error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Endpoint de prueba para simular webhook
app.post('/api/stripe/test-webhook', async (req, res) => {
  console.log('🧪 Testing webhook simulation...');
  
  try {
    const { userId, subscriptionId } = req.body;
    
    if (!userId || !subscriptionId) {
      return res.status(400).json({ 
        error: 'userId and subscriptionId are required' 
      });
    }
    
    console.log('👤 Test User ID:', userId);
    console.log('📋 Test Subscription ID:', subscriptionId);
    
    // Simular datos de suscripción
    const subscriptionData = {
      user_id: parseInt(userId),
      stripe_subscription_id: subscriptionId,
      stripe_customer_id: 'test_customer_' + Date.now(),
      status: 'active',
      plan_type: 'premium',
      current_period_start: new Date().toISOString(),
      current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 días
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    console.log('💾 Test data to insert:', JSON.stringify(subscriptionData, null, 2));
    
    // Crear registro de suscripción en Supabase
    const { data, error } = await supabase
      .from('subscriptions')
      .insert(subscriptionData);

    if (error) {
      console.error('❌ Error creating test subscription:', error);
      console.error('❌ Error details:', JSON.stringify(error, null, 2));
      return res.status(500).json({ error: error.message });
    } else {
      console.log('✅ Test subscription created successfully!');
      console.log('✅ Created data:', JSON.stringify(data, null, 2));
      return res.json({ 
        success: true, 
        message: 'Test subscription created successfully',
        data: data 
      });
    }
  } catch (error) {
    console.error('❌ Error in test webhook:', error);
    return res.status(500).json({ error: error.message });
  }
});

// Endpoint de salud
// Endpoint para obtener datos de administración de Stripe
app.get('/api/stripe/admin-data', async (req, res) => {
  try {
    const { type } = req.query;
    
    console.log('📊 Obteniendo datos de administración de Stripe:', type);

    let data = {};

    switch (type) {
      case 'overview':
        // Obtener resumen general
        const [customers, payments, subscriptions, balance] = await Promise.all([
          stripe.customers.list({ limit: 100 }),
          stripe.paymentIntents.list({ limit: 100 }),
          stripe.subscriptions.list({ limit: 100 }),
          stripe.balance.retrieve()
        ]);

        data = {
          totalCustomers: customers.data.length,
          totalPayments: payments.data.length,
          totalSubscriptions: subscriptions.data.length,
          totalRevenue: payments.data
            .filter(p => p.status === 'succeeded')
            .reduce((sum, p) => sum + p.amount, 0),
          availableBalance: balance.available.reduce((sum, b) => sum + b.amount, 0),
          pendingBalance: balance.pending.reduce((sum, b) => sum + b.amount, 0),
          recentActivity: payments.data.slice(0, 5).map(payment => ({
            id: payment.id,
            type: 'payment',
            amount: payment.amount,
            currency: payment.currency,
            status: payment.status,
            created: payment.created,
            description: payment.description || 'Pago'
          }))
        };
        break;

      case 'customers':
        const customersData = await stripe.customers.list({ limit: 100 });
        data = customersData.data.map(customer => ({
          id: customer.id,
          email: customer.email,
          name: customer.name,
          created: customer.created,
          subscriptions: customer.subscriptions?.data?.length || 0
        }));
        break;

      case 'payments':
        const paymentsData = await stripe.paymentIntents.list({ limit: 100 });
        data = paymentsData.data.map(payment => ({
          id: payment.id,
          amount: payment.amount,
          currency: payment.currency,
          status: payment.status,
          created: payment.created,
          customer: payment.customer,
          description: payment.description
        }));
        break;

      case 'subscriptions':
        const subscriptionsData = await stripe.subscriptions.list({ limit: 100 });
        data = subscriptionsData.data.map(subscription => ({
          id: subscription.id,
          customer: subscription.customer,
          status: subscription.status,
          current_period_start: subscription.current_period_start,
          current_period_end: subscription.current_period_end,
          plan: subscription.items.data[0]?.price || null,
          amount: subscription.items.data[0]?.price?.unit_amount || 0,
          currency: subscription.items.data[0]?.price?.currency || 'eur'
        }));
        break;

      case 'products':
        const productsData = await stripe.products.list({ limit: 100 });
        data = productsData.data.map(product => ({
          id: product.id,
          name: product.name,
          description: product.description,
          active: product.active,
          created: product.created,
          images: product.images
        }));
        break;

      case 'prices':
        const pricesData = await stripe.prices.list({ limit: 100 });
        data = pricesData.data.map(price => ({
          id: price.id,
          product: price.product,
          unit_amount: price.unit_amount,
          currency: price.currency,
          recurring: price.recurring,
          active: price.active,
          created: price.created
        }));
        break;

      case 'invoices':
        const invoicesData = await stripe.invoices.list({ limit: 100 });
        data = invoicesData.data.map(invoice => ({
          id: invoice.id,
          customer: invoice.customer,
          amount_paid: invoice.amount_paid,
          amount_due: invoice.amount_due,
          currency: invoice.currency,
          status: invoice.status,
          created: invoice.created,
          number: invoice.number
        }));
        break;

      case 'charges':
        const chargesData = await stripe.charges.list({ limit: 100 });
        data = chargesData.data.map(charge => ({
          id: charge.id,
          amount: charge.amount,
          currency: charge.currency,
          status: charge.status,
          created: charge.created,
          customer: charge.customer,
          description: charge.description
        }));
        break;

      case 'balance':
        const balanceData = await stripe.balance.retrieve();
        data = {
          available: balanceData.available,
          pending: balanceData.pending,
          connect_reserved: balanceData.connect_reserved || []
        };
        break;

      default:
        return res.status(400).json({ error: 'Tipo de datos no válido' });
    }

    console.log(`✅ Datos obtenidos para ${type}:`, Object.keys(data).length || 'objeto');
    res.json(data);

  } catch (error) {
    console.error('Error obteniendo datos de Stripe:', error);
    res.status(500).json({ 
      error: 'Error interno del servidor',
      message: error.message 
    });
  }
});

// [REMOVED] Ruta duplicada de /api/email/send reemplazada por la versión consolidada más abajo

app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(port, () => {
  console.log(`🚀 Servidor backend ejecutándose en http://localhost:${port}`);
  console.log(`📊 Endpoint de salud: http://localhost:${port}/health`);
  console.log(`💳 Stripe configurado con clave: ${process.env.STRIPE_SECRET_KEY ? '✅' : '❌'}`);
  console.log(`📈 GA property: ${gaPropertyId ? '✅' : '❌'}`);
  console.log(`📈 GA client email: ${gaClientEmail ? '✅' : '❌'}`);
  console.log(`📈 GA private key: ${gaPrivateKey ? '✅' : '❌'}`);
  console.log(`📈 GA client ready: ${gaClient ? '✅' : '❌'}`);
});

const gaPropertyIdRaw = process.env.GA_PROPERTY_ID || process.env.VITE_GA_PROPERTY_ID;
const gaPropertyId = gaPropertyIdRaw ? String(gaPropertyIdRaw).replace(/[^0-9]/g, '') : undefined;
const gaClientEmail = process.env.GA_CLIENT_EMAIL || process.env.VITE_GA_CLIENT_EMAIL;
const gaPrivateKeyRaw = process.env.GA_PRIVATE_KEY || process.env.VITE_GA_PRIVATE_KEY;
const gaPrivateKey = gaPrivateKeyRaw ? gaPrivateKeyRaw.replace(/\\n/g, '\n') : undefined;
let gaClient = null;
try {
  if (gaClientEmail && gaPrivateKey) {
    gaClient = new BetaAnalyticsDataClient({ credentials: { client_email: gaClientEmail, private_key: gaPrivateKey } });
  }
} catch (e) {
  gaClient = null;
}

const formatGA4Date = (yyyymmdd) => {
  if (!yyyymmdd) return '';
  const y = yyyymmdd.substring(0, 4);
  const m = yyyymmdd.substring(4, 6);
  const d = yyyymmdd.substring(6, 8);
  const date = new Date(`${y}-${m}-${d}T00:00:00Z`);
  return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
};

const pickSourceColor = (source) => {
  const s = (source || '').toLowerCase();
  if (s.includes('direct')) return '#3B82F6';
  if (s.includes('organic')) return '#10B981';
  if (s.includes('social')) return '#F59E0B';
  if (s.includes('referral')) return '#EF4444';
  return '#6B7280';
};

const pickDeviceColor = (device) => {
  const d = (device || '').toLowerCase();
  if (d === 'mobile') return '#3B82F6';
  if (d === 'desktop') return '#10B981';
  if (d === 'tablet') return '#F59E0B';
  return '#6B7280';
};

const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};

app.get('/api/ga/basic', async (req, res) => {
  try {
    const timeRange = req.query.timeRange || '30';
    if (!gaClient || !gaPropertyId) {
      return res.status(200).json({ totalVisits: 0, uniqueVisitors: 0, pageViews: 0, avgSessionDuration: 0, bounceRate: 0, newUsers: 0, activeUsers: 0, eventCount: 0 });
    }
    const [report] = await gaClient.runReport({
      property: `properties/${gaPropertyId}`,
      dateRanges: [{ startDate: `${timeRange}daysAgo`, endDate: 'today' }],
      metrics: [
        { name: 'activeUsers' },
        { name: 'newUsers' },
        { name: 'sessions' },
        { name: 'totalUsers' },
        { name: 'screenPageViews' },
        { name: 'averageSessionDuration' },
        { name: 'bounceRate' },
        { name: 'eventCount' }
      ]
    });
    const row = report.rows?.[0];
    const v = (i) => Number(row?.metricValues?.[i]?.value || 0);
    return res.json({
      activeUsers: v(0),
      newUsers: v(1),
      totalVisits: v(2),
      uniqueVisitors: v(3),
      pageViews: v(4),
      avgSessionDuration: v(5),
      bounceRate: v(6),
      eventCount: v(7)
    });
  } catch (error) {
    console.error('GA basic error', { message: error.message });
    return res.status(200).json({ totalVisits: 0, uniqueVisitors: 0, pageViews: 0, avgSessionDuration: 0, bounceRate: 0, newUsers: 0, activeUsers: 0, eventCount: 0 });
  }
});

app.get('/api/ga/all', async (req, res) => {
  try {
    const timeRange = req.query.timeRange || '30';
    if (!gaClient || !gaPropertyId) {
      return res.status(200).json({ totalVisits: 0, uniqueVisitors: 0, pageViews: 0, avgSessionDuration: 0, bounceRate: 0, newUsers: 0, activeUsers: 0, eventCount: 0, dailyVisits: [], dailyActiveUsers: [], topPages: [], trafficSources: [], deviceStats: [] });
    }
    const startDate = `${timeRange}daysAgo`;
    const endDate = 'today';
    const basicPromise = gaClient.runReport({
      property: `properties/${gaPropertyId}`,
      dateRanges: [{ startDate, endDate }],
      metrics: [
        { name: 'activeUsers' },
        { name: 'newUsers' },
        { name: 'sessions' },
        { name: 'totalUsers' },
        { name: 'screenPageViews' },
        { name: 'averageSessionDuration' },
        { name: 'bounceRate' },
        { name: 'eventCount' }
      ]
    });
    const dailyPromise = gaClient.runReport({
      property: `properties/${gaPropertyId}`,
      dateRanges: [{ startDate, endDate }],
      dimensions: [{ name: 'date' }],
      metrics: [{ name: 'sessions' }]
    });
    const dailyActivePromise = gaClient.runReport({
      property: `properties/${gaPropertyId}`,
      dateRanges: [{ startDate, endDate }],
      dimensions: [{ name: 'date' }],
      metrics: [{ name: 'activeUsers' }]
    });
    const topPagesPromise = gaClient.runReport({
      property: `properties/${gaPropertyId}`,
      dateRanges: [{ startDate, endDate }],
      dimensions: [{ name: 'pagePath' }],
      metrics: [{ name: 'screenPageViews' }],
      orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }],
      limit: 5
    });
    const sourcesPromise = gaClient.runReport({
      property: `properties/${gaPropertyId}`,
      dateRanges: [{ startDate, endDate }],
      dimensions: [{ name: 'sessionDefaultChannelGroup' }],
      metrics: [{ name: 'sessions' }]
    });
    const devicesPromise = gaClient.runReport({
      property: `properties/${gaPropertyId}`,
      dateRanges: [{ startDate, endDate }],
      dimensions: [{ name: 'deviceCategory' }],
      metrics: [{ name: 'sessions' }]
    });
    const [basic, daily, dailyActive, topPages, sources, devices] = await Promise.all([basicPromise, dailyPromise, dailyActivePromise, topPagesPromise, sourcesPromise, devicesPromise]);
    const basicRow = basic[0].rows?.[0];
    const mv = (i) => Number(basicRow?.metricValues?.[i]?.value || 0);
    const dailyVisits = (daily[0].rows || []).map(r => ({
      date: formatGA4Date(r.dimensionValues?.[0]?.value),
      visits: Number(r.metricValues?.[0]?.value || 0)
    }));
    const dailyActiveUsers = (dailyActive[0].rows || []).map(r => ({
      date: formatGA4Date(r.dimensionValues?.[0]?.value),
      value: Number(r.metricValues?.[0]?.value || 0)
    }));
    const topPagesData = (topPages[0].rows || []).map(r => ({
      url: r.dimensionValues?.[0]?.value || '/',
      count: Number(r.metricValues?.[0]?.value || 0)
    }));
    const trafficSources = (sources[0].rows || []).map(r => ({
      source: r.dimensionValues?.[0]?.value || 'Direct',
      count: Number(r.metricValues?.[0]?.value || 0),
      color: pickSourceColor(r.dimensionValues?.[0]?.value)
    }));
    const deviceStats = (devices[0].rows || []).map(r => ({
      device: capitalize(r.dimensionValues?.[0]?.value || 'desktop'),
      count: Number(r.metricValues?.[0]?.value || 0),
      color: pickDeviceColor(r.dimensionValues?.[0]?.value)
    }));
    return res.json({
      activeUsers: mv(0),
      newUsers: mv(1),
      totalVisits: mv(2),
      uniqueVisitors: mv(3),
      pageViews: mv(4),
      avgSessionDuration: mv(5),
      bounceRate: mv(6),
      eventCount: mv(7),
      dailyVisits,
      dailyActiveUsers,
      topPages: topPagesData,
      trafficSources,
      deviceStats
    });
  } catch (error) {
    console.error('GA all error', { message: error.message });
    return res.status(200).json({ totalVisits: 0, uniqueVisitors: 0, pageViews: 0, avgSessionDuration: 0, bounceRate: 0, newUsers: 0, activeUsers: 0, eventCount: 0, dailyVisits: [], dailyActiveUsers: [], topPages: [], trafficSources: [], deviceStats: [] });
  }
});

app.get('/api/ga/realtime', async (req, res) => {
  try {
    if (!gaClient || !gaPropertyId) {
      return res.status(200).json({ activeUsersSeries: [], byCountry: [], topPages: [] });
    }
    const minutesReport = await gaClient.runRealtimeReport({
      property: `properties/${gaPropertyId}`,
      metrics: [{ name: 'activeUsers' }],
      dimensions: [{ name: 'minutesAgo' }]
    });
    const countryReport = await gaClient.runRealtimeReport({
      property: `properties/${gaPropertyId}`,
      metrics: [{ name: 'activeUsers' }],
      dimensions: [{ name: 'country' }]
    });
    let topPages = [];
    try {
      const pagesReport = await gaClient.runRealtimeReport({
        property: `properties/${gaPropertyId}`,
        metrics: [{ name: 'screenPageViews' }],
        dimensions: [{ name: 'unifiedScreenName' }],
        orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }],
        limit: 10
      });
      topPages = (pagesReport.rows || []).map(r => ({
        name: r.dimensionValues?.[0]?.value || '-',
        views: Number(r.metricValues?.[0]?.value || 0)
      }));
    } catch (_) {
      topPages = [];
    }
    const activeUsersSeries = (minutesReport.rows || []).map(r => ({
      minutesAgo: Number(r.dimensionValues?.[0]?.value || 0),
      activeUsers: Number(r.metricValues?.[0]?.value || 0)
    })).sort((a, b) => a.minutesAgo - b.minutesAgo);
    const byCountry = (countryReport.rows || []).map(r => ({
      country: r.dimensionValues?.[0]?.value || 'Unknown',
      activeUsers: Number(r.metricValues?.[0]?.value || 0)
    }));
    return res.json({ activeUsersSeries, byCountry, topPages });
  } catch (error) {
    console.error('GA realtime error', { message: error.message });
    return res.status(200).json({ activeUsersSeries: [], byCountry: [], topPages: [] });
  }
});
app.get('/api/ga/status', (req, res) => {
  res.json({
    gaReady: !!gaClient,
    propertyIdPresent: !!gaPropertyId,
    clientEmailPresent: !!gaClientEmail,
    privateKeyPresent: !!gaPrivateKey
  });
});
